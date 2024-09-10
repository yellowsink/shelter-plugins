const {
	plugin: { store },
	ui: { SwitchItem },
} = shelter;

export default () => (
	<>
		<SwitchItem value={store.scroll} onChange={(v) => (store.scroll = v)}>
			Scroll to keep the replying-to message on-screen
		</SwitchItem>
		<SwitchItem
			disabled={!store.scroll}
			value={store.scrollSmooth}
			onChange={(v) => (store.scrollSmooth = v)}
		>
			Scroll smoothly
		</SwitchItem>
		<SwitchItem value={store.noPing} onChange={(v) => (store.noPing = v)}>
			Don't ping the original author of your reply by default
		</SwitchItem>
	</>
);
