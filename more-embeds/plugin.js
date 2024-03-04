(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // shltr-res-ns:solid-js/web
  var require_web = __commonJS({
    "shltr-res-ns:solid-js/web"(exports, module) {
      module.exports = shelter.solidWeb;
    }
  });

  // plugins/more-embeds/index.tsx
  var more_embeds_exports = {};
  __export(more_embeds_exports, {
    onUnload: () => onUnload
  });
  var import_web = __toESM(require_web(), 1);
  var import_web2 = __toESM(require_web(), 1);
  var import_web3 = __toESM(require_web(), 1);
  var import_web4 = __toESM(require_web(), 1);
  var _tmpl$ = /* @__PURE__ */ (0, import_web.template)(`<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px; border:none;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"></iframe>`, 2);
  var _tmpl$2 = /* @__PURE__ */ (0, import_web.template)(`<iframe title="deezer-widget" width="100%" style="border:none;max-width:660px" allow="encrypted-media; clipboard-write"></iframe>`, 2);
  var _tmpl$3 = /* @__PURE__ */ (0, import_web.template)(`<iframe></iframe>`, 2);
  var {
    flux: {
      storesFlat: {
        ThemeStore,
        SelectedChannelStore
      },
      dispatcher
    },
    solid: {
      onCleanup
    },
    util: {
      createSubscription,
      getFiber,
      reactFiberWalker
    },
    observeDom,
    ui: {
      ReactiveRoot
    }
  } = shelter;
  var CORS_PROXY_PREFIX = "https://shcors.uwu.network/";
  var iframeFromAmUrl = (path) => (() => {
    const _el$ = _tmpl$.cloneNode(true);
    (0, import_web4.effect)((_p$) => {
      const _v$ = path.includes("playlist") ? 450 : path.includes("i=") ? 175 : 450, _v$2 = `https://embed.music.apple.com/${path.split(".com/")[1].replace("/_/", "/")}`;
      _v$ !== _p$._v$ && (0, import_web3.setAttribute)(_el$, "height", _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && (0, import_web3.setAttribute)(_el$, "src", _p$._v$2 = _v$2);
      return _p$;
    }, {
      _v$: void 0,
      _v$2: void 0
    });
    return _el$;
  })();
  var iframeFromDeezerUrl = (path) => (() => {
    const _el$2 = _tmpl$2.cloneNode(true);
    (0, import_web4.effect)((_p$) => {
      const _v$3 = `https://widget.deezer.com/widget/${ThemeStore.getState().theme}/${path.split(".com/")[1]}`, _v$4 = path.includes("track") ? 150 : 200;
      _v$3 !== _p$._v$3 && (0, import_web3.setAttribute)(_el$2, "src", _p$._v$3 = _v$3);
      _v$4 !== _p$._v$4 && (0, import_web3.setAttribute)(_el$2, "height", _p$._v$4 = _v$4);
      return _p$;
    }, {
      _v$3: void 0,
      _v$4: void 0
    });
    return _el$2;
  })();
  var iframeFromBandcampInfo = (type, trackId, albumId) => (() => {
    const _el$3 = _tmpl$3.cloneNode(true);
    (0, import_web4.effect)((_p$) => {
      const _v$5 = `border: 0; width: 100%; max-width: 600px; height: ${type === "a" ? 250 : 42}px;`, _v$6 = `https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=${type === "a" ? "large" : "small"}/bgcol=${ThemeStore.getState().theme === "dark" ? "000000" : "ffffff"}/linkcol=0687f5/${type === "a" ? "artwork=small" : "track=" + trackId}/transparent=true/`;
      _p$._v$5 = (0, import_web2.style)(_el$3, _v$5, _p$._v$5);
      _v$6 !== _p$._v$6 && (0, import_web3.setAttribute)(_el$3, "src", _p$._v$6 = _v$6);
      return _p$;
    }, {
      _v$5: void 0,
      _v$6: void 0
    });
    return _el$3;
  })();
  async function scrapeBandcamp(url) {
    const docu = await fetch(CORS_PROXY_PREFIX + url).then((r) => r.text()).then((t) => new DOMParser().parseFromString(t, "text/html"));
    const pageProps = docu.querySelector("meta[name=bc-page-properties]")?.content;
    if (!pageProps)
      return;
    const {
      item_type,
      item_id
    } = JSON.parse(pageProps);
    if (item_type === "a")
      return ["a", void 0, item_id];
    if (item_type === "t") {
      const albumUrl = docu.getElementById("buyAlbumLink").getAttribute("href");
      const resolvedUrl = new URL(albumUrl, url).href;
      return ["t", item_id, (await scrapeBandcamp(resolvedUrl))[2]];
    }
  }
  var iframeFromBandcampUrl = async (url) => iframeFromBandcampInfo(...await scrapeBandcamp(url));
  var matchers = [
    [/https?:\/\/(?:geo\.)?music\.apple\.com\/[a-z]+\/(?:album|playlist)\/.*/, iframeFromAmUrl],
    [/https?:\/\/(?:www\.)?deezer\.com\/[a-z]+\/(?:track|album|playlist)\/\d+/, iframeFromDeezerUrl],
    [/https?:\/\/.+\.bandcamp\.com\/(?:album|track)\/.+/, iframeFromBandcampUrl],
    // song.link
    [/https?:\/\/(?:song|album)\.link\/.+/, async (full) => {
      try {
        const apiRes = await fetch(`${CORS_PROXY_PREFIX}https://api.song.link/v1-alpha.1/links?url=${full}`).then((r) => r.json());
        for (const [platform, fn] of [["appleMusic", iframeFromAmUrl], ["deezer", iframeFromDeezerUrl], ["bandcamp", iframeFromBandcampUrl]])
          if (apiRes.linksByPlatform[platform])
            return fn(apiRes.linksByPlatform[platform].url);
      } catch (e) {
        console.error(`error fetching data from songlink for ${full}, bailing`);
      }
    }]
    // TIDAL, sadly only albums and playlists
    /*[
    	/https?:\/\/listen\.tidal\.com\/(album|playlist)\/([a-z0-9-]+)/,
    	(_full, type, id) =>
    		Promise.resolve(
    			(
    				<iframe
    					src={`https://embed.tidal.com/${type}s/${id}?coverInitially=true&disableAnalytics=true`}
    					style="width:100%;height:300px;max-width:660px"
    				/>
    			) as HTMLIFrameElement,
    		),
    ],*/
  ];
  var TRIGGERS = ["MESSAGE_CREATE", "MESSAGE_UPDATE", "UPDATE_CHANNEL_DIMENSIONS"];
  function handleDispatch(payload) {
    if ((payload.type === "MESSAGE_CREATE" || payload.type === "MESSAGE_UPDATE") && payload.message.channel_id !== SelectedChannelStore.getChannelId())
      return;
    const unobs = observeDom(`[id^="chat-messages-"]:not([data-more-embeds])`, async (e) => {
      e.dataset.moreEmbeds = "1";
      unobs();
      if (e.getElementsByTagName(`article`).length === 0)
        await new Promise((res) => setTimeout(res, 1e3));
      const accessories = e.getElementsByTagName(`article`);
      for (const accessory of accessories) {
        const embed = reactFiberWalker(getFiber(accessory), "embed", true)?.memoizedProps.embed;
        if (embed?.type !== "link" && embed.type !== "article")
          return;
        for (const [matcher, handler] of matchers) {
          const match = embed.url.match(matcher);
          if (!match)
            continue;
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
  for (const t of TRIGGERS)
    dispatcher.subscribe(t, handleDispatch);
  function onUnload() {
    for (const t of TRIGGERS)
      dispatcher.unsubscribe(t, handleDispatch);
  }
  return __toCommonJS(more_embeds_exports);
})();
