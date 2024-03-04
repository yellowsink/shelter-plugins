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

  // plugins/pronoundb/index.tsx
  var pronoundb_exports = {};
  __export(pronoundb_exports, {
    onUnload: () => onUnload
  });
  var import_web = __toESM(require_web(), 1);
  var import_web2 = __toESM(require_web(), 1);
  var import_web3 = __toESM(require_web(), 1);

  // plugins/pronoundb/biofetcher.ts
  var { reactFiberWalker, getFiber } = shelter.util;
  var fetchedBios = /* @__PURE__ */ new Map();
  async function forceBioFetch(el, uid) {
    const fetchedProm = fetchedBios.get(uid);
    if (fetchedProm)
      return fetchedProm;
    const node = reactFiberWalker(
      getFiber(el),
      (f) => f.stateNode?.handlePreload,
      true
    )?.stateNode;
    if (!node)
      return;
    const prom = node.handlePreload();
    fetchedBios.set(uid, prom);
    return prom;
  }

  // plugins/pronoundb/db.ts
  var UserProfileStore = shelter.flux.stores.UserProfileStore;
  var pronouns = {
    unspecified: "Unspecified",
    hh: "he/him",
    hi: "he/it",
    hs: "he/she",
    ht: "he/they",
    ih: "it/him",
    ii: "it/its",
    is: "it/she",
    it: "it/they",
    shh: "she/he",
    sh: "she/her",
    si: "she/it",
    st: "she/they",
    th: "they/he",
    ti: "they/it",
    ts: "they/she",
    tt: "they/them",
    any: "Any pronouns",
    other: "Other pronouns",
    ask: "Ask me my pronouns",
    avoid: "Avoid pronouns, use my name"
  };
  var pronounsToSearch = Object.values(pronouns).filter((p) => p.includes("/")).sort((a, b) => b.length - a.length);
  var fromStore = (id) => {
    const profile = UserProfileStore.getUserProfile(id);
    if (typeof profile?.bio !== "string")
      return;
    const lowerBio = profile.bio.toLowerCase();
    return pronounsToSearch.find((p) => lowerBio.includes(p));
  };
  var endpoint = "https://pronoundb.org/api/v1/lookup-bulk?platform=discord&ids=";
  var batch = /* @__PURE__ */ new Map();
  var currentlyQueued = false;
  var cache = /* @__PURE__ */ new Map();
  var BATCH_TIME = 150;
  var fetchBatch = async () => {
    const currentBatch = batch;
    batch = /* @__PURE__ */ new Map();
    const ids = [...currentBatch.keys()].join();
    try {
      const res = await fetch(endpoint + ids).then((r) => r.json());
      for (const uid in res)
        if (currentBatch.has(uid) && res[uid] && res[uid] !== "unspecified") {
          const prettyPronouns = pronouns[res[uid]];
          currentBatch.get(uid)?.(prettyPronouns);
          cache.set(uid, prettyPronouns);
        }
      for (const [uid, func] of currentBatch.entries()) {
        func(void 0);
        if (!cache.has(uid))
          cache.set(uid, void 0);
      }
    } finally {
      currentlyQueued = false;
    }
  };
  var fetchPronouns = (uid) => cache.has(uid) ? Promise.resolve(cache.get(uid)) : new Promise((res) => {
    setTimeout(res, 3e3);
    batch.set(uid, res);
    if (!currentlyQueued) {
      currentlyQueued = true;
      setTimeout(fetchBatch, BATCH_TIME);
    }
  });

  // plugins/pronoundb/index.tsx
  var _tmpl$ = /* @__PURE__ */ (0, import_web.template)(`<span> \u2022</span>`, 2);
  var {
    flux: {
      dispatcher
    },
    observeDom,
    util: {
      getFiber: getFiber2,
      reactFiberWalker: reactFiberWalker2
    },
    ui: {
      Space
    }
  } = shelter;
  var patchedEls = /* @__PURE__ */ new WeakSet();
  async function inject(el) {
    if (patchedEls.has(el))
      return;
    patchedEls.add(el);
    const authorId = reactFiberWalker2(getFiber2(el), "message", true)?.pendingProps?.message?.author?.id;
    if (!authorId)
      return;
    let pronouns2 = await fetchPronouns(authorId);
    if (!pronouns2) {
      await forceBioFetch(el.parentElement.parentElement.querySelector("[id^=message-username]").firstElementChild, authorId);
      pronouns2 = fromStore(authorId);
    }
    if (!pronouns2)
      return;
    el.insertAdjacentElement("beforebegin", (() => {
      const _el$ = _tmpl$.cloneNode(true), _el$2 = _el$.firstChild;
      (0, import_web2.insert)(_el$, (0, import_web3.createComponent)(Space, {}), _el$2);
      (0, import_web2.insert)(_el$, pronouns2, _el$2);
      (0, import_web2.insert)(_el$, (0, import_web3.createComponent)(Space, {}), null);
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
  var TRIGGERS = ["MESSAGE_CREATE", "CHANNEL_SELECT", "UPDATE_CHANNEL_DIMENSIONS", "MESSAGE_UPDATE"];
  TRIGGERS.forEach((t) => dispatcher.subscribe(t, onDispatch));
  var onUnload = () => TRIGGERS.forEach((t) => dispatcher.unsubscribe(t, onDispatch));
  return __toCommonJS(pronoundb_exports);
})();
