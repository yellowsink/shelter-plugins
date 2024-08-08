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
    "shltr-res-ns:solid-js/web"(exports2, module2) {
      module2.exports = shelter.solidWeb;
    }
  });

  // shltr-res-ns:solid-js
  var require_solid_js = __commonJS({
    "shltr-res-ns:solid-js"(exports2, module2) {
      module2.exports = shelter.solid;
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
  var officialRepos = Object.freeze([
    "https://cumcordthemes.github.io/Cumsock/"
  ]);
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
    const themeCacheIndex = store3.themes.findIndex((t) => t.url === theme.url);
    let toPush = { ...theme };
    delete toPush.CSS;
    toPush.enabled = true;
    if (themeCacheIndex === -1)
      store3.themes.push(toPush);
    else
      store3.themes[themeCacheIndex] = toPush;
    store3.themes = store3.themes;
  }
  function unloadTheme(theme) {
    if (!theme?.url)
      throw new Error("theme was missing id.");
    const unpatch = unpatchCache.get(theme.url);
    unpatch?.();
    unpatchCache.delete(theme.url);
    const themeCacheIndex = store3.themes.findIndex((t) => t.url === theme.url);
    let toPush = { ...theme };
    toPush.enabled = false;
    if (themeCacheIndex === -1)
      store3.themes.push(toPush);
    else
      store3.themes[themeCacheIndex] = toPush;
    store3.themes = store3.themes;
  }
  function removeTheme(theme) {
    try {
      unloadTheme(theme);
    } catch (e) {
      if (e.message !== "theme was not loaded.")
        throw e;
    }
    store3.themes = store3.themes.filter((t) => t.url !== theme.url);
  }
  function unloadAll() {
    unpatchCache.forEach((unpatch) => unpatch?.());
    unpatchCache.clear();
  }

  // plugins/snazzy-shelter/src/transients/restoreThemes.js
  var {
    plugin: { store: store4 }
  } = shelter;
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
  var import_web72 = __toESM(require_web());
  var import_web73 = __toESM(require_web());
  var import_web74 = __toESM(require_web());

  // plugins/snazzy-shelter/src/components/tabs/TabInstalled.jsx
  var import_web37 = __toESM(require_web());
  var import_web38 = __toESM(require_web());
  var import_web39 = __toESM(require_web());
  var import_web40 = __toESM(require_web());
  var import_web41 = __toESM(require_web());

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
      // not awaiting but loadTheme is async
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
  var _tmpl$8 = /* @__PURE__ */ (0, import_web25.template)(`<div class="ysink_stain_row"></div>`, 2);
  var {
    ui: {
      Button,
      ButtonSizes,
      showToast,
      TextBox
    },
    solid: {
      createSignal
    }
  } = shelter;
  var InstallBar_default = () => {
    const [urlInput, setUrlInput] = createSignal("");
    return (() => {
      const _el$ = _tmpl$8.cloneNode(true);
      (0, import_web26.insert)(_el$, (0, import_web27.createComponent)(TextBox, {
        get value() {
          return urlInput();
        },
        onInput: setUrlInput,
        placeholder: "Theme import URL"
      }), null);
      (0, import_web26.insert)(_el$, (0, import_web27.createComponent)(Button, {
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
      return _el$;
    })();
  };

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
    constructor(keys2) {
      this._keys = [];
      this._keyMap = {};
      let totalWeight = 0;
      keys2.forEach((key) => {
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
    // Whether the matches should be included in the result set. When `true`, each record in the result
    // set will include the indices of the matched characters.
    // These can consequently be used for highlighting purposes.
    includeMatches: false,
    // When `true`, the matching function will continue to the end of a search pattern even if
    // a perfect match has already been located in the string.
    findAllMatches: false,
    // Minimum number of characters that must be matched before a result is considered a match
    minMatchCharLength: 1
  };
  var BasicOptions = {
    // When `true`, the algorithm continues searching to the end of the input even if a perfect
    // match is found before the end of the same input.
    isCaseSensitive: false,
    // When true, the matching function will continue to the end of a search pattern even if
    includeScore: false,
    // List of properties that will be searched. This also supports nested properties.
    keys: [],
    // Whether to sort the result list, by score
    shouldSort: true,
    // Default sort function: sort by ascending score, ascending index
    sortFn: (a, b) => a.score === b.score ? a.idx < b.idx ? -1 : 1 : a.score < b.score ? -1 : 1
  };
  var FuzzyOptions = {
    // Approximately where in the text is the pattern expected to be found?
    location: 0,
    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
    // (of both letters and location), a threshold of '1.0' would match anything.
    threshold: 0.6,
    // Determines how close the match must be to the fuzzy location (specified above).
    // An exact letter match which is 'distance' characters away from the fuzzy location
    // would score as a complete mismatch. A distance of '0' requires the match be at
    // the exact location specified, a threshold of '1000' would require a perfect match
    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
    distance: 100
  };
  var AdvancedOptions = {
    // When `true`, it enables the use of unix-like search commands
    useExtendedSearch: false,
    // The get function to use when fetching an object's properties.
    // The default will search nested paths *ie foo.bar.baz*
    getFn: get,
    // When `true`, search will ignore `location` and `distance`, so it won't matter
    // where in the string the pattern appears.
    // More info: https://fusejs.io/concepts/scoring-theory.html#fuzziness-score
    ignoreLocation: false,
    // When `true`, the calculation for the relevance score (used for sorting) will
    // ignore the field-length norm.
    // More info: https://fusejs.io/concepts/scoring-theory.html#field-length-norm
    ignoreFieldNorm: false,
    // The weight to determine how much field length norm effects scoring.
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
    setKeys(keys2 = []) {
      this.keys = keys2;
      this._keysMap = {};
      keys2.forEach((key, idx) => {
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
    // Adds a doc to the end of the index
    add(doc) {
      const idx = this.size();
      if (isString(doc)) {
        this._addString(doc, idx);
      } else {
        this._addObject(doc, idx);
      }
    }
    // Removes the doc at the specified index of the index
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
  function createIndex(keys2, docs, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
    const myIndex = new FuseIndex({ getFn, fieldNormWeight });
    myIndex.setKeys(keys2.map(createKey));
    myIndex.setSources(docs);
    myIndex.create();
    return myIndex;
  }
  function parseIndex(data, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
    const { keys: keys2, records } = data;
    const myIndex = new FuseIndex({ getFn, fieldNormWeight });
    myIndex.setKeys(keys2);
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
      // Count exact matches (those with a score of 0) to be "almost" exact
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
    static condition(_, options) {
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
      let keys2 = Object.keys(query2);
      const isQueryPath = isPath(query2);
      if (!isQueryPath && keys2.length > 1 && !isExpression(query2)) {
        return next(convertToExplicit(query2));
      }
      if (isLeaf(query2)) {
        const key = isQueryPath ? query2[KeyType.PATH] : keys2[0];
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
        operator: keys2[0]
      };
      keys2.forEach((key) => {
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
      const { keys: keys2, records } = this._myIndex;
      const results = [];
      records.forEach(({ $: item, i: idx }) => {
        if (!isDefined(item)) {
          return;
        }
        let matches = [];
        keys2.forEach((key, keyIndex) => {
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

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheClear.js
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  var listCacheClear_default = listCacheClear;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/eq.js
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  var eq_default = eq;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_assocIndexOf.js
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq_default(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  var assocIndexOf_default = assocIndexOf;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheDelete.js
  var arrayProto = Array.prototype;
  var splice = arrayProto.splice;
  function listCacheDelete(key) {
    var data = this.__data__, index2 = assocIndexOf_default(data, key);
    if (index2 < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index2 == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index2, 1);
    }
    --this.size;
    return true;
  }
  var listCacheDelete_default = listCacheDelete;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheGet.js
  function listCacheGet(key) {
    var data = this.__data__, index2 = assocIndexOf_default(data, key);
    return index2 < 0 ? void 0 : data[index2][1];
  }
  var listCacheGet_default = listCacheGet;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheHas.js
  function listCacheHas(key) {
    return assocIndexOf_default(this.__data__, key) > -1;
  }
  var listCacheHas_default = listCacheHas;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheSet.js
  function listCacheSet(key, value) {
    var data = this.__data__, index2 = assocIndexOf_default(data, key);
    if (index2 < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index2][1] = value;
    }
    return this;
  }
  var listCacheSet_default = listCacheSet;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_ListCache.js
  function ListCache(entries) {
    var index2 = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index2 < length) {
      var entry = entries[index2];
      this.set(entry[0], entry[1]);
    }
  }
  ListCache.prototype.clear = listCacheClear_default;
  ListCache.prototype["delete"] = listCacheDelete_default;
  ListCache.prototype.get = listCacheGet_default;
  ListCache.prototype.has = listCacheHas_default;
  ListCache.prototype.set = listCacheSet_default;
  var ListCache_default = ListCache;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackClear.js
  function stackClear() {
    this.__data__ = new ListCache_default();
    this.size = 0;
  }
  var stackClear_default = stackClear;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackDelete.js
  function stackDelete(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }
  var stackDelete_default = stackDelete;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackGet.js
  function stackGet(key) {
    return this.__data__.get(key);
  }
  var stackGet_default = stackGet;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackHas.js
  function stackHas(key) {
    return this.__data__.has(key);
  }
  var stackHas_default = stackHas;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_freeGlobal.js
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeGlobal_default = freeGlobal;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_root.js
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal_default || freeSelf || Function("return this")();
  var root_default = root;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Symbol.js
  var Symbol2 = root_default.Symbol;
  var Symbol_default = Symbol2;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getRawTag.js
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var nativeObjectToString = objectProto.toString;
  var symToStringTag = Symbol_default ? Symbol_default.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    try {
      value[symToStringTag] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  var getRawTag_default = getRawTag;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_objectToString.js
  var objectProto2 = Object.prototype;
  var nativeObjectToString2 = objectProto2.toString;
  function objectToString(value) {
    return nativeObjectToString2.call(value);
  }
  var objectToString_default = objectToString;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseGetTag.js
  var nullTag = "[object Null]";
  var undefinedTag = "[object Undefined]";
  var symToStringTag2 = Symbol_default ? Symbol_default.toStringTag : void 0;
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag2 && symToStringTag2 in Object(value) ? getRawTag_default(value) : objectToString_default(value);
  }
  var baseGetTag_default = baseGetTag;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isObject.js
  function isObject2(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var isObject_default = isObject2;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isFunction.js
  var asyncTag = "[object AsyncFunction]";
  var funcTag = "[object Function]";
  var genTag = "[object GeneratorFunction]";
  var proxyTag = "[object Proxy]";
  function isFunction(value) {
    if (!isObject_default(value)) {
      return false;
    }
    var tag = baseGetTag_default(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  var isFunction_default = isFunction;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_coreJsData.js
  var coreJsData = root_default["__core-js_shared__"];
  var coreJsData_default = coreJsData;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isMasked.js
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData_default && coreJsData_default.keys && coreJsData_default.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  var isMasked_default = isMasked;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_toSource.js
  var funcProto = Function.prototype;
  var funcToString = funcProto.toString;
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  var toSource_default = toSource;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsNative.js
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto2 = Function.prototype;
  var objectProto3 = Object.prototype;
  var funcToString2 = funcProto2.toString;
  var hasOwnProperty2 = objectProto3.hasOwnProperty;
  var reIsNative = RegExp(
    "^" + funcToString2.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function baseIsNative(value) {
    if (!isObject_default(value) || isMasked_default(value)) {
      return false;
    }
    var pattern = isFunction_default(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource_default(value));
  }
  var baseIsNative_default = baseIsNative;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getValue.js
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  var getValue_default = getValue;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getNative.js
  function getNative(object, key) {
    var value = getValue_default(object, key);
    return baseIsNative_default(value) ? value : void 0;
  }
  var getNative_default = getNative;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Map.js
  var Map2 = getNative_default(root_default, "Map");
  var Map_default = Map2;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_nativeCreate.js
  var nativeCreate = getNative_default(Object, "create");
  var nativeCreate_default = nativeCreate;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashClear.js
  function hashClear() {
    this.__data__ = nativeCreate_default ? nativeCreate_default(null) : {};
    this.size = 0;
  }
  var hashClear_default = hashClear;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashDelete.js
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  var hashDelete_default = hashDelete;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashGet.js
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var objectProto4 = Object.prototype;
  var hasOwnProperty3 = objectProto4.hasOwnProperty;
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate_default) {
      var result = data[key];
      return result === HASH_UNDEFINED ? void 0 : result;
    }
    return hasOwnProperty3.call(data, key) ? data[key] : void 0;
  }
  var hashGet_default = hashGet;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashHas.js
  var objectProto5 = Object.prototype;
  var hasOwnProperty4 = objectProto5.hasOwnProperty;
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate_default ? data[key] !== void 0 : hasOwnProperty4.call(data, key);
  }
  var hashHas_default = hashHas;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashSet.js
  var HASH_UNDEFINED2 = "__lodash_hash_undefined__";
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate_default && value === void 0 ? HASH_UNDEFINED2 : value;
    return this;
  }
  var hashSet_default = hashSet;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Hash.js
  function Hash(entries) {
    var index2 = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index2 < length) {
      var entry = entries[index2];
      this.set(entry[0], entry[1]);
    }
  }
  Hash.prototype.clear = hashClear_default;
  Hash.prototype["delete"] = hashDelete_default;
  Hash.prototype.get = hashGet_default;
  Hash.prototype.has = hashHas_default;
  Hash.prototype.set = hashSet_default;
  var Hash_default = Hash;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheClear.js
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash_default(),
      "map": new (Map_default || ListCache_default)(),
      "string": new Hash_default()
    };
  }
  var mapCacheClear_default = mapCacheClear;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isKeyable.js
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  var isKeyable_default = isKeyable;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getMapData.js
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable_default(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  var getMapData_default = getMapData;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheDelete.js
  function mapCacheDelete(key) {
    var result = getMapData_default(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  var mapCacheDelete_default = mapCacheDelete;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheGet.js
  function mapCacheGet(key) {
    return getMapData_default(this, key).get(key);
  }
  var mapCacheGet_default = mapCacheGet;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheHas.js
  function mapCacheHas(key) {
    return getMapData_default(this, key).has(key);
  }
  var mapCacheHas_default = mapCacheHas;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheSet.js
  function mapCacheSet(key, value) {
    var data = getMapData_default(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
  var mapCacheSet_default = mapCacheSet;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_MapCache.js
  function MapCache(entries) {
    var index2 = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index2 < length) {
      var entry = entries[index2];
      this.set(entry[0], entry[1]);
    }
  }
  MapCache.prototype.clear = mapCacheClear_default;
  MapCache.prototype["delete"] = mapCacheDelete_default;
  MapCache.prototype.get = mapCacheGet_default;
  MapCache.prototype.has = mapCacheHas_default;
  MapCache.prototype.set = mapCacheSet_default;
  var MapCache_default = MapCache;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackSet.js
  var LARGE_ARRAY_SIZE = 200;
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache_default) {
      var pairs = data.__data__;
      if (!Map_default || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache_default(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  var stackSet_default = stackSet;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Stack.js
  function Stack(entries) {
    var data = this.__data__ = new ListCache_default(entries);
    this.size = data.size;
  }
  Stack.prototype.clear = stackClear_default;
  Stack.prototype["delete"] = stackDelete_default;
  Stack.prototype.get = stackGet_default;
  Stack.prototype.has = stackHas_default;
  Stack.prototype.set = stackSet_default;
  var Stack_default = Stack;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setCacheAdd.js
  var HASH_UNDEFINED3 = "__lodash_hash_undefined__";
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED3);
    return this;
  }
  var setCacheAdd_default = setCacheAdd;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setCacheHas.js
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  var setCacheHas_default = setCacheHas;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_SetCache.js
  function SetCache(values) {
    var index2 = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache_default();
    while (++index2 < length) {
      this.add(values[index2]);
    }
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd_default;
  SetCache.prototype.has = setCacheHas_default;
  var SetCache_default = SetCache;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arraySome.js
  function arraySome(array, predicate) {
    var index2 = -1, length = array == null ? 0 : array.length;
    while (++index2 < length) {
      if (predicate(array[index2], index2, array)) {
        return true;
      }
    }
    return false;
  }
  var arraySome_default = arraySome;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_cacheHas.js
  function cacheHas(cache2, key) {
    return cache2.has(key);
  }
  var cacheHas_default = cacheHas;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_equalArrays.js
  var COMPARE_PARTIAL_FLAG = 1;
  var COMPARE_UNORDERED_FLAG = 2;
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var arrStacked = stack.get(array);
    var othStacked = stack.get(other);
    if (arrStacked && othStacked) {
      return arrStacked == other && othStacked == array;
    }
    var index2 = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache_default() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index2 < arrLength) {
      var arrValue = array[index2], othValue = other[index2];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index2, other, array, stack) : customizer(arrValue, othValue, index2, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome_default(other, function(othValue2, othIndex) {
          if (!cacheHas_default(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
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
  var equalArrays_default = equalArrays;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Uint8Array.js
  var Uint8Array2 = root_default.Uint8Array;
  var Uint8Array_default = Uint8Array2;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapToArray.js
  function mapToArray(map) {
    var index2 = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index2] = [key, value];
    });
    return result;
  }
  var mapToArray_default = mapToArray;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setToArray.js
  function setToArray(set) {
    var index2 = -1, result = Array(set.size);
    set.forEach(function(value) {
      result[++index2] = value;
    });
    return result;
  }
  var setToArray_default = setToArray;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_equalByTag.js
  var COMPARE_PARTIAL_FLAG2 = 1;
  var COMPARE_UNORDERED_FLAG2 = 2;
  var boolTag = "[object Boolean]";
  var dateTag = "[object Date]";
  var errorTag = "[object Error]";
  var mapTag = "[object Map]";
  var numberTag = "[object Number]";
  var regexpTag = "[object RegExp]";
  var setTag = "[object Set]";
  var stringTag = "[object String]";
  var symbolTag = "[object Symbol]";
  var arrayBufferTag = "[object ArrayBuffer]";
  var dataViewTag = "[object DataView]";
  var symbolProto = Symbol_default ? Symbol_default.prototype : void 0;
  var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array_default(object), new Uint8Array_default(other))) {
          return false;
        }
        return true;
      case boolTag:
      case dateTag:
      case numberTag:
        return eq_default(+object, +other);
      case errorTag:
        return object.name == other.name && object.message == other.message;
      case regexpTag:
      case stringTag:
        return object == other + "";
      case mapTag:
        var convert = mapToArray_default;
      case setTag:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG2;
        convert || (convert = setToArray_default);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG2;
        stack.set(object, other);
        var result = equalArrays_default(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object);
        return result;
      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  var equalByTag_default = equalByTag;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayPush.js
  function arrayPush(array, values) {
    var index2 = -1, length = values.length, offset = array.length;
    while (++index2 < length) {
      array[offset + index2] = values[index2];
    }
    return array;
  }
  var arrayPush_default = arrayPush;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isArray.js
  var isArray2 = Array.isArray;
  var isArray_default = isArray2;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseGetAllKeys.js
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray_default(object) ? result : arrayPush_default(result, symbolsFunc(object));
  }
  var baseGetAllKeys_default = baseGetAllKeys;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayFilter.js
  function arrayFilter(array, predicate) {
    var index2 = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index2 < length) {
      var value = array[index2];
      if (predicate(value, index2, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  var arrayFilter_default = arrayFilter;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/stubArray.js
  function stubArray() {
    return [];
  }
  var stubArray_default = stubArray;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getSymbols.js
  var objectProto6 = Object.prototype;
  var propertyIsEnumerable = objectProto6.propertyIsEnumerable;
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var getSymbols = !nativeGetSymbols ? stubArray_default : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter_default(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };
  var getSymbols_default = getSymbols;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseTimes.js
  function baseTimes(n, iteratee) {
    var index2 = -1, result = Array(n);
    while (++index2 < n) {
      result[index2] = iteratee(index2);
    }
    return result;
  }
  var baseTimes_default = baseTimes;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isObjectLike.js
  function isObjectLike2(value) {
    return value != null && typeof value == "object";
  }
  var isObjectLike_default = isObjectLike2;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsArguments.js
  var argsTag = "[object Arguments]";
  function baseIsArguments(value) {
    return isObjectLike_default(value) && baseGetTag_default(value) == argsTag;
  }
  var baseIsArguments_default = baseIsArguments;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isArguments.js
  var objectProto7 = Object.prototype;
  var hasOwnProperty5 = objectProto7.hasOwnProperty;
  var propertyIsEnumerable2 = objectProto7.propertyIsEnumerable;
  var isArguments = baseIsArguments_default(function() {
    return arguments;
  }()) ? baseIsArguments_default : function(value) {
    return isObjectLike_default(value) && hasOwnProperty5.call(value, "callee") && !propertyIsEnumerable2.call(value, "callee");
  };
  var isArguments_default = isArguments;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/stubFalse.js
  function stubFalse() {
    return false;
  }
  var stubFalse_default = stubFalse;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isBuffer.js
  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer2 = moduleExports ? root_default.Buffer : void 0;
  var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
  var isBuffer = nativeIsBuffer || stubFalse_default;
  var isBuffer_default = isBuffer;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isIndex.js
  var MAX_SAFE_INTEGER = 9007199254740991;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  var isIndex_default = isIndex;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isLength.js
  var MAX_SAFE_INTEGER2 = 9007199254740991;
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER2;
  }
  var isLength_default = isLength;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsTypedArray.js
  var argsTag2 = "[object Arguments]";
  var arrayTag = "[object Array]";
  var boolTag2 = "[object Boolean]";
  var dateTag2 = "[object Date]";
  var errorTag2 = "[object Error]";
  var funcTag2 = "[object Function]";
  var mapTag2 = "[object Map]";
  var numberTag2 = "[object Number]";
  var objectTag = "[object Object]";
  var regexpTag2 = "[object RegExp]";
  var setTag2 = "[object Set]";
  var stringTag2 = "[object String]";
  var weakMapTag = "[object WeakMap]";
  var arrayBufferTag2 = "[object ArrayBuffer]";
  var dataViewTag2 = "[object DataView]";
  var float32Tag = "[object Float32Array]";
  var float64Tag = "[object Float64Array]";
  var int8Tag = "[object Int8Array]";
  var int16Tag = "[object Int16Array]";
  var int32Tag = "[object Int32Array]";
  var uint8Tag = "[object Uint8Array]";
  var uint8ClampedTag = "[object Uint8ClampedArray]";
  var uint16Tag = "[object Uint16Array]";
  var uint32Tag = "[object Uint32Array]";
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag2] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag2] = typedArrayTags[boolTag2] = typedArrayTags[dataViewTag2] = typedArrayTags[dateTag2] = typedArrayTags[errorTag2] = typedArrayTags[funcTag2] = typedArrayTags[mapTag2] = typedArrayTags[numberTag2] = typedArrayTags[objectTag] = typedArrayTags[regexpTag2] = typedArrayTags[setTag2] = typedArrayTags[stringTag2] = typedArrayTags[weakMapTag] = false;
  function baseIsTypedArray(value) {
    return isObjectLike_default(value) && isLength_default(value.length) && !!typedArrayTags[baseGetTag_default(value)];
  }
  var baseIsTypedArray_default = baseIsTypedArray;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseUnary.js
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  var baseUnary_default = baseUnary;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_nodeUtil.js
  var freeExports2 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule2 = freeExports2 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
  var freeProcess = moduleExports2 && freeGlobal_default.process;
  var nodeUtil = function() {
    try {
      var types = freeModule2 && freeModule2.require && freeModule2.require("util").types;
      if (types) {
        return types;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  var nodeUtil_default = nodeUtil;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isTypedArray.js
  var nodeIsTypedArray = nodeUtil_default && nodeUtil_default.isTypedArray;
  var isTypedArray = nodeIsTypedArray ? baseUnary_default(nodeIsTypedArray) : baseIsTypedArray_default;
  var isTypedArray_default = isTypedArray;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayLikeKeys.js
  var objectProto8 = Object.prototype;
  var hasOwnProperty6 = objectProto8.hasOwnProperty;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray_default(value), isArg = !isArr && isArguments_default(value), isBuff = !isArr && !isArg && isBuffer_default(value), isType = !isArr && !isArg && !isBuff && isTypedArray_default(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes_default(value.length, String) : [], length = result.length;
    for (var key in value) {
      if ((inherited || hasOwnProperty6.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
      (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
      isIndex_default(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  var arrayLikeKeys_default = arrayLikeKeys;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isPrototype.js
  var objectProto9 = Object.prototype;
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto9;
    return value === proto;
  }
  var isPrototype_default = isPrototype;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_overArg.js
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  var overArg_default = overArg;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_nativeKeys.js
  var nativeKeys = overArg_default(Object.keys, Object);
  var nativeKeys_default = nativeKeys;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseKeys.js
  var objectProto10 = Object.prototype;
  var hasOwnProperty7 = objectProto10.hasOwnProperty;
  function baseKeys(object) {
    if (!isPrototype_default(object)) {
      return nativeKeys_default(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty7.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  var baseKeys_default = baseKeys;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isArrayLike.js
  function isArrayLike(value) {
    return value != null && isLength_default(value.length) && !isFunction_default(value);
  }
  var isArrayLike_default = isArrayLike;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/keys.js
  function keys(object) {
    return isArrayLike_default(object) ? arrayLikeKeys_default(object) : baseKeys_default(object);
  }
  var keys_default = keys;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getAllKeys.js
  function getAllKeys(object) {
    return baseGetAllKeys_default(object, keys_default, getSymbols_default);
  }
  var getAllKeys_default = getAllKeys;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_equalObjects.js
  var COMPARE_PARTIAL_FLAG3 = 1;
  var objectProto11 = Object.prototype;
  var hasOwnProperty8 = objectProto11.hasOwnProperty;
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG3, objProps = getAllKeys_default(object), objLength = objProps.length, othProps = getAllKeys_default(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index2 = objLength;
    while (index2--) {
      var key = objProps[index2];
      if (!(isPartial ? key in other : hasOwnProperty8.call(other, key))) {
        return false;
      }
    }
    var objStacked = stack.get(object);
    var othStacked = stack.get(other);
    if (objStacked && othStacked) {
      return objStacked == other && othStacked == object;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index2 < objLength) {
      key = objProps[index2];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  var equalObjects_default = equalObjects;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_DataView.js
  var DataView = getNative_default(root_default, "DataView");
  var DataView_default = DataView;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Promise.js
  var Promise2 = getNative_default(root_default, "Promise");
  var Promise_default = Promise2;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Set.js
  var Set2 = getNative_default(root_default, "Set");
  var Set_default = Set2;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_WeakMap.js
  var WeakMap = getNative_default(root_default, "WeakMap");
  var WeakMap_default = WeakMap;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getTag.js
  var mapTag3 = "[object Map]";
  var objectTag2 = "[object Object]";
  var promiseTag = "[object Promise]";
  var setTag3 = "[object Set]";
  var weakMapTag2 = "[object WeakMap]";
  var dataViewTag3 = "[object DataView]";
  var dataViewCtorString = toSource_default(DataView_default);
  var mapCtorString = toSource_default(Map_default);
  var promiseCtorString = toSource_default(Promise_default);
  var setCtorString = toSource_default(Set_default);
  var weakMapCtorString = toSource_default(WeakMap_default);
  var getTag2 = baseGetTag_default;
  if (DataView_default && getTag2(new DataView_default(new ArrayBuffer(1))) != dataViewTag3 || Map_default && getTag2(new Map_default()) != mapTag3 || Promise_default && getTag2(Promise_default.resolve()) != promiseTag || Set_default && getTag2(new Set_default()) != setTag3 || WeakMap_default && getTag2(new WeakMap_default()) != weakMapTag2) {
    getTag2 = function(value) {
      var result = baseGetTag_default(value), Ctor = result == objectTag2 ? value.constructor : void 0, ctorString = Ctor ? toSource_default(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag3;
          case mapCtorString:
            return mapTag3;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag3;
          case weakMapCtorString:
            return weakMapTag2;
        }
      }
      return result;
    };
  }
  var getTag_default = getTag2;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsEqualDeep.js
  var COMPARE_PARTIAL_FLAG4 = 1;
  var argsTag3 = "[object Arguments]";
  var arrayTag2 = "[object Array]";
  var objectTag3 = "[object Object]";
  var objectProto12 = Object.prototype;
  var hasOwnProperty9 = objectProto12.hasOwnProperty;
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray_default(object), othIsArr = isArray_default(other), objTag = objIsArr ? arrayTag2 : getTag_default(object), othTag = othIsArr ? arrayTag2 : getTag_default(other);
    objTag = objTag == argsTag3 ? objectTag3 : objTag;
    othTag = othTag == argsTag3 ? objectTag3 : othTag;
    var objIsObj = objTag == objectTag3, othIsObj = othTag == objectTag3, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer_default(object)) {
      if (!isBuffer_default(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack_default());
      return objIsArr || isTypedArray_default(object) ? equalArrays_default(object, other, bitmask, customizer, equalFunc, stack) : equalByTag_default(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG4)) {
      var objIsWrapped = objIsObj && hasOwnProperty9.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty9.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack_default());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack_default());
    return equalObjects_default(object, other, bitmask, customizer, equalFunc, stack);
  }
  var baseIsEqualDeep_default = baseIsEqualDeep;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsEqual.js
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike_default(value) && !isObjectLike_default(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep_default(value, other, bitmask, customizer, baseIsEqual, stack);
  }
  var baseIsEqual_default = baseIsEqual;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsMatch.js
  var COMPARE_PARTIAL_FLAG5 = 1;
  var COMPARE_UNORDERED_FLAG3 = 2;
  function baseIsMatch(object, source, matchData, customizer) {
    var index2 = matchData.length, length = index2, noCustomizer = !customizer;
    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index2--) {
      var data = matchData[index2];
      if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
        return false;
      }
    }
    while (++index2 < length) {
      data = matchData[index2];
      var key = data[0], objValue = object[key], srcValue = data[1];
      if (noCustomizer && data[2]) {
        if (objValue === void 0 && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack_default();
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === void 0 ? baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG5 | COMPARE_UNORDERED_FLAG3, customizer, stack) : result)) {
          return false;
        }
      }
    }
    return true;
  }
  var baseIsMatch_default = baseIsMatch;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isStrictComparable.js
  function isStrictComparable(value) {
    return value === value && !isObject_default(value);
  }
  var isStrictComparable_default = isStrictComparable;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getMatchData.js
  function getMatchData(object) {
    var result = keys_default(object), length = result.length;
    while (length--) {
      var key = result[length], value = object[key];
      result[length] = [key, value, isStrictComparable_default(value)];
    }
    return result;
  }
  var getMatchData_default = getMatchData;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_matchesStrictComparable.js
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
    };
  }
  var matchesStrictComparable_default = matchesStrictComparable;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseMatches.js
  function baseMatches(source) {
    var matchData = getMatchData_default(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable_default(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch_default(object, source, matchData);
    };
  }
  var baseMatches_default = baseMatches;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isSymbol.js
  var symbolTag2 = "[object Symbol]";
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike_default(value) && baseGetTag_default(value) == symbolTag2;
  }
  var isSymbol_default = isSymbol;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isKey.js
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
  var reIsPlainProp = /^\w*$/;
  function isKey(value, object) {
    if (isArray_default(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol_default(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }
  var isKey_default = isKey;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/memoize.js
  var FUNC_ERROR_TEXT = "Expected a function";
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver != null && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache2 = memoized.cache;
      if (cache2.has(key)) {
        return cache2.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache2.set(key, result) || cache2;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache_default)();
    return memoized;
  }
  memoize.Cache = MapCache_default;
  var memoize_default = memoize;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_memoizeCapped.js
  var MAX_MEMOIZE_SIZE = 500;
  function memoizeCapped(func) {
    var result = memoize_default(func, function(key) {
      if (cache2.size === MAX_MEMOIZE_SIZE) {
        cache2.clear();
      }
      return key;
    });
    var cache2 = result.cache;
    return result;
  }
  var memoizeCapped_default = memoizeCapped;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stringToPath.js
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reEscapeChar = /\\(\\)?/g;
  var stringToPath = memoizeCapped_default(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46) {
      result.push("");
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
  });
  var stringToPath_default = stringToPath;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayMap.js
  function arrayMap(array, iteratee) {
    var index2 = -1, length = array == null ? 0 : array.length, result = Array(length);
    while (++index2 < length) {
      result[index2] = iteratee(array[index2], index2, array);
    }
    return result;
  }
  var arrayMap_default = arrayMap;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseToString.js
  var INFINITY2 = 1 / 0;
  var symbolProto2 = Symbol_default ? Symbol_default.prototype : void 0;
  var symbolToString = symbolProto2 ? symbolProto2.toString : void 0;
  function baseToString2(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isArray_default(value)) {
      return arrayMap_default(value, baseToString2) + "";
    }
    if (isSymbol_default(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY2 ? "-0" : result;
  }
  var baseToString_default = baseToString2;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/toString.js
  function toString2(value) {
    return value == null ? "" : baseToString_default(value);
  }
  var toString_default = toString2;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_castPath.js
  function castPath(value, object) {
    if (isArray_default(value)) {
      return value;
    }
    return isKey_default(value, object) ? [value] : stringToPath_default(toString_default(value));
  }
  var castPath_default = castPath;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_toKey.js
  var INFINITY3 = 1 / 0;
  function toKey(value) {
    if (typeof value == "string" || isSymbol_default(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY3 ? "-0" : result;
  }
  var toKey_default = toKey;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseGet.js
  function baseGet(object, path) {
    path = castPath_default(path, object);
    var index2 = 0, length = path.length;
    while (object != null && index2 < length) {
      object = object[toKey_default(path[index2++])];
    }
    return index2 && index2 == length ? object : void 0;
  }
  var baseGet_default = baseGet;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/get.js
  function get2(object, path, defaultValue) {
    var result = object == null ? void 0 : baseGet_default(object, path);
    return result === void 0 ? defaultValue : result;
  }
  var get_default = get2;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseHasIn.js
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }
  var baseHasIn_default = baseHasIn;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hasPath.js
  function hasPath(object, path, hasFunc) {
    path = castPath_default(path, object);
    var index2 = -1, length = path.length, result = false;
    while (++index2 < length) {
      var key = toKey_default(path[index2]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index2 != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength_default(length) && isIndex_default(key, length) && (isArray_default(object) || isArguments_default(object));
  }
  var hasPath_default = hasPath;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/hasIn.js
  function hasIn(object, path) {
    return object != null && hasPath_default(object, path, baseHasIn_default);
  }
  var hasIn_default = hasIn;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseMatchesProperty.js
  var COMPARE_PARTIAL_FLAG6 = 1;
  var COMPARE_UNORDERED_FLAG4 = 2;
  function baseMatchesProperty(path, srcValue) {
    if (isKey_default(path) && isStrictComparable_default(srcValue)) {
      return matchesStrictComparable_default(toKey_default(path), srcValue);
    }
    return function(object) {
      var objValue = get_default(object, path);
      return objValue === void 0 && objValue === srcValue ? hasIn_default(object, path) : baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG6 | COMPARE_UNORDERED_FLAG4);
    };
  }
  var baseMatchesProperty_default = baseMatchesProperty;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/identity.js
  function identity(value) {
    return value;
  }
  var identity_default = identity;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseProperty.js
  function baseProperty(key) {
    return function(object) {
      return object == null ? void 0 : object[key];
    };
  }
  var baseProperty_default = baseProperty;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_basePropertyDeep.js
  function basePropertyDeep(path) {
    return function(object) {
      return baseGet_default(object, path);
    };
  }
  var basePropertyDeep_default = basePropertyDeep;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/property.js
  function property(path) {
    return isKey_default(path) ? baseProperty_default(toKey_default(path)) : basePropertyDeep_default(path);
  }
  var property_default = property;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIteratee.js
  function baseIteratee(value) {
    if (typeof value == "function") {
      return value;
    }
    if (value == null) {
      return identity_default;
    }
    if (typeof value == "object") {
      return isArray_default(value) ? baseMatchesProperty_default(value[0], value[1]) : baseMatches_default(value);
    }
    return property_default(value);
  }
  var baseIteratee_default = baseIteratee;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseFindIndex.js
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length, index2 = fromIndex + (fromRight ? 1 : -1);
    while (fromRight ? index2-- : ++index2 < length) {
      if (predicate(array[index2], index2, array)) {
        return index2;
      }
    }
    return -1;
  }
  var baseFindIndex_default = baseFindIndex;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsNaN.js
  function baseIsNaN(value) {
    return value !== value;
  }
  var baseIsNaN_default = baseIsNaN;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_strictIndexOf.js
  function strictIndexOf(array, value, fromIndex) {
    var index2 = fromIndex - 1, length = array.length;
    while (++index2 < length) {
      if (array[index2] === value) {
        return index2;
      }
    }
    return -1;
  }
  var strictIndexOf_default = strictIndexOf;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIndexOf.js
  function baseIndexOf(array, value, fromIndex) {
    return value === value ? strictIndexOf_default(array, value, fromIndex) : baseFindIndex_default(array, baseIsNaN_default, fromIndex);
  }
  var baseIndexOf_default = baseIndexOf;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayIncludes.js
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf_default(array, value, 0) > -1;
  }
  var arrayIncludes_default = arrayIncludes;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayIncludesWith.js
  function arrayIncludesWith(array, value, comparator) {
    var index2 = -1, length = array == null ? 0 : array.length;
    while (++index2 < length) {
      if (comparator(value, array[index2])) {
        return true;
      }
    }
    return false;
  }
  var arrayIncludesWith_default = arrayIncludesWith;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/noop.js
  function noop() {
  }
  var noop_default = noop;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createSet.js
  var INFINITY4 = 1 / 0;
  var createSet = !(Set_default && 1 / setToArray_default(new Set_default([, -0]))[1] == INFINITY4) ? noop_default : function(values) {
    return new Set_default(values);
  };
  var createSet_default = createSet;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseUniq.js
  var LARGE_ARRAY_SIZE2 = 200;
  function baseUniq(array, iteratee, comparator) {
    var index2 = -1, includes = arrayIncludes_default, length = array.length, isCommon = true, result = [], seen = result;
    if (comparator) {
      isCommon = false;
      includes = arrayIncludesWith_default;
    } else if (length >= LARGE_ARRAY_SIZE2) {
      var set = iteratee ? null : createSet_default(array);
      if (set) {
        return setToArray_default(set);
      }
      isCommon = false;
      includes = cacheHas_default;
      seen = new SetCache_default();
    } else {
      seen = iteratee ? [] : result;
    }
    outer:
      while (++index2 < length) {
        var value = array[index2], computed = iteratee ? iteratee(value) : value;
        value = comparator || value !== 0 ? value : 0;
        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        } else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
    return result;
  }
  var baseUniq_default = baseUniq;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/uniqBy.js
  function uniqBy(array, iteratee) {
    return array && array.length ? baseUniq_default(array, baseIteratee_default(iteratee, 2)) : [];
  }
  var uniqBy_default = uniqBy;

  // plugins/snazzy-shelter/src/util/fuzzy.js
  var fuseOptions = {
    // tune threshold to find the "sweet-spot" between accuracy and fuzziness
    threshold: 0.5,
    // (partial) globbing go br|rr
    useExtendedSearch: true,
    keys: ["name", "author", "description"]
  };
  var fuzzy = (set, search2) => !search2 || search2 === "" ? set : new Fuse(set, fuseOptions).search(search2).map((searchResult) => searchResult.item);
  var fuzzyThemes = (themes, search2, filterMode) => fuzzy(
    uniqBy_default(themes ?? [], (t) => t.url),
    search2
  ).filter(
    (t) => filterMode === "0" || filterMode === "1" && !t.compat || filterMode === "2" && t.compat
  );

  // plugins/snazzy-shelter/src/components/SearchBar.jsx
  var import_web28 = __toESM(require_web());
  var SearchBar_default = (props) => (0, import_web28.createComponent)(shelter.ui.TextBox, {
    get value() {
      return props.query;
    },
    get onInput() {
      return props.onChange;
    },
    placeholder: "Search themes..."
  });

  // plugins/snazzy-shelter/src/components/CompatFilterDropdown.jsx
  var import_web29 = __toESM(require_web());
  var import_web30 = __toESM(require_web());
  var import_web31 = __toESM(require_web());
  var import_web32 = __toESM(require_web());
  var import_web33 = __toESM(require_web());
  var _tmpl$9 = /* @__PURE__ */ (0, import_web29.template)(`<select></select>`, 2);
  var _tmpl$24 = /* @__PURE__ */ (0, import_web29.template)(`<option></option>`, 2);
  var SingleSelect = (props) => (() => {
    const _el$ = _tmpl$9.cloneNode(true);
    _el$.addEventListener("change", (e) => props.onChange(e.target.value));
    (0, import_web32.insert)(_el$, () => props.options.map((opt) => (() => {
      const _el$2 = _tmpl$24.cloneNode(true);
      (0, import_web32.insert)(_el$2, () => opt.label);
      (0, import_web33.effect)(() => _el$2.value = opt.value);
      return _el$2;
    })()));
    (0, import_web33.effect)((_p$) => {
      const _v$ = props.isDisabled, _v$2 = props.class;
      _v$ !== _p$._v$ && (_el$.disabled = _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && (0, import_web31.className)(_el$, _p$._v$2 = _v$2);
      return _p$;
    }, {
      _v$: void 0,
      _v$2: void 0
    });
    (0, import_web33.effect)(() => _el$.value = props.value);
    return _el$;
  })();
  var CompatFilterDropdown_default = (props) => (0, import_web30.createComponent)(SingleSelect, {
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
  var import_web34 = __toESM(require_web());
  var import_web35 = __toESM(require_web());
  var import_web36 = __toESM(require_web());
  var _tmpl$10 = /* @__PURE__ */ (0, import_web34.template)(`<div class="ysink_stain_nosplash"></div>`, 2);
  var {
    Header,
    HeaderTags,
    Text: Text2,
    Button: Button2,
    ButtonColors,
    ButtonSizes: ButtonSizes2
  } = shelter.ui;
  var Splash = (props) => (() => {
    const _el$ = _tmpl$10.cloneNode(true);
    (0, import_web35.insert)(_el$, (0, import_web36.createComponent)(Header, {
      get tag() {
        return HeaderTags.H2;
      },
      get children() {
        return props.title;
      }
    }), null);
    (0, import_web35.insert)(_el$, (0, import_web36.createComponent)(Text2, {
      get children() {
        return props.subtitle;
      }
    }), null);
    (0, import_web35.insert)(_el$, (0, import_web36.createComponent)(Button2, {
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
  var NoRepos = (props) => (0, import_web36.createComponent)(Splash, {
    title: "No Repos",
    subtitle: "Add one in the repo manager!",
    get onClick() {
      return props.goToRepos;
    },
    btnText: "Open repo manager"
  });
  var NoThemes = (props) => (0, import_web36.createComponent)(Splash, {
    title: "No Themes",
    subtitle: "Paste a link in above, or head over to the store",
    get onClick() {
      return props.goToStore;
    },
    btnText: "Get some themes"
  });

  // plugins/snazzy-shelter/src/components/tabs/TabInstalled.jsx
  var _tmpl$11 = /* @__PURE__ */ (0, import_web37.template)(`<div class="ysink_stain_search_row"></div>`, 2);
  var _tmpl$25 = /* @__PURE__ */ (0, import_web37.template)(`<div class="ysink_stain_cardcontainer"></div>`, 2);
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
    return [(0, import_web41.createComponent)(InstallBar_default, {}), (() => {
      const _el$ = _tmpl$11.cloneNode(true);
      (0, import_web40.insert)(_el$, (0, import_web41.createComponent)(SearchBar_default, {
        get query() {
          return search2();
        },
        onChange: setSearch
      }), null);
      (0, import_web40.insert)(_el$, (0, import_web41.createComponent)(CompatFilterDropdown_default, {
        get filterMode() {
          return filterMode();
        },
        setFilterMode
      }), null);
      return _el$;
    })(), (0, import_web39.memo)((() => {
      const _c$ = (0, import_web39.memo)(() => store6.themes.length === 0);
      return () => _c$() ? (0, import_web41.createComponent)(NoThemes, {
        goToStore: () => props.goTo(1)
      }) : (() => {
        const _el$2 = _tmpl$25.cloneNode(true);
        (0, import_web40.insert)(_el$2, () => fuzzyThemes(store6.themes, search2(), filterMode()).map((theme) => (0, import_web41.createComponent)(ThemeCard_default, (0, import_web38.mergeProps)(() => ({
          key: theme.url,
          theme
        })))));
        return _el$2;
      })();
    })())];
  };

  // plugins/snazzy-shelter/src/components/tabs/TabQuickCSS.jsx
  var import_web45 = __toESM(require_web());
  var import_web46 = __toESM(require_web());
  var import_web47 = __toESM(require_web());
  var import_web48 = __toESM(require_web());

  // node_modules/.pnpm/@uwu+monaco-solid@1.1.0_solid-js@1.6.16/node_modules/@uwu/monaco-solid/dist/index.jsx
  var import_web42 = __toESM(require_web());
  var import_web43 = __toESM(require_web());
  var import_web44 = __toESM(require_web());
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
    var keys2 = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys2.push.apply(keys2, symbols);
    }
    return keys2;
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
    var keys2 = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys2.push.apply(keys2, symbols);
    }
    return keys2;
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
  function isObject3(value) {
    return {}.toString.call(value).includes("Object");
  }
  function isEmpty(obj) {
    return !Object.keys(obj).length;
  }
  function isFunction2(value) {
    return typeof value === "function";
  }
  function hasOwnProperty10(object, property2) {
    return Object.prototype.hasOwnProperty.call(object, property2);
  }
  function validateChanges(initial, changes) {
    if (!isObject3(changes))
      errorHandler("changeType");
    if (Object.keys(changes).some(function(field) {
      return !hasOwnProperty10(initial, field);
    }))
      errorHandler("changeField");
    return changes;
  }
  function validateSelector(selector) {
    if (!isFunction2(selector))
      errorHandler("selectorType");
  }
  function validateHandler(handler) {
    if (!(isFunction2(handler) || isObject3(handler)))
      errorHandler("handlerType");
    if (isObject3(handler) && Object.values(handler).some(function(_handler) {
      return !isFunction2(_handler);
    }))
      errorHandler("handlersType");
  }
  function validateInitial(initial) {
    if (!initial)
      errorHandler("initialIsRequired");
    if (!isObject3(initial))
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
    return isFunction2(causedChanges) ? causedChanges(state.current) : causedChanges;
  }
  function updateState(state, changes) {
    state.current = _objectSpread22(_objectSpread22({}, state.current), changes);
    return changes;
  }
  function didStateUpdate(state, handler, changes) {
    isFunction2(handler) ? handler(state.current) : Object.keys(changes).forEach(function(field) {
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
  function isObject4(value) {
    return {}.toString.call(value).includes("Object");
  }
  var isObject_default2 = isObject4;

  // node_modules/.pnpm/@monaco-editor+loader@1.3.2_monaco-editor@0.33.0/node_modules/@monaco-editor/loader/lib/es/validators/index.js
  function validateConfig(config3) {
    if (!config3)
      errorHandler2("configIsRequired");
    if (!isObject_default2(config3))
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

  // node_modules/.pnpm/@uwu+monaco-solid@1.1.0_solid-js@1.6.16/node_modules/@uwu/monaco-solid/dist/monaco.js
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

  // node_modules/.pnpm/@uwu+monaco-solid@1.1.0_solid-js@1.6.16/node_modules/@uwu/monaco-solid/dist/index.jsx
  var _tmpl$12 = /* @__PURE__ */ (0, import_web42.template)(`<div></div>`, 2);
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
      const _el$ = _tmpl$12.cloneNode(true);
      (0, import_web44.use)(refCb, _el$);
      (0, import_web43.effect)((_p$) => {
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

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/now.js
  var now = function() {
    return root_default.Date.now();
  };
  var now_default = now;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_trimmedEndIndex.js
  var reWhitespace = /\s/;
  function trimmedEndIndex(string) {
    var index2 = string.length;
    while (index2-- && reWhitespace.test(string.charAt(index2))) {
    }
    return index2;
  }
  var trimmedEndIndex_default = trimmedEndIndex;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseTrim.js
  var reTrimStart = /^\s+/;
  function baseTrim(string) {
    return string ? string.slice(0, trimmedEndIndex_default(string) + 1).replace(reTrimStart, "") : string;
  }
  var baseTrim_default = baseTrim;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/toNumber.js
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol_default(value)) {
      return NAN;
    }
    if (isObject_default(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject_default(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim_default(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  var toNumber_default = toNumber;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/debounce.js
  var FUNC_ERROR_TEXT2 = "Expected a function";
  var nativeMax = Math.max;
  var nativeMin = Math.min;
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT2);
    }
    wait = toNumber_default(wait) || 0;
    if (isObject_default(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax(toNumber_default(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
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
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now_default();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge(now_default());
    }
    function debounced() {
      var time = now_default(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
  var debounce_default = debounce;

  // plugins/snazzy-shelter/src/components/tabs/TabQuickCSS.jsx
  var _tmpl$13 = /* @__PURE__ */ (0, import_web45.template)(`<div></div>`, 2);
  var saveCssDebounced = debounce_default((v) => store7.quickCSS = v, 250);
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
      const _el$ = _tmpl$13.cloneNode(true);
      _el$.style.setProperty("maxWidth", "60vw");
      _el$.style.setProperty("height", "40rem");
      _el$.style.setProperty("resize", "vertical");
      _el$.style.setProperty("overflow", "hidden");
      _el$.style.setProperty("paddingBottom", ".5rem");
      (0, import_web46.insert)(_el$, (0, import_web47.createComponent)(dist_default, {
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
  var import_web53 = __toESM(require_web());
  var import_web54 = __toESM(require_web());
  var import_web55 = __toESM(require_web());

  // plugins/snazzy-shelter/src/components/cards/RepoCard.jsx
  var import_web49 = __toESM(require_web());
  var import_web50 = __toESM(require_web());
  var import_web51 = __toESM(require_web());
  var import_web52 = __toESM(require_web());
  var _tmpl$14 = /* @__PURE__ */ (0, import_web49.template)(`<div class="ysink_stain_card ysink_stain_row"><div><div class="ysink_stain_title"></div></div></div>`, 6);
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
      const _el$ = _tmpl$14.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
      (0, import_web51.insert)(_el$3, () => fullRepo()?.manifest.meta.name, null);
      (0, import_web51.insert)(_el$3, (() => {
        const _c$ = (0, import_web52.memo)(() => !!officialRepos.includes(props.repo));
        return () => _c$() && (0, import_web50.createComponent)(TextBadge, {
          "class": "ysink_stain_officialbadge",
          text: "official",
          color: "var(--info-positive-foreground)"
        });
      })(), null);
      (0, import_web51.insert)(_el$2, (0, import_web50.createComponent)(Text3, {
        get children() {
          return props.repo;
        }
      }), null);
      (0, import_web51.insert)(_el$, (0, import_web50.createComponent)(Button3, {
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
  var {
    plugin: { store: store9 }
  } = shelter;
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
  var _tmpl$15 = /* @__PURE__ */ (0, import_web53.template)(`<div><div class="ysink_stain_row"></div><div class="ysink_stain_cardcontainer"></div></div>`, 6);
  var {
    showToast: showToast2,
    TextBox: TextBox2
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
      const _el$ = _tmpl$15.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
      _el$2.style.setProperty("display", "flex");
      (0, import_web54.insert)(_el$2, (0, import_web55.createComponent)(TextBox2, {
        get value() {
          return url();
        },
        onInput: setUrl,
        placeholder: "https://example.com/repo"
      }), null);
      (0, import_web54.insert)(_el$2, (0, import_web55.createComponent)(Button4, {
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
      (0, import_web54.insert)(_el$, (0, import_web55.createComponent)(Divider, {
        mt: ".5rem",
        mb: ".5rem"
      }), _el$3);
      (0, import_web54.insert)(_el$3, () => store10.repos.map((repo) => (0, import_web55.createComponent)(RepoCard_default, {
        repo
      })));
      return _el$;
    })();
  };

  // plugins/snazzy-shelter/src/components/tabs/TabStore.jsx
  var import_web61 = __toESM(require_web());
  var import_web62 = __toESM(require_web());
  var import_web63 = __toESM(require_web());
  var import_web64 = __toESM(require_web());

  // plugins/snazzy-shelter/src/components/VirtualScroller.tsx
  var import_web56 = __toESM(require_web());
  var import_web57 = __toESM(require_web());
  var import_web58 = __toESM(require_web());
  var import_web59 = __toESM(require_web());
  var import_web60 = __toESM(require_web());
  var _tmpl$16 = /* @__PURE__ */ (0, import_web56.template)(`<div><div></div></div>`, 4);
  var {
    For
  } = window["shelter"].solid;
  var VirtualScroller_default = (props) => (() => {
    const _el$ = _tmpl$16.cloneNode(true), _el$2 = _el$.firstChild;
    _el$.style.setProperty("overflow-y", "auto");
    _el$2.style.setProperty("width", "100%");
    _el$2.style.setProperty("position", "relative");
    (0, import_web59.insert)(_el$2, (0, import_web60.createComponent)(For, {
      get each() {
        return props.items;
      },
      children: (item) => props.children(item)
    }));
    (0, import_web58.effect)((_p$) => {
      const _v$ = props.height, _v$2 = props.class;
      _v$ !== _p$._v$ && _el$.style.setProperty("height", _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && (0, import_web57.className)(_el$, _p$._v$2 = _v$2);
      return _p$;
    }, {
      _v$: void 0,
      _v$2: void 0
    });
    return _el$;
  })();

  // plugins/snazzy-shelter/src/components/tabs/TabStore.jsx
  var _tmpl$17 = /* @__PURE__ */ (0, import_web61.template)(`<div class="ysink_stain_search_row"></div>`, 2);
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
      const _el$ = _tmpl$17.cloneNode(true);
      (0, import_web63.insert)(_el$, (0, import_web64.createComponent)(SearchBar_default, {
        get query() {
          return search2();
        },
        onChange: setSearch
      }), null);
      (0, import_web63.insert)(_el$, (0, import_web64.createComponent)(CompatFilterDropdown_default, {
        get filterMode() {
          return filterMode();
        },
        setFilterMode
      }), null);
      return _el$;
    })(), (0, import_web62.memo)((() => {
      const _c$ = (0, import_web62.memo)(() => store11.repos.length === 0);
      return () => _c$() ? (0, import_web64.createComponent)(NoRepos, {
        goToRepos: () => props.goTo(2)
      }) : (0, import_web64.createComponent)(VirtualScroller_default, {
        get ["class"]() {
          return niceScrollbarsClass();
        },
        height: "50rem",
        keySel: (t) => t.url,
        get items() {
          return fuzzyThemes(themes(), search2(), filterMode());
        },
        children: (theme) => (0, import_web64.createComponent)(ThemeCard_default, {
          theme,
          gap: ".5rem"
        })
      });
    })())];
  };

  // plugins/snazzy-shelter/src/components/tabs/TabDebug.jsx
  var import_web65 = __toESM(require_web());
  var {
    Button: Button5,
    Text: Text4
  } = shelter.ui;
  var TabDebug_default = () => [(0, import_web65.createComponent)(Button5, {
    "class": "ysink_stain_button",
    grow: true,
    onClick: clearCache,
    children: "Clear fetch cache"
  }), (0, import_web65.createComponent)(Text4, {
    children: "@ me if you need other things for debug purposes :)"
  })];

  // plugins/snazzy-shelter/src/components/TabBar.tsx
  var import_web66 = __toESM(require_web());
  var import_web67 = __toESM(require_web());
  var import_web68 = __toESM(require_web());
  var import_web69 = __toESM(require_web());
  var import_web70 = __toESM(require_web());
  var import_web71 = __toESM(require_web());
  var _tmpl$18 = /* @__PURE__ */ (0, import_web66.template)(`<div class="ysink_stain_tabbar_root"><div class="ysink_stain_tabbar"></div><div class="ysink_stain_tabbar_content"></div></div>`, 6);
  var _tmpl$26 = /* @__PURE__ */ (0, import_web66.template)(`<button></button>`, 2);
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
    // @ts-expect-error
  } = shelter;
  var TabBar_default = (props) => {
    const [current, goTo] = createSignal6(0);
    return (() => {
      const _el$ = _tmpl$18.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
      (0, import_web71.insert)(_el$2, () => props.items.map((e, i) => (() => {
        const _el$4 = _tmpl$26.cloneNode(true);
        _el$4.$$click = () => goTo(i);
        (0, import_web71.insert)(_el$4, (0, import_web70.createComponent)(Text5, {
          get children() {
            return e.text;
          }
        }));
        (0, import_web69.effect)(() => (0, import_web68.className)(_el$4, "ysink_stain_button" + (i === current() ? " ysink_stain_selected" : "")));
        return _el$4;
      })()));
      (0, import_web71.insert)(_el$, (0, import_web70.createComponent)(Divider2, {
        mt: ".5rem",
        mb: ".5rem"
      }), _el$3);
      (0, import_web71.insert)(_el$3, (0, import_web70.createComponent)(Dynamic, {
        get component() {
          return props.items[current()].component;
        },
        goTo
      }));
      return _el$;
    })();
  };
  (0, import_web67.delegateEvents)(["click"]);

  // plugins/snazzy-shelter/src/components/SettingsMain.jsx
  var _tmpl$19 = /* @__PURE__ */ (0, import_web72.template)(`<div></div>`, 2);
  var {
    Header: Header2,
    HeaderTags: HeaderTags2
  } = shelter.ui;
  var SettingsMain_default = () => {
    return (() => {
      const _el$ = _tmpl$19.cloneNode(true);
      (0, import_web73.insert)(_el$, (0, import_web74.createComponent)(Header2, {
        get tag() {
          return HeaderTags2.H1;
        },
        children: "Snazzy Shelter Settings"
      }), null);
      (0, import_web73.insert)(_el$, (0, import_web74.createComponent)(TabBar_default, {
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
  var settingsEntry_default = () => shelter.settings.registerSection(
    "section",
    "shsnazzy",
    "Themes",
    SettingsMain_default
  );

  // plugins/snazzy-shelter/src/styles.sass
  var styles_default = `
.ysink_stain_card{background:var(--background-secondary-alt);padding:1rem;border:1px solid var(--background-modifier-accent);border-radius:.5rem;width:100% !important;color:var(--text-normal)}.ysink_stain_title{display:flex;align-items:center;font-size:1rem;color:var(--interactive-active)}.ysink_stain_cardcontainer>*{margin-bottom:.5rem}.ysink_stain_row{display:flex;gap:1rem}.ysink_stain_row>:not(:last-child){flex:1}.ysink_stain_tabbar{padding:.5rem 1rem;display:grid;grid-auto-flow:column;grid-auto-columns:7rem}.ysink_stain_tabbar .ysink_stain_button *{cursor:pointer}.ysink_stain_tabbar>*{margin-right:1rem;padding:.2rem;border-radius:.3rem;min-width:5rem;text-align:center;background:none}.theme-dark .ysink_stain_tabbar>*.ysink_stain_selected{background:rgba(255,255,255,.2666666667)}.theme-light .ysink_stain_tabbar>*.ysink_stain_selected{background:rgba(0,0,0,.2)}.ysink_stain_tabbar>*:last-child{margin-right:0}.ysink_stain_searchbar{margin:.75rem 0}.ysink_stain_search_row{display:flex;gap:.75rem;margin:.75rem 0}.ysink_stain_search_row .ysink_stain_dropdown{height:2.25rem;flex-basis:10rem;background:var(--input-background);color:#fff;border:none;border-radius:3px}.ysink_stain_search_row .ysink_stain_searchbar{margin:unset;flex:1}.ysink_stain_tcard{display:grid;grid-template-columns:auto 1fr min-content;grid-template-rows:auto 1fr;align-items:center}.ysink_stain_tcard .ysink_stain_tmedia{grid-row:1/3;height:4rem;width:7rem;margin-right:1rem;background-size:cover}.ysink_stain_tcard .ysink_stain_tmedia *{display:flex;justify-content:center;align-items:center;height:100%}.ysink_stain_tcard .ysink_stain_tmedia .ysink_stain_tview{z-index:1;transition:opacity 250ms ease;backdrop-filter:brightness(0.3);cursor:pointer}.ysink_stain_tcard .ysink_stain_tmedia .ysink_stain_tview:not(:hover){opacity:0}.ysink_stain_tcard .ysink_stain_tdesc{grid-area:2/2}.ysink_stain_tcard .ysink_stain_tacts{grid-column:3;justify-self:right}.ysink_stain_tcard .ysink_stain_tacts>:last-child{margin-left:.25rem}.ysink_stain_tcard .ysink_stain_tacts>*{display:inline-block}.ysink_stain_tcard .ysink_stain_taulic{text-align:right;min-width:8rem}.ysink_stain_iconbtn{margin-right:.25rem;fill:var(--interactive-normal);cursor:pointer;height:22px;width:22px}.ysink_stain_badge{width:1.5rem;height:1.5rem;margin-right:.5rem;border-radius:50%}.ysink_stain_badge.ysink_stain_bd{padding:.25rem;background:#040405}.ysink_stain_badge.ysink_stain_cc{padding:.1rem;background:#7289da}.ysink_stain_nosplash{display:flex;flex-direction:column;align-items:center;margin-top:15rem;gap:.5rem}.ysink_stain_nosplash h2{margin-bottom:0}.ysink_stain_nosplash>*{flex:0}.ysink_stain_nosplash .ysink_stain_button{margin-top:2rem}.ysink_stain_officialbadge{display:inline;margin-left:.5rem}.ysink_stain_button{color:#fff !important}#shsnazzy-tab{padding-bottom:0}`;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayEachRight.js
  function arrayEachRight(array, iteratee) {
    var length = array == null ? 0 : array.length;
    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }
  var arrayEachRight_default = arrayEachRight;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createBaseFor.js
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index2 = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
      while (length--) {
        var key = props[fromRight ? length : ++index2];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }
  var createBaseFor_default = createBaseFor;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseForRight.js
  var baseForRight = createBaseFor_default(true);
  var baseForRight_default = baseForRight;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseForOwnRight.js
  function baseForOwnRight(object, iteratee) {
    return object && baseForRight_default(object, iteratee, keys_default);
  }
  var baseForOwnRight_default = baseForOwnRight;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createBaseEach.js
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike_default(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length, index2 = fromRight ? length : -1, iterable = Object(collection);
      while (fromRight ? index2-- : ++index2 < length) {
        if (iteratee(iterable[index2], index2, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }
  var createBaseEach_default = createBaseEach;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseEachRight.js
  var baseEachRight = createBaseEach_default(baseForOwnRight_default, true);
  var baseEachRight_default = baseEachRight;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_castFunction.js
  function castFunction(value) {
    return typeof value == "function" ? value : identity_default;
  }
  var castFunction_default = castFunction;

  // node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/forEachRight.js
  function forEachRight(collection, iteratee) {
    var func = isArray_default(collection) ? arrayEachRight_default : baseEachRight_default;
    return func(collection, castFunction_default(iteratee));
  }
  var forEachRight_default = forEachRight;

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
  var onUnload = () => forEachRight_default(transients, (p) => p());
  return __toCommonJS(snazzy_shelter_exports);
})();
