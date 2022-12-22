import Monaco from "simple-react-monaco";

import { persist } from "@cumcord/pluginData";

import { ErrorBoundary } from "@cumcord/ui/components";

const saveCss = (v) => (persist.store.quickCSS = v);
const saveCssDebounced = _.debounce(saveCss, 250);

export default () => {
	const [css, setCss] = React.useState(persist.ghost.quickCSS);

	return (
		<ErrorBoundary>
			<div
				style={{
					maxWidth: "60vw",
					height: "40rem",
					resize: "vertical",
					overflow: "hidden",
					paddingBottom: ".5rem",
				}}
			>
				<Monaco
					value={css ?? ""}
					valOut={(v) => {
						setCss(v);
						saveCssDebounced(v);
					}}
					lang="css"
					theme="Dracula"
					width="100%"
					height="100%"
					otherCfg={{
						automaticLayout: true,
					}}
				/>
			</div>
		</ErrorBoundary>
	);
};
