import { showPickerModal } from "./TzPicker";

const {
	flux: { storesFlat: { UserStore } },
	plugin: { store },
	ui: {
		Button,
		ButtonLooks,
		ButtonSizes,
		ButtonColors,
		Header,
		HeaderTags,
		TextBox,
		Text,
		ModalRoot,
		ModalHeader,
		ModalSizes,
		ModalBody,
		ModalFooter,
	},
	solid: { createSignal },
} = shelter;

export default (props) => {
	const [newUid, setNewUid] = createSignal("");
	const [newTz, setNewTz] = createSignal("");

	const deleteUser = (id) => {
		delete store.savedTzs[id];
		store.savedTzs = { ...store.savedTzs };
	};

	const validation = () =>
		!newUid()
			? ""
			: newUid() in store.savedTzs
			? "This user already has a timezone set"
			: newUid().match(/\d{17,19}/)?.[0] !== newUid()
			? "That is not a valid user ID"
			: !newTz()
			? "Please enter a time zone"
			: undefined;

	const tryAdd = () => {
		if (validation() !== undefined) return;

		const parsedTz = newTz();
		/* = tzKeywords.includes(newTz())
			? newTz()
			: Number.isFinite(parseFloat(newTz()))
				? parseFloat(newTz())
				: undefined;*/

		if (parsedTz === undefined) return;

		store.savedTzs = {
			...store.savedTzs,
			[newUid()]: parsedTz,
		};
		setNewUid("");
		setNewTz("");
	};

	return (
		<ModalRoot size={ModalSizes.MEDIUM}>
			<ModalHeader close={props.close}>User Manager</ModalHeader>
			<ModalBody>
				<div style="display: grid; align-items: baseline; grid-template-columns: 1fr 1fr auto auto; row-gap: .15rem">
					<Header tag={HeaderTags.H4}>User</Header>
					<Header tag={HeaderTags.H4}>TZ or UTC offset</Header>
					<div />
					<div />

					{Object.entries(store.savedTzs).map(([id, tz]) => (
						<>
							<div>{UserStore.getUser(id)?.tag ?? id}</div>
							<div>{tz}</div>

							<Button
								aria-label={`edit timezone for ${
									UserStore.getUser(id)?.username
								}`}
								style={{ "margin-right": ".75rem" }}
								look={ButtonLooks.OUTLINED}
								size={ButtonSizes.TINY}
								grow
								onClick={() =>
									showPickerModal(
										(tz) =>
											(store.savedTzs = {
												...store.savedTzs,
												[id]: tz,
											}),
										undefined,
										tz,
									)
								}
							>
								Edit
							</Button>

							<Button
								aria-label={`delete timezone for ${
									UserStore.getUser(id)?.username
								}`}
								look={ButtonLooks.OUTLINED}
								size={ButtonSizes.TINY}
								color={ButtonColors.RED}
								grow
								onClick={() => deleteUser(id)}
							>
								Delete
							</Button>
						</>
					))}
				</div>
			</ModalBody>
			<ModalFooter>
				<div style="display: flex; margin-bottom: .5rem">
					<TextBox value={newUid()} onInput={setNewUid} placeholder="User ID" />
					<Button
						onClick={() => showPickerModal(setNewTz)}
						grow
						style={{
							height: "auto",
							"flex-basis": "75%",
							"margin-right": "20px",
						}}
					>
						{newTz() || "Pick a timezone"}
					</Button>
					<Button
						grow
						style={{ height: "auto" }}
						onClick={tryAdd}
						disabled={validation() !== undefined}
					>
						Add
					</Button>
				</div>

				{!!validation() && (
					<>
						<span style="color: var(--text-danger)">{validation()}</span>
						<br />
					</>
				)}
				You must enter a valid user ID, and either a numeric offset from UTC or
				a recognised TZ.
			</ModalFooter>
		</ModalRoot>
	);
};
