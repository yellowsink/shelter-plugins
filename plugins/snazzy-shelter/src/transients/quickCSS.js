const {
	solid: {createEffect},
	plugin: {store},
	ui: {injectCss}
} = shelter;

export default () => {
	const modify = injectCss(store.quickCSS || " ");

	let cancel;

	createEffect(() => {
    if (!cancel)
			modify(store.quickCSS || " ");
  });

	return () => {
		modify();
		cancel = true;
	};
}