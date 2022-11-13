// apply openasar's sentry removers
// https://github.com/GooseMod/OpenAsar/blob/7a04cb57dff43f328de78addc234e9d21ff079a8/src/mainWindow.js#L3
try {
	window.__SENTRY__.hub.getClient().getOptions().enabled = false;
	Object.keys(console).forEach(x => console[x] = console[x].__sentry_original__ ?? console[x]);
} catch {}

// stop TRACK dispatches from causing science requests
// this is not done via intercept() so that plugins can still listen for these dispatches
// as TRACK dispatches are *insanely useful*

const analyticsTest = /client-analytics\.braintreegateway\.com|discord\.com\/api\/v9\/science/;

// ewwww XHR
export const onUnload = shelter.patcher.instead(
  "send",
  XMLHttpRequest.prototype,
  function (args, orig) {
    if (!analyticsTest.test(this.__sentry_xhr__?.url))
      return orig.apply(this, args);
  }
);