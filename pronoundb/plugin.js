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
//#region plugins/pronoundb/biofetcher.ts
const { reactFiberWalker: reactFiberWalker$1, getFiber: getFiber$1 } = shelter.util;
const fetchedBios = new Map();
async function forceBioFetch(el, uid) {
	const fetchedProm = fetchedBios.get(uid);
	if (fetchedProm) return fetchedProm;
	const node = reactFiberWalker$1(getFiber$1(el), (f) => f.stateNode?.handlePreload, true)?.stateNode;
	if (!node) return;
	const prom = node.handlePreload();
	fetchedBios.set(uid, prom);
	return prom;
}

//#endregion
//#region plugins/pronoundb/db.ts
const UserProfileStore = shelter.flux.storesFlat.UserProfileStore;
const SelectedGuildStore = shelter.flux.storesFlat.SelectedGuildStore;
const pronouns = {
	he: "he/him",
	it: "it/its",
	she: "she/her",
	they: "they/them",
	any: "Any",
	other: "Other",
	ask: "Ask me",
	avoid: "Use name"
};
const additionalPronouns = [
	"he/it",
	"he/she",
	"he/they",
	"it/him",
	"it/she",
	"it/they",
	"she/he",
	"she/it",
	"she/they",
	"they/he",
	"they/it",
	"they/she"
];
const pronounsToSearch = Object.values(pronouns).concat(additionalPronouns).filter((p) => p.includes("/")).sort((a, b) => b.length - a.length);
const fromStore = (id) => {
	const profile = UserProfileStore.getUserProfile(id);
	const scoped = UserProfileStore.getGuildMemberProfile(id, SelectedGuildStore.getGuildId());
	if (!profile) return;
	const search = (s) => s && pronounsToSearch.find((p) => s.includes(p));
	return search(scoped?.pronouns) ?? search(scoped?.bio) ?? search(profile.pronouns) ?? search(profile.bio);
};
const endpoint = "https://pronoundb.org/api/v2/lookup?platform=discord&ids=";
const options = { headers: { "X-PronounDB-Source": "yellowsink/shelter-plugins" } };
let batch = new Map();
let currentlyQueued = false;
const cache = new Map();
const BATCH_TIME = 150;
const fetchBatch = async () => {
	const currentBatch = batch;
	batch = new Map();
	const ids = [...currentBatch.keys()].join();
	try {
		const res = await fetch(endpoint + ids, options).then((r) => r.json());
		for (const uid in res) if (currentBatch.has(uid) && res[uid]) {
			const pronounSet = res[uid]["sets"]?.["en"];
			if (!pronounSet || pronounSet.length === 0) continue;
			let prettyPronouns;
			if (pronounSet.length === 1) prettyPronouns = pronouns[pronounSet[0]];
else prettyPronouns = pronounSet.join("/");
			currentBatch.get(uid)?.(prettyPronouns);
			cache.set(uid, prettyPronouns);
		}
		for (const [uid, func] of currentBatch.entries()) {
			func(undefined);
			if (!cache.has(uid)) cache.set(uid, undefined);
		}
	} finally {
		currentlyQueued = false;
	}
};
const fetchPronouns = (uid) => cache.has(uid) ? Promise.resolve(cache.get(uid)) : new Promise((res) => {
	setTimeout(res, 3e3);
	batch.set(uid, res);
	if (!currentlyQueued) {
		currentlyQueued = true;
		setTimeout(fetchBatch, BATCH_TIME);
	}
});

//#endregion
//#region plugins/pronoundb/compactMode.scss
shelter.plugin.scoped.ui.injectCss(`[class*="latin12CompactTimeStamp"] {
  --timestamp-width: 6.25rem !important;
  width: 6.25rem !important;
}

[class*="latin12CompactTimeStamp"]:before {
  --avatar-size: 2.25rem !important;
}

:root {
  --custom-message-margin-compact-indent: 9rem;
}
`);

//#endregion
//#region plugins/pronoundb/index.tsx
var import_web = __toESM(require_web(), 1);
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
var import_web$3 = __toESM(require_web(), 1);
var import_web$4 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<span><!#><!/><!#><!/> •<!#><!/></span>`, 8);
const { flux: { dispatcher }, observeDom, util: { getFiber, reactFiberWalker }, ui: { Space }, solid: { Show } } = shelter;
const patchedEls = new WeakSet();
async function inject(el) {
	if (patchedEls.has(el)) return;
	patchedEls.add(el);
	const authorId = reactFiberWalker(getFiber(el), "message", true)?.pendingProps?.message?.author?.id;
	if (!authorId) return;
	let pronouns$1 = await fetchPronouns(authorId);
	if (!pronouns$1) {
		await forceBioFetch(el.parentElement.parentElement.querySelector("[id^=message-username]").firstElementChild, authorId);
		pronouns$1 = fromStore(authorId);
	}
	if (pronouns$1) el.insertAdjacentElement("beforebegin", (() => {
		const _el$ = (0, import_web$1.getNextElement)(_tmpl$), _el$3 = _el$.firstChild, [_el$4, _co$] = (0, import_web$2.getNextMarker)(_el$3.nextSibling), _el$5 = _el$4.nextSibling, [_el$6, _co$2] = (0, import_web$2.getNextMarker)(_el$5.nextSibling), _el$2 = _el$6.nextSibling, _el$7 = _el$2.nextSibling, [_el$8, _co$3] = (0, import_web$2.getNextMarker)(_el$7.nextSibling);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(Space, {}), _el$4, _co$);
		(0, import_web$3.insert)(_el$, pronouns$1, _el$6, _co$2);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(Space, {}), _el$8, _co$3);
		return _el$;
	})());
}
function onDispatch() {
	const unObserve = observeDom("h3 time[id^=message-timestamp]", (el) => {
		unObserve();
		inject(el);
	});
	setTimeout(unObserve, 500);
}
const TRIGGERS = [
	"MESSAGE_CREATE",
	"CHANNEL_SELECT",
	"UPDATE_CHANNEL_DIMENSIONS",
	"MESSAGE_UPDATE"
];
TRIGGERS.forEach((t) => dispatcher.subscribe(t, onDispatch));
const onUnload = () => TRIGGERS.forEach((t) => dispatcher.unsubscribe(t, onDispatch));

//#endregion
exports.onUnload = onUnload
return exports;
})({});