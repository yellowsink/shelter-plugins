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
//#region plugins/fast-gif-picker/parser.ts
const { store: store$1 } = shelter.plugin;
const mediaTenorLinkRegex = /^https:\/\/(?:media\d?|c)\.tenor\.com(?:\/m)?\/(?<code>.{11}).{5}\/(?<name>.*?)\./i;
const giphyLinkRegex = /^https:\/\/media\d?\.giphy\.com\/media\/.*?\/(?<code>.*?)\/giphy/i;
const mediaProxyParser = /^https:\/\/images-ext-\d\.discordapp.net\/external\/.*?\.*?\/(?<protocol>.*?)\/(?<rest>.*?)$/i;
let Quality = function(Quality$1) {
	Quality$1[Quality$1["Default"] = 0] = "Default";
	Quality$1[Quality$1["Reasonable"] = 1] = "Reasonable";
	Quality$1[Quality$1["Horrible"] = 2] = "Horrible";
	return Quality$1;
}({});
const qualities = {
	[Quality.Default]: {
		giphy: "giphy",
		tenor: "AAAAx",
		cap: 300
	},
	[Quality.Reasonable]: {
		giphy: "200",
		tenor: "AAAA1",
		cap: 200
	},
	[Quality.Horrible]: {
		giphy: "giphy-preview",
		tenor: "AAAA2",
		cap: 90
	}
};
function getCleanLink(link) {
	if (mediaProxyParser.test(link)) {
		const { protocol, rest } = link.match(mediaProxyParser).groups;
		return `${decodeURIComponent(protocol)}://${decodeURIComponent(rest)}`;
	} else return link;
}
function parseLink(link, sizes) {
	const quality = qualities[store$1.quality];
	const url = new URL(link);
	if (!url) return link;
	const cleanLink = getCleanLink(link);
	if (mediaTenorLinkRegex.test(cleanLink)) {
		const { code, name } = cleanLink.match(mediaTenorLinkRegex).groups;
		return `https://c.tenor.com/${code}${quality.tenor}/${name}.webp`;
	} else if (giphyLinkRegex.test(cleanLink)) {
		const { code } = cleanLink.match(giphyLinkRegex).groups;
		return `https://i.giphy.com/media/${code}/${quality.giphy}.webp`;
	} else if (url.hostname.endsWith(".discordapp.net") || url.hostname === "cdn.discordapp.com") {
		url.searchParams.set("format", "webp");
		url.searchParams.set("animated", "true");
		if (sizes) {
			const smaller = Math.min(...sizes);
			url.searchParams.set("width", String(Math.floor(sizes[0] / smaller * quality.cap)));
			url.searchParams.set("height", String(Math.floor(sizes[1] / smaller * quality.cap)));
		}
		return url.toString();
	} else return link;
}

//#endregion
//#region plugins/fast-gif-picker/index.tsx
var import_web = __toESM(require_web(), 1);
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
var import_web$3 = __toESM(require_web(), 1);
var import_web$4 = __toESM(require_web(), 1);
var import_web$5 = __toESM(require_web(), 1);
var import_web$6 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<div style="display: flex; justify-content: space-between"><!#><!/><!#><!/></div>`, 6), _tmpl$2 = /*#__PURE__*/ (0, import_web.template)(`<img alt="" class="ysink-patched">`, 1);
const { flux: { storesFlat: { UserSettingsProtoStore } }, ui: { Text, Button, ButtonColors, ButtonSizes }, plugin: { store } } = shelter;
const { flux: { intercept }, patcher: { after }, observeDom } = shelter.plugin.scoped;
store.quality ??= Quality.Reasonable;
const settings = () => (() => {
	const _el$ = (0, import_web$3.getNextElement)(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = (0, import_web$4.getNextMarker)(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = (0, import_web$4.getNextMarker)(_el$4.nextSibling);
	(0, import_web$5.insert)(_el$, (0, import_web$6.createComponent)(Text, { children: "Quality:" }), _el$3, _co$);
	(0, import_web$5.insert)(_el$, () => Object.keys(Quality).filter((k) => Number.isNaN(parseInt(k))).map((k) => {
		const active = store.quality === Quality[k];
		return (0, import_web$6.createComponent)(Button, {
			get size() {
				return ButtonSizes.TINY;
			},
			get color() {
				return active ? ButtonColors.BRAND : ButtonColors.SECONDARY;
			},
			onClick: () => store.quality = Quality[k],
			grow: true,
			children: k
		});
	}), _el$5, _co$2);
	return _el$;
})();
intercept((payload) => {
	switch (payload.type) {
		case "GIF_PICKER_QUERY_SUCCESS":
			for (const item of payload.items) item.src = item.gif_src = parseLink(item.src, [item.width, item.height]);
			break;
		case "GIF_PICKER_TRENDING_FETCH_SUCCESS":
			for (const item of payload.trendingCategories) item.src = parseLink(item.src);
			const tgp = payload.trendingGIFPreview;
			if (tgp) tgp.src = tgp.gif_src = parseLink(tgp.src, [tgp.width, tgp.height]);
			break;
	}
});
after("getFullState", UserSettingsProtoStore, (_args, ret) => {
	const gifs = ret[2]?.proto?.favoriteGifs?.gifs;
	if (gifs) for (const k in gifs) {
		const gif = gifs[k];
		gif.src = parseLink(gif.src, [gif.width, gif.height]);
	}
	return ret;
});
observeDom("#gif-picker-tab-panel [class*=result__] > video:not(.ysink-patched)", (e) => {
	e.replaceWith((() => {
		const _el$6 = (0, import_web$3.getNextElement)(_tmpl$2);
		(0, import_web$2.effect)((_p$) => {
			const _v$ = e.src, _v$2 = e.width, _v$3 = e.height;
			_v$ !== _p$._v$ && (0, import_web$1.setAttribute)(_el$6, "src", _p$._v$ = _v$);
			_v$2 !== _p$._v$2 && (0, import_web$1.setAttribute)(_el$6, "width", _p$._v$2 = _v$2);
			_v$3 !== _p$._v$3 && (0, import_web$1.setAttribute)(_el$6, "height", _p$._v$3 = _v$3);
			return _p$;
		}, {
			_v$: undefined,
			_v$2: undefined,
			_v$3: undefined
		});
		return _el$6;
	})());
});

//#endregion
exports.settings = settings
return exports;
})({});