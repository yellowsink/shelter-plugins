import { findTimeZone } from "./timezones";
import { fetchTimezone } from "./tzdb";
import forceBioFetch from "./forceBioFetch";

const {
	plugin: { store },
	flux: { stores },
} = shelter;

const extractTimezone = (userId, guildId) =>
	findTimeZone(stores.UserProfileStore.getUserProfile(userId)?.bio) ??
	findTimeZone(
		stores.UserProfileStore.getGuildMemberProfile(userId, guildId)?.bio,
	);

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
