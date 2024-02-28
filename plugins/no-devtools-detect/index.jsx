if (window.DiscordNative) {
	// desktop, cannot be unloaded easily
	DiscordNative.window.setDevtoolsCallbacks(
		() => {},
		() => {},
	);
} else {
	// web
	const realDescriptor = Reflect.getOwnPropertyDescriptor(window, "outerWidth");

	console.assert(
		Reflect.defineProperty(window, "outerWidth", {
			enumerable: true,
			configurable: true,
			get() {
				throw "sincerely, piss off -- from sink, to discord";
			},
		}),
	);

	shelter.plugin.scoped.onDispose(() =>
		console.assert(
			Reflect.defineProperty(window, "outerWidth", realDescriptor),
		),
	);
}
