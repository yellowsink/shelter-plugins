const {
	plugin: { store },
	observeDom,
	flux: { dispatcher, storesFlat: { SelectedChannelStore } },
	util: { reactFiberWalker, getFiber },
	ui: { Header, HeaderTags, TextBox },
} = shelter;

if (store.instance === "invidious.slipfox.xyz" && !store.sfmigrate) {
	store.sfmigrate = 1;
	store.instance = null;
}
store.instance ??= "inv.n8pjl.ca";

// taken and improved from more-embeds

const TRIGGERS = [
	"MESSAGE_CREATE",
	"MESSAGE_UPDATE",
	"UPDATE_CHANNEL_DIMENSIONS",
];

// prevent duplicate embeds when sending by mutexing on the payload
// idk quite why this works but it does!
const extraMutex = new WeakSet();

function handleDispatch(payload) {
	if (!store.instance) return;
	if (
		(payload.type === "MESSAGE_CREATE" || payload.type === "MESSAGE_UPDATE") &&
		payload.message.channel_id !== SelectedChannelStore.getChannelId()
	)
		return;

	if (extraMutex.has(payload)) return;
	extraMutex.add(payload);

	const unobs = observeDom(
		`[id^="chat-messages-"] article:not([data-invidivizer])`,
		(e) => {
			// mutex
			e.dataset.invidivizer = "1";
			unobs();

			const found = reactFiberWalker(getFiber(e), "embed", true)?.memoizedProps
				?.embed?.url;
			if (
				!(typeof found === "string") ||
				!found.startsWith("https://www.youtube.com")
			)
				return;

			const match = found.match(/v=([a-zA-Z0-9-_]+)/);
			if (!match?.[1]) return;

			e.style.display = "none";
			e.insertAdjacentElement(
				"afterend",
				<iframe
					style="border: 0; width: 100%; max-width: 600px; aspect-ratio: 16/9"
					src={`https://${store.instance}/embed/${match[1]}`}
					allow="fullscreen"
				/>,
			);
		},
	);

	setTimeout(unobs, 1000); // dangling
}

for (const t of TRIGGERS) dispatcher.subscribe(t, handleDispatch);

export function onUnload() {
	for (const t of TRIGGERS) dispatcher.unsubscribe(t, handleDispatch);
}

export const settings = () => (
	<>
		<Header tag={HeaderTags.H3}>Invidious Instance</Header>
		<TextBox
			placeholder="my.instance.com"
			value={store.instance}
			onInput={(v) => (store.instance = v)}
		/>
	</>
);
