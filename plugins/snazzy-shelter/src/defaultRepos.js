const {
	plugin: {store}
} = shelter;

// yep, we're still using this infrastructure!
export const officialRepos = Object.freeze(["https://cumcordthemes.github.io/Cumsock/"]);

export default async () => {
	if (!Array.isArray(store.repos))
		store.repos = [];

	for (const r of officialRepos) {
		if (store.repos.find(r1 => r1.url === r.url)) continue;

		try {
			await fetchRepo(r);
		} catch {
			continue;
		}

		store.repos.push(r);
	}

	// raise events
	// store.repos = store.repos.slice();
}