import MonacoSolid from "@uwu/monaco-solid";

const {
	plugin: { store },
	ui: { injectCss }
} = shelter;

const cssFunc = injectCss(store.css);

store.css ??= "";

const debouncedApply = _.debounce(
	() => cssFunc?.(store.css),
	250
);

export const onUnload = () => cssFunc();

export function settings() {
	return (
		<>
			<MonacoSolid
				value={store.css}
				lang="css"
				valOut={(v) => {
					store.css = v;
					debouncedApply();
				}}
				theme="Dracula"
				width="100%"
				height="30rem"
				otherCfg={{
					automaticLayout: true
				}}
				/*noCDN={monaco}*/
			/>
			{/* this sucks but i legitimately just cannot be arsed anymore */}
			<style>{`[class*="_mroot"] [class*="_modal"]{width:880px}`}</style>
		</>
	);
}