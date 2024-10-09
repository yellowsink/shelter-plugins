const { createSignal } = shelter.solid;

let cancel = false;

const Hand = (props) => (
	<div
		style={{
			height: props.height,
			width: "2px",
			background: props.col ?? "var(--interactive-normal)",
			position: "absolute",
			left: "50%",
			bottom: "50%",
			transform: `translateX(-1px) translateY(50%) rotate(${
				360 * props.frac
			}deg) translateY(-50%)`,
		}}
	/>
);

function Clock() {
	const [time, setTime] = createSignal(new Date());

	(async () => {
		while (!cancel) {
			setTime(new Date());
			// this is a bit often but hey who cares
			await new Promise((res) => setTimeout(res, 250));
		}
	})();

	const hour = () => time().getHours() % 12;
	const min = () => time().getMinutes();
	const sec = () => time().getSeconds();

	return (
		<div style={{ margin: "13px", display: "flex", position: "relative" }}>
			{/* circle */}
			<div
				style={{
					border: "2px solid var(--interactive-normal)",
					"border-radius": "999999px",
					flex: 1,
					"aspect-ratio": 1,
				}}
			/>

			<Hand frac={hour() / 12} height="9px" />
			<Hand frac={min() / 60} height="14px" />
			<Hand frac={sec() / 60} height="16px" col="red" />
		</div>
	);
}

let clock;

export async function onLoad() {
	const sel =
		'nav > ul > [class*="scroller"] > [class*="tutorialContainer"]:first-child';

	let homeBtn;

	while (!(homeBtn = document.querySelector(sel)))
		await new Promise((res) => setTimeout(res, 250));
	clock = <Clock />;

	homeBtn.parentElement.insertBefore(clock, homeBtn.nextElementSibling);
}

export function onUnload() {
	clock?.remove();
	cancel = true;
}
