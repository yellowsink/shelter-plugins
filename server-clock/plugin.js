(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
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
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // shltr-res-ns:solid-js/web
  var require_web = __commonJS({
    "shltr-res-ns:solid-js/web"(exports, module) {
      module.exports = shelter.solidWeb;
    }
  });

  // plugins/server-clock/index.jsx
  var server_clock_exports = {};
  __export(server_clock_exports, {
    onLoad: () => onLoad,
    onUnload: () => onUnload
  });
  var import_web = __toESM(require_web(), 1);
  var import_web2 = __toESM(require_web(), 1);
  var import_web3 = __toESM(require_web(), 1);
  var import_web4 = __toESM(require_web(), 1);
  var _tmpl$ = /* @__PURE__ */ (0, import_web.template)(`<div></div>`, 2);
  var _tmpl$2 = /* @__PURE__ */ (0, import_web.template)(`<div><div></div></div>`, 4);
  var {
    createSignal
  } = shelter.solid;
  var cancel = false;
  var Hand = (props) => (() => {
    const _el$ = _tmpl$.cloneNode(true);
    _el$.style.setProperty("width", "2px");
    _el$.style.setProperty("position", "absolute");
    _el$.style.setProperty("left", "50%");
    _el$.style.setProperty("bottom", "50%");
    (0, import_web4.effect)((_p$) => {
      const _v$ = props.height, _v$2 = props.col ?? "var(--interactive-normal)", _v$3 = `translateX(-1px) translateY(50%) rotate(${360 * props.frac}deg) translateY(-50%)`;
      _v$ !== _p$._v$ && _el$.style.setProperty("height", _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && _el$.style.setProperty("background", _p$._v$2 = _v$2);
      _v$3 !== _p$._v$3 && _el$.style.setProperty("transform", _p$._v$3 = _v$3);
      return _p$;
    }, {
      _v$: void 0,
      _v$2: void 0,
      _v$3: void 0
    });
    return _el$;
  })();
  function Clock() {
    const [time, setTime] = createSignal(/* @__PURE__ */ new Date());
    (async () => {
      while (!cancel) {
        setTime(/* @__PURE__ */ new Date());
        await new Promise((res) => setTimeout(res, 250));
      }
    })();
    const hour = () => time().getHours() % 12;
    const min = () => time().getMinutes();
    const sec = () => time().getSeconds();
    return (() => {
      const _el$2 = _tmpl$2.cloneNode(true), _el$3 = _el$2.firstChild;
      _el$2.style.setProperty("margin", "13px");
      _el$2.style.setProperty("display", "flex");
      _el$2.style.setProperty("position", "relative");
      _el$3.style.setProperty("border", "2px solid var(--interactive-normal)");
      _el$3.style.setProperty("border-radius", "999999px");
      _el$3.style.setProperty("flex", "1");
      _el$3.style.setProperty("aspect-ratio", "1");
      (0, import_web2.insert)(_el$2, (0, import_web3.createComponent)(Hand, {
        get frac() {
          return hour() / 12;
        },
        height: "9px"
      }), null);
      (0, import_web2.insert)(_el$2, (0, import_web3.createComponent)(Hand, {
        get frac() {
          return min() / 60;
        },
        height: "14px"
      }), null);
      (0, import_web2.insert)(_el$2, (0, import_web3.createComponent)(Hand, {
        get frac() {
          return sec() / 60;
        },
        height: "16px",
        col: "red"
      }), null);
      return _el$2;
    })();
  }
  var clock;
  async function onLoad() {
    const sel = 'nav > ul > [class*="scroller"] > [class*="tutorialContainer"]:first-child';
    let homeBtn;
    while (!(homeBtn = document.querySelector(sel)))
      await new Promise((res) => setTimeout(res, 250));
    clock = (0, import_web3.createComponent)(Clock, {});
    homeBtn.parentElement.insertBefore(clock, homeBtn.nextElementSibling);
  }
  function onUnload() {
    clock?.remove();
    cancel = true;
  }
  return __toCommonJS(server_clock_exports);
})();
