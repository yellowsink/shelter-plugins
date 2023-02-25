const {
	flux: { dispatcher },
	observeDom,
} = shelter;

// hidpi users / macos users die lol
const getZoomLevel = () => devicePixelRatio;

const scaledNaturalDimensions = (el) => [
	el.naturalWidth / getZoomLevel(),
	el.naturalHeight / getZoomLevel(),
];

const roundScaledNaturalDimensions = (el) =>
	scaledNaturalDimensions(el).map(Math.round);

// if the image has not been scaled down by Discord
function isImgFullSize(elem) {
	const scaledNH = scaledNaturalDimensions(elem)[1];

	// appears to work for an img i tested at 44px and 90(ish)% zoom :)
	const thres = (scaledNH / 100) * 2; // 2%

	return Math.abs(elem.height - scaledNH) <= thres;
}

function crispify(el) {
	if (getZoomLevel() === 1) return;
	if (!isImgFullSize(el)) return;

	if (!el.parentElement.matches("[class*=imageWrapper][style]")) return;

	const [nx, ny] = roundScaledNaturalDimensions(el);

	el.style.height = "100%";
	el.style.width = "100%";

	el.src = el.src.replace(
		/\?width=\d+&height=\d+/,
		`?width=${nx}&height=${ny}`,
	);

	el.parentElement.style.height = `${ny / getZoomLevel()}px`;
	el.parentElement.style.width = `${nx / getZoomLevel()}px`;
}

function handleDispatch() {
	const unobs = observeDom("img", (e) => {
		crispify(e);
		unobs();
	});

	// hanging observes are the performance devil!!!
	setTimeout(unobs, 250);
}

export const onLoad = () =>
	dispatcher.subscribe("UPDATE_CHANNEL_DIMENSIONS", handleDispatch);
export const onUnload = () =>
	dispatcher.unsubscribe("UPDATE_CHANNEL_DIMENSIONS", handleDispatch);
