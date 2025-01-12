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

//#region solid-js/web
var require_web = __commonJS({ "solid-js/web"(exports, module) {
	module.exports = shelter.solidWeb;
} });

//#endregion
//#region plugins/invidivizer/index.jsx
var import_web = __toESM(require_web(), 1);
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
var import_web$3 = __toESM(require_web(), 1);
var import_web$4 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<iframe style="border: 0; width: 100%; max-width: 600px; aspect-ratio: 16/9" allow="fullscreen"></iframe>`, 2);
const { plugin: { store }, observeDom, flux: { dispatcher, storesFlat: { SelectedChannelStore } }, util: { reactFiberWalker, getFiber }, ui: { Header, HeaderTags, TextBox } } = shelter;
if (!(store.sfmigrate >= 1) && store.instance === "invidious.slipfox.xyz") {
	store.sfmigrate = 1;
	store.instance = null;
}
if (!(store.sfmigrate >= 2) && store.instance === "inv.n8pjl.ca") {
	store.sfmigrate = 2;
	store.instance = null;
}
store.instance ??= "inv.nadeko.net";
const TRIGGERS = [
	"MESSAGE_CREATE",
	"MESSAGE_UPDATE",
	"UPDATE_CHANNEL_DIMENSIONS"
];
function handleDispatch(payload) {
	if (!store.instance) return;
	if ((payload.type === "MESSAGE_CREATE" || payload.type === "MESSAGE_UPDATE") && payload.message.channel_id !== SelectedChannelStore.getChannelId()) return;
	const unobs = observeDom(`[id^="chat-messages-"] article:not([data-invidivizer])`, (e) => {
		e.dataset.invidivizer = "1";
		unobs();
		e.parentElement.querySelector(`iframe[src*="${store.instance}"]`)?.remove();
		const found = reactFiberWalker(getFiber(e), "embed", true)?.memoizedProps?.embed?.url;
		if (!(typeof found === "string") || !found.startsWith("https://www.youtube.com")) return;
		const match = found.match(/v=([a-zA-Z0-9-_]+)/);
		if (!match?.[1]) return;
		const tsMatch = found.match(/t=(?:\d+|(?:\d+m)?\d+s|\d+m)/);
		const embPath = tsMatch?.[0] ? match[1] + "?" + tsMatch[0] : match[1];
		const newSrc = new URL(`https://${store.instance}/embed/${embPath}`);
		newSrc.searchParams.set("autoplay", 0);
		e.style.display = "none";
		e.insertAdjacentElement("afterend", (() => {
			const _el$ = (0, import_web$4.getNextElement)(_tmpl$);
			(0, import_web$3.effect)(() => (0, import_web$2.setAttribute)(_el$, "src", newSrc.toString()));
			return _el$;
		})());
	});
	setTimeout(unobs, 1e3);
}
for (const t of TRIGGERS) dispatcher.subscribe(t, handleDispatch);
function onUnload() {
	for (const t of TRIGGERS) dispatcher.unsubscribe(t, handleDispatch);
}
const settings = () => [(0, import_web$1.createComponent)(Header, {
	get tag() {
		return HeaderTags.H3;
	},
	children: "Invidious Instance"
}), (0, import_web$1.createComponent)(TextBox, {
	placeholder: "my.instance.com",
	get value() {
		return store.instance;
	},
	onInput: (v) => store.instance = v
})];

//#endregion
exports.onUnload = onUnload
exports.settings = settings
return exports;
})({});