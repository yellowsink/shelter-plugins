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
	// @ts-expect-error
	plugin: { store },
	flux: { storesFlat, dispatcher },
} = shelter;

store.stamp ??= true;
store.ignoreSpotify ??= true;

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
	date: string;
	nowPlaying: boolean;
	loved: boolean;
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
					state: `by ${activity.artist}`,
					application_id: DISCORD_APP_ID,
					timestamps: store.stamp
						? { start: ~~(Date.now() / 1000) }
						: undefined,
					assets: {
						large_image: await getAsset(activity.albumArt),
						large_text: activity.album && `on ${activity.album}`,
					},
			  }
			: null,
		socketId: "Last.fm@shelter",
	});

const getScrobble = async () => {
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
		date: lastTrack.date?.["#text"] ?? "now",
		nowPlaying: !!lastTrack["@attr"]?.nowplaying,
		loved: lastTrack.loved === "1",
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

	const lastTrack = await getScrobble();
	if (!lastTrack?.nowPlaying) return setPresence();

	if (lastTrack.url === lastUrl) return;
	lastUrl = lastTrack.url;

	let appName = store.appName || DEFAULT_NAME;
	for (const k in lastTrack)
		appName = appName.replaceAll(`{{${k}}}`, lastTrack[k]);

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
