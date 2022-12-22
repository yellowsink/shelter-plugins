const { Text } = shelter.ui;

// TODO
const SmallMediaCarousel = (props) => <div>WIP</div>;

export default (props) => (
	<div class="ysink_stain_carousel">
		{props.media ? (
			<SmallMediaCarousel
				items={(typeof props.media === "string" ? [props.media] : props.media).map((m) => ({
					type: 1,
					src: m,
				}))}
				autoplayInterval={5000}
			/>
		) : (
			<div class="ysink_stain_noimg">
				<Text class="ysink_stain_noimgtxt">No Image</Text>
				{/* this is to get the height right, nothing else. */}
				<SmallMediaCarousel items={[{ type: 1, src: "" }]} />
			</div>
		)}
	</div>
);
