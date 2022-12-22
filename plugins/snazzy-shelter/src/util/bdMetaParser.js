// SOURCE https://github.com/sink-cord-archive/cc-plugins/blob/master/plugins/cumstain/util/bdMetaParser.js

// cleaned up from https://github.com/Cr3atable/Powerconvert/blob/master/index.js
// thanks ~~Creatable~~ (toonlink!) :)

const splitRegex = /[^\S\r\n]*?\r?\n[^\S\r\n]*?\*[^\S\r\n]?/;
const escapedAtRegex = /^\\@/;

function tryJSON(data) {
	try {
		return JSON.parse(data);
	} catch {}
}

function parseOldMeta(fileContent) {
	const meta = fileContent.split("\n")[0];

	const metaData = meta.substring(
		meta.lastIndexOf("//META") + 6,
		meta.lastIndexOf("*//")
	);

	const parsed = tryJSON(metaData);

	if (!parsed) throw new Error("META could not be parsed.");
	if (!parsed.name) throw new Error("META missing name data.");

	return parsed;
}

function parseNewMeta(fileContent) {
	const block = fileContent.split("/**", 2)[1].split("*/", 1)[0];
	const out = {};
	let field = "";
	let accum = "";

	for (const line of block.split(splitRegex)) {
		if (line.length === 0) continue;

		if (line.charAt(0) === "@" && line.charAt(1) !== " ") {
			if (field !== "") out[field] = accum;

			const l = line.indexOf(" ");
			field = line.substr(1, l - 1);
			accum = line.substr(l + 1);
		} else
			accum += ` ${line.replace("\\n", "\n").replace(escapedAtRegex, "@")}`;
	}

	out[field] = accum.trim();
	return out;
}

export default (fileContent) => {
	const firstLine = fileContent.split("\n")[0];

	if (firstLine.includes("//META")) return parseOldMeta(fileContent);
	if (firstLine.includes("/**")) return parseNewMeta(fileContent);

	throw new Error("META was not found.");
};