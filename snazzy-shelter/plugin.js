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
	if (from && typeof from === "object" || typeof from === "function") for (var keys$1 = __getOwnPropNames(from), i = 0, n = keys$1.length, key; i < n; i++) {
		key = keys$1[i];
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

//#region plugins/snazzy-shelter/src/util/bdMetaParser.js
const splitRegex = /[^\S\r\n]*?\r?\n[^\S\r\n]*?\*[^\S\r\n]?/;
const escapedAtRegex = /^\\@/;
function tryJSON(data) {
	try {
		return JSON.parse(data);
	} catch {}
}
function parseOldMeta(fileContent) {
	const meta = fileContent.split("\n")[0];
	const metaData = meta.substring(meta.lastIndexOf("//META") + 6, meta.lastIndexOf("*//"));
	const parsed = tryJSON(metaData);
	if (!parsed) throw new Error("META could not be parsed.");
	if (!parsed.name) throw new Error("META missing name data.");
	return parsed;
}
function parseNewMeta(fileContent) {
	const block = fileContent.split("/**", 2)[1].split("*/", 1)[0];
	const out = {};
	let field = "";
	let accum = "";
	for (const line of block.split(splitRegex)) {
		if (line.length === 0) continue;
		if (line.charAt(0) === "@" && line.charAt(1) !== " ") {
			if (field !== "") out[field] = accum;
			const l = line.indexOf(" ");
			field = line.substr(1, l - 1);
			accum = line.substr(l + 1);
		} else accum += ` ${line.replace("\\n", "\n").replace(escapedAtRegex, "@")}`;
	}
	out[field] = accum.trim();
	return out;
}
var bdMetaParser_default = (fileContent) => {
	const firstLine = fileContent.split("\n")[0];
	if (firstLine.includes("//META")) return parseOldMeta(fileContent);
	if (firstLine.includes("/**")) return parseNewMeta(fileContent);
	throw new Error("META was not found.");
};

//#endregion
//#region plugins/snazzy-shelter/src/util/cachingFetcher.js
const cache = {};
const queuedReqs = {};
async function fetchText(url) {
	if (cache[url]) return cache[url];
	if (!queuedReqs[url]) queuedReqs[url] = [fetch(url).then(async (res) => {
		cache[url] = [res.status, res.status === 200 ? await res.text() : undefined];
	}), 0];
	queuedReqs[url][1]++;
	await queuedReqs[url][0];
	queuedReqs[url][1]--;
	if (queuedReqs[url][1] === 0) delete queuedReqs[url];
	return cache[url];
}
async function fetchJson(url) {
	const [status, txt] = await fetchText(url);
	return [status, txt ? JSON.parse(txt) : undefined];
}
const clearCache = () => Object.keys(cache).forEach((k) => delete cache[k]);

//#endregion
//#region plugins/snazzy-shelter/src/util/fetchTheme.js
async function getBdTheme(url, repoUrl) {
	const actualUrl = new URL(url, repoUrl).href;
	const [status, CSS] = await fetchText(actualUrl);
	if (status !== 200) throw new Error(`BD theme existed in cache with non-200 status ${status}`);
	return {
		url: actualUrl,
		CSS: () => Promise.resolve(CSS),
		compat: true,
		repoUrl,
		...bdMetaParser_default(CSS)
	};
}
async function getCcTheme(url, repoUrl) {
	const actualUrl = new URL(url, repoUrl).href;
	let splitPath = new URL(url, repoUrl).pathname.split("/");
	splitPath.splice(splitPath.length - 1, 1, "cumcord_theme.json");
	const manifestUrl = new URL(splitPath.join("/"), new URL(url, repoUrl).origin).href;
	const [status, manifest] = await fetchJson(manifestUrl);
	if (status !== 200) throw new Error(`CC manifest existed in cache with non-200 status ${status}`);
	return {
		url: actualUrl,
		compat: false,
		...manifest,
		repoUrl,
		CSS: async () => {
			const [status$1, css] = await fetchText(actualUrl);
			if (status$1 !== 200) throw new Error(`CC CSS existed in cache with non-200 status ${status$1}`);
			return css;
		}
	};
}
var fetchTheme_default = async (url, repoUrl) => {
	try {
		return await getCcTheme(url, repoUrl);
	} catch (e1) {
		try {
			return await getBdTheme(url, repoUrl);
		} catch (e2) {
			console.error(e1, e2);
			let err = new Error("Failed to fetch theme - both CC and BD either failed to fetch or failed to parse");
			err.e1 = e1;
			err.e2 = e2;
			throw err;
		}
	}
};

//#endregion
//#region plugins/snazzy-shelter/src/util/fetchRepo.js
async function getRepoManifest(url) {
	const manifestURL = new URL("repo.json", url).href;
	const [status, manifest] = await fetchJson(manifestURL);
	if (status !== 200) throw new Error(`Repo manifest existed in cache with non-200 status ${status}`);
	if (!manifest.themes || manifest.themes?.length === 0) throw new Error("No themes found in repo");
	if (!manifest.meta) throw new Error("No repo metadata");
	if (!manifest?.meta.name) throw new Error("Repo did not have a name");
	return manifest;
}
var fetchRepo_default = async (url) => {
	const manifest = await getRepoManifest(url);
	const themeResults = await Promise.allSettled(manifest.themes.map((tu) => fetchTheme_default(tu, url)));
	const themes = themeResults.filter((t) => {
		if (t.status === "rejected") {
			console.error("snazzy-shelter: loading theme failed: ", t.reason);
			return false;
		}
		return true;
	}).map((t) => t.value);
	return {
		manifest,
		themes
	};
};

//#endregion
//#region plugins/snazzy-shelter/src/defaultRepos.js
const { plugin: { store: store$11 } } = shelter;
const officialRepos = Object.freeze(["https://cumcordthemes.github.io/Cumsock/"]);
var defaultRepos_default = async () => {
	if (!Array.isArray(store$11.repos)) store$11.repos = [];
	for (const r of officialRepos) {
		if (store$11.repos.find((r1) => r1.url === r.url)) continue;
		try {
			await fetchRepo_default(r);
		} catch {
			continue;
		}
		store$11.repos = [...store$11.repos, r];
	}
};

//#endregion
//#region plugins/snazzy-shelter/src/transients/quickCSS.js
const { solid: { createEffect: createEffect$1 }, plugin: { store: store$10 }, ui: { injectCss: injectCss$2 } } = shelter;
var quickCSS_default = () => {
	const modify = injectCss$2(store$10.quickCSS || " ");
	let cancel;
	createEffect$1(() => {
		if (!cancel) modify(store$10.quickCSS || " ");
	});
	return () => {
		modify();
		cancel = true;
	};
};

//#endregion
//#region plugins/snazzy-shelter/src/util/themeLoadUtil.js
const { ui: { injectCss: injectCss$1 }, plugin: { store: store$9 } } = shelter;
const unpatchCache = new Map();
async function loadTheme(theme) {
	if (!theme?.url || !await theme.CSS()) throw new Error("theme was missing either id or css.");
	const unpatch = injectCss$1(await theme.CSS());
	unpatchCache.set(theme.url, unpatch);
	const themeCacheIndex = store$9.themes.findIndex((t) => t.url === theme.url);
	let toPush = { ...theme };
	delete toPush.CSS;
	toPush.enabled = true;
	if (themeCacheIndex === -1) store$9.themes.push(toPush);
else store$9.themes[themeCacheIndex] = toPush;
	store$9.themes = store$9.themes;
}
function unloadTheme(theme) {
	if (!theme?.url) throw new Error("theme was missing id.");
	const unpatch = unpatchCache.get(theme.url);
	unpatch?.();
	unpatchCache.delete(theme.url);
	const themeCacheIndex = store$9.themes.findIndex((t) => t.url === theme.url);
	let toPush = { ...theme };
	toPush.enabled = false;
	if (themeCacheIndex === -1) store$9.themes.push(toPush);
else store$9.themes[themeCacheIndex] = toPush;
	store$9.themes = store$9.themes;
}
function removeTheme(theme) {
	try {
		unloadTheme(theme);
	} catch (e) {
		if (e.message !== "theme was not loaded.") throw e;
	}
	store$9.themes = store$9.themes.filter((t) => t.url !== theme.url);
}
function unloadAll() {
	unpatchCache.forEach((unpatch) => unpatch?.());
	unpatchCache.clear();
}

//#endregion
//#region plugins/snazzy-shelter/src/transients/restoreThemes.js
const { plugin: { store: store$8 } } = shelter;
var restoreThemes_default = () => {
	let cancel = false;
	if (store$8.themes) store$8.themes.filter((t) => t.enabled).forEach((t) => fetchTheme_default(t.url, t.repoUrl).then((ft) => cancel || loadTheme(ft)));
	return () => {
		unloadAll();
		cancel = true;
	};
};

//#endregion
//#region plugins/snazzy-shelter/src/transients/exposeApi.js
var exposeApi_default = () => {
	window.snazzyShelter = Object.freeze({ TODO: "WIP" });
	return () => delete window.snazzyShelter;
};

//#endregion
//#region solid-js/web
var require_web = __commonJS({ "solid-js/web"(exports, module) {
	module.exports = shelter.solidWeb;
} });

//#endregion
//#region plugins/snazzy-shelter/src/components/badges.jsx
var import_web$100 = __toESM(require_web());
var import_web$101 = __toESM(require_web());
var import_web$102 = __toESM(require_web());
var import_web$103 = __toESM(require_web());
var import_web$104 = __toESM(require_web());
var import_web$105 = __toESM(require_web());
const _tmpl$$17 = /*#__PURE__*/ (0, import_web$100.template)(`<img>`, 1), _tmpl$2$5 = /*#__PURE__*/ (0, import_web$100.template)(`<div></div>`, 2);
const badge = (url, type) => () => (() => {
	const _el$ = (0, import_web$103.getNextElement)(_tmpl$$17);
	(0, import_web$105.setAttribute)(_el$, "src", url);
	(0, import_web$104.className)(_el$, `ysink_stain_badge ysink_stain_${type}`);
	return _el$;
})();
const BDBadge = badge("https://betterdiscord.app/resources/branding/logo_small.svg", "bd");
const CCBadge = badge("https://raw.githubusercontent.com/Cumcord/assets/main/logo/filled.svg", "cc");
const TextBadge = (props) => (() => {
	const _el$2 = (0, import_web$103.getNextElement)(_tmpl$2$5);
	_el$2.style.setProperty("border-radius", "9999px");
	_el$2.style.setProperty("color", "white");
	_el$2.style.setProperty("font-size", ".8rem");
	_el$2.style.setProperty("padding", ".1rem .3rem");
	_el$2.style.setProperty("text-transform", "uppercase");
	_el$2.style.setProperty("font-weight", "bold");
	(0, import_web$102.insert)(_el$2, () => props.text);
	(0, import_web$101.effect)((_p$) => {
		const _v$ = props.class, _v$2 = props.color;
		_v$ !== _p$._v$ && (0, import_web$104.className)(_el$2, _p$._v$ = _v$);
		_v$2 !== _p$._v$2 && _el$2.style.setProperty("background-color", _p$._v$2 = _v$2);
		return _p$;
	}, {
		_v$: undefined,
		_v$2: undefined
	});
	return _el$2;
})();

//#endregion
//#region plugins/snazzy-shelter/src/components/MediaCarousel.jsx
var import_web$94 = __toESM(require_web());
var import_web$95 = __toESM(require_web());
var import_web$96 = __toESM(require_web());
var import_web$97 = __toESM(require_web());
var import_web$98 = __toESM(require_web());
var import_web$99 = __toESM(require_web());
const _tmpl$$16 = /*#__PURE__*/ (0, import_web$94.template)(`<div>WIP</div>`, 2), _tmpl$2$4 = /*#__PURE__*/ (0, import_web$94.template)(`<div class="ysink_stain_carousel"></div>`, 2), _tmpl$3$1 = /*#__PURE__*/ (0, import_web$94.template)(`<div class="ysink_stain_noimg"><!#><!/><!#><!/></div>`, 6);
const { Text: Text$4 } = shelter.ui;
const SmallMediaCarousel = (props) => (0, import_web$99.getNextElement)(_tmpl$$16);
var MediaCarousel_default = (props) => (() => {
	const _el$2 = (0, import_web$99.getNextElement)(_tmpl$2$4);
	(0, import_web$97.insert)(_el$2, (() => {
		const _c$ = (0, import_web$98.memo)(() => !!props.media);
		return () => _c$() ? (0, import_web$96.createComponent)(SmallMediaCarousel, {
			get items() {
				return (typeof props.media === "string" ? [props.media] : props.media).map((m) => ({
					type: 1,
					src: m
				}));
			},
			autoplayInterval: 5e3
		}) : (() => {
			const _el$3 = (0, import_web$99.getNextElement)(_tmpl$3$1), _el$4 = _el$3.firstChild, [_el$5, _co$] = (0, import_web$95.getNextMarker)(_el$4.nextSibling), _el$6 = _el$5.nextSibling, [_el$7, _co$2] = (0, import_web$95.getNextMarker)(_el$6.nextSibling);
			(0, import_web$97.insert)(_el$3, (0, import_web$96.createComponent)(Text$4, {
				"class": "ysink_stain_noimgtxt",
				children: "No Image"
			}), _el$5, _co$);
			(0, import_web$97.insert)(_el$3, (0, import_web$96.createComponent)(SmallMediaCarousel, { items: [{
				type: 1,
				src: ""
			}] }), _el$7, _co$2);
			return _el$3;
		})();
	})());
	return _el$2;
})();

//#endregion
//#region plugins/snazzy-shelter/src/components/CarouselModal.jsx
var import_web$90 = __toESM(require_web());
var import_web$91 = __toESM(require_web());
var import_web$92 = __toESM(require_web());
var import_web$93 = __toESM(require_web());
const _tmpl$$15 = /*#__PURE__*/ (0, import_web$90.template)(`<div></div>`, 2);
const { openModal, ModalRoot, ModalHeader, ModalBody, ModalSizes } = shelter.ui;
var CarouselModal_default = (media) => openModal(({ close }) => (0, import_web$93.createComponent)(ModalRoot, {
	get size() {
		return ModalSizes.MEDIUM;
	},
	get children() {
		return [(0, import_web$93.createComponent)(ModalHeader, { close }), (0, import_web$93.createComponent)(ModalBody, { get children() {
			const _el$ = (0, import_web$91.getNextElement)(_tmpl$$15);
			_el$.style.setProperty("margin-bottom", "1rem");
			(0, import_web$92.insert)(_el$, (0, import_web$93.createComponent)(MediaCarousel_default, { media }));
			return _el$;
		} })];
	}
}));

//#endregion
//#region plugins/snazzy-shelter/src/assets/Delete.jsx
var import_web$85 = __toESM(require_web());
var import_web$86 = __toESM(require_web());
var import_web$87 = __toESM(require_web());
var import_web$88 = __toESM(require_web());
var import_web$89 = __toESM(require_web());
const _tmpl$$14 = /*#__PURE__*/ (0, import_web$85.template)(`<svg><path d="M 3.9999998,21.333333 C 3.9999998,22.8 5.1999998,24 6.6666665,24 H 17.333334 C 18.799999,24 20,22.8 20,21.333333 V 5.3333333 H 3.9999998 Z M 7.2799998,11.84 9.1599995,9.96 12,12.786667 14.826667,9.96 l 1.879999,1.88 -2.826667,2.826667 2.826667,2.826666 -1.879999,1.88 L 12,16.546667 l -2.8266665,2.826666 -1.8800003,-1.88 2.8266658,-2.826666 z M 16.666666,1.3333333 15.333334,0 H 8.6666665 L 7.3333332,1.3333333 H 2.6666665 V 4 H 21.333334 V 1.3333333 Z"></path></svg>`, 4);
var Delete_default = (props) => (() => {
	const _el$ = (0, import_web$86.getNextElement)(_tmpl$$14);
	(0, import_web$88.spread)(_el$, (0, import_web$89.mergeProps)(props, {
		"xmlns": "http://www.w3.org/2000/svg",
		"height": "24px",
		"viewBox": "0 0 24 24",
		"width": "24px"
	}), true, true);
	(0, import_web$87.runHydrationEvents)();
	return _el$;
})();

//#endregion
//#region plugins/snazzy-shelter/src/assets/Copy.jsx
var import_web$80 = __toESM(require_web());
var import_web$81 = __toESM(require_web());
var import_web$82 = __toESM(require_web());
var import_web$83 = __toESM(require_web());
var import_web$84 = __toESM(require_web());
const _tmpl$$13 = /*#__PURE__*/ (0, import_web$80.template)(`<svg><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>`, 4);
var Copy_default = (props) => (() => {
	const _el$ = (0, import_web$81.getNextElement)(_tmpl$$13);
	(0, import_web$83.spread)(_el$, (0, import_web$84.mergeProps)(props, {
		"xmlns": "http://www.w3.org/2000/svg",
		"height": "24px",
		"viewBox": "0 0 24 24",
		"width": "24px"
	}), true, true);
	(0, import_web$82.runHydrationEvents)();
	return _el$;
})();

//#endregion
//#region plugins/snazzy-shelter/src/components/cards/ThemeCard.jsx
var import_web$71 = __toESM(require_web());
var import_web$72 = __toESM(require_web());
var import_web$73 = __toESM(require_web());
var import_web$74 = __toESM(require_web());
var import_web$75 = __toESM(require_web());
var import_web$76 = __toESM(require_web());
var import_web$77 = __toESM(require_web());
var import_web$78 = __toESM(require_web());
var import_web$79 = __toESM(require_web());
const _tmpl$$12 = /*#__PURE__*/ (0, import_web$71.template)(`<div class="ysink_stain_card ysink_stain_tcard"><div class="ysink_stain_tmedia"></div><div class="ysink_stain_title"><!#><!/><!#><!/></div><div class="ysink_stain_tdesc"></div><div class="ysink_stain_tacts"><!#><!/><!#><!/><!#><!/></div><div class="ysink_stain_taulic"><!#><!/><!#><!/></div></div>`, 26), _tmpl$2$3 = /*#__PURE__*/ (0, import_web$71.template)(`<div class="ysink_stain_tview">VIEW MEDIA</div>`, 2), _tmpl$3 = /*#__PURE__*/ (0, import_web$71.template)(`<div>NO MEDIA</div>`, 2);
const { ui: { Switch }, plugin: { store: store$7 } } = shelter;
const copyText = (txt) => navigator.clipboard.writeText(txt);
function themeIsEnabled(url) {
	for (const theme of store$7.themes) if (theme.url === url && theme.enabled) return true;
	return false;
}
const themeIsInstalled = (url) => store$7.themes.some((t) => t.url === url);
var ThemeCard_default = (props) => (() => {
	const _el$ = (0, import_web$74.getNextElement)(_tmpl$$12), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.firstChild, [_el$5, _co$] = (0, import_web$77.getNextMarker)(_el$4.nextSibling), _el$6 = _el$5.nextSibling, [_el$7, _co$2] = (0, import_web$77.getNextMarker)(_el$6.nextSibling), _el$8 = _el$3.nextSibling, _el$9 = _el$8.nextSibling, _el$10 = _el$9.firstChild, [_el$11, _co$3] = (0, import_web$77.getNextMarker)(_el$10.nextSibling), _el$12 = _el$11.nextSibling, [_el$13, _co$4] = (0, import_web$77.getNextMarker)(_el$12.nextSibling), _el$14 = _el$13.nextSibling, [_el$15, _co$5] = (0, import_web$77.getNextMarker)(_el$14.nextSibling), _el$16 = _el$9.nextSibling, _el$17 = _el$16.firstChild, [_el$18, _co$6] = (0, import_web$77.getNextMarker)(_el$17.nextSibling), _el$19 = _el$18.nextSibling, [_el$20, _co$7] = (0, import_web$77.getNextMarker)(_el$19.nextSibling);
	_el$2.$$click = () => props.theme.media && CarouselModal_default(props.theme.media);
	(0, import_web$78.insert)(_el$2, (() => {
		const _c$ = (0, import_web$79.memo)(() => !!props.theme.media);
		return () => _c$() ? (0, import_web$74.getNextElement)(_tmpl$2$3) : (0, import_web$74.getNextElement)(_tmpl$3);
	})());
	(0, import_web$78.insert)(_el$3, (() => {
		const _c$2 = (0, import_web$79.memo)(() => !!props.theme.compat);
		return () => _c$2() ? (0, import_web$76.createComponent)(BDBadge, {}) : (0, import_web$76.createComponent)(CCBadge, {});
	})(), _el$5, _co$);
	(0, import_web$78.insert)(_el$3, () => props.theme.name, _el$7, _co$2);
	(0, import_web$78.insert)(_el$8, () => props.theme.description);
	(0, import_web$78.insert)(_el$9, (0, import_web$76.createComponent)(Copy_default, {
		"class": "ysink_stain_iconbtn",
		onClick: () => copyText(props.theme.url)
	}), _el$11, _co$3);
	(0, import_web$78.insert)(_el$9, (() => {
		const _c$3 = (0, import_web$79.memo)(() => !!themeIsInstalled(props.theme.url));
		return () => _c$3() ? (0, import_web$76.createComponent)(Delete_default, {
			"class": "ysink_stain_iconbtn",
			onClick: () => {
				removeTheme(props.theme);
			}
		}) : [];
	})(), _el$13, _co$4);
	(0, import_web$78.insert)(_el$9, (0, import_web$76.createComponent)(Switch, {
		get checked() {
			return themeIsEnabled(props.theme.url);
		},
		onChange: async () => themeIsEnabled(props.theme.url) ? unloadTheme(props.theme) : loadTheme(await fetchTheme_default(props.theme.url))
	}), _el$15, _co$5);
	(0, import_web$78.insert)(_el$16, () => props.theme.author ? `by ${props.theme.author} ` : "", _el$18, _co$6);
	(0, import_web$78.insert)(_el$16, () => props.theme.license ? `under ${props.theme.license}` : "", _el$20, _co$7);
	(0, import_web$73.effect)((_p$) => {
		const _v$ = props.gap, _v$2 = props.theme.media && `url(${Array.isArray(props.theme.media) ? props.theme.media[0] : props.theme.media})`;
		_v$ !== _p$._v$ && _el$.style.setProperty("margin-bottom", _p$._v$ = _v$);
		_v$2 !== _p$._v$2 && _el$2.style.setProperty("background-image", _p$._v$2 = _v$2);
		return _p$;
	}, {
		_v$: undefined,
		_v$2: undefined
	});
	(0, import_web$75.runHydrationEvents)();
	return _el$;
})();
(0, import_web$72.delegateEvents)(["click"]);

//#endregion
//#region plugins/snazzy-shelter/src/components/InstallBar.jsx
var import_web$66 = __toESM(require_web());
var import_web$67 = __toESM(require_web());
var import_web$68 = __toESM(require_web());
var import_web$69 = __toESM(require_web());
var import_web$70 = __toESM(require_web());
const _tmpl$$11 = /*#__PURE__*/ (0, import_web$66.template)(`<div class="ysink_stain_row"><!#><!/><!#><!/></div>`, 6);
const { ui: { Button: Button$4, ButtonSizes: ButtonSizes$2, showToast: showToast$1, TextBox: TextBox$1 }, solid: { createSignal: createSignal$5 } } = shelter;
var InstallBar_default = () => {
	const [urlInput, setUrlInput] = createSignal$5("");
	return (() => {
		const _el$ = (0, import_web$67.getNextElement)(_tmpl$$11), _el$2 = _el$.firstChild, [_el$3, _co$] = (0, import_web$68.getNextMarker)(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = (0, import_web$68.getNextMarker)(_el$4.nextSibling);
		(0, import_web$69.insert)(_el$, (0, import_web$70.createComponent)(TextBox$1, {
			get value() {
				return urlInput();
			},
			onInput: setUrlInput,
			placeholder: "Theme import URL"
		}), _el$3, _co$);
		(0, import_web$69.insert)(_el$, (0, import_web$70.createComponent)(Button$4, {
			"class": "ysink_stain_button",
			get size() {
				return ButtonSizes$2.MEDIUM;
			},
			onClick: () => {
				fetchTheme_default(urlInput()).then(async (t) => {
					await loadTheme(t);
					showToast$1({
						title: `Loaded theme ${t.name}`,
						duration: 5e3
					});
					setUrlInput("");
				}, () => showToast$1({
					title: "Failed to fetch theme - check URL",
					duration: 5e3
				}));
			},
			children: "Install"
		}), _el$5, _co$2);
		return _el$;
	})();
};

//#endregion
//#region node_modules/.pnpm/fuse.js@6.6.2/node_modules/fuse.js/dist/fuse.esm.js
/**
* Fuse.js v6.6.2 - Lightweight fuzzy-search (http://fusejs.io)
*
* Copyright (c) 2022 Kiro Risk (http://kiro.me)
* All Rights Reserved. Apache Software License 2.0
*
* http://www.apache.org/licenses/LICENSE-2.0
*/
function isArray$1(value) {
	return !Array.isArray ? getTag$1(value) === "[object Array]" : Array.isArray(value);
}
const INFINITY$3 = Infinity;
function baseToString$1(value) {
	if (typeof value == "string") return value;
	let result = value + "";
	return result == "0" && 1 / value == -INFINITY$3 ? "-0" : result;
}
function toString$1(value) {
	return value == null ? "" : baseToString$1(value);
}
function isString(value) {
	return typeof value === "string";
}
function isNumber(value) {
	return typeof value === "number";
}
function isBoolean(value) {
	return value === true || value === false || isObjectLike$1(value) && getTag$1(value) == "[object Boolean]";
}
function isObject$3(value) {
	return typeof value === "object";
}
function isObjectLike$1(value) {
	return isObject$3(value) && value !== null;
}
function isDefined(value) {
	return value !== undefined && value !== null;
}
function isBlank(value) {
	return !value.trim().length;
}
function getTag$1(value) {
	return value == null ? value === undefined ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(value);
}
const INCORRECT_INDEX_TYPE = "Incorrect 'index' type";
const LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key) => `Invalid value for key ${key}`;
const PATTERN_LENGTH_TOO_LARGE = (max) => `Pattern length exceeds max of ${max}.`;
const MISSING_KEY_PROPERTY = (name) => `Missing ${name} property in key`;
const INVALID_KEY_WEIGHT_VALUE = (key) => `Property 'weight' in key '${key}' must be a positive integer`;
const hasOwn = Object.prototype.hasOwnProperty;
var KeyStore = class {
	constructor(keys$1) {
		this._keys = [];
		this._keyMap = {};
		let totalWeight = 0;
		keys$1.forEach((key) => {
			let obj = createKey(key);
			totalWeight += obj.weight;
			this._keys.push(obj);
			this._keyMap[obj.id] = obj;
			totalWeight += obj.weight;
		});
		this._keys.forEach((key) => {
			key.weight /= totalWeight;
		});
	}
	get(keyId) {
		return this._keyMap[keyId];
	}
	keys() {
		return this._keys;
	}
	toJSON() {
		return JSON.stringify(this._keys);
	}
};
function createKey(key) {
	let path = null;
	let id = null;
	let src = null;
	let weight = 1;
	let getFn = null;
	if (isString(key) || isArray$1(key)) {
		src = key;
		path = createKeyPath(key);
		id = createKeyId(key);
	} else {
		if (!hasOwn.call(key, "name")) throw new Error(MISSING_KEY_PROPERTY("name"));
		const name = key.name;
		src = name;
		if (hasOwn.call(key, "weight")) {
			weight = key.weight;
			if (weight <= 0) throw new Error(INVALID_KEY_WEIGHT_VALUE(name));
		}
		path = createKeyPath(name);
		id = createKeyId(name);
		getFn = key.getFn;
	}
	return {
		path,
		id,
		weight,
		src,
		getFn
	};
}
function createKeyPath(key) {
	return isArray$1(key) ? key : key.split(".");
}
function createKeyId(key) {
	return isArray$1(key) ? key.join(".") : key;
}
function get$1(obj, path) {
	let list = [];
	let arr = false;
	const deepGet = (obj$1, path$1, index$1) => {
		if (!isDefined(obj$1)) return;
		if (!path$1[index$1]) list.push(obj$1);
else {
			let key = path$1[index$1];
			const value = obj$1[key];
			if (!isDefined(value)) return;
			if (index$1 === path$1.length - 1 && (isString(value) || isNumber(value) || isBoolean(value))) list.push(toString$1(value));
else if (isArray$1(value)) {
				arr = true;
				for (let i = 0, len = value.length; i < len; i += 1) deepGet(value[i], path$1, index$1 + 1);
			} else if (path$1.length) deepGet(value, path$1, index$1 + 1);
		}
	};
	deepGet(obj, isString(path) ? path.split(".") : path, 0);
	return arr ? list : list[0];
}
const MatchOptions = {
	includeMatches: false,
	findAllMatches: false,
	minMatchCharLength: 1
};
const BasicOptions = {
	isCaseSensitive: false,
	includeScore: false,
	keys: [],
	shouldSort: true,
	sortFn: (a, b) => a.score === b.score ? a.idx < b.idx ? -1 : 1 : a.score < b.score ? -1 : 1
};
const FuzzyOptions = {
	location: 0,
	threshold: .6,
	distance: 100
};
const AdvancedOptions = {
	useExtendedSearch: false,
	getFn: get$1,
	ignoreLocation: false,
	ignoreFieldNorm: false,
	fieldNormWeight: 1
};
var Config = {
	...BasicOptions,
	...MatchOptions,
	...FuzzyOptions,
	...AdvancedOptions
};
const SPACE = /[^ ]+/g;
function norm(weight = 1, mantissa = 3) {
	const cache$1 = new Map();
	const m = Math.pow(10, mantissa);
	return {
		get(value) {
			const numTokens = value.match(SPACE).length;
			if (cache$1.has(numTokens)) return cache$1.get(numTokens);
			const norm$1 = 1 / Math.pow(numTokens, .5 * weight);
			const n = parseFloat(Math.round(norm$1 * m) / m);
			cache$1.set(numTokens, n);
			return n;
		},
		clear() {
			cache$1.clear();
		}
	};
}
var FuseIndex = class {
	constructor({ getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
		this.norm = norm(fieldNormWeight, 3);
		this.getFn = getFn;
		this.isCreated = false;
		this.setIndexRecords();
	}
	setSources(docs = []) {
		this.docs = docs;
	}
	setIndexRecords(records = []) {
		this.records = records;
	}
	setKeys(keys$1 = []) {
		this.keys = keys$1;
		this._keysMap = {};
		keys$1.forEach((key, idx) => {
			this._keysMap[key.id] = idx;
		});
	}
	create() {
		if (this.isCreated || !this.docs.length) return;
		this.isCreated = true;
		if (isString(this.docs[0])) this.docs.forEach((doc, docIndex) => {
			this._addString(doc, docIndex);
		});
else this.docs.forEach((doc, docIndex) => {
			this._addObject(doc, docIndex);
		});
		this.norm.clear();
	}
	add(doc) {
		const idx = this.size();
		if (isString(doc)) this._addString(doc, idx);
else this._addObject(doc, idx);
	}
	removeAt(idx) {
		this.records.splice(idx, 1);
		for (let i = idx, len = this.size(); i < len; i += 1) this.records[i].i -= 1;
	}
	getValueForItemAtKeyId(item, keyId) {
		return item[this._keysMap[keyId]];
	}
	size() {
		return this.records.length;
	}
	_addString(doc, docIndex) {
		if (!isDefined(doc) || isBlank(doc)) return;
		let record = {
			v: doc,
			i: docIndex,
			n: this.norm.get(doc)
		};
		this.records.push(record);
	}
	_addObject(doc, docIndex) {
		let record = {
			i: docIndex,
			$: {}
		};
		this.keys.forEach((key, keyIndex) => {
			let value = key.getFn ? key.getFn(doc) : this.getFn(doc, key.path);
			if (!isDefined(value)) return;
			if (isArray$1(value)) {
				let subRecords = [];
				const stack = [{
					nestedArrIndex: -1,
					value
				}];
				while (stack.length) {
					const { nestedArrIndex, value: value$1 } = stack.pop();
					if (!isDefined(value$1)) continue;
					if (isString(value$1) && !isBlank(value$1)) {
						let subRecord = {
							v: value$1,
							i: nestedArrIndex,
							n: this.norm.get(value$1)
						};
						subRecords.push(subRecord);
					} else if (isArray$1(value$1)) value$1.forEach((item, k) => {
						stack.push({
							nestedArrIndex: k,
							value: item
						});
					});
else;
				}
				record.$[keyIndex] = subRecords;
			} else if (isString(value) && !isBlank(value)) {
				let subRecord = {
					v: value,
					n: this.norm.get(value)
				};
				record.$[keyIndex] = subRecord;
			}
		});
		this.records.push(record);
	}
	toJSON() {
		return {
			keys: this.keys,
			records: this.records
		};
	}
};
function createIndex(keys$1, docs, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
	const myIndex = new FuseIndex({
		getFn,
		fieldNormWeight
	});
	myIndex.setKeys(keys$1.map(createKey));
	myIndex.setSources(docs);
	myIndex.create();
	return myIndex;
}
function parseIndex(data, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
	const { keys: keys$1, records } = data;
	const myIndex = new FuseIndex({
		getFn,
		fieldNormWeight
	});
	myIndex.setKeys(keys$1);
	myIndex.setIndexRecords(records);
	return myIndex;
}
function computeScore$1(pattern, { errors = 0, currentLocation = 0, expectedLocation = 0, distance = Config.distance, ignoreLocation = Config.ignoreLocation } = {}) {
	const accuracy = errors / pattern.length;
	if (ignoreLocation) return accuracy;
	const proximity = Math.abs(expectedLocation - currentLocation);
	if (!distance) return proximity ? 1 : accuracy;
	return accuracy + proximity / distance;
}
function convertMaskToIndices(matchmask = [], minMatchCharLength = Config.minMatchCharLength) {
	let indices = [];
	let start = -1;
	let end = -1;
	let i = 0;
	for (let len = matchmask.length; i < len; i += 1) {
		let match = matchmask[i];
		if (match && start === -1) start = i;
else if (!match && start !== -1) {
			end = i - 1;
			if (end - start + 1 >= minMatchCharLength) indices.push([start, end]);
			start = -1;
		}
	}
	if (matchmask[i - 1] && i - start >= minMatchCharLength) indices.push([start, i - 1]);
	return indices;
}
const MAX_BITS = 32;
function search(text, pattern, patternAlphabet, { location = Config.location, distance = Config.distance, threshold = Config.threshold, findAllMatches = Config.findAllMatches, minMatchCharLength = Config.minMatchCharLength, includeMatches = Config.includeMatches, ignoreLocation = Config.ignoreLocation } = {}) {
	if (pattern.length > MAX_BITS) throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS));
	const patternLen = pattern.length;
	const textLen = text.length;
	const expectedLocation = Math.max(0, Math.min(location, textLen));
	let currentThreshold = threshold;
	let bestLocation = expectedLocation;
	const computeMatches = minMatchCharLength > 1 || includeMatches;
	const matchMask = computeMatches ? Array(textLen) : [];
	let index$1;
	while ((index$1 = text.indexOf(pattern, bestLocation)) > -1) {
		let score = computeScore$1(pattern, {
			currentLocation: index$1,
			expectedLocation,
			distance,
			ignoreLocation
		});
		currentThreshold = Math.min(score, currentThreshold);
		bestLocation = index$1 + patternLen;
		if (computeMatches) {
			let i = 0;
			while (i < patternLen) {
				matchMask[index$1 + i] = 1;
				i += 1;
			}
		}
	}
	bestLocation = -1;
	let lastBitArr = [];
	let finalScore = 1;
	let binMax = patternLen + textLen;
	const mask = 1 << patternLen - 1;
	for (let i = 0; i < patternLen; i += 1) {
		let binMin = 0;
		let binMid = binMax;
		while (binMin < binMid) {
			const score$1 = computeScore$1(pattern, {
				errors: i,
				currentLocation: expectedLocation + binMid,
				expectedLocation,
				distance,
				ignoreLocation
			});
			if (score$1 <= currentThreshold) binMin = binMid;
else binMax = binMid;
			binMid = Math.floor((binMax - binMin) / 2 + binMin);
		}
		binMax = binMid;
		let start = Math.max(1, expectedLocation - binMid + 1);
		let finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen;
		let bitArr = Array(finish + 2);
		bitArr[finish + 1] = (1 << i) - 1;
		for (let j = finish; j >= start; j -= 1) {
			let currentLocation = j - 1;
			let charMatch = patternAlphabet[text.charAt(currentLocation)];
			if (computeMatches) matchMask[currentLocation] = +!!charMatch;
			bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch;
			if (i) bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
			if (bitArr[j] & mask) {
				finalScore = computeScore$1(pattern, {
					errors: i,
					currentLocation,
					expectedLocation,
					distance,
					ignoreLocation
				});
				if (finalScore <= currentThreshold) {
					currentThreshold = finalScore;
					bestLocation = currentLocation;
					if (bestLocation <= expectedLocation) break;
					start = Math.max(1, 2 * expectedLocation - bestLocation);
				}
			}
		}
		const score = computeScore$1(pattern, {
			errors: i + 1,
			currentLocation: expectedLocation,
			expectedLocation,
			distance,
			ignoreLocation
		});
		if (score > currentThreshold) break;
		lastBitArr = bitArr;
	}
	const result = {
		isMatch: bestLocation >= 0,
		score: Math.max(.001, finalScore)
	};
	if (computeMatches) {
		const indices = convertMaskToIndices(matchMask, minMatchCharLength);
		if (!indices.length) result.isMatch = false;
else if (includeMatches) result.indices = indices;
	}
	return result;
}
function createPatternAlphabet(pattern) {
	let mask = {};
	for (let i = 0, len = pattern.length; i < len; i += 1) {
		const char = pattern.charAt(i);
		mask[char] = (mask[char] || 0) | 1 << len - i - 1;
	}
	return mask;
}
var BitapSearch = class {
	constructor(pattern, { location = Config.location, threshold = Config.threshold, distance = Config.distance, includeMatches = Config.includeMatches, findAllMatches = Config.findAllMatches, minMatchCharLength = Config.minMatchCharLength, isCaseSensitive = Config.isCaseSensitive, ignoreLocation = Config.ignoreLocation } = {}) {
		this.options = {
			location,
			threshold,
			distance,
			includeMatches,
			findAllMatches,
			minMatchCharLength,
			isCaseSensitive,
			ignoreLocation
		};
		this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
		this.chunks = [];
		if (!this.pattern.length) return;
		const addChunk = (pattern$1, startIndex) => {
			this.chunks.push({
				pattern: pattern$1,
				alphabet: createPatternAlphabet(pattern$1),
				startIndex
			});
		};
		const len = this.pattern.length;
		if (len > MAX_BITS) {
			let i = 0;
			const remainder = len % MAX_BITS;
			const end = len - remainder;
			while (i < end) {
				addChunk(this.pattern.substr(i, MAX_BITS), i);
				i += MAX_BITS;
			}
			if (remainder) {
				const startIndex = len - MAX_BITS;
				addChunk(this.pattern.substr(startIndex), startIndex);
			}
		} else addChunk(this.pattern, 0);
	}
	searchIn(text) {
		const { isCaseSensitive, includeMatches } = this.options;
		if (!isCaseSensitive) text = text.toLowerCase();
		if (this.pattern === text) {
			let result$1 = {
				isMatch: true,
				score: 0
			};
			if (includeMatches) result$1.indices = [[0, text.length - 1]];
			return result$1;
		}
		const { location, distance, threshold, findAllMatches, minMatchCharLength, ignoreLocation } = this.options;
		let allIndices = [];
		let totalScore = 0;
		let hasMatches = false;
		this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
			const { isMatch, score, indices } = search(text, pattern, alphabet, {
				location: location + startIndex,
				distance,
				threshold,
				findAllMatches,
				minMatchCharLength,
				includeMatches,
				ignoreLocation
			});
			if (isMatch) hasMatches = true;
			totalScore += score;
			if (isMatch && indices) allIndices = [...allIndices, ...indices];
		});
		let result = {
			isMatch: hasMatches,
			score: hasMatches ? totalScore / this.chunks.length : 1
		};
		if (hasMatches && includeMatches) result.indices = allIndices;
		return result;
	}
};
var BaseMatch = class {
	constructor(pattern) {
		this.pattern = pattern;
	}
	static isMultiMatch(pattern) {
		return getMatch(pattern, this.multiRegex);
	}
	static isSingleMatch(pattern) {
		return getMatch(pattern, this.singleRegex);
	}
	search() {}
};
function getMatch(pattern, exp) {
	const matches = pattern.match(exp);
	return matches ? matches[1] : null;
}
var ExactMatch = class extends BaseMatch {
	constructor(pattern) {
		super(pattern);
	}
	static get type() {
		return "exact";
	}
	static get multiRegex() {
		return /^="(.*)"$/;
	}
	static get singleRegex() {
		return /^=(.*)$/;
	}
	search(text) {
		const isMatch = text === this.pattern;
		return {
			isMatch,
			score: isMatch ? 0 : 1,
			indices: [0, this.pattern.length - 1]
		};
	}
};
var InverseExactMatch = class extends BaseMatch {
	constructor(pattern) {
		super(pattern);
	}
	static get type() {
		return "inverse-exact";
	}
	static get multiRegex() {
		return /^!"(.*)"$/;
	}
	static get singleRegex() {
		return /^!(.*)$/;
	}
	search(text) {
		const index$1 = text.indexOf(this.pattern);
		const isMatch = index$1 === -1;
		return {
			isMatch,
			score: isMatch ? 0 : 1,
			indices: [0, text.length - 1]
		};
	}
};
var PrefixExactMatch = class extends BaseMatch {
	constructor(pattern) {
		super(pattern);
	}
	static get type() {
		return "prefix-exact";
	}
	static get multiRegex() {
		return /^\^"(.*)"$/;
	}
	static get singleRegex() {
		return /^\^(.*)$/;
	}
	search(text) {
		const isMatch = text.startsWith(this.pattern);
		return {
			isMatch,
			score: isMatch ? 0 : 1,
			indices: [0, this.pattern.length - 1]
		};
	}
};
var InversePrefixExactMatch = class extends BaseMatch {
	constructor(pattern) {
		super(pattern);
	}
	static get type() {
		return "inverse-prefix-exact";
	}
	static get multiRegex() {
		return /^!\^"(.*)"$/;
	}
	static get singleRegex() {
		return /^!\^(.*)$/;
	}
	search(text) {
		const isMatch = !text.startsWith(this.pattern);
		return {
			isMatch,
			score: isMatch ? 0 : 1,
			indices: [0, text.length - 1]
		};
	}
};
var SuffixExactMatch = class extends BaseMatch {
	constructor(pattern) {
		super(pattern);
	}
	static get type() {
		return "suffix-exact";
	}
	static get multiRegex() {
		return /^"(.*)"\$$/;
	}
	static get singleRegex() {
		return /^(.*)\$$/;
	}
	search(text) {
		const isMatch = text.endsWith(this.pattern);
		return {
			isMatch,
			score: isMatch ? 0 : 1,
			indices: [text.length - this.pattern.length, text.length - 1]
		};
	}
};
var InverseSuffixExactMatch = class extends BaseMatch {
	constructor(pattern) {
		super(pattern);
	}
	static get type() {
		return "inverse-suffix-exact";
	}
	static get multiRegex() {
		return /^!"(.*)"\$$/;
	}
	static get singleRegex() {
		return /^!(.*)\$$/;
	}
	search(text) {
		const isMatch = !text.endsWith(this.pattern);
		return {
			isMatch,
			score: isMatch ? 0 : 1,
			indices: [0, text.length - 1]
		};
	}
};
var FuzzyMatch = class extends BaseMatch {
	constructor(pattern, { location = Config.location, threshold = Config.threshold, distance = Config.distance, includeMatches = Config.includeMatches, findAllMatches = Config.findAllMatches, minMatchCharLength = Config.minMatchCharLength, isCaseSensitive = Config.isCaseSensitive, ignoreLocation = Config.ignoreLocation } = {}) {
		super(pattern);
		this._bitapSearch = new BitapSearch(pattern, {
			location,
			threshold,
			distance,
			includeMatches,
			findAllMatches,
			minMatchCharLength,
			isCaseSensitive,
			ignoreLocation
		});
	}
	static get type() {
		return "fuzzy";
	}
	static get multiRegex() {
		return /^"(.*)"$/;
	}
	static get singleRegex() {
		return /^(.*)$/;
	}
	search(text) {
		return this._bitapSearch.searchIn(text);
	}
};
var IncludeMatch = class extends BaseMatch {
	constructor(pattern) {
		super(pattern);
	}
	static get type() {
		return "include";
	}
	static get multiRegex() {
		return /^'"(.*)"$/;
	}
	static get singleRegex() {
		return /^'(.*)$/;
	}
	search(text) {
		let location = 0;
		let index$1;
		const indices = [];
		const patternLen = this.pattern.length;
		while ((index$1 = text.indexOf(this.pattern, location)) > -1) {
			location = index$1 + patternLen;
			indices.push([index$1, location - 1]);
		}
		const isMatch = !!indices.length;
		return {
			isMatch,
			score: isMatch ? 0 : 1,
			indices
		};
	}
};
const searchers = [
	ExactMatch,
	IncludeMatch,
	PrefixExactMatch,
	InversePrefixExactMatch,
	InverseSuffixExactMatch,
	SuffixExactMatch,
	InverseExactMatch,
	FuzzyMatch
];
const searchersLen = searchers.length;
const SPACE_RE = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
const OR_TOKEN = "|";
function parseQuery(pattern, options = {}) {
	return pattern.split(OR_TOKEN).map((item) => {
		let query = item.trim().split(SPACE_RE).filter((item$1) => item$1 && !!item$1.trim());
		let results = [];
		for (let i = 0, len = query.length; i < len; i += 1) {
			const queryItem = query[i];
			let found = false;
			let idx = -1;
			while (!found && ++idx < searchersLen) {
				const searcher = searchers[idx];
				let token = searcher.isMultiMatch(queryItem);
				if (token) {
					results.push(new searcher(token, options));
					found = true;
				}
			}
			if (found) continue;
			idx = -1;
			while (++idx < searchersLen) {
				const searcher = searchers[idx];
				let token = searcher.isSingleMatch(queryItem);
				if (token) {
					results.push(new searcher(token, options));
					break;
				}
			}
		}
		return results;
	});
}
const MultiMatchSet = new Set([FuzzyMatch.type, IncludeMatch.type]);
var ExtendedSearch = class {
	constructor(pattern, { isCaseSensitive = Config.isCaseSensitive, includeMatches = Config.includeMatches, minMatchCharLength = Config.minMatchCharLength, ignoreLocation = Config.ignoreLocation, findAllMatches = Config.findAllMatches, location = Config.location, threshold = Config.threshold, distance = Config.distance } = {}) {
		this.query = null;
		this.options = {
			isCaseSensitive,
			includeMatches,
			minMatchCharLength,
			findAllMatches,
			ignoreLocation,
			location,
			threshold,
			distance
		};
		this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
		this.query = parseQuery(this.pattern, this.options);
	}
	static condition(_, options) {
		return options.useExtendedSearch;
	}
	searchIn(text) {
		const query = this.query;
		if (!query) return {
			isMatch: false,
			score: 1
		};
		const { includeMatches, isCaseSensitive } = this.options;
		text = isCaseSensitive ? text : text.toLowerCase();
		let numMatches = 0;
		let allIndices = [];
		let totalScore = 0;
		for (let i = 0, qLen = query.length; i < qLen; i += 1) {
			const searchers$1 = query[i];
			allIndices.length = 0;
			numMatches = 0;
			for (let j = 0, pLen = searchers$1.length; j < pLen; j += 1) {
				const searcher = searchers$1[j];
				const { isMatch, indices, score } = searcher.search(text);
				if (isMatch) {
					numMatches += 1;
					totalScore += score;
					if (includeMatches) {
						const type = searcher.constructor.type;
						if (MultiMatchSet.has(type)) allIndices = [...allIndices, ...indices];
else allIndices.push(indices);
					}
				} else {
					totalScore = 0;
					numMatches = 0;
					allIndices.length = 0;
					break;
				}
			}
			if (numMatches) {
				let result = {
					isMatch: true,
					score: totalScore / numMatches
				};
				if (includeMatches) result.indices = allIndices;
				return result;
			}
		}
		return {
			isMatch: false,
			score: 1
		};
	}
};
const registeredSearchers = [];
function register(...args) {
	registeredSearchers.push(...args);
}
function createSearcher(pattern, options) {
	for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
		let searcherClass = registeredSearchers[i];
		if (searcherClass.condition(pattern, options)) return new searcherClass(pattern, options);
	}
	return new BitapSearch(pattern, options);
}
const LogicalOperator = {
	AND: "$and",
	OR: "$or"
};
const KeyType = {
	PATH: "$path",
	PATTERN: "$val"
};
const isExpression = (query) => !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);
const isPath = (query) => !!query[KeyType.PATH];
const isLeaf = (query) => !isArray$1(query) && isObject$3(query) && !isExpression(query);
const convertToExplicit = (query) => ({ [LogicalOperator.AND]: Object.keys(query).map((key) => ({ [key]: query[key] })) });
function parse(query, options, { auto = true } = {}) {
	const next = (query$1) => {
		let keys$1 = Object.keys(query$1);
		const isQueryPath = isPath(query$1);
		if (!isQueryPath && keys$1.length > 1 && !isExpression(query$1)) return next(convertToExplicit(query$1));
		if (isLeaf(query$1)) {
			const key = isQueryPath ? query$1[KeyType.PATH] : keys$1[0];
			const pattern = isQueryPath ? query$1[KeyType.PATTERN] : query$1[key];
			if (!isString(pattern)) throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key));
			const obj = {
				keyId: createKeyId(key),
				pattern
			};
			if (auto) obj.searcher = createSearcher(pattern, options);
			return obj;
		}
		let node = {
			children: [],
			operator: keys$1[0]
		};
		keys$1.forEach((key) => {
			const value = query$1[key];
			if (isArray$1(value)) value.forEach((item) => {
				node.children.push(next(item));
			});
		});
		return node;
	};
	if (!isExpression(query)) query = convertToExplicit(query);
	return next(query);
}
function computeScore(results, { ignoreFieldNorm = Config.ignoreFieldNorm }) {
	results.forEach((result) => {
		let totalScore = 1;
		result.matches.forEach(({ key, norm: norm$1, score }) => {
			const weight = key ? key.weight : null;
			totalScore *= Math.pow(score === 0 && weight ? Number.EPSILON : score, (weight || 1) * (ignoreFieldNorm ? 1 : norm$1));
		});
		result.score = totalScore;
	});
}
function transformMatches(result, data) {
	const matches = result.matches;
	data.matches = [];
	if (!isDefined(matches)) return;
	matches.forEach((match) => {
		if (!isDefined(match.indices) || !match.indices.length) return;
		const { indices, value } = match;
		let obj = {
			indices,
			value
		};
		if (match.key) obj.key = match.key.src;
		if (match.idx > -1) obj.refIndex = match.idx;
		data.matches.push(obj);
	});
}
function transformScore(result, data) {
	data.score = result.score;
}
function format(results, docs, { includeMatches = Config.includeMatches, includeScore = Config.includeScore } = {}) {
	const transformers = [];
	if (includeMatches) transformers.push(transformMatches);
	if (includeScore) transformers.push(transformScore);
	return results.map((result) => {
		const { idx } = result;
		const data = {
			item: docs[idx],
			refIndex: idx
		};
		if (transformers.length) transformers.forEach((transformer) => {
			transformer(result, data);
		});
		return data;
	});
}
var Fuse = class {
	constructor(docs, options = {}, index$1) {
		this.options = {
			...Config,
			...options
		};
		this._keyStore = new KeyStore(this.options.keys);
		this.setCollection(docs, index$1);
	}
	setCollection(docs, index$1) {
		this._docs = docs;
		if (index$1 && !(index$1 instanceof FuseIndex)) throw new Error(INCORRECT_INDEX_TYPE);
		this._myIndex = index$1 || createIndex(this.options.keys, this._docs, {
			getFn: this.options.getFn,
			fieldNormWeight: this.options.fieldNormWeight
		});
	}
	add(doc) {
		if (!isDefined(doc)) return;
		this._docs.push(doc);
		this._myIndex.add(doc);
	}
	remove(predicate = () => false) {
		const results = [];
		for (let i = 0, len = this._docs.length; i < len; i += 1) {
			const doc = this._docs[i];
			if (predicate(doc, i)) {
				this.removeAt(i);
				i -= 1;
				len -= 1;
				results.push(doc);
			}
		}
		return results;
	}
	removeAt(idx) {
		this._docs.splice(idx, 1);
		this._myIndex.removeAt(idx);
	}
	getIndex() {
		return this._myIndex;
	}
	search(query, { limit = -1 } = {}) {
		const { includeMatches, includeScore, shouldSort, sortFn, ignoreFieldNorm } = this.options;
		let results = isString(query) ? isString(this._docs[0]) ? this._searchStringList(query) : this._searchObjectList(query) : this._searchLogical(query);
		computeScore(results, { ignoreFieldNorm });
		if (shouldSort) results.sort(sortFn);
		if (isNumber(limit) && limit > -1) results = results.slice(0, limit);
		return format(results, this._docs, {
			includeMatches,
			includeScore
		});
	}
	_searchStringList(query) {
		const searcher = createSearcher(query, this.options);
		const { records } = this._myIndex;
		const results = [];
		records.forEach(({ v: text, i: idx, n: norm$1 }) => {
			if (!isDefined(text)) return;
			const { isMatch, score, indices } = searcher.searchIn(text);
			if (isMatch) results.push({
				item: text,
				idx,
				matches: [{
					score,
					value: text,
					norm: norm$1,
					indices
				}]
			});
		});
		return results;
	}
	_searchLogical(query) {
		const expression = parse(query, this.options);
		const evaluate = (node, item, idx) => {
			if (!node.children) {
				const { keyId, searcher } = node;
				const matches = this._findMatches({
					key: this._keyStore.get(keyId),
					value: this._myIndex.getValueForItemAtKeyId(item, keyId),
					searcher
				});
				if (matches && matches.length) return [{
					idx,
					item,
					matches
				}];
				return [];
			}
			const res = [];
			for (let i = 0, len = node.children.length; i < len; i += 1) {
				const child = node.children[i];
				const result = evaluate(child, item, idx);
				if (result.length) res.push(...result);
else if (node.operator === LogicalOperator.AND) return [];
			}
			return res;
		};
		const records = this._myIndex.records;
		const resultMap = {};
		const results = [];
		records.forEach(({ $: item, i: idx }) => {
			if (isDefined(item)) {
				let expResults = evaluate(expression, item, idx);
				if (expResults.length) {
					if (!resultMap[idx]) {
						resultMap[idx] = {
							idx,
							item,
							matches: []
						};
						results.push(resultMap[idx]);
					}
					expResults.forEach(({ matches }) => {
						resultMap[idx].matches.push(...matches);
					});
				}
			}
		});
		return results;
	}
	_searchObjectList(query) {
		const searcher = createSearcher(query, this.options);
		const { keys: keys$1, records } = this._myIndex;
		const results = [];
		records.forEach(({ $: item, i: idx }) => {
			if (!isDefined(item)) return;
			let matches = [];
			keys$1.forEach((key, keyIndex) => {
				matches.push(...this._findMatches({
					key,
					value: item[keyIndex],
					searcher
				}));
			});
			if (matches.length) results.push({
				idx,
				item,
				matches
			});
		});
		return results;
	}
	_findMatches({ key, value, searcher }) {
		if (!isDefined(value)) return [];
		let matches = [];
		if (isArray$1(value)) value.forEach(({ v: text, i: idx, n: norm$1 }) => {
			if (!isDefined(text)) return;
			const { isMatch, score, indices } = searcher.searchIn(text);
			if (isMatch) matches.push({
				score,
				key,
				value: text,
				idx,
				norm: norm$1,
				indices
			});
		});
else {
			const { v: text, n: norm$1 } = value;
			const { isMatch, score, indices } = searcher.searchIn(text);
			if (isMatch) matches.push({
				score,
				key,
				value: text,
				norm: norm$1,
				indices
			});
		}
		return matches;
	}
};
Fuse.version = "6.6.2";
Fuse.createIndex = createIndex;
Fuse.parseIndex = parseIndex;
Fuse.config = Config;
Fuse.parseQuery = parse;
register(ExtendedSearch);

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheClear.js
/**
* Removes all key-value entries from the list cache.
*
* @private
* @name clear
* @memberOf ListCache
*/
function listCacheClear() {
	this.__data__ = [];
	this.size = 0;
}
var _listCacheClear_default = listCacheClear;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/eq.js
/**
* Performs a
* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* comparison between two values to determine if they are equivalent.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
* @example
*
* var object = { 'a': 1 };
* var other = { 'a': 1 };
*
* _.eq(object, object);
* // => true
*
* _.eq(object, other);
* // => false
*
* _.eq('a', 'a');
* // => true
*
* _.eq('a', Object('a'));
* // => false
*
* _.eq(NaN, NaN);
* // => true
*/
function eq(value, other) {
	return value === other || value !== value && other !== other;
}
var eq_default = eq;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_assocIndexOf.js
/**
* Gets the index at which the `key` is found in `array` of key-value pairs.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} key The key to search for.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function assocIndexOf(array, key) {
	var length = array.length;
	while (length--) if (eq_default(array[length][0], key)) return length;
	return -1;
}
var _assocIndexOf_default = assocIndexOf;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheDelete.js
/** Used for built-in method references. */
var arrayProto = Array.prototype;
/** Built-in value references. */
var splice = arrayProto.splice;
/**
* Removes `key` and its value from the list cache.
*
* @private
* @name delete
* @memberOf ListCache
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function listCacheDelete(key) {
	var data = this.__data__, index$1 = _assocIndexOf_default(data, key);
	if (index$1 < 0) return false;
	var lastIndex = data.length - 1;
	if (index$1 == lastIndex) data.pop();
else splice.call(data, index$1, 1);
	--this.size;
	return true;
}
var _listCacheDelete_default = listCacheDelete;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheGet.js
/**
* Gets the list cache value for `key`.
*
* @private
* @name get
* @memberOf ListCache
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function listCacheGet(key) {
	var data = this.__data__, index$1 = _assocIndexOf_default(data, key);
	return index$1 < 0 ? undefined : data[index$1][1];
}
var _listCacheGet_default = listCacheGet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheHas.js
/**
* Checks if a list cache value for `key` exists.
*
* @private
* @name has
* @memberOf ListCache
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function listCacheHas(key) {
	return _assocIndexOf_default(this.__data__, key) > -1;
}
var _listCacheHas_default = listCacheHas;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheSet.js
/**
* Sets the list cache `key` to `value`.
*
* @private
* @name set
* @memberOf ListCache
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the list cache instance.
*/
function listCacheSet(key, value) {
	var data = this.__data__, index$1 = _assocIndexOf_default(data, key);
	if (index$1 < 0) {
		++this.size;
		data.push([key, value]);
	} else data[index$1][1] = value;
	return this;
}
var _listCacheSet_default = listCacheSet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_ListCache.js
/**
* Creates an list cache object.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function ListCache(entries) {
	var index$1 = -1, length = entries == null ? 0 : entries.length;
	this.clear();
	while (++index$1 < length) {
		var entry = entries[index$1];
		this.set(entry[0], entry[1]);
	}
}
ListCache.prototype.clear = _listCacheClear_default;
ListCache.prototype["delete"] = _listCacheDelete_default;
ListCache.prototype.get = _listCacheGet_default;
ListCache.prototype.has = _listCacheHas_default;
ListCache.prototype.set = _listCacheSet_default;
var _ListCache_default = ListCache;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackClear.js
/**
* Removes all key-value entries from the stack.
*
* @private
* @name clear
* @memberOf Stack
*/
function stackClear() {
	this.__data__ = new _ListCache_default();
	this.size = 0;
}
var _stackClear_default = stackClear;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackDelete.js
/**
* Removes `key` and its value from the stack.
*
* @private
* @name delete
* @memberOf Stack
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function stackDelete(key) {
	var data = this.__data__, result = data["delete"](key);
	this.size = data.size;
	return result;
}
var _stackDelete_default = stackDelete;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackGet.js
/**
* Gets the stack value for `key`.
*
* @private
* @name get
* @memberOf Stack
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function stackGet(key) {
	return this.__data__.get(key);
}
var _stackGet_default = stackGet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackHas.js
/**
* Checks if a stack value for `key` exists.
*
* @private
* @name has
* @memberOf Stack
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function stackHas(key) {
	return this.__data__.has(key);
}
var _stackHas_default = stackHas;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_freeGlobal.js
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var _freeGlobal_default = freeGlobal;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_root.js
/** Detect free variable `self`. */
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
/** Used as a reference to the global object. */
var root = _freeGlobal_default || freeSelf || Function("return this")();
var _root_default = root;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Symbol.js
/** Built-in value references. */
var Symbol$1 = _root_default.Symbol;
var _Symbol_default = Symbol$1;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getRawTag.js
/** Used for built-in method references. */
var objectProto$11 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$11.hasOwnProperty;
/**
* Used to resolve the
* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
* of values.
*/
var nativeObjectToString$1 = objectProto$11.toString;
/** Built-in value references. */
var symToStringTag$1 = _Symbol_default ? _Symbol_default.toStringTag : undefined;
/**
* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the raw `toStringTag`.
*/
function getRawTag(value) {
	var isOwn = hasOwnProperty$9.call(value, symToStringTag$1), tag = value[symToStringTag$1];
	try {
		value[symToStringTag$1] = undefined;
		var unmasked = true;
	} catch (e) {}
	var result = nativeObjectToString$1.call(value);
	if (unmasked) if (isOwn) value[symToStringTag$1] = tag;
else delete value[symToStringTag$1];
	return result;
}
var _getRawTag_default = getRawTag;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_objectToString.js
/** Used for built-in method references. */
var objectProto$10 = Object.prototype;
/**
* Used to resolve the
* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
* of values.
*/
var nativeObjectToString = objectProto$10.toString;
/**
* Converts `value` to a string using `Object.prototype.toString`.
*
* @private
* @param {*} value The value to convert.
* @returns {string} Returns the converted string.
*/
function objectToString(value) {
	return nativeObjectToString.call(value);
}
var _objectToString_default = objectToString;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseGetTag.js
/** `Object#toString` result references. */
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
/** Built-in value references. */
var symToStringTag = _Symbol_default ? _Symbol_default.toStringTag : undefined;
/**
* The base implementation of `getTag` without fallbacks for buggy environments.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the `toStringTag`.
*/
function baseGetTag(value) {
	if (value == null) return value === undefined ? undefinedTag : nullTag;
	return symToStringTag && symToStringTag in Object(value) ? _getRawTag_default(value) : _objectToString_default(value);
}
var _baseGetTag_default = baseGetTag;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isObject.js
/**
* Checks if `value` is the
* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an object, else `false`.
* @example
*
* _.isObject({});
* // => true
*
* _.isObject([1, 2, 3]);
* // => true
*
* _.isObject(_.noop);
* // => true
*
* _.isObject(null);
* // => false
*/
function isObject$2(value) {
	var type = typeof value;
	return value != null && (type == "object" || type == "function");
}
var isObject_default$1 = isObject$2;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isFunction.js
/** `Object#toString` result references. */
var asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
/**
* Checks if `value` is classified as a `Function` object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a function, else `false`.
* @example
*
* _.isFunction(_);
* // => true
*
* _.isFunction(/abc/);
* // => false
*/
function isFunction$1(value) {
	if (!isObject_default$1(value)) return false;
	var tag = _baseGetTag_default(value);
	return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var isFunction_default = isFunction$1;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_coreJsData.js
/** Used to detect overreaching core-js shims. */
var coreJsData = _root_default["__core-js_shared__"];
var _coreJsData_default = coreJsData;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isMasked.js
/** Used to detect methods masquerading as native. */
var maskSrcKey = function() {
	var uid = /[^.]+$/.exec(_coreJsData_default && _coreJsData_default.keys && _coreJsData_default.keys.IE_PROTO || "");
	return uid ? "Symbol(src)_1." + uid : "";
}();
/**
* Checks if `func` has its source masked.
*
* @private
* @param {Function} func The function to check.
* @returns {boolean} Returns `true` if `func` is masked, else `false`.
*/
function isMasked(func) {
	return !!maskSrcKey && maskSrcKey in func;
}
var _isMasked_default = isMasked;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_toSource.js
/** Used for built-in method references. */
var funcProto$1 = Function.prototype;
/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;
/**
* Converts `func` to its source code.
*
* @private
* @param {Function} func The function to convert.
* @returns {string} Returns the source code.
*/
function toSource(func) {
	if (func != null) {
		try {
			return funcToString$1.call(func);
		} catch (e) {}
		try {
			return func + "";
		} catch (e) {}
	}
	return "";
}
var _toSource_default = toSource;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsNative.js
/**
* Used to match `RegExp`
* [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
*/
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;
/** Used for built-in method references. */
var funcProto = Function.prototype, objectProto$9 = Object.prototype;
/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;
/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$9.hasOwnProperty;
/** Used to detect if a method is native. */
var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty$8).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
/**
* The base implementation of `_.isNative` without bad shim checks.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a native function,
*  else `false`.
*/
function baseIsNative(value) {
	if (!isObject_default$1(value) || _isMasked_default(value)) return false;
	var pattern = isFunction_default(value) ? reIsNative : reIsHostCtor;
	return pattern.test(_toSource_default(value));
}
var _baseIsNative_default = baseIsNative;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getValue.js
/**
* Gets the value at `key` of `object`.
*
* @private
* @param {Object} [object] The object to query.
* @param {string} key The key of the property to get.
* @returns {*} Returns the property value.
*/
function getValue(object, key) {
	return object == null ? undefined : object[key];
}
var _getValue_default = getValue;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getNative.js
/**
* Gets the native function at `key` of `object`.
*
* @private
* @param {Object} object The object to query.
* @param {string} key The key of the method to get.
* @returns {*} Returns the function if it's native, else `undefined`.
*/
function getNative(object, key) {
	var value = _getValue_default(object, key);
	return _baseIsNative_default(value) ? value : undefined;
}
var _getNative_default = getNative;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Map.js
var Map$1 = _getNative_default(_root_default, "Map");
var _Map_default = Map$1;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_nativeCreate.js
var nativeCreate = _getNative_default(Object, "create");
var _nativeCreate_default = nativeCreate;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashClear.js
/**
* Removes all key-value entries from the hash.
*
* @private
* @name clear
* @memberOf Hash
*/
function hashClear() {
	this.__data__ = _nativeCreate_default ? _nativeCreate_default(null) : {};
	this.size = 0;
}
var _hashClear_default = hashClear;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashDelete.js
/**
* Removes `key` and its value from the hash.
*
* @private
* @name delete
* @memberOf Hash
* @param {Object} hash The hash to modify.
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function hashDelete(key) {
	var result = this.has(key) && delete this.__data__[key];
	this.size -= result ? 1 : 0;
	return result;
}
var _hashDelete_default = hashDelete;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashGet.js
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
/** Used for built-in method references. */
var objectProto$8 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
/**
* Gets the hash value for `key`.
*
* @private
* @name get
* @memberOf Hash
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function hashGet(key) {
	var data = this.__data__;
	if (_nativeCreate_default) {
		var result = data[key];
		return result === HASH_UNDEFINED$2 ? undefined : result;
	}
	return hasOwnProperty$7.call(data, key) ? data[key] : undefined;
}
var _hashGet_default = hashGet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashHas.js
/** Used for built-in method references. */
var objectProto$7 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
/**
* Checks if a hash value for `key` exists.
*
* @private
* @name has
* @memberOf Hash
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function hashHas(key) {
	var data = this.__data__;
	return _nativeCreate_default ? data[key] !== undefined : hasOwnProperty$6.call(data, key);
}
var _hashHas_default = hashHas;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashSet.js
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
/**
* Sets the hash `key` to `value`.
*
* @private
* @name set
* @memberOf Hash
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the hash instance.
*/
function hashSet(key, value) {
	var data = this.__data__;
	this.size += this.has(key) ? 0 : 1;
	data[key] = _nativeCreate_default && value === undefined ? HASH_UNDEFINED$1 : value;
	return this;
}
var _hashSet_default = hashSet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Hash.js
/**
* Creates a hash object.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function Hash(entries) {
	var index$1 = -1, length = entries == null ? 0 : entries.length;
	this.clear();
	while (++index$1 < length) {
		var entry = entries[index$1];
		this.set(entry[0], entry[1]);
	}
}
Hash.prototype.clear = _hashClear_default;
Hash.prototype["delete"] = _hashDelete_default;
Hash.prototype.get = _hashGet_default;
Hash.prototype.has = _hashHas_default;
Hash.prototype.set = _hashSet_default;
var _Hash_default = Hash;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheClear.js
/**
* Removes all key-value entries from the map.
*
* @private
* @name clear
* @memberOf MapCache
*/
function mapCacheClear() {
	this.size = 0;
	this.__data__ = {
		"hash": new _Hash_default(),
		"map": new (_Map_default || _ListCache_default)(),
		"string": new _Hash_default()
	};
}
var _mapCacheClear_default = mapCacheClear;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isKeyable.js
/**
* Checks if `value` is suitable for use as unique object key.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is suitable, else `false`.
*/
function isKeyable(value) {
	var type = typeof value;
	return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
var _isKeyable_default = isKeyable;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getMapData.js
/**
* Gets the data for `map`.
*
* @private
* @param {Object} map The map to query.
* @param {string} key The reference key.
* @returns {*} Returns the map data.
*/
function getMapData(map, key) {
	var data = map.__data__;
	return _isKeyable_default(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
var _getMapData_default = getMapData;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheDelete.js
/**
* Removes `key` and its value from the map.
*
* @private
* @name delete
* @memberOf MapCache
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function mapCacheDelete(key) {
	var result = _getMapData_default(this, key)["delete"](key);
	this.size -= result ? 1 : 0;
	return result;
}
var _mapCacheDelete_default = mapCacheDelete;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheGet.js
/**
* Gets the map value for `key`.
*
* @private
* @name get
* @memberOf MapCache
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function mapCacheGet(key) {
	return _getMapData_default(this, key).get(key);
}
var _mapCacheGet_default = mapCacheGet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheHas.js
/**
* Checks if a map value for `key` exists.
*
* @private
* @name has
* @memberOf MapCache
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function mapCacheHas(key) {
	return _getMapData_default(this, key).has(key);
}
var _mapCacheHas_default = mapCacheHas;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheSet.js
/**
* Sets the map `key` to `value`.
*
* @private
* @name set
* @memberOf MapCache
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the map cache instance.
*/
function mapCacheSet(key, value) {
	var data = _getMapData_default(this, key), size = data.size;
	data.set(key, value);
	this.size += data.size == size ? 0 : 1;
	return this;
}
var _mapCacheSet_default = mapCacheSet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_MapCache.js
/**
* Creates a map cache object to store key-value pairs.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function MapCache(entries) {
	var index$1 = -1, length = entries == null ? 0 : entries.length;
	this.clear();
	while (++index$1 < length) {
		var entry = entries[index$1];
		this.set(entry[0], entry[1]);
	}
}
MapCache.prototype.clear = _mapCacheClear_default;
MapCache.prototype["delete"] = _mapCacheDelete_default;
MapCache.prototype.get = _mapCacheGet_default;
MapCache.prototype.has = _mapCacheHas_default;
MapCache.prototype.set = _mapCacheSet_default;
var _MapCache_default = MapCache;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackSet.js
/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE$1 = 200;
/**
* Sets the stack `key` to `value`.
*
* @private
* @name set
* @memberOf Stack
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the stack cache instance.
*/
function stackSet(key, value) {
	var data = this.__data__;
	if (data instanceof _ListCache_default) {
		var pairs = data.__data__;
		if (!_Map_default || pairs.length < LARGE_ARRAY_SIZE$1 - 1) {
			pairs.push([key, value]);
			this.size = ++data.size;
			return this;
		}
		data = this.__data__ = new _MapCache_default(pairs);
	}
	data.set(key, value);
	this.size = data.size;
	return this;
}
var _stackSet_default = stackSet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Stack.js
/**
* Creates a stack cache object to store key-value pairs.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function Stack(entries) {
	var data = this.__data__ = new _ListCache_default(entries);
	this.size = data.size;
}
Stack.prototype.clear = _stackClear_default;
Stack.prototype["delete"] = _stackDelete_default;
Stack.prototype.get = _stackGet_default;
Stack.prototype.has = _stackHas_default;
Stack.prototype.set = _stackSet_default;
var _Stack_default = Stack;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setCacheAdd.js
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = "__lodash_hash_undefined__";
/**
* Adds `value` to the array cache.
*
* @private
* @name add
* @memberOf SetCache
* @alias push
* @param {*} value The value to cache.
* @returns {Object} Returns the cache instance.
*/
function setCacheAdd(value) {
	this.__data__.set(value, HASH_UNDEFINED);
	return this;
}
var _setCacheAdd_default = setCacheAdd;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setCacheHas.js
/**
* Checks if `value` is in the array cache.
*
* @private
* @name has
* @memberOf SetCache
* @param {*} value The value to search for.
* @returns {number} Returns `true` if `value` is found, else `false`.
*/
function setCacheHas(value) {
	return this.__data__.has(value);
}
var _setCacheHas_default = setCacheHas;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_SetCache.js
/**
*
* Creates an array cache object to store unique values.
*
* @private
* @constructor
* @param {Array} [values] The values to cache.
*/
function SetCache(values) {
	var index$1 = -1, length = values == null ? 0 : values.length;
	this.__data__ = new _MapCache_default();
	while (++index$1 < length) this.add(values[index$1]);
}
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd_default;
SetCache.prototype.has = _setCacheHas_default;
var _SetCache_default = SetCache;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arraySome.js
/**
* A specialized version of `_.some` for arrays without support for iteratee
* shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {boolean} Returns `true` if any element passes the predicate check,
*  else `false`.
*/
function arraySome(array, predicate) {
	var index$1 = -1, length = array == null ? 0 : array.length;
	while (++index$1 < length) if (predicate(array[index$1], index$1, array)) return true;
	return false;
}
var _arraySome_default = arraySome;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_cacheHas.js
/**
* Checks if a `cache` value for `key` exists.
*
* @private
* @param {Object} cache The cache to query.
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function cacheHas(cache$1, key) {
	return cache$1.has(key);
}
var _cacheHas_default = cacheHas;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_equalArrays.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1, COMPARE_UNORDERED_FLAG$3 = 2;
/**
* A specialized version of `baseIsEqualDeep` for arrays with support for
* partial deep comparisons.
*
* @private
* @param {Array} array The array to compare.
* @param {Array} other The other array to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} stack Tracks traversed `array` and `other` objects.
* @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
*/
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
	var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array.length, othLength = other.length;
	if (arrLength != othLength && !(isPartial && othLength > arrLength)) return false;
	var arrStacked = stack.get(array);
	var othStacked = stack.get(other);
	if (arrStacked && othStacked) return arrStacked == other && othStacked == array;
	var index$1 = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new _SetCache_default() : undefined;
	stack.set(array, other);
	stack.set(other, array);
	while (++index$1 < arrLength) {
		var arrValue = array[index$1], othValue = other[index$1];
		if (customizer) {
			var compared = isPartial ? customizer(othValue, arrValue, index$1, other, array, stack) : customizer(arrValue, othValue, index$1, array, other, stack);
		}
		if (compared !== undefined) {
			if (compared) continue;
			result = false;
			break;
		}
		if (seen) {
			if (!_arraySome_default(other, function(othValue$1, othIndex) {
				if (!_cacheHas_default(seen, othIndex) && (arrValue === othValue$1 || equalFunc(arrValue, othValue$1, bitmask, customizer, stack))) return seen.push(othIndex);
			})) {
				result = false;
				break;
			}
		} else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
			result = false;
			break;
		}
	}
	stack["delete"](array);
	stack["delete"](other);
	return result;
}
var _equalArrays_default = equalArrays;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Uint8Array.js
/** Built-in value references. */
var Uint8Array$1 = _root_default.Uint8Array;
var _Uint8Array_default = Uint8Array$1;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapToArray.js
/**
* Converts `map` to its key-value pairs.
*
* @private
* @param {Object} map The map to convert.
* @returns {Array} Returns the key-value pairs.
*/
function mapToArray(map) {
	var index$1 = -1, result = Array(map.size);
	map.forEach(function(value, key) {
		result[++index$1] = [key, value];
	});
	return result;
}
var _mapToArray_default = mapToArray;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setToArray.js
/**
* Converts `set` to an array of its values.
*
* @private
* @param {Object} set The set to convert.
* @returns {Array} Returns the values.
*/
function setToArray(set) {
	var index$1 = -1, result = Array(set.size);
	set.forEach(function(value) {
		result[++index$1] = value;
	});
	return result;
}
var _setToArray_default = setToArray;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_equalByTag.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1, COMPARE_UNORDERED_FLAG$2 = 2;
/** `Object#toString` result references. */
var boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", mapTag$2 = "[object Map]", numberTag$1 = "[object Number]", regexpTag$1 = "[object RegExp]", setTag$2 = "[object Set]", stringTag$1 = "[object String]", symbolTag$1 = "[object Symbol]";
var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]";
/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol_default ? _Symbol_default.prototype : undefined, symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;
/**
* A specialized version of `baseIsEqualDeep` for comparing objects of
* the same `toStringTag`.
*
* **Note:** This function only supports comparing values with tags of
* `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
*
* @private
* @param {Object} object The object to compare.
* @param {Object} other The other object to compare.
* @param {string} tag The `toStringTag` of the objects to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} stack Tracks traversed `object` and `other` objects.
* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
*/
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
	switch (tag) {
		case dataViewTag$2:
			if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) return false;
			object = object.buffer;
			other = other.buffer;
		case arrayBufferTag$1:
			if (object.byteLength != other.byteLength || !equalFunc(new _Uint8Array_default(object), new _Uint8Array_default(other))) return false;
			return true;
		case boolTag$1:
		case dateTag$1:
		case numberTag$1: return eq_default(+object, +other);
		case errorTag$1: return object.name == other.name && object.message == other.message;
		case regexpTag$1:
		case stringTag$1: return object == other + "";
		case mapTag$2: var convert = _mapToArray_default;
		case setTag$2:
			var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
			convert || (convert = _setToArray_default);
			if (object.size != other.size && !isPartial) return false;
			var stacked = stack.get(object);
			if (stacked) return stacked == other;
			bitmask |= COMPARE_UNORDERED_FLAG$2;
			stack.set(object, other);
			var result = _equalArrays_default(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
			stack["delete"](object);
			return result;
		case symbolTag$1: if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other);
	}
	return false;
}
var _equalByTag_default = equalByTag;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayPush.js
/**
* Appends the elements of `values` to `array`.
*
* @private
* @param {Array} array The array to modify.
* @param {Array} values The values to append.
* @returns {Array} Returns `array`.
*/
function arrayPush(array, values) {
	var index$1 = -1, length = values.length, offset = array.length;
	while (++index$1 < length) array[offset + index$1] = values[index$1];
	return array;
}
var _arrayPush_default = arrayPush;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isArray.js
/**
* Checks if `value` is classified as an `Array` object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an array, else `false`.
* @example
*
* _.isArray([1, 2, 3]);
* // => true
*
* _.isArray(document.body.children);
* // => false
*
* _.isArray('abc');
* // => false
*
* _.isArray(_.noop);
* // => false
*/
var isArray = Array.isArray;
var isArray_default = isArray;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseGetAllKeys.js
/**
* The base implementation of `getAllKeys` and `getAllKeysIn` which uses
* `keysFunc` and `symbolsFunc` to get the enumerable property names and
* symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @param {Function} keysFunc The function to get the keys of `object`.
* @param {Function} symbolsFunc The function to get the symbols of `object`.
* @returns {Array} Returns the array of property names and symbols.
*/
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	var result = keysFunc(object);
	return isArray_default(object) ? result : _arrayPush_default(result, symbolsFunc(object));
}
var _baseGetAllKeys_default = baseGetAllKeys;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayFilter.js
/**
* A specialized version of `_.filter` for arrays without support for
* iteratee shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {Array} Returns the new filtered array.
*/
function arrayFilter(array, predicate) {
	var index$1 = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
	while (++index$1 < length) {
		var value = array[index$1];
		if (predicate(value, index$1, array)) result[resIndex++] = value;
	}
	return result;
}
var _arrayFilter_default = arrayFilter;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/stubArray.js
/**
* This method returns a new empty array.
*
* @static
* @memberOf _
* @since 4.13.0
* @category Util
* @returns {Array} Returns the new empty array.
* @example
*
* var arrays = _.times(2, _.stubArray);
*
* console.log(arrays);
* // => [[], []]
*
* console.log(arrays[0] === arrays[1]);
* // => false
*/
function stubArray() {
	return [];
}
var stubArray_default = stubArray;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getSymbols.js
/** Used for built-in method references. */
var objectProto$6 = Object.prototype;
/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
/**
* Creates an array of the own enumerable symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of symbols.
*/
var getSymbols = !nativeGetSymbols ? stubArray_default : function(object) {
	if (object == null) return [];
	object = Object(object);
	return _arrayFilter_default(nativeGetSymbols(object), function(symbol) {
		return propertyIsEnumerable$1.call(object, symbol);
	});
};
var _getSymbols_default = getSymbols;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseTimes.js
/**
* The base implementation of `_.times` without support for iteratee shorthands
* or max array length checks.
*
* @private
* @param {number} n The number of times to invoke `iteratee`.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns the array of results.
*/
function baseTimes(n, iteratee) {
	var index$1 = -1, result = Array(n);
	while (++index$1 < n) result[index$1] = iteratee(index$1);
	return result;
}
var _baseTimes_default = baseTimes;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isObjectLike.js
/**
* Checks if `value` is object-like. A value is object-like if it's not `null`
* and has a `typeof` result of "object".
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
* @example
*
* _.isObjectLike({});
* // => true
*
* _.isObjectLike([1, 2, 3]);
* // => true
*
* _.isObjectLike(_.noop);
* // => false
*
* _.isObjectLike(null);
* // => false
*/
function isObjectLike(value) {
	return value != null && typeof value == "object";
}
var isObjectLike_default = isObjectLike;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsArguments.js
/** `Object#toString` result references. */
var argsTag$2 = "[object Arguments]";
/**
* The base implementation of `_.isArguments`.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an `arguments` object,
*/
function baseIsArguments(value) {
	return isObjectLike_default(value) && _baseGetTag_default(value) == argsTag$2;
}
var _baseIsArguments_default = baseIsArguments;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isArguments.js
/** Used for built-in method references. */
var objectProto$5 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$5.hasOwnProperty;
/** Built-in value references. */
var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;
/**
* Checks if `value` is likely an `arguments` object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an `arguments` object,
*  else `false`.
* @example
*
* _.isArguments(function() { return arguments; }());
* // => true
*
* _.isArguments([1, 2, 3]);
* // => false
*/
var isArguments = _baseIsArguments_default(function() {
	return arguments;
}()) ? _baseIsArguments_default : function(value) {
	return isObjectLike_default(value) && hasOwnProperty$5.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
var isArguments_default = isArguments;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/stubFalse.js
/**
* This method returns `false`.
*
* @static
* @memberOf _
* @since 4.13.0
* @category Util
* @returns {boolean} Returns `false`.
* @example
*
* _.times(2, _.stubFalse);
* // => [false, false]
*/
function stubFalse() {
	return false;
}
var stubFalse_default = stubFalse;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isBuffer.js
/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
/** Built-in value references. */
var Buffer$1 = moduleExports$1 ? _root_default.Buffer : undefined;
var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : undefined;
/**
* Checks if `value` is a buffer.
*
* @static
* @memberOf _
* @since 4.3.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
* @example
*
* _.isBuffer(new Buffer(2));
* // => true
*
* _.isBuffer(new Uint8Array(2));
* // => false
*/
var isBuffer = nativeIsBuffer || stubFalse_default;
var isBuffer_default = isBuffer;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isIndex.js
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;
/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;
/**
* Checks if `value` is a valid array-like index.
*
* @private
* @param {*} value The value to check.
* @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
* @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
*/
function isIndex(value, length) {
	var type = typeof value;
	length = length == null ? MAX_SAFE_INTEGER$1 : length;
	return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
var _isIndex_default = isIndex;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isLength.js
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;
/**
* Checks if `value` is a valid array-like length.
*
* **Note:** This method is loosely based on
* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
* @example
*
* _.isLength(3);
* // => true
*
* _.isLength(Number.MIN_VALUE);
* // => false
*
* _.isLength(Infinity);
* // => false
*
* _.isLength('3');
* // => false
*/
function isLength(value) {
	return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
var isLength_default = isLength;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsTypedArray.js
/** `Object#toString` result references. */
var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag$1 = "[object Map]", numberTag = "[object Number]", objectTag$2 = "[object Object]", regexpTag = "[object RegExp]", setTag$1 = "[object Set]", stringTag = "[object String]", weakMapTag$1 = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag$1] = typedArrayTags[numberTag] = typedArrayTags[objectTag$2] = typedArrayTags[regexpTag] = typedArrayTags[setTag$1] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag$1] = false;
/**
* The base implementation of `_.isTypedArray` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
*/
function baseIsTypedArray(value) {
	return isObjectLike_default(value) && isLength_default(value.length) && !!typedArrayTags[_baseGetTag_default(value)];
}
var _baseIsTypedArray_default = baseIsTypedArray;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseUnary.js
/**
* The base implementation of `_.unary` without support for storing metadata.
*
* @private
* @param {Function} func The function to cap arguments for.
* @returns {Function} Returns the new capped function.
*/
function baseUnary(func) {
	return function(value) {
		return func(value);
	};
}
var _baseUnary_default = baseUnary;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_nodeUtil.js
/** Detect free variable `exports`. */
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;
/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal_default.process;
/** Used to access faster Node.js helpers. */
var nodeUtil = function() {
	try {
		var types = freeModule && freeModule.require && freeModule.require("util").types;
		if (types) return types;
		return freeProcess && freeProcess.binding && freeProcess.binding("util");
	} catch (e) {}
}();
var _nodeUtil_default = nodeUtil;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isTypedArray.js
var nodeIsTypedArray = _nodeUtil_default && _nodeUtil_default.isTypedArray;
/**
* Checks if `value` is classified as a typed array.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
* @example
*
* _.isTypedArray(new Uint8Array);
* // => true
*
* _.isTypedArray([]);
* // => false
*/
var isTypedArray = nodeIsTypedArray ? _baseUnary_default(nodeIsTypedArray) : _baseIsTypedArray_default;
var isTypedArray_default = isTypedArray;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayLikeKeys.js
/** Used for built-in method references. */
var objectProto$4 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
/**
* Creates an array of the enumerable property names of the array-like `value`.
*
* @private
* @param {*} value The value to query.
* @param {boolean} inherited Specify returning inherited property names.
* @returns {Array} Returns the array of property names.
*/
function arrayLikeKeys(value, inherited) {
	var isArr = isArray_default(value), isArg = !isArr && isArguments_default(value), isBuff = !isArr && !isArg && isBuffer_default(value), isType = !isArr && !isArg && !isBuff && isTypedArray_default(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? _baseTimes_default(value.length, String) : [], length = result.length;
	for (var key in value) if ((inherited || hasOwnProperty$4.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || _isIndex_default(key, length)))) result.push(key);
	return result;
}
var _arrayLikeKeys_default = arrayLikeKeys;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isPrototype.js
/** Used for built-in method references. */
var objectProto$3 = Object.prototype;
/**
* Checks if `value` is likely a prototype object.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
*/
function isPrototype(value) {
	var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$3;
	return value === proto;
}
var _isPrototype_default = isPrototype;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_overArg.js
/**
* Creates a unary function that invokes `func` with its argument transformed.
*
* @private
* @param {Function} func The function to wrap.
* @param {Function} transform The argument transform.
* @returns {Function} Returns the new function.
*/
function overArg(func, transform) {
	return function(arg) {
		return func(transform(arg));
	};
}
var _overArg_default = overArg;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_nativeKeys.js
var nativeKeys = _overArg_default(Object.keys, Object);
var _nativeKeys_default = nativeKeys;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseKeys.js
/** Used for built-in method references. */
var objectProto$2 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$2.hasOwnProperty;
/**
* The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
*/
function baseKeys(object) {
	if (!_isPrototype_default(object)) return _nativeKeys_default(object);
	var result = [];
	for (var key in Object(object)) if (hasOwnProperty$3.call(object, key) && key != "constructor") result.push(key);
	return result;
}
var _baseKeys_default = baseKeys;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isArrayLike.js
/**
* Checks if `value` is array-like. A value is considered array-like if it's
* not a function and has a `value.length` that's an integer greater than or
* equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is array-like, else `false`.
* @example
*
* _.isArrayLike([1, 2, 3]);
* // => true
*
* _.isArrayLike(document.body.children);
* // => true
*
* _.isArrayLike('abc');
* // => true
*
* _.isArrayLike(_.noop);
* // => false
*/
function isArrayLike(value) {
	return value != null && isLength_default(value.length) && !isFunction_default(value);
}
var isArrayLike_default = isArrayLike;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/keys.js
/**
* Creates an array of the own enumerable property names of `object`.
*
* **Note:** Non-object values are coerced to objects. See the
* [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
* for more details.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Object
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
* @example
*
* function Foo() {
*   this.a = 1;
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.keys(new Foo);
* // => ['a', 'b'] (iteration order is not guaranteed)
*
* _.keys('hi');
* // => ['0', '1']
*/
function keys(object) {
	return isArrayLike_default(object) ? _arrayLikeKeys_default(object) : _baseKeys_default(object);
}
var keys_default = keys;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getAllKeys.js
/**
* Creates an array of own enumerable property names and symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names and symbols.
*/
function getAllKeys(object) {
	return _baseGetAllKeys_default(object, keys_default, _getSymbols_default);
}
var _getAllKeys_default = getAllKeys;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_equalObjects.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;
/** Used for built-in method references. */
var objectProto$1 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$1.hasOwnProperty;
/**
* A specialized version of `baseIsEqualDeep` for objects with support for
* partial deep comparisons.
*
* @private
* @param {Object} object The object to compare.
* @param {Object} other The other object to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} stack Tracks traversed `object` and `other` objects.
* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
*/
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
	var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = _getAllKeys_default(object), objLength = objProps.length, othProps = _getAllKeys_default(other), othLength = othProps.length;
	if (objLength != othLength && !isPartial) return false;
	var index$1 = objLength;
	while (index$1--) {
		var key = objProps[index$1];
		if (!(isPartial ? key in other : hasOwnProperty$2.call(other, key))) return false;
	}
	var objStacked = stack.get(object);
	var othStacked = stack.get(other);
	if (objStacked && othStacked) return objStacked == other && othStacked == object;
	var result = true;
	stack.set(object, other);
	stack.set(other, object);
	var skipCtor = isPartial;
	while (++index$1 < objLength) {
		key = objProps[index$1];
		var objValue = object[key], othValue = other[key];
		if (customizer) {
			var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
		}
		if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
			result = false;
			break;
		}
		skipCtor || (skipCtor = key == "constructor");
	}
	if (result && !skipCtor) {
		var objCtor = object.constructor, othCtor = other.constructor;
		if (objCtor != othCtor && "constructor" in object && "constructor" in other && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) result = false;
	}
	stack["delete"](object);
	stack["delete"](other);
	return result;
}
var _equalObjects_default = equalObjects;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_DataView.js
var DataView = _getNative_default(_root_default, "DataView");
var _DataView_default = DataView;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Promise.js
var Promise$1 = _getNative_default(_root_default, "Promise");
var _Promise_default = Promise$1;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Set.js
var Set$1 = _getNative_default(_root_default, "Set");
var _Set_default = Set$1;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_WeakMap.js
var WeakMap = _getNative_default(_root_default, "WeakMap");
var _WeakMap_default = WeakMap;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getTag.js
/** `Object#toString` result references. */
var mapTag = "[object Map]", objectTag$1 = "[object Object]", promiseTag = "[object Promise]", setTag = "[object Set]", weakMapTag = "[object WeakMap]";
var dataViewTag = "[object DataView]";
/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource_default(_DataView_default), mapCtorString = _toSource_default(_Map_default), promiseCtorString = _toSource_default(_Promise_default), setCtorString = _toSource_default(_Set_default), weakMapCtorString = _toSource_default(_WeakMap_default);
/**
* Gets the `toStringTag` of `value`.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the `toStringTag`.
*/
var getTag = _baseGetTag_default;
if (_DataView_default && getTag(new _DataView_default(new ArrayBuffer(1))) != dataViewTag || _Map_default && getTag(new _Map_default()) != mapTag || _Promise_default && getTag(_Promise_default.resolve()) != promiseTag || _Set_default && getTag(new _Set_default()) != setTag || _WeakMap_default && getTag(new _WeakMap_default()) != weakMapTag) getTag = function(value) {
	var result = _baseGetTag_default(value), Ctor = result == objectTag$1 ? value.constructor : undefined, ctorString = Ctor ? _toSource_default(Ctor) : "";
	if (ctorString) switch (ctorString) {
		case dataViewCtorString: return dataViewTag;
		case mapCtorString: return mapTag;
		case promiseCtorString: return promiseTag;
		case setCtorString: return setTag;
		case weakMapCtorString: return weakMapTag;
	}
	return result;
};
var _getTag_default = getTag;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsEqualDeep.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;
/** `Object#toString` result references. */
var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
/** Used for built-in method references. */
var objectProto = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto.hasOwnProperty;
/**
* A specialized version of `baseIsEqual` for arrays and objects which performs
* deep comparisons and tracks traversed objects enabling objects with circular
* references to be compared.
*
* @private
* @param {Object} object The object to compare.
* @param {Object} other The other object to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} [stack] Tracks traversed `object` and `other` objects.
* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
*/
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
	var objIsArr = isArray_default(object), othIsArr = isArray_default(other), objTag = objIsArr ? arrayTag : _getTag_default(object), othTag = othIsArr ? arrayTag : _getTag_default(other);
	objTag = objTag == argsTag ? objectTag : objTag;
	othTag = othTag == argsTag ? objectTag : othTag;
	var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
	if (isSameTag && isBuffer_default(object)) {
		if (!isBuffer_default(other)) return false;
		objIsArr = true;
		objIsObj = false;
	}
	if (isSameTag && !objIsObj) {
		stack || (stack = new _Stack_default());
		return objIsArr || isTypedArray_default(object) ? _equalArrays_default(object, other, bitmask, customizer, equalFunc, stack) : _equalByTag_default(object, other, objTag, bitmask, customizer, equalFunc, stack);
	}
	if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
		var objIsWrapped = objIsObj && hasOwnProperty$1.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty$1.call(other, "__wrapped__");
		if (objIsWrapped || othIsWrapped) {
			var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
			stack || (stack = new _Stack_default());
			return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
		}
	}
	if (!isSameTag) return false;
	stack || (stack = new _Stack_default());
	return _equalObjects_default(object, other, bitmask, customizer, equalFunc, stack);
}
var _baseIsEqualDeep_default = baseIsEqualDeep;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsEqual.js
/**
* The base implementation of `_.isEqual` which supports partial comparisons
* and tracks traversed objects.
*
* @private
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @param {boolean} bitmask The bitmask flags.
*  1 - Unordered comparison
*  2 - Partial comparison
* @param {Function} [customizer] The function to customize comparisons.
* @param {Object} [stack] Tracks traversed `value` and `other` objects.
* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
*/
function baseIsEqual(value, other, bitmask, customizer, stack) {
	if (value === other) return true;
	if (value == null || other == null || !isObjectLike_default(value) && !isObjectLike_default(other)) return value !== value && other !== other;
	return _baseIsEqualDeep_default(value, other, bitmask, customizer, baseIsEqual, stack);
}
var _baseIsEqual_default = baseIsEqual;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsMatch.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
/**
* The base implementation of `_.isMatch` without support for iteratee shorthands.
*
* @private
* @param {Object} object The object to inspect.
* @param {Object} source The object of property values to match.
* @param {Array} matchData The property names, values, and compare flags to match.
* @param {Function} [customizer] The function to customize comparisons.
* @returns {boolean} Returns `true` if `object` is a match, else `false`.
*/
function baseIsMatch(object, source, matchData, customizer) {
	var index$1 = matchData.length, length = index$1, noCustomizer = !customizer;
	if (object == null) return !length;
	object = Object(object);
	while (index$1--) {
		var data = matchData[index$1];
		if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) return false;
	}
	while (++index$1 < length) {
		data = matchData[index$1];
		var key = data[0], objValue = object[key], srcValue = data[1];
		if (noCustomizer && data[2]) {
			if (objValue === undefined && !(key in object)) return false;
		} else {
			var stack = new _Stack_default();
			if (customizer) {
				var result = customizer(objValue, srcValue, key, object, source, stack);
			}
			if (!(result === undefined ? _baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) return false;
		}
	}
	return true;
}
var _baseIsMatch_default = baseIsMatch;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isStrictComparable.js
/**
* Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` if suitable for strict
*  equality comparisons, else `false`.
*/
function isStrictComparable(value) {
	return value === value && !isObject_default$1(value);
}
var _isStrictComparable_default = isStrictComparable;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getMatchData.js
/**
* Gets the property names, values, and compare flags of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the match data of `object`.
*/
function getMatchData(object) {
	var result = keys_default(object), length = result.length;
	while (length--) {
		var key = result[length], value = object[key];
		result[length] = [
			key,
			value,
			_isStrictComparable_default(value)
		];
	}
	return result;
}
var _getMatchData_default = getMatchData;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_matchesStrictComparable.js
/**
* A specialized version of `matchesProperty` for source values suitable
* for strict equality comparisons, i.e. `===`.
*
* @private
* @param {string} key The key of the property to get.
* @param {*} srcValue The value to match.
* @returns {Function} Returns the new spec function.
*/
function matchesStrictComparable(key, srcValue) {
	return function(object) {
		if (object == null) return false;
		return object[key] === srcValue && (srcValue !== undefined || key in Object(object));
	};
}
var _matchesStrictComparable_default = matchesStrictComparable;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseMatches.js
/**
* The base implementation of `_.matches` which doesn't clone `source`.
*
* @private
* @param {Object} source The object of property values to match.
* @returns {Function} Returns the new spec function.
*/
function baseMatches(source) {
	var matchData = _getMatchData_default(source);
	if (matchData.length == 1 && matchData[0][2]) return _matchesStrictComparable_default(matchData[0][0], matchData[0][1]);
	return function(object) {
		return object === source || _baseIsMatch_default(object, source, matchData);
	};
}
var _baseMatches_default = baseMatches;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isSymbol.js
/** `Object#toString` result references. */
var symbolTag = "[object Symbol]";
/**
* Checks if `value` is classified as a `Symbol` primitive or object.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
* @example
*
* _.isSymbol(Symbol.iterator);
* // => true
*
* _.isSymbol('abc');
* // => false
*/
function isSymbol(value) {
	return typeof value == "symbol" || isObjectLike_default(value) && _baseGetTag_default(value) == symbolTag;
}
var isSymbol_default = isSymbol;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isKey.js
/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
/**
* Checks if `value` is a property name and not a property path.
*
* @private
* @param {*} value The value to check.
* @param {Object} [object] The object to query keys on.
* @returns {boolean} Returns `true` if `value` is a property name, else `false`.
*/
function isKey(value, object) {
	if (isArray_default(value)) return false;
	var type = typeof value;
	if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol_default(value)) return true;
	return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
var _isKey_default = isKey;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/memoize.js
/** Error message constants. */
var FUNC_ERROR_TEXT$1 = "Expected a function";
/**
* Creates a function that memoizes the result of `func`. If `resolver` is
* provided, it determines the cache key for storing the result based on the
* arguments provided to the memoized function. By default, the first argument
* provided to the memoized function is used as the map cache key. The `func`
* is invoked with the `this` binding of the memoized function.
*
* **Note:** The cache is exposed as the `cache` property on the memoized
* function. Its creation may be customized by replacing the `_.memoize.Cache`
* constructor with one whose instances implement the
* [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
* method interface of `clear`, `delete`, `get`, `has`, and `set`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Function
* @param {Function} func The function to have its output memoized.
* @param {Function} [resolver] The function to resolve the cache key.
* @returns {Function} Returns the new memoized function.
* @example
*
* var object = { 'a': 1, 'b': 2 };
* var other = { 'c': 3, 'd': 4 };
*
* var values = _.memoize(_.values);
* values(object);
* // => [1, 2]
*
* values(other);
* // => [3, 4]
*
* object.a = 2;
* values(object);
* // => [1, 2]
*
* // Modify the result cache.
* values.cache.set(object, ['a', 'b']);
* values(object);
* // => ['a', 'b']
*
* // Replace `_.memoize.Cache`.
* _.memoize.Cache = WeakMap;
*/
function memoize(func, resolver) {
	if (typeof func != "function" || resolver != null && typeof resolver != "function") throw new TypeError(FUNC_ERROR_TEXT$1);
	var memoized = function() {
		var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache$1 = memoized.cache;
		if (cache$1.has(key)) return cache$1.get(key);
		var result = func.apply(this, args);
		memoized.cache = cache$1.set(key, result) || cache$1;
		return result;
	};
	memoized.cache = new (memoize.Cache || _MapCache_default)();
	return memoized;
}
memoize.Cache = _MapCache_default;
var memoize_default = memoize;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_memoizeCapped.js
/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;
/**
* A specialized version of `_.memoize` which clears the memoized function's
* cache when it exceeds `MAX_MEMOIZE_SIZE`.
*
* @private
* @param {Function} func The function to have its output memoized.
* @returns {Function} Returns the new memoized function.
*/
function memoizeCapped(func) {
	var result = memoize_default(func, function(key) {
		if (cache$1.size === MAX_MEMOIZE_SIZE) cache$1.clear();
		return key;
	});
	var cache$1 = result.cache;
	return result;
}
var _memoizeCapped_default = memoizeCapped;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stringToPath.js
/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;
/**
* Converts `string` to a property path array.
*
* @private
* @param {string} string The string to convert.
* @returns {Array} Returns the property path array.
*/
var stringToPath = _memoizeCapped_default(function(string) {
	var result = [];
	if (string.charCodeAt(0) === 46) result.push("");
	string.replace(rePropName, function(match, number, quote, subString) {
		result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
	});
	return result;
});
var _stringToPath_default = stringToPath;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayMap.js
/**
* A specialized version of `_.map` for arrays without support for iteratee
* shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns the new mapped array.
*/
function arrayMap(array, iteratee) {
	var index$1 = -1, length = array == null ? 0 : array.length, result = Array(length);
	while (++index$1 < length) result[index$1] = iteratee(array[index$1], index$1, array);
	return result;
}
var _arrayMap_default = arrayMap;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseToString.js
/** Used as references for various `Number` constants. */
var INFINITY$2 = Infinity;
/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol_default ? _Symbol_default.prototype : undefined, symbolToString = symbolProto ? symbolProto.toString : undefined;
/**
* The base implementation of `_.toString` which doesn't convert nullish
* values to empty strings.
*
* @private
* @param {*} value The value to process.
* @returns {string} Returns the string.
*/
function baseToString(value) {
	if (typeof value == "string") return value;
	if (isArray_default(value)) return _arrayMap_default(value, baseToString) + "";
	if (isSymbol_default(value)) return symbolToString ? symbolToString.call(value) : "";
	var result = value + "";
	return result == "0" && 1 / value == -INFINITY$2 ? "-0" : result;
}
var _baseToString_default = baseToString;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/toString.js
/**
* Converts `value` to a string. An empty string is returned for `null`
* and `undefined` values. The sign of `-0` is preserved.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to convert.
* @returns {string} Returns the converted string.
* @example
*
* _.toString(null);
* // => ''
*
* _.toString(-0);
* // => '-0'
*
* _.toString([1, 2, 3]);
* // => '1,2,3'
*/
function toString(value) {
	return value == null ? "" : _baseToString_default(value);
}
var toString_default = toString;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_castPath.js
/**
* Casts `value` to a path array if it's not one.
*
* @private
* @param {*} value The value to inspect.
* @param {Object} [object] The object to query keys on.
* @returns {Array} Returns the cast property path array.
*/
function castPath(value, object) {
	if (isArray_default(value)) return value;
	return _isKey_default(value, object) ? [value] : _stringToPath_default(toString_default(value));
}
var _castPath_default = castPath;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_toKey.js
/** Used as references for various `Number` constants. */
var INFINITY$1 = Infinity;
/**
* Converts `value` to a string key if it's not a string or symbol.
*
* @private
* @param {*} value The value to inspect.
* @returns {string|symbol} Returns the key.
*/
function toKey(value) {
	if (typeof value == "string" || isSymbol_default(value)) return value;
	var result = value + "";
	return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
}
var _toKey_default = toKey;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseGet.js
/**
* The base implementation of `_.get` without support for default values.
*
* @private
* @param {Object} object The object to query.
* @param {Array|string} path The path of the property to get.
* @returns {*} Returns the resolved value.
*/
function baseGet(object, path) {
	path = _castPath_default(path, object);
	var index$1 = 0, length = path.length;
	while (object != null && index$1 < length) object = object[_toKey_default(path[index$1++])];
	return index$1 && index$1 == length ? object : undefined;
}
var _baseGet_default = baseGet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/get.js
/**
* Gets the value at `path` of `object`. If the resolved value is
* `undefined`, the `defaultValue` is returned in its place.
*
* @static
* @memberOf _
* @since 3.7.0
* @category Object
* @param {Object} object The object to query.
* @param {Array|string} path The path of the property to get.
* @param {*} [defaultValue] The value returned for `undefined` resolved values.
* @returns {*} Returns the resolved value.
* @example
*
* var object = { 'a': [{ 'b': { 'c': 3 } }] };
*
* _.get(object, 'a[0].b.c');
* // => 3
*
* _.get(object, ['a', '0', 'b', 'c']);
* // => 3
*
* _.get(object, 'a.b.c', 'default');
* // => 'default'
*/
function get(object, path, defaultValue) {
	var result = object == null ? undefined : _baseGet_default(object, path);
	return result === undefined ? defaultValue : result;
}
var get_default = get;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseHasIn.js
/**
* The base implementation of `_.hasIn` without support for deep paths.
*
* @private
* @param {Object} [object] The object to query.
* @param {Array|string} key The key to check.
* @returns {boolean} Returns `true` if `key` exists, else `false`.
*/
function baseHasIn(object, key) {
	return object != null && key in Object(object);
}
var _baseHasIn_default = baseHasIn;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hasPath.js
/**
* Checks if `path` exists on `object`.
*
* @private
* @param {Object} object The object to query.
* @param {Array|string} path The path to check.
* @param {Function} hasFunc The function to check properties.
* @returns {boolean} Returns `true` if `path` exists, else `false`.
*/
function hasPath(object, path, hasFunc) {
	path = _castPath_default(path, object);
	var index$1 = -1, length = path.length, result = false;
	while (++index$1 < length) {
		var key = _toKey_default(path[index$1]);
		if (!(result = object != null && hasFunc(object, key))) break;
		object = object[key];
	}
	if (result || ++index$1 != length) return result;
	length = object == null ? 0 : object.length;
	return !!length && isLength_default(length) && _isIndex_default(key, length) && (isArray_default(object) || isArguments_default(object));
}
var _hasPath_default = hasPath;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/hasIn.js
/**
* Checks if `path` is a direct or inherited property of `object`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Object
* @param {Object} object The object to query.
* @param {Array|string} path The path to check.
* @returns {boolean} Returns `true` if `path` exists, else `false`.
* @example
*
* var object = _.create({ 'a': _.create({ 'b': 2 }) });
*
* _.hasIn(object, 'a');
* // => true
*
* _.hasIn(object, 'a.b');
* // => true
*
* _.hasIn(object, ['a', 'b']);
* // => true
*
* _.hasIn(object, 'b');
* // => false
*/
function hasIn(object, path) {
	return object != null && _hasPath_default(object, path, _baseHasIn_default);
}
var hasIn_default = hasIn;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseMatchesProperty.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
/**
* The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
*
* @private
* @param {string} path The path of the property to get.
* @param {*} srcValue The value to match.
* @returns {Function} Returns the new spec function.
*/
function baseMatchesProperty(path, srcValue) {
	if (_isKey_default(path) && _isStrictComparable_default(srcValue)) return _matchesStrictComparable_default(_toKey_default(path), srcValue);
	return function(object) {
		var objValue = get_default(object, path);
		return objValue === undefined && objValue === srcValue ? hasIn_default(object, path) : _baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
	};
}
var _baseMatchesProperty_default = baseMatchesProperty;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/identity.js
/**
* This method returns the first argument it receives.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Util
* @param {*} value Any value.
* @returns {*} Returns `value`.
* @example
*
* var object = { 'a': 1 };
*
* console.log(_.identity(object) === object);
* // => true
*/
function identity(value) {
	return value;
}
var identity_default = identity;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseProperty.js
/**
* The base implementation of `_.property` without support for deep paths.
*
* @private
* @param {string} key The key of the property to get.
* @returns {Function} Returns the new accessor function.
*/
function baseProperty(key) {
	return function(object) {
		return object == null ? undefined : object[key];
	};
}
var _baseProperty_default = baseProperty;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_basePropertyDeep.js
/**
* A specialized version of `baseProperty` which supports deep paths.
*
* @private
* @param {Array|string} path The path of the property to get.
* @returns {Function} Returns the new accessor function.
*/
function basePropertyDeep(path) {
	return function(object) {
		return _baseGet_default(object, path);
	};
}
var _basePropertyDeep_default = basePropertyDeep;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/property.js
/**
* Creates a function that returns the value at `path` of a given object.
*
* @static
* @memberOf _
* @since 2.4.0
* @category Util
* @param {Array|string} path The path of the property to get.
* @returns {Function} Returns the new accessor function.
* @example
*
* var objects = [
*   { 'a': { 'b': 2 } },
*   { 'a': { 'b': 1 } }
* ];
*
* _.map(objects, _.property('a.b'));
* // => [2, 1]
*
* _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
* // => [1, 2]
*/
function property(path) {
	return _isKey_default(path) ? _baseProperty_default(_toKey_default(path)) : _basePropertyDeep_default(path);
}
var property_default = property;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIteratee.js
/**
* The base implementation of `_.iteratee`.
*
* @private
* @param {*} [value=_.identity] The value to convert to an iteratee.
* @returns {Function} Returns the iteratee.
*/
function baseIteratee(value) {
	if (typeof value == "function") return value;
	if (value == null) return identity_default;
	if (typeof value == "object") return isArray_default(value) ? _baseMatchesProperty_default(value[0], value[1]) : _baseMatches_default(value);
	return property_default(value);
}
var _baseIteratee_default = baseIteratee;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseFindIndex.js
/**
* The base implementation of `_.findIndex` and `_.findLastIndex` without
* support for iteratee shorthands.
*
* @private
* @param {Array} array The array to inspect.
* @param {Function} predicate The function invoked per iteration.
* @param {number} fromIndex The index to search from.
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function baseFindIndex(array, predicate, fromIndex, fromRight) {
	var length = array.length, index$1 = fromIndex + (fromRight ? 1 : -1);
	while (fromRight ? index$1-- : ++index$1 < length) if (predicate(array[index$1], index$1, array)) return index$1;
	return -1;
}
var _baseFindIndex_default = baseFindIndex;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsNaN.js
/**
* The base implementation of `_.isNaN` without support for number objects.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
*/
function baseIsNaN(value) {
	return value !== value;
}
var _baseIsNaN_default = baseIsNaN;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_strictIndexOf.js
/**
* A specialized version of `_.indexOf` which performs strict equality
* comparisons of values, i.e. `===`.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} value The value to search for.
* @param {number} fromIndex The index to search from.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function strictIndexOf(array, value, fromIndex) {
	var index$1 = fromIndex - 1, length = array.length;
	while (++index$1 < length) if (array[index$1] === value) return index$1;
	return -1;
}
var _strictIndexOf_default = strictIndexOf;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIndexOf.js
/**
* The base implementation of `_.indexOf` without `fromIndex` bounds checks.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} value The value to search for.
* @param {number} fromIndex The index to search from.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function baseIndexOf(array, value, fromIndex) {
	return value === value ? _strictIndexOf_default(array, value, fromIndex) : _baseFindIndex_default(array, _baseIsNaN_default, fromIndex);
}
var _baseIndexOf_default = baseIndexOf;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayIncludes.js
/**
* A specialized version of `_.includes` for arrays without support for
* specifying an index to search from.
*
* @private
* @param {Array} [array] The array to inspect.
* @param {*} target The value to search for.
* @returns {boolean} Returns `true` if `target` is found, else `false`.
*/
function arrayIncludes(array, value) {
	var length = array == null ? 0 : array.length;
	return !!length && _baseIndexOf_default(array, value, 0) > -1;
}
var _arrayIncludes_default = arrayIncludes;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayIncludesWith.js
/**
* This function is like `arrayIncludes` except that it accepts a comparator.
*
* @private
* @param {Array} [array] The array to inspect.
* @param {*} target The value to search for.
* @param {Function} comparator The comparator invoked per element.
* @returns {boolean} Returns `true` if `target` is found, else `false`.
*/
function arrayIncludesWith(array, value, comparator) {
	var index$1 = -1, length = array == null ? 0 : array.length;
	while (++index$1 < length) if (comparator(value, array[index$1])) return true;
	return false;
}
var _arrayIncludesWith_default = arrayIncludesWith;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/noop.js
/**
* This method returns `undefined`.
*
* @static
* @memberOf _
* @since 2.3.0
* @category Util
* @example
*
* _.times(2, _.noop);
* // => [undefined, undefined]
*/
function noop() {}
var noop_default = noop;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createSet.js
/** Used as references for various `Number` constants. */
var INFINITY = Infinity;
/**
* Creates a set object of `values`.
*
* @private
* @param {Array} values The values to add to the set.
* @returns {Object} Returns the new set.
*/
var createSet = !(_Set_default && 1 / _setToArray_default(new _Set_default([, -0]))[1] == INFINITY) ? noop_default : function(values) {
	return new _Set_default(values);
};
var _createSet_default = createSet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseUniq.js
/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;
/**
* The base implementation of `_.uniqBy` without support for iteratee shorthands.
*
* @private
* @param {Array} array The array to inspect.
* @param {Function} [iteratee] The iteratee invoked per element.
* @param {Function} [comparator] The comparator invoked per element.
* @returns {Array} Returns the new duplicate free array.
*/
function baseUniq(array, iteratee, comparator) {
	var index$1 = -1, includes = _arrayIncludes_default, length = array.length, isCommon = true, result = [], seen = result;
	if (comparator) {
		isCommon = false;
		includes = _arrayIncludesWith_default;
	} else if (length >= LARGE_ARRAY_SIZE) {
		var set = iteratee ? null : _createSet_default(array);
		if (set) return _setToArray_default(set);
		isCommon = false;
		includes = _cacheHas_default;
		seen = new _SetCache_default();
	} else seen = iteratee ? [] : result;
	outer: while (++index$1 < length) {
		var value = array[index$1], computed = iteratee ? iteratee(value) : value;
		value = comparator || value !== 0 ? value : 0;
		if (isCommon && computed === computed) {
			var seenIndex = seen.length;
			while (seenIndex--) if (seen[seenIndex] === computed) continue outer;
			if (iteratee) seen.push(computed);
			result.push(value);
		} else if (!includes(seen, computed, comparator)) {
			if (seen !== result) seen.push(computed);
			result.push(value);
		}
	}
	return result;
}
var _baseUniq_default = baseUniq;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/uniqBy.js
/**
* This method is like `_.uniq` except that it accepts `iteratee` which is
* invoked for each element in `array` to generate the criterion by which
* uniqueness is computed. The order of result values is determined by the
* order they occur in the array. The iteratee is invoked with one argument:
* (value).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} array The array to inspect.
* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
* @returns {Array} Returns the new duplicate free array.
* @example
*
* _.uniqBy([2.1, 1.2, 2.3], Math.floor);
* // => [2.1, 1.2]
*
* // The `_.property` iteratee shorthand.
* _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
* // => [{ 'x': 1 }, { 'x': 2 }]
*/
function uniqBy(array, iteratee) {
	return array && array.length ? _baseUniq_default(array, _baseIteratee_default(iteratee, 2)) : [];
}
var uniqBy_default = uniqBy;

//#endregion
//#region plugins/snazzy-shelter/src/util/fuzzy.js
const fuseOptions = {
	threshold: .5,
	useExtendedSearch: true,
	keys: [
		"name",
		"author",
		"description"
	]
};
const fuzzy = (set, search$1) => !search$1 || search$1 === "" ? set : new Fuse(set, fuseOptions).search(search$1).map((searchResult) => searchResult.item);
const fuzzyThemes = (themes, search$1, filterMode) => fuzzy(uniqBy_default(themes ?? [], (t) => t.url), search$1).filter((t) => filterMode === "0" || filterMode === "1" && !t.compat || filterMode === "2" && t.compat);

//#endregion
//#region plugins/snazzy-shelter/src/components/SearchBar.jsx
var import_web$65 = __toESM(require_web());
var SearchBar_default = (props) => (0, import_web$65.createComponent)(shelter.ui.TextBox, {
	get value() {
		return props.query;
	},
	get onInput() {
		return props.onChange;
	},
	placeholder: "Search themes..."
});

//#endregion
//#region plugins/snazzy-shelter/src/components/CompatFilterDropdown.jsx
var import_web$59 = __toESM(require_web());
var import_web$60 = __toESM(require_web());
var import_web$61 = __toESM(require_web());
var import_web$62 = __toESM(require_web());
var import_web$63 = __toESM(require_web());
var import_web$64 = __toESM(require_web());
const _tmpl$$10 = /*#__PURE__*/ (0, import_web$59.template)(`<select></select>`, 2), _tmpl$2$2 = /*#__PURE__*/ (0, import_web$59.template)(`<option></option>`, 2);
const SingleSelect = (props) => (() => {
	const _el$ = (0, import_web$62.getNextElement)(_tmpl$$10);
	_el$.addEventListener("change", (e) => props.onChange(e.target.value));
	(0, import_web$63.insert)(_el$, () => props.options.map((opt) => (() => {
		const _el$2 = (0, import_web$62.getNextElement)(_tmpl$2$2);
		(0, import_web$63.insert)(_el$2, () => opt.label);
		(0, import_web$64.effect)(() => _el$2.value = opt.value);
		return _el$2;
	})()));
	(0, import_web$64.effect)((_p$) => {
		const _v$ = props.isDisabled, _v$2 = props.class;
		_v$ !== _p$._v$ && (_el$.disabled = _p$._v$ = _v$);
		_v$2 !== _p$._v$2 && (0, import_web$61.className)(_el$, _p$._v$2 = _v$2);
		return _p$;
	}, {
		_v$: undefined,
		_v$2: undefined
	});
	(0, import_web$64.effect)(() => _el$.value = props.value);
	return _el$;
})();
var CompatFilterDropdown_default = (props) => (0, import_web$60.createComponent)(SingleSelect, {
	options: [
		{
			value: 0,
			label: "Show All"
		},
		{
			value: 1,
			label: "CC Only"
		},
		{
			value: 2,
			label: "BD Only"
		}
	],
	get value() {
		return props.filterMode;
	},
	get onChange() {
		return props.setFilterMode;
	},
	isDisabled: false,
	"class": "ysink_stain_dropdown"
});

//#endregion
//#region plugins/snazzy-shelter/src/components/splashes.jsx
var import_web$54 = __toESM(require_web());
var import_web$55 = __toESM(require_web());
var import_web$56 = __toESM(require_web());
var import_web$57 = __toESM(require_web());
var import_web$58 = __toESM(require_web());
const _tmpl$$9 = /*#__PURE__*/ (0, import_web$54.template)(`<div class="ysink_stain_nosplash"><!#><!/><!#><!/><!#><!/></div>`, 8);
const { Header: Header$1, HeaderTags: HeaderTags$1, Text: Text$3, Button: Button$3, ButtonColors: ButtonColors$1, ButtonSizes: ButtonSizes$1 } = shelter.ui;
const Splash = (props) => (() => {
	const _el$ = (0, import_web$55.getNextElement)(_tmpl$$9), _el$2 = _el$.firstChild, [_el$3, _co$] = (0, import_web$56.getNextMarker)(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = (0, import_web$56.getNextMarker)(_el$4.nextSibling), _el$6 = _el$5.nextSibling, [_el$7, _co$3] = (0, import_web$56.getNextMarker)(_el$6.nextSibling);
	(0, import_web$57.insert)(_el$, (0, import_web$58.createComponent)(Header$1, {
		get tag() {
			return HeaderTags$1.H2;
		},
		get children() {
			return props.title;
		}
	}), _el$3, _co$);
	(0, import_web$57.insert)(_el$, (0, import_web$58.createComponent)(Text$3, { get children() {
		return props.subtitle;
	} }), _el$5, _co$2);
	(0, import_web$57.insert)(_el$, (0, import_web$58.createComponent)(Button$3, {
		"class": "ysink_stain_button",
		get color() {
			return ButtonColors$1.GREEN;
		},
		get size() {
			return ButtonSizes$1.LARGE;
		},
		get onClick() {
			return props.onClick;
		},
		get children() {
			return props.btnText;
		}
	}), _el$7, _co$3);
	return _el$;
})();
const NoRepos = (props) => (0, import_web$58.createComponent)(Splash, {
	title: "No Repos",
	subtitle: "Add one in the repo manager!",
	get onClick() {
		return props.goToRepos;
	},
	btnText: "Open repo manager"
});
const NoThemes = (props) => (0, import_web$58.createComponent)(Splash, {
	title: "No Themes",
	subtitle: "Paste a link in above, or head over to the store",
	get onClick() {
		return props.goToStore;
	},
	btnText: "Get some themes"
});

//#endregion
//#region plugins/snazzy-shelter/src/components/tabs/TabInstalled.jsx
var import_web$47 = __toESM(require_web());
var import_web$48 = __toESM(require_web());
var import_web$49 = __toESM(require_web());
var import_web$50 = __toESM(require_web());
var import_web$51 = __toESM(require_web());
var import_web$52 = __toESM(require_web());
var import_web$53 = __toESM(require_web());
const _tmpl$$8 = /*#__PURE__*/ (0, import_web$47.template)(`<div class="ysink_stain_search_row"><!#><!/><!#><!/></div>`, 6), _tmpl$2$1 = /*#__PURE__*/ (0, import_web$47.template)(`<div class="ysink_stain_cardcontainer"></div>`, 2);
const { solid: { createSignal: createSignal$4 }, plugin: { store: store$6 } } = shelter;
var TabInstalled_default = (props) => {
	const [search$1, setSearch] = createSignal$4("");
	const [filterMode, setFilterMode] = createSignal$4("0");
	return [
		(0, import_web$53.createComponent)(InstallBar_default, {}),
		(() => {
			const _el$ = (0, import_web$50.getNextElement)(_tmpl$$8), _el$2 = _el$.firstChild, [_el$3, _co$] = (0, import_web$51.getNextMarker)(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = (0, import_web$51.getNextMarker)(_el$4.nextSibling);
			(0, import_web$52.insert)(_el$, (0, import_web$53.createComponent)(SearchBar_default, {
				get query() {
					return search$1();
				},
				onChange: setSearch
			}), _el$3, _co$);
			(0, import_web$52.insert)(_el$, (0, import_web$53.createComponent)(CompatFilterDropdown_default, {
				get filterMode() {
					return filterMode();
				},
				setFilterMode
			}), _el$5, _co$2);
			return _el$;
		})(),
		(0, import_web$49.memo)((() => {
			const _c$ = (0, import_web$49.memo)(() => store$6.themes.length === 0);
			return () => _c$() ? (0, import_web$53.createComponent)(NoThemes, { goToStore: () => props.goTo(1) }) : (() => {
				const _el$6 = (0, import_web$50.getNextElement)(_tmpl$2$1);
				(0, import_web$52.insert)(_el$6, () => fuzzyThemes(store$6.themes, search$1(), filterMode()).map((theme) => (0, import_web$53.createComponent)(ThemeCard_default, (0, import_web$48.mergeProps)(() => ({
					key: theme.url,
					theme
				})))));
				return _el$6;
			})();
		})())
	];
};

//#endregion
//#region solid-js
var require_solid_js = __commonJS({ "solid-js"(exports, module) {
	module.exports = shelter.solid;
} });

//#endregion
//#region node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/_virtual/_rollupPluginBabelHelpers.js
function _defineProperty$1(obj, key, value) {
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
else obj[key] = value;
	return obj;
}
function ownKeys$1(object, enumerableOnly) {
	var keys$1 = Object.keys(object);
	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(object);
		if (enumerableOnly) symbols = symbols.filter(function(sym) {
			return Object.getOwnPropertyDescriptor(object, sym).enumerable;
		});
		keys$1.push.apply(keys$1, symbols);
	}
	return keys$1;
}
function _objectSpread2$1(target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i] != null ? arguments[i] : {};
		if (i % 2) ownKeys$1(Object(source), true).forEach(function(key) {
			_defineProperty$1(target, key, source[key]);
		});
else if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
else ownKeys$1(Object(source)).forEach(function(key) {
			Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
		});
	}
	return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _objectWithoutProperties(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _slicedToArray(arr, i) {
	return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
	if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i) {
	if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
	var _arr = [];
	var _n = true;
	var _d = false;
	var _e = undefined;
	try {
		for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
			_arr.push(_s.value);
			if (i && _arr.length === i) break;
		}
	} catch (err) {
		_d = true;
		_e = err;
	} finally {
		try {
			if (!_n && _i["return"] != null) _i["return"]();
		} finally {
			if (_d) throw _e;
		}
	}
	return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

//#endregion
//#region node_modules/.pnpm/state-local@1.0.7/node_modules/state-local/lib/es/state-local.js
function _defineProperty(obj, key, value) {
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
else obj[key] = value;
	return obj;
}
function ownKeys(object, enumerableOnly) {
	var keys$1 = Object.keys(object);
	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(object);
		if (enumerableOnly) symbols = symbols.filter(function(sym) {
			return Object.getOwnPropertyDescriptor(object, sym).enumerable;
		});
		keys$1.push.apply(keys$1, symbols);
	}
	return keys$1;
}
function _objectSpread2(target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i] != null ? arguments[i] : {};
		if (i % 2) ownKeys(Object(source), true).forEach(function(key) {
			_defineProperty(target, key, source[key]);
		});
else if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
else ownKeys(Object(source)).forEach(function(key) {
			Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
		});
	}
	return target;
}
function compose$1() {
	for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) fns[_key] = arguments[_key];
	return function(x) {
		return fns.reduceRight(function(y, f) {
			return f(y);
		}, x);
	};
}
function curry$1(fn) {
	return function curried() {
		var _this = this;
		for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
		return args.length >= fn.length ? fn.apply(this, args) : function() {
			for (var _len3 = arguments.length, nextArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) nextArgs[_key3] = arguments[_key3];
			return curried.apply(_this, [].concat(args, nextArgs));
		};
	};
}
function isObject$1(value) {
	return {}.toString.call(value).includes("Object");
}
function isEmpty(obj) {
	return !Object.keys(obj).length;
}
function isFunction(value) {
	return typeof value === "function";
}
function hasOwnProperty(object, property$1) {
	return Object.prototype.hasOwnProperty.call(object, property$1);
}
function validateChanges(initial, changes) {
	if (!isObject$1(changes)) errorHandler$1("changeType");
	if (Object.keys(changes).some(function(field) {
		return !hasOwnProperty(initial, field);
	})) errorHandler$1("changeField");
	return changes;
}
function validateSelector(selector) {
	if (!isFunction(selector)) errorHandler$1("selectorType");
}
function validateHandler(handler) {
	if (!(isFunction(handler) || isObject$1(handler))) errorHandler$1("handlerType");
	if (isObject$1(handler) && Object.values(handler).some(function(_handler) {
		return !isFunction(_handler);
	})) errorHandler$1("handlersType");
}
function validateInitial(initial) {
	if (!initial) errorHandler$1("initialIsRequired");
	if (!isObject$1(initial)) errorHandler$1("initialType");
	if (isEmpty(initial)) errorHandler$1("initialContent");
}
function throwError$1(errorMessages$2, type) {
	throw new Error(errorMessages$2[type] || errorMessages$2["default"]);
}
var errorMessages$1 = {
	initialIsRequired: "initial state is required",
	initialType: "initial state should be an object",
	initialContent: "initial state shouldn't be an empty object",
	handlerType: "handler should be an object or a function",
	handlersType: "all handlers should be a functions",
	selectorType: "selector should be a function",
	changeType: "provided value of changes should be an object",
	changeField: "it seams you want to change a field in the state which is not specified in the \"initial\" state",
	"default": "an unknown error accured in `state-local` package"
};
var errorHandler$1 = curry$1(throwError$1)(errorMessages$1);
var validators$1 = {
	changes: validateChanges,
	selector: validateSelector,
	handler: validateHandler,
	initial: validateInitial
};
function create(initial) {
	var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	validators$1.initial(initial);
	validators$1.handler(handler);
	var state = { current: initial };
	var didUpdate = curry$1(didStateUpdate)(state, handler);
	var update = curry$1(updateState)(state);
	var validate = curry$1(validators$1.changes)(initial);
	var getChanges = curry$1(extractChanges)(state);
	function getState$1() {
		var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function(state$1) {
			return state$1;
		};
		validators$1.selector(selector);
		return selector(state.current);
	}
	function setState$1(causedChanges) {
		compose$1(didUpdate, update, validate, getChanges)(causedChanges);
	}
	return [getState$1, setState$1];
}
function extractChanges(state, causedChanges) {
	return isFunction(causedChanges) ? causedChanges(state.current) : causedChanges;
}
function updateState(state, changes) {
	state.current = _objectSpread2(_objectSpread2({}, state.current), changes);
	return changes;
}
function didStateUpdate(state, handler, changes) {
	isFunction(handler) ? handler(state.current) : Object.keys(changes).forEach(function(field) {
		var _handler$field;
		return (_handler$field = handler[field]) === null || _handler$field === void 0 ? void 0 : _handler$field.call(handler, state.current[field]);
	});
	return changes;
}
var index = { create };
var state_local_default = index;

//#endregion
//#region node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/config/index.js
var config$1 = { paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs" } };
var config_default = config$1;

//#endregion
//#region node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/utils/curry.js
function curry(fn) {
	return function curried() {
		var _this = this;
		for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		return args.length >= fn.length ? fn.apply(this, args) : function() {
			for (var _len2 = arguments.length, nextArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) nextArgs[_key2] = arguments[_key2];
			return curried.apply(_this, [].concat(args, nextArgs));
		};
	};
}
var curry_default = curry;

//#endregion
//#region node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/utils/isObject.js
function isObject(value) {
	return {}.toString.call(value).includes("Object");
}
var isObject_default = isObject;

//#endregion
//#region node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/validators/index.js
/**
* validates the configuration object and informs about deprecation
* @param {Object} config - the configuration object 
* @return {Object} config - the validated configuration object
*/
function validateConfig(config$2) {
	if (!config$2) errorHandler("configIsRequired");
	if (!isObject_default(config$2)) errorHandler("configType");
	if (config$2.urls) {
		informAboutDeprecation();
		return { paths: { vs: config$2.urls.monacoBase } };
	}
	return config$2;
}
/**
* logs deprecation message
*/
function informAboutDeprecation() {
	console.warn(errorMessages.deprecation);
}
function throwError(errorMessages$2, type) {
	throw new Error(errorMessages$2[type] || errorMessages$2["default"]);
}
var errorMessages = {
	configIsRequired: "the configuration object is required",
	configType: "the configuration object should be an object",
	"default": "an unknown error accured in `@monaco-editor/loader` package",
	deprecation: "Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "
};
var errorHandler = curry_default(throwError)(errorMessages);
var validators = { config: validateConfig };
var validators_default = validators;

//#endregion
//#region node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/utils/compose.js
var compose = function compose$2() {
	for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) fns[_key] = arguments[_key];
	return function(x) {
		return fns.reduceRight(function(y, f) {
			return f(y);
		}, x);
	};
};
var compose_default = compose;

//#endregion
//#region node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/utils/deepMerge.js
function merge(target, source) {
	Object.keys(source).forEach(function(key) {
		if (source[key] instanceof Object) {
			if (target[key]) Object.assign(source[key], merge(target[key], source[key]));
		}
	});
	return _objectSpread2$1(_objectSpread2$1({}, target), source);
}
var deepMerge_default = merge;

//#endregion
//#region node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/utils/makeCancelable.js
var CANCELATION_MESSAGE = {
	type: "cancelation",
	msg: "operation is manually canceled"
};
function makeCancelable(promise) {
	var hasCanceled_ = false;
	var wrappedPromise = new Promise(function(resolve, reject) {
		promise.then(function(val) {
			return hasCanceled_ ? reject(CANCELATION_MESSAGE) : resolve(val);
		});
		promise["catch"](reject);
	});
	return wrappedPromise.cancel = function() {
		return hasCanceled_ = true;
	}, wrappedPromise;
}
var makeCancelable_default = makeCancelable;

//#endregion
//#region node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/loader/index.js
/** the local state of the module */
var _state$create = state_local_default.create({
	config: config_default,
	isInitialized: false,
	resolve: null,
	reject: null,
	monaco: null
}), _state$create2 = _slicedToArray(_state$create, 2), getState = _state$create2[0], setState = _state$create2[1];
/**
* set the loader configuration
* @param {Object} config - the configuration object
*/
function config(globalConfig) {
	var _validators$config = validators_default.config(globalConfig), monaco$1 = _validators$config.monaco, config$2 = _objectWithoutProperties(_validators$config, ["monaco"]);
	setState(function(state) {
		return {
			config: deepMerge_default(state.config, config$2),
			monaco: monaco$1
		};
	});
}
/**
* handles the initialization of the monaco-editor
* @return {Promise} - returns an instance of monaco (with a cancelable promise)
*/
function init() {
	var state = getState(function(_ref) {
		var monaco$1 = _ref.monaco, isInitialized = _ref.isInitialized, resolve = _ref.resolve;
		return {
			monaco: monaco$1,
			isInitialized,
			resolve
		};
	});
	if (!state.isInitialized) {
		setState({ isInitialized: true });
		if (state.monaco) {
			state.resolve(state.monaco);
			return makeCancelable_default(wrapperPromise);
		}
		if (window.monaco && window.monaco.editor) {
			storeMonacoInstance(window.monaco);
			state.resolve(window.monaco);
			return makeCancelable_default(wrapperPromise);
		}
		compose_default(injectScripts, getMonacoLoaderScript)(configureLoader);
	}
	return makeCancelable_default(wrapperPromise);
}
/**
* injects provided scripts into the document.body
* @param {Object} script - an HTML script element
* @return {Object} - the injected HTML script element
*/
function injectScripts(script) {
	return document.body.appendChild(script);
}
/**
* creates an HTML script element with/without provided src
* @param {string} [src] - the source path of the script
* @return {Object} - the created HTML script element
*/
function createScript(src) {
	var script = document.createElement("script");
	return src && (script.src = src), script;
}
/**
* creates an HTML script element with the monaco loader src
* @return {Object} - the created HTML script element
*/
function getMonacoLoaderScript(configureLoader$1) {
	var state = getState(function(_ref2) {
		var config$2 = _ref2.config, reject = _ref2.reject;
		return {
			config: config$2,
			reject
		};
	});
	var loaderScript = createScript("".concat(state.config.paths.vs, "/loader.js"));
	loaderScript.onload = function() {
		return configureLoader$1();
	};
	loaderScript.onerror = state.reject;
	return loaderScript;
}
/**
* configures the monaco loader
*/
function configureLoader() {
	var state = getState(function(_ref3) {
		var config$2 = _ref3.config, resolve = _ref3.resolve, reject = _ref3.reject;
		return {
			config: config$2,
			resolve,
			reject
		};
	});
	var require$1 = window.require;
	require$1.config(state.config);
	require$1(["vs/editor/editor.main"], function(monaco$1) {
		storeMonacoInstance(monaco$1);
		state.resolve(monaco$1);
	}, function(error) {
		state.reject(error);
	});
}
/**
* store monaco instance in local state
*/
function storeMonacoInstance(monaco$1) {
	if (!getState().monaco) setState({ monaco: monaco$1 });
}
/**
* internal helper function
* extracts stored monaco instance
* @return {Object|null} - the monaco instance
*/
function __getMonacoInstance() {
	return getState(function(_ref4) {
		var monaco$1 = _ref4.monaco;
		return monaco$1;
	});
}
var wrapperPromise = new Promise(function(resolve, reject) {
	return setState({
		resolve,
		reject
	});
});
var loader = {
	config,
	init,
	__getMonacoInstance
};
var loader_default = loader;

//#endregion
//#region node_modules/.pnpm/@uwu+monaco-solid@1.1.0_solid-js@1.8.15/node_modules/@uwu/monaco-solid/dist/monaco.js
let monaco;
let monacoLoaded;
const loadedThemes = new Set();
async function addThemeIfNeeded(t) {
	if (!t || !t.trim() || loadedThemes.has(t)) return;
	loadedThemes.add(t);
	const u = `https://cdn.esm.sh/monaco-themes@0.4.2/themes/${t}.json`;
	const theme = await fetch(u).then((r) => r.json());
	monaco.editor.defineTheme(t, theme);
}
async function initMonacoIfNeeded(useNpmMonaco) {
	if (monaco) return;
	if (useNpmMonaco) loader_default.config({ monaco: useNpmMonaco });
	if (!monacoLoaded) monacoLoaded = loader_default.init().then((m) => {
		monaco = m;
	});
	await monacoLoaded;
}

//#endregion
//#region node_modules/.pnpm/@uwu+monaco-solid@1.1.0_solid-js@1.8.15/node_modules/@uwu/monaco-solid/dist/index.jsx
var import_web$43 = __toESM(require_web());
var import_web$44 = __toESM(require_web());
var import_web$45 = __toESM(require_web());
var import_web$46 = __toESM(require_web());
var import_solid_js = __toESM(require_solid_js());
const _tmpl$$7 = /*#__PURE__*/ (0, import_web$43.template)(`<div></div>`, 2);
var dist_default = (props) => {
	let dispose;
	let cancelInit = false;
	const refCb = async (elem) => {
		await initMonacoIfNeeded(props.noCDN);
		await addThemeIfNeeded(props.theme);
		if (cancelInit) return;
		const ed = monaco.editor.create(elem, {
			language: props.lang,
			value: props.value,
			readOnly: props.readonly ?? false,
			theme: props.theme,
			...props.otherCfg
		});
		dispose = () => ed.dispose();
		ed.onDidChangeModelContent(() => {
			props.valOut?.(ed.getValue());
		});
		(0, import_solid_js.createEffect)(() => ed.updateOptions({ readOnly: props.readonly }));
		(0, import_solid_js.createEffect)(() => {
			if (props.value !== ed.getValue()) ed.setValue(props.value);
		});
		(0, import_solid_js.createEffect)(async () => {
			await addThemeIfNeeded(props.theme);
			ed.updateOptions({ theme: props.theme });
		});
		(0, import_solid_js.createEffect)(() => {
			const model = ed.getModel();
			if (!model) return;
			monaco.editor.setModelLanguage(model, props.lang);
			ed.setModel(model);
		});
	};
	(0, import_solid_js.onCleanup)(() => {
		cancelInit = true;
		dispose?.();
	});
	return (() => {
		const _el$ = (0, import_web$45.getNextElement)(_tmpl$$7);
		(0, import_web$46.use)(refCb, _el$);
		(0, import_web$44.effect)((_p$) => {
			const _v$ = props.width ?? "30rem", _v$2 = props.height ?? "10rem";
			_v$ !== _p$._v$ && _el$.style.setProperty("width", _p$._v$ = _v$);
			_v$2 !== _p$._v$2 && _el$.style.setProperty("height", _p$._v$2 = _v$2);
			return _p$;
		}, {
			_v$: undefined,
			_v$2: undefined
		});
		return _el$;
	})();
};

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/now.js
/**
* Gets the timestamp of the number of milliseconds that have elapsed since
* the Unix epoch (1 January 1970 00:00:00 UTC).
*
* @static
* @memberOf _
* @since 2.4.0
* @category Date
* @returns {number} Returns the timestamp.
* @example
*
* _.defer(function(stamp) {
*   console.log(_.now() - stamp);
* }, _.now());
* // => Logs the number of milliseconds it took for the deferred invocation.
*/
var now = function() {
	return _root_default.Date.now();
};
var now_default = now;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_trimmedEndIndex.js
/** Used to match a single whitespace character. */
var reWhitespace = /\s/;
/**
* Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
* character of `string`.
*
* @private
* @param {string} string The string to inspect.
* @returns {number} Returns the index of the last non-whitespace character.
*/
function trimmedEndIndex(string) {
	var index$1 = string.length;
	while (index$1-- && reWhitespace.test(string.charAt(index$1)));
	return index$1;
}
var _trimmedEndIndex_default = trimmedEndIndex;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseTrim.js
/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;
/**
* The base implementation of `_.trim`.
*
* @private
* @param {string} string The string to trim.
* @returns {string} Returns the trimmed string.
*/
function baseTrim(string) {
	return string ? string.slice(0, _trimmedEndIndex_default(string) + 1).replace(reTrimStart, "") : string;
}
var _baseTrim_default = baseTrim;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/toNumber.js
/** Used as references for various `Number` constants. */
var NAN = NaN;
/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;
/**
* Converts `value` to a number.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to process.
* @returns {number} Returns the number.
* @example
*
* _.toNumber(3.2);
* // => 3.2
*
* _.toNumber(Number.MIN_VALUE);
* // => 5e-324
*
* _.toNumber(Infinity);
* // => Infinity
*
* _.toNumber('3.2');
* // => 3.2
*/
function toNumber(value) {
	if (typeof value == "number") return value;
	if (isSymbol_default(value)) return NAN;
	if (isObject_default$1(value)) {
		var other = typeof value.valueOf == "function" ? value.valueOf() : value;
		value = isObject_default$1(other) ? other + "" : other;
	}
	if (typeof value != "string") return value === 0 ? value : +value;
	value = _baseTrim_default(value);
	var isBinary = reIsBinary.test(value);
	return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var toNumber_default = toNumber;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/debounce.js
/** Error message constants. */
var FUNC_ERROR_TEXT = "Expected a function";
var nativeMax = Math.max, nativeMin = Math.min;
/**
* Creates a debounced function that delays invoking `func` until after `wait`
* milliseconds have elapsed since the last time the debounced function was
* invoked. The debounced function comes with a `cancel` method to cancel
* delayed `func` invocations and a `flush` method to immediately invoke them.
* Provide `options` to indicate whether `func` should be invoked on the
* leading and/or trailing edge of the `wait` timeout. The `func` is invoked
* with the last arguments provided to the debounced function. Subsequent
* calls to the debounced function return the result of the last `func`
* invocation.
*
* **Note:** If `leading` and `trailing` options are `true`, `func` is
* invoked on the trailing edge of the timeout only if the debounced function
* is invoked more than once during the `wait` timeout.
*
* If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
* until to the next tick, similar to `setTimeout` with a timeout of `0`.
*
* See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
* for details over the differences between `_.debounce` and `_.throttle`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Function
* @param {Function} func The function to debounce.
* @param {number} [wait=0] The number of milliseconds to delay.
* @param {Object} [options={}] The options object.
* @param {boolean} [options.leading=false]
*  Specify invoking on the leading edge of the timeout.
* @param {number} [options.maxWait]
*  The maximum time `func` is allowed to be delayed before it's invoked.
* @param {boolean} [options.trailing=true]
*  Specify invoking on the trailing edge of the timeout.
* @returns {Function} Returns the new debounced function.
* @example
*
* // Avoid costly calculations while the window size is in flux.
* jQuery(window).on('resize', _.debounce(calculateLayout, 150));
*
* // Invoke `sendMail` when clicked, debouncing subsequent calls.
* jQuery(element).on('click', _.debounce(sendMail, 300, {
*   'leading': true,
*   'trailing': false
* }));
*
* // Ensure `batchLog` is invoked once after 1 second of debounced calls.
* var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
* var source = new EventSource('/stream');
* jQuery(source).on('message', debounced);
*
* // Cancel the trailing debounced invocation.
* jQuery(window).on('popstate', debounced.cancel);
*/
function debounce(func, wait, options) {
	var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
	if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
	wait = toNumber_default(wait) || 0;
	if (isObject_default$1(options)) {
		leading = !!options.leading;
		maxing = "maxWait" in options;
		maxWait = maxing ? nativeMax(toNumber_default(options.maxWait) || 0, wait) : maxWait;
		trailing = "trailing" in options ? !!options.trailing : trailing;
	}
	function invokeFunc(time) {
		var args = lastArgs, thisArg = lastThis;
		lastArgs = lastThis = undefined;
		lastInvokeTime = time;
		result = func.apply(thisArg, args);
		return result;
	}
	function leadingEdge(time) {
		lastInvokeTime = time;
		timerId = setTimeout(timerExpired, wait);
		return leading ? invokeFunc(time) : result;
	}
	function remainingWait(time) {
		var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
		return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
	}
	function shouldInvoke(time) {
		var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
		return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
	}
	function timerExpired() {
		var time = now_default();
		if (shouldInvoke(time)) return trailingEdge(time);
		timerId = setTimeout(timerExpired, remainingWait(time));
	}
	function trailingEdge(time) {
		timerId = undefined;
		if (trailing && lastArgs) return invokeFunc(time);
		lastArgs = lastThis = undefined;
		return result;
	}
	function cancel() {
		if (timerId !== undefined) clearTimeout(timerId);
		lastInvokeTime = 0;
		lastArgs = lastCallTime = lastThis = timerId = undefined;
	}
	function flush() {
		return timerId === undefined ? result : trailingEdge(now_default());
	}
	function debounced() {
		var time = now_default(), isInvoking = shouldInvoke(time);
		lastArgs = arguments;
		lastThis = this;
		lastCallTime = time;
		if (isInvoking) {
			if (timerId === undefined) return leadingEdge(lastCallTime);
			if (maxing) {
				clearTimeout(timerId);
				timerId = setTimeout(timerExpired, wait);
				return invokeFunc(lastCallTime);
			}
		}
		if (timerId === undefined) timerId = setTimeout(timerExpired, wait);
		return result;
	}
	debounced.cancel = cancel;
	debounced.flush = flush;
	return debounced;
}
var debounce_default = debounce;

//#endregion
//#region plugins/snazzy-shelter/src/components/tabs/TabQuickCSS.jsx
var import_web$38 = __toESM(require_web());
var import_web$39 = __toESM(require_web());
var import_web$40 = __toESM(require_web());
var import_web$41 = __toESM(require_web());
var import_web$42 = __toESM(require_web());
const _tmpl$$6 = /*#__PURE__*/ (0, import_web$38.template)(`<div></div>`, 2);
const saveCssDebounced = debounce_default((v) => store$5.quickCSS = v, 250);
const { solid: { createSignal: createSignal$3 }, plugin: { store: store$5 } } = shelter;
var TabQuickCSS_default = () => {
	const [css, setCss] = createSignal$3(store$5.quickCSS);
	return (() => {
		const _el$ = (0, import_web$39.getNextElement)(_tmpl$$6);
		_el$.style.setProperty("maxWidth", "60vw");
		_el$.style.setProperty("height", "40rem");
		_el$.style.setProperty("resize", "vertical");
		_el$.style.setProperty("overflow", "hidden");
		_el$.style.setProperty("paddingBottom", ".5rem");
		(0, import_web$40.insert)(_el$, (0, import_web$41.createComponent)(dist_default, {
			get value() {
				return css() ?? " ";
			},
			valOut: (v) => {
				setCss(v);
				saveCssDebounced(v);
			},
			lang: "css",
			theme: "Dracula",
			width: "100%",
			height: "100%",
			otherCfg: { automaticLayout: true }
		}));
		return _el$;
	})();
};

//#endregion
//#region plugins/snazzy-shelter/src/components/cards/RepoCard.jsx
var import_web$32 = __toESM(require_web());
var import_web$33 = __toESM(require_web());
var import_web$34 = __toESM(require_web());
var import_web$35 = __toESM(require_web());
var import_web$36 = __toESM(require_web());
var import_web$37 = __toESM(require_web());
const _tmpl$$5 = /*#__PURE__*/ (0, import_web$32.template)(`<div class="ysink_stain_card ysink_stain_row"><div><div class="ysink_stain_title"><!#><!/><!#><!/></div><!#><!/></div><!#><!/></div>`, 14);
const { solid: { createResource: createResource$1 }, ui: { Text: Text$2, Button: Button$2, ButtonColors }, plugin: { store: store$4 } } = shelter;
var RepoCard_default = (props) => {
	const [fullRepo] = createResource$1(() => props.repo, fetchRepo_default);
	return (() => {
		const _el$ = (0, import_web$33.getNextElement)(_tmpl$$5), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, [_el$5, _co$] = (0, import_web$35.getNextMarker)(_el$4.nextSibling), _el$6 = _el$5.nextSibling, [_el$7, _co$2] = (0, import_web$35.getNextMarker)(_el$6.nextSibling), _el$8 = _el$3.nextSibling, [_el$9, _co$3] = (0, import_web$35.getNextMarker)(_el$8.nextSibling), _el$10 = _el$2.nextSibling, [_el$11, _co$4] = (0, import_web$35.getNextMarker)(_el$10.nextSibling);
		(0, import_web$36.insert)(_el$3, () => fullRepo()?.manifest.meta.name, _el$5, _co$);
		(0, import_web$36.insert)(_el$3, (() => {
			const _c$ = (0, import_web$37.memo)(() => !!officialRepos.includes(props.repo));
			return () => _c$() && (0, import_web$34.createComponent)(TextBadge, {
				"class": "ysink_stain_officialbadge",
				text: "official",
				color: "var(--info-positive-foreground)"
			});
		})(), _el$7, _co$2);
		(0, import_web$36.insert)(_el$2, (0, import_web$34.createComponent)(Text$2, { get children() {
			return props.repo;
		} }), _el$9, _co$3);
		(0, import_web$36.insert)(_el$, (0, import_web$34.createComponent)(Button$2, {
			get color() {
				return ButtonColors.RED;
			},
			"class": "ysink_stain_button",
			grow: true,
			onClick: () => store$4.repos = store$4.repos.filter((r) => r !== props.repo),
			children: "Remove Repo"
		}), _el$11, _co$4);
		return _el$;
	})();
};

//#endregion
//#region plugins/snazzy-shelter/src/util/friendlyUtils.js
const { plugin: { store: store$3 } } = shelter;
async function verifyRepo(repo) {
	try {
		await fetchRepo_default(repo);
		return true;
	} catch {
		return false;
	}
}
async function addRepo(repo, ok, err) {
	if (!repo.endsWith("/")) repo += "/";
	if (store$3.repos.includes(repo)) {
		err("You already have this repo!");
		return false;
	}
	if (!await verifyRepo(repo)) {
		err("Repo was invalid");
		return false;
	}
	store$3.repos = [...store$3.repos, repo];
	ok("Added repo");
	return true;
}

//#endregion
//#region plugins/snazzy-shelter/src/components/tabs/TabRepo.jsx
var import_web$27 = __toESM(require_web());
var import_web$28 = __toESM(require_web());
var import_web$29 = __toESM(require_web());
var import_web$30 = __toESM(require_web());
var import_web$31 = __toESM(require_web());
const _tmpl$$4 = /*#__PURE__*/ (0, import_web$27.template)(`<div><div class="ysink_stain_row"><!#><!/><!#><!/></div><!#><!/><div class="ysink_stain_cardcontainer"></div></div>`, 12);
const { showToast, TextBox } = shelter.ui;
const toast = (str) => showToast({
	title: str,
	duration: 5e3
});
const { solid: { createSignal: createSignal$2 }, plugin: { store: store$2 }, ui: { Button: Button$1, Divider: Divider$1, ButtonSizes } } = shelter;
var TabRepo_default = () => {
	const [url, setUrl] = createSignal$2("");
	return (() => {
		const _el$ = (0, import_web$28.getNextElement)(_tmpl$$4), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, [_el$4, _co$] = (0, import_web$29.getNextMarker)(_el$3.nextSibling), _el$5 = _el$4.nextSibling, [_el$6, _co$2] = (0, import_web$29.getNextMarker)(_el$5.nextSibling), _el$8 = _el$2.nextSibling, [_el$9, _co$3] = (0, import_web$29.getNextMarker)(_el$8.nextSibling), _el$7 = _el$9.nextSibling;
		_el$2.style.setProperty("display", "flex");
		(0, import_web$30.insert)(_el$2, (0, import_web$31.createComponent)(TextBox, {
			get value() {
				return url();
			},
			onInput: setUrl,
			placeholder: "https://example.com/repo"
		}), _el$4, _co$);
		(0, import_web$30.insert)(_el$2, (0, import_web$31.createComponent)(Button$1, {
			"class": "ysink_stain_button",
			get size() {
				return ButtonSizes.MEDIUM;
			},
			onClick: async () => {
				if (await addRepo(url(), toast, toast)) setUrl("");
			},
			children: "Add"
		}), _el$6, _co$2);
		(0, import_web$30.insert)(_el$, (0, import_web$31.createComponent)(Divider$1, {
			mt: ".5rem",
			mb: ".5rem"
		}), _el$9, _co$3);
		(0, import_web$30.insert)(_el$7, () => store$2.repos.map((repo) => (0, import_web$31.createComponent)(RepoCard_default, { repo })));
		return _el$;
	})();
};

//#endregion
//#region plugins/snazzy-shelter/src/components/VirtualScroller.tsx
var import_web$21 = __toESM(require_web());
var import_web$22 = __toESM(require_web());
var import_web$23 = __toESM(require_web());
var import_web$24 = __toESM(require_web());
var import_web$25 = __toESM(require_web());
var import_web$26 = __toESM(require_web());
const _tmpl$$3 = /*#__PURE__*/ (0, import_web$21.template)(`<div><div></div></div>`, 4);
const { For } = window["shelter"].solid;
var VirtualScroller_default = (props) => (() => {
	const _el$ = (0, import_web$24.getNextElement)(_tmpl$$3), _el$2 = _el$.firstChild;
	_el$.style.setProperty("overflow-y", "auto");
	_el$2.style.setProperty("width", "100%");
	_el$2.style.setProperty("position", "relative");
	(0, import_web$25.insert)(_el$2, (0, import_web$26.createComponent)(For, {
		get each() {
			return props.items;
		},
		children: (item) => props.children(item)
	}));
	(0, import_web$23.effect)((_p$) => {
		const _v$ = props.height, _v$2 = props.class;
		_v$ !== _p$._v$ && _el$.style.setProperty("height", _p$._v$ = _v$);
		_v$2 !== _p$._v$2 && (0, import_web$22.className)(_el$, _p$._v$2 = _v$2);
		return _p$;
	}, {
		_v$: undefined,
		_v$2: undefined
	});
	return _el$;
})();

//#endregion
//#region plugins/snazzy-shelter/src/components/tabs/TabStore.jsx
var import_web$15 = __toESM(require_web());
var import_web$16 = __toESM(require_web());
var import_web$17 = __toESM(require_web());
var import_web$18 = __toESM(require_web());
var import_web$19 = __toESM(require_web());
var import_web$20 = __toESM(require_web());
const _tmpl$$2 = /*#__PURE__*/ (0, import_web$15.template)(`<div class="ysink_stain_search_row"><!#><!/><!#><!/></div>`, 6);
const { solid: { createSignal: createSignal$1, createResource }, plugin: { store: store$1 }, ui: { niceScrollbarsClass } } = shelter;
const getRepos = () => Promise.all(store$1.repos.map(fetchRepo_default));
const getThemes = () => getRepos().then((rs) => rs.flatMap((r) => r.themes));
var TabStore_default = (props) => {
	const [search$1, setSearch] = createSignal$1("");
	const [filterMode, setFilterMode] = createSignal$1("0");
	const [themes] = createResource(() => store$1.repos, getThemes);
	return [(() => {
		const _el$ = (0, import_web$17.getNextElement)(_tmpl$$2), _el$2 = _el$.firstChild, [_el$3, _co$] = (0, import_web$18.getNextMarker)(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = (0, import_web$18.getNextMarker)(_el$4.nextSibling);
		(0, import_web$19.insert)(_el$, (0, import_web$20.createComponent)(SearchBar_default, {
			get query() {
				return search$1();
			},
			onChange: setSearch
		}), _el$3, _co$);
		(0, import_web$19.insert)(_el$, (0, import_web$20.createComponent)(CompatFilterDropdown_default, {
			get filterMode() {
				return filterMode();
			},
			setFilterMode
		}), _el$5, _co$2);
		return _el$;
	})(), (0, import_web$16.memo)((() => {
		const _c$ = (0, import_web$16.memo)(() => store$1.repos.length === 0);
		return () => _c$() ? (0, import_web$20.createComponent)(NoRepos, { goToRepos: () => props.goTo(2) }) : (0, import_web$20.createComponent)(VirtualScroller_default, {
			get ["class"]() {
				return niceScrollbarsClass();
			},
			height: "50rem",
			keySel: (t) => t.url,
			get items() {
				return fuzzyThemes(themes(), search$1(), filterMode());
			},
			children: (theme) => (0, import_web$20.createComponent)(ThemeCard_default, {
				theme,
				gap: ".5rem"
			})
		});
	})())];
};

//#endregion
//#region plugins/snazzy-shelter/src/components/tabs/TabDebug.jsx
var import_web$14 = __toESM(require_web());
const { Button, Text: Text$1 } = shelter.ui;
var TabDebug_default = () => [(0, import_web$14.createComponent)(Button, {
	"class": "ysink_stain_button",
	grow: true,
	onClick: clearCache,
	children: "Clear fetch cache"
}), (0, import_web$14.createComponent)(Text$1, { children: "@ me if you need other things for debug purposes :)" })];

//#endregion
//#region plugins/snazzy-shelter/src/components/TabBar.tsx
var import_web$5 = __toESM(require_web());
var import_web$6 = __toESM(require_web());
var import_web$7 = __toESM(require_web());
var import_web$8 = __toESM(require_web());
var import_web$9 = __toESM(require_web());
var import_web$10 = __toESM(require_web());
var import_web$11 = __toESM(require_web());
var import_web$12 = __toESM(require_web());
var import_web$13 = __toESM(require_web());
const _tmpl$$1 = /*#__PURE__*/ (0, import_web$5.template)(`<div class="ysink_stain_tabbar_root"><div class="ysink_stain_tabbar"></div><!#><!/><div class="ysink_stain_tabbar_content"></div></div>`, 8), _tmpl$2 = /*#__PURE__*/ (0, import_web$5.template)(`<button></button>`, 2);
const { solid: { createSignal }, solidWeb: { Dynamic }, ui: { Text, Divider } } = shelter;
var TabBar_default = (props) => {
	const [current, goTo] = createSignal(0);
	return (() => {
		const _el$ = (0, import_web$10.getNextElement)(_tmpl$$1), _el$2 = _el$.firstChild, _el$4 = _el$2.nextSibling, [_el$5, _co$] = (0, import_web$11.getNextMarker)(_el$4.nextSibling), _el$3 = _el$5.nextSibling;
		(0, import_web$13.insert)(_el$2, () => props.items.map((e, i) => (() => {
			const _el$6 = (0, import_web$10.getNextElement)(_tmpl$2);
			_el$6.$$click = () => goTo(i);
			(0, import_web$13.insert)(_el$6, (0, import_web$12.createComponent)(Text, { get children() {
				return e.text;
			} }));
			(0, import_web$8.effect)(() => (0, import_web$7.className)(_el$6, "ysink_stain_button" + (i === current() ? " ysink_stain_selected" : "")));
			(0, import_web$9.runHydrationEvents)();
			return _el$6;
		})()));
		(0, import_web$13.insert)(_el$, (0, import_web$12.createComponent)(Divider, {
			mt: ".5rem",
			mb: ".5rem"
		}), _el$5, _co$);
		(0, import_web$13.insert)(_el$3, (0, import_web$12.createComponent)(Dynamic, {
			get component() {
				return props.items[current()].component;
			},
			goTo
		}));
		return _el$;
	})();
};
(0, import_web$6.delegateEvents)(["click"]);

//#endregion
//#region plugins/snazzy-shelter/src/components/SettingsMain.jsx
var import_web = __toESM(require_web());
var import_web$1 = __toESM(require_web());
var import_web$2 = __toESM(require_web());
var import_web$3 = __toESM(require_web());
var import_web$4 = __toESM(require_web());
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<div><!#><!/><!#><!/></div>`, 6);
const { Header, HeaderTags } = shelter.ui;
var SettingsMain_default = () => {
	return (() => {
		const _el$ = (0, import_web$1.getNextElement)(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = (0, import_web$2.getNextMarker)(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = (0, import_web$2.getNextMarker)(_el$4.nextSibling);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(Header, {
			get tag() {
				return HeaderTags.H1;
			},
			children: "Snazzy Shelter Settings"
		}), _el$3, _co$);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(TabBar_default, { items: [
			{
				text: "Installed",
				component: TabInstalled_default
			},
			{
				text: "Store",
				component: TabStore_default
			},
			{
				text: "Repos",
				component: TabRepo_default
			},
			{
				text: "Quick CSS",
				component: TabQuickCSS_default
			},
			{
				text: "Debug",
				component: TabDebug_default
			}
		] }), _el$5, _co$2);
		return _el$;
	})();
};

//#endregion
//#region plugins/snazzy-shelter/src/transients/settingsEntry.js
var settingsEntry_default = () => shelter.settings.registerSection("section", "shsnazzy", "Themes", SettingsMain_default);

//#endregion
//#region plugins/snazzy-shelter/src/styles.sass
var styles_default = `.ysink_stain_card {
  background: var(--background-secondary-alt);
  border: 1px solid var(--background-modifier-accent);
  color: var(--text-normal);
  border-radius: .5rem;
  padding: 1rem;
  width: 100% !important;
}

.ysink_stain_title {
  color: var(--interactive-active);
  align-items: center;
  font-size: 1rem;
  display: flex;
}

.ysink_stain_cardcontainer > * {
  margin-bottom: .5rem;
}

.ysink_stain_row {
  gap: 1rem;
  display: flex;
}

.ysink_stain_row > :not(:last-child) {
  flex: 1;
}

.ysink_stain_tabbar {
  grid-auto-columns: 7rem;
  grid-auto-flow: column;
  padding: .5rem 1rem;
  display: grid;
}

.ysink_stain_tabbar .ysink_stain_button * {
  cursor: pointer;
}

.ysink_stain_tabbar > * {
  text-align: center;
  background: none;
  border-radius: .3rem;
  min-width: 5rem;
  margin-right: 1rem;
  padding: .2rem;
}

.theme-dark .ysink_stain_tabbar > .ysink_stain_selected {
  background: #fff4;
}

.theme-light .ysink_stain_tabbar > .ysink_stain_selected {
  background: #0003;
}

.ysink_stain_tabbar > :last-child {
  margin-right: 0;
}

.ysink_stain_searchbar {
  margin: .75rem 0;
}

.ysink_stain_search_row {
  gap: .75rem;
  margin: .75rem 0;
  display: flex;
}

.ysink_stain_search_row .ysink_stain_dropdown {
  background: var(--input-background);
  color: #fff;
  border: none;
  border-radius: 3px;
  flex-basis: 10rem;
  height: 2.25rem;
}

.ysink_stain_search_row .ysink_stain_searchbar {
  margin: unset;
  flex: 1;
}

.ysink_stain_tcard {
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr min-content;
  align-items: center;
  display: grid;
}

.ysink_stain_tcard .ysink_stain_tmedia {
  background-size: cover;
  grid-row: 1 / 3;
  width: 7rem;
  height: 4rem;
  margin-right: 1rem;
}

.ysink_stain_tcard .ysink_stain_tmedia * {
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
}

.ysink_stain_tcard .ysink_stain_tmedia .ysink_stain_tview {
  z-index: 1;
  backdrop-filter: brightness(.3);
  cursor: pointer;
  transition: opacity .25s;
}

.ysink_stain_tcard .ysink_stain_tmedia .ysink_stain_tview:not(:hover) {
  opacity: 0;
}

.ysink_stain_tcard .ysink_stain_tdesc {
  grid-area: 2 / 2;
}

.ysink_stain_tcard .ysink_stain_tacts {
  grid-column: 3;
  justify-self: right;
}

.ysink_stain_tcard .ysink_stain_tacts > :last-child {
  margin-left: .25rem;
}

.ysink_stain_tcard .ysink_stain_tacts > * {
  display: inline-block;
}

.ysink_stain_tcard .ysink_stain_taulic {
  text-align: right;
  min-width: 8rem;
}

.ysink_stain_iconbtn {
  fill: var(--interactive-normal);
  cursor: pointer;
  width: 22px;
  height: 22px;
  margin-right: .25rem;
}

.ysink_stain_badge {
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: .5rem;
}

.ysink_stain_badge.ysink_stain_bd {
  background: #040405;
  padding: .25rem;
}

.ysink_stain_badge.ysink_stain_cc {
  background: #7289da;
  padding: .1rem;
}

.ysink_stain_nosplash {
  flex-direction: column;
  align-items: center;
  gap: .5rem;
  margin-top: 15rem;
  display: flex;
}

.ysink_stain_nosplash h2 {
  margin-bottom: 0;
}

.ysink_stain_nosplash > * {
  flex: 0;
}

.ysink_stain_nosplash .ysink_stain_button {
  margin-top: 2rem;
}

.ysink_stain_officialbadge {
  margin-left: .5rem;
  display: inline;
}

.ysink_stain_button {
  color: #fff !important;
}

#shsnazzy-tab {
  padding-bottom: 0;
}
`;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayEachRight.js
/**
* A specialized version of `_.forEachRight` for arrays without support for
* iteratee shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns `array`.
*/
function arrayEachRight(array, iteratee) {
	var length = array == null ? 0 : array.length;
	while (length--) if (iteratee(array[length], length, array) === false) break;
	return array;
}
var _arrayEachRight_default = arrayEachRight;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createBaseFor.js
/**
* Creates a base function for methods like `_.forIn` and `_.forOwn`.
*
* @private
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Function} Returns the new base function.
*/
function createBaseFor(fromRight) {
	return function(object, iteratee, keysFunc) {
		var index$1 = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
		while (length--) {
			var key = props[fromRight ? length : ++index$1];
			if (iteratee(iterable[key], key, iterable) === false) break;
		}
		return object;
	};
}
var _createBaseFor_default = createBaseFor;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseForRight.js
/**
* This function is like `baseFor` except that it iterates over properties
* in the opposite order.
*
* @private
* @param {Object} object The object to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @param {Function} keysFunc The function to get the keys of `object`.
* @returns {Object} Returns `object`.
*/
var baseForRight = _createBaseFor_default(true);
var _baseForRight_default = baseForRight;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseForOwnRight.js
/**
* The base implementation of `_.forOwnRight` without support for iteratee shorthands.
*
* @private
* @param {Object} object The object to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Object} Returns `object`.
*/
function baseForOwnRight(object, iteratee) {
	return object && _baseForRight_default(object, iteratee, keys_default);
}
var _baseForOwnRight_default = baseForOwnRight;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createBaseEach.js
/**
* Creates a `baseEach` or `baseEachRight` function.
*
* @private
* @param {Function} eachFunc The function to iterate over a collection.
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Function} Returns the new base function.
*/
function createBaseEach(eachFunc, fromRight) {
	return function(collection, iteratee) {
		if (collection == null) return collection;
		if (!isArrayLike_default(collection)) return eachFunc(collection, iteratee);
		var length = collection.length, index$1 = fromRight ? length : -1, iterable = Object(collection);
		while (fromRight ? index$1-- : ++index$1 < length) if (iteratee(iterable[index$1], index$1, iterable) === false) break;
		return collection;
	};
}
var _createBaseEach_default = createBaseEach;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseEachRight.js
/**
* The base implementation of `_.forEachRight` without support for iteratee shorthands.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array|Object} Returns `collection`.
*/
var baseEachRight = _createBaseEach_default(_baseForOwnRight_default, true);
var _baseEachRight_default = baseEachRight;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_castFunction.js
/**
* Casts `value` to `identity` if it's not a function.
*
* @private
* @param {*} value The value to inspect.
* @returns {Function} Returns cast function.
*/
function castFunction(value) {
	return typeof value == "function" ? value : identity_default;
}
var _castFunction_default = castFunction;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/forEachRight.js
/**
* This method is like `_.forEach` except that it iterates over elements of
* `collection` from right to left.
*
* @static
* @memberOf _
* @since 2.0.0
* @alias eachRight
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Array|Object} Returns `collection`.
* @see _.forEach
* @example
*
* _.forEachRight([1, 2], function(value) {
*   console.log(value);
* });
* // => Logs `2` then `1`.
*/
function forEachRight(collection, iteratee) {
	var func = isArray_default(collection) ? _arrayEachRight_default : _baseEachRight_default;
	return func(collection, _castFunction_default(iteratee));
}
var forEachRight_default = forEachRight;

//#endregion
//#region plugins/snazzy-shelter/index.js
const { plugin: { store }, ui: { injectCss } } = shelter;
if (!Array.isArray(store.repos)) defaultRepos_default();
if (!Array.isArray(store.themes)) store.themes = [];
if (store.css) {
	if (!store.quickCSS) store.quickCSS = store.css;
	delete store.css;
}
const transients = [
	quickCSS_default(),
	restoreThemes_default(),
	exposeApi_default(),
	settingsEntry_default(),
	injectCss(styles_default)
];
const onUnload = () => forEachRight_default(transients, (p) => p());

//#endregion
exports.onUnload = onUnload
return exports;
})({});