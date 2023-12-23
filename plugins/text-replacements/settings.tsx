import type { Component } from "solid-js";

const {
	openModal,
	Header,
	HeaderTags,
	Button,
	ButtonSizes,
	ButtonLooks,
	ButtonColors,
	Divider,
	ModalRoot,
	ModalBody,
	ModalHeader,
	ModalConfirmFooter,
	ModalSizes,
	TextBox,
	Text,
	LinkButton,
	openConfirmationModal,
} = shelter.ui;

const { createSignal } = shelter.solid;

// @ts-expect-error
const { store } = shelter.plugin;

const openEditDialog = (idx: number, isAdd?: boolean) =>
	openModal((props) => {
		const initial = store.regexes[idx];
		const [name, setName] = createSignal<string>(initial[0]);
		const [regexp, setRegexp] = createSignal<string>(initial[1]);
		const [flags, setFlags] = createSignal<string>(initial[2]);
		const [replace, setReplace] = createSignal<string>(initial[3]);

		return (
			<ModalRoot size={ModalSizes.MEDIUM}>
				<ModalHeader close={props.close}>
					{isAdd ? "Adding" : "Editing"} "{name()}"
				</ModalHeader>
				<ModalBody>
					<Header tag={HeaderTags.H3}>Name</Header>
					<TextBox placeholder="Name" value={name()} onInput={setName} />

					<Header tag={HeaderTags.H3}>Regular Expression Matcher</Header>
					<TextBox placeholder="Regex" value={regexp()} onInput={setRegexp} />
					<Text style="margin: .25rem 0 .75rem; display: block">
						Struggling? You can test your regexes{" "}
						<LinkButton href="https://regexr.com">at regexr.com</LinkButton>,
						and learn regex at{" "}
						<LinkButton href="https://regexlearn.com">
							regexlearn.com
						</LinkButton>
						.
					</Text>

					<Header tag={HeaderTags.H3}>Regex Flags</Header>
					<TextBox placeholder="Flags" value={flags()} onInput={setFlags} />

					<Header tag={HeaderTags.H3}>Replacement String</Header>
					<TextBox
						placeholder="Replacement"
						value={replace()}
						onInput={setReplace}
					/>
				</ModalBody>
				<ModalConfirmFooter
					close={props.close}
					onCancel={() => {
						store.regexes.splice(idx, 1);
						// save!
						store.regexes = store.regexes;
					}}
					onConfirm={() => {
						store.regexes[idx] = [name(), regexp(), flags(), replace()];
						// save!
						store.regexes = store.regexes;
					}}
					confirmText="Save"
					cancelText="Delete"
				/>
			</ModalRoot>
		);
	});

const add = () =>
	openEditDialog(store.regexes.push(["", "", "gi", ""]) - 1, true);

function swap(idx1: number, idx2: number) {
	const tmp = store.regexes[idx1];
	store.regexes[idx1] = store.regexes[idx2];
	store.regexes[idx2] = tmp;

	// save
	store.regexes = store.regexes;
}

export const settings: Component = () => (
	<>
		<div style="display: grid; align-items: baseline; grid-template-columns: 1fr auto auto auto auto; column-gap: .5rem">
			{/* columns: name, up down buttons, edit, delete */}

			<Header tag={HeaderTags.H4}>Name</Header>
			<Header tag={HeaderTags.H4} class="ys-ts-span2">
				Order
			</Header>
			<Header tag={HeaderTags.H4} class="ys-ts-span2">
				Actions
			</Header>

			{store.regexes.map(([name, regexp, flags, replace], idx) => (
				<>
					<div>{name}</div>

					<Button
						aria-label={`Move replacement "${name}" up one`}
						disabled={idx === 0}
						look={ButtonLooks.OUTLINED}
						size={ButtonSizes.ICON}
						grow
						onClick={() => swap(idx, idx - 1)}
					>
						▲
					</Button>

					<Button
						aria-label={`Move replacement "${name}" down one`}
						disabled={idx + 1 === store.regexes.length}
						look={ButtonLooks.OUTLINED}
						size={ButtonSizes.ICON}
						grow
						onClick={() => swap(idx, idx + 1)}
					>
						▼
					</Button>

					<Button
						aria-label={`Edit replacement "${name}"`}
						look={ButtonLooks.OUTLINED}
						size={ButtonSizes.ICON}
						grow
						style={{ "font-family": "emoji" }}
						onClick={() => openEditDialog(idx)}
					>
						✏
					</Button>

					<Button
						aria-label={`Delete replacement "${name}"`}
						look={ButtonLooks.OUTLINED}
						size={ButtonSizes.ICON}
						color={ButtonColors.RED}
						style={{ "font-family": "emoji" }}
						grow
						onClick={() =>
							openConfirmationModal({
								type: "danger",
								header: () => `Delete ${name}?`,
								body: () =>
									"You won't be able to recover any replacements you delete.",
								confirmText: "Delete",
							}).then(
								() => {
									store.regexes.splice(idx, 1);
									// save!
									store.regexes = store.regexes;
								},
								() => {},
							)
						}
					>
						🗑
					</Button>
				</>
			))}
		</div>

		<Divider mt mb />

		<Button grow onClick={add}>
			Add replacement
		</Button>
	</>
);
