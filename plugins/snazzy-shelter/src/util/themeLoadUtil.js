// SOURCE https://github.com/sink-cord-archive/cc-plugins/blob/master/plugins/cumstain/util/themeLoadUtil.js

const {
	ui: { injectCss },
	plugin: { store },
} = shelter;

const unpatchCache = new Map();

export async function loadTheme(theme) {
	if (!theme?.url || !(await theme.CSS()))
		throw new Error("theme was missing either id or css.");

	const unpatch = injectCss(await theme.CSS());
	unpatchCache.set(theme.url, unpatch);

	const themeCacheIndex = store.themes.findIndex((t) => t.url === theme.url);

	let toPush = { ...theme };
	delete toPush.CSS;
	toPush.enabled = true;

	if (themeCacheIndex === -1) store.themes = [...store.themes, toPush];
	else store.themes[themeCacheIndex] = toPush;

	// trigger set event
	//store.themes = store.themes;
}

export function unloadTheme(theme) {
	if (!theme?.url) throw new Error("theme was missing id.");

	const unpatch = unpatchCache.get(theme.url);

	unpatch?.();
	unpatchCache.delete(theme.url);

	const themeCacheIndex = store.themes.findIndex((t) => t.url === theme.url);
	let toPush = { ...theme };
	toPush.enabled = false;
	if (themeCacheIndex === -1) store.themes = [...store.themes, toPush];
	else store.themes[themeCacheIndex] = toPush;

	// trigger set event
	// store.themes = store.themes;
}

export function removeTheme(theme) {
	try {
		unloadTheme(theme);
	} catch (e) {
		if (e.message !== "theme was not loaded.") throw e;
	}

	store.themes = store.themes.filter((t) => t.url !== theme.url);
}

export async function reloadTheme(theme) {
	const unpatch = unpatchCache.get(theme.url);
	unpatch?.(await theme.CSS());

	let toPush = { ...theme };
	toPush.enabled = true;
	const themeCacheIndex = store.themes.findIndex((t) => t.url === theme.url);
	if (themeCacheIndex === -1) return;
	else store.themes[themeCacheIndex] = toPush;

	// trigger set event
	//store.themes = store.themes;
}

export function unloadAll() {
	unpatchCache.forEach((unpatch) => unpatch?.());
	unpatchCache.clear();
}
