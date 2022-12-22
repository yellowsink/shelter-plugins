import { persist } from "@cumcord/pluginData";
import { useNest } from "@cumcord/utils";

import { ErrorBoundary } from "@cumcord/ui/components";
import ThemeCard from "../cards/ThemeCard";
import InstallBar from "../InstallBar";
import fuzzy from "../../util/fuzzy";
import SearchBar from "../SearchBar";
import CompatFilterDropdown from "../CompatFilterDropdown";
import { NoThemes } from "../splashes";
import useRerender from "../../util/useRerender";

export default ({ goTo }) => {
	useNest(persist, false, (_, { path }) => path[0] === "themes");

	const [search, setSearch] = React.useState("");
	let [filterMode, setFilterMode] = React.useState(0);

	/*\
	|*| This is literally a React bug.
	|*| The component rerenders correctly and returns correct elements
	|*| but effects just dont run because haha its not like those are meant to run on every rerender
	|*| pushing to the dom is an effect.
	|*| your guess for why effects are brokey is as good as mine.
	|*| This is the only viable workaround.
	|*| Hopefully when discord updates from react 17.0.2 to react 18 thisll be fixed?
	\*/
	const deleteHook = useRerender();

	return (
		<ErrorBoundary>
			<InstallBar />

			<div className="ysink_stain_search_row">
				<SearchBar query={search} onChange={setSearch} />
				<CompatFilterDropdown {...{ filterMode, setFilterMode }} />
			</div>

			{persist.ghost.themes.length === 0 ? (
				<NoThemes goToStore={() => goTo(1)} />
			) : (
				<div className="ysink_stain_cardcontainer">
					{fuzzy(persist.ghost.themes, search)
						.filter(
							(t) =>
								filterMode === 0 ||
								(filterMode === 1 && !t.compat) ||
								(filterMode === 2 && t.compat)
						)
						.map((theme) => (
							<ThemeCard {...{ key: theme.url, theme, deleteHook }} />
						))}
				</div>
			)}
		</ErrorBoundary>
	);
};
