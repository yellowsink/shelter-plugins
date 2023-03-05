const {
	flux: { dispatcher },
	util: { getFiber },
	observeDom,
} = shelter;

// hidpi users / macos users die lol
const getZoomLevel = () => devicePixelRatio;

const realImageSize = (el) => {
	const s = getFiber(el).pendingProps.style;
	return [s?.width, s?.height];
};

// if the image has not been scaled down by Discord
function imgNeedsCrispening(elem) {
	const realHeight = realImageSize(elem)[1];
	if (realHeight === undefined) return false;

	// appears to work for an img i tested at 44px and 90(ish)% zoom :)
	const thres = (realHeight / 100) * 2; // 2%

	return Math.abs(elem.height - realHeight) <= thres;
}

function crispify(el) {
	if (getZoomLevel() === 1) return;
	if (!imgNeedsCrispening(el)) return;

	if (!el.parentElement.matches("[class*=imageWrapper][style]")) return;

	const [realW, realH] = realImageSize(el);

	el.style.height = "100%";
	el.style.width = "100%";

	el.src = el.src.replace(/\?width=\d+&height=\d+/, ``);

	el.parentElement.style.height = `${realH / getZoomLevel()}px`;
	el.parentElement.style.width = `${realW / getZoomLevel()}px`;
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
