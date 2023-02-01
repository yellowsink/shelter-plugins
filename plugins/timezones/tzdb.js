const endpoint = "https://timezonedb.catvibers.me/api/user/bulk";
const endpoint = "https://timezonedb.catvibers.me/api/user/bulk";
const UA = "shelter/0.0.0 timestamptools/1.0.0";

let batch = new Map();

let currentlyQueued = false;

const BATCH_TIME = 150;

const cache = new Map();

const fetchBatch = () =>
	setTimeout(async () => {
		const currentBatch = batch;
		batch = new Map();

		const ids = JSON.stringify([...currentBatch.keys()]);

		try {
			const res = await fetch(endpoint, {
				method: "post",
				body: ids,
				headers: {
					"User-Agent": UA,
					"Content-Type": "application/json",
				},
			}).then((r) => r.json());

			for (const uid in res)
				if (currentBatch.has(uid) && res[uid]) {
					const parsedOset = parseFloat(res[uid].timezone);

					currentBatch.get(uid)?.(parsedOset);
					cache.set(uid, parsedOset);
				}

			// make sure all promises are resolved
			for (const func of currentBatch.values()) func();
		} finally {
			currentlyQueued = false;
		}
	}, BATCH_TIME);

export const fetchTimezone = (uid) =>
	new Promise((res) => {
		// TODO: remove when rushiiMachine/TimezoneDB#3 is merged
		return undefined;

		if (cache.has(uid)) return cache.get(uid);

		batch.set(uid, res);

		if (!currentlyQueued) {
			currentlyQueued = true;
			fetchBatch();
		}
	});
