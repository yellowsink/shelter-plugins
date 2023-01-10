import { highlighter } from "../shiki";
import { currentTheme } from "../themes/themeProcessor";

const {
  solid: { createMemo },
  ui: { niceScrollbarsClass },
} = shelter;

export default (props) => {
  const highlighted = createMemo(() => {
    const html = highlighter()?.codeToHtml(
      props.children,
      props.lang,
      currentTheme()
    );

    const n = new DOMParser()
      .parseFromString(html, "text/html")
      .getElementsByTagName("pre")[0];

    if (!n) return;

    n.classList.add(niceScrollbarsClass());

    props.bgColOut?.(n.style.backgroundColor);

    return n;
  });

  return highlighter() ? (
    highlighted()
  ) : (
    <pre>
      <code>{props.children}</code>
    </pre>
  );
};
