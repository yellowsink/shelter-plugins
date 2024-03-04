(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod2) => function __require() {
    return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
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
  var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
    mod2
  ));
  var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

  // shltr-res-ns:solid-js/web
  var require_web = __commonJS({
    "shltr-res-ns:solid-js/web"(exports, module) {
      module.exports = shelter.solidWeb;
    }
  });

  // plugins/lastfm/index.ts
  var lastfm_exports = {};
  __export(lastfm_exports, {
    onUnload: () => onUnload,
    settings: () => settings
  });

  // plugins/lastfm/cfg.ts
  var DEFAULT_NAME = "{{name}}";
  var DEFAULT_INTERVAL = 5e3;
  var DISCORD_APP_ID = "1107251687984472144";
  var LFM_API_KEY = "311958e99f6ee58518756f83720db787";
  var ACTIVITY_TYPE_LISTENING = 2;
  var IGNORED_COVERS = [
    "2a96cbd8b46e442fc41c2b86b821562f",
    "c6f59c1e5e7240a4c0d427abd71f3dbb"
  ];

  // node_modules/.pnpm/@cumjar+websmack@1.2.0/node_modules/@cumjar/websmack/src/raid/webpackChunk.js
  var webpackChunk_default = (key) => {
    key ??= Object.keys(window).find((key2) => key2.startsWith("webpackChunk"));
    if (!window[key])
      return;
    let wpRequire;
    window[key].push([
      [Symbol()],
      {},
      (e) => {
        wpRequire = e;
      }
    ]);
    window[key].pop();
    return [wpRequire.c ?? // wow thats jank lmao
    Object.fromEntries(
      Object.entries(wpRequire.m).map(([k]) => [
        k,
        { id: k, loaded: true, exports: wpRequire(k) }
      ])
    ), wpRequire];
  };

  // node_modules/.pnpm/@cumjar+websmack@1.2.0/node_modules/@cumjar/websmack/src/api/filters.js
  var byProps = (props) => (m) => props.every((p) => m[p] !== void 0);
  var byProtos = (protos) => (m) => m.prototype && protos.every((p) => m.prototype[p] !== void 0);
  var byDisplayName = (name, defaultExp = true) => (m) => (defaultExp ? m.displayName : m.default?.displayName) === name;
  var byKeyword = (strs) => (m) => strs.every(
    (s) => Object.keys(m).some((k) => k.toLowerCase().includes(s.toLowerCase()))
  );
  var byDispNameDeep = (name) => (m) => {
    const regex = new RegExp(`(${name}$)|((\\w+\\()+${name}\\))`);
    if (regex.test(m.displayName))
      return true;
    if (typeof m.$$typeof !== "symbol")
      return;
    if (m.Consumer !== void 0)
      return;
    if (m.type || m.render) {
      while (typeof m.type === "object" || typeof m.render === "object")
        m = m.type ?? m.render;
      if (regex.test(m.type?.displayName))
        return true;
      if (regex.test(m.render?.displayName))
        return true;
    }
  };
  var isKeyable = (m) => typeof m === "object" || typeof m === "function";
  var byNestedProps = (props) => (m) => isKeyable(m) && Object.values(m).some(
    (v) => isKeyable(v) && props.some((p) => v?.[p] !== void 0)
  );
  var allByCode = (modules2, loaders) => (code2) => Object.entries(loaders).filter(([, m]) => m.toString().match(code2)).map(([id]) => modules2[id]?.exports).filter((m) => m);

  // node_modules/.pnpm/@cumjar+websmack@1.2.0/node_modules/@cumjar/websmack/src/api/batch.js
  var batchFilter = (modules2, filterList) => {
    const found = [];
    const checkModule = (mod2) => filterList.forEach(([filter2, multi], i) => {
      if (multi && !found[i])
        found[i] = [];
      if (filter2(mod2)) {
        if (multi)
          found[i].push(mod2);
        else if (!found[i])
          found[i] = mod2;
      }
    });
    for (const mid in modules2) {
      const module = modules2[mid].exports;
      if (!module || module === window)
        continue;
      if (module.default && module.__esModule)
        checkModule(module.default);
      checkModule(module);
    }
    return found;
  };
  var makeFakeWp = (filterList) => ({
    find: (f) => filterList.push([f, false]),
    findAll: (f) => filterList.push([f, true]),
    findByProps: (...p) => filterList.push([byProps(p), false]),
    findByPropsAll: (...p) => filterList.push([byProps(p), true]),
    findByPrototypes: (...p) => filterList.push([byProtos(p), false]),
    findByPrototypesAll: (...p) => filterList.push([byProtos(p), true]),
    findByNestedProps: (...p) => filterList.push([byNestedProps(p), false]),
    findByNestedPropsAll: (...p) => filterList.push([byNestedProps(p), true]),
    findByDisplayName: (n, d) => filterList.push([byDisplayName(n, d), false]),
    findByDisplayNameAll: (n, d) => filterList.push([byDisplayName(n, d), true]),
    findByDispNameDeep: (n) => filterList.push([byDispNameDeep(n), false]),
    findByDispNameDeepAll: (n) => filterList.push([byDispNameDeep(n), true]),
    findByKeyword: (...s) => filterList.push([byKeyword(s), false]),
    findByKeywordAll: (...s) => filterList.push([byKeyword(s), true])
  });
  var batch_default = (mods) => (cb) => {
    const fList = [];
    const fakeWp = makeFakeWp(fList);
    cb(fakeWp);
    return batchFilter(mods, fList);
  };

  // node_modules/.pnpm/@cumjar+websmack@1.2.0/node_modules/@cumjar/websmack/src/api/index.js
  var filter = (modules2, single = true) => (filterFunc) => {
    const found = [];
    for (const mid in modules2) {
      const module = modules2[mid].exports;
      if (!module || module === window)
        continue;
      if (module.default && module.__esModule && filterFunc(module.default)) {
        if (single)
          return module.default;
        found.push(module.default);
      }
      if (filterFunc(module)) {
        if (single)
          return module;
        found.push(module);
      }
    }
    if (!single)
      return found;
  };
  var api_default = ([, modules2, wpR]) => {
    const find = filter(modules2);
    const findAll = filter(modules2, false);
    const findByCodeAll = wpR ? allByCode(modules2, wpR.m) : () => {
      throw new Error("findByCode does not work with this bundler");
    };
    return {
      batchFind: batch_default(modules2),
      find,
      findAll,
      findByProps: (...p) => find(byProps(p)),
      findByPropsAll: (...p) => findAll(byProps(p)),
      findByPrototypes: (...p) => find(byProtos(p)),
      findByPrototypesAll: (...p) => findAll(byProtos(p)),
      findByNestedProps: (...p) => find(byNestedProps(p)),
      findByNestedPropsAll: (...p) => findAll(byNestedProps(p)),
      findByDisplayName: (d, p) => find(byDisplayName(d, p)),
      findByDisplayNameAll: (d, p) => findAll(byDisplayName(d, p)),
      findByDispNameDeep: (d) => find(byDispNameDeep(d)),
      findByDispNameDeepAll: (d) => findAll(byDispNameDeep(d)),
      findByKeyword: (...k) => find(byKeyword(k)),
      findByKeywordAll: (...k) => findAll(byKeyword(k)),
      findByCodeAll,
      findByCode: (c) => findByCodeAll(c)[0]
    };
  };

  // plugins/lastfm/assets.ts
  var modules = webpackChunk_default();
  var api = modules && api_default([void 0, ...modules]);
  var mod = api && api.findByProps("getAssetImage");
  var getAsset = (url) => !mod.fetchAssetIds ? void 0 : mod.fetchAssetIds(DISCORD_APP_ID, [url, void 0]).then((v) => v[0]);

  // plugins/lastfm/Settings.tsx
  var import_web = __toESM(require_web());
  var import_web2 = __toESM(require_web());
  var import_web3 = __toESM(require_web());
  var import_web4 = __toESM(require_web());
  var _tmpl$ = /* @__PURE__ */ (0, import_web.template)(`<div style="display: flex"></div>`, 2);
  var {
    store
  } = shelter.plugin;
  var {
    TextBox,
    SwitchItem,
    Header,
    HeaderTags,
    Divider,
    Text,
    LinkButton,
    Space,
    Button,
    ButtonColors,
    ButtonLooks,
    ButtonSizes
  } = shelter.ui;
  var {
    Show
  } = shelter.solid;
  var ServiceButton = (props) => (0, import_web3.createComponent)(Button, {
    grow: true,
    onClick: () => store.service = props.service,
    get color() {
      return store.service === props.service ? ButtonColors.BRAND : ButtonColors.SECONDARY;
    },
    get look() {
      return ButtonLooks.OUTLINED;
    },
    get size() {
      return ButtonSizes.TINY;
    },
    get children() {
      return props.children;
    }
  });
  var settings = () => [(0, import_web3.createComponent)(Header, {
    get tag() {
      return HeaderTags.H3;
    },
    children: "Application Name"
  }), (0, import_web3.createComponent)(TextBox, {
    placeholder: DEFAULT_NAME,
    get value() {
      return store.appName ?? "";
    },
    onInput: (v) => store.appName = v
  }), (0, import_web3.createComponent)(Header, {
    get tag() {
      return HeaderTags.H3;
    },
    children: "Service"
  }), (() => {
    const _el$ = _tmpl$.cloneNode(true);
    (0, import_web2.insert)(_el$, (0, import_web3.createComponent)(ServiceButton, {
      service: "lfm",
      children: "Last.fm"
    }), null);
    (0, import_web2.insert)(_el$, (0, import_web3.createComponent)(ServiceButton, {
      service: "lbz",
      children: "Listenbrainz"
    }), null);
    return _el$;
  })(), (0, import_web3.createComponent)(Header, {
    get tag() {
      return HeaderTags.H3;
    },
    get children() {
      return [(0, import_web4.memo)(() => store.service === "lbz" ? "Listenbrainz" : "Last.fm"), " username (required)"];
    }
  }), (0, import_web3.createComponent)(TextBox, {
    get value() {
      return store.user ?? "";
    },
    onInput: (v) => store.user = v
  }), (0, import_web3.createComponent)(Show, {
    get when() {
      return store.service === "lbz";
    },
    get children() {
      return (0, import_web3.createComponent)(SwitchItem, {
        get value() {
          return store.lbLookup;
        },
        onChange: (v) => store.lbLookup = v,
        note: "Depending on the scrobbler, Listenbrainz may not be able to return a release ID with the current track. If this happens, we can't fetch an album cover. This option will search musicbrainz for a matching release if this happens, to attempt to find a (hopefully correct) cover. If you get incorrect album art, turn this off. If you get missing album art, turn this on.",
        children: "Search Musicbrainz for missing releases"
      });
    }
  }), (0, import_web3.createComponent)(Header, {
    get tag() {
      return HeaderTags.H3;
    },
    children: "Update interval (seconds)"
  }), (0, import_web3.createComponent)(TextBox, {
    placeholder: DEFAULT_INTERVAL / 1e3 + "",
    get value() {
      return store.interval ? store.interval / 1e3 + "" : "";
    },
    onInput: (v) => (!v || !isNaN(parseFloat(v))) && (store.interval = !v ? void 0 : parseFloat(v) * 1e3 || DEFAULT_INTERVAL)
  }), (0, import_web3.createComponent)(Divider, {
    mt: true,
    mb: true
  }), (0, import_web3.createComponent)(SwitchItem, {
    get value() {
      return store.stamp;
    },
    onChange: (v) => store.stamp = v,
    note: "Show time since song started playing",
    children: "Show time elapsed"
  }), (0, import_web3.createComponent)(SwitchItem, {
    get value() {
      return store.ignoreSpotify;
    },
    onChange: (v) => store.ignoreSpotify = v,
    note: "Hide the status if Spotify is playing",
    children: "Hide when using Spotify"
  }), (0, import_web3.createComponent)(Text, {
    get children() {
      return ["Thanks to", (0, import_web3.createComponent)(LinkButton, {
        href: "https://github.com/amsyarasyiq/letup/blob/main/plugins/Last.fm",
        get children() {
          return [(0, import_web3.createComponent)(Space, {}), "Pylix's Vendetta plugin", (0, import_web3.createComponent)(Space, {})];
        }
      }), "for useful implementation details and reference."];
    }
  })];

  // plugins/lastfm/index.ts
  var {
    // @ts-expect-error
    plugin: { store: store2 },
    flux: { storesFlat, dispatcher }
  } = shelter;
  store2.stamp ??= true;
  store2.ignoreSpotify ??= true;
  store2.service ??= "lfm";
  store2.lbLookup ??= true;
  var UserStore = storesFlat.UserStore;
  var PresenceStore = storesFlat.PresenceStore;
  var setPresence = async (name = "", activity) => dispatcher.dispatch({
    type: "LOCAL_ACTIVITY_UPDATE",
    activity: activity ? {
      name,
      //flags: 1,
      type: 2,
      details: activity.name,
      state: activity.artist,
      application_id: DISCORD_APP_ID,
      timestamps: store2.stamp ? { start: ~~(Date.now() / 1e3) } : void 0,
      assets: {
        large_image: activity.albumArt && await getAsset(activity.albumArt),
        large_text: activity.album
      }
    } : null,
    socketId: "Last.fm@shelter"
  });
  var getScrobbleLastfm = async () => {
    const params = new URLSearchParams({
      method: "user.getrecenttracks",
      user: store2.user,
      api_key: LFM_API_KEY,
      format: "json",
      limit: "1",
      extended: "1"
    });
    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`);
    if (!res.ok)
      return;
    const lastTrack2 = (await res.json())?.recenttracks?.track?.[0];
    if (!lastTrack2)
      return;
    const aart = lastTrack2.image[3]["#text"];
    return {
      name: lastTrack2.name,
      artist: lastTrack2.artist.name,
      album: lastTrack2.album["#text"],
      albumArt: IGNORED_COVERS.includes(aart) ? void 0 : aart,
      url: lastTrack2.url,
      //date: lastTrack.date?.["#text"] ?? "now",
      nowPlaying: !!lastTrack2["@attr"]?.nowplaying
    };
  };
  var listenBrainzLookupAdditional = async (basicTrack) => {
    if (!store2.lbLookup)
      return;
    if (basicTrack.additional_info?.release_mbid)
      return;
    try {
      const metaRes = await fetch(
        `https://shcors.uwu.network/https://api.listenbrainz.org/1/metadata/lookup/?${new URLSearchParams(
          {
            recording_name: basicTrack.track_name,
            artist_name: basicTrack.artist_name,
            metadata: "true",
            inc: "artist tag release"
          }
        )}`,
        {
          headers: {
            "X-Shprox-UA": "ShelterLastFm/0.0.0 ( https://github.com/yellowsink/shelter-plugins )"
          }
        }
      ).then((r) => r.json());
      basicTrack.additional_info = { ...basicTrack?.additional_info, ...metaRes };
    } catch (e) {
      console.error(
        "SHELTER LASTFM: finding listenbrainz MBID for track",
        basicTrack,
        "failed, ",
        e
      );
    }
  };
  var getScrobbleListenbrainz = async () => {
    const nowPlayingRes = await fetch(
      `https://shcors.uwu.network/https://api.listenbrainz.org/1/user/${store2.user}/playing-now`,
      {
        headers: {
          "X-Shprox-UA": "ShelterLastFm/0.0.0 ( https://github.com/yellowsink/shelter-plugins )"
        }
      }
    ).then((r) => r.json());
    if (!nowPlayingRes.payload.count)
      return;
    const track = nowPlayingRes.payload.listens[0].track_metadata;
    await listenBrainzLookupAdditional(track);
    let albumArtUrl = !track.additional_info?.release_mbid ? void 0 : `https://coverartarchive.org/release/${track.additional_info.release_mbid}/front`;
    if (albumArtUrl) {
      const testRes = await fetch(albumArtUrl);
      if (!testRes.redirected)
        albumArtUrl = void 0;
    }
    return {
      name: track.track_name,
      artist: track.artist_name,
      album: track.release_name,
      albumArt: albumArtUrl,
      url: track.additional_info?.recording_mbid ? `https://musicbrainz.org/recording/${track.additional_info.recording_mbid}` : `NOURL_${track.track_name}:${track.artist_name}:${track.release_name}`,
      //date: "now", // not returned by api
      nowPlaying: nowPlayingRes.payload.listens[0].playing_now
    };
  };
  var lastUrl;
  var updateStatus = async () => {
    if (!store2.user)
      return setPresence();
    if (store2.ignoreSpotify) {
      for (const activity of PresenceStore.getActivities(
        UserStore.getCurrentUser().id
      ))
        if (activity?.type === ACTIVITY_TYPE_LISTENING && activity.application_id !== DISCORD_APP_ID)
          return setPresence();
    }
    const getFn = store2.service === "lbz" ? getScrobbleListenbrainz : getScrobbleLastfm;
    const lastTrack = await getFn();
    if (!lastTrack?.nowPlaying)
      return setPresence();
    if (lastTrack.url === lastUrl)
      return;
    lastUrl = lastTrack.url;
    let appName = store2.appName || DEFAULT_NAME;
    appName = appName.replaceAll(
      /{{(.+)}}/g,
      (_, code) => eval(`(c)=>{with(c){try{return ${code}}catch(e){return e}}}`)(lastTrack)
    );
    await setPresence(appName, lastTrack);
  };
  var interval;
  var restartLoop = () => (interval && clearInterval(interval), interval = setInterval(updateStatus, store2.interval || DEFAULT_INTERVAL));
  restartLoop();
  var onUnload = () => (clearInterval(interval), setPresence());
  return __toCommonJS(lastfm_exports);
})();
