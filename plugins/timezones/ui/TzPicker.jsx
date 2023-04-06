import RawPicker from "@uwu/tz-picker";
import { tzKeywords } from "../timezones";

const {
	solid: { createSignal },
	ui: {
		openModal,
		ModalRoot,
		ModalHeader,
		ModalSizes,
		ModalBody,
		ModalConfirmFooter,
		Header,
		HeaderTags,
		Space,
	},
} = shelter;

const Picker = (props) => (
	<RawPicker
		active={props.tz}
		onChoose={props.setTz}
		filter={(n) => tzKeywords.includes(n)}
		col="var(--interactive-normal)"
		colHov="var(--interactive-hover)"
		colActive="var(--interactive-active)"
	/>
);

const PickerModal = (choose, cancel) => (props) => {
	const [choice, setChoice] = createSignal("");

	const actualClose = () => (cancel?.(), props.close?.());

	return (
		<ModalRoot size={ModalSizes.MEDIUM}>
			<ModalHeader close={actualClose}>Pick timezone</ModalHeader>
			<ModalBody>
				<Header tag={HeaderTags.H3}>{choice() || <Space />}</Header>
				<Picker tz={choice()} setTz={setChoice} />
			</ModalBody>
			<ModalConfirmFooter
				close={actualClose}
				disabled={!choice()}
				onConfirm={() => choose?.(choice())}
				confirmText="Choose"
			/>
		</ModalRoot>
	);
};

export const showPickerModal = (choose, cancel) =>
	openModal(PickerModal(choose, cancel));
