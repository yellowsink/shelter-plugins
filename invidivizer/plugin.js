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

  // plugins/invidivizer/index.jsx
  var invidivizer_exports = {};
  __export(invidivizer_exports, {
    onUnload: () => onUnload,
    settings: () => settings
  });
  var import_web = __toESM(require_web(), 1);
  var import_web2 = __toESM(require_web(), 1);
  var import_web3 = __toESM(require_web(), 1);
  var import_web4 = __toESM(require_web(), 1);
  var _tmpl$ = /* @__PURE__ */ (0, import_web.template)(`<iframe style="border: 0; width: 100%; max-width: 600px; aspect-ratio: 16/9" allow="fullscreen"></iframe>`, 2);
  var {
    plugin: {
      store
    },
    observeDom,
    flux: {
      dispatcher,
      storesFlat: {
        SelectedChannelStore
      }
    },
    util: {
      reactFiberWalker,
      getFiber
    },
    ui: {
      Header,
      HeaderTags,
      TextBox
    }
  } = shelter;
  if (store.instance === "invidious.slipfox.xyz" && !store.sfmigrate) {
    store.sfmigrate = 1;
    store.instance = null;
  }
  store.instance ??= "inv.n8pjl.ca";
  var TRIGGERS = ["MESSAGE_CREATE", "MESSAGE_UPDATE", "UPDATE_CHANNEL_DIMENSIONS"];
  function handleDispatch(payload) {
    if (!store.instance)
      return;
    if ((payload.type === "MESSAGE_CREATE" || payload.type === "MESSAGE_UPDATE") && payload.message.channel_id !== SelectedChannelStore.getChannelId())
      return;
    const unobs = observeDom(`[id^="chat-messages-"] article:not([data-invidivizer])`, (e) => {
      e.dataset.invidivizer = "1";
      unobs();
      e.parentElement.querySelector(`iframe[src*="${store.instance}"]`)?.remove();
      const found = reactFiberWalker(getFiber(e), "embed", true)?.memoizedProps?.embed?.url;
      if (!(typeof found === "string") || !found.startsWith("https://www.youtube.com"))
        return;
      const match = found.match(/v=([a-zA-Z0-9-_]+)/);
      if (!match?.[1])
        return;
      const tsMatch = found.match(/t=(?:\d+|(?:\d+m)?\d+s|\d+m)/);
      const embPath = tsMatch?.[0] ? match[1] + "?" + tsMatch[0] : match[1];
      e.style.display = "none";
      e.insertAdjacentElement("afterend", (() => {
        const _el$ = _tmpl$.cloneNode(true);
        (0, import_web4.effect)(() => (0, import_web3.setAttribute)(_el$, "src", `https://${store.instance}/embed/${embPath}`));
        return _el$;
      })());
    });
    setTimeout(unobs, 1e3);
  }
  for (const t of TRIGGERS)
    dispatcher.subscribe(t, handleDispatch);
  function onUnload() {
    for (const t of TRIGGERS)
      dispatcher.unsubscribe(t, handleDispatch);
  }
  var settings = () => [(0, import_web2.createComponent)(Header, {
    get tag() {
      return HeaderTags.H3;
    },
    children: "Invidious Instance"
  }), (0, import_web2.createComponent)(TextBox, {
    placeholder: "my.instance.com",
    get value() {
      return store.instance;
    },
    onInput: (v) => store.instance = v
  })];
  return __toCommonJS(invidivizer_exports);
})();
