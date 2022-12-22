import fetchTheme from "../util/fetchTheme";
import { loadTheme } from "../util/themeLoadUtil";

const {
  ui: { Button },
	solid: {createSignal}
} = shelter;

const showToast = console.log;

export default () => {
	const [urlInput, setUrlInput] = createSignal("");

  return (
    <div className="ysink_stain_row">
      {/*TODO*/}
      {/*<TextInput*/}
	    <input
        className="ysink_stain_input"
        placeholder="Theme import URL"
        type="text"
        value={urlInput()}
        onInput={(e) => setUrlInput(e.target.value)}
      />

      <Button
        class="ysink_stain_button"
        onClick={() => {
          fetchTheme(urlInput()).then(
            async (t) => {
              await loadTheme(t);
              showToast({
                title: `Loaded theme ${t.name}`,
                duration: 5000,
              });
              setUrlInput("");
            },
            () =>
              showToast({
                title: "Failed to fetch theme - check URL",
                duration: 5000,
              })
          );
        }}
      >
        Install
      </Button>
    </div>
  );
};
