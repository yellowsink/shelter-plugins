// a large chunk of this code is taken from Nexpid's 'better-gif-load', with permission.
// uhhhhhh yea :)

import { parseLink, Quality } from "./parser";

const {
	flux: {
		storesFlat: { UserSettingsProtoStore },
	},
	ui: { Text, Button, ButtonColors, ButtonSizes },
	plugin: { store },
} = shelter;

const {
	flux: { intercept },
	patcher: { after },
	observeDom,
} = shelter.plugin.scoped;

store.quality ??= Quality.Reasonable;

export const settings = () => (
	<>
		<div style="display: flex; justify-content: space-between">
			<Text>Quality:</Text>

			{Object.keys(Quality)
				.filter((k) => Number.isNaN(parseInt(k)))
				.map((k) => {
					const active = store.quality === Quality[k];

					return (
						<Button
							size={ButtonSizes.TINY}
							color={active ? ButtonColors.BRAND : ButtonColors.SECONDARY}
							onClick={() => (store.quality = Quality[k])}
							grow
						>
							{k}
						</Button>
					);
				})}
		</div>
	</>
);

// patch searches for gifs and browsing
intercept((payload) => {
	switch (payload.type) {
		case "GIF_PICKER_QUERY_SUCCESS":
			for (const item of payload.items)
				item.src = item.gif_src = parseLink(item.src, [
					item.width,
					item.height,
				]);

			break;

		case "GIF_PICKER_TRENDING_FETCH_SUCCESS":
			for (const item of payload.trendingCategories)
				item.src = parseLink(item.src);

			const tgp = payload.trendingGIFPreview;
			if (tgp)
				tgp.src = tgp.gif_src = parseLink(tgp.src, [tgp.width, tgp.height]);

			break;
	}
});

// patch favourite gifs
after("getFullState", UserSettingsProtoStore, (_args, ret) => {
	const gifs = ret[2]?.proto?.favoriteGifs?.gifs;

	if (gifs)
		for (const k in gifs) {
			const gif = gifs[k];
			gif.src = parseLink(gif.src, [gif.width, gif.height]);
		}

	return ret;
});

// fix up <video> elements into <img> elements
observeDom(
	"#gif-picker-tab-panel [class*=result__] > video:not(.ysink-patched)",
	(e: HTMLVideoElement) => {
		e.replaceWith(
			(
				<img
					src={e.src}
					alt=""
					class="ysink-patched"
					width={e.width}
					height={e.height}
				/>
			) as HTMLImageElement,
		);
	},
);
