import { createVirtualizer } from "@tanstack/solid-virtual";

// from @tanstack/virtual-core
const defaultMeasureElement = (element, instance) =>
  (element as Element).getBoundingClientRect()[instance.options.horizontal ? 'width' : 'height'];

interface VirtualScrollerProps<TItem, TKey> {
  items: TItem[];
  children: (v: TItem) => any;
  keySel: (v: TItem) => TKey;
  height: number;
  class: string;
}

export default <TItem, TKey>(props: VirtualScrollerProps<TItem, TKey>) => {
  let parentRef: HTMLDivElement;

  const virt = createVirtualizer({
    // ew
    get count() {
      return props.items.length;
    },
    getScrollElement: () => parentRef,
    estimateSize: () => 64,
    getItemKey: (i) => props.keySel(props.items[i]),
    // add a .5rem equivalent padding
    measureElement: (e, i) => defaultMeasureElement(e, i) + 8
  });

  return (
    <div
      ref={parentRef}
      style={{ overflowY: "auto", height: props.height }}
      class={props.class}
    >
      <div
        style={{
          height: virt.getTotalSize() + "px",
          width: "100%",
          position: "relative",
        }}
      >
        {virt.getVirtualItems().map((vrow) => (
          <div
            ref={e => queueMicrotask(() => vrow.measureElement(e))}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              //height: vrow.size,
              transform: `translateY(${vrow.start}px)`
            }}
          >
            {props.children(props.items[vrow.index])}
          </div>
        ))}
      </div>
    </div>
  );
};
