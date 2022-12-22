import { persist } from "@cumcord/pluginData";
import { useNest } from "@cumcord/utils";
import fetchRepo from "../../util/fetchRepo";

import { ErrorBoundary } from "@cumcord/ui/components";
import ThemeCard from "../cards/ThemeCard";
import SearchBar from "../SearchBar";
import fuzzy from "../../util/fuzzy";
import CompatFilterDropdown from "../CompatFilterDropdown";
import { NoRepos } from "../splashes";
import useRerender from "../../util/useRerender";
import VirtualScroller from "../VirtualScroller";
import { scrollBarThin } from "../../WPMODULES";

const getRepos = () => Promise.all(persist.ghost.repos.map(fetchRepo));

const getThemes = async () => (await getRepos()).flatMap((r) => r.themes);

const arrayEquals = (a, b) =>
	Array.isArray(a) &&
	Array.isArray(b) &&
	a.length === b.length &&
	a.every((val, index) => val === b[index]);

export default ({ goTo }) => {
	useNest(persist, false, (_, { path }) => path[0] === "repos");

	const [search, setSearch] = React.useState("");

	// if this state differs from persist.ghost.repos, then a change has occurred, so update
	const [rawRepos, setRawRepos] = React.useState([]);

	const [themes, setThemes] = React.useState(undefined);
	const [filterMode, setFilterMode] = React.useState(0);
	React.useEffect(() => {
		if (!arrayEquals(rawRepos, persist.ghost.repos) || !themes) {
			setRawRepos(persist.ghost.repos);

			getThemes().then(setThemes);
		}
	});

	// see the same line in TabInstalled for why I am forced to do this
	const deleteHook = useRerender();

	return (
		<ErrorBoundary>
			<div className="ysink_stain_search_row">
				<SearchBar query={search} onChange={setSearch} />
				<CompatFilterDropdown {...{ filterMode, setFilterMode }} />
			</div>

			{persist.ghost.repos.length === 0 ? (
				<NoRepos goToRepos={() => goTo(2)} />
			) : (
				<VirtualScroller
					className={scrollBarThin}
					height="50rem"
					keySel={(t) => t.url}
					items={fuzzy(
						_.uniqBy(themes ?? [], (t) => t.url),
						search
					).filter(
						(t) =>
							filterMode === 0 ||
							(filterMode === 1 && !t.compat) ||
							(filterMode === 2 && t.compat)
					)}
				>
					{(theme) => <ThemeCard {...{ theme, deleteHook }} gap=".5rem" />}
				</VirtualScroller>
			)}
		</ErrorBoundary>
	);
};
