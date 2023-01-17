import { findTimeZone } from "./timezones";

const {
	flux: { dispatcher, stores },
	observeDom,
	util: { getFiber, reactFiberWalker },
} = shelter;

const extractTimezone = (userId, guildId) =>
	findTimeZone(stores.UserProfileStore.getUserProfile(userId)?.bio) ??
	findTimeZone(
		stores.UserProfileStore.getGuildMemberProfile(userId, guildId)?.bio,
	) ??
	findTimeZone(stores.NoteStore.getNote(userId)?.note);

function injectTimestamp(el) {
	if (el.parentElement.querySelector(".ys_tz")) return;

	const msg = reactFiberWalker(getFiber(el), "message", true)?.memoizedProps
		?.message;

	const date = msg?.timestamp?.clone();

	if (!date) return;

	const oset = extractTimezone(
		msg.author.id,
		stores.ChannelStore.getChannel(msg.channel_id)?.guild_id,
	);

	// todo: force a bio fetch... somehow...

	// todo: replace with !oset
	if (oset === undefined) return;

	date.utc();
	date.hours(date.hours() + oset);

	// only add our annotation if within a day
	const millisecondsPassed = Date.now() - Date.parse(date.toISOString());
	if (millisecondsPassed > 1000 * 60 * 60 * 24) return;

	el.parentElement.append(
		<time class="ys_tz">
			{" "}
			(Theirs: {date.hours()}:{date.minutes()})
		</time>,
	);
}

function onDispatch() {
	const unObserve = observeDom("h3 time[id^=message-timestamp]", (el) => {
		unObserve();
		injectTimestamp(el);
	});

	setTimeout(unObserve, 500);
}

const TRIGGERS = [
	"MESSAGE_CREATE",
	"CHANNEL_SELECT",
	"LOAD_MESSAGES_SUCCESS",
	"UPDATE_CHANNEL_DIMENSIONS",
	"MESSAGE_END_EDIT",
	"MESSAGE_UPDATE",
	// if we trigger a "USER_PROFILE_FETCH_START", listen for results
	//"USER_PROFILE_FETCH_SUCCESS"
];

TRIGGERS.forEach((t) => dispatcher.subscribe(t, onDispatch));

export const onUnload = () =>
	TRIGGERS.forEach((t) => dispatcher.unsubscribe(t, onDispatch));
