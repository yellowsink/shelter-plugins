import { revertNitro, spoofNitro } from "./spoofer";
import slateTreeProcessor from "./slateTreeProcessor";

const {
	flux: { dispatcher },
	plugin: { store },
	observeDom,
	util: { getFiber },
} = shelter;

if (store.size === undefined) store.size = 64;

function handleTrack(e) {
	const spoofWhile = (eventName, selector) => {
		if (e.event === eventName) {
			spoofNitro();

			const unObserve = observeDom(selector, (e) => {
				if (e.isConnected) return;
				// this is AWFUL
				setTimeout(() => revertNitro(), 5000);
				unObserve();
			});
		}
	};

	spoofWhile("expression_picker_opened", "#emoji-picker-tab-panel");
	spoofWhile("channel_autocomplete_open", "[class*=autocomplete]");
}

let KILLSWITCH_patchMessagebar = false;

const patchMessagebar = (elem) => {
	if (elem.dataset.YSINK_FM) return;
	elem.dataset.YSINK_FM = "1";

	const fiber = getFiber(elem);
	const editor = fiber.child.pendingProps.editor;

	elem.onkeydown = (k) => {
		if (KILLSWITCH_patchMessagebar) return;

		if (
			k.key === "Enter" &&
			!document.querySelector("[class*=autocomplete],[class*=attachedBars]")
		)
			editor.children = slateTreeProcessor(editor.children);
	};
};

const unObserve = observeDom('[class*="slateContainer-"]', (e) => {
	patchMessagebar(e);
});

dispatcher.subscribe("TRACK", handleTrack);

export const onUnload = () => {
	dispatcher.unsubscribe("TRACK", handleTrack);
	unObserve();
	KILLSWITCH_patchMessagebar = true;
};

export { default as settings } from "./settings";
