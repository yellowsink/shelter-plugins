const {
	plugin: { store },
	observeDom,
	flux: {
		dispatcher,
		storesFlat: { SelectedChannelStore },
	},
	util: { reactFiberWalker, getFiber },
	ui: { Header, HeaderTags, TextBox },
} = shelter;

if (!(store.sfmigrate >= 1) && store.instance === "invidious.slipfox.xyz") {
	store.sfmigrate = 1;
	store.instance = null;
}
if (!(store.sfmigrate >= 2) && store.instance === "inv.n8pjl.ca") {
	store.sfmigrate = 2;
	store.instance = null;
}
// suitable instances must allow embeds, but not autoplay them.
store.instance ??= "inv.nadeko.net";

// taken and improved from more-embeds

const TRIGGERS = [
	"MESSAGE_CREATE",
	"MESSAGE_UPDATE",
	"UPDATE_CHANNEL_DIMENSIONS",
];

function handleDispatch(payload) {
	if (!store.instance) return;
	if (
		(payload.type === "MESSAGE_CREATE" || payload.type === "MESSAGE_UPDATE") &&
		payload.message.channel_id !== SelectedChannelStore.getChannelId()
	)
		return;

	const unobs = observeDom(
		`[id^="chat-messages-"] article:not([data-invidivizer])`,
		(e) => {
			// mutex
			e.dataset.invidivizer = "1";
			unobs();

			// fix duplicates lol
			e.parentElement
				.querySelector(`iframe[src*="${store.instance}"]`)
				?.remove();

			const found = reactFiberWalker(getFiber(e), "embed", true)?.memoizedProps
				?.embed?.url;
			if (
				!(typeof found === "string") ||
				!found.startsWith("https://www.youtube.com")
			)
				return;

			const match = found.match(/v=([a-zA-Z0-9-_]+)/);
			if (!match?.[1]) return;
			const tsMatch = found.match(/t=(?:\d+|(?:\d+m)?\d+s|\d+m)/);

			const embPath = tsMatch?.[0] ? match[1] + "?" + tsMatch[0] : match[1];

			const newSrc = new URL(`https://${store.instance}/embed/${embPath}`);

			// see https://docs.invidious.io/url-parameters/
			newSrc.searchParams.set("autoplay", 0);

			e.style.display = "none";
			e.insertAdjacentElement(
				"afterend",
				<iframe
					style="border: 0; width: 100%; max-width: 600px; aspect-ratio: 16/9"
					src={newSrc.toString()}
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
