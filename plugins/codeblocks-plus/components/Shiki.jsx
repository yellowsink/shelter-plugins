import { highlighter } from "../shiki";
import { currentTheme } from "../themes/themeProcessor";

const {
	solid: { createMemo, Show },
	ui: { niceScrollbarsClass },
} = shelter;

export default (props) => {
	const highlighted = createMemo(() => {
		const html = highlighter()?.codeToHtml(
			props.children,
			props.lang,
			currentTheme(),
		);

		const n = new DOMParser()
			.parseFromString(html, "text/html")
			.getElementsByTagName("pre")[0];

		if (!n) return;

		n.classList.add(niceScrollbarsClass());

		props.bgColOut?.(n.style.backgroundColor);

		return n;
	});

	return (
		<Show
			when={highlighter()}
			fallback={
				<pre class={`shiki ${niceScrollbarsClass()}`}>
					<code>{props.children}</code>
				</pre>
			}
		>
			{highlighted()}
		</Show>
	);
};
