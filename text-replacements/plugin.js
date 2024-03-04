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

  // plugins/text-replacements/index.ts
  var text_replacements_exports = {};
  __export(text_replacements_exports, {
    onUnload: () => onUnload,
    settings: () => settings
  });

  // plugins/text-replacements/style.scss
  var style_default = `
.ys-ts-span2{grid-column-end:span 2;justify-self:center}`;

  // plugins/text-replacements/settings.tsx
  var import_web = __toESM(require_web(), 1);
  var import_web2 = __toESM(require_web(), 1);
  var import_web3 = __toESM(require_web(), 1);
  var import_web4 = __toESM(require_web(), 1);
  var _tmpl$ = /* @__PURE__ */ (0, import_web.template)(`<div style="display: grid; align-items: baseline; grid-template-columns: 1fr auto auto auto auto; column-gap: .5rem"></div>`, 2);
  var _tmpl$2 = /* @__PURE__ */ (0, import_web.template)(`<div></div>`, 2);
  var {
    openModal,
    Header,
    HeaderTags,
    Button,
    ButtonSizes,
    ButtonLooks,
    ButtonColors,
    Divider,
    ModalRoot,
    ModalBody,
    ModalHeader,
    ModalConfirmFooter,
    ModalSizes,
    TextBox,
    Text,
    LinkButton,
    openConfirmationModal
  } = shelter.ui;
  var {
    createSignal
  } = shelter.solid;
  var {
    store
  } = shelter.plugin;
  var openEditDialog = (idx, isAdd) => openModal((props) => {
    const initial = store.regexes[idx];
    const [name, setName] = createSignal(initial[0]);
    const [regexp, setRegexp] = createSignal(initial[1]);
    const [flags, setFlags] = createSignal(initial[2]);
    const [replace, setReplace] = createSignal(initial[3]);
    return (0, import_web3.createComponent)(ModalRoot, {
      get size() {
        return ModalSizes.MEDIUM;
      },
      get children() {
        return [(0, import_web3.createComponent)(ModalHeader, {
          get close() {
            return props.close;
          },
          get children() {
            return [isAdd ? "Adding" : "Editing", ' "', (0, import_web4.memo)(() => name()), '"'];
          }
        }), (0, import_web3.createComponent)(ModalBody, {
          get children() {
            return [(0, import_web3.createComponent)(Header, {
              get tag() {
                return HeaderTags.H3;
              },
              children: "Name"
            }), (0, import_web3.createComponent)(TextBox, {
              placeholder: "Name",
              get value() {
                return name();
              },
              onInput: setName
            }), (0, import_web3.createComponent)(Header, {
              get tag() {
                return HeaderTags.H3;
              },
              children: "Regular Expression Matcher"
            }), (0, import_web3.createComponent)(TextBox, {
              placeholder: "Regex",
              get value() {
                return regexp();
              },
              onInput: setRegexp
            }), (0, import_web3.createComponent)(Text, {
              style: "margin: .25rem 0 .75rem; display: block",
              get children() {
                return ["Struggling? You can test your regexes", " ", (0, import_web3.createComponent)(LinkButton, {
                  href: "https://regexr.com",
                  children: "at regexr.com"
                }), ", and learn regex at", " ", (0, import_web3.createComponent)(LinkButton, {
                  href: "https://regexlearn.com",
                  children: "regexlearn.com"
                }), "."];
              }
            }), (0, import_web3.createComponent)(Header, {
              get tag() {
                return HeaderTags.H3;
              },
              children: "Regex Flags"
            }), (0, import_web3.createComponent)(TextBox, {
              placeholder: "Flags",
              get value() {
                return flags();
              },
              onInput: setFlags
            }), (0, import_web3.createComponent)(Header, {
              get tag() {
                return HeaderTags.H3;
              },
              children: "Replacement String"
            }), (0, import_web3.createComponent)(TextBox, {
              placeholder: "Replacement",
              get value() {
                return replace();
              },
              onInput: setReplace
            })];
          }
        }), (0, import_web3.createComponent)(ModalConfirmFooter, {
          get close() {
            return props.close;
          },
          onCancel: () => {
            store.regexes.splice(idx, 1);
            store.regexes = store.regexes;
          },
          onConfirm: () => {
            store.regexes[idx] = [name(), regexp(), flags(), replace()];
            store.regexes = store.regexes;
          },
          confirmText: "Save",
          cancelText: "Delete"
        })];
      }
    });
  });
  var add = () => openEditDialog(store.regexes.push(["", "", "gi", ""]) - 1, true);
  function swap(idx1, idx2) {
    const tmp = store.regexes[idx1];
    store.regexes[idx1] = store.regexes[idx2];
    store.regexes[idx2] = tmp;
    store.regexes = store.regexes;
  }
  var settings = () => [(() => {
    const _el$ = _tmpl$.cloneNode(true);
    (0, import_web2.insert)(_el$, (0, import_web3.createComponent)(Header, {
      get tag() {
        return HeaderTags.H4;
      },
      children: "Name"
    }), null);
    (0, import_web2.insert)(_el$, (0, import_web3.createComponent)(Header, {
      get tag() {
        return HeaderTags.H4;
      },
      "class": "ys-ts-span2",
      children: "Order"
    }), null);
    (0, import_web2.insert)(_el$, (0, import_web3.createComponent)(Header, {
      get tag() {
        return HeaderTags.H4;
      },
      "class": "ys-ts-span2",
      children: "Actions"
    }), null);
    (0, import_web2.insert)(_el$, () => store.regexes.map(([name, regexp, flags, replace], idx) => [(() => {
      const _el$2 = _tmpl$2.cloneNode(true);
      (0, import_web2.insert)(_el$2, name);
      return _el$2;
    })(), (0, import_web3.createComponent)(Button, {
      "aria-label": `Move replacement "${name}" up one`,
      disabled: idx === 0,
      get look() {
        return ButtonLooks.OUTLINED;
      },
      get size() {
        return ButtonSizes.ICON;
      },
      grow: true,
      onClick: () => swap(idx, idx - 1),
      children: "\u25B2"
    }), (0, import_web3.createComponent)(Button, {
      "aria-label": `Move replacement "${name}" down one`,
      get disabled() {
        return idx + 1 === store.regexes.length;
      },
      get look() {
        return ButtonLooks.OUTLINED;
      },
      get size() {
        return ButtonSizes.ICON;
      },
      grow: true,
      onClick: () => swap(idx, idx + 1),
      children: "\u25BC"
    }), (0, import_web3.createComponent)(Button, {
      "aria-label": `Edit replacement "${name}"`,
      get look() {
        return ButtonLooks.OUTLINED;
      },
      get size() {
        return ButtonSizes.ICON;
      },
      grow: true,
      style: {
        "font-family": "emoji"
      },
      onClick: () => openEditDialog(idx),
      children: "\u270F"
    }), (0, import_web3.createComponent)(Button, {
      "aria-label": `Delete replacement "${name}"`,
      get look() {
        return ButtonLooks.OUTLINED;
      },
      get size() {
        return ButtonSizes.ICON;
      },
      get color() {
        return ButtonColors.RED;
      },
      style: {
        "font-family": "emoji"
      },
      grow: true,
      onClick: () => openConfirmationModal({
        type: "danger",
        header: () => `Delete ${name}?`,
        body: () => "You won't be able to recover any replacements you delete.",
        confirmText: "Delete"
      }).then(() => {
        store.regexes.splice(idx, 1);
        store.regexes = store.regexes;
      }, () => {
      }),
      children: "\u{1F5D1}"
    })]), null);
    return _el$;
  })(), (0, import_web3.createComponent)(Divider, {
    mt: true,
    mb: true
  }), (0, import_web3.createComponent)(Button, {
    grow: true,
    onClick: add,
    children: "Add replacement"
  })];

  // plugins/text-replacements/index.ts
  var {
    // @ts-expect-error
    http: { intercept },
    // @ts-expect-error
    plugin: { store: store2 },
    ui: { injectCss }
  } = shelter;
  store2.regexes ??= [];
  var unintercept = intercept(
    "post",
    /\/channels\/\d+\/messages/,
    (req, send) => {
      let newContent = req?.body?.content;
      try {
        if (typeof newContent === "string") {
          for (const [
            ,
            match,
            flags,
            replace
          ] of store2.regexes) {
            const regex = new RegExp(match, flags);
            newContent = newContent[regex.global ? "replaceAll" : "replace"](
              regex,
              replace
            );
          }
          req.body.content = newContent;
        }
      } catch (e) {
        console.error(
          "[shelter/text-replacements] BIG OOPSIE while replacing, sending request as-is!",
          req,
          e
        );
      }
      return send(req);
    }
  );
  var uncss = injectCss(style_default);
  var onUnload = () => (uncss(), unintercept());
  return __toCommonJS(text_replacements_exports);
})();
