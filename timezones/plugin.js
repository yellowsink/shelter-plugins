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

  // plugins/timezones/index.js
  var timezones_exports = {};
  __export(timezones_exports, {
    onUnload: () => onUnload,
    settings: () => settings_default
  });

  // plugins/timezones/tzInjection.jsx
  var import_web = __toESM(require_web());
  var import_web2 = __toESM(require_web());

  // plugins/timezones/timezones.js
  var tzsByOffset = {
    [-9]: ["AKST"],
    [-8]: ["PST"],
    [-7]: ["MST"],
    [-6]: ["CT", "CST"],
    [-5]: ["ET", "EST"],
    [-4]: ["EDT"],
    [-3]: ["AMST", "ART", "BRT", "SRT", "UYT", "WGT"],
    [-2]: ["FNT", "PMDT"],
    [-1]: ["AZOT", "CVT", "EGT"],
    0: ["UTC", "GMT", "WET"],
    1: ["CET", "MET", "WAT"],
    2: ["CAT", "EET", "KALT", "SAST", "WAST"],
    3: ["AST", "EAT", "FET", "IOT", "MSK", "TRT"],
    4: ["RET", "AMT"],
    5: ["MVT", "PKT", "TJT", "TMT", "UZT"],
    5.5: ["IST"],
    7: ["THA", "WIB"],
    8: ["AWST", "CST", "HKT", "MST", "MYT", "SGT", "WST"],
    9: ["JST", "KST"],
    9.5: ["ACST"],
    10: ["AEST", "AET", "VLAT"],
    12: ["NZST"]
  };
  var tzKeywords = Object.values(tzsByOffset).flat();
  var tzOffsetsByKey = Object.fromEntries(
    Object.entries(tzsByOffset).flatMap(
      ([oset, tzs]) => tzs.map((t) => [t, parseFloat(oset)])
    )
  );
  var tzRegex = new RegExp(
    `(${tzKeywords.join("|")})(?:([+-]\\d+)(?::(\\d+))?)?`
  );
  var findTimeZone = (txt) => {
    if (!txt)
      return;
    const match = txt.match(tzRegex);
    if (!match)
      return;
    const [, keyword, hours, minutes] = match;
    return tzOffsetsByKey[keyword] + parseFloat(hours ?? 0) + parseFloat(minutes ?? 0) / 60;
  };

  // plugins/timezones/tzdb.js
  var endpoint = "https://timezonedb.catvibers.me/api/user/bulk";
  var UA = "shelter/0.0.0 timestamptools/1.0.0";
  var batch = /* @__PURE__ */ new Map();
  var currentlyQueued = false;
  var BATCH_TIME = 150;
  var cache = /* @__PURE__ */ new Map();
  var fetchBatch = () => setTimeout(async () => {
    const currentBatch = batch;
    batch = /* @__PURE__ */ new Map();
    const ids = JSON.stringify([...currentBatch.keys()]);
    try {
      const res = await fetch(endpoint, {
        method: "post",
        body: ids,
        headers: {
          "User-Agent": UA,
          "Content-Type": "application/json"
        }
      }).then((r) => r.json());
      for (const uid in res)
        if (currentBatch.has(uid) && res[uid]) {
          const parsedOset = parseFloat(res[uid].timezone);
          currentBatch.get(uid)?.(parsedOset);
          cache.set(uid, parsedOset);
        }
      for (const [uid, func] of currentBatch.entries()) {
        func();
        cache.set(uid, void 0);
      }
    } finally {
      currentlyQueued = false;
    }
  }, BATCH_TIME);
  var fetchTimezone = (uid) => cache.has(uid) ? cache.get(uid) : new Promise((res) => {
    setTimeout(res, 3e3);
    batch.set(uid, res);
    if (!currentlyQueued) {
      currentlyQueued = true;
      fetchBatch();
    }
  });

  // plugins/timezones/tzInjection.jsx
  var _tmpl$ = /* @__PURE__ */ (0, import_web.template)(`<time class="ys_tz"> (Theirs: <!>)</time>`, 3);
  var {
    plugin: {
      store
    },
    flux: {
      stores
    },
    util: {
      getFiber,
      reactFiberWalker
    }
  } = shelter;
  var fetchedBios = /* @__PURE__ */ new Set();
  async function forceBioFetch(el, uid) {
    if (fetchedBios.has(uid))
      return;
    const node = reactFiberWalker(getFiber(el), (f) => f.stateNode?.handlePreload, true)?.stateNode;
    if (!node)
      return;
    node.handlePreload();
    fetchedBios.add(uid);
  }
  var extractTimezone = (userId, guildId) => findTimeZone(stores.UserProfileStore.getUserProfile(userId)?.bio) ?? findTimeZone(stores.UserProfileStore.getGuildMemberProfile(userId, guildId)?.bio) ?? findTimeZone(stores.NoteStore.getNote(userId)?.note);
  var injectionMutex = /* @__PURE__ */ new Set();
  var preflightInjection = (el) => !el.parentElement.querySelector(".ys_tz") && !injectionMutex.has(el);
  async function getTimezone(el, msg) {
    if (store.tzdb) {
      const fetched = await fetchTimezone(msg.author.id);
      if (fetched !== void 0)
        return fetched;
    }
    await forceBioFetch(el.parentElement.parentElement.querySelector("[id^=message-username]").firstElementChild, msg.author.id);
    return extractTimezone(msg.author.id, stores.ChannelStore.getChannel(msg.channel_id)?.guild_id);
  }
  async function injectLocalTime(msg, el, date) {
    injectionMutex.add(el);
    const oset = await getTimezone(el, msg);
    injectionMutex.delete(el);
    if (!oset)
      return;
    date.utc();
    date.hours(date.hours() + oset);
    const millisecondsPassed = Date.now() - Date.parse(date.toISOString());
    if (millisecondsPassed > 1e3 * 60 * 60 * 24)
      return;
    el.parentElement.append((() => {
      const _el$ = _tmpl$.cloneNode(true), _el$2 = _el$.firstChild, _el$4 = _el$2.nextSibling, _el$3 = _el$4.nextSibling;
      (0, import_web2.insert)(_el$, () => date.format("HH:mm"), _el$4);
      return _el$;
    })());
  }

  // plugins/timezones/absInjection.js
  var {
    plugin: { store: store2 }
  } = shelter;
  var preflightAbsoluteTime = (el) => el.dataset.abstime !== el.childNodes[1].textContent;
  function injectAbsoluteTime(el, date) {
    if (store2.absUtc)
      date.utc();
    const abstime = date.format("YYYY-MM-DD hh:mm:ss");
    el.dataset.abstime = abstime;
    el.childNodes[1].textContent = abstime;
  }

  // plugins/timezones/settings.jsx
  var import_web3 = __toESM(require_web());
  var import_web4 = __toESM(require_web());
  var _tmpl$2 = /* @__PURE__ */ (0, import_web3.template)(`<a href="https://timezonedb.catvibers.me/?client_mod=shelter">TZDB</a>`, 2);
  var {
    plugin: {
      store: store3
    },
    ui: {
      SwitchItem
    }
  } = shelter;
  var settings_default = () => [(0, import_web4.createComponent)(SwitchItem, {
    get value() {
      return store3.tz;
    },
    onChange: (v) => store3.tz = v,
    children: "Show users' local time (parses timezones from bios & notes)"
  }), (0, import_web4.createComponent)(SwitchItem, {
    get disabled() {
      return !store3.tz;
    },
    get value() {
      return store3.tzdb;
    },
    onChange: (v) => store3.tzdb = v,
    get children() {
      return ["Prefer to query", _tmpl$2.cloneNode(true)];
    }
  }), (0, import_web4.createComponent)(SwitchItem, {
    get value() {
      return store3.abs;
    },
    onChange: (v) => store3.abs = v,
    children: "Show times in absolute ISO form (YYYY-MM-DD HH:MM:SS) every time, instead of relative times"
  }), (0, import_web4.createComponent)(SwitchItem, {
    get disabled() {
      return !store3.abs;
    },
    get value() {
      return store3.absUtc;
    },
    onChange: (v) => store3.absUtc = v,
    children: "Show absolute times in UTC, not local timezone"
  })];

  // plugins/timezones/index.js
  var {
    plugin: { store: store4 },
    flux: { dispatcher },
    observeDom,
    util: { getFiber: getFiber2, reactFiberWalker: reactFiberWalker2 }
  } = shelter;
  store4.tz ??= true;
  store4.tzdb ??= true;
  store4.abs ??= false;
  store4.absUtc ??= false;
  async function injectTimestamp(el) {
    const shouldInjectTz = store4.tz && preflightInjection(el);
    const shouldInjectAbs = store4.abs && preflightAbsoluteTime(el);
    if (!shouldInjectTz && !shouldInjectAbs)
      return;
    const msg = reactFiberWalker2(getFiber2(el), "message", true)?.memoizedProps?.message;
    const date = msg?.timestamp;
    if (!date)
      return;
    if (shouldInjectAbs)
      injectAbsoluteTime(el, date.clone());
    if (shouldInjectTz)
      await injectLocalTime(msg, el, date.clone());
  }
  function onDispatch() {
    if (!store4.tz && !store4.abs)
      return;
    const unObserve = observeDom("h3 time[id^=message-timestamp]", (el) => {
      unObserve();
      injectTimestamp(el);
    });
    setTimeout(unObserve, 500);
  }
  var TRIGGERS = [
    "MESSAGE_CREATE",
    "CHANNEL_SELECT",
    "LOAD_MESSAGES_SUCCESS",
    "UPDATE_CHANNEL_DIMENSIONS",
    "MESSAGE_END_EDIT",
    "MESSAGE_UPDATE"
  ];
  TRIGGERS.forEach((t) => dispatcher.subscribe(t, onDispatch));
  var onUnload = () => TRIGGERS.forEach((t) => dispatcher.unsubscribe(t, onDispatch));
  return __toCommonJS(timezones_exports);
})();
