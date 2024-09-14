import type { FluxStore } from "@uwu/shelter-defs";

const UserProfileStore = shelter.flux.stores.UserProfileStore as FluxStore<{
	getUserProfile(id: string): { bio: string, pronouns: string } | undefined;
}>;

const pronouns = {
	he: "he/him",
	hi: "he/it",
	hs: "he/she",
	ht: "he/they",
	ih: "it/him",
	it: "it/its",
	is: "it/she",
	ith: "it/they",
	shh: "she/he",
	she: "she/her",
	si: "she/it",
	st: "she/they",
	th: "they/he",
	ti: "they/it",
	ts: "they/she",
	they: "they/them",
	any: "Any pronouns",
	other: "Other pronouns",
	ask: "Ask me my pronouns",
	avoid: "Avoid pronouns, use my name",
};

const pronounsToSearch = Object.values(pronouns)
	.filter((p) => p.includes("/"))
	.sort((a, b) => b.length - a.length);

export const fromStore = (id) => {
	const profile = UserProfileStore.getUserProfile(id);
	if (!profile) return;
	const pronounSource = (profile.pronouns + profile.bio).toLowerCase();
	return pronounsToSearch.find((p) => pronounSource.includes(p));
};

const endpoint =
	"https://pronoundb.org/api/v2/lookup?platform=discord&ids=";

const options = {
	headers: {
		"X-PronounDB-Source": "yellowsink/shelter-plugins"
	}
};

let batch = new Map<string, (v: string) => void>();
let currentlyQueued = false;
const cache = new Map<string, string>();

const BATCH_TIME = 150;

const fetchBatch = async () => {
	const currentBatch = batch;
	batch = new Map();

	const ids = [...currentBatch.keys()].join();

	try {
		const res = await fetch(endpoint + ids, options).then((r) => r.json());

		for (const uid in res)
			if (currentBatch.has(uid) && res[uid]) {
				const pronounSet = res[uid]["sets"]?.["en"];
				if (!pronounSet || pronounSet.length === 0) continue;

				let prettyPronouns: string;
				if (pronounSet.length === 1) {
					prettyPronouns = pronouns[pronounSet[0]];
				} else {
					prettyPronouns = pronounSet.join("/");
				}

				currentBatch.get(uid)?.(prettyPronouns);
				cache.set(uid, prettyPronouns);
			}

		// make sure all promises resolve
		for (const [uid, func] of currentBatch.entries()) {
			func(undefined);
			if (!cache.has(uid)) cache.set(uid, undefined);
		}
	} finally {
		currentlyQueued = false;
	}
};

export const fetchPronouns = (uid) =>
	cache.has(uid)
		? Promise.resolve(cache.get(uid))
		: new Promise<string>((res) => {
				// dont leave hanging
				setTimeout(res, 3000);

				batch.set(uid, res);

				if (!currentlyQueued) {
					currentlyQueued = true;
					setTimeout(fetchBatch, BATCH_TIME);
				}
		  });
