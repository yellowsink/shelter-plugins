(function(exports) {

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion

//#region plugins/freemoji/spoofer.js
const user = () => shelter.flux.stores.UserStore.getCurrentUser();
let realNitro;
const spoofNitro = () => {
	if (realNitro) return;
	realNitro = user().premiumType;
	user().premiumType = 2;
};
const revertNitro = () => {
	if (realNitro === undefined) return;
	user().premiumType = realNitro;
	realNitro = undefined;
};

//#endregion
//#region plugins/freemoji/slateTreeProcessor.js
const { plugin: { store: store$2 }, flux: { stores: { SelectedGuildStore, EmojiStore } } } = shelter;
const isInDms = () => !!document.querySelector("[data-list-item-id=\"guildsnav___home\"][class*=\"selected\"]");
const getEmoteSize = () => Number.isSafeInteger(parseInt(store$2.size)) ? store$2.size : 64;
var slateTreeProcessor_default = (slateTree) => {
	const extractedEmojis = [];
	const newSlateTree = [];
	for (const line of slateTree) {
		const newLine = [];
		for (const lineItem of line.children) {
			if (lineItem.emoji) {
				const emoji = EmojiStore.getCustomEmojiById(lineItem.emoji.emojiId);
				if (emoji.guildId !== SelectedGuildStore.getLastSelectedGuildId() || emoji.animated || isInDms()) {
					extractedEmojis.push(`https://cdn.discordapp.com/emojis/${emoji.id}?size=${getEmoteSize()}`);
					continue;
				}
			}
			newLine.push(lineItem);
		}
		newSlateTree.push({
			...line,
			children: newLine
		});
	}
	for (const extracted of extractedEmojis) newSlateTree.push({
		type: "line",
		children: [{ text: extracted }]
	});
	return newSlateTree;
};

//#endregion
//#region solid-js/web
var require_web = __commonJS({ "solid-js/web"(exports, module) {
	module.exports = shelter.solidWeb;
} });

//#endregion
//#region plugins/freemoji/settings.jsx
var import_web = __toESM(require_web(), 1);
var import_web$1 = __toESM(require_web(), 1);
const { plugin: { store: store$1 }, ui: { Header, HeaderTags, TextBox } } = shelter;
var settings_default = () => [(0, import_web$1.createComponent)(Header, {
	get tag() {
		return HeaderTags.H3;
	},
	children: "Emoji Size (defaults to 64 if invalid)"
}), (0, import_web$1.createComponent)(TextBox, {
	placeholder: "64",
	get value() {
		return Number.isSafeInteger(store$1.size) ? store$1.size : "";
	},
	onInput: (val) => store$1.size = parseInt(val)
})];

//#endregion
//#region plugins/freemoji/index.js
const { flux: { dispatcher }, plugin: { store }, observeDom, util: { getFiber } } = shelter;
if (store.size === undefined) store.size = 64;
function handleTrack(e) {
	const spoofWhile = (eventName, selector) => {
		if (e.event === eventName) {
			spoofNitro();
			const unObserve$1 = observeDom(selector, (e$1) => {
				if (e$1.isConnected) return;
				setTimeout(() => revertNitro(), 5e3);
				unObserve$1();
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
		if (k.key === "Enter" && !document.querySelector("[class*=autocomplete],[class*=attachedBars]")) editor.children = slateTreeProcessor_default(editor.children);
	};
};
const unObserve = observeDom("[class*=\"slateContainer\"]", (e) => {
	patchMessagebar(e);
});
dispatcher.subscribe("TRACK", handleTrack);
const onUnload = () => {
	dispatcher.unsubscribe("TRACK", handleTrack);
	unObserve();
	KILLSWITCH_patchMessagebar = true;
};

//#endregion
exports.onUnload = onUnload
exports.settings = settings_default
return exports;
})({});