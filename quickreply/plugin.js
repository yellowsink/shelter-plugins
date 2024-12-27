(function(exports) {

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion

//#region solid-js/web
var require_web = __commonJS({ "solid-js/web"(exports, module) {
	module.exports = shelter.solidWeb;
} });

//#endregion
//#region plugins/quickreply/settings.jsx
var import_web = __toESM(require_web(), 1);
const { plugin: { store: store$1 }, ui: { SwitchItem } } = shelter;
var settings_default = () => [
	(0, import_web.createComponent)(SwitchItem, {
		get value() {
			return store$1.scroll;
		},
		onChange: (v) => store$1.scroll = v,
		children: "Scroll to keep the replying-to message on-screen"
	}),
	(0, import_web.createComponent)(SwitchItem, {
		get disabled() {
			return !store$1.scroll;
		},
		get value() {
			return store$1.scrollSmooth;
		},
		onChange: (v) => store$1.scrollSmooth = v,
		children: "Scroll smoothly"
	}),
	(0, import_web.createComponent)(SwitchItem, {
		get value() {
			return store$1.noPing;
		},
		onChange: (v) => store$1.noPing = v,
		children: "Don't ping the original author of your reply by default"
	})
];

//#endregion
//#region plugins/quickreply/index.js
const { plugin: { store }, flux: { dispatcher, stores: { UserStore, ChannelStore, SelectedChannelStore, MessageStore } } } = shelter;
const { getChannel } = ChannelStore;
const { getChannelId } = SelectedChannelStore;
const { getMessages } = MessageStore;
const getCurrentChannel = () => getChannel(getChannelId());
const dontReplyStore = new Set();
let messageIndex = -1;
let activeChannel = getChannelId();
let replyingToMessage = undefined;
let QRSymbol = Symbol("quickreply_deletePendingReply_int");
function scrollToReplyingMsg() {
	if (!store.scroll) return;
	const messageContainer = document.querySelector("[data-list-id=\"chat-messages\"]");
	const replyingMsg = Array.from(messageContainer.children).find((elem) => elem.firstElementChild?.className?.includes("replying_"));
	replyingMsg?.scrollIntoView({
		behavior: store.scrollSmooth ? "smooth" : undefined,
		block: "center"
	});
}
function createPendingReply(channel, message, shouldMention, showMentionToggle) {
	if (typeof showMentionToggle === "undefined") showMentionToggle = channel.guild_id !== null;
	dispatcher.dispatch({
		type: "CREATE_PENDING_REPLY",
		channel,
		message,
		shouldMention: shouldMention && !store.noPing && message.author.id !== UserStore.getCurrentUser().id,
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
	replyingToMessage = undefined;
	if (!data[QRSymbol]) messageIndex = -1;
}
async function keyDown(event) {
	if (!event.ctrlKey && !event.metaKey) return;
	if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
	const messages = (await getMessages(getChannelId())).toArray().reverse();
	const lastIndex = messages.findIndex((msg) => msg.id === replyingToMessage) || 0;
	if (event.key === "ArrowUp") messageIndex = lastIndex + 1;
else if (event.key === "ArrowDown") messageIndex = lastIndex - 1;
	if (messageIndex > messages.length) messageIndex = messages.length;
	if (messageIndex < 0) return deletePendingReply();
	deletePendingReply({ [QRSymbol]: true });
	createPendingReply(getCurrentChannel(), messages[messageIndex], !dontReplyStore.has(getChannelId()));
}
function onMentionChange({ channelId, shouldMention }) {
	if (shouldMention) dontReplyStore.delete(channelId);
else dontReplyStore.add(channelId);
}
function onLoad() {
	if (store.scroll === undefined) store.scroll = true;
	if (store.scrollSmooth === undefined) store.scrollSmooth = true;
	if (store.noPing === undefined) store.noPing = false;
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

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.settings = settings_default
return exports;
})({});