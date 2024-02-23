import { injectLocalTime, preflightInjection } from "./tzInjection";
import { injectAbsoluteTime, preflightAbsoluteTime } from "./absInjection";

const {
	plugin: { store },
	flux: { dispatcher },
	observeDom,
	util: { getFiber, reactFiberWalker },
} = shelter;

store.tz ??= true;
store.tzdb ??= true;
store.abs ??= false;
store.absUtc ??= false;
store.savedTzs ??= {};

async function injectTimestamp(el) {
	const shouldInjectTz = store.tz && preflightInjection(el);
	const shouldInjectAbs = store.abs && preflightAbsoluteTime(el);

	if (!shouldInjectTz && !shouldInjectAbs) return;

	const msg = reactFiberWalker(getFiber(el), "message", true)?.memoizedProps
		?.message;

	const date = msg?.timestamp;
	if (!date) return;

	if (shouldInjectAbs) injectAbsoluteTime(el, new Date(date));
	if (shouldInjectTz) await injectLocalTime(msg, el, new Date(date));
}

function onDispatch() {
	// if neither of our tweaks are enabled why are we even goddamn here?
	if (!store.tz && !store.abs) return;

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

export { default as settings } from "./ui";
