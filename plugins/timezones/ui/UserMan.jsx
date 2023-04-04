import { tzKeywords } from "../timezones";

const {
	flux: { storesFlat },
	plugin: { store },
	ui: {
		Button,
		ButtonLooks,
		ButtonSizes,
		Header,
		HeaderTags,
		TextBox,
		Text,
		Divider,
	},
	solid: { createSignal },
} = shelter;

export default (goTo) => {
	const [newUid, setNewUid] = createSignal("");
	const [newTz, setNewTz] = createSignal("");

	const deleteUser = (id) => {
		delete store.savedTzs[id];
		store.savedTzs = { ...store.savedTzs };
	};

	const tryAdd = () => {
		if (
			newUid() in store.savedTzs ||
			newUid().match(/\d{17,19}/)?.[0] !== newUid()
		)
			return;

		const parsedTz = tzKeywords.includes(newTz())
			? newTz()
			: Number.isFinite(parseFloat(newTz()))
			? parseFloat(newTz())
			: undefined;

		if (parsedTz === undefined) return;

		store.savedTzs = {
			...store.savedTzs,
			[newUid()]: parsedTz,
		};
		setNewUid("");
		setNewTz("");
	};

	return (
		<>
			<Button onClick={() => goTo(0)} grow>
				Back to settings
			</Button>

			<div style="display: grid; grid-template-columns: 1fr 1fr auto; margin-top: 1rem">
				<Header tag={HeaderTags.H4}>User</Header>
				<Header tag={HeaderTags.H4}>TZ or UTC offset</Header>
				<div />

				{Object.entries(store.savedTzs).map(([id, tz]) => (
					<>
						<div>{storesFlat.UserStore.getUser(id)?.tag ?? id}</div>
						<div>{tz}</div>
						<Button
							look={ButtonLooks.OUTLINED}
							size={ButtonSizes.TINY}
							grow
							onClick={() => deleteUser(id)}
						>
							Delete
						</Button>
					</>
				))}
			</div>

			<Divider mt />

			<div style="display: flex; margin: .5rem 0">
				<TextBox value={newUid()} onInput={setNewUid} placeholder="User ID" />
				<TextBox
					value={newTz()}
					onInput={setNewTz}
					placeholder="TZ or offset"
				/>
				<Button grow style={{ height: "auto" }} onClick={tryAdd}>
					Add
				</Button>
			</div>
			<Text>
				You must enter a valid user ID, and either a numeric offset from UTC or
				a recognised TZ.
			</Text>
		</>
	);
};
