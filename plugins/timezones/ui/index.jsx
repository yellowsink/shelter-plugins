import UserMan from "./UserMan";

const {
	plugin: { store },
	ui: { SwitchItem, Button, LinkButton, openModal },
} = shelter;

export default () => (
	<>
		<SwitchItem value={store.tz} onChange={(v) => (store.tz = v)}>
			Show users' local time (parses timezones from bios)
		</SwitchItem>
		<SwitchItem
			disabled={!store.tz}
			value={store.tzdb}
			onChange={(v) => (store.tzdb = v)}
		>
			Prefer to query{" "}
			<LinkButton href="https://timezonedb.catvibers.me/?client_mod=shelter">
				TZDB
			</LinkButton>
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
		<Button onClick={() => openModal(UserMan)} grow>
			Manage manual user TZs
		</Button>
	</>
);
