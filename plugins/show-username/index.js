const {
  flux: {
    dispatcher,
    stores: {
      GuildMemberStore,
      ChannelStore,
      SelectedChannelStore,
      RelationshipStore,
    },
  },
  util: { getFiber, reactFiberWalker },
  observeDom,
} = shelter;

function addUsername(e) {
  if (e?.dataset?.ysink_su) return;
  e.dataset.ysink_su = true;

  const msg = reactFiberWalker(getFiber(e), "message", true).pendingProps
    ?.message;

  const authorUsername = msg.author?.username;
  const authorId = msg?.author?.id;

  const { type, guild_id: guildId } = ChannelStore.getChannel(msg?.channel_id);

  // type = 0: Guild, 1: DM
  const nick = type
    ? RelationshipStore.getNickname(authorId)
    : GuildMemberStore.getNick(guildId, authorId);

  if (!nick || !authorUsername) return;

  e.firstElementChild.textContent += ` (${authorUsername})`;
}

// MESSAGE_CREATE: a new message is sent
// CHANNEL_SELECT: the user switches servers
// LOAD_MESSAGES_SUCCESS: new messages in viewport
// UPDATE_CHANNEL_DIMENSIONS: the user scrolls back down perhaps
const TRIGGERS = [
  "MESSAGE_CREATE",
  "CHANNEL_SELECT",
  "LOAD_MESSAGES_SUCCESS",
  "UPDATE_CHANNEL_DIMENSIONS",
];

function onDispatch(payload) {
  // ignore MESSAGE_CREATEs from other channels
  if (
    payload.type === "MESSAGE_CREATE" &&
    payload.channelId !== SelectedChannelStore.getChannelId()
  )
    return;

  const unObserve = observeDom("[id^=message-username-]", (element) => {
    unObserve();
    addUsername(element);
  });

  // don't leave this forever, just in case!
  setTimeout(unObserve, 500);
}

export function onLoad() {
  for (const t of TRIGGERS) dispatcher.subscribe(t, onDispatch);
}

export function onUnload() {
  for (const t of TRIGGERS) dispatcher.unsubscribe(t, onDispatch);
}
