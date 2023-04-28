// copied from timezones/tzInjection.jsx

const { reactFiberWalker, getFiber } = shelter.util;

const fetchedBios = new Map<string, Promise<unknown>>();

export async function forceBioFetch(el, uid) {
	const fetchedProm = fetchedBios.get(uid);
	if (fetchedProm) return fetchedProm;

	const node = reactFiberWalker(
		getFiber(el),
		(f) => (f.stateNode as any)?.handlePreload,
		true,
	)?.stateNode as any;

	if (!node) return;

	const prom = node.handlePreload();
	fetchedBios.set(uid, prom);
	return prom;
}
