import MonacoSolid from "@uwu/monaco-solid";

const saveCssDebounced = _.debounce((v) => (store.quickCSS = v), 250);

const {
	solid: { createSignal },
	plugin: {store}
} = shelter;

export default () => {
	const [css, setCss] = createSignal(store.quickCSS);

  return (
    <div
      style={{
        maxWidth: "60vw",
        height: "40rem",
        resize: "vertical",
        overflow: "hidden",
        paddingBottom: ".5rem",
      }}
    >
      <MonacoSolid
        value={css() ?? " "}
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
  );
};
