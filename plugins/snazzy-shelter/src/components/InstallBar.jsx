import fetchTheme from "../util/fetchTheme";
import { loadTheme } from "../util/themeLoadUtil";

const {
	ui: { Button, ButtonSizes, showToast, TextBox },
	solid: { createSignal },
} = shelter;

export default () => {
	const [urlInput, setUrlInput] = createSignal("");

	return (
		<div class="ysink_stain_row">
			<TextBox
				value={urlInput()}
				onInput={setUrlInput}
				placeholder="Theme import URL"
			/>

			<Button
				class="ysink_stain_button"
				size={ButtonSizes.MEDIUM}
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
							}),
					);
				}}
			>
				Install
			</Button>
		</div>
	);
};
