// SOURCE https://github.com/sink-cord-archive/cc-plugins/blob/master/plugins/cumstain/util/friendlyUtils.js

import fetchRepo from "./fetchRepo";
import fetchTheme from "./fetchTheme";
import { loadTheme } from "./themeLoadUtil";

const { plugin: {store}} = shelter;

async function verifyRepo(repo) {
	try {
		await fetchRepo(repo);
		return true;
	} catch {
		return false;
	}
}

export async function addRepo(repo, ok, err) {
	if (!repo.endsWith("/")) repo += "/";

	if (store.repos.includes(repo)) {
		err("You already have this repo!");
		return false;
	}

	if (!(await verifyRepo(repo))) {
		err("Repo was invalid");
		return false;
	}

	store.repos = [...store.repos, repo];
	ok("Added repo");
	return true;
}

const themeExists = (url) => store.themes.some((t) => t.url === url);

export async function addTheme(url, ok, err) {
	if (themeExists(url)) return err("Theme is already installed!");
	const theme = await fetchTheme(url).catch(err);
	if (!theme) return;

	loadTheme(theme).then(ok, err);
}
