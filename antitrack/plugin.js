(function() {

"use strict";

//#region plugins/antitrack/index.js
const { plugin: { scoped }, util: { log } } = shelter;
try {
	if (DiscordSentry) DiscordSentry.close();
else Object.defineProperty(window, "DiscordSentry", {
		set(v) {
			delete window.DiscordSentry;
			window.DiscordSentry = v;
			setTimeout(v.close);
		},
		enumerable: false,
		configurable: true
	});
} catch (e) {
	log(`[Antitrack] Error while disabling Sentry ${e}`);
}
try {
	Object.keys(console).forEach((func) => {
		const original = console[func]?.__sentry_original__;
		if (!original) return;
		console[func] = original;
	});
} catch (e) {
	log(`[Antitrack] Error while unpatching console functions ${e}`);
}
scoped.http.intercept("POST", /^\/science/, () => {});
const metricsRe = /^https?:\/\/([a-z0-9\-]+\.)?discord\.com\/api\/v\d+\/metrics/;
const getSentryProp = (obj) => obj[Object.keys(obj).find((k) => k.startsWith("__sentry_xhr"))];
scoped.patcher.instead("send", XMLHttpRequest.prototype, function(args, orig) {
	const url = getSentryProp(this)?.url;
	if (typeof url === "string" && metricsRe.test(url)) return;
	return orig.apply(this, args);
});

//#endregion
})();