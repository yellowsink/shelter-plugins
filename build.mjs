import {createHash} from "crypto";
import {readdir, readFile, writeFile, rm} from "fs/promises";
import {existsSync} from "fs";
import {build} from "esbuild";
import {solidPlugin} from "esbuild-plugin-solid";

const MD5 = (data) => createHash("md5").update(data).digest("hex").toString();

if (existsSync("dist"))
	await rm("dist", {recursive: true});

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
		minify: false,
		plugins: [
			solidPlugin(),
			{
				name: "solid-shelter-resolver",
				setup(build) {
					build.onResolve({filter: /solid-js(?:\/web)?/}, ({path}) => ({
						path,
						namespace: "shltr-res-ns"
					}));
					build.onLoad({filter: /.*/, namespace: "shltr-res-ns"}, ({ path }) => ({
						contents: `module.exports = shelter.${path === "solid-js/web" ? "solidWeb" : "solid"}`,
						loader: "js"
					}));
				}
			}
		],
		globalName: "e"
	});

	await writeFile(
		outfile,
		(await readFile(outfile)).toString().replace(/var e\s*=/, "")
	);

	const manifest = (await readFile(`plugins/${plug}/plugin.json`)).toString();

	await writeFile(
		`dist/${plug}/plugin.json`,
		manifest.replace(
			"<HASH_PLACEHOLDER>",
			MD5((await readFile(outfile)).toString())
		)
	)
}