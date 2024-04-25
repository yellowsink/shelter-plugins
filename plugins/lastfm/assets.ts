import { DISCORD_APP_ID } from "./cfg";

/*
example exchange made by the real fetchAssetIds function:

###
POST https://discord.com/api/v9/applications/1107251687984472144/external-assets HTTP/2
> Content-Type: application/json
> headers: go here

{"urls":["https://coverartarchive.org/release/d131c1ab-ffe1-4f68-941d-c1c238a91f50/front"]}

###
HTTP/2 200
> headers: go here

[
    {
        "url": "https://coverartarchive.org/release/d131c1ab-ffe1-4f68-941d-c1c238a91f50/front",
        "external_asset_path": "external/BXbyYaCdwy2DMWxTRmsvqVHDvXgf6LQmzgTwVRIBass/https/coverartarchive.org/release/d131c1ab-ffe1-4f68-941d-c1c238a91f50/front"
    }
]
*/

const { post } = shelter.http;

const cache = new Map<string, string | undefined>();

export async function getAsset(url: string) {
	if (cache.has(url)) {
		return cache.get(url);
	}

	const res = await post({
		url: `/applications/${DISCORD_APP_ID}/external-assets`,
		body: { urls: [url] },
		oldFormErrors: false,
	});

	if (res.ok) {
		const path = "mp:" + res.body[0].external_asset_path;
		cache.set(url, path);
		return path;
	}
	cache.set(url, undefined);
}

/*import { webpackChunk, createApi } from "@cumjar/websmack";

const modules = webpackChunk();
const api = modules && createApi([undefined, ...modules]);

//const module = api && api.findByCode("getAssetImage: ");
//const [k] = !module
//	? []
//	: Object.entries(module).find(([, f]) => f.toString().includes("apply("));

const mod = api && api.findByProps("getAssetImage");

export const getAsset = (url: string): Promise<string> =>
	!mod.fetchAssetIds
		? undefined
		: mod.fetchAssetIds(DISCORD_APP_ID, [url, undefined]).then((v) => v[0]);
*/
