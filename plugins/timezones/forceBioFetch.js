// causes fetches of bios in discord

const {
	util: { getFiber, reactFiberWalker },
} = shelter;

const fetchedBios = new Set();

export default async (el, uid) => {
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
};
