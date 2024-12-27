(function(exports) {

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion

//#region solid-js/web
var require_web = __commonJS({ "solid-js/web"(exports, module) {
	module.exports = shelter.solidWeb;
} });

//#endregion
//#region plugins/server-clock/index.jsx
var import_web = __toESM(require_web(), 1);
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
var import_web$3 = __toESM(require_web(), 1);
var import_web$4 = __toESM(require_web(), 1);
var import_web$5 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<div></div>`, 2), _tmpl$2 = /*#__PURE__*/ (0, import_web.template)(`<div><div></div><!#><!/><!#><!/><!#><!/></div>`, 10);
const { createSignal } = shelter.solid;
let cancel = false;
const Hand = (props) => (() => {
	const _el$ = (0, import_web$5.getNextElement)(_tmpl$);
	_el$.style.setProperty("width", "2px");
	_el$.style.setProperty("position", "absolute");
	_el$.style.setProperty("left", "50%");
	_el$.style.setProperty("bottom", "50%");
	(0, import_web$4.effect)((_p$) => {
		const _v$ = props.height, _v$2 = props.col ?? "var(--interactive-normal)", _v$3 = `translateX(-1px) translateY(50%) rotate(${360 * props.frac}deg) translateY(-50%)`;
		_v$ !== _p$._v$ && _el$.style.setProperty("height", _p$._v$ = _v$);
		_v$2 !== _p$._v$2 && _el$.style.setProperty("background", _p$._v$2 = _v$2);
		_v$3 !== _p$._v$3 && _el$.style.setProperty("transform", _p$._v$3 = _v$3);
		return _p$;
	}, {
		_v$: undefined,
		_v$2: undefined,
		_v$3: undefined
	});
	return _el$;
})();
function Clock() {
	const [time, setTime] = createSignal(new Date());
	(async () => {
		while (!cancel) {
			setTime(new Date());
			await new Promise((res) => setTimeout(res, 250));
		}
	})();
	const hour = () => time().getHours() % 12;
	const min = () => time().getMinutes();
	const sec = () => time().getSeconds();
	return (() => {
		const _el$2 = (0, import_web$5.getNextElement)(_tmpl$2), _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, [_el$5, _co$] = (0, import_web$1.getNextMarker)(_el$4.nextSibling), _el$6 = _el$5.nextSibling, [_el$7, _co$2] = (0, import_web$1.getNextMarker)(_el$6.nextSibling), _el$8 = _el$7.nextSibling, [_el$9, _co$3] = (0, import_web$1.getNextMarker)(_el$8.nextSibling);
		_el$2.style.setProperty("margin", "13px");
		_el$2.style.setProperty("display", "flex");
		_el$2.style.setProperty("position", "relative");
		_el$3.style.setProperty("border", "2px solid var(--interactive-normal)");
		_el$3.style.setProperty("border-radius", "999999px");
		_el$3.style.setProperty("flex", "1");
		_el$3.style.setProperty("aspect-ratio", "1");
		(0, import_web$2.insert)(_el$2, (0, import_web$3.createComponent)(Hand, {
			get frac() {
				return hour() / 12;
			},
			height: "9px"
		}), _el$5, _co$);
		(0, import_web$2.insert)(_el$2, (0, import_web$3.createComponent)(Hand, {
			get frac() {
				return min() / 60;
			},
			height: "14px"
		}), _el$7, _co$2);
		(0, import_web$2.insert)(_el$2, (0, import_web$3.createComponent)(Hand, {
			get frac() {
				return sec() / 60;
			},
			height: "16px",
			col: "red"
		}), _el$9, _co$3);
		return _el$2;
	})();
}
let clock;
async function onLoad() {
	const sel = "nav > ul > [class*=\"scroller\"] > [class*=\"tutorialContainer\"]:first-child";
	let homeBtn;
	while (!(homeBtn = document.querySelector(sel))) await new Promise((res) => setTimeout(res, 250));
	clock = (0, import_web$3.createComponent)(Clock, {});
	homeBtn.parentElement.insertBefore(clock, homeBtn.nextElementSibling);
}
function onUnload() {
	clock?.remove();
	cancel = true;
}

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
return exports;
})({});