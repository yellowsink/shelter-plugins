const {
	plugin: { store },
	// solid isnt setup with my setup rn anyway
	//ui: { SwitchItem },
	flux: {
		dispatcher,
		stores: {
			ChannelStore,
			SelectedChannelStore,
			MessageStore
		}
	}
} = shelter;

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

	const messageContainer = document.querySelector(
		'[data-list-id="chat-messages"]'
	);
	const replyingMsg = Array.from(messageContainer.children).find((elem) =>
		elem.firstChild?.className?.includes("replying-")
	);

	replyingMsg?.scrollIntoView({
		behavior: store.scrollSmooth ? "smooth" : undefined,
		block: "center",
	});
}

function createPendingReply(
	channel,
	message,
	shouldMention,
	showMentionToggle
) {
	if (typeof showMentionToggle === "undefined")
		showMentionToggle = channel.guild_id !== null; // DM channel showMentionToggle = false

	dispatcher.dispatch({
		type: "CREATE_PENDING_REPLY",
		channel,
		message,
		shouldMention: shouldMention && !store.noPing,
		showMentionToggle,
	});

	setTimeout(scrollToReplyingMsg, 100);
}

function deletePendingReply(data) {
	dispatcher.dispatch({
		type: "DELETE_PENDING_REPLY",
		channelId: getChannelId(),
		...data,
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

	const lastIndex =
		messages.findIndex((msg) => msg.id === replyingToMessage) || 0;
	if (event.key === "ArrowUp") messageIndex = lastIndex + 1;
	else if (event.key === "ArrowDown") messageIndex = lastIndex - 1;

	if (messageIndex > messages.length) messageIndex = messages.length;
	if (messageIndex < 0) return deletePendingReply();

	deletePendingReply({
		[QRSymbol]: true,
	});
	createPendingReply(
		getCurrentChannel(),
		messages[messageIndex],
		!dontReplyStore.has(getChannelId())
	);
}

function onMentionChange({ channelId, shouldMention }) {
	if (shouldMention) dontReplyStore.delete(channelId);
	else dontReplyStore.add(channelId);
}

// purely for separation from the top level madness above
export function onLoad() {
	if (store.scroll === undefined) store.scroll = true;
	if (store.scrollSmooth === undefined) store.scrollSmooth = true;
	if (store.noPing === undefined) store.noPing = false;

	dispatcher.subscribe("CHANNEL_SELECT", channelSelect);
	dispatcher.subscribe("CREATE_PENDING_REPLY", onCreatePendingReply);
	dispatcher.subscribe("DELETE_PENDING_REPLY", onDeletePendingReply);
	dispatcher.subscribe("SET_PENDING_REPLY_SHOULD_MENTION", onMentionChange);

	window.addEventListener("keydown", keyDown);

}

export function onUnload() {
	dispatcher.unsubscribe("CHANNEL_SELECT", channelSelect);
	dispatcher.unsubscribe("CREATE_PENDING_REPLY", onCreatePendingReply);
	dispatcher.unsubscribe("DELETE_PENDING_REPLY", onDeletePendingReply);
	dispatcher.unsubscribe("SET_PENDING_REPLY_SHOULD_MENTION", onMentionChange);

	window.removeEventListener("keydown", keyDown);
}