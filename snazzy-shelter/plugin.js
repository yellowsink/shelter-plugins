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

  // shltr-res-ns:solid-js
  var require_solid_js = __commonJS({
    "shltr-res-ns:solid-js"(exports, module) {
      module.exports = shelter.solid;
    }
  });

  // plugins/snazzy-shelter/index.js
  var snazzy_shelter_exports = {};
  __export(snazzy_shelter_exports, {
    onUnload: () => onUnload
  });

  // plugins/snazzy-shelter/src/util/bdMetaParser.js
  var splitRegex = /[^\S\r\n]*?\r?\n[^\S\r\n]*?\*[^\S\r\n]?/;
  var escapedAtRegex = /^\\@/;
  function tryJSON(data) {
    try {
      return JSON.parse(data);
    } catch {
    }
  }
  function parseOldMeta(fileContent) {
    const meta = fileContent.split("\n")[0];
    const metaData = meta.substring(
      meta.lastIndexOf("//META") + 6,
      meta.lastIndexOf("*//")
    );
    const parsed = tryJSON(metaData);
    if (!parsed)
      throw new Error("META could not be parsed.");
    if (!parsed.name)
      throw new Error("META missing name data.");
    return parsed;
  }
  function parseNewMeta(fileContent) {
    const block = fileContent.split("/**", 2)[1].split("*/", 1)[0];
    const out = {};
    let field = "";
    let accum = "";
    for (const line of block.split(splitRegex)) {
      if (line.length === 0)
        continue;
      if (line.charAt(0) === "@" && line.charAt(1) !== " ") {
        if (field !== "")
          out[field] = accum;
        const l = line.indexOf(" ");
        field = line.substr(1, l - 1);
        accum = line.substr(l + 1);
      } else
        accum += ` ${line.replace("\\n", "\n").replace(escapedAtRegex, "@")}`;
    }
    out[field] = accum.trim();
    return out;
  }
  var bdMetaParser_default = (fileContent) => {
    const firstLine = fileContent.split("\n")[0];
    if (firstLine.includes("//META"))
      return parseOldMeta(fileContent);
    if (firstLine.includes("/**"))
      return parseNewMeta(fileContent);
    throw new Error("META was not found.");
  };

  // plugins/snazzy-shelter/src/util/cachingFetcher.js
  var cache = {};
  var queuedReqs = {};
  async function fetchText(url) {
    if (cache[url])
      return cache[url];
    if (!queuedReqs[url])
      queuedReqs[url] = [
        fetch(url).then(async (res) => {
          cache[url] = [
            res.status,
            res.status === 200 ? await res.text() : void 0
          ];
        }),
        0
      ];
    queuedReqs[url][1]++;
    await queuedReqs[url][0];
    queuedReqs[url][1]--;
    if (queuedReqs[url][1] === 0)
      delete queuedReqs[url];
    return cache[url];
  }
  async function fetchJson(url) {
    const [status, txt] = await fetchText(url);
    return [status, txt ? JSON.parse(txt) : void 0];
  }
  var clearCache = () => Object.keys(cache).forEach((k) => delete cache[k]);

  // plugins/snazzy-shelter/src/util/fetchTheme.js
  async function getBdTheme(url, repoUrl) {
    const actualUrl = new URL(url, repoUrl).href;
    const [status, CSS] = await fetchText(actualUrl);
    if (status !== 200)
      throw new Error(`BD theme existed in cache with non-200 status ${status}`);
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
    if (status !== 200)
      throw new Error(
        `CC manifest existed in cache with non-200 status ${status}`
      );
    return {
      url: actualUrl,
      compat: false,
      ...manifest,
      repoUrl,
      CSS: async () => {
        const [status2, css] = await fetchText(actualUrl);
        if (status2 !== 200)
          throw new Error(
            `CC CSS existed in cache with non-200 status ${status2}`
          );
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
        let err = new Error(
          "Failed to fetch theme - both CC and BD either failed to fetch or failed to parse"
        );
        err.e1 = e1;
        err.e2 = e2;
        throw err;
      }
    }
  };

  // plugins/snazzy-shelter/src/util/fetchRepo.js
  async function getRepoManifest(url) {
    const manifestURL = new URL("repo.json", url).href;
    const [status, manifest] = await fetchJson(manifestURL);
    if (status !== 200)
      throw new Error(
        `Repo manifest existed in cache with non-200 status ${status}`
      );
    if (!manifest.themes || manifest.themes?.length === 0)
      throw new Error("No themes found in repo");
    if (!manifest.meta)
      throw new Error("No repo metadata");
    if (!manifest?.meta.name)
      throw new Error("Repo did not have a name");
    return manifest;
  }
  var fetchRepo_default = async (url) => {
    const manifest = await getRepoManifest(url);
    const themeResults = await Promise.allSettled(
      manifest.themes.map((tu) => fetchTheme_default(tu, url))
    );
    const themes = themeResults.filter((t) => {
      if (t.status === "rejected") {
        console.error("snazzy-shelter: loading theme failed: ", t.reason);
        return false;
      }
      return true;
    }).map((t) => t.value);
    return { manifest, themes };
  };

  // plugins/snazzy-shelter/src/defaultRepos.js
  var {
    plugin: { store }
  } = shelter;
  var officialRepos = Object.freeze(["https://cumcordthemes.github.io/Cumsock/"]);
  var defaultRepos_default = async () => {
    if (!Array.isArray(store.repos))
      store.repos = [];
    for (const r of officialRepos) {
      if (store.repos.find((r1) => r1.url === r.url))
        continue;
      try {
        await fetchRepo_default(r);
      } catch {
        continue;
      }
      store.repos = [...store.repos, r];
    }
  };

  // plugins/snazzy-shelter/src/transients/quickCSS.js
  var {
    solid: { createEffect },
    plugin: { store: store2 },
    ui: { injectCss }
  } = shelter;
  var quickCSS_default = () => {
    const modify = injectCss(store2.quickCSS || " ");
    let cancel;
    createEffect(() => {
      if (!cancel)
        modify(store2.quickCSS || " ");
    });
    return () => {
      modify();
      cancel = true;
    };
  };

  // plugins/snazzy-shelter/src/util/themeLoadUtil.js
  var {
    ui: { injectCss: injectCss2 },
    plugin: { store: store3 }
  } = shelter;
  var unpatchCache = /* @__PURE__ */ new Map();
  async function loadTheme(theme) {
    if (!theme?.url || !await theme.CSS())
      throw new Error("theme was missing either id or css.");
    const unpatch = injectCss2(await theme.CSS());
    unpatchCache.set(theme.url, unpatch);
    const themeCacheIndex = store3.themes.findIndex(
      (t) => t.url === theme.url
    );
    let toPush = { ...theme };
    delete toPush.CSS;
    toPush.enabled = true;
    if (themeCacheIndex === -1)
      store3.themes = [...store3.themes, toPush];
    else
      store3.themes[themeCacheIndex] = toPush;
  }
  function unloadTheme(theme) {
    if (!theme?.url)
      throw new Error("theme was missing id.");
    const unpatch = unpatchCache.get(theme.url);
    unpatch?.();
    unpatchCache.delete(theme.url);
    const themeCacheIndex = store3.themes.findIndex(
      (t) => t.url === theme.url
    );
    let toPush = { ...theme };
    toPush.enabled = false;
    if (themeCacheIndex === -1)
      store3.themes = [...store3.themes, toPush];
    else
      store3.themes[themeCacheIndex] = toPush;
  }
  function removeTheme(theme) {
    try {
      unloadTheme(theme);
    } catch (e) {
      if (e.message !== "theme was not loaded.")
        throw e;
    }
    store3.themes = store3.themes.filter(
      (t) => t.url !== theme.url
    );
  }
  function unloadAll() {
    unpatchCache.forEach((unpatch) => unpatch?.());
    unpatchCache.clear();
  }

  // plugins/snazzy-shelter/src/transients/restoreThemes.js
  var { plugin: { store: store4 } } = shelter;
  var restoreThemes_default = () => {
    let cancel = false;
    if (store4.themes)
      store4.themes.filter((t) => t.enabled).forEach(
        (t) => fetchTheme_default(t.url, t.repoUrl).then((ft) => cancel || loadTheme(ft))
      );
    return () => {
      unloadAll();
      cancel = true;
    };
  };

  // plugins/snazzy-shelter/src/transients/exposeApi.js
  var exposeApi_default = () => {
    window.snazzyShelter = Object.freeze({ TODO: "WIP" });
    return () => delete window.snazzyShelter;
  };

  // plugins/snazzy-shelter/src/components/SettingsMain.jsx
  var import_web81 = __toESM(require_web());
  var import_web82 = __toESM(require_web());
  var import_web83 = __toESM(require_web());

  // plugins/snazzy-shelter/src/components/tabs/TabInstalled.jsx
  var import_web44 = __toESM(require_web());
  var import_web45 = __toESM(require_web());
  var import_web46 = __toESM(require_web());
  var import_web47 = __toESM(require_web());
  var import_web48 = __toESM(require_web());

  // plugins/snazzy-shelter/src/components/cards/ThemeCard.jsx
  var import_web19 = __toESM(require_web());
  var import_web20 = __toESM(require_web());
  var import_web21 = __toESM(require_web());
  var import_web22 = __toESM(require_web());
  var import_web23 = __toESM(require_web());
  var import_web24 = __toESM(require_web());

  // plugins/snazzy-shelter/src/components/badges.jsx
  var import_web = __toESM(require_web());
  var import_web2 = __toESM(require_web());
  var import_web3 = __toESM(require_web());
  var import_web4 = __toESM(require_web());
  var import_web5 = __toESM(require_web());
  var _tmpl$ = /* @__PURE__ */ (0, import_web.template)(`<img>`, 1);
  var _tmpl$2 = /* @__PURE__ */ (0, import_web.template)(`<div></div>`, 2);
  var badge = (url, type) => () => (() => {
    const _el$ = _tmpl$.cloneNode(true);
    (0, import_web5.setAttribute)(_el$, "src", url);
    (0, import_web4.className)(_el$, `ysink_stain_badge ysink_stain_${type}`);
    return _el$;
  })();
  var BDBadge = badge("https://betterdiscord.app/resources/branding/logo_small.svg", "bd");
  var CCBadge = badge("https://raw.githubusercontent.com/Cumcord/assets/main/logo/filled.svg", "cc");
  var TextBadge = (props) => (() => {
    const _el$2 = _tmpl$2.cloneNode(true);
    _el$2.style.setProperty("border-radius", "9999px");
    _el$2.style.setProperty("color", "white");
    _el$2.style.setProperty("font-size", ".8rem");
    _el$2.style.setProperty("padding", ".1rem .3rem");
    _el$2.style.setProperty("text-transform", "uppercase");
    _el$2.style.setProperty("font-weight", "bold");
    (0, import_web3.insert)(_el$2, () => props.text);
    (0, import_web2.effect)((_p$) => {
      const _v$ = props.class, _v$2 = props.color;
      _v$ !== _p$._v$ && (0, import_web4.className)(_el$2, _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && _el$2.style.setProperty("background-color", _p$._v$2 = _v$2);
      return _p$;
    }, {
      _v$: void 0,
      _v$2: void 0
    });
    return _el$2;
  })();

  // plugins/snazzy-shelter/src/components/CarouselModal.jsx
  var import_web10 = __toESM(require_web());
  var import_web11 = __toESM(require_web());
  var import_web12 = __toESM(require_web());

  // plugins/snazzy-shelter/src/components/MediaCarousel.jsx
  var import_web6 = __toESM(require_web());
  var import_web7 = __toESM(require_web());
  var import_web8 = __toESM(require_web());
  var import_web9 = __toESM(require_web());
  var _tmpl$3 = /* @__PURE__ */ (0, import_web6.template)(`<div>WIP</div>`, 2);
  var _tmpl$22 = /* @__PURE__ */ (0, import_web6.template)(`<div class="ysink_stain_carousel"></div>`, 2);
  var _tmpl$32 = /* @__PURE__ */ (0, import_web6.template)(`<div class="ysink_stain_noimg"></div>`, 2);
  var {
    Text
  } = shelter.ui;
  var SmallMediaCarousel = (props) => _tmpl$3.cloneNode(true);
  var MediaCarousel_default = (props) => (() => {
    const _el$2 = _tmpl$22.cloneNode(true);
    (0, import_web8.insert)(_el$2, (() => {
      const _c$ = (0, import_web9.memo)(() => !!props.media);
      return () => _c$() ? (0, import_web7.createComponent)(SmallMediaCarousel, {
        get items() {
          return (typeof props.media === "string" ? [props.media] : props.media).map((m) => ({
            type: 1,
            src: m
          }));
        },
        autoplayInterval: 5e3
      }) : (() => {
        const _el$3 = _tmpl$32.cloneNode(true);
        (0, import_web8.insert)(_el$3, (0, import_web7.createComponent)(Text, {
          "class": "ysink_stain_noimgtxt",
          children: "No Image"
        }), null);
        (0, import_web8.insert)(_el$3, (0, import_web7.createComponent)(SmallMediaCarousel, {
          items: [{
            type: 1,
            src: ""
          }]
        }), null);
        return _el$3;
      })();
    })());
    return _el$2;
  })();

  // plugins/snazzy-shelter/src/components/CarouselModal.jsx
  var _tmpl$4 = /* @__PURE__ */ (0, import_web10.template)(`<div></div>`, 2);
  var {
    openModal,
    ModalRoot,
    ModalHeader,
    ModalBody,
    ModalSizes
  } = shelter.ui;
  var CarouselModal_default = (media) => openModal(({
    close
  }) => (0, import_web12.createComponent)(ModalRoot, {
    get size() {
      return ModalSizes.MEDIUM;
    },
    get children() {
      return [(0, import_web12.createComponent)(ModalHeader, {
        close
      }), (0, import_web12.createComponent)(ModalBody, {
        get children() {
          const _el$ = _tmpl$4.cloneNode(true);
          _el$.style.setProperty("margin-bottom", "1rem");
          (0, import_web11.insert)(_el$, (0, import_web12.createComponent)(MediaCarousel_default, {
            media
          }));
          return _el$;
        }
      })];
    }
  }));

  // plugins/snazzy-shelter/src/assets/Delete.jsx
  var import_web13 = __toESM(require_web());
  var import_web14 = __toESM(require_web());
  var import_web15 = __toESM(require_web());
  var _tmpl$5 = /* @__PURE__ */ (0, import_web13.template)(`<svg><path d="M 3.9999998,21.333333 C 3.9999998,22.8 5.1999998,24 6.6666665,24 H 17.333334 C 18.799999,24 20,22.8 20,21.333333 V 5.3333333 H 3.9999998 Z M 7.2799998,11.84 9.1599995,9.96 12,12.786667 14.826667,9.96 l 1.879999,1.88 -2.826667,2.826667 2.826667,2.826666 -1.879999,1.88 L 12,16.546667 l -2.8266665,2.826666 -1.8800003,-1.88 2.8266658,-2.826666 z M 16.666666,1.3333333 15.333334,0 H 8.6666665 L 7.3333332,1.3333333 H 2.6666665 V 4 H 21.333334 V 1.3333333 Z"></path></svg>`, 4);
  var Delete_default = (props) => (() => {
    const _el$ = _tmpl$5.cloneNode(true);
    (0, import_web14.spread)(_el$, (0, import_web15.mergeProps)(props, {
      "xmlns": "http://www.w3.org/2000/svg",
      "height": "24px",
      "viewBox": "0 0 24 24",
      "width": "24px"
    }), true, true);
    return _el$;
  })();

  // plugins/snazzy-shelter/src/assets/Copy.jsx
  var import_web16 = __toESM(require_web());
  var import_web17 = __toESM(require_web());
  var import_web18 = __toESM(require_web());
  var _tmpl$6 = /* @__PURE__ */ (0, import_web16.template)(`<svg><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>`, 4);
  var Copy_default = (props) => (() => {
    const _el$ = _tmpl$6.cloneNode(true);
    (0, import_web17.spread)(_el$, (0, import_web18.mergeProps)(props, {
      "xmlns": "http://www.w3.org/2000/svg",
      "height": "24px",
      "viewBox": "0 0 24 24",
      "width": "24px"
    }), true, true);
    return _el$;
  })();

  // plugins/snazzy-shelter/src/components/cards/ThemeCard.jsx
  var _tmpl$7 = /* @__PURE__ */ (0, import_web19.template)(`<div class="ysink_stain_card ysink_stain_tcard"><div class="ysink_stain_tmedia"></div><div class="ysink_stain_title"></div><div class="ysink_stain_tdesc"></div><div class="ysink_stain_tacts"></div><div class="ysink_stain_taulic"></div></div>`, 12);
  var _tmpl$23 = /* @__PURE__ */ (0, import_web19.template)(`<div class="ysink_stain_tview">VIEW MEDIA</div>`, 2);
  var _tmpl$33 = /* @__PURE__ */ (0, import_web19.template)(`<div>NO MEDIA</div>`, 2);
  var {
    ui: {
      Switch
    },
    plugin: {
      store: store5
    }
  } = shelter;
  var copyText = (txt) => navigator.clipboard.writeText(txt);
  function themeIsEnabled(url) {
    for (const theme of store5.themes)
      if (theme.url === url && theme.enabled)
        return true;
    return false;
  }
  var themeIsInstalled = (url) => store5.themes.some((t) => t.url === url);
  var ThemeCard_default = (props) => (() => {
    const _el$ = _tmpl$7.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling, _el$6 = _el$5.nextSibling;
    _el$2.$$click = () => props.theme.media && CarouselModal_default(props.theme.media);
    (0, import_web23.insert)(_el$2, (() => {
      const _c$ = (0, import_web24.memo)(() => !!props.theme.media);
      return () => _c$() ? _tmpl$23.cloneNode(true) : _tmpl$33.cloneNode(true);
    })());
    (0, import_web23.insert)(_el$3, (() => {
      const _c$2 = (0, import_web24.memo)(() => !!props.theme.compat);
      return () => _c$2() ? (0, import_web22.createComponent)(BDBadge, {}) : (0, import_web22.createComponent)(CCBadge, {});
    })(), null);
    (0, import_web23.insert)(_el$3, () => props.theme.name, null);
    (0, import_web23.insert)(_el$4, () => props.theme.description);
    (0, import_web23.insert)(_el$5, (0, import_web22.createComponent)(Copy_default, {
      "class": "ysink_stain_iconbtn",
      onClick: () => copyText(props.theme.url)
    }), null);
    (0, import_web23.insert)(_el$5, (() => {
      const _c$3 = (0, import_web24.memo)(() => !!themeIsInstalled(props.theme.url));
      return () => _c$3() ? (0, import_web22.createComponent)(Delete_default, {
        "class": "ysink_stain_iconbtn",
        onClick: () => {
          removeTheme(props.theme);
        }
      }) : [];
    })(), null);
    (0, import_web23.insert)(_el$5, (0, import_web22.createComponent)(Switch, {
      get checked() {
        return themeIsEnabled(props.theme.url);
      },
      onChange: async () => themeIsEnabled(props.theme.url) ? unloadTheme(props.theme) : loadTheme(await fetchTheme_default(props.theme.url))
    }), null);
    (0, import_web23.insert)(_el$6, () => props.theme.author ? `by ${props.theme.author} ` : "", null);
    (0, import_web23.insert)(_el$6, () => props.theme.license ? `under ${props.theme.license}` : "", null);
    (0, import_web21.effect)((_p$) => {
      const _v$ = props.gap, _v$2 = props.theme.media && `url(${Array.isArray(props.theme.media) ? props.theme.media[0] : props.theme.media})`;
      _v$ !== _p$._v$ && _el$.style.setProperty("margin-bottom", _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && _el$2.style.setProperty("background-image", _p$._v$2 = _v$2);
      return _p$;
    }, {
      _v$: void 0,
      _v$2: void 0
    });
    return _el$;
  })();
  (0, import_web20.delegateEvents)(["click"]);

  // plugins/snazzy-shelter/src/components/InstallBar.jsx
  var import_web25 = __toESM(require_web());
  var import_web26 = __toESM(require_web());
  var import_web27 = __toESM(require_web());
  var import_web28 = __toESM(require_web());
  var import_web29 = __toESM(require_web());
  var _tmpl$8 = /* @__PURE__ */ (0, import_web25.template)(`<div class="ysink_stain_row"><input class="ysink_stain_input" placeholder="Theme import URL" type="text"></div>`, 3);
  var {
    ui: {
      Button,
      ButtonSizes,
      showToast
    },
    solid: {
      createSignal
    }
  } = shelter;
  var InstallBar_default = () => {
    const [urlInput, setUrlInput] = createSignal("");
    return (() => {
      const _el$ = _tmpl$8.cloneNode(true), _el$2 = _el$.firstChild;
      _el$2.$$input = (e) => setUrlInput(e.target.value);
      (0, import_web27.insert)(_el$, (0, import_web28.createComponent)(Button, {
        "class": "ysink_stain_button",
        get size() {
          return ButtonSizes.MEDIUM;
        },
        onClick: () => {
          fetchTheme_default(urlInput()).then(async (t) => {
            await loadTheme(t);
            showToast({
              title: `Loaded theme ${t.name}`,
              duration: 5e3
            });
            setUrlInput("");
          }, () => showToast({
            title: "Failed to fetch theme - check URL",
            duration: 5e3
          }));
        },
        children: "Install"
      }), null);
      (0, import_web29.effect)(() => _el$2.value = urlInput());
      return _el$;
    })();
  };
  (0, import_web26.delegateEvents)(["input"]);

  // node_modules/.pnpm/fuse.js@6.6.2/node_modules/fuse.js/dist/fuse.esm.js
  function isArray(value) {
    return !Array.isArray ? getTag(value) === "[object Array]" : Array.isArray(value);
  }
  var INFINITY = 1 / 0;
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    let result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  function isString(value) {
    return typeof value === "string";
  }
  function isNumber(value) {
    return typeof value === "number";
  }
  function isBoolean(value) {
    return value === true || value === false || isObjectLike(value) && getTag(value) == "[object Boolean]";
  }
  function isObject(value) {
    return typeof value === "object";
  }
  function isObjectLike(value) {
    return isObject(value) && value !== null;
  }
  function isDefined(value) {
    return value !== void 0 && value !== null;
  }
  function isBlank(value) {
    return !value.trim().length;
  }
  function getTag(value) {
    return value == null ? value === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(value);
  }
  var INCORRECT_INDEX_TYPE = "Incorrect 'index' type";
  var LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key) => `Invalid value for key ${key}`;
  var PATTERN_LENGTH_TOO_LARGE = (max) => `Pattern length exceeds max of ${max}.`;
  var MISSING_KEY_PROPERTY = (name) => `Missing ${name} property in key`;
  var INVALID_KEY_WEIGHT_VALUE = (key) => `Property 'weight' in key '${key}' must be a positive integer`;
  var hasOwn = Object.prototype.hasOwnProperty;
  var KeyStore = class {
    constructor(keys) {
      this._keys = [];
      this._keyMap = {};
      let totalWeight = 0;
      keys.forEach((key) => {
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
    if (isString(key) || isArray(key)) {
      src = key;
      path = createKeyPath(key);
      id = createKeyId(key);
    } else {
      if (!hasOwn.call(key, "name")) {
        throw new Error(MISSING_KEY_PROPERTY("name"));
      }
      const name = key.name;
      src = name;
      if (hasOwn.call(key, "weight")) {
        weight = key.weight;
        if (weight <= 0) {
          throw new Error(INVALID_KEY_WEIGHT_VALUE(name));
        }
      }
      path = createKeyPath(name);
      id = createKeyId(name);
      getFn = key.getFn;
    }
    return { path, id, weight, src, getFn };
  }
  function createKeyPath(key) {
    return isArray(key) ? key : key.split(".");
  }
  function createKeyId(key) {
    return isArray(key) ? key.join(".") : key;
  }
  function get(obj, path) {
    let list = [];
    let arr = false;
    const deepGet = (obj2, path2, index2) => {
      if (!isDefined(obj2)) {
        return;
      }
      if (!path2[index2]) {
        list.push(obj2);
      } else {
        let key = path2[index2];
        const value = obj2[key];
        if (!isDefined(value)) {
          return;
        }
        if (index2 === path2.length - 1 && (isString(value) || isNumber(value) || isBoolean(value))) {
          list.push(toString(value));
        } else if (isArray(value)) {
          arr = true;
          for (let i = 0, len = value.length; i < len; i += 1) {
            deepGet(value[i], path2, index2 + 1);
          }
        } else if (path2.length) {
          deepGet(value, path2, index2 + 1);
        }
      }
    };
    deepGet(obj, isString(path) ? path.split(".") : path, 0);
    return arr ? list : list[0];
  }
  var MatchOptions = {
    includeMatches: false,
    findAllMatches: false,
    minMatchCharLength: 1
  };
  var BasicOptions = {
    isCaseSensitive: false,
    includeScore: false,
    keys: [],
    shouldSort: true,
    sortFn: (a, b) => a.score === b.score ? a.idx < b.idx ? -1 : 1 : a.score < b.score ? -1 : 1
  };
  var FuzzyOptions = {
    location: 0,
    threshold: 0.6,
    distance: 100
  };
  var AdvancedOptions = {
    useExtendedSearch: false,
    getFn: get,
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
  var SPACE = /[^ ]+/g;
  function norm(weight = 1, mantissa = 3) {
    const cache2 = /* @__PURE__ */ new Map();
    const m = Math.pow(10, mantissa);
    return {
      get(value) {
        const numTokens = value.match(SPACE).length;
        if (cache2.has(numTokens)) {
          return cache2.get(numTokens);
        }
        const norm2 = 1 / Math.pow(numTokens, 0.5 * weight);
        const n = parseFloat(Math.round(norm2 * m) / m);
        cache2.set(numTokens, n);
        return n;
      },
      clear() {
        cache2.clear();
      }
    };
  }
  var FuseIndex = class {
    constructor({
      getFn = Config.getFn,
      fieldNormWeight = Config.fieldNormWeight
    } = {}) {
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
    setKeys(keys = []) {
      this.keys = keys;
      this._keysMap = {};
      keys.forEach((key, idx) => {
        this._keysMap[key.id] = idx;
      });
    }
    create() {
      if (this.isCreated || !this.docs.length) {
        return;
      }
      this.isCreated = true;
      if (isString(this.docs[0])) {
        this.docs.forEach((doc, docIndex) => {
          this._addString(doc, docIndex);
        });
      } else {
        this.docs.forEach((doc, docIndex) => {
          this._addObject(doc, docIndex);
        });
      }
      this.norm.clear();
    }
    add(doc) {
      const idx = this.size();
      if (isString(doc)) {
        this._addString(doc, idx);
      } else {
        this._addObject(doc, idx);
      }
    }
    removeAt(idx) {
      this.records.splice(idx, 1);
      for (let i = idx, len = this.size(); i < len; i += 1) {
        this.records[i].i -= 1;
      }
    }
    getValueForItemAtKeyId(item, keyId) {
      return item[this._keysMap[keyId]];
    }
    size() {
      return this.records.length;
    }
    _addString(doc, docIndex) {
      if (!isDefined(doc) || isBlank(doc)) {
        return;
      }
      let record = {
        v: doc,
        i: docIndex,
        n: this.norm.get(doc)
      };
      this.records.push(record);
    }
    _addObject(doc, docIndex) {
      let record = { i: docIndex, $: {} };
      this.keys.forEach((key, keyIndex) => {
        let value = key.getFn ? key.getFn(doc) : this.getFn(doc, key.path);
        if (!isDefined(value)) {
          return;
        }
        if (isArray(value)) {
          let subRecords = [];
          const stack = [{ nestedArrIndex: -1, value }];
          while (stack.length) {
            const { nestedArrIndex, value: value2 } = stack.pop();
            if (!isDefined(value2)) {
              continue;
            }
            if (isString(value2) && !isBlank(value2)) {
              let subRecord = {
                v: value2,
                i: nestedArrIndex,
                n: this.norm.get(value2)
              };
              subRecords.push(subRecord);
            } else if (isArray(value2)) {
              value2.forEach((item, k) => {
                stack.push({
                  nestedArrIndex: k,
                  value: item
                });
              });
            } else
              ;
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
  function createIndex(keys, docs, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
    const myIndex = new FuseIndex({ getFn, fieldNormWeight });
    myIndex.setKeys(keys.map(createKey));
    myIndex.setSources(docs);
    myIndex.create();
    return myIndex;
  }
  function parseIndex(data, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
    const { keys, records } = data;
    const myIndex = new FuseIndex({ getFn, fieldNormWeight });
    myIndex.setKeys(keys);
    myIndex.setIndexRecords(records);
    return myIndex;
  }
  function computeScore$1(pattern, {
    errors = 0,
    currentLocation = 0,
    expectedLocation = 0,
    distance = Config.distance,
    ignoreLocation = Config.ignoreLocation
  } = {}) {
    const accuracy = errors / pattern.length;
    if (ignoreLocation) {
      return accuracy;
    }
    const proximity = Math.abs(expectedLocation - currentLocation);
    if (!distance) {
      return proximity ? 1 : accuracy;
    }
    return accuracy + proximity / distance;
  }
  function convertMaskToIndices(matchmask = [], minMatchCharLength = Config.minMatchCharLength) {
    let indices = [];
    let start = -1;
    let end = -1;
    let i = 0;
    for (let len = matchmask.length; i < len; i += 1) {
      let match = matchmask[i];
      if (match && start === -1) {
        start = i;
      } else if (!match && start !== -1) {
        end = i - 1;
        if (end - start + 1 >= minMatchCharLength) {
          indices.push([start, end]);
        }
        start = -1;
      }
    }
    if (matchmask[i - 1] && i - start >= minMatchCharLength) {
      indices.push([start, i - 1]);
    }
    return indices;
  }
  var MAX_BITS = 32;
  function search(text, pattern, patternAlphabet, {
    location = Config.location,
    distance = Config.distance,
    threshold = Config.threshold,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    includeMatches = Config.includeMatches,
    ignoreLocation = Config.ignoreLocation
  } = {}) {
    if (pattern.length > MAX_BITS) {
      throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS));
    }
    const patternLen = pattern.length;
    const textLen = text.length;
    const expectedLocation = Math.max(0, Math.min(location, textLen));
    let currentThreshold = threshold;
    let bestLocation = expectedLocation;
    const computeMatches = minMatchCharLength > 1 || includeMatches;
    const matchMask = computeMatches ? Array(textLen) : [];
    let index2;
    while ((index2 = text.indexOf(pattern, bestLocation)) > -1) {
      let score = computeScore$1(pattern, {
        currentLocation: index2,
        expectedLocation,
        distance,
        ignoreLocation
      });
      currentThreshold = Math.min(score, currentThreshold);
      bestLocation = index2 + patternLen;
      if (computeMatches) {
        let i = 0;
        while (i < patternLen) {
          matchMask[index2 + i] = 1;
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
        const score2 = computeScore$1(pattern, {
          errors: i,
          currentLocation: expectedLocation + binMid,
          expectedLocation,
          distance,
          ignoreLocation
        });
        if (score2 <= currentThreshold) {
          binMin = binMid;
        } else {
          binMax = binMid;
        }
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
        if (computeMatches) {
          matchMask[currentLocation] = +!!charMatch;
        }
        bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch;
        if (i) {
          bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
        }
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
            if (bestLocation <= expectedLocation) {
              break;
            }
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
      if (score > currentThreshold) {
        break;
      }
      lastBitArr = bitArr;
    }
    const result = {
      isMatch: bestLocation >= 0,
      score: Math.max(1e-3, finalScore)
    };
    if (computeMatches) {
      const indices = convertMaskToIndices(matchMask, minMatchCharLength);
      if (!indices.length) {
        result.isMatch = false;
      } else if (includeMatches) {
        result.indices = indices;
      }
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
    constructor(pattern, {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreLocation = Config.ignoreLocation
    } = {}) {
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
      if (!this.pattern.length) {
        return;
      }
      const addChunk = (pattern2, startIndex) => {
        this.chunks.push({
          pattern: pattern2,
          alphabet: createPatternAlphabet(pattern2),
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
      } else {
        addChunk(this.pattern, 0);
      }
    }
    searchIn(text) {
      const { isCaseSensitive, includeMatches } = this.options;
      if (!isCaseSensitive) {
        text = text.toLowerCase();
      }
      if (this.pattern === text) {
        let result2 = {
          isMatch: true,
          score: 0
        };
        if (includeMatches) {
          result2.indices = [[0, text.length - 1]];
        }
        return result2;
      }
      const {
        location,
        distance,
        threshold,
        findAllMatches,
        minMatchCharLength,
        ignoreLocation
      } = this.options;
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
        if (isMatch) {
          hasMatches = true;
        }
        totalScore += score;
        if (isMatch && indices) {
          allIndices = [...allIndices, ...indices];
        }
      });
      let result = {
        isMatch: hasMatches,
        score: hasMatches ? totalScore / this.chunks.length : 1
      };
      if (hasMatches && includeMatches) {
        result.indices = allIndices;
      }
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
    search() {
    }
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
      const index2 = text.indexOf(this.pattern);
      const isMatch = index2 === -1;
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
    constructor(pattern, {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreLocation = Config.ignoreLocation
    } = {}) {
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
      let index2;
      const indices = [];
      const patternLen = this.pattern.length;
      while ((index2 = text.indexOf(this.pattern, location)) > -1) {
        location = index2 + patternLen;
        indices.push([index2, location - 1]);
      }
      const isMatch = !!indices.length;
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices
      };
    }
  };
  var searchers = [
    ExactMatch,
    IncludeMatch,
    PrefixExactMatch,
    InversePrefixExactMatch,
    InverseSuffixExactMatch,
    SuffixExactMatch,
    InverseExactMatch,
    FuzzyMatch
  ];
  var searchersLen = searchers.length;
  var SPACE_RE = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
  var OR_TOKEN = "|";
  function parseQuery(pattern, options = {}) {
    return pattern.split(OR_TOKEN).map((item) => {
      let query = item.trim().split(SPACE_RE).filter((item2) => item2 && !!item2.trim());
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
        if (found) {
          continue;
        }
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
  var MultiMatchSet = /* @__PURE__ */ new Set([FuzzyMatch.type, IncludeMatch.type]);
  var ExtendedSearch = class {
    constructor(pattern, {
      isCaseSensitive = Config.isCaseSensitive,
      includeMatches = Config.includeMatches,
      minMatchCharLength = Config.minMatchCharLength,
      ignoreLocation = Config.ignoreLocation,
      findAllMatches = Config.findAllMatches,
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance
    } = {}) {
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
    static condition(_2, options) {
      return options.useExtendedSearch;
    }
    searchIn(text) {
      const query = this.query;
      if (!query) {
        return {
          isMatch: false,
          score: 1
        };
      }
      const { includeMatches, isCaseSensitive } = this.options;
      text = isCaseSensitive ? text : text.toLowerCase();
      let numMatches = 0;
      let allIndices = [];
      let totalScore = 0;
      for (let i = 0, qLen = query.length; i < qLen; i += 1) {
        const searchers2 = query[i];
        allIndices.length = 0;
        numMatches = 0;
        for (let j = 0, pLen = searchers2.length; j < pLen; j += 1) {
          const searcher = searchers2[j];
          const { isMatch, indices, score } = searcher.search(text);
          if (isMatch) {
            numMatches += 1;
            totalScore += score;
            if (includeMatches) {
              const type = searcher.constructor.type;
              if (MultiMatchSet.has(type)) {
                allIndices = [...allIndices, ...indices];
              } else {
                allIndices.push(indices);
              }
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
          if (includeMatches) {
            result.indices = allIndices;
          }
          return result;
        }
      }
      return {
        isMatch: false,
        score: 1
      };
    }
  };
  var registeredSearchers = [];
  function register(...args) {
    registeredSearchers.push(...args);
  }
  function createSearcher(pattern, options) {
    for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
      let searcherClass = registeredSearchers[i];
      if (searcherClass.condition(pattern, options)) {
        return new searcherClass(pattern, options);
      }
    }
    return new BitapSearch(pattern, options);
  }
  var LogicalOperator = {
    AND: "$and",
    OR: "$or"
  };
  var KeyType = {
    PATH: "$path",
    PATTERN: "$val"
  };
  var isExpression = (query) => !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);
  var isPath = (query) => !!query[KeyType.PATH];
  var isLeaf = (query) => !isArray(query) && isObject(query) && !isExpression(query);
  var convertToExplicit = (query) => ({
    [LogicalOperator.AND]: Object.keys(query).map((key) => ({
      [key]: query[key]
    }))
  });
  function parse(query, options, { auto = true } = {}) {
    const next = (query2) => {
      let keys = Object.keys(query2);
      const isQueryPath = isPath(query2);
      if (!isQueryPath && keys.length > 1 && !isExpression(query2)) {
        return next(convertToExplicit(query2));
      }
      if (isLeaf(query2)) {
        const key = isQueryPath ? query2[KeyType.PATH] : keys[0];
        const pattern = isQueryPath ? query2[KeyType.PATTERN] : query2[key];
        if (!isString(pattern)) {
          throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key));
        }
        const obj = {
          keyId: createKeyId(key),
          pattern
        };
        if (auto) {
          obj.searcher = createSearcher(pattern, options);
        }
        return obj;
      }
      let node = {
        children: [],
        operator: keys[0]
      };
      keys.forEach((key) => {
        const value = query2[key];
        if (isArray(value)) {
          value.forEach((item) => {
            node.children.push(next(item));
          });
        }
      });
      return node;
    };
    if (!isExpression(query)) {
      query = convertToExplicit(query);
    }
    return next(query);
  }
  function computeScore(results, { ignoreFieldNorm = Config.ignoreFieldNorm }) {
    results.forEach((result) => {
      let totalScore = 1;
      result.matches.forEach(({ key, norm: norm2, score }) => {
        const weight = key ? key.weight : null;
        totalScore *= Math.pow(
          score === 0 && weight ? Number.EPSILON : score,
          (weight || 1) * (ignoreFieldNorm ? 1 : norm2)
        );
      });
      result.score = totalScore;
    });
  }
  function transformMatches(result, data) {
    const matches = result.matches;
    data.matches = [];
    if (!isDefined(matches)) {
      return;
    }
    matches.forEach((match) => {
      if (!isDefined(match.indices) || !match.indices.length) {
        return;
      }
      const { indices, value } = match;
      let obj = {
        indices,
        value
      };
      if (match.key) {
        obj.key = match.key.src;
      }
      if (match.idx > -1) {
        obj.refIndex = match.idx;
      }
      data.matches.push(obj);
    });
  }
  function transformScore(result, data) {
    data.score = result.score;
  }
  function format(results, docs, {
    includeMatches = Config.includeMatches,
    includeScore = Config.includeScore
  } = {}) {
    const transformers = [];
    if (includeMatches)
      transformers.push(transformMatches);
    if (includeScore)
      transformers.push(transformScore);
    return results.map((result) => {
      const { idx } = result;
      const data = {
        item: docs[idx],
        refIndex: idx
      };
      if (transformers.length) {
        transformers.forEach((transformer) => {
          transformer(result, data);
        });
      }
      return data;
    });
  }
  var Fuse = class {
    constructor(docs, options = {}, index2) {
      this.options = { ...Config, ...options };
      if (this.options.useExtendedSearch && false) {
        throw new Error(EXTENDED_SEARCH_UNAVAILABLE);
      }
      this._keyStore = new KeyStore(this.options.keys);
      this.setCollection(docs, index2);
    }
    setCollection(docs, index2) {
      this._docs = docs;
      if (index2 && !(index2 instanceof FuseIndex)) {
        throw new Error(INCORRECT_INDEX_TYPE);
      }
      this._myIndex = index2 || createIndex(this.options.keys, this._docs, {
        getFn: this.options.getFn,
        fieldNormWeight: this.options.fieldNormWeight
      });
    }
    add(doc) {
      if (!isDefined(doc)) {
        return;
      }
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
      const {
        includeMatches,
        includeScore,
        shouldSort,
        sortFn,
        ignoreFieldNorm
      } = this.options;
      let results = isString(query) ? isString(this._docs[0]) ? this._searchStringList(query) : this._searchObjectList(query) : this._searchLogical(query);
      computeScore(results, { ignoreFieldNorm });
      if (shouldSort) {
        results.sort(sortFn);
      }
      if (isNumber(limit) && limit > -1) {
        results = results.slice(0, limit);
      }
      return format(results, this._docs, {
        includeMatches,
        includeScore
      });
    }
    _searchStringList(query) {
      const searcher = createSearcher(query, this.options);
      const { records } = this._myIndex;
      const results = [];
      records.forEach(({ v: text, i: idx, n: norm2 }) => {
        if (!isDefined(text)) {
          return;
        }
        const { isMatch, score, indices } = searcher.searchIn(text);
        if (isMatch) {
          results.push({
            item: text,
            idx,
            matches: [{ score, value: text, norm: norm2, indices }]
          });
        }
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
          if (matches && matches.length) {
            return [
              {
                idx,
                item,
                matches
              }
            ];
          }
          return [];
        }
        const res = [];
        for (let i = 0, len = node.children.length; i < len; i += 1) {
          const child = node.children[i];
          const result = evaluate(child, item, idx);
          if (result.length) {
            res.push(...result);
          } else if (node.operator === LogicalOperator.AND) {
            return [];
          }
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
              resultMap[idx] = { idx, item, matches: [] };
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
      const { keys, records } = this._myIndex;
      const results = [];
      records.forEach(({ $: item, i: idx }) => {
        if (!isDefined(item)) {
          return;
        }
        let matches = [];
        keys.forEach((key, keyIndex) => {
          matches.push(
            ...this._findMatches({
              key,
              value: item[keyIndex],
              searcher
            })
          );
        });
        if (matches.length) {
          results.push({
            idx,
            item,
            matches
          });
        }
      });
      return results;
    }
    _findMatches({ key, value, searcher }) {
      if (!isDefined(value)) {
        return [];
      }
      let matches = [];
      if (isArray(value)) {
        value.forEach(({ v: text, i: idx, n: norm2 }) => {
          if (!isDefined(text)) {
            return;
          }
          const { isMatch, score, indices } = searcher.searchIn(text);
          if (isMatch) {
            matches.push({
              score,
              key,
              value: text,
              idx,
              norm: norm2,
              indices
            });
          }
        });
      } else {
        const { v: text, n: norm2 } = value;
        const { isMatch, score, indices } = searcher.searchIn(text);
        if (isMatch) {
          matches.push({ score, key, value: text, norm: norm2, indices });
        }
      }
      return matches;
    }
  };
  Fuse.version = "6.6.2";
  Fuse.createIndex = createIndex;
  Fuse.parseIndex = parseIndex;
  Fuse.config = Config;
  {
    Fuse.parseQuery = parse;
  }
  {
    register(ExtendedSearch);
  }

  // plugins/snazzy-shelter/src/util/fuzzy.js
  var fuseOptions = {
    threshold: 0.5,
    useExtendedSearch: true,
    keys: ["name", "author", "description"]
  };
  var fuzzy = (set, search2) => !search2 || search2 === "" ? set : new Fuse(set, fuseOptions).search(search2).map((searchResult) => searchResult.item);
  var fuzzyThemes = (themes, search2, filterMode) => fuzzy(_.uniqBy(themes ?? [], (t) => t.url), search2).filter(
    (t) => filterMode === "0" || filterMode === "1" && !t.compat || filterMode === "2" && t.compat
  );

  // plugins/snazzy-shelter/src/components/SearchBar.jsx
  var import_web30 = __toESM(require_web());
  var import_web31 = __toESM(require_web());
  var import_web32 = __toESM(require_web());
  var import_web33 = __toESM(require_web());
  var import_web34 = __toESM(require_web());
  var import_web35 = __toESM(require_web());
  var _tmpl$9 = /* @__PURE__ */ (0, import_web30.template)(`<input type="text">`, 1);
  var SearchBar = (props) => (() => {
    const _el$ = _tmpl$9.cloneNode(true);
    _el$.$$input = (e) => props.onQueryChange(e.target.value);
    (0, import_web35.effect)((_p$) => {
      const _v$ = props.class, _v$2 = props.placeholder;
      _v$ !== _p$._v$ && (0, import_web34.className)(_el$, _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && (0, import_web33.setAttribute)(_el$, "placeholder", _p$._v$2 = _v$2);
      return _p$;
    }, {
      _v$: void 0,
      _v$2: void 0
    });
    (0, import_web35.effect)(() => _el$.value = props.query);
    return _el$;
  })();
  var SearchBar_default = (props) => (0, import_web32.createComponent)(SearchBar, {
    "class": "ysink_stain_searchbar",
    get query() {
      return props.query;
    },
    get onQueryChange() {
      return props.onChange;
    },
    placeholder: "Search themes...",
    get size() {
      return SearchBar.Sizes.MEDIUM;
    }
  });
  (0, import_web31.delegateEvents)(["input"]);

  // plugins/snazzy-shelter/src/components/CompatFilterDropdown.jsx
  var import_web36 = __toESM(require_web());
  var import_web37 = __toESM(require_web());
  var import_web38 = __toESM(require_web());
  var import_web39 = __toESM(require_web());
  var import_web40 = __toESM(require_web());
  var _tmpl$10 = /* @__PURE__ */ (0, import_web36.template)(`<select></select>`, 2);
  var _tmpl$24 = /* @__PURE__ */ (0, import_web36.template)(`<option></option>`, 2);
  var SingleSelect = (props) => (() => {
    const _el$ = _tmpl$10.cloneNode(true);
    _el$.addEventListener("change", (e) => props.onChange(e.target.value));
    (0, import_web39.insert)(_el$, () => props.options.map((opt) => (() => {
      const _el$2 = _tmpl$24.cloneNode(true);
      (0, import_web39.insert)(_el$2, () => opt.label);
      (0, import_web40.effect)(() => _el$2.value = opt.value);
      return _el$2;
    })()));
    (0, import_web40.effect)((_p$) => {
      const _v$ = props.isDisabled, _v$2 = props.class;
      _v$ !== _p$._v$ && (_el$.disabled = _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && (0, import_web38.className)(_el$, _p$._v$2 = _v$2);
      return _p$;
    }, {
      _v$: void 0,
      _v$2: void 0
    });
    (0, import_web40.effect)(() => _el$.value = props.value);
    return _el$;
  })();
  var CompatFilterDropdown_default = (props) => (0, import_web37.createComponent)(SingleSelect, {
    options: [{
      value: 0,
      label: "Show All"
    }, {
      value: 1,
      label: "CC Only"
    }, {
      value: 2,
      label: "BD Only"
    }],
    get value() {
      return props.filterMode;
    },
    get onChange() {
      return props.setFilterMode;
    },
    isDisabled: false,
    "class": "ysink_stain_dropdown"
  });

  // plugins/snazzy-shelter/src/components/splashes.jsx
  var import_web41 = __toESM(require_web());
  var import_web42 = __toESM(require_web());
  var import_web43 = __toESM(require_web());
  var _tmpl$11 = /* @__PURE__ */ (0, import_web41.template)(`<div class="ysink_stain_nosplash"></div>`, 2);
  var {
    Header,
    HeaderTags,
    Text: Text2,
    Button: Button2,
    ButtonColors,
    ButtonSizes: ButtonSizes2
  } = shelter.ui;
  var Splash = (props) => (() => {
    const _el$ = _tmpl$11.cloneNode(true);
    (0, import_web42.insert)(_el$, (0, import_web43.createComponent)(Header, {
      get tag() {
        return HeaderTags.H2;
      },
      get children() {
        return props.title;
      }
    }), null);
    (0, import_web42.insert)(_el$, (0, import_web43.createComponent)(Text2, {
      get children() {
        return props.subtitle;
      }
    }), null);
    (0, import_web42.insert)(_el$, (0, import_web43.createComponent)(Button2, {
      "class": "ysink_stain_button",
      get color() {
        return ButtonColors.GREEN;
      },
      get size() {
        return ButtonSizes2.LARGE;
      },
      get onClick() {
        return props.onClick;
      },
      get children() {
        return props.btnText;
      }
    }), null);
    return _el$;
  })();
  var NoRepos = (props) => (0, import_web43.createComponent)(Splash, {
    title: "No Repos",
    subtitle: "Add one in the repo manager!",
    get onClick() {
      return props.goToRepos;
    },
    btnText: "Open repo manager"
  });
  var NoThemes = (props) => (0, import_web43.createComponent)(Splash, {
    title: "No Themes",
    subtitle: "Paste a link in above, or head over to the store",
    get onClick() {
      return props.goToStore;
    },
    btnText: "Get some themes"
  });

  // plugins/snazzy-shelter/src/components/tabs/TabInstalled.jsx
  var _tmpl$12 = /* @__PURE__ */ (0, import_web44.template)(`<div class="ysink_stain_search_row"></div>`, 2);
  var _tmpl$25 = /* @__PURE__ */ (0, import_web44.template)(`<div class="ysink_stain_cardcontainer"></div>`, 2);
  var {
    solid: {
      createSignal: createSignal2
    },
    plugin: {
      store: store6
    }
  } = shelter;
  var TabInstalled_default = (props) => {
    const [search2, setSearch] = createSignal2("");
    const [filterMode, setFilterMode] = createSignal2("0");
    return [(0, import_web48.createComponent)(InstallBar_default, {}), (() => {
      const _el$ = _tmpl$12.cloneNode(true);
      (0, import_web47.insert)(_el$, (0, import_web48.createComponent)(SearchBar_default, {
        get query() {
          return search2();
        },
        onChange: setSearch
      }), null);
      (0, import_web47.insert)(_el$, (0, import_web48.createComponent)(CompatFilterDropdown_default, {
        get filterMode() {
          return filterMode();
        },
        setFilterMode
      }), null);
      return _el$;
    })(), (0, import_web46.memo)((() => {
      const _c$ = (0, import_web46.memo)(() => store6.themes.length === 0);
      return () => _c$() ? (0, import_web48.createComponent)(NoThemes, {
        goToStore: () => props.goTo(1)
      }) : (() => {
        const _el$2 = _tmpl$25.cloneNode(true);
        (0, import_web47.insert)(_el$2, () => fuzzyThemes(store6.themes, search2(), filterMode()).map((theme) => (0, import_web48.createComponent)(ThemeCard_default, (0, import_web45.mergeProps)(() => ({
          key: theme.url,
          theme
        })))));
        return _el$2;
      })();
    })())];
  };

  // plugins/snazzy-shelter/src/components/tabs/TabQuickCSS.jsx
  var import_web52 = __toESM(require_web());
  var import_web53 = __toESM(require_web());
  var import_web54 = __toESM(require_web());
  var import_web55 = __toESM(require_web());

  // node_modules/.pnpm/@uwu+monaco-solid@1.1.0/node_modules/@uwu/monaco-solid/dist/index.jsx
  var import_web49 = __toESM(require_web());
  var import_web50 = __toESM(require_web());
  var import_web51 = __toESM(require_web());
  var import_solid_js = __toESM(require_solid_js());

  // node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/_virtual/_rollupPluginBabelHelpers.js
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null)
      return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
          continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // node_modules/.pnpm/state-local@1.0.7/node_modules/state-local/lib/es/state-local.js
  function _defineProperty2(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function ownKeys2(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread22(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys2(Object(source), true).forEach(function(key) {
          _defineProperty2(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys2(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function compose() {
    for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }
    return function(x) {
      return fns.reduceRight(function(y, f) {
        return f(y);
      }, x);
    };
  }
  function curry(fn) {
    return function curried() {
      var _this = this;
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return args.length >= fn.length ? fn.apply(this, args) : function() {
        for (var _len3 = arguments.length, nextArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          nextArgs[_key3] = arguments[_key3];
        }
        return curried.apply(_this, [].concat(args, nextArgs));
      };
    };
  }
  function isObject2(value) {
    return {}.toString.call(value).includes("Object");
  }
  function isEmpty(obj) {
    return !Object.keys(obj).length;
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  function hasOwnProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }
  function validateChanges(initial, changes) {
    if (!isObject2(changes))
      errorHandler("changeType");
    if (Object.keys(changes).some(function(field) {
      return !hasOwnProperty(initial, field);
    }))
      errorHandler("changeField");
    return changes;
  }
  function validateSelector(selector) {
    if (!isFunction(selector))
      errorHandler("selectorType");
  }
  function validateHandler(handler) {
    if (!(isFunction(handler) || isObject2(handler)))
      errorHandler("handlerType");
    if (isObject2(handler) && Object.values(handler).some(function(_handler) {
      return !isFunction(_handler);
    }))
      errorHandler("handlersType");
  }
  function validateInitial(initial) {
    if (!initial)
      errorHandler("initialIsRequired");
    if (!isObject2(initial))
      errorHandler("initialType");
    if (isEmpty(initial))
      errorHandler("initialContent");
  }
  function throwError(errorMessages3, type) {
    throw new Error(errorMessages3[type] || errorMessages3["default"]);
  }
  var errorMessages = {
    initialIsRequired: "initial state is required",
    initialType: "initial state should be an object",
    initialContent: "initial state shouldn't be an empty object",
    handlerType: "handler should be an object or a function",
    handlersType: "all handlers should be a functions",
    selectorType: "selector should be a function",
    changeType: "provided value of changes should be an object",
    changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',
    "default": "an unknown error accured in `state-local` package"
  };
  var errorHandler = curry(throwError)(errorMessages);
  var validators = {
    changes: validateChanges,
    selector: validateSelector,
    handler: validateHandler,
    initial: validateInitial
  };
  function create(initial) {
    var handler = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    validators.initial(initial);
    validators.handler(handler);
    var state = {
      current: initial
    };
    var didUpdate = curry(didStateUpdate)(state, handler);
    var update = curry(updateState)(state);
    var validate = curry(validators.changes)(initial);
    var getChanges = curry(extractChanges)(state);
    function getState2() {
      var selector = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function(state2) {
        return state2;
      };
      validators.selector(selector);
      return selector(state.current);
    }
    function setState2(causedChanges) {
      compose(didUpdate, update, validate, getChanges)(causedChanges);
    }
    return [getState2, setState2];
  }
  function extractChanges(state, causedChanges) {
    return isFunction(causedChanges) ? causedChanges(state.current) : causedChanges;
  }
  function updateState(state, changes) {
    state.current = _objectSpread22(_objectSpread22({}, state.current), changes);
    return changes;
  }
  function didStateUpdate(state, handler, changes) {
    isFunction(handler) ? handler(state.current) : Object.keys(changes).forEach(function(field) {
      var _handler$field;
      return (_handler$field = handler[field]) === null || _handler$field === void 0 ? void 0 : _handler$field.call(handler, state.current[field]);
    });
    return changes;
  }
  var index = {
    create
  };
  var state_local_default = index;

  // node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/config/index.js
  var config = {
    paths: {
      vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs"
    }
  };
  var config_default = config;

  // node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/utils/curry.js
  function curry2(fn) {
    return function curried() {
      var _this = this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return args.length >= fn.length ? fn.apply(this, args) : function() {
        for (var _len2 = arguments.length, nextArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          nextArgs[_key2] = arguments[_key2];
        }
        return curried.apply(_this, [].concat(args, nextArgs));
      };
    };
  }
  var curry_default = curry2;

  // node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/utils/isObject.js
  function isObject3(value) {
    return {}.toString.call(value).includes("Object");
  }
  var isObject_default = isObject3;

  // node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/validators/index.js
  function validateConfig(config3) {
    if (!config3)
      errorHandler2("configIsRequired");
    if (!isObject_default(config3))
      errorHandler2("configType");
    if (config3.urls) {
      informAboutDeprecation();
      return {
        paths: {
          vs: config3.urls.monacoBase
        }
      };
    }
    return config3;
  }
  function informAboutDeprecation() {
    console.warn(errorMessages2.deprecation);
  }
  function throwError2(errorMessages3, type) {
    throw new Error(errorMessages3[type] || errorMessages3["default"]);
  }
  var errorMessages2 = {
    configIsRequired: "the configuration object is required",
    configType: "the configuration object should be an object",
    "default": "an unknown error accured in `@monaco-editor/loader` package",
    deprecation: "Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "
  };
  var errorHandler2 = curry_default(throwError2)(errorMessages2);
  var validators2 = {
    config: validateConfig
  };
  var validators_default = validators2;

  // node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/utils/compose.js
  var compose2 = function compose3() {
    for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }
    return function(x) {
      return fns.reduceRight(function(y, f) {
        return f(y);
      }, x);
    };
  };
  var compose_default = compose2;

  // node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/utils/deepMerge.js
  function merge(target, source) {
    Object.keys(source).forEach(function(key) {
      if (source[key] instanceof Object) {
        if (target[key]) {
          Object.assign(source[key], merge(target[key], source[key]));
        }
      }
    });
    return _objectSpread2(_objectSpread2({}, target), source);
  }
  var deepMerge_default = merge;

  // node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/utils/makeCancelable.js
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

  // node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/loader/index.js
  var _state$create = state_local_default.create({
    config: config_default,
    isInitialized: false,
    resolve: null,
    reject: null,
    monaco: null
  });
  var _state$create2 = _slicedToArray(_state$create, 2);
  var getState = _state$create2[0];
  var setState = _state$create2[1];
  function config2(globalConfig) {
    var _validators$config = validators_default.config(globalConfig), monaco2 = _validators$config.monaco, config3 = _objectWithoutProperties(_validators$config, ["monaco"]);
    setState(function(state) {
      return {
        config: deepMerge_default(state.config, config3),
        monaco: monaco2
      };
    });
  }
  function init() {
    var state = getState(function(_ref) {
      var monaco2 = _ref.monaco, isInitialized = _ref.isInitialized, resolve = _ref.resolve;
      return {
        monaco: monaco2,
        isInitialized,
        resolve
      };
    });
    if (!state.isInitialized) {
      setState({
        isInitialized: true
      });
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
  function injectScripts(script) {
    return document.body.appendChild(script);
  }
  function createScript(src) {
    var script = document.createElement("script");
    return src && (script.src = src), script;
  }
  function getMonacoLoaderScript(configureLoader2) {
    var state = getState(function(_ref2) {
      var config3 = _ref2.config, reject = _ref2.reject;
      return {
        config: config3,
        reject
      };
    });
    var loaderScript = createScript("".concat(state.config.paths.vs, "/loader.js"));
    loaderScript.onload = function() {
      return configureLoader2();
    };
    loaderScript.onerror = state.reject;
    return loaderScript;
  }
  function configureLoader() {
    var state = getState(function(_ref3) {
      var config3 = _ref3.config, resolve = _ref3.resolve, reject = _ref3.reject;
      return {
        config: config3,
        resolve,
        reject
      };
    });
    var require2 = window.require;
    require2.config(state.config);
    require2(["vs/editor/editor.main"], function(monaco2) {
      storeMonacoInstance(monaco2);
      state.resolve(monaco2);
    }, function(error) {
      state.reject(error);
    });
  }
  function storeMonacoInstance(monaco2) {
    if (!getState().monaco) {
      setState({
        monaco: monaco2
      });
    }
  }
  function __getMonacoInstance() {
    return getState(function(_ref4) {
      var monaco2 = _ref4.monaco;
      return monaco2;
    });
  }
  var wrapperPromise = new Promise(function(resolve, reject) {
    return setState({
      resolve,
      reject
    });
  });
  var loader = {
    config: config2,
    init,
    __getMonacoInstance
  };
  var loader_default = loader;

  // node_modules/.pnpm/@uwu+monaco-solid@1.1.0/node_modules/@uwu/monaco-solid/dist/monaco.js
  var monaco;
  var monacoLoaded;
  var loadedThemes = /* @__PURE__ */ new Set();
  async function addThemeIfNeeded(t) {
    if (!t || !t.trim() || loadedThemes.has(t))
      return;
    loadedThemes.add(t);
    const u = `https://cdn.esm.sh/monaco-themes@0.4.2/themes/${t}.json`;
    const theme = await fetch(u).then((r) => r.json());
    monaco.editor.defineTheme(t, theme);
  }
  async function initMonacoIfNeeded(useNpmMonaco) {
    if (monaco)
      return;
    if (useNpmMonaco)
      loader_default.config({ monaco: useNpmMonaco });
    if (!monacoLoaded)
      monacoLoaded = loader_default.init().then((m) => {
        monaco = m;
      });
    await monacoLoaded;
  }

  // node_modules/.pnpm/@uwu+monaco-solid@1.1.0/node_modules/@uwu/monaco-solid/dist/index.jsx
  var _tmpl$13 = /* @__PURE__ */ (0, import_web49.template)(`<div></div>`, 2);
  var dist_default = (props) => {
    let dispose;
    let cancelInit = false;
    const refCb = async (elem) => {
      await initMonacoIfNeeded(props.noCDN);
      await addThemeIfNeeded(props.theme);
      if (cancelInit)
        return;
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
      (0, import_solid_js.createEffect)(() => ed.updateOptions({
        readOnly: props.readonly
      }));
      (0, import_solid_js.createEffect)(() => {
        if (props.value !== ed.getValue())
          ed.setValue(props.value);
      });
      (0, import_solid_js.createEffect)(async () => {
        await addThemeIfNeeded(props.theme);
        ed.updateOptions({
          theme: props.theme
        });
      });
      (0, import_solid_js.createEffect)(() => {
        const model = ed.getModel();
        if (!model)
          return;
        monaco.editor.setModelLanguage(model, props.lang);
        ed.setModel(model);
      });
    };
    (0, import_solid_js.onCleanup)(() => {
      cancelInit = true;
      dispose?.();
    });
    return (() => {
      const _el$ = _tmpl$13.cloneNode(true);
      (0, import_web51.use)(refCb, _el$);
      (0, import_web50.effect)((_p$) => {
        const _v$ = props.width ?? "30rem", _v$2 = props.height ?? "10rem";
        _v$ !== _p$._v$ && _el$.style.setProperty("width", _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && _el$.style.setProperty("height", _p$._v$2 = _v$2);
        return _p$;
      }, {
        _v$: void 0,
        _v$2: void 0
      });
      return _el$;
    })();
  };

  // plugins/snazzy-shelter/src/components/tabs/TabQuickCSS.jsx
  var _tmpl$14 = /* @__PURE__ */ (0, import_web52.template)(`<div></div>`, 2);
  var saveCssDebounced = _.debounce((v) => store7.quickCSS = v, 250);
  var {
    solid: {
      createSignal: createSignal3
    },
    plugin: {
      store: store7
    }
  } = shelter;
  var TabQuickCSS_default = () => {
    const [css, setCss] = createSignal3(store7.quickCSS);
    return (() => {
      const _el$ = _tmpl$14.cloneNode(true);
      _el$.style.setProperty("maxWidth", "60vw");
      _el$.style.setProperty("height", "40rem");
      _el$.style.setProperty("resize", "vertical");
      _el$.style.setProperty("overflow", "hidden");
      _el$.style.setProperty("paddingBottom", ".5rem");
      (0, import_web53.insert)(_el$, (0, import_web54.createComponent)(dist_default, {
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
        otherCfg: {
          automaticLayout: true
        }
      }));
      return _el$;
    })();
  };

  // plugins/snazzy-shelter/src/components/tabs/TabRepo.jsx
  var import_web60 = __toESM(require_web());
  var import_web61 = __toESM(require_web());
  var import_web62 = __toESM(require_web());
  var import_web63 = __toESM(require_web());
  var import_web64 = __toESM(require_web());

  // plugins/snazzy-shelter/src/components/cards/RepoCard.jsx
  var import_web56 = __toESM(require_web());
  var import_web57 = __toESM(require_web());
  var import_web58 = __toESM(require_web());
  var import_web59 = __toESM(require_web());
  var _tmpl$15 = /* @__PURE__ */ (0, import_web56.template)(`<div class="ysink_stain_card ysink_stain_row"><div><div class="ysink_stain_title"></div></div></div>`, 6);
  var {
    solid: {
      createResource
    },
    ui: {
      Text: Text3,
      Button: Button3,
      ButtonColors: ButtonColors2
    },
    plugin: {
      store: store8
    }
  } = shelter;
  var RepoCard_default = (props) => {
    const [fullRepo] = createResource(() => props.repo, fetchRepo_default);
    return (() => {
      const _el$ = _tmpl$15.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
      (0, import_web58.insert)(_el$3, () => fullRepo()?.manifest.meta.name, null);
      (0, import_web58.insert)(_el$3, (() => {
        const _c$ = (0, import_web59.memo)(() => !!officialRepos.includes(props.repo));
        return () => _c$() && (0, import_web57.createComponent)(TextBadge, {
          "class": "ysink_stain_officialbadge",
          text: "official",
          color: "var(--info-positive-foreground)"
        });
      })(), null);
      (0, import_web58.insert)(_el$2, (0, import_web57.createComponent)(Text3, {
        get children() {
          return props.repo;
        }
      }), null);
      (0, import_web58.insert)(_el$, (0, import_web57.createComponent)(Button3, {
        get color() {
          return ButtonColors2.RED;
        },
        "class": "ysink_stain_button",
        grow: true,
        onClick: () => store8.repos = store8.repos.filter((r) => r !== props.repo),
        children: "Remove Repo"
      }), null);
      return _el$;
    })();
  };

  // plugins/snazzy-shelter/src/util/friendlyUtils.js
  var { plugin: { store: store9 } } = shelter;
  async function verifyRepo(repo) {
    try {
      await fetchRepo_default(repo);
      return true;
    } catch {
      return false;
    }
  }
  async function addRepo(repo, ok, err) {
    if (!repo.endsWith("/"))
      repo += "/";
    if (store9.repos.includes(repo)) {
      err("You already have this repo!");
      return false;
    }
    if (!await verifyRepo(repo)) {
      err("Repo was invalid");
      return false;
    }
    store9.repos = [...store9.repos, repo];
    ok("Added repo");
    return true;
  }

  // plugins/snazzy-shelter/src/components/tabs/TabRepo.jsx
  var _tmpl$16 = /* @__PURE__ */ (0, import_web60.template)(`<div><div class="ysink_stain_row"><input placeholder="https://example.com/repo" type="text"></div><div class="ysink_stain_cardcontainer"></div></div>`, 7);
  var {
    showToast: showToast2
  } = shelter.ui;
  var toast = (str) => showToast2({
    title: str,
    duration: 5e3
  });
  var {
    solid: {
      createSignal: createSignal4
    },
    plugin: {
      store: store10
    },
    ui: {
      Button: Button4,
      Divider,
      ButtonSizes: ButtonSizes3
    }
  } = shelter;
  var TabRepo_default = () => {
    const [url, setUrl] = createSignal4("");
    return (() => {
      const _el$ = _tmpl$16.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$2.nextSibling;
      _el$2.style.setProperty("display", "flex");
      _el$3.$$input = (e) => setUrl(e.target.value);
      (0, import_web62.insert)(_el$2, (0, import_web63.createComponent)(Button4, {
        "class": "ysink_stain_button",
        get size() {
          return ButtonSizes3.MEDIUM;
        },
        onClick: async () => {
          if (await addRepo(url(), toast, toast))
            setUrl("");
        },
        children: "Add"
      }), null);
      (0, import_web62.insert)(_el$, (0, import_web63.createComponent)(Divider, {
        mt: ".5rem",
        mb: ".5rem"
      }), _el$4);
      (0, import_web62.insert)(_el$4, () => store10.repos.map((repo) => (0, import_web63.createComponent)(RepoCard_default, {
        repo
      })));
      (0, import_web64.effect)(() => _el$3.value = url());
      return _el$;
    })();
  };
  (0, import_web61.delegateEvents)(["input"]);

  // plugins/snazzy-shelter/src/components/tabs/TabStore.jsx
  var import_web70 = __toESM(require_web());
  var import_web71 = __toESM(require_web());
  var import_web72 = __toESM(require_web());
  var import_web73 = __toESM(require_web());

  // plugins/snazzy-shelter/src/components/VirtualScroller.tsx
  var import_web65 = __toESM(require_web());
  var import_web66 = __toESM(require_web());
  var import_web67 = __toESM(require_web());
  var import_web68 = __toESM(require_web());
  var import_web69 = __toESM(require_web());
  var _tmpl$17 = /* @__PURE__ */ (0, import_web65.template)(`<div><div></div></div>`, 4);
  var {
    For
  } = window["shelter"].solid;
  var VirtualScroller_default = (props) => (() => {
    const _el$ = _tmpl$17.cloneNode(true), _el$2 = _el$.firstChild;
    _el$.style.setProperty("overflow-y", "auto");
    _el$2.style.setProperty("width", "100%");
    _el$2.style.setProperty("position", "relative");
    (0, import_web68.insert)(_el$2, (0, import_web69.createComponent)(For, {
      get each() {
        return props.items;
      },
      children: (item) => props.children(item)
    }));
    (0, import_web67.effect)((_p$) => {
      const _v$ = props.height, _v$2 = props.class;
      _v$ !== _p$._v$ && _el$.style.setProperty("height", _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && (0, import_web66.className)(_el$, _p$._v$2 = _v$2);
      return _p$;
    }, {
      _v$: void 0,
      _v$2: void 0
    });
    return _el$;
  })();

  // plugins/snazzy-shelter/src/components/tabs/TabStore.jsx
  var _tmpl$18 = /* @__PURE__ */ (0, import_web70.template)(`<div class="ysink_stain_search_row"></div>`, 2);
  var {
    solid: {
      createSignal: createSignal5,
      createResource: createResource2
    },
    plugin: {
      store: store11
    },
    ui: {
      niceScrollbarsClass
    }
  } = shelter;
  var getRepos = () => Promise.all(store11.repos.map(fetchRepo_default));
  var getThemes = () => getRepos().then((rs) => rs.flatMap((r) => r.themes));
  var TabStore_default = (props) => {
    const [search2, setSearch] = createSignal5("");
    const [filterMode, setFilterMode] = createSignal5("0");
    const [themes] = createResource2(() => store11.repos, getThemes);
    return [(() => {
      const _el$ = _tmpl$18.cloneNode(true);
      (0, import_web72.insert)(_el$, (0, import_web73.createComponent)(SearchBar_default, {
        get query() {
          return search2();
        },
        onChange: setSearch
      }), null);
      (0, import_web72.insert)(_el$, (0, import_web73.createComponent)(CompatFilterDropdown_default, {
        get filterMode() {
          return filterMode();
        },
        setFilterMode
      }), null);
      return _el$;
    })(), (0, import_web71.memo)((() => {
      const _c$ = (0, import_web71.memo)(() => store11.repos.length === 0);
      return () => _c$() ? (0, import_web73.createComponent)(NoRepos, {
        goToRepos: () => props.goTo(2)
      }) : (0, import_web73.createComponent)(VirtualScroller_default, {
        get ["class"]() {
          return niceScrollbarsClass();
        },
        height: "50rem",
        keySel: (t) => t.url,
        get items() {
          return fuzzyThemes(themes(), search2(), filterMode());
        },
        children: (theme) => (0, import_web73.createComponent)(ThemeCard_default, {
          theme,
          gap: ".5rem"
        })
      });
    })())];
  };

  // plugins/snazzy-shelter/src/components/tabs/TabDebug.jsx
  var import_web74 = __toESM(require_web());
  var {
    Button: Button5,
    Text: Text4
  } = shelter.ui;
  var TabDebug_default = () => [(0, import_web74.createComponent)(Button5, {
    "class": "ysink_stain_button",
    grow: true,
    onClick: clearCache,
    children: "Clear fetch cache"
  }), (0, import_web74.createComponent)(Text4, {
    children: "@ me if you need other things for debug purposes :)"
  })];

  // plugins/snazzy-shelter/src/components/TabBar.tsx
  var import_web75 = __toESM(require_web());
  var import_web76 = __toESM(require_web());
  var import_web77 = __toESM(require_web());
  var import_web78 = __toESM(require_web());
  var import_web79 = __toESM(require_web());
  var import_web80 = __toESM(require_web());
  var _tmpl$19 = /* @__PURE__ */ (0, import_web75.template)(`<div class="ysink_stain_tabbar_root"><div class="ysink_stain_tabbar"></div><div class="ysink_stain_tabbar_content"></div></div>`, 6);
  var _tmpl$26 = /* @__PURE__ */ (0, import_web75.template)(`<button></button>`, 2);
  var {
    solid: {
      createSignal: createSignal6
    },
    solidWeb: {
      Dynamic
    },
    ui: {
      Text: Text5,
      Divider: Divider2
    }
  } = shelter;
  var TabBar_default = (props) => {
    const [current, goTo] = createSignal6(0);
    return (() => {
      const _el$ = _tmpl$19.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
      (0, import_web80.insert)(_el$2, () => props.items.map((e, i) => (() => {
        const _el$4 = _tmpl$26.cloneNode(true);
        _el$4.$$click = () => goTo(i);
        (0, import_web80.insert)(_el$4, (0, import_web79.createComponent)(Text5, {
          get children() {
            return e.text;
          }
        }));
        (0, import_web78.effect)(() => (0, import_web77.className)(_el$4, "ysink_stain_button" + (i === current() ? " ysink_stain_selected" : "")));
        return _el$4;
      })()));
      (0, import_web80.insert)(_el$, (0, import_web79.createComponent)(Divider2, {
        mt: ".5rem",
        mb: ".5rem"
      }), _el$3);
      (0, import_web80.insert)(_el$3, (0, import_web79.createComponent)(Dynamic, {
        get component() {
          return props.items[current()].component;
        },
        goTo
      }));
      return _el$;
    })();
  };
  (0, import_web76.delegateEvents)(["click"]);

  // plugins/snazzy-shelter/src/components/SettingsMain.jsx
  var _tmpl$20 = /* @__PURE__ */ (0, import_web81.template)(`<div></div>`, 2);
  var {
    Header: Header2,
    HeaderTags: HeaderTags2
  } = shelter.ui;
  var SettingsMain_default = () => {
    return (() => {
      const _el$ = _tmpl$20.cloneNode(true);
      (0, import_web82.insert)(_el$, (0, import_web83.createComponent)(Header2, {
        get tag() {
          return HeaderTags2.H1;
        },
        children: "Snazzy Shelter Settings"
      }), null);
      (0, import_web82.insert)(_el$, (0, import_web83.createComponent)(TabBar_default, {
        items: [{
          text: "Installed",
          component: TabInstalled_default
        }, {
          text: "Store",
          component: TabStore_default
        }, {
          text: "Repos",
          component: TabRepo_default
        }, {
          text: "Quick CSS",
          component: TabQuickCSS_default
        }, {
          text: "Debug",
          component: TabDebug_default
        }]
      }), null);
      return _el$;
    })();
  };

  // plugins/snazzy-shelter/src/transients/settingsEntry.js
  var settingsEntry_default = () => shelter.settings.registerSection("section", "shsnazzy", "Themes", SettingsMain_default);

  // plugins/snazzy-shelter/src/styles.sass
  var styles_default = `
.ysink_stain_card{background:var(--background-secondary-alt);padding:1rem;border:1px solid var(--background-modifier-accent);border-radius:.5rem;width:100% !important;color:var(--text-normal)}.ysink_stain_title{display:flex;align-items:center;font-size:1rem;color:var(--interactive-active)}.ysink_stain_cardcontainer>*{margin-bottom:.5rem}.ysink_stain_row{display:flex;gap:1rem}.ysink_stain_row>:not(:last-child){flex:1}.ysink_stain_tabbar{padding:.5rem 1rem;display:grid;grid-auto-flow:column;grid-auto-columns:7rem}.ysink_stain_tabbar .ysink_stain_button *{cursor:pointer}.ysink_stain_tabbar>*{margin-right:1rem;padding:.2rem;border-radius:.3rem;min-width:5rem;text-align:center;background:none}.theme-dark .ysink_stain_tabbar>*.ysink_stain_selected{background:rgba(255,255,255,.2666666667)}.theme-light .ysink_stain_tabbar>*.ysink_stain_selected{background:rgba(0,0,0,.2)}.ysink_stain_tabbar>*:last-child{margin-right:0}.ysink_stain_searchbar{margin:.75rem 0}.ysink_stain_search_row{display:flex;gap:.75rem;margin:.75rem 0}.ysink_stain_search_row .ysink_stain_dropdown{height:2.25rem;flex-basis:10rem;background:var(--input-background);color:#fff;border:none}.ysink_stain_search_row .ysink_stain_searchbar{margin:unset;flex:1}.ysink_stain_tcard{display:grid;grid-template-columns:auto 1fr min-content;grid-template-rows:auto 1fr;align-items:center}.ysink_stain_tcard .ysink_stain_tmedia{grid-row:1/3;height:4rem;width:7rem;margin-right:1rem;background-size:cover}.ysink_stain_tcard .ysink_stain_tmedia *{display:flex;justify-content:center;align-items:center;height:100%}.ysink_stain_tcard .ysink_stain_tmedia .ysink_stain_tview{z-index:1;transition:opacity 250ms ease;backdrop-filter:brightness(0.3);cursor:pointer}.ysink_stain_tcard .ysink_stain_tmedia .ysink_stain_tview:not(:hover){opacity:0}.ysink_stain_tcard .ysink_stain_tdesc{grid-area:2/2}.ysink_stain_tcard .ysink_stain_tacts{grid-column:3;justify-self:right}.ysink_stain_tcard .ysink_stain_tacts>:last-child{margin-left:.25rem}.ysink_stain_tcard .ysink_stain_tacts>*{display:inline-block}.ysink_stain_tcard .ysink_stain_taulic{text-align:right;min-width:8rem}.ysink_stain_iconbtn{margin-right:.25rem;fill:var(--interactive-normal);cursor:pointer;height:22px;width:22px}.ysink_stain_badge{width:1.5rem;height:1.5rem;margin-right:.5rem;border-radius:50%}.ysink_stain_badge.ysink_stain_bd{padding:.25rem;background:#040405}.ysink_stain_badge.ysink_stain_cc{padding:.1rem;background:#7289da}.ysink_stain_nosplash{display:flex;flex-direction:column;align-items:center;margin-top:15rem;gap:.5rem}.ysink_stain_nosplash h2{margin-bottom:0}.ysink_stain_nosplash>*{flex:0}.ysink_stain_nosplash .ysink_stain_button{margin-top:2rem}.ysink_stain_officialbadge{display:inline;margin-left:.5rem}.ysink_stain_button{color:#fff !important}.ysink_stain_input,.ysink_stain_searchbar{background:var(--input-background);color:#fff;border:none}#shsnazzy-tab{padding-bottom:0}`;

  // plugins/snazzy-shelter/index.js
  var {
    plugin: { store: store12 },
    ui: { injectCss: injectCss3 }
  } = shelter;
  if (!Array.isArray(store12.repos))
    defaultRepos_default();
  if (!Array.isArray(store12.themes))
    store12.themes = [];
  if (store12.css) {
    if (!store12.quickCSS)
      store12.quickCSS = store12.css;
    delete store12.css;
  }
  var transients = [
    quickCSS_default(),
    restoreThemes_default(),
    exposeApi_default(),
    settingsEntry_default(),
    injectCss3(styles_default)
  ];
  var onUnload = () => _.forEachRight(transients, (p) => p());
  return __toCommonJS(snazzy_shelter_exports);
})();
