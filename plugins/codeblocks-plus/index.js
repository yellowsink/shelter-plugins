import "./shiki";

const {
  plugin: { store },
} = shelter;

store.nums ??= true;

export {default as settings} from "./components/settings";
