const {
	solid: { createSignal },
	solidWeb: { Dynamic },
	ui: { Text, Divider },
} = // @ts-expect-error
shelter;

type Props = { items: { text: string; component }[] };

export default (props: Props) => {
	const [current, goTo] = createSignal(0);

	return (
		<div class="ysink_stain_tabbar_root">
			<div class="ysink_stain_tabbar">
				{props.items.map((e, i) => (
					<button
						class={
							"ysink_stain_button" +
							(i === current() ? " ysink_stain_selected" : "")
						}
						onClick={() => goTo(i)}
					>
						<Text>{e.text}</Text>
					</button>
				))}
			</div>

			<Divider mt=".5rem" mb=".5rem" />

			<div class="ysink_stain_tabbar_content">
				<Dynamic component={props.items[current()].component} goTo={goTo} />
			</div>
		</div>
	);
};
