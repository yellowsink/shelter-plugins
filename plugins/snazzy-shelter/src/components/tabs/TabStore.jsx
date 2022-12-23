import fetchRepo from "../../util/fetchRepo";

import ThemeCard from "../cards/ThemeCard";
import SearchBar from "../SearchBar";
import fuzzy from "../../util/fuzzy";
import CompatFilterDropdown from "../CompatFilterDropdown";
import { NoRepos } from "../splashes";
import VirtualScroller from "../VirtualScroller";

const {
	solid: {createSignal, createResource},
	plugin: {store},
	ui: {niceScrollbarsClass}
} = shelter;

const getRepos = () => Promise.all(store.repos.map(fetchRepo));

const getThemes = () => getRepos().then((rs) => rs.flatMap((r) => r.themes));

export default (props) => {
	const [search, setSearch] = createSignal("");
	const [filterMode, setFilterMode] = createSignal(0);

	const [themes] = createResource(() => store.repos, getThemes);

	return (
		<>
			<div class="ysink_stain_search_row">
				<SearchBar query={search()} onChange={setSearch} />
				<CompatFilterDropdown filterMode={filterMode()} setFilterMode={setFilterMode} />
			</div>

			{store.repos.length === 0 ? (
				<NoRepos goToRepos={() => props.goTo(2)} />
			) : (
				<VirtualScroller
					class={niceScrollbarsClass()}
					height="50rem"
					keySel={(t) => t.url}
					items={fuzzy(
						_.uniqBy(themes() ?? [], (t) => t.url),
						search()
					).filter(
						(t) =>
							filterMode() === 0 ||
							(filterMode() === 1 && !t.compat) ||
							(filterMode() === 2 && t.compat)
					)}
				>
					{(theme) => <ThemeCard theme={theme} gap=".5rem" />}
				</VirtualScroller>
			)}
		</>
	);
};
