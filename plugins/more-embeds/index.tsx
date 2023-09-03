const {
	flux: { storesFlat: { ThemeStore, SelectedChannelStore }, dispatcher },
	solid: { onCleanup },
	util: { createSubscription, getFiber, reactFiberWalker },
	observeDom,
	ui: { ReactiveRoot },
} = shelter;

const iframeFromAmUrl = (path: string) =>
	(
		<iframe
			allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
			height={path.includes("playlist") ? 450 : path.includes("i=") ? 175 : 450}
			style="width:100%;max-width:660px;overflow:hidden;border-radius:10px; border:none;"
			sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
			src={`https://embed.music.apple.com/${path.replace("/_/", "/")}`}
		/>
	) as HTMLIFrameElement;

const iframeFromDeezerUrl = (path: string) =>
	(
		<iframe
			title="deezer-widget"
			src={`https://widget.deezer.com/widget/${
				(ThemeStore as any).getState().theme
			}/${path}`}
			width="100%"
			height={path.includes("track") ? 150 : 200}
			style="border:none;max-width:660px"
			allow="encrypted-media; clipboard-write"
		/>
	) as HTMLIFrameElement;

// take links and return iframes!
// async because song.link
const matchers: [
	RegExp,
	(...matches: string[]) => Promise<HTMLIFrameElement | undefined>,
][] = [
	// Apple Music
	[
		/https?:\/\/(?:geo\.)?music\.apple\.com\/([a-z]+\/(?:album|playlist)\/.*)/,
		(_full, path) => Promise.resolve(iframeFromAmUrl(path)),
	],

	// Deezer track
	[
		/https?:\/\/(?:www\.)?deezer\.com\/[a-z]+\/((?:track|album|playlist)\/\d+)/,
		(_full, path) => Promise.resolve(iframeFromDeezerUrl(path)),
	],
	// song.link
	[
		/https?:\/\/(?:song|album)\.link\/.+/,
		async (full) => {
			debugger;
			try {
				// yes, this is a proxy I run, it proxies requests from `proxy/url` to `https://api.song.link/v1-alpha.1/links?url=url`
				// this is because songlink dont serve cors headers
				// sorry!
				// yes i *could* use this for analytics in theory, but so could the server this plugin is hosted on
				// at the end of the day, software usage implies trust, so by using this plugin you trust that this server isnt malware /shrug
				// no filtering or processing is performed server side in the interests of open source, all the data processing is client side.
				// if your client mod adds fake access control headers to stuff then you could set this back and itd work.
				// -- sink 2023-09-03

				//const apiRes = await fetch(`https://api.song.link/v1-alpha.1/links?url=${full}`).then(r => r.json());
				const apiRes = await fetch(
					`https://songlinkprox.yellowsink-cf.workers.dev/${full}`,
				).then((r) => r.json());

				// TODO: other platforms: spotify, bcamp, am, deezer, scloud, ytm

				for (const [platform, fn] of [
					["appleMusic", iframeFromAmUrl],
					["deezer", iframeFromDeezerUrl],
				] as const)
					if (apiRes.linksByPlatform[platform])
						return fn(apiRes.linksByPlatform[platform].url.split(".com/")[1]);
			} catch (e) {
				console.error(`error fetching data from songlink for ${full}, bailing`);
				return undefined;
			}
		},
	],
	// TIDAL, sadly only albums and playlists
	/*[
		/https?:\/\/listen.tidal.com\/(album|playlist)\/([a-z0-9-]+)/,
		(_full, type, id) =>
			Promise.resolve(
				(
					<iframe
						src={`https://embed.tidal.com/${type}s/${id}?coverInitially=true&disableAnalytics=true`}
						style="width:100%;height:300px;max-width:660px"
					/>
				) as HTMLIFrameElement,
			),
	],*/

	// TODO: bandcamp
];

const TRIGGERS = [
	"MESSAGE_CREATE",
	"MESSAGE_UPDATE",
	"UPDATE_CHANNEL_DIMENSIONS",
];

function handleDispatch(payload: any) {
	if (
		(payload.type === "MESSAGE_CREATE" || payload.type === "MESSAGE_UPDATE") &&
		payload.message.channel_id !== (SelectedChannelStore as any).getChannelId()
	)
		return;

	const unobs = observeDom(
		`[id^="chat-messages-"]:not([data-more-embeds])`,
		async (e) => {
			// mutex
			e.dataset.moreEmbeds = "1";
			unobs();

			// give embeds some time to load (jank)
			// im sorry, link, i know youd hate this.
			if (e.getElementsByTagName(`article`).length === 0)
				await new Promise((res) => setTimeout(res, 1000));

			const accessories = e.getElementsByTagName(`article`);

			// @ts-expect-error TS is on drugs, HTMLCollection is iterable
			for (const accessory of accessories) {
				const embed = reactFiberWalker(getFiber(accessory), "embed", true)
					?.memoizedProps.embed;
				if (embed?.type !== "link" && embed.type !== "article") return;

				for (const [matcher, handler] of matchers) {
					const match = embed.url.match(matcher);
					if (!match) continue;

					const iframe = await handler(...match);
					if (iframe) {
						accessory.style.display = "none";
						accessory.insertAdjacentElement(
							"afterend",
							<ReactiveRoot>{iframe}</ReactiveRoot>,
						);
						break;
					}
				}
			}
		},
	);

	setTimeout(unobs, 1000); // dangling
}

for (const t of TRIGGERS) dispatcher.subscribe(t, handleDispatch);

export function onUnload() {
	for (const t of TRIGGERS) dispatcher.unsubscribe(t, handleDispatch);
}
