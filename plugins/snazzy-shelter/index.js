import defaultRepos from "./src/defaultRepos";
import quickCSS from "./src/transients/quickCSS";
import restoreThemes from "./src/transients/restoreThemes";
import exposeApi from "./src/transients/exposeApi";
import settingsEntry from "./src/transients/settingsEntry";

import css from "./src/styles.sass";

const {
	plugin: { store },
	ui: { injectCss }
} = shelter;

if (!Array.isArray(store.repos)) defaultRepos();

if (!Array.isArray(store.themes)) store.themes = [];

// transients: ran at start and live until plugin unloaded
// in *sink cumcord plugin architecture* terminology, these are patches.

const transients = [
	quickCSS(),
	restoreThemes(),
	exposeApi(),
	settingsEntry(),
	injectCss(css)
];

export const onUnload = () => _.forEachRight(transients, (p) => p());
