import { highlighter } from "../shiki";
import {currentTheme} from "../themes/themeProcessor";

const {
  solid: { Show },
} = shelter;

export default (props) => (
  <Show
    when={highlighter()}
    fallback={
      <pre>
        <code>{props.children}</code>
      </pre>
    }
  >
    <div
      innerHTML={highlighter()?.codeToHtml(
        props.children,
        props.lang,
        currentTheme()
      )}
    />
  </Show>
);
