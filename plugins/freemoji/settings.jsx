const {
	plugin: { store },
	ui: { Header, HeaderTags },
} = shelter;

export default () => (
	<>
		<Header tag={HeaderTags.H3}>Emoji Size (defaults to 64 if invalid)</Header>
		<input
			type="text"
			placeholder="64"
			value={Number.isSafeInteger(store.size) ? store.size : ""}
			onInput={(e) => (store.size = parseInt(e.target.value))}
		/>
	</>
);
