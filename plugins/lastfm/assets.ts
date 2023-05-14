import { webpackChunk, createApi } from "@cumjar/websmack";
import { DISCORD_APP_ID } from "./cfg";

const modules = webpackChunk();
const api = modules && createApi([undefined, ...modules]);

const module = api && api.findByCode("getAssetImage: ");
const [k] = !module
	? []
	: Object.entries(module).find(([, f]) => f.toString().includes("apply("));

export const getAsset = (url: string): Promise<string> =>
	!module?.[k]
		? undefined
		: module[k](DISCORD_APP_ID, [url, undefined]).then((v) => v[0]);
