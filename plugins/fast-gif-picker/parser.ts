// literally just stolen verbatim from better-gif-load

const { store } = shelter.plugin;

// Parses media.tenor.com & c.tenor.com
const mediaTenorLinkRegex =
	/^https:\/\/(?:media\d?|c)\.tenor\.com(?:\/m)?\/(?<code>.{11}).{5}\/(?<name>.*?)\./i;
// Parses giphy links
const giphyLinkRegex =
	/^https:\/\/media\d?\.giphy\.com\/media\/.*?\/(?<code>.*?)\/giphy/i;
// Parses discord proxy links
const mediaProxyParser =
	/^https:\/\/images-ext-\d\.discordapp.net\/external\/.*?\.*?\/(?<protocol>.*?)\/(?<rest>.*?)$/i;

// TENOR CODEC GUIDE
//   found by changing the media_filter parameter in tenor search API
// webp - AAAAx (unlimited res)
// tinywebp - AAAA1 (200px)
// nanowebp - AAAA2 (90px)

export enum Quality {
	Default,
	Reasonable,
	Horrible,
}

export const qualities: Record<Quality, object> = {
	[Quality.Default]: {
		giphy: "giphy",
		tenor: "AAAAx", // webp
		cap: 300,
	},
	[Quality.Reasonable]: {
		giphy: "200",
		tenor: "AAAA1", // tinywebp
		cap: 200,
	},
	[Quality.Horrible]: {
		giphy: "giphy-preview",
		tenor: "AAAA2", // nanowebp
		cap: 90,
	},
};

function getCleanLink(link: string) {
	if (mediaProxyParser.test(link)) {
		const { protocol, rest } = link.match(mediaProxyParser)!.groups!;
		return `${decodeURIComponent(protocol)}://${decodeURIComponent(rest)}`;
	} else return link;
}

export function parseLink(
	link: string,
	sizes?: [width: number, height: number],
) {
	const quality = qualities[store.quality];
	const url = new URL(link);
	if (!url) return link;

	const cleanLink = getCleanLink(link);
	if (mediaTenorLinkRegex.test(cleanLink)) {
		const { code, name } = cleanLink.match(mediaTenorLinkRegex)!.groups!;
		return `https://c.tenor.com/${code}${quality.tenor}/${name}.webp`;
	} else if (giphyLinkRegex.test(cleanLink)) {
		const { code } = cleanLink.match(giphyLinkRegex)!.groups!;
		return `https://i.giphy.com/media/${code}/${quality.giphy}.webp`;
	} else if (
		url.hostname.endsWith(".discordapp.net") ||
		url.hostname === "cdn.discordapp.com"
	) {
		url.searchParams.set("format", "webp");
		url.searchParams.set("animated", "true");

		if (sizes) {
			const smaller = Math.min(...sizes);
			url.searchParams.set(
				"width",
				String(Math.floor((sizes[0] / smaller) * quality.cap)),
			);
			url.searchParams.set(
				"height",
				String(Math.floor((sizes[1] / smaller) * quality.cap)),
			);
		}
		return url.toString();
	} else return link;
}
