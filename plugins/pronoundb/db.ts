const { UserProfileStore } = shelter.flux.stores;

const pronouns = {
	unspecified: "Unspecified",
	hh: "he/him",
	hi: "he/it",
	hs: "he/she",
	ht: "he/they",
	ih: "it/him",
	ii: "it/its",
	is: "it/she",
	it: "it/they",
	sh: "she/her",
	shh: "she/he",
	si: "she/it",
	st: "she/they",
	th: "they/he",
	ti: "they/it",
	ts: "they/she",
	tt: "they/them",
	any: "Any pronouns",
	other: "Other pronouns",
	ask: "Ask me my pronouns",
	avoid: "Avoid pronouns, use my name",
};

const pronounsToSearch = Object.values(pronouns).filter((p) => p.includes("/"));

export const fromStore = (id) => {
	const profile = UserProfileStore.getUserProfile(id);
	if (typeof profile?.bio !== "string") return;
	return pronounsToSearch.find((p) => profile.bio.includes(p));
};

const endpoint =
	"https://pronoundb.org/api/v1/lookup-bulk?platform=discord&ids=";

let batch = new Map<string, (v: string) => void>();
let currentlyQueued = false;
const cache = new Map<string, string>();

const BATCH_TIME = 150;

const fetchBatch = async () => {
	const currentBatch = batch;
	batch = new Map();

	const ids = [...currentBatch.keys()].join();

	try {
		const res = await fetch(endpoint + ids).then((r) => r.json());

		for (const uid in res)
			if (currentBatch.has(uid) && res[uid] && res[uid] !== "unspecified") {
				const prettyPronouns = pronouns[res[uid]];
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
