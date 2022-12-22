const {
	solid: {createEffect},
	plugin: {store},
	ui: {injectCSS}
} = shelter;

export default () => {
	const modify = injectCSS(store.quickCSS || " ");

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