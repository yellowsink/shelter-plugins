(function() {

"use strict";

//#region plugins/no-devtools-detect/index.jsx
if (window.DiscordNative) DiscordNative.window.setDevtoolsCallbacks(() => {}, () => {});
else {
	const realDescriptor = Reflect.getOwnPropertyDescriptor(window, "outerWidth");
	console.assert(Reflect.defineProperty(window, "outerWidth", {
		enumerable: true,
		configurable: true,
		get() {
			throw "sincerely, piss off -- from sink, to discord";
		}
	}));
	shelter.plugin.scoped.onDispose(() => console.assert(Reflect.defineProperty(window, "outerWidth", realDescriptor)));
}

//#endregion
})();