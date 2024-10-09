import { parseTimeZone, formatAsIs, formatInTimeZone } from "./timezones";
import { fetchTimezone } from "./tzdb";

const {
	plugin: { store },
	flux: { storesFlat },
	util: { getFiber, reactFiberWalker },
} = shelter;

const fetchedBios = new Map();

async function forceBioFetch(el, uid) {
	const fetchedProm = fetchedBios.get(uid);
	if (fetchedProm) return fetchedProm;

	const node = reactFiberWalker(
		getFiber(el),
		(f) => f.stateNode?.handlePreload,
		true,
	)?.stateNode;

	if (!node) return;

	const prom = node.handlePreload();
	fetchedBios.set(uid, prom);
	return prom;
}

const extractTimezone = (userId, guildId) =>
	parseTimeZone(storesFlat.UserProfileStore.getUserProfile(userId)?.bio) ??
	parseTimeZone(
		storesFlat.UserProfileStore.getGuildMemberProfile(userId, guildId)?.bio,
	);

// this is stupid
const injectionMutex = new Set();

export const preflightInjection = (el) =>
	!el.parentElement.querySelector(".ys_tz") && !injectionMutex.has(el);

async function getTimezone(el, msg) {
	const savedTz = parseTimeZone(store.savedTzs[msg.author.id]);
	if (savedTz) return savedTz;

	if (store.tzdb) {
		const fetched = await fetchTimezone(msg.author.id);
		if (fetched !== undefined) return { base: fetched };
	}

	await forceBioFetch(
		el.parentElement.parentElement.querySelector("[id^=message-username]")
			.firstElementChild,
		msg.author.id,
	);

	return extractTimezone(
		msg.author.id,
		storesFlat.ChannelStore.getChannel(msg.channel_id)?.guild_id,
	);
}

export async function injectLocalTime(msg, el, date) {
	injectionMutex.add(el);
	const timezone = await getTimezone(el, msg);
	injectionMutex.delete(el);

	if (!timezone) return;

	const origFmt = formatAsIs(date, "%H:%M");
	const tzFmtNormal = formatInTimeZone(date, timezone, "%H:%M");

	// don't show local time for those in your own TZ
	if (origFmt === tzFmtNormal) return;

	// show in the user's preferred format
	const tzFmt = !store.rfmt
		? tzFmtNormal
		: formatInTimeZone(date, timezone, store.rfmt);

	el.parentElement.append(<time class="ys_tz"> (Theirs: {tzFmt})</time>);
}
