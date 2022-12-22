import { ErrorBoundary } from "@cumcord/ui/components";
import { Button, FormText } from "../../WPMODULES";
import { clearCache } from "../../util/cachingFetcher";

export default () => (
	<ErrorBoundary>
		<Button className="ysink_stain_button" onClick={clearCache}>
			Clear fetch cache
		</Button>
		<FormText>@ me if you need other things for debug purposes :)</FormText>
	</ErrorBoundary>
);
