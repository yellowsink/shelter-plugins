import { clearCache } from "../../util/cachingFetcher";

const {
	Button, Text
} = shelter.ui;

export default () => (
	<>
		<Button class="ysink_stain_button" grow onClick={clearCache}>
			Clear fetch cache
		</Button>
		<Text>@ me if you need other things for debug purposes :)</Text>
	</>
);
