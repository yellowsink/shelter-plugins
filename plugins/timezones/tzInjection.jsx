import { findTimeZone } from "./timezones";
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

	node.handlePreload();
	fetchedBios.add(uid);
}

const extractTimezone = (userId, guildId) =>
	findTimeZone(stores.UserProfileStore.getUserProfile(userId)?.bio) ??
	findTimeZone(
		stores.UserProfileStore.getGuildMemberProfile(userId, guildId)?.bio,
	) ??
	findTimeZone(stores.NoteStore.getNote(userId)?.note);

// this is stupid
const injectionMutex = new Set();

export const preflightInjection = (el) =>
	!el.parentElement.querySelector(".ys_tz") && !injectionMutex.has(el);

async function getTimezone(el, msg) {
	if (store.tzdb) {
		const fetched = await fetchTimezone(msg.author.id);
		if (fetched !== undefined) return fetched;
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
	const oset = await getTimezone(el, msg);
	injectionMutex.delete(el);

	if (!oset) return;

	date.utc();
	date.hours(date.hours() + oset);

	// only add our annotation if within a day
	const millisecondsPassed = Date.now() - Date.parse(date.toISOString());
	if (millisecondsPassed > 1000 * 60 * 60 * 24) return;

	el.parentElement.append(
		<time class="ys_tz"> (Theirs: {date.format("HH:mm")})</time>,
	);
}
