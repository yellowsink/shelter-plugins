(function(exports) {

"use strict";

//#region plugins/show-username/index.js
const { flux: { dispatcher, stores: { GuildMemberStore, ChannelStore, SelectedChannelStore, RelationshipStore } }, util: { getFiber, reactFiberWalker }, observeDom } = shelter;
function addUsername(e) {
	if (e?.dataset?.ysink_su) return;
	e.dataset.ysink_su = true;
	const msg = reactFiberWalker(getFiber(e), "message", true).pendingProps?.message;
	const authorUsername = msg.author?.username;
	const authorId = msg?.author?.id;
	const { type, guild_id: guildId } = ChannelStore.getChannel(msg?.channel_id);
	const nick = type ? RelationshipStore.getNickname(authorId) : GuildMemberStore.getNick(guildId, authorId);
	if (!nick || !authorUsername) return;
	e.firstElementChild.textContent += ` (${authorUsername})`;
}
const TRIGGERS = [
	"MESSAGE_CREATE",
	"CHANNEL_SELECT",
	"LOAD_MESSAGES_SUCCESS",
	"UPDATE_CHANNEL_DIMENSIONS"
];
function onDispatch(payload) {
	if (payload.type === "MESSAGE_CREATE" && payload.channelId !== SelectedChannelStore.getChannelId()) return;
	const unObserve = observeDom("[id^=message-username-]", (element) => {
		unObserve();
		addUsername(element);
	});
	setTimeout(unObserve, 500);
}
function onLoad() {
	for (const t of TRIGGERS) dispatcher.subscribe(t, onDispatch);
}
function onUnload() {
	for (const t of TRIGGERS) dispatcher.unsubscribe(t, onDispatch);
}

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
return exports;
})({});