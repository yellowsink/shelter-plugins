const {
	flux: { storesFlat: { ThemeStore, SelectedChannelStore }, dispatcher },
	solid: { onCleanup },
	util: { createSubscription, getFiber, reactFiberWalker },
	observeDom,
	ui: { ReactiveRoot },
} = shelter;

// set to "" to disable proxying where it is used
const CORS_PROXY_PREFIX = "https://shcors.uwu.network/";

const iframeFromAmUrl = (path: string) =>
	(
		<iframe
			allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
			height={path.includes("playlist") ? 450 : path.includes("i=") ? 175 : 450}
			style="width:100%;max-width:660px;overflow:hidden;border-radius:10px; border:none;"
			sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
			// replace /_/ to deal with geo. links
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

const iframeFromBandcampInfo = (
	type: "a" | "t",
	trackId?: string,
	albumId?: string,
) =>
	(
		<iframe
			style={`border: 0; width: 100%; max-width: 600px; height: ${
				type === "a" ? 250 : 42
			}px;`}
			src={`https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=${
				type === "a" ? "large" : "small"
			}/bgcol=${
				(ThemeStore as any).getState().theme === "dark" ? "000000" : "ffffff"
			}/linkcol=0687f5/${
				type === "a" ? "artwork=small" : "track=" + trackId
			}/transparent=true/`}
		/>
	) as HTMLIFrameElement;

async function scrapeBandcamp(
	url: string,
): Promise<["a" | "t", string | undefined, string | undefined]> {
	const docu = await fetch(CORS_PROXY_PREFIX + url)
		.then((r) => r.text())
		.then((t) => new DOMParser().parseFromString(t, "text/html"));

	const pageProps = (
		docu.querySelector("meta[name=bc-page-properties]") as HTMLMetaElement
	)?.content;
	if (!pageProps) return;
	const { item_type, item_id } = JSON.parse(pageProps);

	if (item_type === "a") return ["a", undefined, item_id];

	if (item_type === "t") {
		// using .href will resolve the url with discord as a base, hell no
		const albumUrl = docu.getElementById("buyAlbumLink").getAttribute("href");
		const resolvedUrl = new URL(albumUrl, url).href;

		return ["t", item_id, (await scrapeBandcamp(resolvedUrl))[2]];
	}
}

const iframeFromBandcampUrl = async (url: string) =>
	iframeFromBandcampInfo(...(await scrapeBandcamp(url)));

// take links and return iframes!
// async because song.link
const matchers: [
	RegExp,
	(
		...matches: string[]
	) => Promise<HTMLIFrameElement | undefined> | HTMLIFrameElement | undefined,
][] = [
	[
		/https?:\/\/(?:geo\.)?music\.apple\.com\/([a-z]+\/(?:album|playlist)\/.*)/,
		(_full, path) => iframeFromAmUrl(path),
	],

	[
		/https?:\/\/(?:www\.)?deezer\.com\/[a-z]+\/((?:track|album|playlist)\/\d+)/,
		(_full, path) => iframeFromDeezerUrl(path),
	],

	[/https?:\/\/.+\.bandcamp\.com\/(?:album|track)\/.+/, iframeFromBandcampUrl],

	// song.link
	[
		/https?:\/\/(?:song|album)\.link\/.+/,
		async (full) => {
			try {
				// this needs a cors proxy
				const apiRes = await fetch(
					`${CORS_PROXY_PREFIX}https://api.song.link/v1-alpha.1/links?url=url${full}`,
				).then((r) => r.json());

				// TODO: other platforms: spotify, bcamp, am, deezer, scloud, ytm

				for (const [platform, fn] of [
					["appleMusic", iframeFromAmUrl],
					["deezer", iframeFromDeezerUrl],
					["bandcamp", iframeFromBandcampUrl],
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
		/https?:\/\/listen\.tidal\.com\/(album|playlist)\/([a-z0-9-]+)/,
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
						accessory.insertAdjacentElement("afterend", iframe);
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
