 (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // index.js
  var freemoji_exports = {};
  __export(freemoji_exports, {
    onUnload: () => onUnload
  });

  // spoofer.js
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

  // msgProcessor.js
  var {
    plugin: { store },
    flux: {
      stores: {
        SelectedGuildStore,
        EmojiStore
      }
    }
  } = shelter;
  var isInDms = () => document.querySelector('[data-list-item-id="guildsnav___home"]').classList.contains(selected);
  var getEmoteSize = () => Number.isSafeInteger(parseInt(store.size)) ? store.size : 64;
  function extractUnusableEmojis(messageString, size) {
    const emojiStrings = messageString.matchAll(/<a?:(\w+):(\d+)>/gi);
    const emojiUrls = [];
    for (const emojiString of emojiStrings) {
      const emoji = EmojiStore.getCustomEmojiById(emojiString[2]);
      if (emoji.guildId !== SelectedGuildStore.getLastSelectedGuildId() || emoji.animated || isInDms()) {
        messageString = messageString.replace(emojiString[0], "");
        emojiUrls.push(`${emoji.url.split("?")[0]}?size=${size}`);
      }
    }
    return [messageString.trim(), emojiUrls];
  }
  var msgProcessor_default = (content) => {
    if (!content.match(/<a?:(\w+):(\d+)>/i))
      return;
    let [newContent, extractedEmojis] = extractUnusableEmojis(
      content,
      getEmoteSize()
    );
    if (extractedEmojis.length > 0)
      newContent += "\n" + extractedEmojis.join("\n");
    return newContent;
  };

  // index.js
  var {
    flux: { dispatcher, intercept },
    plugin: { store: store2 },
    patcher: { before },
    observeDom
  } = shelter;
  if (store2.size === void 0)
    store2.size = 64;
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
  var mbarUnpatches = [];
  var patchMessagebar = (elem) => {
    if (elem.dataset.YSINK_FM)
      return;
    elem.dataset.YSINK_FM = "1";
    const fiber = elem.__reactFiber$.return;
    const parent = fiber.return;
    mbarUnpatches.push(before("onEnter", fiber.pendingProps, () => {
      parent.pendingProps.textValue = msgProcessor_default(parent.pendingProps.textValue);
    }));
  };
  var unObserve = observeDom('[class*="slateContainer-"]', (e) => {
    patchMessagebar(e);
  });
  dispatcher.subscribe("TRACK", handleTrack);
  var onUnload = () => {
    dispatcher.unsubscribe("TRACK", handleTrack);
    unObserve();
    unpatchMessagebar?.();
  };
  return __toCommonJS(freemoji_exports);
})();
