import { webpackChunk, createApi } from "@cumjar/websmack";
import { DISCORD_APP_ID } from "./cfg";

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
		: mod.fetchAssetIds(DISCORD_APP_ID, [url, undefined]);.then((v) => v[0]);
