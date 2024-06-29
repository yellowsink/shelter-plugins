const {
	flux: { subscribe },
	observeDom,
} = shelter.plugin.scoped;

const { getFiber, reactFiberWalker } = shelter.util;

// todo: did this move? or is it just dead forever?
const dbUrl = `https://cdn.jsdelivr.net/gh/Discord-Custom-Covers/usrbg@63fbbbe59880e284ff84d881c2f35413d5d5ae80/dist/usrbg.json`;

const db = fetch(dbUrl)
	.then((r) => r.json())
	.then((raw) => {
		const m = new Map<string, string>();
		for (const o of raw) m.set(o.uid, o.img);

		return m;
	});

["TRACK"].forEach((t) => subscribe(t, onDispatch));

function onDispatch(payload) {
	if (payload.type === "TRACK" && payload.event !== "user_profile_action")
		return;

	// user popouts
	const unobs = observeDom(
		`svg > foreignObject > [class*=banner]`,
		async (e) => {
			unobs();

			// ignore users with a custom nitro banner
			if (e.matches("[class*=bannerPremium]")) return;

			// get user
			const user = reactFiberWalker(getFiber(e), "displayProfile", true)
				?.memoizedProps?.user;
			if (!user) return;

			// get bg
			const usrbg = (await db).get(user?.id);
			if (!usrbg) return;

			// apply bg
			Object.assign(e.style, {
				"background-repeat": "no-repeat",
				"background-position": "center",
				"background-size": "cover",
				"background-image": `url(${usrbg})`,
			});
		},
	);
}
