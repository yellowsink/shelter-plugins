/*
const {
	flux: {dispatcher},
	observeDom
} = shelter;

// hidpi users / macos users die lol
const getZoomLevel = () => devicePixelRatio;

const scaledNaturalDimensions = el => [el.naturalWidth / getZoomLevel(), el.naturalHeight / getZoomLevel()];

// if the image has not been scaled down by Discord
function isImgFullSize(elem) {
	// appears to work for an img i tested at 44px and 90(ish)% zoom :)
	const thres = (elem.naturalHeight / 100) * 2; // 2%

	return Math.abs(elem.height - scaledNaturalDimensions(elem)[0]) <= thres;
}

function crispify(el) {
	if (getZoomLevel() === 1) return;
	if (!isImgFullSize(el)) return;

	if (!el.parentElement.matches("[class*=imageWrapper][style]")) return;

	// discord has an old electron bleh
	el.style.imageRendering = "pixelated"; // "crisp-edges";
	el.style.height = "100%";
	el.style.width = "100%";

	const peStyle = el.parentElement.style;
	peStyle.setProperty("--scaler", getZoomLevel())
	//peStyle.height = `${el.naturalHeight / getZoomLevel()}px`;
	//peStyle.width = `${el.naturalWidth / getZoomLevel()}px`;
	const [scaledNX, scaledNY] = scaledNaturalDimensions(el);
	peStyle.height = `calc(${scaledNY}px / var(--scaler))`
	peStyle.width = `calc(${scaledNX}px / var(--scaler))`

	console.log(`crispified image of size ${scaledNX}x${scaledNY}`)
}

function handleDispatch() {
	const unobs = observeDom("img", (e) => {
		crispify(e);
		unobs();
	});

	// hanging observes are the performance devil!!!
	setTimeout(unobs, 250);
}

export const onLoad = () => dispatcher.subscribe("UPDATE_CHANNEL_DIMENSIONS", handleDispatch);
export const onUnload = () => dispatcher.unsubscribe("UPDATE_CHANNEL_DIMENSIONS", handleDispatch);*/

// TODO: lmao discord's chromium is too old and this whole charade doesn't crispen the image
// old chromium renders the image small first THEN upscales it
// modern ff & chrome will re-render the image niiiice n big (or in this case, just a lil bit big)
export const onUnload = () => {};
