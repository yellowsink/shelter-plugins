import type { FluxStore } from "@uwu/shelter-defs";

const UserProfileStore = shelter.flux.storesFlat.UserProfileStore as FluxStore<{
	getUserProfile(id: string): { bio: string; pronouns: string } | undefined;
	getGuildMemberProfile(
		u: string,
		g: string,
	): { bio: string; pronouns: string } | null;
}>;

const SelectedGuildStore = shelter.flux.storesFlat
	.SelectedGuildStore as FluxStore<{
	getGuildId(): string;
}>;

const pronouns = {
	he: "he/him",
	it: "it/its",
	she: "she/her",
	they: "they/them",
	any: "Any",
	other: "Other",
	ask: "Ask me",
	avoid: "Use name",
};

const additionalPronouns = [
	"he/it",
	"he/she",
	"he/they",
	"it/him",
	"it/she",
	"it/they",
	"she/he",
	"she/it",
	"she/they",
	"they/he",
	"they/it",
	"they/she",
];

const pronounsToSearch = Object.values(pronouns)
	.concat(additionalPronouns)
	.filter((p) => p.includes("/"))
	.sort((a, b) => b.length - a.length);

export const fromStore = (id: string) => {
	const profile = UserProfileStore.getUserProfile(id);
	const scoped = UserProfileStore.getGuildMemberProfile(
		id,
		SelectedGuildStore.getGuildId(),
	);
	if (!profile) return;

	const search = (s: string) =>
		s && pronounsToSearch.find((p) => s.includes(p));

	return (
		search(scoped?.pronouns) ??
		search(scoped?.bio) ??
		search(profile.pronouns) ??
		search(profile.bio)
	);
};

const endpoint = "https://pronoundb.org/api/v2/lookup?platform=discord&ids=";

const options = {
	headers: {
		"X-PronounDB-Source": "yellowsink/shelter-plugins",
	},
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
