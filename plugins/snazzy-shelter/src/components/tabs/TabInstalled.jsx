import ThemeCard from "../cards/ThemeCard";
import InstallBar from "../InstallBar";
import fuzzy from "../../util/fuzzy";
import SearchBar from "../SearchBar";
import CompatFilterDropdown from "../CompatFilterDropdown";
import { NoThemes } from "../splashes";

const {
	solid: { createSignal },
	plugin: {store}
} = shelter;

export default (props) => {
	const [search, setSearch] = createSignal("");
	const [filterMode, setFilterMode] = createSignal(0);

	return (
		<>
			<InstallBar />

			<div class="ysink_stain_search_row">
				<SearchBar query={search()} onChange={setSearch} />
				<CompatFilterDropdown filterMode={filterMode()} setFilterMode={setFilterMode} />
			</div>

			{store.themes.length === 0 ? (
				<NoThemes goToStore={() => props.goTo(1)} />
			) : (
				<div class="ysink_stain_cardcontainer">
					{fuzzy(store.themes, search())
						.filter(
							(t) =>
								filterMode() === 0 ||
								(filterMode() === 1 && !t.compat) ||
								(filterMode() === 2 && t.compat)
						)
						.map((theme) => (
							<ThemeCard {...{ key: theme.url, theme }} />
						))}
				</div>
			)}
		</>
	);
};
