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

  // plugins/timezones/index.jsx
  var timezones_exports = {};
  __export(timezones_exports, {
    onUnload: () => onUnload
  });
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

  // plugins/timezones/index.jsx
  var _tmpl$ = /* @__PURE__ */ (0, import_web.template)(`<time class="ys_tz"> (Theirs: <!>:<!>)</time>`, 4);
  var {
    flux: {
      dispatcher,
      stores
    },
    observeDom,
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
  async function injectTimestamp(el) {
    if (el.parentElement.querySelector(".ys_tz") || injectionMutex.has(el))
      return;
    const msg = reactFiberWalker(getFiber(el), "message", true)?.memoizedProps?.message;
    const date = msg?.timestamp?.clone();
    if (!date)
      return;
    injectionMutex.add(el);
    await forceBioFetch(el.parentElement.parentElement.querySelector("[id^=message-username]").firstElementChild, msg.author.id);
    injectionMutex.delete(el);
    const oset = extractTimezone(msg.author.id, stores.ChannelStore.getChannel(msg.channel_id)?.guild_id);
    if (!oset)
      return;
    date.utc();
    date.hours(date.hours() + oset);
    const millisecondsPassed = Date.now() - Date.parse(date.toISOString());
    if (millisecondsPassed > 1e3 * 60 * 60 * 24)
      return;
    el.parentElement.append((() => {
      const _el$ = _tmpl$.cloneNode(true), _el$2 = _el$.firstChild, _el$6 = _el$2.nextSibling, _el$4 = _el$6.nextSibling, _el$7 = _el$4.nextSibling, _el$5 = _el$7.nextSibling;
      (0, import_web2.insert)(_el$, () => date.hours(), _el$6);
      (0, import_web2.insert)(_el$, () => date.minutes(), _el$7);
      return _el$;
    })());
  }
  function onDispatch() {
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
