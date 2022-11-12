import {revertNitro, spoofNitro} from "./spoofer";
import msgProcessor from "./msgProcessor";

const {
	flux: {dispatcher, intercept},
	plugin: {store},
	patcher: {before},
	observeDom
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
	}

	spoofWhile("expression_picker_opened", "#emoji-picker-tab-panel");
	spoofWhile("channel_autocomplete_open", "[class*=autocomplete]");
}

let mbarUnpatches = [];
const patchMessagebar = (elem) => {
	if (elem.dataset.YSINK_FM) return;
	elem.dataset.YSINK_FM = "1";

	const fiber = elem.__reactFiber$.return;
	const parent = fiber.return;

	// damnit, this doesn't run.
	mbarUnpatches.push(before("onEnter", fiber.pendingProps, () => {
		parent.pendingProps.textValue = msgProcessor(parent.pendingProps.textValue)
	}))
}

const unObserve = observeDom('[class*="slateContainer-"]', e => {
	patchMessagebar(e);
});

dispatcher.subscribe("TRACK", handleTrack);

export const onUnload = () => {
	dispatcher.unsubscribe("TRACK", handleTrack);
	unObserve();
	unpatchMessagebar?.();
}