import { highlighter } from "../shiki";
import { currentTheme } from "../themes/themeProcessor";

const {
	solid: { createMemo, Show },
	ui: { niceScrollbarsClass },
	plugin: { store },
} = shelter;

export default (props) => {
	const highlighted = createMemo(() => {
		const html = highlighter()?.codeToHtml(
			props.children,
			props.lang,
			currentTheme(),
		);

		if (!html) return;

		const n = new DOMParser()
			.parseFromString(html, "text/html")
			.getElementsByTagName("pre")[0];

		if (!n) return;

		n.classList.add(niceScrollbarsClass());

		props.bgColOut?.(n.style.backgroundColor);

		try {
			if (store.nums)
				n.querySelectorAll(".line").forEach((e, i) =>
					e.prepend(<span class="lnum">{i}</span>),
				);
		} catch (e) {
			console.error(e);
		}

		return n;
	});

	return (
		<Show when={!highlighted()} fallback={highlighted()}>
			<pre class={`shiki ${niceScrollbarsClass()}`}>
				<code textContent={props.children} />
			</pre>
		</Show>
	);
};
