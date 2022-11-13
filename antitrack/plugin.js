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

  // plugins/antitrack/index.js
  var antitrack_exports = {};
  __export(antitrack_exports, {
    onUnload: () => onUnload
  });
  try {
    window.__SENTRY__.hub.getClient().getOptions().enabled = false;
    Object.keys(console).forEach((x) => console[x] = console[x].__sentry_original__ ?? console[x]);
  } catch {
  }
  var onUnload = shelter.patcher.instead(
    "send",
    XMLHttpRequest.prototype,
    function(args, orig) {
      if (this.__sentry_xhr__?.url !== "https://discord.com/api/v9/science")
        return orig.apply(this, args);
    }
  );
  return __toCommonJS(antitrack_exports);
})();
