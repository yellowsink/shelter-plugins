const {
	plugin: { scoped },
	util: { log },
} = shelter;

// Disable Sentry as soon as possible
try {
	if (DiscordSentry) {
		DiscordSentry.close();
	} else {
		Object.defineProperty(window, "DiscordSentry", {
			set(v) {
				delete window.DiscordSentry;
				window.DiscordSentry = v;
				setTimeout(v.close);
			},
			enumerable: false,
			configurable: true,
		});
	}
} catch (e) {
	log(`[Antitrack] Error while disabling Sentry ${e}`);
}

// Unpatch console functions
try {
	Object.keys(console).forEach((func) => {
		const original = console[func]?.__sentry_original__;
		if (!original) return;
		console[func] = original;
	});
} catch (e) {
	log(`[Antitrack] Error while unpatching console functions ${e}`);
}

// Stop TRACK dispatches from causing science requests
// This is not done via flux.intercept() so that plugins can still listen for these dispatches
// as TRACK dispatches are *insanely useful*
scoped.http.intercept("POST", /^\/science/, () => {});

// Block metrics requests separately, as they're not sent via the http module
// Just in case we also account for subdomains/release channels
const metricsRe =
	/^https?:\/\/([a-z0-9\-]+\.)?discord\.com\/api\/v\d+\/metrics/;
const getSentryProp = (obj) =>
	obj[Object.keys(obj).find((k) => k.startsWith("__sentry_xhr"))];

scoped.patcher.instead("send", XMLHttpRequest.prototype, function (args, orig) {
	const url = getSentryProp(this)?.url;
	if (typeof url === "string" && metricsRe.test(url)) return;
	return orig.apply(this, args);
});
