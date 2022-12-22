import { createVirtualizer } from "@tanstack/solid-virtual";

interface VirtualScrollerProps<TItem> {
	items: TItem[];
	children: (TItem) => any;
	//keySel
	height: number;
	class: string;
}

export default <TItem,>(props: VirtualScrollerProps<TItem>) => {

	let parentRef: HTMLDivElement;

	const rowVirtualiser = createVirtualizer({
		count: props.items.length,
		getScrollElement: () => parentRef,
		estimateSize: () => 500,
		//getItemKey: i => props.keySel(props.items[i])
	});

	return (
		/* OUTER */
		<div
			ref={parentRef}
			style={{ overflowY: "auto", height: props.height }}
			class={props.class}
		>
			{/* INNER */}
			<div
				style={{
					height: rowVirtualiser.getTotalSize(),
					width: "100%",
					position: "relative",
				}}
			>
				{rowVirtualiser.getVirtualItems().map((vrow) => (
					<div
						ref={vrow.measureElement}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: vrow.size,
							transform: `translateY(${vrow.start}px)`,
						}}
					>
						{props.children(props.items[vrow.index])}
					</div>
				))}
			</div>
		</div>
	);
};
