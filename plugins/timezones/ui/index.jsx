import UserMan from "./UserMan";

const {
	plugin: { store },
	ui: {
		SwitchItem,
		Button,
		LinkButton,
		TextBox,
		Header,
		HeaderTags,
		Divider,
		Text,
		openModal,
	},
	solid: { Show },
} = shelter;

export default () => (
	<>
		<SwitchItem value={store.tz} onChange={(v) => (store.tz = v)} hideBorder>
			Show users' local time (parses timezones from bios)
		</SwitchItem>

		<SwitchItem
			disabled={!store.tz}
			value={store.tzdb}
			onChange={(v) => (store.tzdb = v)}
			hideBorder
		>
			Prefer to query{" "}
			<LinkButton href="https://timezonedb.catvibers.me/?client_mod=shelter">
				TZDB
			</LinkButton>
		</SwitchItem>

		<Header tag={HeaderTags.H5}>
			Override the <LinkButton href="//strftime.org">format</LinkButton> of all
			message timestamps
		</Header>
		<TextBox
			value={store.sfmt}
			onInput={(v) => (store.sfmt = v)}
			placeholder="(no override)"
		/>
		<Text style={{ color: "var(--header-secondary)", "font-size": "14px" }}>
			Use <code>%Y-%m-%d %H:%M:%S</code> for ISO-ish.
		</Text>

		<Show
			keyed
			when={store.sfmt}
			fallback={<div style="margin-bottom: 1rem" />}
		>
			<div style="margin-bottom: .5rem" />
			<SwitchItem
				value={store.sutc}
				onChange={(v) => (store.sutc = v)}
				hideBorder
			>
				Show timestamps in UTC, not <span style="font-style: italic">your</span>{" "}
				timezone
			</SwitchItem>
		</Show>

		<Header tag={HeaderTags.H5}>Custom format for relative timestamps</Header>
		<TextBox
			value={store.rfmt}
			onInput={(v) => (store.rfmt = v)}
			placeholder="%H:%M"
		/>
		<Divider mt mb />

		<Button onClick={() => openModal(UserMan)} grow>
			Manage manual user TZs
		</Button>
	</>
);
