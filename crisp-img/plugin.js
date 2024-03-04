(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // plugins/crisp-img/index.js
  var crisp_img_exports = {};
  __export(crisp_img_exports, {
    onLoad: () => onLoad,
    onUnload: () => onUnload
  });
  var {
    flux: { dispatcher },
    util: { getFiber },
    observeDom
  } = shelter;
  var getZoomLevel = () => devicePixelRatio;
  var realImageSize = (el) => {
    const s = getFiber(el).pendingProps.style;
    return [s?.width, s?.height];
  };
  function imgNeedsCrispening(elem) {
    const realHeight = realImageSize(elem)[1];
    if (realHeight === void 0)
      return false;
    const thres = realHeight / 100 * 2;
    return Math.abs(elem.height - realHeight) <= thres;
  }
  function crispify(el) {
    if (getZoomLevel() === 1)
      return;
    if (!imgNeedsCrispening(el))
      return;
    if (!el.parentElement.matches("[class*=imageWrapper][style]"))
      return;
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
  var onLoad = () => dispatcher.subscribe("UPDATE_CHANNEL_DIMENSIONS", handleDispatch);
  var onUnload = () => dispatcher.unsubscribe("UPDATE_CHANNEL_DIMENSIONS", handleDispatch);
  return __toCommonJS(crisp_img_exports);
})();
