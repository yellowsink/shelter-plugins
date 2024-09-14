import { forceBioFetch } from "./biofetcher";

const {
	flux: { dispatcher },
	observeDom,
	util: { getFiber, reactFiberWalker },
	ui: { Space },
} = shelter;

import { fetchPronouns, fromStore } from "./db.js";

// I love async!
const patchedEls = new WeakSet<Element>();

async function inject(el) {
	//if (el.parentElement.querySelector('[data-ys-prdb]')) return;
	if (patchedEls.has(el)) return;
	patchedEls.add(el);

	const authorId = reactFiberWalker(getFiber(el), "message", true)?.pendingProps
		?.message?.author?.id;
	if (!authorId) return;

	let pronouns = await fetchPronouns(authorId);
	if (!pronouns) {
		await forceBioFetch(
			el.parentElement.parentElement.querySelector("[id^=message-username]")
				.firstElementChild,
			authorId,
		);
		pronouns = fromStore(authorId);
	}

	if (!pronouns) pronouns = "Unspecified";

	el.insertAdjacentElement(
		"beforebegin",
		(
			<span>
				<Space />
				{pronouns} •
				<Space />
			</span>
		) as HTMLSpanElement,
	);
}

function onDispatch() {
	const unObserve = observeDom("h3 time[id^=message-timestamp]", (el) => {
		unObserve();
		inject(el);
	});

	setTimeout(unObserve, 500);
}

const TRIGGERS = [
	"MESSAGE_CREATE",
	"CHANNEL_SELECT",
	"UPDATE_CHANNEL_DIMENSIONS",
	"MESSAGE_UPDATE",
];

TRIGGERS.forEach((t) => dispatcher.subscribe(t, onDispatch));

export const onUnload = () =>
	TRIGGERS.forEach((t) => dispatcher.unsubscribe(t, onDispatch));
