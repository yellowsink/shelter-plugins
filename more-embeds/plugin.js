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
//#region plugins/more-embeds/index.tsx
var import_web = __toESM(require_web(), 1);
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
var import_web$3 = __toESM(require_web(), 1);
var import_web$4 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px; border:none;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"></iframe>`, 2), _tmpl$2 = /*#__PURE__*/ (0, import_web.template)(`<iframe title="deezer-widget" width="100%" style="border:none;max-width:660px" allow="encrypted-media; clipboard-write"></iframe>`, 2), _tmpl$3 = /*#__PURE__*/ (0, import_web.template)(`<iframe allow="clipboard-write"></iframe>`, 2), _tmpl$4 = /*#__PURE__*/ (0, import_web.template)(`<iframe></iframe>`, 2);
const { flux: { storesFlat: { ThemeStore, SelectedChannelStore }, dispatcher }, solid: { onCleanup }, util: { createSubscription, getFiber, reactFiberWalker }, observeDom, ui: { ReactiveRoot } } = shelter;
const CORS_PROXY_PREFIX = "https://shcors.uwu.network/";
const iframeFromAmUrl = (path) => (() => {
	const _el$ = (0, import_web$4.getNextElement)(_tmpl$);
	(0, import_web$3.effect)((_p$) => {
		const _v$ = path.includes("playlist") ? 450 : path.includes("i=") ? 175 : 450, _v$2 = `https://embed.music.apple.com/${path.split(".com/")[1].replace("/_/", "/")}`;
		_v$ !== _p$._v$ && (0, import_web$2.setAttribute)(_el$, "height", _p$._v$ = _v$);
		_v$2 !== _p$._v$2 && (0, import_web$2.setAttribute)(_el$, "src", _p$._v$2 = _v$2);
		return _p$;
	}, {
		_v$: undefined,
		_v$2: undefined
	});
	return _el$;
})();
const iframeFromDeezerUrl = (path) => (() => {
	const _el$2 = (0, import_web$4.getNextElement)(_tmpl$2);
	(0, import_web$3.effect)((_p$) => {
		const _v$3 = `https://widget.deezer.com/widget/${ThemeStore.getState().theme}/${path.split(".com/")[1]}`, _v$4 = path.includes("track") ? 150 : 200;
		_v$3 !== _p$._v$3 && (0, import_web$2.setAttribute)(_el$2, "src", _p$._v$3 = _v$3);
		_v$4 !== _p$._v$4 && (0, import_web$2.setAttribute)(_el$2, "height", _p$._v$4 = _v$4);
		return _p$;
	}, {
		_v$3: undefined,
		_v$4: undefined
	});
	return _el$2;
})();
const iframeFromYandexMusicUrl = (path) => (() => {
	const _el$3 = (0, import_web$4.getNextElement)(_tmpl$3);
	(0, import_web$3.effect)((_p$) => {
		const _v$5 = `border: none; width: ${path.includes("album") && !path.includes("track") || path.includes("artist") ? 100 : 33}%; max-width: 600px; height: ${path.includes("album") && !path.includes("track") || path.includes("artist") ? 450 : 180}px;`, _v$6 = `"${path.includes("album") && !path.includes("track") || path.includes("artist") ? 100 : 33}%"`, _v$7 = `"${path.includes("album") && !path.includes("track") || path.includes("artist") ? 450 : 180}"`, _v$8 = path.replace(path.includes("/album") ? "/album/" : path.includes("/artist") ? "/artist/" : "/track/", path.includes("/album") ? "/iframe/album/" : path.includes("/artist") ? "/iframe/artist/" : "/iframe/track/") + "?lang=en";
		_p$._v$5 = (0, import_web$1.style)(_el$3, _v$5, _p$._v$5);
		_v$6 !== _p$._v$6 && (0, import_web$2.setAttribute)(_el$3, "width", _p$._v$6 = _v$6);
		_v$7 !== _p$._v$7 && (0, import_web$2.setAttribute)(_el$3, "height", _p$._v$7 = _v$7);
		_v$8 !== _p$._v$8 && (0, import_web$2.setAttribute)(_el$3, "src", _p$._v$8 = _v$8);
		return _p$;
	}, {
		_v$5: undefined,
		_v$6: undefined,
		_v$7: undefined,
		_v$8: undefined
	});
	return _el$3;
})();
const iframeFromBandcampInfo = (type, trackId, albumId) => (() => {
	const _el$4 = (0, import_web$4.getNextElement)(_tmpl$4);
	(0, import_web$3.effect)((_p$) => {
		const _v$9 = `border: 0; width: 100%; max-width: 600px; height: ${type === "a" ? 250 : 42}px;`, _v$10 = `https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=${type === "a" ? "large" : "small"}/bgcol=${ThemeStore.getState().theme === "dark" ? "000000" : "ffffff"}/linkcol=0687f5/${type === "a" ? "artwork=small" : "track=" + trackId}/transparent=true/`;
		_p$._v$9 = (0, import_web$1.style)(_el$4, _v$9, _p$._v$9);
		_v$10 !== _p$._v$10 && (0, import_web$2.setAttribute)(_el$4, "src", _p$._v$10 = _v$10);
		return _p$;
	}, {
		_v$9: undefined,
		_v$10: undefined
	});
	return _el$4;
})();
async function scrapeBandcamp(url) {
	const docu = await fetch(CORS_PROXY_PREFIX + url).then((r) => r.text()).then((t) => new DOMParser().parseFromString(t, "text/html"));
	const pageProps = docu.querySelector("meta[name=bc-page-properties]")?.content;
	if (!pageProps) return;
	const { item_type, item_id } = JSON.parse(pageProps);
	if (item_type === "a") return [
		"a",
		undefined,
		item_id
	];
	if (item_type === "t") {
		const albumUrl = docu.getElementById("buyAlbumLink").getAttribute("href");
		const resolvedUrl = new URL(albumUrl, url).href;
		return [
			"t",
			item_id,
			(await scrapeBandcamp(resolvedUrl))[2]
		];
	}
}
const iframeFromBandcampUrl = async (url) => iframeFromBandcampInfo(...await scrapeBandcamp(url));
const matchers = [
	[/https?:\/\/(?:geo\.)?music\.apple\.com\/[a-z]+\/(?:album|playlist)\/.*/, iframeFromAmUrl],
	[/https?:\/\/(?:www\.)?deezer\.com\/[a-z]+\/(?:track|album|playlist)\/\d+/, iframeFromDeezerUrl],
	[/https?:\/\/(?:www\.)?music\.yandex\.(?:ru|com|kz|by|uz)\/(?:artist|album)\/\d+(?:\/track\/\d+)?/, iframeFromYandexMusicUrl],
	[/https?:\/\/.+\.bandcamp\.com\/(?:album|track)\/.+/, iframeFromBandcampUrl],
	[/https?:\/\/(?:song|album)\.link\/.+/, async (full) => {
		try {
			const apiRes = await fetch(`${CORS_PROXY_PREFIX}https://api.song.link/v1-alpha.1/links?url=${full}`).then((r) => r.json());
			for (const [platform, fn] of [
				["appleMusic", iframeFromAmUrl],
				["deezer", iframeFromDeezerUrl],
				["bandcamp", iframeFromBandcampUrl]
			]) if (apiRes.linksByPlatform[platform]) return fn(apiRes.linksByPlatform[platform].url);
		} catch (e) {
			console.error(`error fetching data from songlink for ${full}, bailing`);
		}
	}]
];
const TRIGGERS = [
	"MESSAGE_CREATE",
	"MESSAGE_UPDATE",
	"UPDATE_CHANNEL_DIMENSIONS"
];
function handleDispatch(payload) {
	if ((payload.type === "MESSAGE_CREATE" || payload.type === "MESSAGE_UPDATE") && payload.message.channel_id !== SelectedChannelStore.getChannelId()) return;
	const unobs = observeDom(`[id^="chat-messages-"]:not([data-more-embeds])`, async (e) => {
		e.dataset.moreEmbeds = "1";
		unobs();
		if (e.getElementsByTagName(`article`).length === 0) await new Promise((res) => setTimeout(res, 1e3));
		const accessories = e.getElementsByTagName(`article`);
		for (const accessory of accessories) {
			const embed = reactFiberWalker(getFiber(accessory), "embed", true)?.memoizedProps.embed;
			if (embed?.type !== "link" && embed.type !== "article") return;
			for (const [matcher, handler] of matchers) {
				const match = embed.url.match(matcher);
				if (!match) continue;
				const iframe = await handler(...match);
				if (iframe) {
					accessory.style.display = "none";
					accessory.insertAdjacentElement("afterend", iframe);
					break;
				}
			}
		}
	});
	setTimeout(unobs, 1e3);
}
for (const t of TRIGGERS) dispatcher.subscribe(t, handleDispatch);
function onUnload() {
	for (const t of TRIGGERS) dispatcher.unsubscribe(t, handleDispatch);
}

//#endregion
exports.onUnload = onUnload
return exports;
})({});