(function() {

"use strict";

//#region plugins/usrbg/index.tsx
const { flux: { subscribe }, observeDom } = shelter.plugin.scoped;
const { getFiber, reactFiberWalker } = shelter.util;
const dbUrl = `https://cdn.jsdelivr.net/gh/Discord-Custom-Covers/usrbg@63fbbbe59880e284ff84d881c2f35413d5d5ae80/dist/usrbg.json`;
const db = fetch(dbUrl).then((r) => r.json()).then((raw) => {
	const m = new Map();
	for (const o of raw) m.set(o.uid, o.img);
	return m;
});
["TRACK"].forEach((t) => subscribe(t, onDispatch));
function onDispatch(payload) {
	if (payload.type === "TRACK" && payload.event !== "user_profile_action") return;
	const unobs = observeDom(`svg > foreignObject > [class*=banner]`, async (e) => {
		unobs();
		if (e.matches("[class*=bannerPremium]")) return;
		const user = reactFiberWalker(getFiber(e), "displayProfile", true)?.memoizedProps?.user;
		if (!user) return;
		const usrbg = (await db).get(user?.id);
		if (!usrbg) return;
		Object.assign(e.style, {
			"background-repeat": "no-repeat",
			"background-position": "center",
			"background-size": "cover",
			"background-image": `url(${usrbg})`
		});
	});
}

//#endregion
})();