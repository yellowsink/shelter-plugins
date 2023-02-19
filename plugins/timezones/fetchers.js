// causes fetches of bios and notes in discord

const {
	flux: { dispatcher },
	util: { getFiber, reactFiberWalker },
	ui: { injectCss },
	observeDom,
} = shelter;

const fetchedBios = new Set();
const fetchedNotes = new Set();
const fetchingNotes = new Map();

export async function forceBioFetch(el, uid) {
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

const startNotesFetch = (el, uid) =>
	new Promise((res) => {
		const node = reactFiberWalker(getFiber(el), "onMouseDown");
		if (!node?.memoizedProps?.onClick) return res();

		const unhide = injectCss("[class^=layerContainer-]{display:none}");

		node.memoizedProps.onClick(new MouseEvent(""));
		let done = false;

		const unobs = observeDom("[class^=userPopoutOuter]", (el) => {
			if (done) return;

			const foundUid = reactFiberWalker(getFiber(el), "user")?.memoizedProps
				?.user?.id;

			if (foundUid === uid) {
				done = true;
				unobs();
				res();

				requestAnimationFrame(() => {
					node.memoizedProps.onClick(new MouseEvent(""));
					requestAnimationFrame(unhide);
				});
			}
		});

		// dont leave hanging observes
		setTimeout(unobs, 1000);
	});

const finishNotesFetch = () =>
	new Promise(async (res) => {
		const cb = () => {
			res();
			dispatcher.unsubscribe("USER_NOTE_LOADED", cb);
		};

		dispatcher.subscribe("USER_NOTE_LOADED", cb);

		// dont leave hanging promises
		setTimeout(cb, 1000);
	});

export const forceNotesFetch = async (el, uid) => {
	if (fetchedNotes.has(uid)) return;

	if (fetchingNotes.has(uid)) await fetchingNotes.get(uid);
	else {
		const prom = startNotesFetch(el, uid).then(finishNotesFetch);

		fetchingNotes.set(uid, prom);

		await prom;
		fetchingNotes.delete(uid);
		fetchedNotes.add(uid);
	}
};
