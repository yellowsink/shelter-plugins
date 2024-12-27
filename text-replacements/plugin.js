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

//#region plugins/text-replacements/style.scss
var style_default = `.ys-ts-span2 {
  grid-column-end: span 2;
  justify-self: center;
}
`;

//#endregion
//#region solid-js/web
var require_web = __commonJS({ "solid-js/web"(exports, module) {
	module.exports = shelter.solidWeb;
} });

//#endregion
//#region plugins/text-replacements/settings.tsx
var import_web = __toESM(require_web(), 1);
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
var import_web$3 = __toESM(require_web(), 1);
var import_web$4 = __toESM(require_web(), 1);
var import_web$5 = __toESM(require_web(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<div style="display: grid; align-items: baseline; grid-template-columns: 1fr auto auto auto auto; column-gap: .5rem"><!#><!/><!#><!/><!#><!/><!#><!/></div>`, 10), _tmpl$2 = /*#__PURE__*/ (0, import_web.template)(`<div></div>`, 2);
const { openModal, Header, HeaderTags, Button, ButtonSizes, ButtonLooks, ButtonColors, Divider, ModalRoot, ModalBody, ModalHeader, ModalConfirmFooter, ModalSizes, TextBox, Text, LinkButton, openConfirmationModal } = shelter.ui;
const { createSignal } = shelter.solid;
const { store: store$1 } = shelter.plugin;
const openEditDialog = (idx) => openModal((props) => {
	const isAdd = isNaN(idx);
	const initial = isAdd ? [
		"",
		"",
		"gi",
		""
	] : store$1.regexes[idx];
	const [name, setName] = createSignal(initial[0]);
	const [regexp, setRegexp] = createSignal(initial[1]);
	const [flags, setFlags] = createSignal(initial[2]);
	const [replace, setReplace] = createSignal(initial[3]);
	return (0, import_web$4.createComponent)(ModalRoot, {
		get size() {
			return ModalSizes.MEDIUM;
		},
		get children() {
			return [
				(0, import_web$4.createComponent)(ModalHeader, {
					get close() {
						return props.close;
					},
					get children() {
						return [
							isAdd ? "Adding" : "Editing",
							" \"",
							(0, import_web$5.memo)(() => name()),
							"\""
						];
					}
				}),
				(0, import_web$4.createComponent)(ModalBody, { get children() {
					return [
						(0, import_web$4.createComponent)(Header, {
							get tag() {
								return HeaderTags.H3;
							},
							children: "Name"
						}),
						(0, import_web$4.createComponent)(TextBox, {
							placeholder: "Name",
							get value() {
								return name();
							},
							onInput: setName
						}),
						(0, import_web$4.createComponent)(Header, {
							get tag() {
								return HeaderTags.H3;
							},
							children: "Regular Expression Matcher"
						}),
						(0, import_web$4.createComponent)(TextBox, {
							placeholder: "Regex",
							get value() {
								return regexp();
							},
							onInput: setRegexp
						}),
						(0, import_web$4.createComponent)(Text, {
							style: "margin: .25rem 0 .75rem; display: block",
							get children() {
								return [
									"Struggling? You can test your regexes",
									" ",
									(0, import_web$4.createComponent)(LinkButton, {
										href: "https://regexr.com",
										children: "at regexr.com"
									}),
									", and learn regex at",
									" ",
									(0, import_web$4.createComponent)(LinkButton, {
										href: "https://regexlearn.com",
										children: "regexlearn.com"
									}),
									"."
								];
							}
						}),
						(0, import_web$4.createComponent)(Header, {
							get tag() {
								return HeaderTags.H3;
							},
							children: "Regex Flags"
						}),
						(0, import_web$4.createComponent)(TextBox, {
							placeholder: "Flags",
							get value() {
								return flags();
							},
							onInput: setFlags
						}),
						(0, import_web$4.createComponent)(Header, {
							get tag() {
								return HeaderTags.H3;
							},
							children: "Replacement String"
						}),
						(0, import_web$4.createComponent)(TextBox, {
							placeholder: "Replacement",
							get value() {
								return replace();
							},
							onInput: setReplace
						})
					];
				} }),
				(0, import_web$4.createComponent)(ModalConfirmFooter, {
					get close() {
						return props.close;
					},
					onConfirm: () => {
						const newRegex = [
							name(),
							regexp(),
							flags(),
							replace()
						];
						if (isAdd) store$1.regexes.push(newRegex);
else store$1.regexes[idx] = newRegex;
						store$1.regexes = store$1.regexes;
					},
					confirmText: "Save"
				})
			];
		}
	});
});
function swap(idx1, idx2) {
	const tmp = store$1.regexes[idx1];
	store$1.regexes[idx1] = store$1.regexes[idx2];
	store$1.regexes[idx2] = tmp;
	store$1.regexes = store$1.regexes;
}
const settings = () => [
	(() => {
		const _el$ = (0, import_web$1.getNextElement)(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = (0, import_web$2.getNextMarker)(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = (0, import_web$2.getNextMarker)(_el$4.nextSibling), _el$6 = _el$5.nextSibling, [_el$7, _co$3] = (0, import_web$2.getNextMarker)(_el$6.nextSibling), _el$8 = _el$7.nextSibling, [_el$9, _co$4] = (0, import_web$2.getNextMarker)(_el$8.nextSibling);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(Header, {
			get tag() {
				return HeaderTags.H4;
			},
			children: "Name"
		}), _el$3, _co$);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(Header, {
			get tag() {
				return HeaderTags.H4;
			},
			"class": "ys-ts-span2",
			children: "Order"
		}), _el$5, _co$2);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(Header, {
			get tag() {
				return HeaderTags.H4;
			},
			"class": "ys-ts-span2",
			children: "Actions"
		}), _el$7, _co$3);
		(0, import_web$3.insert)(_el$, () => store$1.regexes.map(([name], idx) => [
			(() => {
				const _el$10 = (0, import_web$1.getNextElement)(_tmpl$2);
				(0, import_web$3.insert)(_el$10, name);
				return _el$10;
			})(),
			(0, import_web$4.createComponent)(Button, {
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
				children: "▲"
			}),
			(0, import_web$4.createComponent)(Button, {
				"aria-label": `Move replacement "${name}" down one`,
				get disabled() {
					return idx + 1 === store$1.regexes.length;
				},
				get look() {
					return ButtonLooks.OUTLINED;
				},
				get size() {
					return ButtonSizes.ICON;
				},
				grow: true,
				onClick: () => swap(idx, idx + 1),
				children: "▼"
			}),
			(0, import_web$4.createComponent)(Button, {
				"aria-label": `Edit replacement "${name}"`,
				get look() {
					return ButtonLooks.OUTLINED;
				},
				get size() {
					return ButtonSizes.ICON;
				},
				grow: true,
				style: { "font-family": "emoji" },
				onClick: () => openEditDialog(idx),
				children: "✏"
			}),
			(0, import_web$4.createComponent)(Button, {
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
				style: { "font-family": "emoji" },
				grow: true,
				onClick: () => openConfirmationModal({
					type: "danger",
					header: () => `Delete ${name}?`,
					body: () => "You won't be able to recover any replacements you delete.",
					confirmText: "Delete"
				}).then(() => {
					store$1.regexes.splice(idx, 1);
					store$1.regexes = store$1.regexes;
				}, () => {}),
				children: "🗑"
			})
		]), _el$9, _co$4);
		return _el$;
	})(),
	(0, import_web$4.createComponent)(Divider, {
		mt: true,
		mb: true
	}),
	(0, import_web$4.createComponent)(Button, {
		grow: true,
		onClick: () => openEditDialog(),
		children: "Add replacement"
	})
];

//#endregion
//#region plugins/text-replacements/index.ts
const { http: { intercept }, plugin: { store }, ui: { injectCss } } = shelter;
store.regexes ??= [];
const unintercept = intercept("post", /\/channels\/\d+\/messages/, (req, send) => {
	let newContent = req?.body?.content;
	try {
		if (typeof newContent === "string") {
			for (const [, match, flags, replace] of store.regexes) {
				const regex = new RegExp(match, flags);
				newContent = newContent[regex.global ? "replaceAll" : "replace"](regex, replace);
			}
			req.body.content = newContent;
		}
	} catch (e) {
		console.error("[shelter/text-replacements] BIG OOPSIE while replacing, sending request as-is!", req, e);
	}
	return send(req);
});
const uncss = injectCss(style_default);
const onUnload = () => (uncss(), unintercept());

//#endregion
exports.onUnload = onUnload
exports.settings = settings
return exports;
})({});