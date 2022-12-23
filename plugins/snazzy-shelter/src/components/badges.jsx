const badge = (url, type) => () =>
	<img src={url} class={`ysink_stain_badge ysink_stain_${type}`} />;

export const BDBadge = badge(
	"https://betterdiscord.app/resources/branding/logo_small.svg",
	"bd"
);

export const CCBadge = badge(
	"https://raw.githubusercontent.com/Cumcord/assets/main/logo/filled.svg",
	"cc"
);

// discord component remake
export const TextBadge = props => (
	<div
		class={props.class}
		style={{
			"border-radius": "9999px",
			"background-color": props.color,
			color: "white",
			"font-size": ".8rem",
			padding: ".1rem .3rem",
			"text-transform": "uppercase",
			"font-weight": "bold"
		}}
	>{props.text}</div>
)