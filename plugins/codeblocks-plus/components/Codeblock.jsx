import Shiki from "./Shiki";

const {
  solid: {createSignal},

} = shelter;

export default (props) => {
  const [cooldown, setCooldown] = createSignal(false);

  // <Shiki /> passes this back up
  const [bgCol, setBgCol] = createSignal();

  return (
    <div class="ys_cbp_wrap" style={{ "background-color": bgCol() }}>
      <div class="ys_cbp_row">
        <div>{props.lang?.toUpperCase()}</div>
        <button
          disabled={cooldown()}
          onclick={async () => {
            if (window.DiscordNative)
              DiscordNative.clipboard.copy(props.childen)
            else
              await navigator.clipboard.writeText(props.children);

            if (cooldown()) return;
            setCooldown(true);
            setTimeout(() => setCooldown(false), 2000);
          }}
        >
          {cooldown() ? "Copied!" : "Copy"}
        </button>
      </div>

      <Shiki {...props} bgColOut={setBgCol} />
    </div>
  );
};
