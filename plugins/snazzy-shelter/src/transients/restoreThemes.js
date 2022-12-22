import fetchTheme from "../util/fetchTheme";
import { loadTheme, unloadAll } from "../util/themeLoadUtil";

const { plugin: {store}} = shelter;

export default () => {
	let cancel = false;

	if (store.themes)
		// there are a lot of promises happening here, but no real need to await them
		store.themes
			.filter((t) => t.enabled)
			.forEach((t) =>
				fetchTheme(t.url, t.repoUrl).then((ft) => cancel || loadTheme(ft))
			);

	return () => {
		unloadAll();
		cancel = true;
	};
};