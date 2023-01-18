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

  // plugins/quickreply/index.js
  var quickreply_exports = {};
  __export(quickreply_exports, {
    onLoad: () => onLoad,
    onUnload: () => onUnload,
    settings: () => settings_default
  });

  // plugins/quickreply/settings.jsx
  var import_web = __toESM(require_web());
  var {
    plugin: {
      store
    },
    ui: {
      SwitchItem
    }
  } = shelter;
  var settings_default = () => [(0, import_web.createComponent)(SwitchItem, {
    get value() {
      return store.scroll;
    },
    onChange: (v) => store.scroll = v,
    children: "Scroll to keep the replying-to message on-screen"
  }), (0, import_web.createComponent)(SwitchItem, {
    get disabled() {
      return !store.scroll;
    },
    get value() {
      return store.scrollSmooth;
    },
    onChange: (v) => store.scroll = v,
    children: "Scroll smoothly"
  }), (0, import_web.createComponent)(SwitchItem, {
    get value() {
      return store.noPing;
    },
    onChange: (v) => store.noPing = v,
    children: "Don't ping the original author of your reply by default"
  })];

  // plugins/quickreply/index.js
  var {
    plugin: { store: store2 },
    flux: {
      dispatcher,
      stores: { ChannelStore, SelectedChannelStore, MessageStore }
    }
  } = shelter;
  var { getChannel } = ChannelStore;
  var { getChannelId } = SelectedChannelStore;
  var { getMessages } = MessageStore;
  var getCurrentChannel = () => getChannel(getChannelId());
  var dontReplyStore = /* @__PURE__ */ new Set();
  var messageIndex = -1;
  var activeChannel = getChannelId();
  var replyingToMessage = void 0;
  var QRSymbol = Symbol("quickreply_deletePendingReply_int");
  function scrollToReplyingMsg() {
    if (!store2.scroll)
      return;
    const messageContainer = document.querySelector(
      '[data-list-id="chat-messages"]'
    );
    const replyingMsg = Array.from(messageContainer.children).find(
      (elem) => elem.firstChild?.class?.includes("replying-")
    );
    replyingMsg?.scrollIntoView({
      behavior: store2.scrollSmooth ? "smooth" : void 0,
      block: "center"
    });
  }
  function createPendingReply(channel, message, shouldMention, showMentionToggle) {
    if (typeof showMentionToggle === "undefined")
      showMentionToggle = channel.guild_id !== null;
    dispatcher.dispatch({
      type: "CREATE_PENDING_REPLY",
      channel,
      message,
      shouldMention: shouldMention && !store2.noPing,
      showMentionToggle
    });
    setTimeout(scrollToReplyingMsg, 100);
  }
  function deletePendingReply(data) {
    dispatcher.dispatch({
      type: "DELETE_PENDING_REPLY",
      channelId: getChannelId(),
      ...data
    });
  }
  function channelSelect(data) {
    if (activeChannel !== data.channelId) {
      activeChannel = data.channelId;
      messageIndex = -1;
    }
  }
  function onCreatePendingReply(data) {
    replyingToMessage = data.message.id;
  }
  function onDeletePendingReply(data) {
    replyingToMessage = void 0;
    if (!data[QRSymbol])
      messageIndex = -1;
  }
  async function keyDown(event) {
    if (!event.ctrlKey && !event.metaKey)
      return;
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown")
      return;
    const messages = (await getMessages(getChannelId())).toArray().reverse();
    const lastIndex = messages.findIndex((msg) => msg.id === replyingToMessage) || 0;
    if (event.key === "ArrowUp")
      messageIndex = lastIndex + 1;
    else if (event.key === "ArrowDown")
      messageIndex = lastIndex - 1;
    if (messageIndex > messages.length)
      messageIndex = messages.length;
    if (messageIndex < 0)
      return deletePendingReply();
    deletePendingReply({
      [QRSymbol]: true
    });
    createPendingReply(
      getCurrentChannel(),
      messages[messageIndex],
      !dontReplyStore.has(getChannelId())
    );
  }
  function onMentionChange({ channelId, shouldMention }) {
    if (shouldMention)
      dontReplyStore.delete(channelId);
    else
      dontReplyStore.add(channelId);
  }
  function onLoad() {
    if (store2.scroll === void 0)
      store2.scroll = true;
    if (store2.scrollSmooth === void 0)
      store2.scrollSmooth = true;
    if (store2.noPing === void 0)
      store2.noPing = false;
    dispatcher.subscribe("CHANNEL_SELECT", channelSelect);
    dispatcher.subscribe("CREATE_PENDING_REPLY", onCreatePendingReply);
    dispatcher.subscribe("DELETE_PENDING_REPLY", onDeletePendingReply);
    dispatcher.subscribe("SET_PENDING_REPLY_SHOULD_MENTION", onMentionChange);
    window.addEventListener("keydown", keyDown);
  }
  function onUnload() {
    dispatcher.unsubscribe("CHANNEL_SELECT", channelSelect);
    dispatcher.unsubscribe("CREATE_PENDING_REPLY", onCreatePendingReply);
    dispatcher.unsubscribe("DELETE_PENDING_REPLY", onDeletePendingReply);
    dispatcher.unsubscribe("SET_PENDING_REPLY_SHOULD_MENTION", onMentionChange);
    window.removeEventListener("keydown", keyDown);
  }
  return __toCommonJS(quickreply_exports);
})();
