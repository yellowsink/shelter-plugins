(function(exports) {

"use strict";

//#region plugins/crisp-img/index.js
const { flux: { dispatcher }, util: { getFiber }, observeDom } = shelter;
const getZoomLevel = () => devicePixelRatio;
const realImageSize = (el) => {
	const s = getFiber(el).pendingProps.style;
	return [s?.width, s?.height];
};
function imgNeedsCrispening(elem) {
	const realHeight = realImageSize(elem)[1];
	if (realHeight === undefined) return false;
	const thres = realHeight / 100 * 2;
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
	setTimeout(unobs, 250);
}
const onLoad = () => dispatcher.subscribe("UPDATE_CHANNEL_DIMENSIONS", handleDispatch);
const onUnload = () => dispatcher.unsubscribe("UPDATE_CHANNEL_DIMENSIONS", handleDispatch);

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
return exports;
})({});