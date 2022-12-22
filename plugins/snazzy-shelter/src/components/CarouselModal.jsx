import MediaCarousel from "./MediaCarousel";

const { openModal, ModalRoot, ModalHeader, ModalBody, ModalSizes } = shelter.ui;

export default (media) => openModal((close) => (
	<ModalRoot size={ModalSizes.MEDIUM}>
		<ModalHeader close={close}/>

		<ModalBody>
			<div style={{marginBottom: "1rem"}}>
				<MediaCarousel media={media}/>
			</div>
		</ModalBody>
	</ModalRoot>
));
