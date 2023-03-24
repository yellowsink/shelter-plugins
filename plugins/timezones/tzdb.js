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
					"X-User-Agent": UA,
					"Content-Type": "application/json",
				},
			}).then((r) => r.json());

			for (const uid in res)
				if (currentBatch.has(uid) && res[uid]) {
					const tz = res[uid].timezoneId;

					currentBatch.get(uid)?.(tz);
					cache.set(uid, tz);
				}

			// make sure all promises are resolved
			for (const [uid, func] of currentBatch.entries()) {
				func();
				if (!cache.has(uid)) cache.set(uid, undefined);
			}
		} finally {
			currentlyQueued = false;
		}
	}, BATCH_TIME);

export const fetchTimezone = (uid) =>
	cache.has(uid)
		? cache.get(uid)
		: new Promise((res) => {
				// dont leave dangling promises
				setTimeout(res, 3000);

				batch.set(uid, res);

				if (!currentlyQueued) {
					currentlyQueued = true;
					fetchBatch();
				}
		  });
