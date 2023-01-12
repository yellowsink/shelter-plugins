import { BUNDLED_LANGUAGES, BUNDLED_THEMES, getHighlighter } from "shiki-es";

export const [highlighter] = shelter.solid.createResource(() =>
	getHighlighter({
		themes: BUNDLED_THEMES,
		langs: BUNDLED_LANGUAGES,
	}),
);
