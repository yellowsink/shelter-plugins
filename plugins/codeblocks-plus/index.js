import css from "./styles.sass";

const {
  plugin: { store },
  ui: {injectCss}
} = shelter;

store.nums ??= true;

const transients = [
  injectCss(css)
]

export const onUnload = () => transients.forEach(p => p())

export {default as settings} from "./components/settings";
