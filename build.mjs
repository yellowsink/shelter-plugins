import { createHash } from "crypto";
import { readdir, readFile, writeFile, rm } from "fs/promises";
import { existsSync } from "fs";
import { build } from "esbuild";
import { solidPlugin } from "esbuild-plugin-solid";
import { sassPlugin } from "esbuild-sass-plugin-ysink";
import { shelterSolidResolver } from "./shelter-esbuild-plugins.mjs";

const MD5 = (data) => createHash("md5").update(data).digest("hex").toString();

if (existsSync("dist")) await rm("dist", { recursive: true });

for (const plug of await readdir("plugins")) {
	const outfile = `dist/${plug}/plugin.js`;
	let entryPoint = `plugins/${plug}/index.js`;

	// jsx
	if (!existsSync(entryPoint) && existsSync(entryPoint + "x"))
		entryPoint += "x";

	await build({
		entryPoints: [entryPoint],
		bundle: true,
		outfile: outfile,
		minify: (process.env.NODE_ENV ?? "production") === "production",
		plugins: [
			solidPlugin(),
			sassPlugin({ style: "compressed", sourceMap: false, type: "css-text" }),
			shelterSolidResolver(),
		],
		globalName: "e",
	});

	await writeFile(
		outfile,
		(await readFile(outfile)).toString().replace(/var e\s*=/, ""),
	);

	const manifest = (await readFile(`plugins/${plug}/plugin.json`)).toString();

	await writeFile(
		`dist/${plug}/plugin.json`,
		manifest.replace(
			"<HASH_PLACEHOLDER>",
			MD5((await readFile(outfile)).toString()),
		),
	);
}
