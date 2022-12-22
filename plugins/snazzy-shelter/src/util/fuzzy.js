// SOURCE https://github.com/sink-cord-archive/cc-plugins/blob/master/plugins/cumstain/util/fuzzy.js

import Fuse from "fuse.js";

const fuseOptions = {
	// tune threshold to find the "sweet-spot" between accuracy and fuzziness
	threshold: 0.5,
	// (partial) globbing go br|rr
	useExtendedSearch: true,
	keys: ["name", "author", "description"],
};

export default (set, search) =>
	!search || search === ""
		? set
		: new Fuse(set, fuseOptions)
				.search(search)
				.map((searchResult) => searchResult.item);
