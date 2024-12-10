import {
	ACTIVITY_TYPE_LISTENING,
	DEFAULT_INTERVAL,
	DEFAULT_NAME,
	DISCORD_APP_ID,
	LFM_API_KEY,
} from "./cfg";
import { getAsset } from "./assets";
import { LbWebsocket } from "./listenbrainz";
import { FluxStore } from "@uwu/shelter-defs";

const {
	plugin: { store },
	flux: { storesFlat, dispatcher },
} = shelter;

store.stamp ??= true;
store.ignoreSpotify ??= true;
store.service ??= "lfm";
store.lbLookup ??= true;
store.alwaysShare ??= false;

const UserStore = storesFlat.UserStore as FluxStore<{
	getCurrentUser(): { id: string };
}>;

const PresenceStore = storesFlat.PresenceStore as FluxStore<{
	getActivities(id: string): {
		type: number;
		application_id: string;
	}[];
}>;

export interface Track {
	name: string;
	artist: string;
	album: string;
	albumArt?: string;
	url: string;
	//date: string;
	nowPlaying: boolean;
}

const setPresence = async (name = "", activity?: Track, start?: number) =>
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
					timestamps: store.stamp ? { start } : undefined,
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

	return {
		name: lastTrack.name,
		artist: lastTrack.artist.name,
		album: lastTrack.album["#text"],
		albumArt: lastTrack.image[3]["#text"],
		url: lastTrack.url,
		//date: lastTrack.date?.["#text"] ?? "now",
		nowPlaying: !!lastTrack["@attr"]?.nowplaying,
	} as Track;
};

const isSpotifyPlaying = () => {
	for (const activity of PresenceStore.getActivities(
		UserStore.getCurrentUser().id,
	))
		if (
			activity?.type === ACTIVITY_TYPE_LISTENING &&
			activity.application_id !== DISCORD_APP_ID
		)
			return true;
	return false;
};

let lastUrl: string;
let startTimestamp: number;

const handleNewStatus = (track: Track) => {
	if (!store.user) return setPresence();

	if (store.ignoreSpotify && isSpotifyPlaying()) return setPresence();

	if (!track?.nowPlaying) {
		startTimestamp = null;
		return setPresence();
	}

	if (track.url !== lastUrl || !startTimestamp) {
		startTimestamp = Date.now();
	}

	lastUrl = track.url;

	let appName = store.appName || DEFAULT_NAME;
	// screw it theres nothing wrong with eval okay???
	// obviously im not serious on that but really this is fine -- sink
	appName = appName.replaceAll(/{{(.+)}}/g, (_, code) =>
		eval(`(c)=>{with(c){try{return ${code}}catch(e){return e}}}`)(track),
	);

	return setPresence(appName, track, startTimestamp);
};

const updateStatusInterval = async () => {
	if (!store.user) return setPresence();

	if (store.ignoreSpotify && isSpotifyPlaying()) return setPresence();

	/*const getFn =
		store.service === "lbz" ? getScrobbleListenbrainz : getScrobbleLastfm;

	await handleNewStatus(await getFn());*/

	// listenbrainz is handled by the websocket
	if (store.service !== "lbz") await handleNewStatus(await getScrobbleLastfm());
};

let interval: number;
const restartLoop = () => (
	interval && clearInterval(interval),
	(interval = setInterval(
		updateStatusInterval,
		store.interval || DEFAULT_INTERVAL,
	))
);

const unpatch = shelter.patcher.after(
	"getActivities",
	shelter.flux.stores.LocalActivityStore,
	(_, res) => {
		if (!store.alwaysShare) return;
		res.filter = function (predicate) {
			if (!predicate.toString().includes("shouldShowActivity")) {
				return Array.prototype.filter.call(this, predicate);
			}
			return Array.prototype.filter.call(this, (event) => {
				if (event?.type === 2 && event.application_id === DISCORD_APP_ID) {
					return true;
				}
				return predicate(event);
			});
		};
		return res;
	},
);

// start polling for last.fm
restartLoop();

// start listenbrainz websocket, which will handle lifecycle all on its own.
const lbSocket = new LbWebsocket(handleNewStatus);

export const onUnload = () => (
	clearInterval(interval), setPresence(), unpatch(), lbSocket.tearDownSocket()
);

export * from "./Settings";
