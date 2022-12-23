// SOURCE https://github.com/sink-cord-archive/cc-plugins/blob/master/plugins/cumstain/util/cachingFetcher.js

// caches AND de-dups requests

const cache = {};
const queuedReqs = {};

export async function fetchText(url) {
	if (cache[url]) return cache[url];

	if (!queuedReqs[url])
		queuedReqs[url] = [
			fetch(url).then(async (res) => {
				cache[url] = [
					res.status,
					res.status === 200 ? await res.text() : undefined,
				];
			}),
			0,
		];

	queuedReqs[url][1]++;

	await queuedReqs[url][0];
	queuedReqs[url][1]--;
	if (queuedReqs[url][1] === 0) delete queuedReqs[url];

	return cache[url];
}

export async function fetchJson(url) {
	const [status, txt] = await fetchText(url);
	return [status, txt ? JSON.parse(txt) : undefined];
}

export const clearCache = () =>
	Object.keys(cache).forEach((k) => delete cache[k]);