import defaultRepos from "./src/defaultRepos";
import quickCSS from "./src/transients/quickCSS";
import restoreThemes from "./src/transients/restoreThemes";
import exposeApi from "./src/transients/exposeApi";
import settingsEntry from "./src/transients/settingsEntry";

import css from "./src/styles.sass";

import forEachRight from "lodash-es/forEachRight";

const {
	plugin: { store },
	ui: { injectCss },
} = shelter;

if (!Array.isArray(store.repos)) defaultRepos();

if (!Array.isArray(store.themes)) store.themes = [];

// migration from when snazzy-shelter was just a quickcss
// not a port of cumstain
if (store.css) {
	if (!store.quickCSS) store.quickCSS = store.css;

	delete store.css;
}

// transients: ran at start and live until plugin unloaded
// in *sink cumcord plugin architecture* terminology, these are patches.

const transients = [
	quickCSS(),
	restoreThemes(),
	exposeApi(),
	settingsEntry(),
	injectCss(css),
];

export const onUnload = () => forEachRight(transients, (p) => p());
