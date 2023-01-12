// TODO
const SearchBar = (props) => (
	<input
		type="text"
		class={props.class}
		value={props.query}
		onInput={(e) => props.onQueryChange(e.target.value)}
		placeholder={props.placeholder}
	/>
);

export default (props) => (
	<SearchBar
		class="ysink_stain_searchbar"
		query={props.query}
		onQueryChange={props.onChange}
		placeholder="Search themes..."
		size={SearchBar.Sizes.MEDIUM}
	/>
);
