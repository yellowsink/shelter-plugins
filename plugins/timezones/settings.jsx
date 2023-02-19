const {
	plugin: { store },
	ui: { SwitchItem },
} = shelter;

export default () => (
	<>
		<SwitchItem value={store.tz} onChange={(v) => (store.tz = v)}>
			Show users' local time (parses timezones from bios & notes)
		</SwitchItem>
		<SwitchItem
			disabled={!store.tz}
			value={store.tzdb}
			onChange={(v) => (store.tzdb = v)}
		>
			Prefer to query{" "}
			<a
				href="https://timezonedb.catvibers.me/?client_mod=shelter"
				target="_blank"
			>
				TZDB
			</a>
		</SwitchItem>
		<SwitchItem value={store.abs} onChange={(v) => (store.abs = v)}>
			Show times in absolute ISO form (YYYY-MM-DD HH:MM:SS) every time, instead
			of relative times
		</SwitchItem>
		<SwitchItem
			disabled={!store.abs}
			value={store.absUtc}
			onChange={(v) => (store.absUtc = v)}
		>
			Show absolute times in UTC, not local timezone
		</SwitchItem>
	</>
);
