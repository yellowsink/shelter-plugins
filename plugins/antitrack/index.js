const { scoped } = shelter.plugin;

// apply openasar's sentry removers
// https://github.com/GooseMod/OpenAsar/blob/7a04cb57dff43f328de78addc234e9d21ff079a8/src/mainWindow.js#L3
try {
	window.__SENTRY__.hub.getClient().getOptions().enabled = false;
	Object.keys(console).forEach(
		(x) => (console[x] = console[x].__sentry_original__ ?? console[x]),
	);
} catch {}

// stop TRACK dispatches from causing science etc requests
// this is not done via flux.intercept() so that plugins can still listen for these dispatches
// as TRACK dispatches are *insanely useful*

scoped.http.intercept("POST", /^\/science|^\/error-reporting-proxy/, () => {});
