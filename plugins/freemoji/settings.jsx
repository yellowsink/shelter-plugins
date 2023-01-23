const {
	plugin: { store },
	ui: { Header, HeaderTags, TextBox },
} = shelter;

export default () => (
	<>
		<Header tag={HeaderTags.H3}>Emoji Size (defaults to 64 if invalid)</Header>
		<TextBox
			placeholder="64"
			value={Number.isSafeInteger(store.size) ? store.size : ""}
			onInput={(val) => (store.size = parseInt(val))}
		/>
	</>
);
