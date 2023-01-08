const {
	flux: {
		dispatcher,
		stores: { GuildMemberStore, ChannelStore, RelationshipStore }
	},
	util: {
		getFiber,
		reactFiberWalker
	},
	observeDom
} = shelter;

function addUsernames() {
	for (const e of document.querySelectorAll("[id^=message-username-]")) {
		if (e?.dataset?.YSINK_SU) continue;
		e.dataset.YSINK_SU = true;

		const msg = reactFiberWalker(getFiber(e), "message", true).pendingProps?.message;
		const authorUsername = msg.author?.username;
		const authorId = msg?.author?.id;
		const { type, guild_id: guildId } = ChannelStore.getChannel(msg?.channel_id);
		// type = 0: Guild, 1: DM
		const nick = type ? RelationshipStore.getNickname(authorId) : GuildMemberStore.getNick(guildId, authorId);

		if (!nick || !authorUsername) continue;

		e.firstElementChild.textContent += ` (${authorUsername})`
	}
}

// MESSAGE_CREATE: a new message is sent
// CHANNEL_SELECT: the user switches servers
// LOAD_MESSAGES_SUCCESS: new messages in viewport
// UPDATE_CHANNEL_DIMENSIONS: the user scrolls back down perhaps
const TRIGGERS = ["MESSAGE_CREATE", "CHANNEL_SELECT", "LOAD_MESSAGES_SUCCESS", "UPDATE_CHANNEL_DIMENSIONS"];

function onDispatch() {
	const unObserve = observeDom("[id^=message-username-]", () => {
		unObserve();
		queueMicrotask(addUsernames);
	});

	// maybe that message was created in another server? don't leave this forever.
	setTimeout(unObserve, 500);
}

export function onLoad() {
	for (const t of TRIGGERS) dispatcher.subscribe(t, onDispatch);
}

export function onUnload() {
	for (const t of TRIGGERS) dispatcher.unsubscribe(t, onDispatch);
}
