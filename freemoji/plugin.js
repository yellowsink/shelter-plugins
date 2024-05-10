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

  // plugins/freemoji/index.js
  var freemoji_exports = {};
  __export(freemoji_exports, {
    onUnload: () => onUnload,
    settings: () => settings_default
  });

  // plugins/freemoji/spoofer.js
  var user = () => shelter.flux.stores.UserStore.getCurrentUser();
  var realNitro;
  var spoofNitro = () => {
    if (realNitro)
      return;
    realNitro = user().premiumType;
    user().premiumType = 2;
  };
  var revertNitro = () => {
    if (realNitro === void 0)
      return;
    user().premiumType = realNitro;
    realNitro = void 0;
  };

  // plugins/freemoji/slateTreeProcessor.js
  var {
    plugin: { store },
    flux: {
      stores: { SelectedGuildStore, EmojiStore }
    }
  } = shelter;
  var isInDms = () => !!document.querySelector(
    '[data-list-item-id="guildsnav___home"][class*="selected"]'
  );
  var getEmoteSize = () => Number.isSafeInteger(parseInt(store.size)) ? store.size : 64;
  var slateTreeProcessor_default = (slateTree) => {
    const extractedEmojis = [];
    const newSlateTree = [];
    for (const line of slateTree) {
      const newLine = [];
      for (const lineItem of line.children) {
        if (lineItem.emoji) {
          const emoji = EmojiStore.getCustomEmojiById(lineItem.emoji.emojiId);
          if (emoji.guildId !== SelectedGuildStore.getLastSelectedGuildId() || emoji.animated || isInDms()) {
            extractedEmojis.push(
              `https://cdn.discordapp.com/emojis/${emoji.id}?size=${getEmoteSize()}`
            );
            continue;
          }
        }
        newLine.push(lineItem);
      }
      newSlateTree.push({
        ...line,
        children: newLine
      });
    }
    for (const extracted of extractedEmojis)
      newSlateTree.push({
        type: "line",
        children: [{ text: extracted }]
      });
    return newSlateTree;
  };

  // plugins/freemoji/settings.jsx
  var import_web = __toESM(require_web(), 1);
  var import_web2 = __toESM(require_web(), 1);
  var {
    plugin: {
      store: store2
    },
    ui: {
      Header,
      HeaderTags,
      TextBox
    }
  } = shelter;
  var settings_default = () => [(0, import_web2.createComponent)(Header, {
    get tag() {
      return HeaderTags.H3;
    },
    children: "Emoji Size (defaults to 64 if invalid)"
  }), (0, import_web2.createComponent)(TextBox, {
    placeholder: "64",
    get value() {
      return Number.isSafeInteger(store2.size) ? store2.size : "";
    },
    onInput: (val) => store2.size = parseInt(val)
  })];

  // plugins/freemoji/index.js
  var {
    flux: { dispatcher },
    plugin: { store: store3 },
    observeDom,
    util: { getFiber }
  } = shelter;
  if (store3.size === void 0)
    store3.size = 64;
  function handleTrack(e) {
    const spoofWhile = (eventName, selector) => {
      if (e.event === eventName) {
        spoofNitro();
        const unObserve2 = observeDom(selector, (e2) => {
          if (e2.isConnected)
            return;
          setTimeout(() => revertNitro(), 5e3);
          unObserve2();
        });
      }
    };
    spoofWhile("expression_picker_opened", "#emoji-picker-tab-panel");
    spoofWhile("channel_autocomplete_open", "[class*=autocomplete]");
  }
  var KILLSWITCH_patchMessagebar = false;
  var patchMessagebar = (elem) => {
    if (elem.dataset.YSINK_FM)
      return;
    elem.dataset.YSINK_FM = "1";
    const fiber = getFiber(elem);
    const editor = fiber.child.pendingProps.editor;
    elem.onkeydown = (k) => {
      if (KILLSWITCH_patchMessagebar)
        return;
      if (k.key === "Enter" && !document.querySelector("[class*=autocomplete],[class*=attachedBars]"))
        editor.children = slateTreeProcessor_default(editor.children);
    };
  };
  var unObserve = observeDom('[class*="slateContainer"]', (e) => {
    patchMessagebar(e);
  });
  dispatcher.subscribe("TRACK", handleTrack);
  var onUnload = () => {
    dispatcher.unsubscribe("TRACK", handleTrack);
    unObserve();
    KILLSWITCH_patchMessagebar = true;
  };
  return __toCommonJS(freemoji_exports);
})();
