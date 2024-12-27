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

//#region plugins/codeblocks-plus/styles.sass
var styles_default = `.ys_cbp_wrap {
  color: var(--text-normal);
  border-radius: 0;
  height: 100%;
  padding: 0 .5rem calc(.5rem - 8px);
}

.ys_cbp_wrap pre {
  overflow-x: scroll;
  background: none !important;
}

.ys_cbp_wrap code {
  background: none;
  border: none;
}

.ys_cbp_wrap button {
  color: var(--text-normal);
  background: var(--background-secondary);
  border-radius: .25rem;
  padding: .1rem .5rem;
  font-size: .9rem;
}

.ys_cbp_wrap .lnum {
  opacity: .5;
  text-align: right;
  width: 1.2rem;
  margin-right: .6rem;
  display: inline-block;
}

.ys_cbp_row {
  border-bottom: 1px solid var(--text-muted);
  align-items: center;
  margin-bottom: .25rem;
  padding: .25rem 0;
  font-size: .95rem;
  font-weight: 500;
  display: flex;
}

.ys_cbp_row > :first-child {
  flex: 1;
}
`;

//#endregion
//#region solid-js/web
var require_web = __commonJS({ "solid-js/web"(exports, module) {
	module.exports = shelter.solidWeb;
} });

//#endregion
//#region node_modules/.pnpm/shiki-es@0.2.0/node_modules/shiki-es/dist/shiki.mjs
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : {};
var mainExports$1 = {};
var main$1 = {
	get exports() {
		return mainExports$1;
	},
	set exports(v) {
		mainExports$1 = v;
	}
};
(function(module$1, exports$1) {
	!function(t, n) {
		module$1.exports = n();
	}(commonjsGlobal, () => {
		return t = {
			770: function(t$1, n$1, e) {
				var r = this && this.__importDefault || function(t$2) {
					return t$2 && t$2.__esModule ? t$2 : { default: t$2 };
				};
				Object.defineProperty(n$1, "__esModule", { value: !0 }), n$1.setDefaultDebugCall = n$1.createOnigScanner = n$1.createOnigString = n$1.loadWASM = n$1.OnigScanner = n$1.OnigString = void 0;
				const i = r(e(418));
				let o = null, a = !1;
				class f {
					static _utf8ByteLength(t$2) {
						let n$2 = 0;
						for (let e$1 = 0, r$1 = t$2.length; e$1 < r$1; e$1++) {
							const i$1 = t$2.charCodeAt(e$1);
							let o$1 = i$1, a$1 = !1;
							if (i$1 >= 55296 && i$1 <= 56319 && e$1 + 1 < r$1) {
								const n$3 = t$2.charCodeAt(e$1 + 1);
								n$3 >= 56320 && n$3 <= 57343 && (o$1 = 65536 + (i$1 - 55296 << 10) | n$3 - 56320, a$1 = !0);
							}
							n$2 += o$1 <= 127 ? 1 : o$1 <= 2047 ? 2 : o$1 <= 65535 ? 3 : 4, a$1 && e$1++;
						}
						return n$2;
					}
					constructor(t$2) {
						const n$2 = t$2.length, e$1 = f._utf8ByteLength(t$2), r$1 = e$1 !== n$2, i$1 = r$1 ? new Uint32Array(n$2 + 1) : null;
						r$1 && (i$1[n$2] = e$1);
						const o$1 = r$1 ? new Uint32Array(e$1 + 1) : null;
						r$1 && (o$1[e$1] = n$2);
						const a$1 = new Uint8Array(e$1);
						let s$1 = 0;
						for (let e$2 = 0; e$2 < n$2; e$2++) {
							const f$1 = t$2.charCodeAt(e$2);
							let u$1 = f$1, c$1 = !1;
							if (f$1 >= 55296 && f$1 <= 56319 && e$2 + 1 < n$2) {
								const n$3 = t$2.charCodeAt(e$2 + 1);
								n$3 >= 56320 && n$3 <= 57343 && (u$1 = 65536 + (f$1 - 55296 << 10) | n$3 - 56320, c$1 = !0);
							}
							r$1 && (i$1[e$2] = s$1, c$1 && (i$1[e$2 + 1] = s$1), u$1 <= 127 ? o$1[s$1 + 0] = e$2 : u$1 <= 2047 ? (o$1[s$1 + 0] = e$2, o$1[s$1 + 1] = e$2) : u$1 <= 65535 ? (o$1[s$1 + 0] = e$2, o$1[s$1 + 1] = e$2, o$1[s$1 + 2] = e$2) : (o$1[s$1 + 0] = e$2, o$1[s$1 + 1] = e$2, o$1[s$1 + 2] = e$2, o$1[s$1 + 3] = e$2)), u$1 <= 127 ? a$1[s$1++] = u$1 : u$1 <= 2047 ? (a$1[s$1++] = 192 | (1984 & u$1) >>> 6, a$1[s$1++] = 128 | (63 & u$1) >>> 0) : u$1 <= 65535 ? (a$1[s$1++] = 224 | (61440 & u$1) >>> 12, a$1[s$1++] = 128 | (4032 & u$1) >>> 6, a$1[s$1++] = 128 | (63 & u$1) >>> 0) : (a$1[s$1++] = 240 | (1835008 & u$1) >>> 18, a$1[s$1++] = 128 | (258048 & u$1) >>> 12, a$1[s$1++] = 128 | (4032 & u$1) >>> 6, a$1[s$1++] = 128 | (63 & u$1) >>> 0), c$1 && e$2++;
						}
						this.utf16Length = n$2, this.utf8Length = e$1, this.utf16Value = t$2, this.utf8Value = a$1, this.utf16OffsetToUtf8 = i$1, this.utf8OffsetToUtf16 = o$1;
					}
					createString(t$2) {
						const n$2 = t$2._omalloc(this.utf8Length);
						return t$2.HEAPU8.set(this.utf8Value, n$2), n$2;
					}
				}
				class s {
					constructor(t$2) {
						if (this.id = ++s.LAST_ID, !o) throw new Error("Must invoke loadWASM first.");
						this._onigBinding = o, this.content = t$2;
						const n$2 = new f(t$2);
						this.utf16Length = n$2.utf16Length, this.utf8Length = n$2.utf8Length, this.utf16OffsetToUtf8 = n$2.utf16OffsetToUtf8, this.utf8OffsetToUtf16 = n$2.utf8OffsetToUtf16, this.utf8Length < 1e4 && !s._sharedPtrInUse ? (s._sharedPtr || (s._sharedPtr = o._omalloc(1e4)), s._sharedPtrInUse = !0, o.HEAPU8.set(n$2.utf8Value, s._sharedPtr), this.ptr = s._sharedPtr) : this.ptr = n$2.createString(o);
					}
					convertUtf8OffsetToUtf16(t$2) {
						return this.utf8OffsetToUtf16 ? t$2 < 0 ? 0 : t$2 > this.utf8Length ? this.utf16Length : this.utf8OffsetToUtf16[t$2] : t$2;
					}
					convertUtf16OffsetToUtf8(t$2) {
						return this.utf16OffsetToUtf8 ? t$2 < 0 ? 0 : t$2 > this.utf16Length ? this.utf8Length : this.utf16OffsetToUtf8[t$2] : t$2;
					}
					dispose() {
						this.ptr === s._sharedPtr ? s._sharedPtrInUse = !1 : this._onigBinding._ofree(this.ptr);
					}
				}
				n$1.OnigString = s, s.LAST_ID = 0, s._sharedPtr = 0, s._sharedPtrInUse = !1;
				class u {
					constructor(t$2) {
						if (!o) throw new Error("Must invoke loadWASM first.");
						const n$2 = [], e$1 = [];
						for (let r$2 = 0, i$2 = t$2.length; r$2 < i$2; r$2++) {
							const i$3 = new f(t$2[r$2]);
							n$2[r$2] = i$3.createString(o), e$1[r$2] = i$3.utf8Length;
						}
						const r$1 = o._omalloc(4 * t$2.length);
						o.HEAPU32.set(n$2, r$1 / 4);
						const i$1 = o._omalloc(4 * t$2.length);
						o.HEAPU32.set(e$1, i$1 / 4);
						const a$1 = o._createOnigScanner(r$1, i$1, t$2.length);
						for (let e$2 = 0, r$2 = t$2.length; e$2 < r$2; e$2++) o._ofree(n$2[e$2]);
						o._ofree(i$1), o._ofree(r$1), 0 === a$1 && function(t$3) {
							throw new Error(t$3.UTF8ToString(t$3._getLastOnigError()));
						}(o), this._onigBinding = o, this._ptr = a$1;
					}
					dispose() {
						this._onigBinding._freeOnigScanner(this._ptr);
					}
					findNextMatchSync(t$2, n$2, e$1) {
						let r$1 = a, i$1 = 0;
						if ("number" == typeof e$1 ? (8 & e$1 && (r$1 = !0), i$1 = e$1) : "boolean" == typeof e$1 && (r$1 = e$1), "string" == typeof t$2) {
							t$2 = new s(t$2);
							const e$2 = this._findNextMatchSync(t$2, n$2, r$1, i$1);
							return t$2.dispose(), e$2;
						}
						return this._findNextMatchSync(t$2, n$2, r$1, i$1);
					}
					_findNextMatchSync(t$2, n$2, e$1, r$1) {
						const i$1 = this._onigBinding;
						let o$1;
						if (o$1 = e$1 ? i$1._findNextOnigScannerMatchDbg(this._ptr, t$2.id, t$2.ptr, t$2.utf8Length, t$2.convertUtf16OffsetToUtf8(n$2), r$1) : i$1._findNextOnigScannerMatch(this._ptr, t$2.id, t$2.ptr, t$2.utf8Length, t$2.convertUtf16OffsetToUtf8(n$2), r$1), 0 === o$1) return null;
						const a$1 = i$1.HEAPU32;
						let f$1 = o$1 / 4;
						const s$1 = a$1[f$1++], u$1 = a$1[f$1++];
						let c$1 = [];
						for (let n$3 = 0; n$3 < u$1; n$3++) {
							const e$2 = t$2.convertUtf8OffsetToUtf16(a$1[f$1++]), r$2 = t$2.convertUtf8OffsetToUtf16(a$1[f$1++]);
							c$1[n$3] = {
								start: e$2,
								end: r$2,
								length: r$2 - e$2
							};
						}
						return {
							index: s$1,
							captureIndices: c$1
						};
					}
				}
				n$1.OnigScanner = u;
				let c = !1, l = null;
				n$1.loadWASM = function(t$2) {
					if (c) return l;
					let n$2, e$1, r$1, a$1;
					if (c = !0, function(t$3) {
						return "function" == typeof t$3.instantiator;
					}(t$2)) n$2 = t$2.instantiator, e$1 = t$2.print;
else {
						let r$2;
						!function(t$3) {
							return void 0 !== t$3.data;
						}(t$2) ? r$2 = t$2 : (r$2 = t$2.data, e$1 = t$2.print), n$2 = function(t$3) {
							return "undefined" != typeof Response && t$3 instanceof Response;
						}(r$2) ? "function" == typeof WebAssembly.instantiateStreaming ? function(t$3) {
							return (n$3) => WebAssembly.instantiateStreaming(t$3, n$3);
						}(r$2) : function(t$3) {
							return async (n$3) => {
								const e$2 = await t$3.arrayBuffer();
								return WebAssembly.instantiate(e$2, n$3);
							};
						}(r$2) : function(t$3) {
							return (n$3) => WebAssembly.instantiate(t$3, n$3);
						}(r$2);
					}
					return l = new Promise((t$3, n$3) => {
						r$1 = t$3, a$1 = n$3;
					}), function(t$3, n$3, e$2, r$2) {
						(0, i.default)({
							print: n$3,
							instantiateWasm: (n$4, e$3) => {
								if ("undefined" == typeof performance) {
									const t$4 = () => Date.now();
									n$4.env.emscripten_get_now = t$4, n$4.wasi_snapshot_preview1.emscripten_get_now = t$4;
								}
								return t$3(n$4).then((t$4) => e$3(t$4.instance), r$2), {};
							}
						}).then((t$4) => {
							o = t$4, e$2();
						});
					}(n$2, e$1, r$1, a$1), l;
				}, n$1.createOnigString = function(t$2) {
					return new s(t$2);
				}, n$1.createOnigScanner = function(t$2) {
					return new u(t$2);
				}, n$1.setDefaultDebugCall = function(t$2) {
					a = t$2;
				};
			},
			418: (t$1) => {
				var n$1 = ("undefined" != typeof document && document.currentScript && document.currentScript.src, function(t$2) {
					var n$2, e, r = void 0 !== (t$2 = t$2 || {}) ? t$2 : {};
					r.ready = new Promise(function(t$3, r$1) {
						n$2 = t$3, e = r$1;
					});
					var i, o = Object.assign({}, r), s = !1, c = "";
					function l(t$3) {
						return r.locateFile ? r.locateFile(t$3, c) : c + t$3;
					}
					i = function(t$3) {
						let n$3;
						return "function" == typeof readbuffer ? new Uint8Array(readbuffer(t$3)) : (n$3 = read(t$3, "binary"), m("object" == typeof n$3), n$3);
					}, "undefined" != typeof scriptArgs ? scriptArgs : void 0 !== arguments && arguments, "undefined" != typeof onig_print && ("undefined" == typeof console && (console = {}), console.log = onig_print, console.warn = console.error = "undefined" != typeof printErr ? printErr : onig_print);
					var h, p, d = r.print || console.log.bind(console), g = r.printErr || console.warn.bind(console);
					Object.assign(r, o), o = null, r.arguments && r.arguments, r.thisProgram && r.thisProgram, r.quit && r.quit, r.wasmBinary && (h = r.wasmBinary), r.noExitRuntime, "object" != typeof WebAssembly && k("no native wasm support detected");
					var _ = !1;
					function m(t$3, n$3) {
						t$3 || k(n$3);
					}
					var y, w, S, v = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
					function A(t$3, n$3, e$1) {
						for (var r$1 = n$3 + e$1, i$1 = n$3; t$3[i$1] && !(i$1 >= r$1);) ++i$1;
						if (i$1 - n$3 > 16 && t$3.buffer && v) return v.decode(t$3.subarray(n$3, i$1));
						for (var o$1 = ""; n$3 < i$1;) {
							var a = t$3[n$3++];
							if (128 & a) {
								var f = 63 & t$3[n$3++];
								if (192 != (224 & a)) {
									var s$1 = 63 & t$3[n$3++];
									if ((a = 224 == (240 & a) ? (15 & a) << 12 | f << 6 | s$1 : (7 & a) << 18 | f << 12 | s$1 << 6 | 63 & t$3[n$3++]) < 65536) o$1 += String.fromCharCode(a);
else {
										var u = a - 65536;
										o$1 += String.fromCharCode(55296 | u >> 10, 56320 | 1023 & u);
									}
								} else o$1 += String.fromCharCode((31 & a) << 6 | f);
							} else o$1 += String.fromCharCode(a);
						}
						return o$1;
					}
					function b(t$3, n$3) {
						return t$3 ? A(w, t$3, n$3) : "";
					}
					function O(t$3) {
						y = t$3, r.HEAP8 = new Int8Array(t$3), r.HEAP16 = new Int16Array(t$3), r.HEAP32 = new Int32Array(t$3), r.HEAPU8 = w = new Uint8Array(t$3), r.HEAPU16 = new Uint16Array(t$3), r.HEAPU32 = S = new Uint32Array(t$3), r.HEAPF32 = new Float32Array(t$3), r.HEAPF64 = new Float64Array(t$3);
					}
					r.INITIAL_MEMORY;
					var U = [], P = [], R = [];
					function x() {
						if (r.preRun) for ("function" == typeof r.preRun && (r.preRun = [r.preRun]); r.preRun.length;) M(r.preRun.shift());
						G(U);
					}
					function T() {
						G(P);
					}
					function E() {
						if (r.postRun) for ("function" == typeof r.postRun && (r.postRun = [r.postRun]); r.postRun.length;) I(r.postRun.shift());
						G(R);
					}
					function M(t$3) {
						U.unshift(t$3);
					}
					function L(t$3) {
						P.unshift(t$3);
					}
					function I(t$3) {
						R.unshift(t$3);
					}
					var W = 0, C = null;
					function N(t$3) {
						W++, r.monitorRunDependencies && r.monitorRunDependencies(W);
					}
					function j(t$3) {
						if (W--, r.monitorRunDependencies && r.monitorRunDependencies(W), 0 == W && C) {
							var n$3 = C;
							C = null, n$3();
						}
					}
					function k(t$3) {
						r.onAbort && r.onAbort(t$3), g(t$3 = "Aborted(" + t$3 + ")"), _ = !0, t$3 += ". Build with -sASSERTIONS for more info.";
						var n$3 = new WebAssembly.RuntimeError(t$3);
						throw e(n$3), n$3;
					}
					var B, H, F = "data:application/octet-stream;base64,";
					function V(t$3) {
						return t$3.startsWith(F);
					}
					function z(t$3) {
						try {
							if (t$3 == B && h) return new Uint8Array(h);
							if (i) return i(t$3);
							throw "both async and sync fetching of the wasm failed";
						} catch (t$4) {
							k(t$4);
						}
					}
					function q() {
						return h || !s || "function" != typeof fetch ? Promise.resolve().then(function() {
							return z(B);
						}) : fetch(B, { credentials: "same-origin" }).then(function(t$3) {
							if (!t$3.ok) throw "failed to load wasm binary file at '" + B + "'";
							return t$3.arrayBuffer();
						}).catch(function() {
							return z(B);
						});
					}
					function Y() {
						var t$3 = {
							env: nt,
							wasi_snapshot_preview1: nt
						};
						function n$3(t$4, n$4) {
							var e$1 = t$4.exports;
							r.asm = e$1, O((p = r.asm.memory).buffer), r.asm.__indirect_function_table, L(r.asm.__wasm_call_ctors), j();
						}
						function i$1(t$4) {
							n$3(t$4.instance);
						}
						function o$1(n$4) {
							return q().then(function(n$5) {
								return WebAssembly.instantiate(n$5, t$3);
							}).then(function(t$4) {
								return t$4;
							}).then(n$4, function(t$4) {
								g("failed to asynchronously prepare wasm: " + t$4), k(t$4);
							});
						}
						if (N(), r.instantiateWasm) try {
							return r.instantiateWasm(t$3, n$3);
						} catch (t$4) {
							g("Module.instantiateWasm callback failed with error: " + t$4), e(t$4);
						}
						return (h || "function" != typeof WebAssembly.instantiateStreaming || V(B) || "function" != typeof fetch ? o$1(i$1) : fetch(B, { credentials: "same-origin" }).then(function(n$4) {
							return WebAssembly.instantiateStreaming(n$4, t$3).then(i$1, function(t$4) {
								return g("wasm streaming compile failed: " + t$4), g("falling back to ArrayBuffer instantiation"), o$1(i$1);
							});
						})).catch(e), {};
					}
					function G(t$3) {
						for (; t$3.length > 0;) t$3.shift()(r);
					}
					function J(t$3, n$3, e$1) {
						w.copyWithin(t$3, n$3, n$3 + e$1);
					}
					function K(t$3) {
						try {
							return p.grow(t$3 - y.byteLength + 65535 >>> 16), O(p.buffer), 1;
						} catch (t$4) {}
					}
					function Q(t$3) {
						var n$3, e$1 = w.length, r$1 = 2147483648;
						if ((t$3 >>>= 0) > r$1) return !1;
						for (var i$1 = 1; i$1 <= 4; i$1 *= 2) {
							var o$1 = e$1 * (1 + .2 / i$1);
							if (o$1 = Math.min(o$1, t$3 + 100663296), K(Math.min(r$1, (n$3 = Math.max(t$3, o$1)) + (65536 - n$3 % 65536) % 65536))) return !0;
						}
						return !1;
					}
					V(B = "onig.wasm") || (B = l(B)), H = "undefined" != typeof dateNow ? dateNow : () => performance.now();
					var X = [
						null,
						[],
						[]
					];
					function Z(t$3, n$3) {
						var e$1 = X[t$3];
						0 === n$3 || 10 === n$3 ? ((1 === t$3 ? d : g)(A(e$1, 0)), e$1.length = 0) : e$1.push(n$3);
					}
					function $(t$3, n$3, e$1, r$1) {
						for (var i$1 = 0, o$1 = 0; o$1 < e$1; o$1++) {
							var a = S[n$3 >> 2], f = S[n$3 + 4 >> 2];
							n$3 += 8;
							for (var s$1 = 0; s$1 < f; s$1++) Z(t$3, w[a + s$1]);
							i$1 += f;
						}
						return S[r$1 >> 2] = i$1, 0;
					}
					var tt, nt = {
						emscripten_get_now: H,
						emscripten_memcpy_big: J,
						emscripten_resize_heap: Q,
						fd_write: $
					};
					function et(t$3) {
						function e$1() {
							tt || (tt = !0, r.calledRun = !0, _ || (T(), n$2(r), r.onRuntimeInitialized && r.onRuntimeInitialized(), E()));
						}
						W > 0 || (x(), W > 0 || (r.setStatus ? (r.setStatus("Running..."), setTimeout(function() {
							setTimeout(function() {
								r.setStatus("");
							}, 1), e$1();
						}, 1)) : e$1()));
					}
					if (Y(), r.___wasm_call_ctors = function() {
						return (r.___wasm_call_ctors = r.asm.__wasm_call_ctors).apply(null, arguments);
					}, r.___errno_location = function() {
						return (r.___errno_location = r.asm.__errno_location).apply(null, arguments);
					}, r._omalloc = function() {
						return (r._omalloc = r.asm.omalloc).apply(null, arguments);
					}, r._ofree = function() {
						return (r._ofree = r.asm.ofree).apply(null, arguments);
					}, r._getLastOnigError = function() {
						return (r._getLastOnigError = r.asm.getLastOnigError).apply(null, arguments);
					}, r._createOnigScanner = function() {
						return (r._createOnigScanner = r.asm.createOnigScanner).apply(null, arguments);
					}, r._freeOnigScanner = function() {
						return (r._freeOnigScanner = r.asm.freeOnigScanner).apply(null, arguments);
					}, r._findNextOnigScannerMatch = function() {
						return (r._findNextOnigScannerMatch = r.asm.findNextOnigScannerMatch).apply(null, arguments);
					}, r._findNextOnigScannerMatchDbg = function() {
						return (r._findNextOnigScannerMatchDbg = r.asm.findNextOnigScannerMatchDbg).apply(null, arguments);
					}, r.stackSave = function() {
						return (r.stackSave = r.asm.stackSave).apply(null, arguments);
					}, r.stackRestore = function() {
						return (r.stackRestore = r.asm.stackRestore).apply(null, arguments);
					}, r.stackAlloc = function() {
						return (r.stackAlloc = r.asm.stackAlloc).apply(null, arguments);
					}, r.dynCall_jiji = function() {
						return (r.dynCall_jiji = r.asm.dynCall_jiji).apply(null, arguments);
					}, r.UTF8ToString = b, C = function t$3() {
						tt || et(), tt || (C = t$3);
					}, r.preInit) for ("function" == typeof r.preInit && (r.preInit = [r.preInit]); r.preInit.length > 0;) r.preInit.pop()();
					return et(), t$2.ready;
				});
				t$1.exports = n$1;
			}
		}, n = {}, function e(r) {
			var i = n[r];
			if (void 0 !== i) return i.exports;
			var o = n[r] = { exports: {} };
			return t[r].call(o.exports, o, o.exports, e), o.exports;
		}(770);
		var t, n;
	});
})(main$1);
var mainExports = {};
var main = {
	get exports() {
		return mainExports;
	},
	set exports(v) {
		mainExports = v;
	}
};
(function(module$1, exports$1) {
	!function(e, t) {
		module$1.exports = t();
	}(commonjsGlobal, function() {
		return (() => {
			var e = {
				350: (e$1, t$1) => {
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.UseOnigurumaFindOptions = t$1.DebugFlags = void 0, t$1.DebugFlags = { InDebugMode: "undefined" != typeof process && !!process.env.VSCODE_TEXTMATE_DEBUG }, t$1.UseOnigurumaFindOptions = !1;
				},
				36: (e$1, t$1) => {
					var n;
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.toOptionalTokenType = t$1.EncodedTokenAttributes = void 0, (n = t$1.EncodedTokenAttributes || (t$1.EncodedTokenAttributes = {})).toBinaryStr = function(e$2) {
						let t$2 = e$2.toString(2);
						for (; t$2.length < 32;) t$2 = "0" + t$2;
						return t$2;
					}, n.print = function(e$2) {
						const t$2 = n.getLanguageId(e$2), s = n.getTokenType(e$2), r = n.getFontStyle(e$2), i = n.getForeground(e$2), o = n.getBackground(e$2);
						console.log({
							languageId: t$2,
							tokenType: s,
							fontStyle: r,
							foreground: i,
							background: o
						});
					}, n.getLanguageId = function(e$2) {
						return (255 & e$2) >>> 0;
					}, n.getTokenType = function(e$2) {
						return (768 & e$2) >>> 8;
					}, n.containsBalancedBrackets = function(e$2) {
						return 0 != (1024 & e$2);
					}, n.getFontStyle = function(e$2) {
						return (30720 & e$2) >>> 11;
					}, n.getForeground = function(e$2) {
						return (16744448 & e$2) >>> 15;
					}, n.getBackground = function(e$2) {
						return (4278190080 & e$2) >>> 24;
					}, n.set = function(e$2, t$2, s, r, i, o, c) {
						let a = n.getLanguageId(e$2), l = n.getTokenType(e$2), u = n.containsBalancedBrackets(e$2) ? 1 : 0, h = n.getFontStyle(e$2), p = n.getForeground(e$2), d = n.getBackground(e$2);
						return 0 !== t$2 && (a = t$2), 8 !== s && (l = s), null !== r && (u = r ? 1 : 0), -1 !== i && (h = i), 0 !== o && (p = o), 0 !== c && (d = c), (a << 0 | l << 8 | u << 10 | h << 11 | p << 15 | d << 24) >>> 0;
					}, t$1.toOptionalTokenType = function(e$2) {
						return e$2;
					};
				},
				996: (e$1, t$1, n) => {
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.BasicScopeAttributesProvider = t$1.BasicScopeAttributes = void 0;
					const s = n(878);
					class r {
						constructor(e$2, t$2) {
							this.languageId = e$2, this.tokenType = t$2;
						}
					}
					t$1.BasicScopeAttributes = r;
					class i {
						constructor(e$2, t$2) {
							this._getBasicScopeAttributes = new s.CachedFn((e$3) => {
								const t$3 = this._scopeToLanguage(e$3), n$1 = this._toStandardTokenType(e$3);
								return new r(t$3, n$1);
							}), this._defaultAttributes = new r(e$2, 8), this._embeddedLanguagesMatcher = new o(Object.entries(t$2 || {}));
						}
						getDefaultAttributes() {
							return this._defaultAttributes;
						}
						getBasicScopeAttributes(e$2) {
							return null === e$2 ? i._NULL_SCOPE_METADATA : this._getBasicScopeAttributes.get(e$2);
						}
						_scopeToLanguage(e$2) {
							return this._embeddedLanguagesMatcher.match(e$2) || 0;
						}
						_toStandardTokenType(e$2) {
							const t$2 = e$2.match(i.STANDARD_TOKEN_TYPE_REGEXP);
							if (!t$2) return 8;
							switch (t$2[1]) {
								case "comment": return 1;
								case "string": return 2;
								case "regex": return 3;
								case "meta.embedded": return 0;
							}
							throw new Error("Unexpected match for standard token type!");
						}
					}
					t$1.BasicScopeAttributesProvider = i, i._NULL_SCOPE_METADATA = new r(0, 0), i.STANDARD_TOKEN_TYPE_REGEXP = /\b(comment|string|regex|meta\.embedded)\b/;
					class o {
						constructor(e$2) {
							if (0 === e$2.length) this.values = null, this.scopesRegExp = null;
else {
								this.values = new Map(e$2);
								const t$2 = e$2.map(([e$3, t$3]) => s.escapeRegExpCharacters(e$3));
								t$2.sort(), t$2.reverse(), this.scopesRegExp = new RegExp(`^((${t$2.join(")|(")}))($|\\.)`, "");
							}
						}
						match(e$2) {
							if (!this.scopesRegExp) return;
							const t$2 = e$2.match(this.scopesRegExp);
							return t$2 ? this.values.get(t$2[1]) : void 0;
						}
					}
				},
				947: (e$1, t$1, n) => {
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.LineTokens = t$1.BalancedBracketSelectors = t$1.StateStack = t$1.AttributedScopeStack = t$1.Grammar = t$1.createGrammar = void 0;
					const s = n(350), r = n(36), i = n(736), o = n(44), c = n(792), a = n(583), l = n(878), u = n(996), h = n(47);
					function p(e$2, t$2, n$1, s$1, r$1) {
						const o$1 = i.createMatchers(t$2, d), a$1 = c.RuleFactory.getCompiledRuleId(n$1, s$1, r$1.repository);
						for (const n$2 of o$1) e$2.push({
							debugSelector: t$2,
							matcher: n$2.matcher,
							ruleId: a$1,
							grammar: r$1,
							priority: n$2.priority
						});
					}
					function d(e$2, t$2) {
						if (t$2.length < e$2.length) return !1;
						let n$1 = 0;
						return e$2.every((e$3) => {
							for (let s$1 = n$1; s$1 < t$2.length; s$1++) if (f(t$2[s$1], e$3)) return n$1 = s$1 + 1, !0;
							return !1;
						});
					}
					function f(e$2, t$2) {
						if (!e$2) return !1;
						if (e$2 === t$2) return !0;
						const n$1 = t$2.length;
						return e$2.length > n$1 && e$2.substr(0, n$1) === t$2 && "." === e$2[n$1];
					}
					t$1.createGrammar = function(e$2, t$2, n$1, s$1, r$1, i$1, o$1, c$1) {
						return new g(e$2, t$2, n$1, s$1, r$1, i$1, o$1, c$1);
					};
					class g {
						constructor(e$2, t$2, n$1, s$1, r$1, o$1, c$1, a$1) {
							if (this._rootScopeName = e$2, this.balancedBracketSelectors = o$1, this._onigLib = a$1, this._basicScopeAttributesProvider = new u.BasicScopeAttributesProvider(n$1, s$1), this._rootId = -1, this._lastRuleId = 0, this._ruleId2desc = [null], this._includedGrammars = {}, this._grammarRepository = c$1, this._grammar = m(t$2, null), this._injections = null, this._tokenTypeMatchers = [], r$1) for (const e$3 of Object.keys(r$1)) {
								const t$3 = i.createMatchers(e$3, d);
								for (const n$2 of t$3) this._tokenTypeMatchers.push({
									matcher: n$2.matcher,
									type: r$1[e$3]
								});
							}
						}
						get themeProvider() {
							return this._grammarRepository;
						}
						dispose() {
							for (const e$2 of this._ruleId2desc) e$2 && e$2.dispose();
						}
						createOnigScanner(e$2) {
							return this._onigLib.createOnigScanner(e$2);
						}
						createOnigString(e$2) {
							return this._onigLib.createOnigString(e$2);
						}
						getMetadataForScope(e$2) {
							return this._basicScopeAttributesProvider.getBasicScopeAttributes(e$2);
						}
						_collectInjections() {
							const e$2 = [], t$2 = this._rootScopeName, n$1 = ((e$3) => e$3 === this._rootScopeName ? this._grammar : this.getExternalGrammar(e$3))(t$2);
							if (n$1) {
								const s$1 = n$1.injections;
								if (s$1) for (let t$3 in s$1) p(e$2, t$3, s$1[t$3], this, n$1);
								const r$1 = this._grammarRepository.injections(t$2);
								r$1 && r$1.forEach((t$3) => {
									const n$2 = this.getExternalGrammar(t$3);
									if (n$2) {
										const t$4 = n$2.injectionSelector;
										t$4 && p(e$2, t$4, n$2, this, n$2);
									}
								});
							}
							return e$2.sort((e$3, t$3) => e$3.priority - t$3.priority), e$2;
						}
						getInjections() {
							if (null === this._injections && (this._injections = this._collectInjections(), s.DebugFlags.InDebugMode && this._injections.length > 0)) {
								console.log(`Grammar ${this._rootScopeName} contains the following injections:`);
								for (const e$2 of this._injections) console.log(`  - ${e$2.debugSelector}`);
							}
							return this._injections;
						}
						registerRule(e$2) {
							const t$2 = ++this._lastRuleId, n$1 = e$2(c.ruleIdFromNumber(t$2));
							return this._ruleId2desc[t$2] = n$1, n$1;
						}
						getRule(e$2) {
							return this._ruleId2desc[c.ruleIdToNumber(e$2)];
						}
						getExternalGrammar(e$2, t$2) {
							if (this._includedGrammars[e$2]) return this._includedGrammars[e$2];
							if (this._grammarRepository) {
								const n$1 = this._grammarRepository.lookup(e$2);
								if (n$1) return this._includedGrammars[e$2] = m(n$1, t$2 && t$2.$base), this._includedGrammars[e$2];
							}
						}
						tokenizeLine(e$2, t$2, n$1 = 0) {
							const s$1 = this._tokenize(e$2, t$2, !1, n$1);
							return {
								tokens: s$1.lineTokens.getResult(s$1.ruleStack, s$1.lineLength),
								ruleStack: s$1.ruleStack,
								stoppedEarly: s$1.stoppedEarly
							};
						}
						tokenizeLine2(e$2, t$2, n$1 = 0) {
							const s$1 = this._tokenize(e$2, t$2, !0, n$1);
							return {
								tokens: s$1.lineTokens.getBinaryResult(s$1.ruleStack, s$1.lineLength),
								ruleStack: s$1.ruleStack,
								stoppedEarly: s$1.stoppedEarly
							};
						}
						_tokenize(e$2, t$2, n$1, s$1) {
							let i$1;
							if (-1 === this._rootId && (this._rootId = c.RuleFactory.getCompiledRuleId(this._grammar.repository.$self, this, this._grammar.repository)), t$2 && t$2 !== b.NULL) i$1 = !1, t$2.reset();
else {
								i$1 = !0;
								const e$3 = this._basicScopeAttributesProvider.getDefaultAttributes(), n$2 = this.themeProvider.getDefaults(), s$2 = r.EncodedTokenAttributes.set(0, e$3.languageId, e$3.tokenType, null, n$2.fontStyle, n$2.foregroundId, n$2.backgroundId), o$1 = this.getRule(this._rootId).getName(null, null);
								let c$1;
								c$1 = o$1 ? _.createRootAndLookUpScopeName(o$1, s$2, this) : _.createRoot("unknown", s$2), t$2 = new b(null, this._rootId, -1, -1, !1, null, c$1, c$1);
							}
							e$2 += "\n";
							const a$1 = this.createOnigString(e$2), l$1 = a$1.content.length, u$1 = new y(n$1, e$2, this._tokenTypeMatchers, this.balancedBracketSelectors), p$1 = h._tokenizeString(this, a$1, i$1, 0, t$2, u$1, !0, s$1);
							return o.disposeOnigString(a$1), {
								lineLength: l$1,
								lineTokens: u$1,
								ruleStack: p$1.stack,
								stoppedEarly: p$1.stoppedEarly
							};
						}
					}
					function m(e$2, t$2) {
						return (e$2 = l.clone(e$2)).repository = e$2.repository || {}, e$2.repository.$self = {
							$vscodeTextmateLocation: e$2.$vscodeTextmateLocation,
							patterns: e$2.patterns,
							name: e$2.scopeName
						}, e$2.repository.$base = t$2 || e$2.repository.$self, e$2;
					}
					t$1.Grammar = g;
					class _ {
						constructor(e$2, t$2, n$1) {
							this.parent = e$2, this.scopePath = t$2, this.tokenAttributes = n$1;
						}
						static createRoot(e$2, t$2) {
							return new _(null, new a.ScopeStack(null, e$2), t$2);
						}
						static createRootAndLookUpScopeName(e$2, t$2, n$1) {
							const s$1 = n$1.getMetadataForScope(e$2), r$1 = new a.ScopeStack(null, e$2), i$1 = n$1.themeProvider.themeMatch(r$1), o$1 = _.mergeAttributes(t$2, s$1, i$1);
							return new _(null, r$1, o$1);
						}
						get scopeName() {
							return this.scopePath.scopeName;
						}
						equals(e$2) {
							return _._equals(this, e$2);
						}
						static _equals(e$2, t$2) {
							for (;;) {
								if (e$2 === t$2) return !0;
								if (!e$2 && !t$2) return !0;
								if (!e$2 || !t$2) return !1;
								if (e$2.scopeName !== t$2.scopeName || e$2.tokenAttributes !== t$2.tokenAttributes) return !1;
								e$2 = e$2.parent, t$2 = t$2.parent;
							}
						}
						static mergeAttributes(e$2, t$2, n$1) {
							let s$1 = -1, i$1 = 0, o$1 = 0;
							return null !== n$1 && (s$1 = n$1.fontStyle, i$1 = n$1.foregroundId, o$1 = n$1.backgroundId), r.EncodedTokenAttributes.set(e$2, t$2.languageId, t$2.tokenType, null, s$1, i$1, o$1);
						}
						pushAttributed(e$2, t$2) {
							if (null === e$2) return this;
							if (-1 === e$2.indexOf(" ")) return _._pushAttributed(this, e$2, t$2);
							const n$1 = e$2.split(/ /g);
							let s$1 = this;
							for (const e$3 of n$1) s$1 = _._pushAttributed(s$1, e$3, t$2);
							return s$1;
						}
						static _pushAttributed(e$2, t$2, n$1) {
							const s$1 = n$1.getMetadataForScope(t$2), r$1 = e$2.scopePath.push(t$2), i$1 = n$1.themeProvider.themeMatch(r$1), o$1 = _.mergeAttributes(e$2.tokenAttributes, s$1, i$1);
							return new _(e$2, r$1, o$1);
						}
						getScopeNames() {
							return this.scopePath.getSegments();
						}
					}
					t$1.AttributedScopeStack = _;
					class b {
						constructor(e$2, t$2, n$1, s$1, r$1, i$1, o$1, c$1) {
							this.parent = e$2, this.ruleId = t$2, this.beginRuleCapturedEOL = r$1, this.endRule = i$1, this.nameScopesList = o$1, this.contentNameScopesList = c$1, this._stackElementBrand = void 0, this.depth = this.parent ? this.parent.depth + 1 : 1, this._enterPos = n$1, this._anchorPos = s$1;
						}
						equals(e$2) {
							return null !== e$2 && b._equals(this, e$2);
						}
						static _equals(e$2, t$2) {
							return e$2 === t$2 || !!this._structuralEquals(e$2, t$2) && e$2.contentNameScopesList.equals(t$2.contentNameScopesList);
						}
						static _structuralEquals(e$2, t$2) {
							for (;;) {
								if (e$2 === t$2) return !0;
								if (!e$2 && !t$2) return !0;
								if (!e$2 || !t$2) return !1;
								if (e$2.depth !== t$2.depth || e$2.ruleId !== t$2.ruleId || e$2.endRule !== t$2.endRule) return !1;
								e$2 = e$2.parent, t$2 = t$2.parent;
							}
						}
						clone() {
							return this;
						}
						static _reset(e$2) {
							for (; e$2;) e$2._enterPos = -1, e$2._anchorPos = -1, e$2 = e$2.parent;
						}
						reset() {
							b._reset(this);
						}
						pop() {
							return this.parent;
						}
						safePop() {
							return this.parent ? this.parent : this;
						}
						push(e$2, t$2, n$1, s$1, r$1, i$1, o$1) {
							return new b(this, e$2, t$2, n$1, s$1, r$1, i$1, o$1);
						}
						getEnterPos() {
							return this._enterPos;
						}
						getAnchorPos() {
							return this._anchorPos;
						}
						getRule(e$2) {
							return e$2.getRule(this.ruleId);
						}
						toString() {
							const e$2 = [];
							return this._writeString(e$2, 0), "[" + e$2.join(",") + "]";
						}
						_writeString(e$2, t$2) {
							return this.parent && (t$2 = this.parent._writeString(e$2, t$2)), e$2[t$2++] = `(${this.ruleId}, TODO-${this.nameScopesList}, TODO-${this.contentNameScopesList})`, t$2;
						}
						withContentNameScopesList(e$2) {
							return this.contentNameScopesList === e$2 ? this : this.parent.push(this.ruleId, this._enterPos, this._anchorPos, this.beginRuleCapturedEOL, this.endRule, this.nameScopesList, e$2);
						}
						withEndRule(e$2) {
							return this.endRule === e$2 ? this : new b(this.parent, this.ruleId, this._enterPos, this._anchorPos, this.beginRuleCapturedEOL, e$2, this.nameScopesList, this.contentNameScopesList);
						}
						hasSameRuleAs(e$2) {
							let t$2 = this;
							for (; t$2 && t$2._enterPos === e$2._enterPos;) {
								if (t$2.ruleId === e$2.ruleId) return !0;
								t$2 = t$2.parent;
							}
							return !1;
						}
					}
					t$1.StateStack = b, b.NULL = new b(null, 0, 0, 0, !1, null, null, null), t$1.BalancedBracketSelectors = class {
						constructor(e$2, t$2) {
							this.allowAny = !1, this.balancedBracketScopes = e$2.flatMap((e$3) => "*" === e$3 ? (this.allowAny = !0, []) : i.createMatchers(e$3, d).map((e$4) => e$4.matcher)), this.unbalancedBracketScopes = t$2.flatMap((e$3) => i.createMatchers(e$3, d).map((e$4) => e$4.matcher));
						}
						get matchesAlways() {
							return this.allowAny && 0 === this.unbalancedBracketScopes.length;
						}
						get matchesNever() {
							return 0 === this.balancedBracketScopes.length && !this.allowAny;
						}
						match(e$2) {
							for (const t$2 of this.unbalancedBracketScopes) if (t$2(e$2)) return !1;
							for (const t$2 of this.balancedBracketScopes) if (t$2(e$2)) return !0;
							return this.allowAny;
						}
					};
					class y {
						constructor(e$2, t$2, n$1, r$1) {
							this.balancedBracketSelectors = r$1, this._emitBinaryTokens = e$2, this._tokenTypeOverrides = n$1, s.DebugFlags.InDebugMode ? this._lineText = t$2 : this._lineText = null, this._tokens = [], this._binaryTokens = [], this._lastTokenEndIndex = 0;
						}
						produce(e$2, t$2) {
							this.produceFromScopes(e$2.contentNameScopesList, t$2);
						}
						produceFromScopes(e$2, t$2) {
							if (this._lastTokenEndIndex >= t$2) return;
							if (this._emitBinaryTokens) {
								let n$2 = e$2.tokenAttributes, i$1 = !1;
								if (this.balancedBracketSelectors?.matchesAlways && (i$1 = !0), this._tokenTypeOverrides.length > 0 || this.balancedBracketSelectors && !this.balancedBracketSelectors.matchesAlways && !this.balancedBracketSelectors.matchesNever) {
									const t$3 = e$2.getScopeNames();
									for (const e$3 of this._tokenTypeOverrides) e$3.matcher(t$3) && (n$2 = r.EncodedTokenAttributes.set(n$2, 0, r.toOptionalTokenType(e$3.type), null, -1, 0, 0));
									this.balancedBracketSelectors && (i$1 = this.balancedBracketSelectors.match(t$3));
								}
								if (i$1 && (n$2 = r.EncodedTokenAttributes.set(n$2, 0, 8, i$1, -1, 0, 0)), this._binaryTokens.length > 0 && this._binaryTokens[this._binaryTokens.length - 1] === n$2) return void (this._lastTokenEndIndex = t$2);
								if (s.DebugFlags.InDebugMode) {
									const n$3 = e$2.getScopeNames();
									console.log("  token: |" + this._lineText.substring(this._lastTokenEndIndex, t$2).replace(/\n$/, "\\n") + "|");
									for (let e$3 = 0; e$3 < n$3.length; e$3++) console.log("      * " + n$3[e$3]);
								}
								return this._binaryTokens.push(this._lastTokenEndIndex), this._binaryTokens.push(n$2), void (this._lastTokenEndIndex = t$2);
							}
							const n$1 = e$2.getScopeNames();
							if (s.DebugFlags.InDebugMode) {
								console.log("  token: |" + this._lineText.substring(this._lastTokenEndIndex, t$2).replace(/\n$/, "\\n") + "|");
								for (let e$3 = 0; e$3 < n$1.length; e$3++) console.log("      * " + n$1[e$3]);
							}
							this._tokens.push({
								startIndex: this._lastTokenEndIndex,
								endIndex: t$2,
								scopes: n$1
							}), this._lastTokenEndIndex = t$2;
						}
						getResult(e$2, t$2) {
							return this._tokens.length > 0 && this._tokens[this._tokens.length - 1].startIndex === t$2 - 1 && this._tokens.pop(), 0 === this._tokens.length && (this._lastTokenEndIndex = -1, this.produce(e$2, t$2), this._tokens[this._tokens.length - 1].startIndex = 0), this._tokens;
						}
						getBinaryResult(e$2, t$2) {
							this._binaryTokens.length > 0 && this._binaryTokens[this._binaryTokens.length - 2] === t$2 - 1 && (this._binaryTokens.pop(), this._binaryTokens.pop()), 0 === this._binaryTokens.length && (this._lastTokenEndIndex = -1, this.produce(e$2, t$2), this._binaryTokens[this._binaryTokens.length - 2] = 0);
							const n$1 = new Uint32Array(this._binaryTokens.length);
							for (let e$3 = 0, t$3 = this._binaryTokens.length; e$3 < t$3; e$3++) n$1[e$3] = this._binaryTokens[e$3];
							return n$1;
						}
					}
					t$1.LineTokens = y;
				},
				965: (e$1, t$1, n) => {
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.parseInclude = t$1.TopLevelRepositoryReference = t$1.TopLevelReference = t$1.RelativeReference = t$1.SelfReference = t$1.BaseReference = t$1.ScopeDependencyProcessor = t$1.ExternalReferenceCollector = t$1.TopLevelRepositoryRuleReference = t$1.TopLevelRuleReference = void 0;
					const s = n(878);
					class r {
						constructor(e$2) {
							this.scopeName = e$2;
						}
						toKey() {
							return this.scopeName;
						}
					}
					t$1.TopLevelRuleReference = r;
					class i {
						constructor(e$2, t$2) {
							this.scopeName = e$2, this.ruleName = t$2;
						}
						toKey() {
							return `${this.scopeName}#${this.ruleName}`;
						}
					}
					t$1.TopLevelRepositoryRuleReference = i;
					class o {
						constructor() {
							this._references = [], this._seenReferenceKeys = new Set(), this.visitedRule = new Set();
						}
						get references() {
							return this._references;
						}
						add(e$2) {
							const t$2 = e$2.toKey();
							this._seenReferenceKeys.has(t$2) || (this._seenReferenceKeys.add(t$2), this._references.push(e$2));
						}
					}
					function c(e$2, t$2, n$1, s$1) {
						const i$1 = n$1.lookup(e$2.scopeName);
						if (!i$1) {
							if (e$2.scopeName === t$2) throw new Error(`No grammar provided for <${t$2}>`);
							return;
						}
						const o$1 = n$1.lookup(t$2);
						e$2 instanceof r ? l({
							baseGrammar: o$1,
							selfGrammar: i$1
						}, s$1) : a(e$2.ruleName, {
							baseGrammar: o$1,
							selfGrammar: i$1,
							repository: i$1.repository
						}, s$1);
						const c$1 = n$1.injections(e$2.scopeName);
						if (c$1) for (const e$3 of c$1) s$1.add(new r(e$3));
					}
					function a(e$2, t$2, n$1) {
						t$2.repository && t$2.repository[e$2] && u([t$2.repository[e$2]], t$2, n$1);
					}
					function l(e$2, t$2) {
						e$2.selfGrammar.patterns && Array.isArray(e$2.selfGrammar.patterns) && u(e$2.selfGrammar.patterns, {
							...e$2,
							repository: e$2.selfGrammar.repository
						}, t$2), e$2.selfGrammar.injections && u(Object.values(e$2.selfGrammar.injections), {
							...e$2,
							repository: e$2.selfGrammar.repository
						}, t$2);
					}
					function u(e$2, t$2, n$1) {
						for (const o$1 of e$2) {
							if (n$1.visitedRule.has(o$1)) continue;
							n$1.visitedRule.add(o$1);
							const e$3 = o$1.repository ? s.mergeObjects({}, t$2.repository, o$1.repository) : t$2.repository;
							Array.isArray(o$1.patterns) && u(o$1.patterns, {
								...t$2,
								repository: e$3
							}, n$1);
							const c$1 = o$1.include;
							if (!c$1) continue;
							const h$1 = m(c$1);
							switch (h$1.kind) {
								case 0:
									l({
										...t$2,
										selfGrammar: t$2.baseGrammar
									}, n$1);
									break;
								case 1:
									l(t$2, n$1);
									break;
								case 2:
									a(h$1.ruleName, {
										...t$2,
										repository: e$3
									}, n$1);
									break;
								case 3:
								case 4:
									const s$1 = h$1.scopeName === t$2.selfGrammar.scopeName ? t$2.selfGrammar : h$1.scopeName === t$2.baseGrammar.scopeName ? t$2.baseGrammar : void 0;
									if (s$1) {
										const r$1 = {
											baseGrammar: t$2.baseGrammar,
											selfGrammar: s$1,
											repository: e$3
										};
										4 === h$1.kind ? a(h$1.ruleName, r$1, n$1) : l(r$1, n$1);
									} else 4 === h$1.kind ? n$1.add(new i(h$1.scopeName, h$1.ruleName)) : n$1.add(new r(h$1.scopeName));
							}
						}
					}
					t$1.ExternalReferenceCollector = o, t$1.ScopeDependencyProcessor = class {
						constructor(e$2, t$2) {
							this.repo = e$2, this.initialScopeName = t$2, this.seenFullScopeRequests = new Set(), this.seenPartialScopeRequests = new Set(), this.seenFullScopeRequests.add(this.initialScopeName), this.Q = [new r(this.initialScopeName)];
						}
						processQueue() {
							const e$2 = this.Q;
							this.Q = [];
							const t$2 = new o();
							for (const n$1 of e$2) c(n$1, this.initialScopeName, this.repo, t$2);
							for (const e$3 of t$2.references) if (e$3 instanceof r) {
								if (this.seenFullScopeRequests.has(e$3.scopeName)) continue;
								this.seenFullScopeRequests.add(e$3.scopeName), this.Q.push(e$3);
							} else {
								if (this.seenFullScopeRequests.has(e$3.scopeName)) continue;
								if (this.seenPartialScopeRequests.has(e$3.toKey())) continue;
								this.seenPartialScopeRequests.add(e$3.toKey()), this.Q.push(e$3);
							}
						}
					};
					class h {
						constructor() {
							this.kind = 0;
						}
					}
					t$1.BaseReference = h;
					class p {
						constructor() {
							this.kind = 1;
						}
					}
					t$1.SelfReference = p;
					class d {
						constructor(e$2) {
							this.ruleName = e$2, this.kind = 2;
						}
					}
					t$1.RelativeReference = d;
					class f {
						constructor(e$2) {
							this.scopeName = e$2, this.kind = 3;
						}
					}
					t$1.TopLevelReference = f;
					class g {
						constructor(e$2, t$2) {
							this.scopeName = e$2, this.ruleName = t$2, this.kind = 4;
						}
					}
					function m(e$2) {
						if ("$base" === e$2) return new h();
						if ("$self" === e$2) return new p();
						const t$2 = e$2.indexOf("#");
						if (-1 === t$2) return new f(e$2);
						if (0 === t$2) return new d(e$2.substring(1));
						{
							const n$1 = e$2.substring(0, t$2), s$1 = e$2.substring(t$2 + 1);
							return new g(n$1, s$1);
						}
					}
					t$1.TopLevelRepositoryReference = g, t$1.parseInclude = m;
				},
				391: function(e$1, t$1, n) {
					var s = this && this.__createBinding || (Object.create ? function(e$2, t$2, n$1, s$1) {
						void 0 === s$1 && (s$1 = n$1), Object.defineProperty(e$2, s$1, {
							enumerable: !0,
							get: function() {
								return t$2[n$1];
							}
						});
					} : function(e$2, t$2, n$1, s$1) {
						void 0 === s$1 && (s$1 = n$1), e$2[s$1] = t$2[n$1];
					}), r = this && this.__exportStar || function(e$2, t$2) {
						for (var n$1 in e$2) "default" === n$1 || Object.prototype.hasOwnProperty.call(t$2, n$1) || s(t$2, e$2, n$1);
					};
					Object.defineProperty(t$1, "__esModule", { value: !0 }), r(n(947), t$1);
				},
				47: (e$1, t$1, n) => {
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.LocalStackElement = t$1._tokenizeString = void 0;
					const s = n(350), r = n(44), i = n(792), o = n(878);
					class c {
						constructor(e$2, t$2) {
							this.stack = e$2, this.stoppedEarly = t$2;
						}
					}
					function a(e$2, t$2, n$1, r$1, a$1, h$1, d$1, f) {
						const g = t$2.content.length;
						let m = !1, _ = -1;
						if (d$1) {
							const o$1 = function(e$3, t$3, n$2, r$2, o$2, c$1) {
								let a$2 = o$2.beginRuleCapturedEOL ? 0 : -1;
								const l$1 = [];
								for (let t$4 = o$2; t$4; t$4 = t$4.pop()) {
									const n$3 = t$4.getRule(e$3);
									n$3 instanceof i.BeginWhileRule && l$1.push({
										rule: n$3,
										stack: t$4
									});
								}
								for (let h$2 = l$1.pop(); h$2; h$2 = l$1.pop()) {
									const { ruleScanner: l$2, findOptions: d$2 } = u(h$2.rule, e$3, h$2.stack.endRule, n$2, r$2 === a$2), f$1 = l$2.findNextMatchSync(t$3, r$2, d$2);
									if (s.DebugFlags.InDebugMode && (console.log("  scanning for while rule"), console.log(l$2.toString())), !f$1) {
										s.DebugFlags.InDebugMode && console.log("  popping " + h$2.rule.debugName + " - " + h$2.rule.debugWhileRegExp), o$2 = h$2.stack.pop();
										break;
									}
									if (f$1.ruleId !== i.whileRuleId) {
										o$2 = h$2.stack.pop();
										break;
									}
									f$1.captureIndices && f$1.captureIndices.length && (c$1.produce(h$2.stack, f$1.captureIndices[0].start), p(e$3, t$3, n$2, h$2.stack, c$1, h$2.rule.whileCaptures, f$1.captureIndices), c$1.produce(h$2.stack, f$1.captureIndices[0].end), a$2 = f$1.captureIndices[0].end, f$1.captureIndices[0].end > r$2 && (r$2 = f$1.captureIndices[0].end, n$2 = !1));
								}
								return {
									stack: o$2,
									linePos: r$2,
									anchorPosition: a$2,
									isFirstLine: n$2
								};
							}(e$2, t$2, n$1, r$1, a$1, h$1);
							a$1 = o$1.stack, r$1 = o$1.linePos, n$1 = o$1.isFirstLine, _ = o$1.anchorPosition;
						}
						const b = Date.now();
						for (; !m;) {
							if (0 !== f && Date.now() - b > f) return new c(a$1, !0);
							y();
						}
						return new c(a$1, !1);
						function y() {
							s.DebugFlags.InDebugMode && (console.log(""), console.log(`@@scanNext ${r$1}: |${t$2.content.substr(r$1).replace(/\n$/, "\\n")}|`));
							const c$1 = function(e$3, t$3, n$2, r$2, i$1, c$2) {
								const a$2 = function(e$4, t$4, n$3, r$3, i$2, c$3) {
									const a$3 = i$2.getRule(e$4), { ruleScanner: u$3, findOptions: h$3 } = l(a$3, e$4, i$2.endRule, n$3, r$3 === c$3);
									let p$2 = 0;
									s.DebugFlags.InDebugMode && (p$2 = o.performanceNow());
									const d$4 = u$3.findNextMatchSync(t$4, r$3, h$3);
									if (s.DebugFlags.InDebugMode) {
										const e$5 = o.performanceNow() - p$2;
										e$5 > 5 && console.warn(`Rule ${a$3.debugName} (${a$3.id}) matching took ${e$5} against '${t$4}'`), console.log(`  scanning for (linePos: ${r$3}, anchorPosition: ${c$3})`), console.log(u$3.toString()), d$4 && console.log(`matched rule id: ${d$4.ruleId} from ${d$4.captureIndices[0].start} to ${d$4.captureIndices[0].end}`);
									}
									return d$4 ? {
										captureIndices: d$4.captureIndices,
										matchedRuleId: d$4.ruleId
									} : null;
								}(e$3, t$3, n$2, r$2, i$1, c$2), u$2 = e$3.getInjections();
								if (0 === u$2.length) return a$2;
								const h$2 = function(e$4, t$4, n$3, r$3, i$2, o$1, c$3) {
									let a$3, u$3 = Number.MAX_VALUE, h$3 = null, p$2 = 0;
									const d$4 = o$1.contentNameScopesList.getScopeNames();
									for (let o$2 = 0, f$2 = e$4.length; o$2 < f$2; o$2++) {
										const f$3 = e$4[o$2];
										if (!f$3.matcher(d$4)) continue;
										const g$1 = t$4.getRule(f$3.ruleId), { ruleScanner: m$1, findOptions: _$1 } = l(g$1, t$4, null, r$3, i$2 === c$3), b$1 = m$1.findNextMatchSync(n$3, i$2, _$1);
										if (!b$1) continue;
										s.DebugFlags.InDebugMode && (console.log(`  matched injection: ${f$3.debugSelector}`), console.log(m$1.toString()));
										const y$1 = b$1.captureIndices[0].start;
										if (!(y$1 >= u$3) && (u$3 = y$1, h$3 = b$1.captureIndices, a$3 = b$1.ruleId, p$2 = f$3.priority, u$3 === i$2)) break;
									}
									return h$3 ? {
										priorityMatch: -1 === p$2,
										captureIndices: h$3,
										matchedRuleId: a$3
									} : null;
								}(u$2, e$3, t$3, n$2, r$2, i$1, c$2);
								if (!h$2) return a$2;
								if (!a$2) return h$2;
								const p$1 = a$2.captureIndices[0].start, d$3 = h$2.captureIndices[0].start;
								return d$3 < p$1 || h$2.priorityMatch && d$3 === p$1 ? h$2 : a$2;
							}(e$2, t$2, n$1, r$1, a$1, _);
							if (!c$1) return s.DebugFlags.InDebugMode && console.log("  no more matches."), h$1.produce(a$1, g), void (m = !0);
							const u$1 = c$1.captureIndices, d$2 = c$1.matchedRuleId, f$1 = !!(u$1 && u$1.length > 0) && u$1[0].end > r$1;
							if (d$2 === i.endRuleId) {
								const i$1 = a$1.getRule(e$2);
								s.DebugFlags.InDebugMode && console.log("  popping " + i$1.debugName + " - " + i$1.debugEndRegExp), h$1.produce(a$1, u$1[0].start), a$1 = a$1.withContentNameScopesList(a$1.nameScopesList), p(e$2, t$2, n$1, a$1, h$1, i$1.endCaptures, u$1), h$1.produce(a$1, u$1[0].end);
								const o$1 = a$1;
								if (a$1 = a$1.parent, _ = o$1.getAnchorPos(), !f$1 && o$1.getEnterPos() === r$1) return s.DebugFlags.InDebugMode && console.error("[1] - Grammar is in an endless loop - Grammar pushed & popped a rule without advancing"), a$1 = o$1, h$1.produce(a$1, g), void (m = !0);
							} else {
								const o$1 = e$2.getRule(d$2);
								h$1.produce(a$1, u$1[0].start);
								const c$2 = a$1, l$1 = o$1.getName(t$2.content, u$1), b$1 = a$1.contentNameScopesList.pushAttributed(l$1, e$2);
								if (a$1 = a$1.push(d$2, r$1, _, u$1[0].end === g, null, b$1, b$1), o$1 instanceof i.BeginEndRule) {
									const r$2 = o$1;
									s.DebugFlags.InDebugMode && console.log("  pushing " + r$2.debugName + " - " + r$2.debugBeginRegExp), p(e$2, t$2, n$1, a$1, h$1, r$2.beginCaptures, u$1), h$1.produce(a$1, u$1[0].end), _ = u$1[0].end;
									const i$1 = r$2.getContentName(t$2.content, u$1), l$2 = b$1.pushAttributed(i$1, e$2);
									if (a$1 = a$1.withContentNameScopesList(l$2), r$2.endHasBackReferences && (a$1 = a$1.withEndRule(r$2.getEndWithResolvedBackReferences(t$2.content, u$1))), !f$1 && c$2.hasSameRuleAs(a$1)) return s.DebugFlags.InDebugMode && console.error("[2] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"), a$1 = a$1.pop(), h$1.produce(a$1, g), void (m = !0);
								} else if (o$1 instanceof i.BeginWhileRule) {
									const r$2 = o$1;
									s.DebugFlags.InDebugMode && console.log("  pushing " + r$2.debugName), p(e$2, t$2, n$1, a$1, h$1, r$2.beginCaptures, u$1), h$1.produce(a$1, u$1[0].end), _ = u$1[0].end;
									const i$1 = r$2.getContentName(t$2.content, u$1), l$2 = b$1.pushAttributed(i$1, e$2);
									if (a$1 = a$1.withContentNameScopesList(l$2), r$2.whileHasBackReferences && (a$1 = a$1.withEndRule(r$2.getWhileWithResolvedBackReferences(t$2.content, u$1))), !f$1 && c$2.hasSameRuleAs(a$1)) return s.DebugFlags.InDebugMode && console.error("[3] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"), a$1 = a$1.pop(), h$1.produce(a$1, g), void (m = !0);
								} else {
									const r$2 = o$1;
									if (s.DebugFlags.InDebugMode && console.log("  matched " + r$2.debugName + " - " + r$2.debugMatchRegExp), p(e$2, t$2, n$1, a$1, h$1, r$2.captures, u$1), h$1.produce(a$1, u$1[0].end), a$1 = a$1.pop(), !f$1) return s.DebugFlags.InDebugMode && console.error("[4] - Grammar is in an endless loop - Grammar is not advancing, nor is it pushing/popping"), a$1 = a$1.safePop(), h$1.produce(a$1, g), void (m = !0);
								}
							}
							u$1[0].end > r$1 && (r$1 = u$1[0].end, n$1 = !1);
						}
					}
					function l(e$2, t$2, n$1, r$1, i$1) {
						return s.UseOnigurumaFindOptions ? {
							ruleScanner: e$2.compile(t$2, n$1),
							findOptions: h(r$1, i$1)
						} : {
							ruleScanner: e$2.compileAG(t$2, n$1, r$1, i$1),
							findOptions: 0
						};
					}
					function u(e$2, t$2, n$1, r$1, i$1) {
						return s.UseOnigurumaFindOptions ? {
							ruleScanner: e$2.compileWhile(t$2, n$1),
							findOptions: h(r$1, i$1)
						} : {
							ruleScanner: e$2.compileWhileAG(t$2, n$1, r$1, i$1),
							findOptions: 0
						};
					}
					function h(e$2, t$2) {
						let n$1 = 0;
						return e$2 || (n$1 |= 1), t$2 || (n$1 |= 4), n$1;
					}
					function p(e$2, t$2, n$1, s$1, i$1, o$1, c$1) {
						if (0 === o$1.length) return;
						const l$1 = t$2.content, u$1 = Math.min(o$1.length, c$1.length), h$1 = [], p$1 = c$1[0].end;
						for (let t$3 = 0; t$3 < u$1; t$3++) {
							const u$2 = o$1[t$3];
							if (null === u$2) continue;
							const f = c$1[t$3];
							if (0 === f.length) continue;
							if (f.start > p$1) break;
							for (; h$1.length > 0 && h$1[h$1.length - 1].endPos <= f.start;) i$1.produceFromScopes(h$1[h$1.length - 1].scopes, h$1[h$1.length - 1].endPos), h$1.pop();
							if (h$1.length > 0 ? i$1.produceFromScopes(h$1[h$1.length - 1].scopes, f.start) : i$1.produce(s$1, f.start), u$2.retokenizeCapturedWithRuleId) {
								const t$4 = u$2.getName(l$1, c$1), o$2 = s$1.contentNameScopesList.pushAttributed(t$4, e$2), h$2 = u$2.getContentName(l$1, c$1), p$2 = o$2.pushAttributed(h$2, e$2), d$1 = s$1.push(u$2.retokenizeCapturedWithRuleId, f.start, -1, !1, null, o$2, p$2), g$1 = e$2.createOnigString(l$1.substring(0, f.end));
								a(e$2, g$1, n$1 && 0 === f.start, f.start, d$1, i$1, !1, 0), r.disposeOnigString(g$1);
								continue;
							}
							const g = u$2.getName(l$1, c$1);
							if (null !== g) {
								const t$4 = (h$1.length > 0 ? h$1[h$1.length - 1].scopes : s$1.contentNameScopesList).pushAttributed(g, e$2);
								h$1.push(new d(t$4, f.end));
							}
						}
						for (; h$1.length > 0;) i$1.produceFromScopes(h$1[h$1.length - 1].scopes, h$1[h$1.length - 1].endPos), h$1.pop();
					}
					t$1._tokenizeString = a;
					class d {
						constructor(e$2, t$2) {
							this.scopes = e$2, this.endPos = t$2;
						}
					}
					t$1.LocalStackElement = d;
				},
				974: (e$1, t$1) => {
					function n(e$2, t$2) {
						throw new Error("Near offset " + e$2.pos + ": " + t$2 + " ~~~" + e$2.source.substr(e$2.pos, 50) + "~~~");
					}
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.parseJSON = void 0, t$1.parseJSON = function(e$2, t$2, o) {
						let c = new s(e$2), a = new r(), l = 0, u = null, h = [], p = [];
						function d() {
							h.push(l), p.push(u);
						}
						function f() {
							l = h.pop(), u = p.pop();
						}
						function g(e$3) {
							n(c, e$3);
						}
						for (; i(c, a);) {
							if (0 === l) {
								if (null !== u && g("too many constructs in root"), 3 === a.type) {
									u = {}, o && (u.$vscodeTextmateLocation = a.toLocation(t$2)), d(), l = 1;
									continue;
								}
								if (2 === a.type) {
									u = [], d(), l = 4;
									continue;
								}
								g("unexpected token in root");
							}
							if (2 === l) {
								if (5 === a.type) {
									f();
									continue;
								}
								if (7 === a.type) {
									l = 3;
									continue;
								}
								g("expected , or }");
							}
							if (1 === l || 3 === l) {
								if (1 === l && 5 === a.type) {
									f();
									continue;
								}
								if (1 === a.type) {
									let e$3 = a.value;
									if (i(c, a) && 6 === a.type || g("expected colon"), i(c, a) || g("expected value"), l = 2, 1 === a.type) {
										u[e$3] = a.value;
										continue;
									}
									if (8 === a.type) {
										u[e$3] = null;
										continue;
									}
									if (9 === a.type) {
										u[e$3] = !0;
										continue;
									}
									if (10 === a.type) {
										u[e$3] = !1;
										continue;
									}
									if (11 === a.type) {
										u[e$3] = parseFloat(a.value);
										continue;
									}
									if (2 === a.type) {
										let t$3 = [];
										u[e$3] = t$3, d(), l = 4, u = t$3;
										continue;
									}
									if (3 === a.type) {
										let n$1 = {};
										o && (n$1.$vscodeTextmateLocation = a.toLocation(t$2)), u[e$3] = n$1, d(), l = 1, u = n$1;
										continue;
									}
								}
								g("unexpected token in dict");
							}
							if (5 === l) {
								if (4 === a.type) {
									f();
									continue;
								}
								if (7 === a.type) {
									l = 6;
									continue;
								}
								g("expected , or ]");
							}
							if (4 === l || 6 === l) {
								if (4 === l && 4 === a.type) {
									f();
									continue;
								}
								if (l = 5, 1 === a.type) {
									u.push(a.value);
									continue;
								}
								if (8 === a.type) {
									u.push(null);
									continue;
								}
								if (9 === a.type) {
									u.push(!0);
									continue;
								}
								if (10 === a.type) {
									u.push(!1);
									continue;
								}
								if (11 === a.type) {
									u.push(parseFloat(a.value));
									continue;
								}
								if (2 === a.type) {
									let e$3 = [];
									u.push(e$3), d(), l = 4, u = e$3;
									continue;
								}
								if (3 === a.type) {
									let e$3 = {};
									o && (e$3.$vscodeTextmateLocation = a.toLocation(t$2)), u.push(e$3), d(), l = 1, u = e$3;
									continue;
								}
								g("unexpected token in array");
							}
							g("unknown state");
						}
						return 0 !== p.length && g("unclosed constructs"), u;
					};
					class s {
						constructor(e$2) {
							this.source = e$2, this.pos = 0, this.len = e$2.length, this.line = 1, this.char = 0;
						}
					}
					class r {
						constructor() {
							this.value = null, this.type = 0, this.offset = -1, this.len = -1, this.line = -1, this.char = -1;
						}
						toLocation(e$2) {
							return {
								filename: e$2,
								line: this.line,
								char: this.char
							};
						}
					}
					function i(e$2, t$2) {
						t$2.value = null, t$2.type = 0, t$2.offset = -1, t$2.len = -1, t$2.line = -1, t$2.char = -1;
						let s$1, r$1 = e$2.source, i$1 = e$2.pos, o = e$2.len, c = e$2.line, a = e$2.char;
						for (;;) {
							if (i$1 >= o) return !1;
							if (s$1 = r$1.charCodeAt(i$1), 32 !== s$1 && 9 !== s$1 && 13 !== s$1) {
								if (10 !== s$1) break;
								i$1++, c++, a = 0;
							} else i$1++, a++;
						}
						if (t$2.offset = i$1, t$2.line = c, t$2.char = a, 34 === s$1) {
							for (t$2.type = 1, i$1++, a++;;) {
								if (i$1 >= o) return !1;
								if (s$1 = r$1.charCodeAt(i$1), i$1++, a++, 92 !== s$1) {
									if (34 === s$1) break;
								} else i$1++, a++;
							}
							t$2.value = r$1.substring(t$2.offset + 1, i$1 - 1).replace(/\\u([0-9A-Fa-f]{4})/g, (e$3, t$3) => String.fromCodePoint(parseInt(t$3, 16))).replace(/\\(.)/g, (t$3, s$2) => {
								switch (s$2) {
									case "\"": return "\"";
									case "\\": return "\\";
									case "/": return "/";
									case "b": return "\b";
									case "f": return "\f";
									case "n": return "\n";
									case "r": return "\r";
									case "t": return "	";
									default: n(e$2, "invalid escape sequence");
								}
								throw new Error("unreachable");
							});
						} else if (91 === s$1) t$2.type = 2, i$1++, a++;
else if (123 === s$1) t$2.type = 3, i$1++, a++;
else if (93 === s$1) t$2.type = 4, i$1++, a++;
else if (125 === s$1) t$2.type = 5, i$1++, a++;
else if (58 === s$1) t$2.type = 6, i$1++, a++;
else if (44 === s$1) t$2.type = 7, i$1++, a++;
else if (110 === s$1) {
							if (t$2.type = 8, i$1++, a++, s$1 = r$1.charCodeAt(i$1), 117 !== s$1) return !1;
							if (i$1++, a++, s$1 = r$1.charCodeAt(i$1), 108 !== s$1) return !1;
							if (i$1++, a++, s$1 = r$1.charCodeAt(i$1), 108 !== s$1) return !1;
							i$1++, a++;
						} else if (116 === s$1) {
							if (t$2.type = 9, i$1++, a++, s$1 = r$1.charCodeAt(i$1), 114 !== s$1) return !1;
							if (i$1++, a++, s$1 = r$1.charCodeAt(i$1), 117 !== s$1) return !1;
							if (i$1++, a++, s$1 = r$1.charCodeAt(i$1), 101 !== s$1) return !1;
							i$1++, a++;
						} else if (102 === s$1) {
							if (t$2.type = 10, i$1++, a++, s$1 = r$1.charCodeAt(i$1), 97 !== s$1) return !1;
							if (i$1++, a++, s$1 = r$1.charCodeAt(i$1), 108 !== s$1) return !1;
							if (i$1++, a++, s$1 = r$1.charCodeAt(i$1), 115 !== s$1) return !1;
							if (i$1++, a++, s$1 = r$1.charCodeAt(i$1), 101 !== s$1) return !1;
							i$1++, a++;
						} else for (t$2.type = 11;;) {
							if (i$1 >= o) return !1;
							if (s$1 = r$1.charCodeAt(i$1), !(46 === s$1 || s$1 >= 48 && s$1 <= 57 || 101 === s$1 || 69 === s$1 || 45 === s$1 || 43 === s$1)) break;
							i$1++, a++;
						}
						return t$2.len = i$1 - t$2.offset, null === t$2.value && (t$2.value = r$1.substr(t$2.offset, t$2.len)), e$2.pos = i$1, e$2.line = c, e$2.char = a, !0;
					}
				},
				787: function(e$1, t$1, n) {
					var s = this && this.__createBinding || (Object.create ? function(e$2, t$2, n$1, s$1) {
						void 0 === s$1 && (s$1 = n$1), Object.defineProperty(e$2, s$1, {
							enumerable: !0,
							get: function() {
								return t$2[n$1];
							}
						});
					} : function(e$2, t$2, n$1, s$1) {
						void 0 === s$1 && (s$1 = n$1), e$2[s$1] = t$2[n$1];
					}), r = this && this.__exportStar || function(e$2, t$2) {
						for (var n$1 in e$2) "default" === n$1 || Object.prototype.hasOwnProperty.call(t$2, n$1) || s(t$2, e$2, n$1);
					};
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.parseRawGrammar = t$1.INITIAL = t$1.Registry = void 0;
					const i = n(391), o = n(50), c = n(652), a = n(583), l = n(965);
					r(n(44), t$1), t$1.Registry = class {
						constructor(e$2) {
							this._options = e$2, this._syncRegistry = new c.SyncRegistry(a.Theme.createFromRawTheme(e$2.theme, e$2.colorMap), e$2.onigLib), this._ensureGrammarCache = new Map();
						}
						dispose() {
							this._syncRegistry.dispose();
						}
						setTheme(e$2, t$2) {
							this._syncRegistry.setTheme(a.Theme.createFromRawTheme(e$2, t$2));
						}
						getColorMap() {
							return this._syncRegistry.getColorMap();
						}
						loadGrammarWithEmbeddedLanguages(e$2, t$2, n$1) {
							return this.loadGrammarWithConfiguration(e$2, t$2, { embeddedLanguages: n$1 });
						}
						loadGrammarWithConfiguration(e$2, t$2, n$1) {
							return this._loadGrammar(e$2, t$2, n$1.embeddedLanguages, n$1.tokenTypes, new i.BalancedBracketSelectors(n$1.balancedBracketSelectors || [], n$1.unbalancedBracketSelectors || []));
						}
						loadGrammar(e$2) {
							return this._loadGrammar(e$2, 0, null, null, null);
						}
						async _loadGrammar(e$2, t$2, n$1, s$1, r$1) {
							const i$1 = new l.ScopeDependencyProcessor(this._syncRegistry, e$2);
							for (; i$1.Q.length > 0;) await Promise.all(i$1.Q.map((e$3) => this._loadSingleGrammar(e$3.scopeName))), i$1.processQueue();
							return this._grammarForScopeName(e$2, t$2, n$1, s$1, r$1);
						}
						async _loadSingleGrammar(e$2) {
							return this._ensureGrammarCache.has(e$2) || this._ensureGrammarCache.set(e$2, this._doLoadSingleGrammar(e$2)), this._ensureGrammarCache.get(e$2);
						}
						async _doLoadSingleGrammar(e$2) {
							const t$2 = await this._options.loadGrammar(e$2);
							if (t$2) {
								const n$1 = "function" == typeof this._options.getInjections ? this._options.getInjections(e$2) : void 0;
								this._syncRegistry.addGrammar(t$2, n$1);
							}
						}
						async addGrammar(e$2, t$2 = [], n$1 = 0, s$1 = null) {
							return this._syncRegistry.addGrammar(e$2, t$2), await this._grammarForScopeName(e$2.scopeName, n$1, s$1);
						}
						_grammarForScopeName(e$2, t$2 = 0, n$1 = null, s$1 = null, r$1 = null) {
							return this._syncRegistry.grammarForScopeName(e$2, t$2, n$1, s$1, r$1);
						}
					}, t$1.INITIAL = i.StateStack.NULL, t$1.parseRawGrammar = o.parseRawGrammar;
				},
				736: (e$1, t$1) => {
					function n(e$2) {
						return !!e$2 && !!e$2.match(/[\w\.:]+/);
					}
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.createMatchers = void 0, t$1.createMatchers = function(e$2, t$2) {
						const s = [], r = function(e$3) {
							let t$3 = /([LR]:|[\w\.:][\w\.:\-]*|[\,\|\-\(\)])/g, n$1 = t$3.exec(e$3);
							return { next: () => {
								if (!n$1) return null;
								const s$1 = n$1[0];
								return n$1 = t$3.exec(e$3), s$1;
							} };
						}(e$2);
						let i = r.next();
						for (; null !== i;) {
							let e$3 = 0;
							if (2 === i.length && ":" === i.charAt(1)) {
								switch (i.charAt(0)) {
									case "R":
										e$3 = 1;
										break;
									case "L":
										e$3 = -1;
										break;
									default: console.log(`Unknown priority ${i} in scope selector`);
								}
								i = r.next();
							}
							let t$3 = c();
							if (s.push({
								matcher: t$3,
								priority: e$3
							}), "," !== i) break;
							i = r.next();
						}
						return s;
						function o() {
							if ("-" === i) {
								i = r.next();
								const e$3 = o();
								return (t$3) => !!e$3 && !e$3(t$3);
							}
							if ("(" === i) {
								i = r.next();
								const e$3 = function() {
									const e$4 = [];
									let t$3 = c();
									for (; t$3 && (e$4.push(t$3), "|" === i || "," === i);) {
										do 
											i = r.next();
										while ("|" === i || "," === i);
										t$3 = c();
									}
									return (t$4) => e$4.some((e$5) => e$5(t$4));
								}();
								return ")" === i && (i = r.next()), e$3;
							}
							if (n(i)) {
								const e$3 = [];
								do 
									e$3.push(i), i = r.next();
								while (n(i));
								return (n$1) => t$2(e$3, n$1);
							}
							return null;
						}
						function c() {
							const e$3 = [];
							let t$3 = o();
							for (; t$3;) e$3.push(t$3), t$3 = o();
							return (t$4) => e$3.every((e$4) => e$4(t$4));
						}
					};
				},
				44: (e$1, t$1) => {
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.disposeOnigString = void 0, t$1.disposeOnigString = function(e$2) {
						"function" == typeof e$2.dispose && e$2.dispose();
					};
				},
				50: (e$1, t$1, n) => {
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.parseRawGrammar = void 0;
					const s = n(69), r = n(350), i = n(974);
					t$1.parseRawGrammar = function(e$2, t$2 = null) {
						return null !== t$2 && /\.json$/.test(t$2) ? (n$1 = e$2, o = t$2, r.DebugFlags.InDebugMode ? i.parseJSON(n$1, o, !0) : JSON.parse(n$1)) : function(e$3, t$3) {
							return r.DebugFlags.InDebugMode ? s.parseWithLocation(e$3, t$3, "$vscodeTextmateLocation") : s.parsePLIST(e$3);
						}(e$2, t$2);
						var n$1, o;
					};
				},
				69: (e$1, t$1) => {
					function n(e$2, t$2, n$1) {
						const s = e$2.length;
						let r = 0, i = 1, o = 0;
						function c(t$3) {
							if (null === n$1) r += t$3;
else for (; t$3 > 0;) 10 === e$2.charCodeAt(r) ? (r++, i++, o = 0) : (r++, o++), t$3--;
						}
						function a(e$3) {
							null === n$1 ? r = e$3 : c(e$3 - r);
						}
						function l() {
							for (; r < s;) {
								let t$3 = e$2.charCodeAt(r);
								if (32 !== t$3 && 9 !== t$3 && 13 !== t$3 && 10 !== t$3) break;
								c(1);
							}
						}
						function u(t$3) {
							return e$2.substr(r, t$3.length) === t$3 && (c(t$3.length), !0);
						}
						function h(t$3) {
							let n$2 = e$2.indexOf(t$3, r);
							a(-1 !== n$2 ? n$2 + t$3.length : s);
						}
						function p(t$3) {
							let n$2 = e$2.indexOf(t$3, r);
							if (-1 !== n$2) {
								let s$1 = e$2.substring(r, n$2);
								return a(n$2 + t$3.length), s$1;
							}
							{
								let t$4 = e$2.substr(r);
								return a(s), t$4;
							}
						}
						s > 0 && 65279 === e$2.charCodeAt(0) && (r = 1);
						let d = 0, f = null, g = [], m = [], _ = null;
						function b(e$3, t$3) {
							g.push(d), m.push(f), d = e$3, f = t$3;
						}
						function y() {
							if (0 === g.length) return S("illegal state stack");
							d = g.pop(), f = m.pop();
						}
						function S(t$3) {
							throw new Error("Near offset " + r + ": " + t$3 + " ~~~" + e$2.substr(r, 50) + "~~~");
						}
						const k = function() {
							if (null === _) return S("missing <key>");
							let e$3 = {};
							null !== n$1 && (e$3[n$1] = {
								filename: t$2,
								line: i,
								char: o
							}), f[_] = e$3, _ = null, b(1, e$3);
						}, C = function() {
							if (null === _) return S("missing <key>");
							let e$3 = [];
							f[_] = e$3, _ = null, b(2, e$3);
						}, R = function() {
							let e$3 = {};
							null !== n$1 && (e$3[n$1] = {
								filename: t$2,
								line: i,
								char: o
							}), f.push(e$3), b(1, e$3);
						}, A = function() {
							let e$3 = [];
							f.push(e$3), b(2, e$3);
						};
						function w() {
							if (1 !== d) return S("unexpected </dict>");
							y();
						}
						function P() {
							return 1 === d || 2 !== d ? S("unexpected </array>") : void y();
						}
						function I(e$3) {
							if (1 === d) {
								if (null === _) return S("missing <key>");
								f[_] = e$3, _ = null;
							} else 2 === d ? f.push(e$3) : f = e$3;
						}
						function v(e$3) {
							if (isNaN(e$3)) return S("cannot parse float");
							if (1 === d) {
								if (null === _) return S("missing <key>");
								f[_] = e$3, _ = null;
							} else 2 === d ? f.push(e$3) : f = e$3;
						}
						function N(e$3) {
							if (isNaN(e$3)) return S("cannot parse integer");
							if (1 === d) {
								if (null === _) return S("missing <key>");
								f[_] = e$3, _ = null;
							} else 2 === d ? f.push(e$3) : f = e$3;
						}
						function T(e$3) {
							if (1 === d) {
								if (null === _) return S("missing <key>");
								f[_] = e$3, _ = null;
							} else 2 === d ? f.push(e$3) : f = e$3;
						}
						function x(e$3) {
							if (1 === d) {
								if (null === _) return S("missing <key>");
								f[_] = e$3, _ = null;
							} else 2 === d ? f.push(e$3) : f = e$3;
						}
						function G(e$3) {
							if (1 === d) {
								if (null === _) return S("missing <key>");
								f[_] = e$3, _ = null;
							} else 2 === d ? f.push(e$3) : f = e$3;
						}
						function E() {
							let e$3 = p(">"), t$3 = !1;
							return 47 === e$3.charCodeAt(e$3.length - 1) && (t$3 = !0, e$3 = e$3.substring(0, e$3.length - 1)), {
								name: e$3.trim(),
								isClosed: t$3
							};
						}
						function L(e$3) {
							if (e$3.isClosed) return "";
							let t$3 = p("</");
							return h(">"), t$3.replace(/&#([0-9]+);/g, function(e$4, t$4) {
								return String.fromCodePoint(parseInt(t$4, 10));
							}).replace(/&#x([0-9a-f]+);/g, function(e$4, t$4) {
								return String.fromCodePoint(parseInt(t$4, 16));
							}).replace(/&amp;|&lt;|&gt;|&quot;|&apos;/g, function(e$4) {
								switch (e$4) {
									case "&amp;": return "&";
									case "&lt;": return "<";
									case "&gt;": return ">";
									case "&quot;": return "\"";
									case "&apos;": return "'";
								}
								return e$4;
							});
						}
						for (; r < s && (l(), !(r >= s));) {
							const a$1 = e$2.charCodeAt(r);
							if (c(1), 60 !== a$1) return S("expected <");
							if (r >= s) return S("unexpected end of input");
							const p$1 = e$2.charCodeAt(r);
							if (63 === p$1) {
								c(1), h("?>");
								continue;
							}
							if (33 === p$1) {
								if (c(1), u("--")) {
									h("-->");
									continue;
								}
								h(">");
								continue;
							}
							if (47 === p$1) {
								if (c(1), l(), u("plist")) {
									h(">");
									continue;
								}
								if (u("dict")) {
									h(">"), w();
									continue;
								}
								if (u("array")) {
									h(">"), P();
									continue;
								}
								return S("unexpected closed tag");
							}
							let g$1 = E();
							switch (g$1.name) {
								case "dict":
									1 === d ? k() : 2 === d ? R() : (f = {}, null !== n$1 && (f[n$1] = {
										filename: t$2,
										line: i,
										char: o
									}), b(1, f)), g$1.isClosed && w();
									continue;
								case "array":
									1 === d ? C() : 2 === d ? A() : (f = [], b(2, f)), g$1.isClosed && P();
									continue;
								case "key":
									M = L(g$1), 1 !== d ? S("unexpected <key>") : null !== _ ? S("too many <key>") : _ = M;
									continue;
								case "string":
									I(L(g$1));
									continue;
								case "real":
									v(parseFloat(L(g$1)));
									continue;
								case "integer":
									N(parseInt(L(g$1), 10));
									continue;
								case "date":
									T(new Date(L(g$1)));
									continue;
								case "data":
									x(L(g$1));
									continue;
								case "true":
									L(g$1), G(!0);
									continue;
								case "false":
									L(g$1), G(!1);
									continue;
							}
							if (!/^plist/.test(g$1.name)) return S("unexpected opened tag " + g$1.name);
						}
						var M;
						return f;
					}
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.parsePLIST = t$1.parseWithLocation = void 0, t$1.parseWithLocation = function(e$2, t$2, s) {
						return n(e$2, t$2, s);
					}, t$1.parsePLIST = function(e$2) {
						return n(e$2, null, null);
					};
				},
				652: (e$1, t$1, n) => {
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.SyncRegistry = void 0;
					const s = n(391);
					t$1.SyncRegistry = class {
						constructor(e$2, t$2) {
							this._onigLibPromise = t$2, this._grammars = new Map(), this._rawGrammars = new Map(), this._injectionGrammars = new Map(), this._theme = e$2;
						}
						dispose() {
							for (const e$2 of this._grammars.values()) e$2.dispose();
						}
						setTheme(e$2) {
							this._theme = e$2;
						}
						getColorMap() {
							return this._theme.getColorMap();
						}
						addGrammar(e$2, t$2) {
							this._rawGrammars.set(e$2.scopeName, e$2), t$2 && this._injectionGrammars.set(e$2.scopeName, t$2);
						}
						lookup(e$2) {
							return this._rawGrammars.get(e$2);
						}
						injections(e$2) {
							return this._injectionGrammars.get(e$2);
						}
						getDefaults() {
							return this._theme.getDefaults();
						}
						themeMatch(e$2) {
							return this._theme.match(e$2);
						}
						async grammarForScopeName(e$2, t$2, n$1, r, i) {
							if (!this._grammars.has(e$2)) {
								let o = this._rawGrammars.get(e$2);
								if (!o) return null;
								this._grammars.set(e$2, s.createGrammar(e$2, o, t$2, n$1, r, i, this, await this._onigLibPromise));
							}
							return this._grammars.get(e$2);
						}
					};
				},
				792: (e$1, t$1, n) => {
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.CompiledRule = t$1.RegExpSourceList = t$1.RegExpSource = t$1.RuleFactory = t$1.BeginWhileRule = t$1.BeginEndRule = t$1.IncludeOnlyRule = t$1.MatchRule = t$1.CaptureRule = t$1.Rule = t$1.ruleIdToNumber = t$1.ruleIdFromNumber = t$1.whileRuleId = t$1.endRuleId = void 0;
					const s = n(878), r = n(965), i = /\\(\d+)/, o = /\\(\d+)/g;
					t$1.endRuleId = -1, t$1.whileRuleId = -2, t$1.ruleIdFromNumber = function(e$2) {
						return e$2;
					}, t$1.ruleIdToNumber = function(e$2) {
						return e$2;
					};
					class c {
						constructor(e$2, t$2, n$1, r$1) {
							this.$location = e$2, this.id = t$2, this._name = n$1 || null, this._nameIsCapturing = s.RegexSource.hasCaptures(this._name), this._contentName = r$1 || null, this._contentNameIsCapturing = s.RegexSource.hasCaptures(this._contentName);
						}
						get debugName() {
							const e$2 = this.$location ? `${s.basename(this.$location.filename)}:${this.$location.line}` : "unknown";
							return `${this.constructor.name}#${this.id} @ ${e$2}`;
						}
						getName(e$2, t$2) {
							return this._nameIsCapturing && null !== this._name && null !== e$2 && null !== t$2 ? s.RegexSource.replaceCaptures(this._name, e$2, t$2) : this._name;
						}
						getContentName(e$2, t$2) {
							return this._contentNameIsCapturing && null !== this._contentName ? s.RegexSource.replaceCaptures(this._contentName, e$2, t$2) : this._contentName;
						}
					}
					t$1.Rule = c;
					class a extends c {
						constructor(e$2, t$2, n$1, s$1, r$1) {
							super(e$2, t$2, n$1, s$1), this.retokenizeCapturedWithRuleId = r$1;
						}
						dispose() {}
						collectPatterns(e$2, t$2) {
							throw new Error("Not supported!");
						}
						compile(e$2, t$2) {
							throw new Error("Not supported!");
						}
						compileAG(e$2, t$2, n$1, s$1) {
							throw new Error("Not supported!");
						}
					}
					t$1.CaptureRule = a;
					class l extends c {
						constructor(e$2, t$2, n$1, s$1, r$1) {
							super(e$2, t$2, n$1, null), this._match = new f(s$1, this.id), this.captures = r$1, this._cachedCompiledPatterns = null;
						}
						dispose() {
							this._cachedCompiledPatterns && (this._cachedCompiledPatterns.dispose(), this._cachedCompiledPatterns = null);
						}
						get debugMatchRegExp() {
							return `${this._match.source}`;
						}
						collectPatterns(e$2, t$2) {
							t$2.push(this._match);
						}
						compile(e$2, t$2) {
							return this._getCachedCompiledPatterns(e$2).compile(e$2);
						}
						compileAG(e$2, t$2, n$1, s$1) {
							return this._getCachedCompiledPatterns(e$2).compileAG(e$2, n$1, s$1);
						}
						_getCachedCompiledPatterns(e$2) {
							return this._cachedCompiledPatterns || (this._cachedCompiledPatterns = new g(), this.collectPatterns(e$2, this._cachedCompiledPatterns)), this._cachedCompiledPatterns;
						}
					}
					t$1.MatchRule = l;
					class u extends c {
						constructor(e$2, t$2, n$1, s$1, r$1) {
							super(e$2, t$2, n$1, s$1), this.patterns = r$1.patterns, this.hasMissingPatterns = r$1.hasMissingPatterns, this._cachedCompiledPatterns = null;
						}
						dispose() {
							this._cachedCompiledPatterns && (this._cachedCompiledPatterns.dispose(), this._cachedCompiledPatterns = null);
						}
						collectPatterns(e$2, t$2) {
							for (const n$1 of this.patterns) e$2.getRule(n$1).collectPatterns(e$2, t$2);
						}
						compile(e$2, t$2) {
							return this._getCachedCompiledPatterns(e$2).compile(e$2);
						}
						compileAG(e$2, t$2, n$1, s$1) {
							return this._getCachedCompiledPatterns(e$2).compileAG(e$2, n$1, s$1);
						}
						_getCachedCompiledPatterns(e$2) {
							return this._cachedCompiledPatterns || (this._cachedCompiledPatterns = new g(), this.collectPatterns(e$2, this._cachedCompiledPatterns)), this._cachedCompiledPatterns;
						}
					}
					t$1.IncludeOnlyRule = u;
					class h extends c {
						constructor(e$2, t$2, n$1, s$1, r$1, i$1, o$1, c$1, a$1, l$1) {
							super(e$2, t$2, n$1, s$1), this._begin = new f(r$1, this.id), this.beginCaptures = i$1, this._end = new f(o$1 || "￿", -1), this.endHasBackReferences = this._end.hasBackReferences, this.endCaptures = c$1, this.applyEndPatternLast = a$1 || !1, this.patterns = l$1.patterns, this.hasMissingPatterns = l$1.hasMissingPatterns, this._cachedCompiledPatterns = null;
						}
						dispose() {
							this._cachedCompiledPatterns && (this._cachedCompiledPatterns.dispose(), this._cachedCompiledPatterns = null);
						}
						get debugBeginRegExp() {
							return `${this._begin.source}`;
						}
						get debugEndRegExp() {
							return `${this._end.source}`;
						}
						getEndWithResolvedBackReferences(e$2, t$2) {
							return this._end.resolveBackReferences(e$2, t$2);
						}
						collectPatterns(e$2, t$2) {
							t$2.push(this._begin);
						}
						compile(e$2, t$2) {
							return this._getCachedCompiledPatterns(e$2, t$2).compile(e$2);
						}
						compileAG(e$2, t$2, n$1, s$1) {
							return this._getCachedCompiledPatterns(e$2, t$2).compileAG(e$2, n$1, s$1);
						}
						_getCachedCompiledPatterns(e$2, t$2) {
							if (!this._cachedCompiledPatterns) {
								this._cachedCompiledPatterns = new g();
								for (const t$3 of this.patterns) e$2.getRule(t$3).collectPatterns(e$2, this._cachedCompiledPatterns);
								this.applyEndPatternLast ? this._cachedCompiledPatterns.push(this._end.hasBackReferences ? this._end.clone() : this._end) : this._cachedCompiledPatterns.unshift(this._end.hasBackReferences ? this._end.clone() : this._end);
							}
							return this._end.hasBackReferences && (this.applyEndPatternLast ? this._cachedCompiledPatterns.setSource(this._cachedCompiledPatterns.length() - 1, t$2) : this._cachedCompiledPatterns.setSource(0, t$2)), this._cachedCompiledPatterns;
						}
					}
					t$1.BeginEndRule = h;
					class p extends c {
						constructor(e$2, n$1, s$1, r$1, i$1, o$1, c$1, a$1, l$1) {
							super(e$2, n$1, s$1, r$1), this._begin = new f(i$1, this.id), this.beginCaptures = o$1, this.whileCaptures = a$1, this._while = new f(c$1, t$1.whileRuleId), this.whileHasBackReferences = this._while.hasBackReferences, this.patterns = l$1.patterns, this.hasMissingPatterns = l$1.hasMissingPatterns, this._cachedCompiledPatterns = null, this._cachedCompiledWhilePatterns = null;
						}
						dispose() {
							this._cachedCompiledPatterns && (this._cachedCompiledPatterns.dispose(), this._cachedCompiledPatterns = null), this._cachedCompiledWhilePatterns && (this._cachedCompiledWhilePatterns.dispose(), this._cachedCompiledWhilePatterns = null);
						}
						get debugBeginRegExp() {
							return `${this._begin.source}`;
						}
						get debugWhileRegExp() {
							return `${this._while.source}`;
						}
						getWhileWithResolvedBackReferences(e$2, t$2) {
							return this._while.resolveBackReferences(e$2, t$2);
						}
						collectPatterns(e$2, t$2) {
							t$2.push(this._begin);
						}
						compile(e$2, t$2) {
							return this._getCachedCompiledPatterns(e$2).compile(e$2);
						}
						compileAG(e$2, t$2, n$1, s$1) {
							return this._getCachedCompiledPatterns(e$2).compileAG(e$2, n$1, s$1);
						}
						_getCachedCompiledPatterns(e$2) {
							if (!this._cachedCompiledPatterns) {
								this._cachedCompiledPatterns = new g();
								for (const t$2 of this.patterns) e$2.getRule(t$2).collectPatterns(e$2, this._cachedCompiledPatterns);
							}
							return this._cachedCompiledPatterns;
						}
						compileWhile(e$2, t$2) {
							return this._getCachedCompiledWhilePatterns(e$2, t$2).compile(e$2);
						}
						compileWhileAG(e$2, t$2, n$1, s$1) {
							return this._getCachedCompiledWhilePatterns(e$2, t$2).compileAG(e$2, n$1, s$1);
						}
						_getCachedCompiledWhilePatterns(e$2, t$2) {
							return this._cachedCompiledWhilePatterns || (this._cachedCompiledWhilePatterns = new g(), this._cachedCompiledWhilePatterns.push(this._while.hasBackReferences ? this._while.clone() : this._while)), this._while.hasBackReferences && this._cachedCompiledWhilePatterns.setSource(0, t$2 || "￿"), this._cachedCompiledWhilePatterns;
						}
					}
					t$1.BeginWhileRule = p;
					class d {
						static createCaptureRule(e$2, t$2, n$1, s$1, r$1) {
							return e$2.registerRule((e$3) => new a(t$2, e$3, n$1, s$1, r$1));
						}
						static getCompiledRuleId(e$2, t$2, n$1) {
							return e$2.id || t$2.registerRule((r$1) => {
								if (e$2.id = r$1, e$2.match) return new l(e$2.$vscodeTextmateLocation, e$2.id, e$2.name, e$2.match, d._compileCaptures(e$2.captures, t$2, n$1));
								if (void 0 === e$2.begin) {
									e$2.repository && (n$1 = s.mergeObjects({}, n$1, e$2.repository));
									let r$2 = e$2.patterns;
									return void 0 === r$2 && e$2.include && (r$2 = [{ include: e$2.include }]), new u(e$2.$vscodeTextmateLocation, e$2.id, e$2.name, e$2.contentName, d._compilePatterns(r$2, t$2, n$1));
								}
								return e$2.while ? new p(e$2.$vscodeTextmateLocation, e$2.id, e$2.name, e$2.contentName, e$2.begin, d._compileCaptures(e$2.beginCaptures || e$2.captures, t$2, n$1), e$2.while, d._compileCaptures(e$2.whileCaptures || e$2.captures, t$2, n$1), d._compilePatterns(e$2.patterns, t$2, n$1)) : new h(e$2.$vscodeTextmateLocation, e$2.id, e$2.name, e$2.contentName, e$2.begin, d._compileCaptures(e$2.beginCaptures || e$2.captures, t$2, n$1), e$2.end, d._compileCaptures(e$2.endCaptures || e$2.captures, t$2, n$1), e$2.applyEndPatternLast, d._compilePatterns(e$2.patterns, t$2, n$1));
							}), e$2.id;
						}
						static _compileCaptures(e$2, t$2, n$1) {
							let s$1 = [];
							if (e$2) {
								let r$1 = 0;
								for (const t$3 in e$2) {
									if ("$vscodeTextmateLocation" === t$3) continue;
									const e$3 = parseInt(t$3, 10);
									e$3 > r$1 && (r$1 = e$3);
								}
								for (let e$3 = 0; e$3 <= r$1; e$3++) s$1[e$3] = null;
								for (const r$2 in e$2) {
									if ("$vscodeTextmateLocation" === r$2) continue;
									const i$1 = parseInt(r$2, 10);
									let o$1 = 0;
									e$2[r$2].patterns && (o$1 = d.getCompiledRuleId(e$2[r$2], t$2, n$1)), s$1[i$1] = d.createCaptureRule(t$2, e$2[r$2].$vscodeTextmateLocation, e$2[r$2].name, e$2[r$2].contentName, o$1);
								}
							}
							return s$1;
						}
						static _compilePatterns(e$2, t$2, n$1) {
							let s$1 = [];
							if (e$2) for (let i$1 = 0, o$1 = e$2.length; i$1 < o$1; i$1++) {
								const o$2 = e$2[i$1];
								let c$1 = -1;
								if (o$2.include) {
									const e$3 = r.parseInclude(o$2.include);
									switch (e$3.kind) {
										case 0:
										case 1:
											c$1 = d.getCompiledRuleId(n$1[o$2.include], t$2, n$1);
											break;
										case 2:
											let s$2 = n$1[e$3.ruleName];
											s$2 && (c$1 = d.getCompiledRuleId(s$2, t$2, n$1));
											break;
										case 3:
										case 4:
											const r$1 = e$3.scopeName, i$2 = 4 === e$3.kind ? e$3.ruleName : null, a$1 = t$2.getExternalGrammar(r$1, n$1);
											if (a$1) if (i$2) {
												let e$4 = a$1.repository[i$2];
												e$4 && (c$1 = d.getCompiledRuleId(e$4, t$2, a$1.repository));
											} else c$1 = d.getCompiledRuleId(a$1.repository.$self, t$2, a$1.repository);
									}
								} else c$1 = d.getCompiledRuleId(o$2, t$2, n$1);
								if (-1 !== c$1) {
									const e$3 = t$2.getRule(c$1);
									let n$2 = !1;
									if ((e$3 instanceof u || e$3 instanceof h || e$3 instanceof p) && e$3.hasMissingPatterns && 0 === e$3.patterns.length && (n$2 = !0), n$2) continue;
									s$1.push(c$1);
								}
							}
							return {
								patterns: s$1,
								hasMissingPatterns: (e$2 ? e$2.length : 0) !== s$1.length
							};
						}
					}
					t$1.RuleFactory = d;
					class f {
						constructor(e$2, t$2) {
							if (e$2) {
								const t$3 = e$2.length;
								let n$1 = 0, s$1 = [], r$1 = !1;
								for (let i$1 = 0; i$1 < t$3; i$1++) if ("\\" === e$2.charAt(i$1) && i$1 + 1 < t$3) {
									const t$4 = e$2.charAt(i$1 + 1);
									"z" === t$4 ? (s$1.push(e$2.substring(n$1, i$1)), s$1.push("$(?!\\n)(?<!\\n)"), n$1 = i$1 + 2) : "A" !== t$4 && "G" !== t$4 || (r$1 = !0), i$1++;
								}
								this.hasAnchor = r$1, 0 === n$1 ? this.source = e$2 : (s$1.push(e$2.substring(n$1, t$3)), this.source = s$1.join(""));
							} else this.hasAnchor = !1, this.source = e$2;
							this.hasAnchor ? this._anchorCache = this._buildAnchorCache() : this._anchorCache = null, this.ruleId = t$2, this.hasBackReferences = i.test(this.source);
						}
						clone() {
							return new f(this.source, this.ruleId);
						}
						setSource(e$2) {
							this.source !== e$2 && (this.source = e$2, this.hasAnchor && (this._anchorCache = this._buildAnchorCache()));
						}
						resolveBackReferences(e$2, t$2) {
							let n$1 = t$2.map((t$3) => e$2.substring(t$3.start, t$3.end));
							return o.lastIndex = 0, this.source.replace(o, (e$3, t$3) => s.escapeRegExpCharacters(n$1[parseInt(t$3, 10)] || ""));
						}
						_buildAnchorCache() {
							let e$2, t$2, n$1, s$1, r$1 = [], i$1 = [], o$1 = [], c$1 = [];
							for (e$2 = 0, t$2 = this.source.length; e$2 < t$2; e$2++) n$1 = this.source.charAt(e$2), r$1[e$2] = n$1, i$1[e$2] = n$1, o$1[e$2] = n$1, c$1[e$2] = n$1, "\\" === n$1 && e$2 + 1 < t$2 && (s$1 = this.source.charAt(e$2 + 1), "A" === s$1 ? (r$1[e$2 + 1] = "￿", i$1[e$2 + 1] = "￿", o$1[e$2 + 1] = "A", c$1[e$2 + 1] = "A") : "G" === s$1 ? (r$1[e$2 + 1] = "￿", i$1[e$2 + 1] = "G", o$1[e$2 + 1] = "￿", c$1[e$2 + 1] = "G") : (r$1[e$2 + 1] = s$1, i$1[e$2 + 1] = s$1, o$1[e$2 + 1] = s$1, c$1[e$2 + 1] = s$1), e$2++);
							return {
								A0_G0: r$1.join(""),
								A0_G1: i$1.join(""),
								A1_G0: o$1.join(""),
								A1_G1: c$1.join("")
							};
						}
						resolveAnchors(e$2, t$2) {
							return this.hasAnchor && this._anchorCache ? e$2 ? t$2 ? this._anchorCache.A1_G1 : this._anchorCache.A1_G0 : t$2 ? this._anchorCache.A0_G1 : this._anchorCache.A0_G0 : this.source;
						}
					}
					t$1.RegExpSource = f;
					class g {
						constructor() {
							this._items = [], this._hasAnchors = !1, this._cached = null, this._anchorCache = {
								A0_G0: null,
								A0_G1: null,
								A1_G0: null,
								A1_G1: null
							};
						}
						dispose() {
							this._disposeCaches();
						}
						_disposeCaches() {
							this._cached && (this._cached.dispose(), this._cached = null), this._anchorCache.A0_G0 && (this._anchorCache.A0_G0.dispose(), this._anchorCache.A0_G0 = null), this._anchorCache.A0_G1 && (this._anchorCache.A0_G1.dispose(), this._anchorCache.A0_G1 = null), this._anchorCache.A1_G0 && (this._anchorCache.A1_G0.dispose(), this._anchorCache.A1_G0 = null), this._anchorCache.A1_G1 && (this._anchorCache.A1_G1.dispose(), this._anchorCache.A1_G1 = null);
						}
						push(e$2) {
							this._items.push(e$2), this._hasAnchors = this._hasAnchors || e$2.hasAnchor;
						}
						unshift(e$2) {
							this._items.unshift(e$2), this._hasAnchors = this._hasAnchors || e$2.hasAnchor;
						}
						length() {
							return this._items.length;
						}
						setSource(e$2, t$2) {
							this._items[e$2].source !== t$2 && (this._disposeCaches(), this._items[e$2].setSource(t$2));
						}
						compile(e$2) {
							if (!this._cached) {
								let t$2 = this._items.map((e$3) => e$3.source);
								this._cached = new m(e$2, t$2, this._items.map((e$3) => e$3.ruleId));
							}
							return this._cached;
						}
						compileAG(e$2, t$2, n$1) {
							return this._hasAnchors ? t$2 ? n$1 ? (this._anchorCache.A1_G1 || (this._anchorCache.A1_G1 = this._resolveAnchors(e$2, t$2, n$1)), this._anchorCache.A1_G1) : (this._anchorCache.A1_G0 || (this._anchorCache.A1_G0 = this._resolveAnchors(e$2, t$2, n$1)), this._anchorCache.A1_G0) : n$1 ? (this._anchorCache.A0_G1 || (this._anchorCache.A0_G1 = this._resolveAnchors(e$2, t$2, n$1)), this._anchorCache.A0_G1) : (this._anchorCache.A0_G0 || (this._anchorCache.A0_G0 = this._resolveAnchors(e$2, t$2, n$1)), this._anchorCache.A0_G0) : this.compile(e$2);
						}
						_resolveAnchors(e$2, t$2, n$1) {
							let s$1 = this._items.map((e$3) => e$3.resolveAnchors(t$2, n$1));
							return new m(e$2, s$1, this._items.map((e$3) => e$3.ruleId));
						}
					}
					t$1.RegExpSourceList = g;
					class m {
						constructor(e$2, t$2, n$1) {
							this.regExps = t$2, this.rules = n$1, this.scanner = e$2.createOnigScanner(t$2);
						}
						dispose() {
							"function" == typeof this.scanner.dispose && this.scanner.dispose();
						}
						toString() {
							const e$2 = [];
							for (let t$2 = 0, n$1 = this.rules.length; t$2 < n$1; t$2++) e$2.push("   - " + this.rules[t$2] + ": " + this.regExps[t$2]);
							return e$2.join("\n");
						}
						findNextMatchSync(e$2, t$2, n$1) {
							const s$1 = this.scanner.findNextMatchSync(e$2, t$2, n$1);
							return s$1 ? {
								ruleId: this.rules[s$1.index],
								captureIndices: s$1.captureIndices
							} : null;
						}
					}
					t$1.CompiledRule = m;
				},
				583: (e$1, t$1, n) => {
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.ThemeTrieElement = t$1.ThemeTrieElementRule = t$1.ColorMap = t$1.fontStyleToString = t$1.ParsedThemeRule = t$1.parseTheme = t$1.StyleAttributes = t$1.ScopeStack = t$1.Theme = void 0;
					const s = n(878);
					class r {
						constructor(e$2, t$2, n$1) {
							this._colorMap = e$2, this._defaults = t$2, this._root = n$1, this._cachedMatchRoot = new s.CachedFn((e$3) => this._root.match(e$3));
						}
						static createFromRawTheme(e$2, t$2) {
							return this.createFromParsedTheme(a(e$2), t$2);
						}
						static createFromParsedTheme(e$2, t$2) {
							return function(e$3, t$3) {
								e$3.sort((e$4, t$4) => {
									let n$2 = s.strcmp(e$4.scope, t$4.scope);
									return 0 !== n$2 ? n$2 : (n$2 = s.strArrCmp(e$4.parentScopes, t$4.parentScopes), 0 !== n$2 ? n$2 : e$4.index - t$4.index);
								});
								let n$1 = 0, i$1 = "#000000", o$1 = "#ffffff";
								for (; e$3.length >= 1 && "" === e$3[0].scope;) {
									let t$4 = e$3.shift();
									-1 !== t$4.fontStyle && (n$1 = t$4.fontStyle), null !== t$4.foreground && (i$1 = t$4.foreground), null !== t$4.background && (o$1 = t$4.background);
								}
								let a$1 = new u(t$3), l$1 = new c(n$1, a$1.getId(i$1), a$1.getId(o$1)), d = new p(new h(0, null, -1, 0, 0), []);
								for (let t$4 = 0, n$2 = e$3.length; t$4 < n$2; t$4++) {
									let n$3 = e$3[t$4];
									d.insert(0, n$3.scope, n$3.parentScopes, n$3.fontStyle, a$1.getId(n$3.foreground), a$1.getId(n$3.background));
								}
								return new r(a$1, l$1, d);
							}(e$2, t$2);
						}
						getColorMap() {
							return this._colorMap.getColorMap();
						}
						getDefaults() {
							return this._defaults;
						}
						match(e$2) {
							if (null === e$2) return this._defaults;
							const t$2 = e$2.scopeName, n$1 = this._cachedMatchRoot.get(t$2).find((t$3) => function(e$3, t$4) {
								if (null === t$4) return !0;
								let n$2 = 0, s$1 = t$4[n$2];
								for (; e$3;) {
									if (o(e$3.scopeName, s$1)) {
										if (n$2++, n$2 === t$4.length) return !0;
										s$1 = t$4[n$2];
									}
									e$3 = e$3.parent;
								}
								return !1;
							}(e$2.parent, t$3.parentScopes));
							return n$1 ? new c(n$1.fontStyle, n$1.foreground, n$1.background) : null;
						}
					}
					t$1.Theme = r;
					class i {
						constructor(e$2, t$2) {
							this.parent = e$2, this.scopeName = t$2;
						}
						static from(...e$2) {
							let t$2 = null;
							for (let n$1 = 0; n$1 < e$2.length; n$1++) t$2 = new i(t$2, e$2[n$1]);
							return t$2;
						}
						push(e$2) {
							return new i(this, e$2);
						}
						getSegments() {
							let e$2 = this;
							const t$2 = [];
							for (; e$2;) t$2.push(e$2.scopeName), e$2 = e$2.parent;
							return t$2.reverse(), t$2;
						}
						toString() {
							return this.getSegments().join(" ");
						}
					}
					function o(e$2, t$2) {
						return t$2 === e$2 || e$2.startsWith(t$2) && "." === e$2[t$2.length];
					}
					t$1.ScopeStack = i;
					class c {
						constructor(e$2, t$2, n$1) {
							this.fontStyle = e$2, this.foregroundId = t$2, this.backgroundId = n$1;
						}
					}
					function a(e$2) {
						if (!e$2) return [];
						if (!e$2.settings || !Array.isArray(e$2.settings)) return [];
						let t$2 = e$2.settings, n$1 = [], r$1 = 0;
						for (let e$3 = 0, i$1 = t$2.length; e$3 < i$1; e$3++) {
							let i$2, o$1 = t$2[e$3];
							if (!o$1.settings) continue;
							if ("string" == typeof o$1.scope) {
								let e$4 = o$1.scope;
								e$4 = e$4.replace(/^[,]+/, ""), e$4 = e$4.replace(/[,]+$/, ""), i$2 = e$4.split(",");
							} else i$2 = Array.isArray(o$1.scope) ? o$1.scope : [""];
							let c$1 = -1;
							if ("string" == typeof o$1.settings.fontStyle) {
								c$1 = 0;
								let e$4 = o$1.settings.fontStyle.split(" ");
								for (let t$3 = 0, n$2 = e$4.length; t$3 < n$2; t$3++) switch (e$4[t$3]) {
									case "italic":
										c$1 |= 1;
										break;
									case "bold":
										c$1 |= 2;
										break;
									case "underline":
										c$1 |= 4;
										break;
									case "strikethrough": c$1 |= 8;
								}
							}
							let a$1 = null;
							"string" == typeof o$1.settings.foreground && s.isValidHexColor(o$1.settings.foreground) && (a$1 = o$1.settings.foreground);
							let u$1 = null;
							"string" == typeof o$1.settings.background && s.isValidHexColor(o$1.settings.background) && (u$1 = o$1.settings.background);
							for (let t$3 = 0, s$1 = i$2.length; t$3 < s$1; t$3++) {
								let s$2 = i$2[t$3].trim().split(" "), o$2 = s$2[s$2.length - 1], h$1 = null;
								s$2.length > 1 && (h$1 = s$2.slice(0, s$2.length - 1), h$1.reverse()), n$1[r$1++] = new l(o$2, h$1, e$3, c$1, a$1, u$1);
							}
						}
						return n$1;
					}
					t$1.StyleAttributes = c, t$1.parseTheme = a;
					class l {
						constructor(e$2, t$2, n$1, s$1, r$1, i$1) {
							this.scope = e$2, this.parentScopes = t$2, this.index = n$1, this.fontStyle = s$1, this.foreground = r$1, this.background = i$1;
						}
					}
					t$1.ParsedThemeRule = l, t$1.fontStyleToString = function(e$2) {
						if (-1 === e$2) return "not set";
						let t$2 = "";
						return 1 & e$2 && (t$2 += "italic "), 2 & e$2 && (t$2 += "bold "), 4 & e$2 && (t$2 += "underline "), 8 & e$2 && (t$2 += "strikethrough "), "" === t$2 && (t$2 = "none"), t$2.trim();
					};
					class u {
						constructor(e$2) {
							if (this._lastColorId = 0, this._id2color = [], this._color2id = Object.create(null), Array.isArray(e$2)) {
								this._isFrozen = !0;
								for (let t$2 = 0, n$1 = e$2.length; t$2 < n$1; t$2++) this._color2id[e$2[t$2]] = t$2, this._id2color[t$2] = e$2[t$2];
							} else this._isFrozen = !1;
						}
						getId(e$2) {
							if (null === e$2) return 0;
							e$2 = e$2.toUpperCase();
							let t$2 = this._color2id[e$2];
							if (t$2) return t$2;
							if (this._isFrozen) throw new Error(`Missing color in color map - ${e$2}`);
							return t$2 = ++this._lastColorId, this._color2id[e$2] = t$2, this._id2color[t$2] = e$2, t$2;
						}
						getColorMap() {
							return this._id2color.slice(0);
						}
					}
					t$1.ColorMap = u;
					class h {
						constructor(e$2, t$2, n$1, s$1, r$1) {
							this.scopeDepth = e$2, this.parentScopes = t$2, this.fontStyle = n$1, this.foreground = s$1, this.background = r$1;
						}
						clone() {
							return new h(this.scopeDepth, this.parentScopes, this.fontStyle, this.foreground, this.background);
						}
						static cloneArr(e$2) {
							let t$2 = [];
							for (let n$1 = 0, s$1 = e$2.length; n$1 < s$1; n$1++) t$2[n$1] = e$2[n$1].clone();
							return t$2;
						}
						acceptOverwrite(e$2, t$2, n$1, s$1) {
							this.scopeDepth > e$2 ? console.log("how did this happen?") : this.scopeDepth = e$2, -1 !== t$2 && (this.fontStyle = t$2), 0 !== n$1 && (this.foreground = n$1), 0 !== s$1 && (this.background = s$1);
						}
					}
					t$1.ThemeTrieElementRule = h;
					class p {
						constructor(e$2, t$2 = [], n$1 = {}) {
							this._mainRule = e$2, this._children = n$1, this._rulesWithParentScopes = t$2;
						}
						static _sortBySpecificity(e$2) {
							return 1 === e$2.length || e$2.sort(this._cmpBySpecificity), e$2;
						}
						static _cmpBySpecificity(e$2, t$2) {
							if (e$2.scopeDepth === t$2.scopeDepth) {
								const n$1 = e$2.parentScopes, s$1 = t$2.parentScopes;
								let r$1 = null === n$1 ? 0 : n$1.length, i$1 = null === s$1 ? 0 : s$1.length;
								if (r$1 === i$1) for (let e$3 = 0; e$3 < r$1; e$3++) {
									const t$3 = n$1[e$3].length, r$2 = s$1[e$3].length;
									if (t$3 !== r$2) return r$2 - t$3;
								}
								return i$1 - r$1;
							}
							return t$2.scopeDepth - e$2.scopeDepth;
						}
						match(e$2) {
							if ("" === e$2) return p._sortBySpecificity([].concat(this._mainRule).concat(this._rulesWithParentScopes));
							let t$2, n$1, s$1 = e$2.indexOf(".");
							return -1 === s$1 ? (t$2 = e$2, n$1 = "") : (t$2 = e$2.substring(0, s$1), n$1 = e$2.substring(s$1 + 1)), this._children.hasOwnProperty(t$2) ? this._children[t$2].match(n$1) : p._sortBySpecificity([].concat(this._mainRule).concat(this._rulesWithParentScopes));
						}
						insert(e$2, t$2, n$1, s$1, r$1, i$1) {
							if ("" === t$2) return void this._doInsertHere(e$2, n$1, s$1, r$1, i$1);
							let o$1, c$1, a$1, l$1 = t$2.indexOf(".");
							-1 === l$1 ? (o$1 = t$2, c$1 = "") : (o$1 = t$2.substring(0, l$1), c$1 = t$2.substring(l$1 + 1)), this._children.hasOwnProperty(o$1) ? a$1 = this._children[o$1] : (a$1 = new p(this._mainRule.clone(), h.cloneArr(this._rulesWithParentScopes)), this._children[o$1] = a$1), a$1.insert(e$2 + 1, c$1, n$1, s$1, r$1, i$1);
						}
						_doInsertHere(e$2, t$2, n$1, r$1, i$1) {
							if (null !== t$2) {
								for (let o$1 = 0, c$1 = this._rulesWithParentScopes.length; o$1 < c$1; o$1++) {
									let c$2 = this._rulesWithParentScopes[o$1];
									if (0 === s.strArrCmp(c$2.parentScopes, t$2)) return void c$2.acceptOverwrite(e$2, n$1, r$1, i$1);
								}
								-1 === n$1 && (n$1 = this._mainRule.fontStyle), 0 === r$1 && (r$1 = this._mainRule.foreground), 0 === i$1 && (i$1 = this._mainRule.background), this._rulesWithParentScopes.push(new h(e$2, t$2, n$1, r$1, i$1));
							} else this._mainRule.acceptOverwrite(e$2, n$1, r$1, i$1);
						}
					}
					t$1.ThemeTrieElement = p;
				},
				878: (e$1, t$1) => {
					function n(e$2) {
						return Array.isArray(e$2) ? function(e$3) {
							let t$2 = [];
							for (let s$1 = 0, r$1 = e$3.length; s$1 < r$1; s$1++) t$2[s$1] = n(e$3[s$1]);
							return t$2;
						}(e$2) : "object" == typeof e$2 ? function(e$3) {
							let t$2 = {};
							for (let s$1 in e$3) t$2[s$1] = n(e$3[s$1]);
							return t$2;
						}(e$2) : e$2;
					}
					Object.defineProperty(t$1, "__esModule", { value: !0 }), t$1.performanceNow = t$1.CachedFn = t$1.escapeRegExpCharacters = t$1.isValidHexColor = t$1.strArrCmp = t$1.strcmp = t$1.RegexSource = t$1.basename = t$1.mergeObjects = t$1.clone = void 0, t$1.clone = function(e$2) {
						return n(e$2);
					}, t$1.mergeObjects = function(e$2, ...t$2) {
						return t$2.forEach((t$3) => {
							for (let n$1 in t$3) e$2[n$1] = t$3[n$1];
						}), e$2;
					}, t$1.basename = function e$2(t$2) {
						const n$1 = ~t$2.lastIndexOf("/") || ~t$2.lastIndexOf("\\");
						return 0 === n$1 ? t$2 : ~n$1 == t$2.length - 1 ? e$2(t$2.substring(0, t$2.length - 1)) : t$2.substr(1 + ~n$1);
					};
					let s = /\$(\d+)|\${(\d+):\/(downcase|upcase)}/g;
					function r(e$2, t$2) {
						return e$2 < t$2 ? -1 : e$2 > t$2 ? 1 : 0;
					}
					t$1.RegexSource = class {
						static hasCaptures(e$2) {
							return null !== e$2 && (s.lastIndex = 0, s.test(e$2));
						}
						static replaceCaptures(e$2, t$2, n$1) {
							return e$2.replace(s, (e$3, s$1, r$1, i) => {
								let o = n$1[parseInt(s$1 || r$1, 10)];
								if (!o) return e$3;
								{
									let e$4 = t$2.substring(o.start, o.end);
									for (; "." === e$4[0];) e$4 = e$4.substring(1);
									switch (i) {
										case "downcase": return e$4.toLowerCase();
										case "upcase": return e$4.toUpperCase();
										default: return e$4;
									}
								}
							});
						}
					}, t$1.strcmp = r, t$1.strArrCmp = function(e$2, t$2) {
						if (null === e$2 && null === t$2) return 0;
						if (!e$2) return -1;
						if (!t$2) return 1;
						let n$1 = e$2.length, s$1 = t$2.length;
						if (n$1 === s$1) {
							for (let s$2 = 0; s$2 < n$1; s$2++) {
								let n$2 = r(e$2[s$2], t$2[s$2]);
								if (0 !== n$2) return n$2;
							}
							return 0;
						}
						return n$1 - s$1;
					}, t$1.isValidHexColor = function(e$2) {
						return !!(/^#[0-9a-f]{6}$/i.test(e$2) || /^#[0-9a-f]{8}$/i.test(e$2) || /^#[0-9a-f]{3}$/i.test(e$2) || /^#[0-9a-f]{4}$/i.test(e$2));
					}, t$1.escapeRegExpCharacters = function(e$2) {
						return e$2.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
					}, t$1.CachedFn = class {
						constructor(e$2) {
							this.fn = e$2, this.cache = new Map();
						}
						get(e$2) {
							if (this.cache.has(e$2)) return this.cache.get(e$2);
							const t$2 = this.fn(e$2);
							return this.cache.set(e$2, t$2), t$2;
						}
					}, t$1.performanceNow = "undefined" == typeof performance ? function() {
						return Date.now();
					} : function() {
						return performance.now();
					};
				}
			}, t = {};
			return function n(s) {
				var r = t[s];
				if (void 0 !== r) return r.exports;
				var i = t[s] = { exports: {} };
				return e[s].call(i.exports, i, i.exports, n), i.exports;
			}(787);
		})();
	});
})(main);
const themes = [
	"css-variables",
	"dark-plus",
	"dracula-soft",
	"dracula",
	"github-dark-dimmed",
	"github-dark",
	"github-light",
	"hc_light",
	"light-plus",
	"material-darker",
	"material-default",
	"material-lighter",
	"material-ocean",
	"material-palenight",
	"min-dark",
	"min-light",
	"monokai",
	"nord",
	"one-dark-pro",
	"poimandres",
	"rose-pine-dawn",
	"rose-pine-moon",
	"rose-pine",
	"slack-dark",
	"slack-ochin",
	"solarized-dark",
	"solarized-light",
	"vitesse-dark",
	"vitesse-light"
];
const languages = [
	{
		id: "abap",
		scopeName: "source.abap",
		path: "abap.tmLanguage.json",
		samplePath: "abap.sample"
	},
	{
		id: "actionscript-3",
		scopeName: "source.actionscript.3",
		path: "actionscript-3.tmLanguage.json",
		samplePath: "actionscript-3.sample"
	},
	{
		id: "ada",
		scopeName: "source.ada",
		path: "ada.tmLanguage.json",
		samplePath: "ada.sample"
	},
	{
		id: "apache",
		scopeName: "source.apacheconf",
		path: "apache.tmLanguage.json"
	},
	{
		id: "apex",
		scopeName: "source.apex",
		path: "apex.tmLanguage.json",
		samplePath: "apex.sample"
	},
	{
		id: "apl",
		scopeName: "source.apl",
		path: "apl.tmLanguage.json",
		embeddedLangs: [
			"html",
			"xml",
			"css",
			"javascript",
			"json"
		]
	},
	{
		id: "applescript",
		scopeName: "source.applescript",
		path: "applescript.tmLanguage.json",
		samplePath: "applescript.sample"
	},
	{
		id: "asm",
		scopeName: "source.asm.x86_64",
		path: "asm.tmLanguage.json",
		samplePath: "asm.sample"
	},
	{
		id: "astro",
		scopeName: "source.astro",
		path: "astro.tmLanguage.json",
		samplePath: "astro.sample",
		embeddedLangs: [
			"json",
			"javascript",
			"typescript",
			"tsx",
			"css",
			"less",
			"sass",
			"scss",
			"stylus"
		]
	},
	{
		id: "awk",
		scopeName: "source.awk",
		path: "awk.tmLanguage.json",
		samplePath: "awk.sample"
	},
	{
		id: "ballerina",
		scopeName: "source.ballerina",
		path: "ballerina.tmLanguage.json",
		samplePath: "ballerina.sample"
	},
	{
		id: "bat",
		scopeName: "source.batchfile",
		path: "bat.tmLanguage.json",
		samplePath: "bat.sample",
		aliases: ["batch"]
	},
	{
		id: "berry",
		scopeName: "source.berry",
		path: "berry.tmLanguage.json",
		samplePath: "berry.sample",
		aliases: ["be"]
	},
	{
		id: "bibtex",
		scopeName: "text.bibtex",
		path: "bibtex.tmLanguage.json"
	},
	{
		id: "bicep",
		scopeName: "source.bicep",
		path: "bicep.tmLanguage.json",
		samplePath: "bicep.sample"
	},
	{
		id: "blade",
		scopeName: "text.html.php.blade",
		path: "blade.tmLanguage.json",
		samplePath: "blade.sample",
		embeddedLangs: [
			"html",
			"xml",
			"sql",
			"javascript",
			"json",
			"css"
		]
	},
	{
		id: "c",
		scopeName: "source.c",
		path: "c.tmLanguage.json",
		samplePath: "c.sample"
	},
	{
		id: "cadence",
		scopeName: "source.cadence",
		path: "cadence.tmLanguage.json",
		samplePath: "cadence.sample",
		aliases: ["cdc"]
	},
	{
		id: "clarity",
		scopeName: "source.clar",
		path: "clarity.tmLanguage.json",
		samplePath: "clarity.sample"
	},
	{
		id: "clojure",
		scopeName: "source.clojure",
		path: "clojure.tmLanguage.json",
		samplePath: "clojure.sample",
		aliases: ["clj"]
	},
	{
		id: "cmake",
		scopeName: "source.cmake",
		path: "cmake.tmLanguage.json",
		samplePath: "cmake.sample"
	},
	{
		id: "cobol",
		scopeName: "source.cobol",
		path: "cobol.tmLanguage.json",
		samplePath: "cobol.sample",
		embeddedLangs: [
			"sql",
			"html",
			"java"
		]
	},
	{
		id: "codeql",
		scopeName: "source.ql",
		path: "codeql.tmLanguage.json",
		samplePath: "codeql.sample",
		aliases: ["ql"],
		embeddedLangs: ["markdown"]
	},
	{
		id: "coffee",
		scopeName: "source.coffee",
		path: "coffee.tmLanguage.json",
		samplePath: "coffee.sample",
		embeddedLangs: ["javascript"]
	},
	{
		id: "cpp",
		scopeName: "source.cpp",
		path: "cpp.tmLanguage.json",
		samplePath: "cpp.sample",
		embeddedLangs: ["glsl", "sql"]
	},
	{
		id: "crystal",
		scopeName: "source.crystal",
		path: "crystal.tmLanguage.json",
		samplePath: "crystal.sample",
		embeddedLangs: [
			"html",
			"sql",
			"css",
			"c",
			"javascript",
			"shellscript"
		]
	},
	{
		id: "csharp",
		scopeName: "source.cs",
		path: "csharp.tmLanguage.json",
		samplePath: "csharp.sample",
		aliases: ["c#", "cs"]
	},
	{
		id: "css",
		scopeName: "source.css",
		path: "css.tmLanguage.json",
		samplePath: "css.sample"
	},
	{
		id: "cue",
		scopeName: "source.cue",
		path: "cue.tmLanguage.json",
		samplePath: "cue.sample"
	},
	{
		id: "d",
		scopeName: "source.d",
		path: "d.tmLanguage.json",
		samplePath: "d.sample"
	},
	{
		id: "dart",
		scopeName: "source.dart",
		path: "dart.tmLanguage.json",
		samplePath: "dart.sample"
	},
	{
		id: "diff",
		scopeName: "source.diff",
		path: "diff.tmLanguage.json",
		samplePath: "diff.sample"
	},
	{
		id: "docker",
		scopeName: "source.dockerfile",
		path: "docker.tmLanguage.json",
		samplePath: "docker.sample"
	},
	{
		id: "dream-maker",
		scopeName: "source.dm",
		path: "dream-maker.tmLanguage.json"
	},
	{
		id: "elixir",
		scopeName: "source.elixir",
		path: "elixir.tmLanguage.json",
		samplePath: "elixir.sample",
		embeddedLangs: ["html"]
	},
	{
		id: "elm",
		scopeName: "source.elm",
		path: "elm.tmLanguage.json",
		samplePath: "elm.sample",
		embeddedLangs: ["glsl"]
	},
	{
		id: "erb",
		scopeName: "text.html.erb",
		path: "erb.tmLanguage.json",
		samplePath: "erb.sample",
		embeddedLangs: ["html", "ruby"]
	},
	{
		id: "erlang",
		scopeName: "source.erlang",
		path: "erlang.tmLanguage.json",
		samplePath: "erlang.sample",
		aliases: ["erl"]
	},
	{
		id: "fish",
		scopeName: "source.fish",
		path: "fish.tmLanguage.json",
		samplePath: "fish.sample"
	},
	{
		id: "fsharp",
		scopeName: "source.fsharp",
		path: "fsharp.tmLanguage.json",
		samplePath: "fsharp.sample",
		aliases: ["f#", "fs"],
		embeddedLangs: ["markdown"]
	},
	{
		id: "gherkin",
		scopeName: "text.gherkin.feature",
		path: "gherkin.tmLanguage.json"
	},
	{
		id: "git-commit",
		scopeName: "text.git-commit",
		path: "git-commit.tmLanguage.json",
		embeddedLangs: ["diff"]
	},
	{
		id: "git-rebase",
		scopeName: "text.git-rebase",
		path: "git-rebase.tmLanguage.json",
		embeddedLangs: ["shellscript"]
	},
	{
		id: "glsl",
		scopeName: "source.glsl",
		path: "glsl.tmLanguage.json",
		samplePath: "glsl.sample",
		embeddedLangs: ["c"]
	},
	{
		id: "gnuplot",
		scopeName: "source.gnuplot",
		path: "gnuplot.tmLanguage.json"
	},
	{
		id: "go",
		scopeName: "source.go",
		path: "go.tmLanguage.json",
		samplePath: "go.sample"
	},
	{
		id: "graphql",
		scopeName: "source.graphql",
		path: "graphql.tmLanguage.json",
		embeddedLangs: [
			"javascript",
			"typescript",
			"jsx",
			"tsx"
		]
	},
	{
		id: "groovy",
		scopeName: "source.groovy",
		path: "groovy.tmLanguage.json"
	},
	{
		id: "hack",
		scopeName: "source.hack",
		path: "hack.tmLanguage.json",
		embeddedLangs: ["html", "sql"]
	},
	{
		id: "haml",
		scopeName: "text.haml",
		path: "haml.tmLanguage.json",
		embeddedLangs: [
			"ruby",
			"javascript",
			"sass",
			"coffee",
			"markdown",
			"css"
		]
	},
	{
		id: "handlebars",
		scopeName: "text.html.handlebars",
		path: "handlebars.tmLanguage.json",
		aliases: ["hbs"],
		embeddedLangs: [
			"html",
			"css",
			"javascript",
			"yaml"
		]
	},
	{
		id: "haskell",
		scopeName: "source.haskell",
		path: "haskell.tmLanguage.json",
		aliases: ["hs"]
	},
	{
		id: "hcl",
		scopeName: "source.hcl",
		path: "hcl.tmLanguage.json",
		samplePath: "hcl.sample"
	},
	{
		id: "hlsl",
		scopeName: "source.hlsl",
		path: "hlsl.tmLanguage.json"
	},
	{
		id: "html",
		scopeName: "text.html.basic",
		path: "html.tmLanguage.json",
		samplePath: "html.sample",
		embeddedLangs: ["javascript", "css"]
	},
	{
		id: "imba",
		scopeName: "source.imba",
		path: "imba.tmLanguage.json",
		samplePath: "imba.sample"
	},
	{
		id: "ini",
		scopeName: "source.ini",
		path: "ini.tmLanguage.json"
	},
	{
		id: "java",
		scopeName: "source.java",
		path: "java.tmLanguage.json",
		samplePath: "java.sample"
	},
	{
		id: "javascript",
		scopeName: "source.js",
		path: "javascript.tmLanguage.json",
		samplePath: "javascript.sample",
		aliases: ["js"]
	},
	{
		id: "jinja-html",
		scopeName: "text.html.jinja",
		path: "jinja-html.tmLanguage.json",
		embeddedLangs: ["html"]
	},
	{
		id: "json",
		scopeName: "source.json",
		path: "json.tmLanguage.json"
	},
	{
		id: "json5",
		scopeName: "source.json5",
		path: "json5.tmLanguage.json",
		samplePath: "json5.sample"
	},
	{
		id: "jsonc",
		scopeName: "source.json.comments",
		path: "jsonc.tmLanguage.json"
	},
	{
		id: "jsonnet",
		scopeName: "source.jsonnet",
		path: "jsonnet.tmLanguage.json"
	},
	{
		id: "jssm",
		scopeName: "source.jssm",
		path: "jssm.tmLanguage.json",
		samplePath: "jssm.sample",
		aliases: ["fsl"]
	},
	{
		id: "jsx",
		scopeName: "source.js.jsx",
		path: "jsx.tmLanguage.json"
	},
	{
		id: "julia",
		scopeName: "source.julia",
		path: "julia.tmLanguage.json",
		embeddedLangs: [
			"cpp",
			"python",
			"javascript",
			"r",
			"sql"
		]
	},
	{
		id: "kotlin",
		scopeName: "source.kotlin",
		path: "kotlin.tmLanguage.json"
	},
	{
		id: "latex",
		scopeName: "text.tex.latex",
		path: "latex.tmLanguage.json",
		embeddedLangs: [
			"tex",
			"css",
			"haskell",
			"html",
			"xml",
			"java",
			"lua",
			"julia",
			"ruby",
			"javascript",
			"typescript",
			"python",
			"yaml",
			"rust",
			"scala",
			"gnuplot"
		]
	},
	{
		id: "less",
		scopeName: "source.css.less",
		path: "less.tmLanguage.json",
		embeddedLangs: ["css"]
	},
	{
		id: "liquid",
		scopeName: "text.html.liquid",
		path: "liquid.tmLanguage.json",
		samplePath: "liquid.sample",
		embeddedLangs: [
			"html",
			"css",
			"json",
			"javascript"
		]
	},
	{
		id: "lisp",
		scopeName: "source.lisp",
		path: "lisp.tmLanguage.json"
	},
	{
		id: "logo",
		scopeName: "source.logo",
		path: "logo.tmLanguage.json"
	},
	{
		id: "lua",
		scopeName: "source.lua",
		path: "lua.tmLanguage.json",
		embeddedLangs: ["c"]
	},
	{
		id: "make",
		scopeName: "source.makefile",
		path: "make.tmLanguage.json",
		aliases: ["makefile"]
	},
	{
		id: "markdown",
		scopeName: "text.html.markdown",
		path: "markdown.tmLanguage.json",
		aliases: ["md"],
		embeddedLangs: [
			"css",
			"html",
			"ini",
			"java",
			"lua",
			"make",
			"perl",
			"r",
			"ruby",
			"php",
			"sql",
			"vb",
			"xml",
			"xsl",
			"yaml",
			"bat",
			"clojure",
			"coffee",
			"c",
			"cpp",
			"diff",
			"docker",
			"git-commit",
			"git-rebase",
			"go",
			"groovy",
			"pug",
			"javascript",
			"json",
			"jsonc",
			"less",
			"objective-c",
			"swift",
			"scss",
			"raku",
			"powershell",
			"python",
			"julia",
			"rust",
			"scala",
			"shellscript",
			"typescript",
			"tsx",
			"csharp",
			"fsharp",
			"dart",
			"handlebars",
			"erlang",
			"elixir",
			"latex",
			"bibtex"
		]
	},
	{
		id: "marko",
		scopeName: "text.marko",
		path: "marko.tmLanguage.json",
		embeddedLangs: [
			"css",
			"less",
			"scss",
			"typescript"
		]
	},
	{
		id: "matlab",
		scopeName: "source.matlab",
		path: "matlab.tmLanguage.json"
	},
	{
		id: "mdx",
		scopeName: "text.html.markdown.jsx",
		path: "mdx.tmLanguage.json",
		embeddedLangs: ["jsx", "markdown"]
	},
	{
		id: "mermaid",
		scopeName: "source.mermaid",
		path: "mermaid.tmLanguage.json"
	},
	{
		id: "nginx",
		scopeName: "source.nginx",
		path: "nginx.tmLanguage.json",
		embeddedLangs: ["lua"]
	},
	{
		id: "nim",
		scopeName: "source.nim",
		path: "nim.tmLanguage.json",
		embeddedLangs: [
			"c",
			"html",
			"xml",
			"javascript",
			"css",
			"glsl",
			"markdown"
		]
	},
	{
		id: "nix",
		scopeName: "source.nix",
		path: "nix.tmLanguage.json"
	},
	{
		id: "objective-c",
		scopeName: "source.objc",
		path: "objective-c.tmLanguage.json",
		aliases: ["objc"]
	},
	{
		id: "objective-cpp",
		scopeName: "source.objcpp",
		path: "objective-cpp.tmLanguage.json"
	},
	{
		id: "ocaml",
		scopeName: "source.ocaml",
		path: "ocaml.tmLanguage.json"
	},
	{
		id: "pascal",
		scopeName: "source.pascal",
		path: "pascal.tmLanguage.json"
	},
	{
		id: "perl",
		scopeName: "source.perl",
		path: "perl.tmLanguage.json",
		embeddedLangs: [
			"html",
			"xml",
			"css",
			"javascript",
			"sql"
		]
	},
	{
		id: "php",
		scopeName: "source.php",
		path: "php.tmLanguage.json",
		embeddedLangs: [
			"html",
			"xml",
			"sql",
			"javascript",
			"json",
			"css"
		]
	},
	{
		id: "plsql",
		scopeName: "source.plsql.oracle",
		path: "plsql.tmLanguage.json"
	},
	{
		id: "postcss",
		scopeName: "source.css.postcss",
		path: "postcss.tmLanguage.json"
	},
	{
		id: "powershell",
		scopeName: "source.powershell",
		path: "powershell.tmLanguage.json",
		aliases: ["ps", "ps1"]
	},
	{
		id: "prisma",
		scopeName: "source.prisma",
		path: "prisma.tmLanguage.json",
		samplePath: "prisma.sample"
	},
	{
		id: "prolog",
		scopeName: "source.prolog",
		path: "prolog.tmLanguage.json"
	},
	{
		id: "proto",
		scopeName: "source.proto",
		path: "proto.tmLanguage.json",
		samplePath: "proto.sample"
	},
	{
		id: "pug",
		scopeName: "text.pug",
		path: "pug.tmLanguage.json",
		aliases: ["jade"],
		embeddedLangs: [
			"javascript",
			"css",
			"sass",
			"scss",
			"stylus",
			"coffee",
			"html"
		]
	},
	{
		id: "puppet",
		scopeName: "source.puppet",
		path: "puppet.tmLanguage.json"
	},
	{
		id: "purescript",
		scopeName: "source.purescript",
		path: "purescript.tmLanguage.json"
	},
	{
		id: "python",
		scopeName: "source.python",
		path: "python.tmLanguage.json",
		samplePath: "python.sample",
		aliases: ["py"]
	},
	{
		id: "r",
		scopeName: "source.r",
		path: "r.tmLanguage.json"
	},
	{
		id: "raku",
		scopeName: "source.perl.6",
		path: "raku.tmLanguage.json",
		aliases: ["perl6"]
	},
	{
		id: "razor",
		scopeName: "text.aspnetcorerazor",
		path: "razor.tmLanguage.json",
		embeddedLangs: ["html", "csharp"]
	},
	{
		id: "rel",
		scopeName: "source.rel",
		path: "rel.tmLanguage.json",
		samplePath: "rel.sample"
	},
	{
		id: "riscv",
		scopeName: "source.riscv",
		path: "riscv.tmLanguage.json"
	},
	{
		id: "rst",
		scopeName: "source.rst",
		path: "rst.tmLanguage.json",
		embeddedLangs: [
			"cpp",
			"python",
			"javascript",
			"shellscript",
			"yaml",
			"cmake",
			"ruby"
		]
	},
	{
		id: "ruby",
		scopeName: "source.ruby",
		path: "ruby.tmLanguage.json",
		samplePath: "ruby.sample",
		aliases: ["rb"],
		embeddedLangs: [
			"html",
			"xml",
			"sql",
			"css",
			"c",
			"javascript",
			"shellscript",
			"lua"
		]
	},
	{
		id: "rust",
		scopeName: "source.rust",
		path: "rust.tmLanguage.json",
		aliases: ["rs"]
	},
	{
		id: "sas",
		scopeName: "source.sas",
		path: "sas.tmLanguage.json",
		embeddedLangs: ["sql"]
	},
	{
		id: "sass",
		scopeName: "source.sass",
		path: "sass.tmLanguage.json"
	},
	{
		id: "scala",
		scopeName: "source.scala",
		path: "scala.tmLanguage.json"
	},
	{
		id: "scheme",
		scopeName: "source.scheme",
		path: "scheme.tmLanguage.json"
	},
	{
		id: "scss",
		scopeName: "source.css.scss",
		path: "scss.tmLanguage.json",
		embeddedLangs: ["css"]
	},
	{
		id: "shaderlab",
		scopeName: "source.shaderlab",
		path: "shaderlab.tmLanguage.json",
		aliases: ["shader"],
		embeddedLangs: ["hlsl"]
	},
	{
		id: "shellscript",
		scopeName: "source.shell",
		path: "shellscript.tmLanguage.json",
		aliases: [
			"shell",
			"bash",
			"sh",
			"zsh"
		]
	},
	{
		id: "smalltalk",
		scopeName: "source.smalltalk",
		path: "smalltalk.tmLanguage.json"
	},
	{
		id: "solidity",
		scopeName: "source.solidity",
		path: "solidity.tmLanguage.json"
	},
	{
		id: "sparql",
		scopeName: "source.sparql",
		path: "sparql.tmLanguage.json",
		samplePath: "sparql.sample",
		embeddedLangs: ["turtle"]
	},
	{
		id: "sql",
		scopeName: "source.sql",
		path: "sql.tmLanguage.json"
	},
	{
		id: "ssh-config",
		scopeName: "source.ssh-config",
		path: "ssh-config.tmLanguage.json"
	},
	{
		id: "stata",
		scopeName: "source.stata",
		path: "stata.tmLanguage.json",
		samplePath: "stata.sample",
		embeddedLangs: ["sql"]
	},
	{
		id: "stylus",
		scopeName: "source.stylus",
		path: "stylus.tmLanguage.json",
		aliases: ["styl"]
	},
	{
		id: "svelte",
		scopeName: "source.svelte",
		path: "svelte.tmLanguage.json",
		embeddedLangs: [
			"javascript",
			"typescript",
			"coffee",
			"stylus",
			"sass",
			"css",
			"scss",
			"less",
			"postcss",
			"pug",
			"markdown"
		]
	},
	{
		id: "swift",
		scopeName: "source.swift",
		path: "swift.tmLanguage.json"
	},
	{
		id: "system-verilog",
		scopeName: "source.systemverilog",
		path: "system-verilog.tmLanguage.json"
	},
	{
		id: "tasl",
		scopeName: "source.tasl",
		path: "tasl.tmLanguage.json",
		samplePath: "tasl.sample"
	},
	{
		id: "tcl",
		scopeName: "source.tcl",
		path: "tcl.tmLanguage.json"
	},
	{
		id: "tex",
		scopeName: "text.tex",
		path: "tex.tmLanguage.json",
		embeddedLangs: ["r"]
	},
	{
		id: "toml",
		scopeName: "source.toml",
		path: "toml.tmLanguage.json"
	},
	{
		id: "tsx",
		scopeName: "source.tsx",
		path: "tsx.tmLanguage.json",
		samplePath: "tsx.sample"
	},
	{
		id: "turtle",
		scopeName: "source.turtle",
		path: "turtle.tmLanguage.json",
		samplePath: "turtle.sample"
	},
	{
		id: "twig",
		scopeName: "text.html.twig",
		path: "twig.tmLanguage.json",
		embeddedLangs: [
			"css",
			"javascript",
			"php",
			"python",
			"ruby"
		]
	},
	{
		id: "typescript",
		scopeName: "source.ts",
		path: "typescript.tmLanguage.json",
		aliases: ["ts"]
	},
	{
		id: "v",
		scopeName: "source.v",
		path: "v.tmLanguage.json",
		samplePath: "v.sample"
	},
	{
		id: "vb",
		scopeName: "source.asp.vb.net",
		path: "vb.tmLanguage.json",
		aliases: ["cmd"]
	},
	{
		id: "verilog",
		scopeName: "source.verilog",
		path: "verilog.tmLanguage.json"
	},
	{
		id: "vhdl",
		scopeName: "source.vhdl",
		path: "vhdl.tmLanguage.json"
	},
	{
		id: "viml",
		scopeName: "source.viml",
		path: "viml.tmLanguage.json",
		aliases: ["vim", "vimscript"]
	},
	{
		id: "vue-html",
		scopeName: "text.html.vue-html",
		path: "vue-html.tmLanguage.json",
		embeddedLangs: ["vue", "javascript"]
	},
	{
		id: "vue",
		scopeName: "source.vue",
		path: "vue.tmLanguage.json",
		embeddedLangs: [
			"html",
			"markdown",
			"pug",
			"stylus",
			"sass",
			"css",
			"scss",
			"less",
			"javascript",
			"typescript",
			"jsx",
			"tsx",
			"json",
			"jsonc",
			"yaml",
			"toml",
			"graphql"
		]
	},
	{
		id: "wasm",
		scopeName: "source.wat",
		path: "wasm.tmLanguage.json"
	},
	{
		id: "wenyan",
		scopeName: "source.wenyan",
		path: "wenyan.tmLanguage.json",
		aliases: ["文言"]
	},
	{
		id: "xml",
		scopeName: "text.xml",
		path: "xml.tmLanguage.json",
		embeddedLangs: ["java"]
	},
	{
		id: "xsl",
		scopeName: "text.xml.xsl",
		path: "xsl.tmLanguage.json",
		embeddedLangs: ["xml"]
	},
	{
		id: "yaml",
		scopeName: "source.yaml",
		path: "yaml.tmLanguage.json"
	},
	{
		id: "zenscript",
		scopeName: "source.zenscript",
		path: "zenscript.tmLanguage.json",
		samplePath: "zenscript.sample"
	}
];
var FontStyle = /* @__PURE__ */ ((FontStyle2) => {
	FontStyle2[FontStyle2["NotSet"] = -1] = "NotSet";
	FontStyle2[FontStyle2["None"] = 0] = "None";
	FontStyle2[FontStyle2["Italic"] = 1] = "Italic";
	FontStyle2[FontStyle2["Bold"] = 2] = "Bold";
	FontStyle2[FontStyle2["Underline"] = 4] = "Underline";
	return FontStyle2;
})(FontStyle || {});
var StackElementMetadata = class StackElementMetadata {
	static toBinaryStr(metadata) {
		let r = metadata.toString(2);
		while (r.length < 32) r = "0" + r;
		return r;
	}
	static printMetadata(metadata) {
		let languageId = StackElementMetadata.getLanguageId(metadata);
		let tokenType = StackElementMetadata.getTokenType(metadata);
		let fontStyle = StackElementMetadata.getFontStyle(metadata);
		let foreground = StackElementMetadata.getForeground(metadata);
		let background = StackElementMetadata.getBackground(metadata);
		console.log({
			languageId,
			tokenType,
			fontStyle,
			foreground,
			background
		});
	}
	static getLanguageId(metadata) {
		return (metadata & 255) >>> 0;
	}
	static getTokenType(metadata) {
		return (metadata & 768) >>> 8;
	}
	static getFontStyle(metadata) {
		return (metadata & 14336) >>> 11;
	}
	static getForeground(metadata) {
		return (metadata & 8372224) >>> 15;
	}
	static getBackground(metadata) {
		return (metadata & 4286578688) >>> 24;
	}
	static containsBalancedBrackets(metadata) {
		return (metadata & 1024) !== 0;
	}
	static set(metadata, languageId, tokenType, fontStyle, foreground, background) {
		let _languageId = StackElementMetadata.getLanguageId(metadata);
		let _tokenType = StackElementMetadata.getTokenType(metadata);
		let _fontStyle = StackElementMetadata.getFontStyle(metadata);
		let _foreground = StackElementMetadata.getForeground(metadata);
		let _background = StackElementMetadata.getBackground(metadata);
		let _containsBalancedBracketsBit = StackElementMetadata.containsBalancedBrackets(metadata) ? 1 : 0;
		if (languageId !== 0) _languageId = languageId;
		if (tokenType !== 0) _tokenType = tokenType === 8 ? 0 : tokenType;
		if (fontStyle !== -1) _fontStyle = fontStyle;
		if (foreground !== 0) _foreground = foreground;
		if (background !== 0) _background = background;
		return (_languageId << 0 | _tokenType << 8 | _fontStyle << 11 | _containsBalancedBracketsBit << 10 | _foreground << 15 | _background << 24) >>> 0;
	}
};
function trimEndSlash(str) {
	if (str.endsWith("/") || str.endsWith("\\")) return str.slice(0, -1);
	return str;
}
function trimStartDot(str) {
	if (str.startsWith("./")) return str.slice(2);
	return str;
}
function dirpathparts(str) {
	const parts = str.split(/[\/\\]/g);
	return parts.slice(0, parts.length - 1);
}
function join(...parts) {
	return parts.map(trimEndSlash).map(trimStartDot).join("/");
}
function groupBy(elements, keyGetter) {
	const map = /* @__PURE__ */ new Map();
	for (const element of elements) {
		const key = keyGetter(element);
		if (map.has(key)) {
			const group = map.get(key);
			group.push(element);
		} else map.set(key, [element]);
	}
	return map;
}
/**
* Creates a JSON scanner on the given text.
* If ignoreTrivia is set, whitespaces or comments are ignored.
*/
function createScanner(text, ignoreTrivia = false) {
	const len = text.length;
	let pos = 0, value = "", tokenOffset = 0, token = 16, lineNumber = 0, lineStartOffset = 0, tokenLineStartOffset = 0, prevTokenLineStartOffset = 0, scanError = 0;
	function scanHexDigits(count, exact) {
		let digits = 0;
		let value$1 = 0;
		while (digits < count || !exact) {
			let ch = text.charCodeAt(pos);
			if (ch >= 48 && ch <= 57) value$1 = value$1 * 16 + ch - 48;
else if (ch >= 65 && ch <= 70) value$1 = value$1 * 16 + ch - 65 + 10;
else if (ch >= 97 && ch <= 102) value$1 = value$1 * 16 + ch - 97 + 10;
else break;
			pos++;
			digits++;
		}
		if (digits < count) value$1 = -1;
		return value$1;
	}
	function setPosition(newPosition) {
		pos = newPosition;
		value = "";
		tokenOffset = 0;
		token = 16;
		scanError = 0;
	}
	function scanNumber() {
		let start = pos;
		if (text.charCodeAt(pos) === 48) pos++;
else {
			pos++;
			while (pos < text.length && isDigit(text.charCodeAt(pos))) pos++;
		}
		if (pos < text.length && text.charCodeAt(pos) === 46) {
			pos++;
			if (pos < text.length && isDigit(text.charCodeAt(pos))) {
				pos++;
				while (pos < text.length && isDigit(text.charCodeAt(pos))) pos++;
			} else {
				scanError = 3;
				return text.substring(start, pos);
			}
		}
		let end = pos;
		if (pos < text.length && (text.charCodeAt(pos) === 69 || text.charCodeAt(pos) === 101)) {
			pos++;
			if (pos < text.length && text.charCodeAt(pos) === 43 || text.charCodeAt(pos) === 45) pos++;
			if (pos < text.length && isDigit(text.charCodeAt(pos))) {
				pos++;
				while (pos < text.length && isDigit(text.charCodeAt(pos))) pos++;
				end = pos;
			} else scanError = 3;
		}
		return text.substring(start, end);
	}
	function scanString() {
		let result = "", start = pos;
		while (true) {
			if (pos >= len) {
				result += text.substring(start, pos);
				scanError = 2;
				break;
			}
			const ch = text.charCodeAt(pos);
			if (ch === 34) {
				result += text.substring(start, pos);
				pos++;
				break;
			}
			if (ch === 92) {
				result += text.substring(start, pos);
				pos++;
				if (pos >= len) {
					scanError = 2;
					break;
				}
				const ch2 = text.charCodeAt(pos++);
				switch (ch2) {
					case 34:
						result += "\"";
						break;
					case 92:
						result += "\\";
						break;
					case 47:
						result += "/";
						break;
					case 98:
						result += "\b";
						break;
					case 102:
						result += "\f";
						break;
					case 110:
						result += "\n";
						break;
					case 114:
						result += "\r";
						break;
					case 116:
						result += "	";
						break;
					case 117:
						const ch3 = scanHexDigits(4, true);
						if (ch3 >= 0) result += String.fromCharCode(ch3);
else scanError = 4;
						break;
					default: scanError = 5;
				}
				start = pos;
				continue;
			}
			if (ch >= 0 && ch <= 31) if (isLineBreak(ch)) {
				result += text.substring(start, pos);
				scanError = 2;
				break;
			} else scanError = 6;
			pos++;
		}
		return result;
	}
	function scanNext() {
		value = "";
		scanError = 0;
		tokenOffset = pos;
		lineStartOffset = lineNumber;
		prevTokenLineStartOffset = tokenLineStartOffset;
		if (pos >= len) {
			tokenOffset = len;
			return token = 17;
		}
		let code = text.charCodeAt(pos);
		if (isWhiteSpace(code)) {
			do {
				pos++;
				value += String.fromCharCode(code);
				code = text.charCodeAt(pos);
			} while (isWhiteSpace(code));
			return token = 15;
		}
		if (isLineBreak(code)) {
			pos++;
			value += String.fromCharCode(code);
			if (code === 13 && text.charCodeAt(pos) === 10) {
				pos++;
				value += "\n";
			}
			lineNumber++;
			tokenLineStartOffset = pos;
			return token = 14;
		}
		switch (code) {
			case 123:
				pos++;
				return token = 1;
			case 125:
				pos++;
				return token = 2;
			case 91:
				pos++;
				return token = 3;
			case 93:
				pos++;
				return token = 4;
			case 58:
				pos++;
				return token = 6;
			case 44:
				pos++;
				return token = 5;
			case 34:
				pos++;
				value = scanString();
				return token = 10;
			case 47:
				const start = pos - 1;
				if (text.charCodeAt(pos + 1) === 47) {
					pos += 2;
					while (pos < len) {
						if (isLineBreak(text.charCodeAt(pos))) break;
						pos++;
					}
					value = text.substring(start, pos);
					return token = 12;
				}
				if (text.charCodeAt(pos + 1) === 42) {
					pos += 2;
					const safeLength = len - 1;
					let commentClosed = false;
					while (pos < safeLength) {
						const ch = text.charCodeAt(pos);
						if (ch === 42 && text.charCodeAt(pos + 1) === 47) {
							pos += 2;
							commentClosed = true;
							break;
						}
						pos++;
						if (isLineBreak(ch)) {
							if (ch === 13 && text.charCodeAt(pos) === 10) pos++;
							lineNumber++;
							tokenLineStartOffset = pos;
						}
					}
					if (!commentClosed) {
						pos++;
						scanError = 1;
					}
					value = text.substring(start, pos);
					return token = 13;
				}
				value += String.fromCharCode(code);
				pos++;
				return token = 16;
			case 45:
				value += String.fromCharCode(code);
				pos++;
				if (pos === len || !isDigit(text.charCodeAt(pos))) return token = 16;
			case 48:
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57:
				value += scanNumber();
				return token = 11;
			default:
				while (pos < len && isUnknownContentCharacter(code)) {
					pos++;
					code = text.charCodeAt(pos);
				}
				if (tokenOffset !== pos) {
					value = text.substring(tokenOffset, pos);
					switch (value) {
						case "true": return token = 8;
						case "false": return token = 9;
						case "null": return token = 7;
					}
					return token = 16;
				}
				value += String.fromCharCode(code);
				pos++;
				return token = 16;
		}
	}
	function isUnknownContentCharacter(code) {
		if (isWhiteSpace(code) || isLineBreak(code)) return false;
		switch (code) {
			case 125:
			case 93:
			case 123:
			case 91:
			case 34:
			case 58:
			case 44:
			case 47: return false;
		}
		return true;
	}
	function scanNextNonTrivia() {
		let result;
		do 
			result = scanNext();
		while (result >= 12 && result <= 15);
		return result;
	}
	return {
		setPosition,
		getPosition: () => pos,
		scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
		getToken: () => token,
		getTokenValue: () => value,
		getTokenOffset: () => tokenOffset,
		getTokenLength: () => pos - tokenOffset,
		getTokenStartLine: () => lineStartOffset,
		getTokenStartCharacter: () => tokenOffset - prevTokenLineStartOffset,
		getTokenError: () => scanError
	};
}
function isWhiteSpace(ch) {
	return ch === 32 || ch === 9;
}
function isLineBreak(ch) {
	return ch === 10 || ch === 13;
}
function isDigit(ch) {
	return ch >= 48 && ch <= 57;
}
var CharacterCodes;
(function(CharacterCodes$1) {
	CharacterCodes$1[CharacterCodes$1["lineFeed"] = 10] = "lineFeed";
	CharacterCodes$1[CharacterCodes$1["carriageReturn"] = 13] = "carriageReturn";
	CharacterCodes$1[CharacterCodes$1["space"] = 32] = "space";
	CharacterCodes$1[CharacterCodes$1["_0"] = 48] = "_0";
	CharacterCodes$1[CharacterCodes$1["_1"] = 49] = "_1";
	CharacterCodes$1[CharacterCodes$1["_2"] = 50] = "_2";
	CharacterCodes$1[CharacterCodes$1["_3"] = 51] = "_3";
	CharacterCodes$1[CharacterCodes$1["_4"] = 52] = "_4";
	CharacterCodes$1[CharacterCodes$1["_5"] = 53] = "_5";
	CharacterCodes$1[CharacterCodes$1["_6"] = 54] = "_6";
	CharacterCodes$1[CharacterCodes$1["_7"] = 55] = "_7";
	CharacterCodes$1[CharacterCodes$1["_8"] = 56] = "_8";
	CharacterCodes$1[CharacterCodes$1["_9"] = 57] = "_9";
	CharacterCodes$1[CharacterCodes$1["a"] = 97] = "a";
	CharacterCodes$1[CharacterCodes$1["b"] = 98] = "b";
	CharacterCodes$1[CharacterCodes$1["c"] = 99] = "c";
	CharacterCodes$1[CharacterCodes$1["d"] = 100] = "d";
	CharacterCodes$1[CharacterCodes$1["e"] = 101] = "e";
	CharacterCodes$1[CharacterCodes$1["f"] = 102] = "f";
	CharacterCodes$1[CharacterCodes$1["g"] = 103] = "g";
	CharacterCodes$1[CharacterCodes$1["h"] = 104] = "h";
	CharacterCodes$1[CharacterCodes$1["i"] = 105] = "i";
	CharacterCodes$1[CharacterCodes$1["j"] = 106] = "j";
	CharacterCodes$1[CharacterCodes$1["k"] = 107] = "k";
	CharacterCodes$1[CharacterCodes$1["l"] = 108] = "l";
	CharacterCodes$1[CharacterCodes$1["m"] = 109] = "m";
	CharacterCodes$1[CharacterCodes$1["n"] = 110] = "n";
	CharacterCodes$1[CharacterCodes$1["o"] = 111] = "o";
	CharacterCodes$1[CharacterCodes$1["p"] = 112] = "p";
	CharacterCodes$1[CharacterCodes$1["q"] = 113] = "q";
	CharacterCodes$1[CharacterCodes$1["r"] = 114] = "r";
	CharacterCodes$1[CharacterCodes$1["s"] = 115] = "s";
	CharacterCodes$1[CharacterCodes$1["t"] = 116] = "t";
	CharacterCodes$1[CharacterCodes$1["u"] = 117] = "u";
	CharacterCodes$1[CharacterCodes$1["v"] = 118] = "v";
	CharacterCodes$1[CharacterCodes$1["w"] = 119] = "w";
	CharacterCodes$1[CharacterCodes$1["x"] = 120] = "x";
	CharacterCodes$1[CharacterCodes$1["y"] = 121] = "y";
	CharacterCodes$1[CharacterCodes$1["z"] = 122] = "z";
	CharacterCodes$1[CharacterCodes$1["A"] = 65] = "A";
	CharacterCodes$1[CharacterCodes$1["B"] = 66] = "B";
	CharacterCodes$1[CharacterCodes$1["C"] = 67] = "C";
	CharacterCodes$1[CharacterCodes$1["D"] = 68] = "D";
	CharacterCodes$1[CharacterCodes$1["E"] = 69] = "E";
	CharacterCodes$1[CharacterCodes$1["F"] = 70] = "F";
	CharacterCodes$1[CharacterCodes$1["G"] = 71] = "G";
	CharacterCodes$1[CharacterCodes$1["H"] = 72] = "H";
	CharacterCodes$1[CharacterCodes$1["I"] = 73] = "I";
	CharacterCodes$1[CharacterCodes$1["J"] = 74] = "J";
	CharacterCodes$1[CharacterCodes$1["K"] = 75] = "K";
	CharacterCodes$1[CharacterCodes$1["L"] = 76] = "L";
	CharacterCodes$1[CharacterCodes$1["M"] = 77] = "M";
	CharacterCodes$1[CharacterCodes$1["N"] = 78] = "N";
	CharacterCodes$1[CharacterCodes$1["O"] = 79] = "O";
	CharacterCodes$1[CharacterCodes$1["P"] = 80] = "P";
	CharacterCodes$1[CharacterCodes$1["Q"] = 81] = "Q";
	CharacterCodes$1[CharacterCodes$1["R"] = 82] = "R";
	CharacterCodes$1[CharacterCodes$1["S"] = 83] = "S";
	CharacterCodes$1[CharacterCodes$1["T"] = 84] = "T";
	CharacterCodes$1[CharacterCodes$1["U"] = 85] = "U";
	CharacterCodes$1[CharacterCodes$1["V"] = 86] = "V";
	CharacterCodes$1[CharacterCodes$1["W"] = 87] = "W";
	CharacterCodes$1[CharacterCodes$1["X"] = 88] = "X";
	CharacterCodes$1[CharacterCodes$1["Y"] = 89] = "Y";
	CharacterCodes$1[CharacterCodes$1["Z"] = 90] = "Z";
	CharacterCodes$1[CharacterCodes$1["asterisk"] = 42] = "asterisk";
	CharacterCodes$1[CharacterCodes$1["backslash"] = 92] = "backslash";
	CharacterCodes$1[CharacterCodes$1["closeBrace"] = 125] = "closeBrace";
	CharacterCodes$1[CharacterCodes$1["closeBracket"] = 93] = "closeBracket";
	CharacterCodes$1[CharacterCodes$1["colon"] = 58] = "colon";
	CharacterCodes$1[CharacterCodes$1["comma"] = 44] = "comma";
	CharacterCodes$1[CharacterCodes$1["dot"] = 46] = "dot";
	CharacterCodes$1[CharacterCodes$1["doubleQuote"] = 34] = "doubleQuote";
	CharacterCodes$1[CharacterCodes$1["minus"] = 45] = "minus";
	CharacterCodes$1[CharacterCodes$1["openBrace"] = 123] = "openBrace";
	CharacterCodes$1[CharacterCodes$1["openBracket"] = 91] = "openBracket";
	CharacterCodes$1[CharacterCodes$1["plus"] = 43] = "plus";
	CharacterCodes$1[CharacterCodes$1["slash"] = 47] = "slash";
	CharacterCodes$1[CharacterCodes$1["formFeed"] = 12] = "formFeed";
	CharacterCodes$1[CharacterCodes$1["tab"] = 9] = "tab";
})(CharacterCodes || (CharacterCodes = {}));
var ParseOptions;
(function(ParseOptions$1) {
	ParseOptions$1.DEFAULT = { allowTrailingComma: false };
})(ParseOptions || (ParseOptions = {}));
/**
* Parses the given text and returns the object the JSON content represents. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
* Therefore always check the errors list to find out if the input was valid.
*/
function parse$1(text, errors = [], options = ParseOptions.DEFAULT) {
	let currentProperty = null;
	let currentParent = [];
	const previousParents = [];
	function onValue(value) {
		if (Array.isArray(currentParent)) currentParent.push(value);
else if (currentProperty !== null) currentParent[currentProperty] = value;
	}
	const visitor = {
		onObjectBegin: () => {
			const object = {};
			onValue(object);
			previousParents.push(currentParent);
			currentParent = object;
			currentProperty = null;
		},
		onObjectProperty: (name) => {
			currentProperty = name;
		},
		onObjectEnd: () => {
			currentParent = previousParents.pop();
		},
		onArrayBegin: () => {
			const array = [];
			onValue(array);
			previousParents.push(currentParent);
			currentParent = array;
			currentProperty = null;
		},
		onArrayEnd: () => {
			currentParent = previousParents.pop();
		},
		onLiteralValue: onValue,
		onError: (error, offset, length) => {
			errors.push({
				error,
				offset,
				length
			});
		}
	};
	visit(text, visitor, options);
	return currentParent[0];
}
/**
* Parses the given text and invokes the visitor functions for each object, array and literal reached.
*/
function visit(text, visitor, options = ParseOptions.DEFAULT) {
	const _scanner = createScanner(text, false);
	const _jsonPath = [];
	function toNoArgVisit(visitFunction) {
		return visitFunction ? () => visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
	}
	function toNoArgVisitWithPath(visitFunction) {
		return visitFunction ? () => visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice()) : () => true;
	}
	function toOneArgVisit(visitFunction) {
		return visitFunction ? (arg) => visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
	}
	function toOneArgVisitWithPath(visitFunction) {
		return visitFunction ? (arg) => visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice()) : () => true;
	}
	const onObjectBegin = toNoArgVisitWithPath(visitor.onObjectBegin), onObjectProperty = toOneArgVisitWithPath(visitor.onObjectProperty), onObjectEnd = toNoArgVisit(visitor.onObjectEnd), onArrayBegin = toNoArgVisitWithPath(visitor.onArrayBegin), onArrayEnd = toNoArgVisit(visitor.onArrayEnd), onLiteralValue = toOneArgVisitWithPath(visitor.onLiteralValue), onSeparator = toOneArgVisit(visitor.onSeparator), onComment = toNoArgVisit(visitor.onComment), onError = toOneArgVisit(visitor.onError);
	const disallowComments = options && options.disallowComments;
	const allowTrailingComma = options && options.allowTrailingComma;
	function scanNext() {
		while (true) {
			const token = _scanner.scan();
			switch (_scanner.getTokenError()) {
				case 4:
					handleError(
						14
						/* ParseErrorCode.InvalidUnicode */
);
					break;
				case 5:
					handleError(
						15
						/* ParseErrorCode.InvalidEscapeCharacter */
);
					break;
				case 3:
					handleError(
						13
						/* ParseErrorCode.UnexpectedEndOfNumber */
);
					break;
				case 1:
					if (!disallowComments) handleError(
						11
						/* ParseErrorCode.UnexpectedEndOfComment */
);
					break;
				case 2:
					handleError(
						12
						/* ParseErrorCode.UnexpectedEndOfString */
);
					break;
				case 6:
					handleError(
						16
						/* ParseErrorCode.InvalidCharacter */
);
					break;
			}
			switch (token) {
				case 12:
				case 13:
					if (disallowComments) handleError(
						10
						/* ParseErrorCode.InvalidCommentToken */
);
else onComment();
					break;
				case 16:
					handleError(
						1
						/* ParseErrorCode.InvalidSymbol */
);
					break;
				case 15:
				case 14: break;
				default: return token;
			}
		}
	}
	function handleError(error, skipUntilAfter = [], skipUntil = []) {
		onError(error);
		if (skipUntilAfter.length + skipUntil.length > 0) {
			let token = _scanner.getToken();
			while (token !== 17) {
				if (skipUntilAfter.indexOf(token) !== -1) {
					scanNext();
					break;
				} else if (skipUntil.indexOf(token) !== -1) break;
				token = scanNext();
			}
		}
	}
	function parseString(isValue) {
		const value = _scanner.getTokenValue();
		if (isValue) onLiteralValue(value);
else {
			onObjectProperty(value);
			_jsonPath.push(value);
		}
		scanNext();
		return true;
	}
	function parseLiteral() {
		switch (_scanner.getToken()) {
			case 11:
				const tokenValue = _scanner.getTokenValue();
				let value = Number(tokenValue);
				if (isNaN(value)) {
					handleError(
						2
						/* ParseErrorCode.InvalidNumberFormat */
);
					value = 0;
				}
				onLiteralValue(value);
				break;
			case 7:
				onLiteralValue(null);
				break;
			case 8:
				onLiteralValue(true);
				break;
			case 9:
				onLiteralValue(false);
				break;
			default: return false;
		}
		scanNext();
		return true;
	}
	function parseProperty() {
		if (_scanner.getToken() !== 10) {
			handleError(3, [], [2, 5]);
			return false;
		}
		parseString(false);
		if (_scanner.getToken() === 6) {
			onSeparator(":");
			scanNext();
			if (!parseValue()) handleError(4, [], [2, 5]);
		} else handleError(5, [], [2, 5]);
		_jsonPath.pop();
		return true;
	}
	function parseObject() {
		onObjectBegin();
		scanNext();
		let needsComma = false;
		while (_scanner.getToken() !== 2 && _scanner.getToken() !== 17) {
			if (_scanner.getToken() === 5) {
				if (!needsComma) handleError(4, [], []);
				onSeparator(",");
				scanNext();
				if (_scanner.getToken() === 2 && allowTrailingComma) break;
			} else if (needsComma) handleError(6, [], []);
			if (!parseProperty()) handleError(4, [], [2, 5]);
			needsComma = true;
		}
		onObjectEnd();
		if (_scanner.getToken() !== 2) handleError(7, [2], []);
else scanNext();
		return true;
	}
	function parseArray() {
		onArrayBegin();
		scanNext();
		let isFirstElement = true;
		let needsComma = false;
		while (_scanner.getToken() !== 4 && _scanner.getToken() !== 17) {
			if (_scanner.getToken() === 5) {
				if (!needsComma) handleError(4, [], []);
				onSeparator(",");
				scanNext();
				if (_scanner.getToken() === 4 && allowTrailingComma) break;
			} else if (needsComma) handleError(6, [], []);
			if (isFirstElement) {
				_jsonPath.push(0);
				isFirstElement = false;
			} else _jsonPath[_jsonPath.length - 1]++;
			if (!parseValue()) handleError(4, [], [4, 5]);
			needsComma = true;
		}
		onArrayEnd();
		if (!isFirstElement) _jsonPath.pop();
		if (_scanner.getToken() !== 4) handleError(8, [4], []);
else scanNext();
		return true;
	}
	function parseValue() {
		switch (_scanner.getToken()) {
			case 3: return parseArray();
			case 1: return parseObject();
			case 10: return parseString(true);
			default: return parseLiteral();
		}
	}
	scanNext();
	if (_scanner.getToken() === 17) {
		if (options.allowEmptyContent) return true;
		handleError(4, [], []);
		return false;
	}
	if (!parseValue()) {
		handleError(4, [], []);
		return false;
	}
	if (_scanner.getToken() !== 17) handleError(9, [], []);
	return true;
}
var ScanError;
(function(ScanError$1) {
	ScanError$1[ScanError$1["None"] = 0] = "None";
	ScanError$1[ScanError$1["UnexpectedEndOfComment"] = 1] = "UnexpectedEndOfComment";
	ScanError$1[ScanError$1["UnexpectedEndOfString"] = 2] = "UnexpectedEndOfString";
	ScanError$1[ScanError$1["UnexpectedEndOfNumber"] = 3] = "UnexpectedEndOfNumber";
	ScanError$1[ScanError$1["InvalidUnicode"] = 4] = "InvalidUnicode";
	ScanError$1[ScanError$1["InvalidEscapeCharacter"] = 5] = "InvalidEscapeCharacter";
	ScanError$1[ScanError$1["InvalidCharacter"] = 6] = "InvalidCharacter";
})(ScanError || (ScanError = {}));
var SyntaxKind;
(function(SyntaxKind$1) {
	SyntaxKind$1[SyntaxKind$1["OpenBraceToken"] = 1] = "OpenBraceToken";
	SyntaxKind$1[SyntaxKind$1["CloseBraceToken"] = 2] = "CloseBraceToken";
	SyntaxKind$1[SyntaxKind$1["OpenBracketToken"] = 3] = "OpenBracketToken";
	SyntaxKind$1[SyntaxKind$1["CloseBracketToken"] = 4] = "CloseBracketToken";
	SyntaxKind$1[SyntaxKind$1["CommaToken"] = 5] = "CommaToken";
	SyntaxKind$1[SyntaxKind$1["ColonToken"] = 6] = "ColonToken";
	SyntaxKind$1[SyntaxKind$1["NullKeyword"] = 7] = "NullKeyword";
	SyntaxKind$1[SyntaxKind$1["TrueKeyword"] = 8] = "TrueKeyword";
	SyntaxKind$1[SyntaxKind$1["FalseKeyword"] = 9] = "FalseKeyword";
	SyntaxKind$1[SyntaxKind$1["StringLiteral"] = 10] = "StringLiteral";
	SyntaxKind$1[SyntaxKind$1["NumericLiteral"] = 11] = "NumericLiteral";
	SyntaxKind$1[SyntaxKind$1["LineCommentTrivia"] = 12] = "LineCommentTrivia";
	SyntaxKind$1[SyntaxKind$1["BlockCommentTrivia"] = 13] = "BlockCommentTrivia";
	SyntaxKind$1[SyntaxKind$1["LineBreakTrivia"] = 14] = "LineBreakTrivia";
	SyntaxKind$1[SyntaxKind$1["Trivia"] = 15] = "Trivia";
	SyntaxKind$1[SyntaxKind$1["Unknown"] = 16] = "Unknown";
	SyntaxKind$1[SyntaxKind$1["EOF"] = 17] = "EOF";
})(SyntaxKind || (SyntaxKind = {}));
/**
* Parses the given text and returns the object the JSON content represents. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
* Therefore, always check the errors list to find out if the input was valid.
*/
const parse = parse$1;
var ParseErrorCode;
(function(ParseErrorCode$1) {
	ParseErrorCode$1[ParseErrorCode$1["InvalidSymbol"] = 1] = "InvalidSymbol";
	ParseErrorCode$1[ParseErrorCode$1["InvalidNumberFormat"] = 2] = "InvalidNumberFormat";
	ParseErrorCode$1[ParseErrorCode$1["PropertyNameExpected"] = 3] = "PropertyNameExpected";
	ParseErrorCode$1[ParseErrorCode$1["ValueExpected"] = 4] = "ValueExpected";
	ParseErrorCode$1[ParseErrorCode$1["ColonExpected"] = 5] = "ColonExpected";
	ParseErrorCode$1[ParseErrorCode$1["CommaExpected"] = 6] = "CommaExpected";
	ParseErrorCode$1[ParseErrorCode$1["CloseBraceExpected"] = 7] = "CloseBraceExpected";
	ParseErrorCode$1[ParseErrorCode$1["CloseBracketExpected"] = 8] = "CloseBracketExpected";
	ParseErrorCode$1[ParseErrorCode$1["EndOfFileExpected"] = 9] = "EndOfFileExpected";
	ParseErrorCode$1[ParseErrorCode$1["InvalidCommentToken"] = 10] = "InvalidCommentToken";
	ParseErrorCode$1[ParseErrorCode$1["UnexpectedEndOfComment"] = 11] = "UnexpectedEndOfComment";
	ParseErrorCode$1[ParseErrorCode$1["UnexpectedEndOfString"] = 12] = "UnexpectedEndOfString";
	ParseErrorCode$1[ParseErrorCode$1["UnexpectedEndOfNumber"] = 13] = "UnexpectedEndOfNumber";
	ParseErrorCode$1[ParseErrorCode$1["InvalidUnicode"] = 14] = "InvalidUnicode";
	ParseErrorCode$1[ParseErrorCode$1["InvalidEscapeCharacter"] = 15] = "InvalidEscapeCharacter";
	ParseErrorCode$1[ParseErrorCode$1["InvalidCharacter"] = 16] = "InvalidCharacter";
})(ParseErrorCode || (ParseErrorCode = {}));
"process" in globalThis && typeof process !== "undefined" && typeof process.release !== "undefined" && process.release.name === "node";
let CDN_ROOT = "";
let WASM = "";
const WASM_PATH = "dist/";
function setCDN(root) {
	CDN_ROOT = root.endsWith("/") ? root : root + "/";
}
let _onigurumaPromise = null;
async function getOniguruma(wasmPath) {
	if (!_onigurumaPromise) {
		let loader;
		if (typeof WASM === "string") loader = mainExports$1.loadWASM({ data: await (globalThis.__shiki_fetch__ || globalThis.fetch)(_resolvePath(join(...dirpathparts(wasmPath), "onig.wasm"))) });
else loader = mainExports$1.loadWASM({ data: WASM });
		_onigurumaPromise = loader.then(() => {
			return {
				createOnigScanner(patterns) {
					return mainExports$1.createOnigScanner(patterns);
				},
				createOnigString(s) {
					return mainExports$1.createOnigString(s);
				}
			};
		});
	}
	return _onigurumaPromise;
}
function _resolvePath(filepath) {
	return `${CDN_ROOT}${filepath}`;
}
async function _fetchAssets(filepath) {
	const path = _resolvePath(filepath);
	return await (globalThis.__shiki_fetch__ || globalThis.fetch)(path).then((r) => r.text());
}
async function _fetchJSONAssets(filepath) {
	const errors = [];
	const rawTheme = parse(await _fetchAssets(filepath), errors, { allowTrailingComma: true });
	if (errors.length) throw errors[0];
	return rawTheme;
}
async function fetchTheme(themePath) {
	let theme = await _fetchJSONAssets(themePath);
	const shikiTheme = toShikiTheme(theme);
	if (shikiTheme.include) {
		const includedTheme = await fetchTheme(join(...dirpathparts(themePath), shikiTheme.include));
		if (includedTheme.settings) shikiTheme.settings = includedTheme.settings.concat(shikiTheme.settings);
		if (includedTheme.bg && !shikiTheme.bg) shikiTheme.bg = includedTheme.bg;
		if (includedTheme.colors) shikiTheme.colors = {
			...includedTheme.colors,
			...shikiTheme.colors
		};
		delete shikiTheme.include;
	}
	return shikiTheme;
}
async function fetchGrammar(filepath) {
	return await _fetchJSONAssets(filepath);
}
function repairTheme(theme) {
	if (!theme.settings) theme.settings = [];
	if (theme.settings[0] && theme.settings[0].settings && !theme.settings[0].scope) return;
	theme.settings.unshift({ settings: {
		foreground: theme.fg,
		background: theme.bg
	} });
}
function toShikiTheme(rawTheme) {
	const type = rawTheme.type || "dark";
	const shikiTheme = {
		name: rawTheme.name,
		type,
		...rawTheme,
		...getThemeDefaultColors(rawTheme)
	};
	if (rawTheme.include) shikiTheme.include = rawTheme.include;
	if (rawTheme.tokenColors) {
		shikiTheme.settings = rawTheme.tokenColors;
		delete shikiTheme.tokenColors;
	}
	repairTheme(shikiTheme);
	return shikiTheme;
}
const VSCODE_FALLBACK_EDITOR_FG = {
	light: "#333333",
	dark: "#bbbbbb"
};
const VSCODE_FALLBACK_EDITOR_BG = {
	light: "#fffffe",
	dark: "#1e1e1e"
};
function getThemeDefaultColors(theme) {
	let fg, bg;
	let settings = theme.settings ? theme.settings : theme.tokenColors;
	const globalSetting = settings ? settings.find((s) => {
		return !s.name && !s.scope;
	}) : void 0;
	if (globalSetting?.settings?.foreground) fg = globalSetting.settings.foreground;
	if (globalSetting?.settings?.background) bg = globalSetting.settings.background;
	if (!fg && theme?.colors?.["editor.foreground"]) fg = theme.colors["editor.foreground"];
	if (!bg && theme?.colors?.["editor.background"]) bg = theme.colors["editor.background"];
	if (!fg) fg = theme.type === "light" ? VSCODE_FALLBACK_EDITOR_FG.light : VSCODE_FALLBACK_EDITOR_FG.dark;
	if (!bg) bg = theme.type === "light" ? VSCODE_FALLBACK_EDITOR_BG.light : VSCODE_FALLBACK_EDITOR_BG.dark;
	return {
		fg,
		bg
	};
}
var Resolver = class {
	constructor(onigLibPromise, onigLibName) {
		this.languagesPath = "languages/";
		this.languageMap = {};
		this.scopeToLangMap = {};
		this._onigLibPromise = onigLibPromise;
		this._onigLibName = onigLibName;
	}
	get onigLib() {
		return this._onigLibPromise;
	}
	getOnigLibName() {
		return this._onigLibName;
	}
	getLangRegistration(langIdOrAlias) {
		return this.languageMap[langIdOrAlias];
	}
	async loadGrammar(scopeName) {
		const lang = this.scopeToLangMap[scopeName];
		if (!lang) return null;
		if (lang.grammar) return lang.grammar;
		const g = await fetchGrammar(languages.includes(lang) ? `${this.languagesPath}${lang.path}` : lang.path);
		lang.grammar = g;
		return g;
	}
	addLanguage(l) {
		this.languageMap[l.id] = l;
		if (l.aliases) l.aliases.forEach((a) => {
			this.languageMap[a] = l;
		});
		this.scopeToLangMap[l.scopeName] = l;
	}
};
function tokenizeWithTheme(theme, colorMap, fileContents, grammar, options) {
	let lines = fileContents.split(/\r\n|\r|\n/);
	let ruleStack = mainExports.INITIAL;
	let actual = [];
	let final = [];
	for (let i = 0, len = lines.length; i < len; i++) {
		let line = lines[i];
		if (line === "") {
			actual = [];
			final.push([]);
			continue;
		}
		let resultWithScopes;
		let tokensWithScopes;
		let tokensWithScopesIndex;
		if (options.includeExplanation) {
			resultWithScopes = grammar.tokenizeLine(line, ruleStack);
			tokensWithScopes = resultWithScopes.tokens;
			tokensWithScopesIndex = 0;
		}
		let result = grammar.tokenizeLine2(line, ruleStack);
		let tokensLength = result.tokens.length / 2;
		for (let j = 0; j < tokensLength; j++) {
			let startIndex = result.tokens[2 * j];
			let nextStartIndex = j + 1 < tokensLength ? result.tokens[2 * j + 2] : line.length;
			if (startIndex === nextStartIndex) continue;
			let metadata = result.tokens[2 * j + 1];
			let foreground = StackElementMetadata.getForeground(metadata);
			let foregroundColor = colorMap[foreground];
			let fontStyle = StackElementMetadata.getFontStyle(metadata);
			let explanation = [];
			if (options.includeExplanation) {
				let offset = 0;
				while (startIndex + offset < nextStartIndex) {
					let tokenWithScopes = tokensWithScopes[tokensWithScopesIndex];
					let tokenWithScopesText = line.substring(tokenWithScopes.startIndex, tokenWithScopes.endIndex);
					offset += tokenWithScopesText.length;
					explanation.push({
						content: tokenWithScopesText,
						scopes: explainThemeScopes(theme, tokenWithScopes.scopes)
					});
					tokensWithScopesIndex++;
				}
			}
			actual.push({
				content: line.substring(startIndex, nextStartIndex),
				color: foregroundColor,
				fontStyle,
				explanation
			});
		}
		final.push(actual);
		actual = [];
		ruleStack = result.ruleStack;
	}
	return final;
}
function explainThemeScopes(theme, scopes) {
	let result = [];
	for (let i = 0, len = scopes.length; i < len; i++) {
		let parentScopes = scopes.slice(0, i);
		let scope = scopes[i];
		result[i] = {
			scopeName: scope,
			themeMatches: explainThemeScope(theme, scope, parentScopes)
		};
	}
	return result;
}
function matchesOne(selector, scope) {
	let selectorPrefix = selector + ".";
	if (selector === scope || scope.substring(0, selectorPrefix.length) === selectorPrefix) return true;
	return false;
}
function matches(selector, selectorParentScopes, scope, parentScopes) {
	if (!matchesOne(selector, scope)) return false;
	let selectorParentIndex = selectorParentScopes.length - 1;
	let parentIndex = parentScopes.length - 1;
	while (selectorParentIndex >= 0 && parentIndex >= 0) {
		if (matchesOne(selectorParentScopes[selectorParentIndex], parentScopes[parentIndex])) selectorParentIndex--;
		parentIndex--;
	}
	if (selectorParentIndex === -1) return true;
	return false;
}
function explainThemeScope(theme, scope, parentScopes) {
	let result = [], resultLen = 0;
	for (let i = 0, len = theme.settings.length; i < len; i++) {
		let setting = theme.settings[i];
		let selectors;
		if (typeof setting.scope === "string") selectors = setting.scope.split(/,/).map((scope2) => scope2.trim());
else if (Array.isArray(setting.scope)) selectors = setting.scope;
else continue;
		for (let j = 0, lenJ = selectors.length; j < lenJ; j++) {
			let rawSelector = selectors[j];
			let rawSelectorPieces = rawSelector.split(/ /);
			let selector = rawSelectorPieces[rawSelectorPieces.length - 1];
			let selectorParentScopes = rawSelectorPieces.slice(0, rawSelectorPieces.length - 1);
			if (matches(selector, selectorParentScopes, scope, parentScopes)) {
				result[resultLen++] = setting;
				j = lenJ;
			}
		}
	}
	return result;
}
const defaultElements = {
	pre({ className, style, children }) {
		return `<pre class="${className}" style="${style}">${children}</pre>`;
	},
	code({ children }) {
		return `<code>${children}</code>`;
	},
	line({ className, children }) {
		return `<span class="${className}">${children}</span>`;
	},
	token({ style, children }) {
		return `<span style="${style}">${children}</span>`;
	}
};
function renderToHtml(lines, options = {}) {
	const bg = options.bg || "#fff";
	const optionsByLineNumber = groupBy(options.lineOptions ?? [], (option) => option.line);
	const userElements = options.elements || {};
	function h(type = "", props = {}, children) {
		const element = userElements[type] || defaultElements[type];
		if (element) {
			children = children.filter(Boolean);
			return element({
				...props,
				children: type === "code" ? children.join("\n") : children.join("")
			});
		}
		return "";
	}
	return h("pre", {
		className: "shiki " + (options.themeName || ""),
		style: `background-color: ${bg}`
	}, [options.langId ? `<div class="language-id">${options.langId}</div>` : "", h("code", {}, lines.map((line, index) => {
		const lineNumber = index + 1;
		const lineOptions = optionsByLineNumber.get(lineNumber) ?? [];
		const lineClasses = getLineClasses(lineOptions).join(" ");
		return h("line", {
			className: lineClasses,
			lines,
			line,
			index
		}, line.map((token, index2) => {
			const cssDeclarations = [`color: ${token.color || options.fg}`];
			if (token.fontStyle & FontStyle.Italic) cssDeclarations.push("font-style: italic");
			if (token.fontStyle & FontStyle.Bold) cssDeclarations.push("font-weight: bold");
			if (token.fontStyle & FontStyle.Underline) cssDeclarations.push("text-decoration: underline");
			return h("token", {
				style: cssDeclarations.join("; "),
				tokens: line,
				token,
				index: index2
			}, [escapeHtml(token.content)]);
		}));
	}))]);
}
const htmlEscapes = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
};
function escapeHtml(html) {
	return html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr]);
}
function getLineClasses(lineOptions) {
	const lineClasses = /* @__PURE__ */ new Set(["line"]);
	for (const lineOption of lineOptions) for (const lineClass of lineOption.classes ?? []) lineClasses.add(lineClass);
	return Array.from(lineClasses);
}
var Registry = class extends mainExports.Registry {
	constructor(_resolver) {
		super(_resolver);
		this._resolver = _resolver;
		this.themesPath = "themes/";
		this._resolvedThemes = {};
		this._resolvedGrammars = {};
		this._langGraph = /* @__PURE__ */ new Map();
		this._langMap = languages.reduce((acc, lang) => {
			acc[lang.id] = lang;
			return acc;
		}, {});
	}
	getTheme(theme) {
		if (typeof theme === "string") return this._resolvedThemes[theme];
else return theme;
	}
	async loadTheme(theme) {
		if (typeof theme === "string") {
			if (!this._resolvedThemes[theme]) this._resolvedThemes[theme] = await fetchTheme(`${this.themesPath}${theme}.json`);
			return this._resolvedThemes[theme];
		} else {
			theme = toShikiTheme(theme);
			if (theme.name) this._resolvedThemes[theme.name] = theme;
			return theme;
		}
	}
	async loadThemes(themes$1) {
		return await Promise.all(themes$1.map((theme) => this.loadTheme(theme)));
	}
	getLoadedThemes() {
		return Object.keys(this._resolvedThemes);
	}
	getGrammar(name) {
		return this._resolvedGrammars[name];
	}
	async loadLanguage(lang) {
		const embeddedLanguages = lang.embeddedLangs?.reduce(async (acc, l, idx) => {
			if (!this.getLoadedLanguages().includes(l) && this._resolver.getLangRegistration(l)) {
				await this._resolver.loadGrammar(this._resolver.getLangRegistration(l).scopeName);
				acc[this._resolver.getLangRegistration(l).scopeName] = idx + 2;
				return acc;
			}
		}, {});
		const grammarConfig = {
			embeddedLanguages,
			balancedBracketSelectors: lang.balancedBracketSelectors || ["*"],
			unbalancedBracketSelectors: lang.unbalancedBracketSelectors || []
		};
		const g = await this.loadGrammarWithConfiguration(lang.scopeName, 1, grammarConfig);
		this._resolvedGrammars[lang.id] = g;
		if (lang.aliases) lang.aliases.forEach((la) => {
			this._resolvedGrammars[la] = g;
		});
	}
	async loadLanguages(langs) {
		for (const lang of langs) this.resolveEmbeddedLanguages(lang);
		const langsGraphArray = Array.from(this._langGraph.values());
		for (const lang of langsGraphArray) this._resolver.addLanguage(lang);
		for (const lang of langsGraphArray) await this.loadLanguage(lang);
	}
	getLoadedLanguages() {
		return Object.keys(this._resolvedGrammars);
	}
	resolveEmbeddedLanguages(lang) {
		if (!this._langGraph.has(lang.id)) this._langGraph.set(lang.id, lang);
		if (lang.embeddedLangs) for (const embeddedLang of lang.embeddedLangs) this._langGraph.set(embeddedLang, this._langMap[embeddedLang]);
	}
};
function resolveLang(lang) {
	return typeof lang === "string" ? languages.find((l) => l.id === lang || l.aliases?.includes(lang)) : lang;
}
function resolveOptions(options) {
	let _languages = languages;
	let _themes = options.themes || [];
	let _wasmPath = options.paths?.wasm ? options.paths.wasm.endsWith("/") ? options.paths.wasm : options.paths.wasm + "/" : WASM_PATH;
	if (options.langs) _languages = options.langs.map(resolveLang);
	if (options.theme) _themes.unshift(options.theme);
	if (!_themes.length) _themes = ["nord"];
	return {
		_languages,
		_themes,
		_wasmPath
	};
}
async function getHighlighter(options) {
	const { _languages, _themes, _wasmPath } = resolveOptions(options);
	const _resolver = new Resolver(getOniguruma(_wasmPath), "vscode-oniguruma");
	const _registry = new Registry(_resolver);
	if (options.paths?.themes) _registry.themesPath = options.paths.themes.endsWith("/") ? options.paths.themes : options.paths.themes + "/";
	if (options.paths?.languages) _resolver.languagesPath = options.paths.languages.endsWith("/") ? options.paths.languages : options.paths.languages + "/";
	const themes$1 = await _registry.loadThemes(_themes);
	const _defaultTheme = themes$1[0];
	let _currentTheme;
	await _registry.loadLanguages(_languages);
	let COLOR_REPLACEMENTS = {
		"#000001": "var(--shiki-color-text)",
		"#000002": "var(--shiki-color-background)",
		"#000004": "var(--shiki-token-constant)",
		"#000005": "var(--shiki-token-string)",
		"#000006": "var(--shiki-token-comment)",
		"#000007": "var(--shiki-token-keyword)",
		"#000008": "var(--shiki-token-parameter)",
		"#000009": "var(--shiki-token-function)",
		"#000010": "var(--shiki-token-string-expression)",
		"#000011": "var(--shiki-token-punctuation)",
		"#000012": "var(--shiki-token-link)"
	};
	function setColorReplacements(map) {
		COLOR_REPLACEMENTS = map;
	}
	function fixCssVariablesTheme(theme, colorMap) {
		theme.bg = COLOR_REPLACEMENTS[theme.bg] || theme.bg;
		theme.fg = COLOR_REPLACEMENTS[theme.fg] || theme.fg;
		colorMap.forEach((val, i) => {
			colorMap[i] = COLOR_REPLACEMENTS[val] || val;
		});
	}
	function getTheme(theme) {
		const _theme = theme ? _registry.getTheme(theme) : _defaultTheme;
		if (!_theme) throw Error(`No theme registration for ${theme}`);
		if (!_currentTheme || _currentTheme.name !== _theme.name) {
			_registry.setTheme(_theme);
			_currentTheme = _theme;
		}
		const _colorMap = _registry.getColorMap();
		if (_theme.type === "css") fixCssVariablesTheme(_theme, _colorMap);
		return {
			_theme,
			_colorMap
		};
	}
	function getGrammar(lang) {
		const _grammar = _registry.getGrammar(lang);
		if (!_grammar) throw Error(`No language registration for ${lang}`);
		return { _grammar };
	}
	function codeToThemedTokens(code, lang = "text", theme, options2 = { includeExplanation: true }) {
		if (isPlaintext(lang)) {
			const lines = code.split(/\r\n|\r|\n/);
			return [...lines.map((line) => [{ content: line }])];
		}
		const { _grammar } = getGrammar(lang);
		const { _theme, _colorMap } = getTheme(theme);
		return tokenizeWithTheme(_theme, _colorMap, code, _grammar, options2);
	}
	function codeToHtml(code, arg1 = "text", arg2) {
		let options2;
		if (typeof arg1 === "object") options2 = arg1;
else options2 = {
			lang: arg1,
			theme: arg2
		};
		const tokens = codeToThemedTokens(code, options2.lang, options2.theme, { includeExplanation: false });
		const { _theme } = getTheme(options2.theme);
		return renderToHtml(tokens, {
			fg: _theme.fg,
			bg: _theme.bg,
			lineOptions: options2?.lineOptions,
			themeName: _theme.name
		});
	}
	async function loadTheme(theme) {
		await _registry.loadTheme(theme);
	}
	async function loadLanguage(lang) {
		const _lang = resolveLang(lang);
		_resolver.addLanguage(_lang);
		await _registry.loadLanguage(_lang);
	}
	function getLoadedThemes() {
		return _registry.getLoadedThemes();
	}
	function getLoadedLanguages() {
		return _registry.getLoadedLanguages();
	}
	function getBackgroundColor(theme) {
		const { _theme } = getTheme(theme);
		return _theme.bg;
	}
	function getForegroundColor(theme) {
		const { _theme } = getTheme(theme);
		return _theme.fg;
	}
	return {
		codeToThemedTokens,
		codeToHtml,
		getTheme: (theme) => {
			return getTheme(theme)._theme;
		},
		loadTheme,
		loadLanguage,
		getBackgroundColor,
		getForegroundColor,
		getLoadedThemes,
		getLoadedLanguages,
		setColorReplacements
	};
}
function isPlaintext(lang) {
	return !lang || [
		"plaintext",
		"txt",
		"text"
	].includes(lang);
}
const version = "0.2.0";
setCDN(`https://cdn.jsdelivr.net/npm/shiki-es@${version}/dist/assets/`);

//#endregion
//#region plugins/codeblocks-plus/shiki.js
const [highlighter] = shelter.solid.createResource(() => getHighlighter({
	themes,
	langs: languages
}));

//#endregion
//#region plugins/codeblocks-plus/themes/themeProcessor.js
const processThemeName = (n) => n.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
const processTheme = (t) => ({
	name: processThemeName(t),
	url: t
});
const includedThemes = themes.map(processTheme);
const defaultTheme = processTheme("github-dark");
const currentTheme = () => shelter.plugin.store.theme ?? defaultTheme.url;

//#endregion
//#region plugins/codeblocks-plus/components/Shiki.jsx
var import_web$17 = __toESM(require_web());
var import_web$18 = __toESM(require_web());
var import_web$19 = __toESM(require_web());
var import_web$20 = __toESM(require_web());
var import_web$21 = __toESM(require_web());
var import_web$22 = __toESM(require_web());
const _tmpl$$2 = /*#__PURE__*/ (0, import_web$17.template)(`<span class="lnum"></span>`, 2), _tmpl$2$1 = /*#__PURE__*/ (0, import_web$17.template)(`<pre><code> </code></pre>`, 4);
const { solid: { createMemo, Show }, ui: { niceScrollbarsClass }, plugin: { store: store$2 } } = shelter;
var Shiki_default = (props) => {
	const highlighted = createMemo(() => {
		const html = highlighter()?.codeToHtml(props.children, props.lang, currentTheme());
		if (!html) return;
		const n = new DOMParser().parseFromString(html, "text/html").getElementsByTagName("pre")[0];
		if (!n) return;
		n.classList.add(niceScrollbarsClass());
		props.bgColOut?.(n.style.backgroundColor);
		try {
			if (store$2.nums) n.querySelectorAll(".line").forEach((e, i) => e.prepend((() => {
				const _el$ = (0, import_web$21.getNextElement)(_tmpl$$2);
				(0, import_web$22.insert)(_el$, i);
				return _el$;
			})()));
		} catch (e) {
			console.error(e);
		}
		return n;
	});
	return (0, import_web$18.createComponent)(Show, {
		get when() {
			return !highlighted();
		},
		get fallback() {
			return highlighted();
		},
		get children() {
			const _el$2 = (0, import_web$21.getNextElement)(_tmpl$2$1), _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild;
			(0, import_web$20.effect)((_p$) => {
				const _v$ = `shiki ${niceScrollbarsClass()}`, _v$2 = props.children;
				_v$ !== _p$._v$ && (0, import_web$19.className)(_el$2, _p$._v$ = _v$);
				_v$2 !== _p$._v$2 && (_el$4.data = _p$._v$2 = _v$2);
				return _p$;
			}, {
				_v$: undefined,
				_v$2: undefined
			});
			return _el$2;
		}
	});
};

//#endregion
//#region plugins/codeblocks-plus/components/Codeblock.jsx
var import_web$8 = __toESM(require_web());
var import_web$9 = __toESM(require_web());
var import_web$10 = __toESM(require_web());
var import_web$11 = __toESM(require_web());
var import_web$12 = __toESM(require_web());
var import_web$13 = __toESM(require_web());
var import_web$14 = __toESM(require_web());
var import_web$15 = __toESM(require_web());
var import_web$16 = __toESM(require_web());
const _tmpl$$1 = /*#__PURE__*/ (0, import_web$8.template)(`<div class="ys_cbp_wrap"><div class="ys_cbp_row"><div></div><button></button></div><!#><!/></div>`, 10);
const { solid: { createSignal: createSignal$1 } } = shelter;
var Codeblock_default = (props) => {
	const [cooldown, setCooldown] = createSignal$1(false);
	const [bgCol, setBgCol] = createSignal$1();
	const lang = () => !highlighter() || highlighter().getLoadedLanguages().includes(props.lang) ? props.lang : "";
	return (() => {
		const _el$ = (0, import_web$11.getNextElement)(_tmpl$$1), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$2.nextSibling, [_el$6, _co$] = (0, import_web$13.getNextMarker)(_el$5.nextSibling);
		(0, import_web$16.insert)(_el$3, () => (lang() ?? "").toUpperCase());
		_el$4.$$click = async () => {
			if (window.DiscordNative) DiscordNative.clipboard.copy(props.childen);
else await navigator.clipboard.writeText(props.children);
			if (cooldown()) return;
			setCooldown(true);
			setTimeout(() => setCooldown(false), 2e3);
		};
		(0, import_web$16.insert)(_el$4, () => cooldown() ? "Copied!" : "Copy");
		(0, import_web$16.insert)(_el$, (0, import_web$14.createComponent)(Shiki_default, {
			get lang() {
				return lang();
			},
			bgColOut: setBgCol,
			get children() {
				return props.children;
			}
		}), _el$6, _co$);
		(0, import_web$10.effect)((_p$) => {
			const _v$ = bgCol() ?? "var(--background-tertiary)", _v$2 = cooldown();
			_v$ !== _p$._v$ && _el$.style.setProperty("background-color", _p$._v$ = _v$);
			_v$2 !== _p$._v$2 && (_el$4.disabled = _p$._v$2 = _v$2);
			return _p$;
		}, {
			_v$: undefined,
			_v$2: undefined
		});
		(0, import_web$12.runHydrationEvents)();
		return _el$;
	})();
};
(0, import_web$9.delegateEvents)(["click"]);

//#endregion
//#region plugins/codeblocks-plus/replacer.jsx
var import_web$7 = __toESM(require_web());
const { flux: { dispatcher }, solid: { createSignal }, observeDom } = shelter;
const classRegex = /[a-z]+/;
function getLanguage(cb) {
	const [sig, setSig] = createSignal("");
	for (const timeout of [
		50,
		250,
		500,
		750,
		1e3
	]) setTimeout(() => {
		for (const className of cb.classList) if (className !== "hljs" && className.match(classRegex)[0] === className) setSig(className);
	}, timeout);
	return sig;
}
function injectCodeblock(code) {
	if (!code.parentElement) return;
	code.parentElement.style.display = "contents";
	const langSig = getLanguage(code);
	code.parentElement.replaceChildren((0, import_web$7.createComponent)(Codeblock_default, {
		get lang() {
			return langSig();
		},
		get children() {
			return code.textContent;
		}
	}));
}
const TRIGGERS = [
	"MESSAGE_CREATE",
	"CHANNEL_SELECT",
	"LOAD_MESSAGES_SUCCESS",
	"UPDATE_CHANNEL_DIMENSIONS",
	"MESSAGE_END_EDIT",
	"MESSAGE_UPDATE"
];
function onDispatch() {
	const unObserve = observeDom("pre:not(.shiki) > code", (elem) => {
		unObserve();
		injectCodeblock(elem);
	});
	setTimeout(unObserve, 500);
}
var replacer_default = () => {
	TRIGGERS.forEach((t) => dispatcher.subscribe(t, onDispatch));
	return () => TRIGGERS.forEach((t) => dispatcher.unsubscribe(t, onDispatch));
};

//#endregion
//#region plugins/codeblocks-plus/components/settings.jsx
var import_web = __toESM(require_web());
var import_web$1 = __toESM(require_web());
var import_web$2 = __toESM(require_web());
var import_web$3 = __toESM(require_web());
var import_web$4 = __toESM(require_web());
var import_web$5 = __toESM(require_web());
var import_web$6 = __toESM(require_web());
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<div style="margin-bottom: .5rem"></div>`, 2), _tmpl$2 = /*#__PURE__*/ (0, import_web.template)(`<select></select>`, 2), _tmpl$3 = /*#__PURE__*/ (0, import_web.template)(`<option></option>`, 2);
const { plugin: { store: store$1 }, ui: { Header, HeaderTags, SwitchItem } } = shelter;
const preview = `const btn = document.getElementById("btn");
let count = 0;
function render() {
  btn.innerText = \`Count: \${count}\`;
}
btn.addEventListener("click", () => {
  // Count from 1 to 10.
  if (count < 10) {
    count += 1;
    render();
  }
});`;
var settings_default = () => {
	const includedThemeOptions = includedThemes.map(({ name, url }) => ({
		value: url,
		label: name
	}));
	return [
		(() => {
			const _el$ = (0, import_web$4.getNextElement)(_tmpl$);
			(0, import_web$5.insert)(_el$, (0, import_web$6.createComponent)(Codeblock_default, {
				lang: "js",
				children: preview
			}));
			return _el$;
		})(),
		(0, import_web$6.createComponent)(Header, {
			get tag() {
				return HeaderTags.H4;
			},
			children: "Select theme"
		}),
		(() => {
			const _el$2 = (0, import_web$4.getNextElement)(_tmpl$2);
			_el$2.$$input = (e) => store$1.theme = e.target.value;
			(0, import_web$5.insert)(_el$2, () => includedThemeOptions.map((opt) => (() => {
				const _el$3 = (0, import_web$4.getNextElement)(_tmpl$3);
				(0, import_web$5.insert)(_el$3, () => opt.label);
				(0, import_web$3.effect)(() => _el$3.value = opt.value);
				return _el$3;
			})()));
			(0, import_web$3.effect)(() => _el$2.value = currentTheme());
			(0, import_web$2.runHydrationEvents)();
			return _el$2;
		})(),
		(0, import_web$6.createComponent)(SwitchItem, {
			get value() {
				return store$1.nums;
			},
			onChange: (v) => store$1.nums = v,
			hideBorder: true,
			children: "Show line numbers"
		})
	];
};
(0, import_web$1.delegateEvents)(["input"]);

//#endregion
//#region plugins/codeblocks-plus/index.js
const { plugin: { store }, ui: { injectCss } } = shelter;
store.nums ??= true;
const transients = [injectCss(styles_default), replacer_default()];
const onUnload = () => transients.forEach((p) => p());

//#endregion
exports.onUnload = onUnload
exports.settings = settings_default
return exports;
})({});