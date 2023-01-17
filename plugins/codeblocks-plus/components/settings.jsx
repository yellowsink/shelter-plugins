import { currentTheme, includedThemes } from "../themes/themeProcessor";
import Codeblock from "./Codeblock";

const {
	plugin: { store },
	ui: { Header, HeaderTags, SwitchItem },
} = shelter;

const preview = `const btn = document.getElementById("btn");
let count = 0;
function render() {
  btn.innerText = \`Count: \${count}\`;
}
btn.addEventListener("click", () => {
  // Count from 1 to 10.
  if (count < 10) {
    count += 1;
    render();
  }
});`;

export default () => {
	const includedThemeOptions = includedThemes.map(({ name, url }) => ({
		value: url,
		label: name,
	}));

	return (
		<>
			<div style="margin-bottom: .5rem">
				<Codeblock lang="js">{preview}</Codeblock>
			</div>

			<Header tag={HeaderTags.H4}>Select theme</Header>
			<select
				value={currentTheme()}
				onInput={(e) => (store.theme = e.target.value)}
			>
				{includedThemeOptions.map((opt) => (
					<option value={opt.value}>{opt.label}</option>
				))}
			</select>

			<SwitchItem
				value={store.nums}
				onChange={(v) => (store.nums = v)}
				hideBorder
			>
				Show line numbers
			</SwitchItem>
		</>
	);
};
