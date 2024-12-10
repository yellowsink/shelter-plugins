import type { Track } from "./index";
import memoize from "lodash-es/memoize";
import { io, Socket } from "socket.io-client";

const { store } = shelter.plugin;

const { createEffect, createRoot } = shelter.solid;

const FETCH_SHPROX_UA_HEADER = {
	"X-Shprox-UA":
		"ShelterLastFm/0.0.0 ( https://github.com/yellowsink/shelter-plugins )",
};

// finds a MBID and adds it to a track if it doesnt exist
export const listenBrainzLookupAdditional = async (basicTrack) => {
	// following the behaviour of the webapp, if theres not an MBID, do a search.
	if (!store.lbLookup) return;
	if (basicTrack.additional_info?.release_mbid) return;

	try {
		const metaRes = await fetch(
			`https://shcors.uwu.network/https://api.listenbrainz.org/1/metadata/lookup/?${new URLSearchParams(
				{
					recording_name: basicTrack.track_name,
					artist_name: basicTrack.artist_name,
					metadata: "true",
					inc: "artist tag release",
				},
			)}`,
			{ headers: FETCH_SHPROX_UA_HEADER },
		).then((r) => r.json());

		basicTrack.additional_info = { ...basicTrack?.additional_info, ...metaRes };
	} catch (e) {
		console.error(
			"SHELTER LASTFM: finding listenbrainz MBID for track",
			basicTrack,
			"failed, ",
			e,
		);
	}
};

export const listenBrainzAlbumArtLookup = async (track) => {
	let albumArtUrl: string;

	if (track.additional_info?.release_mbid) {
		// first check for release art and then for release group art
		const relArtCheck = await fetch(
			`https://coverartarchive.org/release/${track.additional_info?.release_mbid}/front`,
			{ method: "HEAD", redirect: "manual" },
		);
		if (relArtCheck.status !== 404) {
			// ok fine we have album art for this release
			albumArtUrl = `https://aart.yellows.ink/release/${track.additional_info.release_mbid}.webp`;
		} else {
			// okay, get the release group
			const rgLookup = await fetch(
				`https://shcors.uwu.network/https://musicbrainz.org/ws/2/release/${track.additional_info.release_mbid}?fmt=json&inc=release-groups`,
				{ headers: FETCH_SHPROX_UA_HEADER },
			);
			if (rgLookup.ok) {
				const releaseJson = await rgLookup.json();

				albumArtUrl = `https://aart.yellows.ink/release-group/${releaseJson["release-group"].id}.webp`;
			}
		}
	}

	if (albumArtUrl) {
		// test
		const testRes = await fetch(albumArtUrl, { method: "HEAD" });
		if (!testRes.ok) albumArtUrl = undefined;
	}

	return albumArtUrl;
};

// don't repeat lookups for songs we've already seen before.
// it'd be more efficient to use the lastUrl test from the other file we have but that's annoying so lol this works

const cacheKeySel = (song) =>
	`${song.track_name}|${song.artist_name}|${song.release_name}`;

const additionalMemoized = memoize(listenBrainzLookupAdditional, cacheKeySel);

const aartMemoized = memoize(listenBrainzAlbumArtLookup, cacheKeySel);

const lbResToTrack = (res, aart: string, playNow) =>
	({
		name: res.track_name,
		artist: res.artist_name,
		album: res.release_name,
		albumArt: aart,
		url: res.additional_info?.recording_mbid
			? `https://musicbrainz.org/recording/${res.additional_info.recording_mbid}`
			: `NOURL_${res.track_name}:${res.artist_name}:${res.release_name}`,
		//date: "now", // not returned by api
		nowPlaying: playNow,
	}) as Track;

const getScrobbleListenbrainz = async () => {
	// use the shelter proxy to set the user agent as required by musicbrainz
	const nowPlayingRes = await fetch(
		`https://shcors.uwu.network/https://api.listenbrainz.org/1/user/${store.user}/playing-now`,
		{ headers: FETCH_SHPROX_UA_HEADER },
	).then((r) => r.json());

	if (!nowPlayingRes?.payload?.count) return;

	const track = nowPlayingRes.payload.listens[0].track_metadata;

	await additionalMemoized(track);

	const albumArtUrl = await aartMemoized(track);

	return lbResToTrack(
		track,
		albumArtUrl,
		nowPlayingRes.payload.listens[0].playing_now,
	);
};

export class LbWebsocket {
	#socket: Socket;
	#pendingSocket: Socket;
	#lastUsername: string;

	#dispose: () => void;

	handler: (t: Track) => void;

	constructor(handler: (t: Track) => void) {
		this.handler = handler;

		createRoot((DISPOSE) => {
			this.#dispose = DISPOSE;

			createEffect(() => {
				const nextUser = store.user?.toLowerCase?.();

				if (store.service !== "lbz") this.tearDownSocket(false);
				else if (
					this.#lastUsername !== nextUser ||
					(!this.#socket && !this.#pendingSocket)
				) {
					//this.#startSocket(nextUser);

					// we won't get the current state, just future updates, so also do an imperative lookup
					// this also lets us check the user is correct before starting a socket
					getScrobbleListenbrainz()
						.then(this.handler)
						.then(() => this.#startSocket(nextUser));
				}
			});
		});
	}

	#startSocket(nextUser: string) {
		// lol this'll be fun when typing into the username box!
		if (this.#pendingSocket) this.#pendingSocket.close();

		// have to force ws only as polling won't proxy nicely.
		this.#pendingSocket = io("https://shcors.uwu.network", {
			path: "/https://listenbrainz.org/socket.io",
			transports: ["websocket"],
		});
		this.#pendingSocket.on("connect", () => this.#onConnect(nextUser));
		this.#pendingSocket.on("playing_now", (pn) => this.#playingNowHandler(pn));
	}

	#onConnect(nextUser: string) {
		// replace the old socket
		this.#socket?.close();
		this.#socket = this.#pendingSocket;
		this.#pendingSocket = undefined;
		this.#lastUsername = nextUser;

		// tell listenbrainz which user we care about
		this.#socket.emit("json", { user: nextUser });
	}

	async #playingNowHandler(pn) {
		const res = JSON.parse(pn);
		const playingNowObject = res?.track_metadata;
		if (!playingNowObject) return;

		// do extra meta lookup and album art lookup
		await additionalMemoized(playingNowObject);
		const albumArt = await aartMemoized(playingNowObject);

		// send resolved object onto handler for whatever is necessary
		this.handler?.(lbResToTrack(playingNowObject, albumArt, res.playing_now));
	}

	tearDownSocket(dispose = true) {
		this.#socket?.close();
		this.#pendingSocket?.close();

		this.#socket = undefined;
		this.#pendingSocket = undefined;

		if (dispose) this.#dispose?.();
	}
}
