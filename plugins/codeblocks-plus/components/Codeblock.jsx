import Shiki from "./Shiki";
import { highlighter } from "../shiki";

const {
	solid: { createSignal },
} = shelter;

export default (props) => {
	const [cooldown, setCooldown] = createSignal(false);

	// <Shiki /> passes this back up
	const [bgCol, setBgCol] = createSignal();

	const lang = () =>
		!highlighter() || highlighter().getLoadedLanguages().includes(props.lang)
			? props.lang
			: "";

	return (
		<div
			class="ys_cbp_wrap"
			style={{ "background-color": bgCol() ?? "var(--background-tertiary)" }}
		>
			<div class="ys_cbp_row">
				<div>{(lang() ?? "").toUpperCase()}</div>
				<button
					disabled={cooldown()}
					onclick={async () => {
						if (window.DiscordNative)
							DiscordNative.clipboard.copy(props.childen);
						else await navigator.clipboard.writeText(props.children);

						if (cooldown()) return;
						setCooldown(true);
						setTimeout(() => setCooldown(false), 2000);
					}}
				>
					{cooldown() ? "Copied!" : "Copy"}
				</button>
			</div>

			<Shiki lang={lang()} bgColOut={setBgCol}>
				{props.children}
			</Shiki>
		</div>
	);
};
