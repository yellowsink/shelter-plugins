const {
	flux: { storesFlat: { ThemeStore } },
	solid: { onCleanup },
	util: { createSubscription },
} = shelter;

// take links and return iframes!
// async because song.link
const matchers: [
	RegExp,
	(...matches: string[]) => Promise<HTMLIFrameElement | undefined>,
][] = [
	// Apple Music
	[
		/(https?):\/\/music.apple.com\/([a-z]+\/album|playlist\/.*)/,
		(protocol, path) =>
			Promise.resolve(
				(
					<iframe
						allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
						height={
							path.includes("playlist") ? 450 : path.includes("i=") ? 175 : 450
						}
						style="width:100%;max-width:660px;overflow:hidden;border-radius:10px; border:none;"
						sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
						src={`${protocol}://embed.music.apple.com/${path}`}
					/>
				) as HTMLIFrameElement,
			),
	],

	// Deezer track
	[
		/(https?):\/\/(?:www.)?deezer.com\/[a-z]+\/(track|album|playlist\/\d+)/,
		(protocol, path) => {
			onCleanup(() => console.log("yes, solid does clean this up. i checked."));

			// reactively get the discord theme
			const currentTheme = createSubscription(
				ThemeStore,
				(store: any) => store.getState().theme as string,
			);

			return Promise.resolve(
				(
					<iframe
						title="deezer-widget"
						src={`${protocol}://widget.deezer.com/widget/${currentTheme}/${path}`}
						width="100%"
						height={path.includes("track") ? 150 : 200}
						style="border:none;max-width:660px"
						allow="encrypted-media; clipboard-write"
					/>
				) as HTMLIFrameElement,
			);
		},
	],
	// song.link
	//[], // TODO
	// TIDAL, sadly only albums and playlists
	[
		/(https?):\/\/listen.tidal.com\/(album|playlist)\/([a-z0-9-]+)/,
		(protocol, type, id) =>
			Promise.resolve(
				(
					<iframe
						src={`${protocol}://embed.tidal.com/${type}s/${id}?coverInitially=true&disableAnalytics=true`}
						style="width:100%;height:300px;max-width:660px"
					/>
				) as HTMLIFrameElement,
			),
	],
];

export function onUnload() {
	// required // TODO
}
