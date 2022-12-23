//import { createVirtualizer } from "@tanstack/solid-virtual";

interface VirtualScrollerProps<TItem, TKey> {
  items: TItem[];
  children: (v: TItem) => any;
  keySel: (v: TItem) => TKey;
  height: number;
  class: string;
}

/*const _ = <TItem, TKey>(props: VirtualScrollerProps<TItem, TKey>) => {
  let parentRef: HTMLDivElement;

  const virt = createVirtualizer({
    // ew
    get count() {
      return props.items.length;
    },
    getScrollElement: () => parentRef,
    estimateSize: () => 64,
    getItemKey: (i) => props.keySel(props.items[i])
  });

  return (
    <div
      ref={parentRef}
      style={{ "overflow-y": "auto", height: props.height }}
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
}*/

const {For} = window["shelter"].solid;

export default (props: VirtualScrollerProps<any, any>) => (
  <div
    style={{ "overflow-y": "auto", height: props.height }}
    class={props.class}
  >
    <div
      style={{
        width: "100%",
        position: "relative",
      }}
    >
      <For each={props.items}>
        {(item) => props.children(item)}
      </For>
    </div>
  </div>
)