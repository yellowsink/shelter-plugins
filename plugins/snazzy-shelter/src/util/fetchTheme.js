// SOURCE https://github.com/sink-cord-archive/cc-plugins/blob/master/plugins/cumstain/util/fetchTheme.js

import extractMeta from "./bdMetaParser";
import { fetchText, fetchJson } from "./cachingFetcher";

async function getBdTheme(url, repoUrl) {
	const actualUrl = new URL(url, repoUrl).href;

	const [status, CSS] = await fetchText(actualUrl);

	if (status !== 200)
		throw new Error(`BD theme existed in cache with non-200 status ${status}`);

	return {
		url: actualUrl,
		CSS: () => Promise.resolve(CSS),
		compat: true,
		repoUrl,
		...extractMeta(CSS),
	};
}

async function getCcTheme(url, repoUrl) {
	const actualUrl = new URL(url, repoUrl).href;

	let splitPath = new URL(url, repoUrl).pathname.split("/");
	splitPath.splice(splitPath.length - 1, 1, "cumcord_theme.json");
	const manifestUrl = new URL(splitPath.join("/"), new URL(url, repoUrl).origin)
		.href;

	const [status, manifest] = await fetchJson(manifestUrl);

	if (status !== 200)
		throw new Error(
			`CC manifest existed in cache with non-200 status ${status}`
		);

	return {
		url: actualUrl,
		compat: false,
		...manifest,
		repoUrl,

		CSS: async () => {
			const [status, css] = await fetchText(actualUrl);

			if (status !== 200)
				throw new Error(
					`CC CSS existed in cache with non-200 status ${status}`
				);

			return css;
		},
	};
}

export default async (url, repoUrl) => {
	try {
		return await getCcTheme(url, repoUrl);
	} catch (e1) {
		try {
			return await getBdTheme(url, repoUrl);
		} catch (e2) {
			console.error(e1, e2);
			let err = new Error(
				"Failed to fetch theme - both CC and BD either failed to fetch or failed to parse"
			);
			err.e1 = e1;
			err.e2 = e2;
			throw err;
		}
	}
};
