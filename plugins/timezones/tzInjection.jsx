import { parseTimeZone, formatAsIs, formatInTimeZone } from "./timezones";
import { fetchTimezone } from "./tzdb";

const {
	plugin: { store },
	flux: { stores },
	util: { getFiber, reactFiberWalker },
} = shelter;

const fetchedBios = new Set();

async function forceBioFetch(el, uid) {
	if (fetchedBios.has(uid)) return;

	const node = reactFiberWalker(
		getFiber(el),
		(f) => f.stateNode?.handlePreload,
		true,
	)?.stateNode;

	if (!node) return;

	const prom = node.handlePreload();
	fetchedBios.add(uid);
	return prom;
}

const extractTimezone = (userId, guildId) =>
	parseTimeZone(store.savedTzs[userId]) ??
	parseTimeZone(stores.UserProfileStore.getUserProfile(userId)?.bio) ??
	parseTimeZone(
		stores.UserProfileStore.getGuildMemberProfile(userId, guildId)?.bio,
	);

// this is stupid
const injectionMutex = new Set();

export const preflightInjection = (el) =>
	!el.parentElement.querySelector(".ys_tz") && !injectionMutex.has(el);

async function getTimezone(el, msg) {
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
		stores.ChannelStore.getChannel(msg.channel_id)?.guild_id,
	);
}

export async function injectLocalTime(msg, el, date) {
	injectionMutex.add(el);
	const timezone = await getTimezone(el, msg);
	injectionMutex.delete(el);

	if (!timezone) return;

	const origFmt = formatAsIs(date, "%H:%M");
	const tzFmt = formatInTimeZone(date, timezone, "%H:%M");

	// don't show local time for those in your own TZ
	if (origFmt === tzFmt) return;

	el.parentElement.append(<time class="ys_tz"> (Theirs: {tzFmt})</time>);
}
