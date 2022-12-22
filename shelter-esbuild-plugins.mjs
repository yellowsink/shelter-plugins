export const shelterSolidResolver = () => ({
	name: "shelter-solid-resolver",
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
});