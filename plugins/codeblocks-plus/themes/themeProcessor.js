import { BUNDLED_THEMES } from "shiki-es";

const processThemeName = (n) =>
	n
		.split("-")
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(" ");

const processTheme = (t) => ({ name: processThemeName(t), url: t });

export const includedThemes = BUNDLED_THEMES.map(processTheme);

export const defaultTheme = processTheme("github-dark");

export const currentTheme = () =>
	shelter.plugin.store.theme ?? defaultTheme.url;
