import css from "./styles.sass";
import replacer from "./replacer";

const {
  plugin: { store },
  ui: {injectCss}
} = shelter;

store.nums ??= true;

const transients = [
  injectCss(css),
  replacer(),
]

export const onUnload = () => transients.forEach(p => p())

export {default as settings} from "./components/settings";
