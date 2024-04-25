import {
	ACTIVITY_TYPE_LISTENING,
	DEFAULT_INTERVAL,
	DEFAULT_NAME,
	DISCORD_APP_ID,
	IGNORED_COVERS,
	LFM_API_KEY,
} from "./cfg";
import { getAsset } from "./assets";
import { FluxStore } from "@uwu/shelter-defs";

const {
	plugin: { store },
	flux: { storesFlat, dispatcher },
} = shelter;

store.stamp ??= true;
store.ignoreSpotify ??= true;
store.service ??= "lfm";
store.lbLookup ??= true;

const UserStore = storesFlat.UserStore as FluxStore<{
	getCurrentUser(): { id: string };
}>;

const PresenceStore = storesFlat.PresenceStore as FluxStore<{
	getActivities(id: string): {
		type: number;
		application_id: string;
	}[];
}>;

interface Track {
	name: string;
	artist: string;
	album: string;
	albumArt?: string;
	url: string;
	//date: string;
	nowPlaying: boolean;
}

const setPresence = async (name = "", activity?: Track) =>
	dispatcher.dispatch({
		type: "LOCAL_ACTIVITY_UPDATE",
		activity: activity
			? {
					name,
					//flags: 1,
					type: 2,
					details: activity.name,
					state: activity.artist,
					application_id: DISCORD_APP_ID,
					timestamps: store.stamp
						? { start: ~~(Date.now() / 1000) }
						: undefined,
					assets: {
						large_image:
							activity.albumArt && (await getAsset(activity.albumArt)),
						large_text: activity.album,
					},
			  }
			: null,
		socketId: "Last.fm@shelter",
	});

const getScrobbleLastfm = async () => {
	const params = new URLSearchParams({
		method: "user.getrecenttracks",
		user: store.user,
		api_key: LFM_API_KEY,
		format: "json",
		limit: "1",
		extended: "1",
	});

	const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`);
	if (!res.ok) return;

	const lastTrack = (await res.json())?.recenttracks?.track?.[0];
	if (!lastTrack) return;

	const aart = lastTrack.image[3]["#text"];

	return {
		name: lastTrack.name,
		artist: lastTrack.artist.name,
		album: lastTrack.album["#text"],
		albumArt: IGNORED_COVERS.includes(aart) ? undefined : aart,
		url: lastTrack.url,
		//date: lastTrack.date?.["#text"] ?? "now",
		nowPlaying: !!lastTrack["@attr"]?.nowplaying,
	} as Track;
};

// finds a MBID and adds it to a track if it doesnt exist
const listenBrainzLookupAdditional = async (basicTrack) => {
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
			{
				headers: {
					"X-Shprox-UA":
						"ShelterLastFm/0.0.0 ( https://github.com/yellowsink/shelter-plugins )",
				},
			},
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

const getScrobbleListenbrainz = async () => {
	// use the shelter proxy to set the user agent as required by musicbrainz
	const nowPlayingRes = await fetch(
		`https://shcors.uwu.network/https://api.listenbrainz.org/1/user/${store.user}/playing-now`,
		{
			headers: {
				"X-Shprox-UA":
					"ShelterLastFm/0.0.0 ( https://github.com/yellowsink/shelter-plugins )",
			},
		},
	).then((r) => r.json());

	if (!nowPlayingRes.payload.count) return;

	const track = nowPlayingRes.payload.listens[0].track_metadata;

	await listenBrainzLookupAdditional(track);

	let albumArtUrl = !track.additional_info?.release_mbid
		? undefined
		: `https://coverartarchive.org/release/${track.additional_info.release_mbid}/front`;
	if (albumArtUrl) {
		// test
		const testRes = await fetch(albumArtUrl);
		if (!testRes.redirected) albumArtUrl = undefined;
	}

	return {
		name: track.track_name,
		artist: track.artist_name,
		album: track.release_name,
		albumArt: albumArtUrl,
		url: track.additional_info?.recording_mbid
			? `https://musicbrainz.org/recording/${track.additional_info.recording_mbid}`
			: `NOURL_${track.track_name}:${track.artist_name}:${track.release_name}`,
		//date: "now", // not returned by api
		nowPlaying: nowPlayingRes.payload.listens[0].playing_now,
	} as Track;
};

let lastUrl: string;

const updateStatus = async () => {
	if (!store.user) return setPresence();

	if (store.ignoreSpotify)
		for (const activity of PresenceStore.getActivities(
			UserStore.getCurrentUser().id,
		))
			if (
				activity?.type === ACTIVITY_TYPE_LISTENING &&
				activity.application_id !== DISCORD_APP_ID
			)
				return setPresence();

	const getFn =
		store.service === "lbz" ? getScrobbleListenbrainz : getScrobbleLastfm;

	const lastTrack = await getFn();
	if (!lastTrack?.nowPlaying) return setPresence();

	if (lastTrack.url === lastUrl) return;
	lastUrl = lastTrack.url;

	let appName = store.appName || DEFAULT_NAME;
	// screw it theres nothing wrong with eval okay???
	// obviously im not serious on that but really this is fine -- sink
	appName = appName.replaceAll(/{{(.+)}}/g, (_, code) =>
		eval(`(c)=>{with(c){try{return ${code}}catch(e){return e}}}`)(lastTrack),
	);

	await setPresence(appName, lastTrack);
};

let interval;
const restartLoop = () => (
	interval && clearInterval(interval),
	(interval = setInterval(updateStatus, store.interval || DEFAULT_INTERVAL))
);

restartLoop();
export const onUnload = () => (clearInterval(interval), setPresence());

export * from "./Settings";
