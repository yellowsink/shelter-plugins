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
var __export = (target, all) => {
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
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

//#region plugins/lastfm/cfg.ts
const DEFAULT_NAME = "{{name}}";
const DEFAULT_INTERVAL = 5e3;
const DISCORD_APP_ID = "1107251687984472144";
const LFM_API_KEY = "311958e99f6ee58518756f83720db787";
const ACTIVITY_TYPE_LISTENING = 2;

//#endregion
//#region plugins/lastfm/assets.ts
const { post } = shelter.http;
const cache$1 = new Map();
async function getAsset(url$1) {
	if (cache$1.has(url$1)) return cache$1.get(url$1);
	const res = await post({
		url: `/applications/${DISCORD_APP_ID}/external-assets`,
		body: { urls: [url$1] },
		oldFormErrors: false
	});
	if (res.ok) {
		const path = "mp:" + res.body[0].external_asset_path;
		cache$1.set(url$1, path);
		return path;
	}
	cache$1.set(url$1, undefined);
}

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_freeGlobal.js
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var _freeGlobal_default = freeGlobal;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_root.js
/** Detect free variable `self`. */
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
/** Used as a reference to the global object. */
var root = _freeGlobal_default || freeSelf || Function("return this")();
var _root_default = root;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Symbol.js
/** Built-in value references. */
var Symbol = _root_default.Symbol;
var _Symbol_default = Symbol;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getRawTag.js
/** Used for built-in method references. */
var objectProto$4 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
/**
* Used to resolve the
* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
* of values.
*/
var nativeObjectToString$1 = objectProto$4.toString;
/** Built-in value references. */
var symToStringTag$1 = _Symbol_default ? _Symbol_default.toStringTag : undefined;
/**
* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the raw `toStringTag`.
*/
function getRawTag(value$1) {
	var isOwn = hasOwnProperty$3.call(value$1, symToStringTag$1), tag = value$1[symToStringTag$1];
	try {
		value$1[symToStringTag$1] = undefined;
		var unmasked = true;
	} catch (e) {}
	var result = nativeObjectToString$1.call(value$1);
	if (unmasked) if (isOwn) value$1[symToStringTag$1] = tag;
else delete value$1[symToStringTag$1];
	return result;
}
var _getRawTag_default = getRawTag;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_objectToString.js
/** Used for built-in method references. */
var objectProto$3 = Object.prototype;
/**
* Used to resolve the
* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
* of values.
*/
var nativeObjectToString = objectProto$3.toString;
/**
* Converts `value` to a string using `Object.prototype.toString`.
*
* @private
* @param {*} value The value to convert.
* @returns {string} Returns the converted string.
*/
function objectToString(value$1) {
	return nativeObjectToString.call(value$1);
}
var _objectToString_default = objectToString;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseGetTag.js
/** `Object#toString` result references. */
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
/** Built-in value references. */
var symToStringTag = _Symbol_default ? _Symbol_default.toStringTag : undefined;
/**
* The base implementation of `getTag` without fallbacks for buggy environments.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the `toStringTag`.
*/
function baseGetTag(value$1) {
	if (value$1 == null) return value$1 === undefined ? undefinedTag : nullTag;
	return symToStringTag && symToStringTag in Object(value$1) ? _getRawTag_default(value$1) : _objectToString_default(value$1);
}
var _baseGetTag_default = baseGetTag;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isObject.js
/**
* Checks if `value` is the
* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an object, else `false`.
* @example
*
* _.isObject({});
* // => true
*
* _.isObject([1, 2, 3]);
* // => true
*
* _.isObject(_.noop);
* // => true
*
* _.isObject(null);
* // => false
*/
function isObject$1(value$1) {
	var type = typeof value$1;
	return value$1 != null && (type == "object" || type == "function");
}
var isObject_default = isObject$1;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isFunction.js
/** `Object#toString` result references. */
var asyncTag = "[object AsyncFunction]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
/**
* Checks if `value` is classified as a `Function` object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a function, else `false`.
* @example
*
* _.isFunction(_);
* // => true
*
* _.isFunction(/abc/);
* // => false
*/
function isFunction(value$1) {
	if (!isObject_default(value$1)) return false;
	var tag = _baseGetTag_default(value$1);
	return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var isFunction_default = isFunction;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_coreJsData.js
/** Used to detect overreaching core-js shims. */
var coreJsData = _root_default["__core-js_shared__"];
var _coreJsData_default = coreJsData;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isMasked.js
/** Used to detect methods masquerading as native. */
var maskSrcKey = function() {
	var uid = /[^.]+$/.exec(_coreJsData_default && _coreJsData_default.keys && _coreJsData_default.keys.IE_PROTO || "");
	return uid ? "Symbol(src)_1." + uid : "";
}();
/**
* Checks if `func` has its source masked.
*
* @private
* @param {Function} func The function to check.
* @returns {boolean} Returns `true` if `func` is masked, else `false`.
*/
function isMasked(func) {
	return !!maskSrcKey && maskSrcKey in func;
}
var _isMasked_default = isMasked;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_toSource.js
/** Used for built-in method references. */
var funcProto$1 = Function.prototype;
/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;
/**
* Converts `func` to its source code.
*
* @private
* @param {Function} func The function to convert.
* @returns {string} Returns the source code.
*/
function toSource(func) {
	if (func != null) {
		try {
			return funcToString$1.call(func);
		} catch (e) {}
		try {
			return func + "";
		} catch (e) {}
	}
	return "";
}
var _toSource_default = toSource;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsNative.js
/**
* Used to match `RegExp`
* [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
*/
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;
/** Used for built-in method references. */
var funcProto = Function.prototype, objectProto$2 = Object.prototype;
/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;
/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
/** Used to detect if a method is native. */
var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty$2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
/**
* The base implementation of `_.isNative` without bad shim checks.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a native function,
*  else `false`.
*/
function baseIsNative(value$1) {
	if (!isObject_default(value$1) || _isMasked_default(value$1)) return false;
	var pattern = isFunction_default(value$1) ? reIsNative : reIsHostCtor;
	return pattern.test(_toSource_default(value$1));
}
var _baseIsNative_default = baseIsNative;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getValue.js
/**
* Gets the value at `key` of `object`.
*
* @private
* @param {Object} [object] The object to query.
* @param {string} key The key of the property to get.
* @returns {*} Returns the property value.
*/
function getValue(object, key) {
	return object == null ? undefined : object[key];
}
var _getValue_default = getValue;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getNative.js
/**
* Gets the native function at `key` of `object`.
*
* @private
* @param {Object} object The object to query.
* @param {string} key The key of the method to get.
* @returns {*} Returns the function if it's native, else `undefined`.
*/
function getNative(object, key) {
	var value$1 = _getValue_default(object, key);
	return _baseIsNative_default(value$1) ? value$1 : undefined;
}
var _getNative_default = getNative;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_nativeCreate.js
var nativeCreate = _getNative_default(Object, "create");
var _nativeCreate_default = nativeCreate;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashClear.js
/**
* Removes all key-value entries from the hash.
*
* @private
* @name clear
* @memberOf Hash
*/
function hashClear() {
	this.__data__ = _nativeCreate_default ? _nativeCreate_default(null) : {};
	this.size = 0;
}
var _hashClear_default = hashClear;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashDelete.js
/**
* Removes `key` and its value from the hash.
*
* @private
* @name delete
* @memberOf Hash
* @param {Object} hash The hash to modify.
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function hashDelete(key) {
	var result = this.has(key) && delete this.__data__[key];
	this.size -= result ? 1 : 0;
	return result;
}
var _hashDelete_default = hashDelete;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashGet.js
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
/** Used for built-in method references. */
var objectProto$1 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
/**
* Gets the hash value for `key`.
*
* @private
* @name get
* @memberOf Hash
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function hashGet(key) {
	var data = this.__data__;
	if (_nativeCreate_default) {
		var result = data[key];
		return result === HASH_UNDEFINED$1 ? undefined : result;
	}
	return hasOwnProperty$1.call(data, key) ? data[key] : undefined;
}
var _hashGet_default = hashGet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashHas.js
/** Used for built-in method references. */
var objectProto = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;
/**
* Checks if a hash value for `key` exists.
*
* @private
* @name has
* @memberOf Hash
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function hashHas(key) {
	var data = this.__data__;
	return _nativeCreate_default ? data[key] !== undefined : hasOwnProperty.call(data, key);
}
var _hashHas_default = hashHas;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashSet.js
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = "__lodash_hash_undefined__";
/**
* Sets the hash `key` to `value`.
*
* @private
* @name set
* @memberOf Hash
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the hash instance.
*/
function hashSet(key, value$1) {
	var data = this.__data__;
	this.size += this.has(key) ? 0 : 1;
	data[key] = _nativeCreate_default && value$1 === undefined ? HASH_UNDEFINED : value$1;
	return this;
}
var _hashSet_default = hashSet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Hash.js
/**
* Creates a hash object.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function Hash(entries) {
	var index = -1, length = entries == null ? 0 : entries.length;
	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}
Hash.prototype.clear = _hashClear_default;
Hash.prototype["delete"] = _hashDelete_default;
Hash.prototype.get = _hashGet_default;
Hash.prototype.has = _hashHas_default;
Hash.prototype.set = _hashSet_default;
var _Hash_default = Hash;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheClear.js
/**
* Removes all key-value entries from the list cache.
*
* @private
* @name clear
* @memberOf ListCache
*/
function listCacheClear() {
	this.__data__ = [];
	this.size = 0;
}
var _listCacheClear_default = listCacheClear;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/eq.js
/**
* Performs a
* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* comparison between two values to determine if they are equivalent.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
* @example
*
* var object = { 'a': 1 };
* var other = { 'a': 1 };
*
* _.eq(object, object);
* // => true
*
* _.eq(object, other);
* // => false
*
* _.eq('a', 'a');
* // => true
*
* _.eq('a', Object('a'));
* // => false
*
* _.eq(NaN, NaN);
* // => true
*/
function eq(value$1, other) {
	return value$1 === other || value$1 !== value$1 && other !== other;
}
var eq_default = eq;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_assocIndexOf.js
/**
* Gets the index at which the `key` is found in `array` of key-value pairs.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} key The key to search for.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function assocIndexOf(array, key) {
	var length = array.length;
	while (length--) if (eq_default(array[length][0], key)) return length;
	return -1;
}
var _assocIndexOf_default = assocIndexOf;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheDelete.js
/** Used for built-in method references. */
var arrayProto = Array.prototype;
/** Built-in value references. */
var splice = arrayProto.splice;
/**
* Removes `key` and its value from the list cache.
*
* @private
* @name delete
* @memberOf ListCache
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function listCacheDelete(key) {
	var data = this.__data__, index = _assocIndexOf_default(data, key);
	if (index < 0) return false;
	var lastIndex = data.length - 1;
	if (index == lastIndex) data.pop();
else splice.call(data, index, 1);
	--this.size;
	return true;
}
var _listCacheDelete_default = listCacheDelete;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheGet.js
/**
* Gets the list cache value for `key`.
*
* @private
* @name get
* @memberOf ListCache
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function listCacheGet(key) {
	var data = this.__data__, index = _assocIndexOf_default(data, key);
	return index < 0 ? undefined : data[index][1];
}
var _listCacheGet_default = listCacheGet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheHas.js
/**
* Checks if a list cache value for `key` exists.
*
* @private
* @name has
* @memberOf ListCache
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function listCacheHas(key) {
	return _assocIndexOf_default(this.__data__, key) > -1;
}
var _listCacheHas_default = listCacheHas;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheSet.js
/**
* Sets the list cache `key` to `value`.
*
* @private
* @name set
* @memberOf ListCache
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the list cache instance.
*/
function listCacheSet(key, value$1) {
	var data = this.__data__, index = _assocIndexOf_default(data, key);
	if (index < 0) {
		++this.size;
		data.push([key, value$1]);
	} else data[index][1] = value$1;
	return this;
}
var _listCacheSet_default = listCacheSet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_ListCache.js
/**
* Creates an list cache object.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function ListCache(entries) {
	var index = -1, length = entries == null ? 0 : entries.length;
	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}
ListCache.prototype.clear = _listCacheClear_default;
ListCache.prototype["delete"] = _listCacheDelete_default;
ListCache.prototype.get = _listCacheGet_default;
ListCache.prototype.has = _listCacheHas_default;
ListCache.prototype.set = _listCacheSet_default;
var _ListCache_default = ListCache;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Map.js
var Map$1 = _getNative_default(_root_default, "Map");
var _Map_default = Map$1;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheClear.js
/**
* Removes all key-value entries from the map.
*
* @private
* @name clear
* @memberOf MapCache
*/
function mapCacheClear() {
	this.size = 0;
	this.__data__ = {
		"hash": new _Hash_default(),
		"map": new (_Map_default || _ListCache_default)(),
		"string": new _Hash_default()
	};
}
var _mapCacheClear_default = mapCacheClear;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isKeyable.js
/**
* Checks if `value` is suitable for use as unique object key.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is suitable, else `false`.
*/
function isKeyable(value$1) {
	var type = typeof value$1;
	return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value$1 !== "__proto__" : value$1 === null;
}
var _isKeyable_default = isKeyable;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getMapData.js
/**
* Gets the data for `map`.
*
* @private
* @param {Object} map The map to query.
* @param {string} key The reference key.
* @returns {*} Returns the map data.
*/
function getMapData(map, key) {
	var data = map.__data__;
	return _isKeyable_default(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
var _getMapData_default = getMapData;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheDelete.js
/**
* Removes `key` and its value from the map.
*
* @private
* @name delete
* @memberOf MapCache
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function mapCacheDelete(key) {
	var result = _getMapData_default(this, key)["delete"](key);
	this.size -= result ? 1 : 0;
	return result;
}
var _mapCacheDelete_default = mapCacheDelete;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheGet.js
/**
* Gets the map value for `key`.
*
* @private
* @name get
* @memberOf MapCache
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function mapCacheGet(key) {
	return _getMapData_default(this, key).get(key);
}
var _mapCacheGet_default = mapCacheGet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheHas.js
/**
* Checks if a map value for `key` exists.
*
* @private
* @name has
* @memberOf MapCache
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function mapCacheHas(key) {
	return _getMapData_default(this, key).has(key);
}
var _mapCacheHas_default = mapCacheHas;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheSet.js
/**
* Sets the map `key` to `value`.
*
* @private
* @name set
* @memberOf MapCache
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the map cache instance.
*/
function mapCacheSet(key, value$1) {
	var data = _getMapData_default(this, key), size = data.size;
	data.set(key, value$1);
	this.size += data.size == size ? 0 : 1;
	return this;
}
var _mapCacheSet_default = mapCacheSet;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_MapCache.js
/**
* Creates a map cache object to store key-value pairs.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function MapCache(entries) {
	var index = -1, length = entries == null ? 0 : entries.length;
	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}
MapCache.prototype.clear = _mapCacheClear_default;
MapCache.prototype["delete"] = _mapCacheDelete_default;
MapCache.prototype.get = _mapCacheGet_default;
MapCache.prototype.has = _mapCacheHas_default;
MapCache.prototype.set = _mapCacheSet_default;
var _MapCache_default = MapCache;

//#endregion
//#region node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/memoize.js
/** Error message constants. */
var FUNC_ERROR_TEXT = "Expected a function";
/**
* Creates a function that memoizes the result of `func`. If `resolver` is
* provided, it determines the cache key for storing the result based on the
* arguments provided to the memoized function. By default, the first argument
* provided to the memoized function is used as the map cache key. The `func`
* is invoked with the `this` binding of the memoized function.
*
* **Note:** The cache is exposed as the `cache` property on the memoized
* function. Its creation may be customized by replacing the `_.memoize.Cache`
* constructor with one whose instances implement the
* [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
* method interface of `clear`, `delete`, `get`, `has`, and `set`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Function
* @param {Function} func The function to have its output memoized.
* @param {Function} [resolver] The function to resolve the cache key.
* @returns {Function} Returns the new memoized function.
* @example
*
* var object = { 'a': 1, 'b': 2 };
* var other = { 'c': 3, 'd': 4 };
*
* var values = _.memoize(_.values);
* values(object);
* // => [1, 2]
*
* values(other);
* // => [3, 4]
*
* object.a = 2;
* values(object);
* // => [1, 2]
*
* // Modify the result cache.
* values.cache.set(object, ['a', 'b']);
* values(object);
* // => ['a', 'b']
*
* // Replace `_.memoize.Cache`.
* _.memoize.Cache = WeakMap;
*/
function memoize(func, resolver) {
	if (typeof func != "function" || resolver != null && typeof resolver != "function") throw new TypeError(FUNC_ERROR_TEXT);
	var memoized = function() {
		var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache$2 = memoized.cache;
		if (cache$2.has(key)) return cache$2.get(key);
		var result = func.apply(this, args);
		memoized.cache = cache$2.set(key, result) || cache$2;
		return result;
	};
	memoized.cache = new (memoize.Cache || _MapCache_default)();
	return memoized;
}
memoize.Cache = _MapCache_default;
var memoize_default = memoize;

//#endregion
//#region node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/commons.js
const PACKET_TYPES = Object.create(null);
PACKET_TYPES["open"] = "0";
PACKET_TYPES["close"] = "1";
PACKET_TYPES["ping"] = "2";
PACKET_TYPES["pong"] = "3";
PACKET_TYPES["message"] = "4";
PACKET_TYPES["upgrade"] = "5";
PACKET_TYPES["noop"] = "6";
const PACKET_TYPES_REVERSE = Object.create(null);
Object.keys(PACKET_TYPES).forEach((key) => {
	PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
});
const ERROR_PACKET = {
	type: "error",
	data: "parser error"
};

//#endregion
//#region node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/encodePacket.browser.js
const withNativeBlob$1 = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
const withNativeArrayBuffer$2 = typeof ArrayBuffer === "function";
const isView$1 = (obj) => {
	return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
};
const encodePacket = ({ type, data }, supportsBinary, callback) => {
	if (withNativeBlob$1 && data instanceof Blob) if (supportsBinary) return callback(data);
else return encodeBlobAsBase64(data, callback);
else if (withNativeArrayBuffer$2 && (data instanceof ArrayBuffer || isView$1(data))) if (supportsBinary) return callback(data);
else return encodeBlobAsBase64(new Blob([data]), callback);
	return callback(PACKET_TYPES[type] + (data || ""));
};
const encodeBlobAsBase64 = (data, callback) => {
	const fileReader = new FileReader();
	fileReader.onload = function() {
		const content = fileReader.result.split(",")[1];
		callback("b" + (content || ""));
	};
	return fileReader.readAsDataURL(data);
};
function toArray(data) {
	if (data instanceof Uint8Array) return data;
else if (data instanceof ArrayBuffer) return new Uint8Array(data);
else return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
}
let TEXT_ENCODER;
function encodePacketToBinary(packet, callback) {
	if (withNativeBlob$1 && packet.data instanceof Blob) return packet.data.arrayBuffer().then(toArray).then(callback);
else if (withNativeArrayBuffer$2 && (packet.data instanceof ArrayBuffer || isView$1(packet.data))) return callback(toArray(packet.data));
	encodePacket(packet, false, (encoded) => {
		if (!TEXT_ENCODER) TEXT_ENCODER = new TextEncoder();
		callback(TEXT_ENCODER.encode(encoded));
	});
}

//#endregion
//#region node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/contrib/base64-arraybuffer.js
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const lookup$1 = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
for (let i = 0; i < chars.length; i++) lookup$1[chars.charCodeAt(i)] = i;
const decode$1 = (base64) => {
	let bufferLength = base64.length * .75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
	if (base64[base64.length - 1] === "=") {
		bufferLength--;
		if (base64[base64.length - 2] === "=") bufferLength--;
	}
	const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
	for (i = 0; i < len; i += 4) {
		encoded1 = lookup$1[base64.charCodeAt(i)];
		encoded2 = lookup$1[base64.charCodeAt(i + 1)];
		encoded3 = lookup$1[base64.charCodeAt(i + 2)];
		encoded4 = lookup$1[base64.charCodeAt(i + 3)];
		bytes[p++] = encoded1 << 2 | encoded2 >> 4;
		bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
		bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
	}
	return arraybuffer;
};

//#endregion
//#region node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/decodePacket.browser.js
const withNativeArrayBuffer$1 = typeof ArrayBuffer === "function";
const decodePacket = (encodedPacket, binaryType) => {
	if (typeof encodedPacket !== "string") return {
		type: "message",
		data: mapBinary(encodedPacket, binaryType)
	};
	const type = encodedPacket.charAt(0);
	if (type === "b") return {
		type: "message",
		data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
	};
	const packetType = PACKET_TYPES_REVERSE[type];
	if (!packetType) return ERROR_PACKET;
	return encodedPacket.length > 1 ? {
		type: PACKET_TYPES_REVERSE[type],
		data: encodedPacket.substring(1)
	} : { type: PACKET_TYPES_REVERSE[type] };
};
const decodeBase64Packet = (data, binaryType) => {
	if (withNativeArrayBuffer$1) {
		const decoded = decode$1(data);
		return mapBinary(decoded, binaryType);
	} else return {
		base64: true,
		data
	};
};
const mapBinary = (data, binaryType) => {
	switch (binaryType) {
		case "blob": if (data instanceof Blob) return data;
else return new Blob([data]);
		case "arraybuffer":
		default: if (data instanceof ArrayBuffer) return data;
else return data.buffer;
	}
};

//#endregion
//#region node_modules/.pnpm/engine.io-parser@5.2.3/node_modules/engine.io-parser/build/esm/index.js
const SEPARATOR = String.fromCharCode(30);
const encodePayload = (packets, callback) => {
	const length = packets.length;
	const encodedPackets = new Array(length);
	let count = 0;
	packets.forEach((packet, i) => {
		encodePacket(packet, false, (encodedPacket) => {
			encodedPackets[i] = encodedPacket;
			if (++count === length) callback(encodedPackets.join(SEPARATOR));
		});
	});
};
const decodePayload = (encodedPayload, binaryType) => {
	const encodedPackets = encodedPayload.split(SEPARATOR);
	const packets = [];
	for (let i = 0; i < encodedPackets.length; i++) {
		const decodedPacket = decodePacket(encodedPackets[i], binaryType);
		packets.push(decodedPacket);
		if (decodedPacket.type === "error") break;
	}
	return packets;
};
function createPacketEncoderStream() {
	return new TransformStream({ transform(packet, controller) {
		encodePacketToBinary(packet, (encodedPacket) => {
			const payloadLength = encodedPacket.length;
			let header;
			if (payloadLength < 126) {
				header = new Uint8Array(1);
				new DataView(header.buffer).setUint8(0, payloadLength);
			} else if (payloadLength < 65536) {
				header = new Uint8Array(3);
				const view = new DataView(header.buffer);
				view.setUint8(0, 126);
				view.setUint16(1, payloadLength);
			} else {
				header = new Uint8Array(9);
				const view = new DataView(header.buffer);
				view.setUint8(0, 127);
				view.setBigUint64(1, BigInt(payloadLength));
			}
			if (packet.data && typeof packet.data !== "string") header[0] |= 128;
			controller.enqueue(header);
			controller.enqueue(encodedPacket);
		});
	} });
}
let TEXT_DECODER;
function totalLength(chunks) {
	return chunks.reduce((acc, chunk) => acc + chunk.length, 0);
}
function concatChunks(chunks, size) {
	if (chunks[0].length === size) return chunks.shift();
	const buffer = new Uint8Array(size);
	let j = 0;
	for (let i = 0; i < size; i++) {
		buffer[i] = chunks[0][j++];
		if (j === chunks[0].length) {
			chunks.shift();
			j = 0;
		}
	}
	if (chunks.length && j < chunks[0].length) chunks[0] = chunks[0].slice(j);
	return buffer;
}
function createPacketDecoderStream(maxPayload, binaryType) {
	if (!TEXT_DECODER) TEXT_DECODER = new TextDecoder();
	const chunks = [];
	let state = 0;
	let expectedLength = -1;
	let isBinary$1 = false;
	return new TransformStream({ transform(chunk, controller) {
		chunks.push(chunk);
		while (true) {
			if (state === 0) {
				if (totalLength(chunks) < 1) break;
				const header = concatChunks(chunks, 1);
				isBinary$1 = (header[0] & 128) === 128;
				expectedLength = header[0] & 127;
				if (expectedLength < 126) state = 3;
else if (expectedLength === 126) state = 1;
else state = 2;
			} else if (state === 1) {
				if (totalLength(chunks) < 2) break;
				const headerArray = concatChunks(chunks, 2);
				expectedLength = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length).getUint16(0);
				state = 3;
			} else if (state === 2) {
				if (totalLength(chunks) < 8) break;
				const headerArray = concatChunks(chunks, 8);
				const view = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length);
				const n = view.getUint32(0);
				if (n > Math.pow(2, 21) - 1) {
					controller.enqueue(ERROR_PACKET);
					break;
				}
				expectedLength = n * Math.pow(2, 32) + view.getUint32(4);
				state = 3;
			} else {
				if (totalLength(chunks) < expectedLength) break;
				const data = concatChunks(chunks, expectedLength);
				controller.enqueue(decodePacket(isBinary$1 ? data : TEXT_DECODER.decode(data), binaryType));
				state = 0;
			}
			if (expectedLength === 0 || expectedLength > maxPayload) {
				controller.enqueue(ERROR_PACKET);
				break;
			}
		}
	} });
}
const protocol$2 = 4;

//#endregion
//#region node_modules/.pnpm/@socket.io+component-emitter@3.1.2/node_modules/@socket.io/component-emitter/lib/esm/index.js
function Emitter(obj) {
	if (obj) return mixin(obj);
}
/**
* Mixin the emitter properties.
*
* @param {Object} obj
* @return {Object}
* @api private
*/
function mixin(obj) {
	for (var key in Emitter.prototype) obj[key] = Emitter.prototype[key];
	return obj;
}
/**
* Listen on the given `event` with `fn`.
*
* @param {String} event
* @param {Function} fn
* @return {Emitter}
* @api public
*/
Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
	this._callbacks = this._callbacks || {};
	(this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
	return this;
};
/**
* Adds an `event` listener that will be invoked a single
* time then automatically removed.
*
* @param {String} event
* @param {Function} fn
* @return {Emitter}
* @api public
*/
Emitter.prototype.once = function(event, fn) {
	function on$1() {
		this.off(event, on$1);
		fn.apply(this, arguments);
	}
	on$1.fn = fn;
	this.on(event, on$1);
	return this;
};
/**
* Remove the given callback for `event` or all
* registered callbacks.
*
* @param {String} event
* @param {Function} fn
* @return {Emitter}
* @api public
*/
Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
	this._callbacks = this._callbacks || {};
	if (0 == arguments.length) {
		this._callbacks = {};
		return this;
	}
	var callbacks = this._callbacks["$" + event];
	if (!callbacks) return this;
	if (1 == arguments.length) {
		delete this._callbacks["$" + event];
		return this;
	}
	var cb;
	for (var i = 0; i < callbacks.length; i++) {
		cb = callbacks[i];
		if (cb === fn || cb.fn === fn) {
			callbacks.splice(i, 1);
			break;
		}
	}
	if (callbacks.length === 0) delete this._callbacks["$" + event];
	return this;
};
/**
* Emit `event` with the given args.
*
* @param {String} event
* @param {Mixed} ...
* @return {Emitter}
*/
Emitter.prototype.emit = function(event) {
	this._callbacks = this._callbacks || {};
	var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
	for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
	if (callbacks) {
		callbacks = callbacks.slice(0);
		for (var i = 0, len = callbacks.length; i < len; ++i) callbacks[i].apply(this, args);
	}
	return this;
};
Emitter.prototype.emitReserved = Emitter.prototype.emit;
/**
* Return array of callbacks for `event`.
*
* @param {String} event
* @return {Array}
* @api public
*/
Emitter.prototype.listeners = function(event) {
	this._callbacks = this._callbacks || {};
	return this._callbacks["$" + event] || [];
};
/**
* Check if this emitter has `event` handlers.
*
* @param {String} event
* @return {Boolean}
* @api public
*/
Emitter.prototype.hasListeners = function(event) {
	return !!this.listeners(event).length;
};

//#endregion
//#region node_modules/.pnpm/engine.io-client@6.6.2/node_modules/engine.io-client/build/esm/globals.js
const nextTick = (() => {
	const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
	if (isPromiseAvailable) return (cb) => Promise.resolve().then(cb);
else return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
})();
const globalThisShim = (() => {
	if (typeof self !== "undefined") return self;
else if (typeof window !== "undefined") return window;
else return Function("return this")();
})();
const defaultBinaryType = "arraybuffer";
function createCookieJar() {}

//#endregion
//#region node_modules/.pnpm/engine.io-client@6.6.2/node_modules/engine.io-client/build/esm/util.js
function pick(obj, ...attr) {
	return attr.reduce((acc, k) => {
		if (obj.hasOwnProperty(k)) acc[k] = obj[k];
		return acc;
	}, {});
}
const NATIVE_SET_TIMEOUT = globalThisShim.setTimeout;
const NATIVE_CLEAR_TIMEOUT = globalThisShim.clearTimeout;
function installTimerFunctions(obj, opts) {
	if (opts.useNativeTimers) {
		obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
		obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
	} else {
		obj.setTimeoutFn = globalThisShim.setTimeout.bind(globalThisShim);
		obj.clearTimeoutFn = globalThisShim.clearTimeout.bind(globalThisShim);
	}
}
const BASE64_OVERHEAD = 1.33;
function byteLength(obj) {
	if (typeof obj === "string") return utf8Length(obj);
	return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
}
function utf8Length(str) {
	let c = 0, length = 0;
	for (let i = 0, l = str.length; i < l; i++) {
		c = str.charCodeAt(i);
		if (c < 128) length += 1;
else if (c < 2048) length += 2;
else if (c < 55296 || c >= 57344) length += 3;
else {
			i++;
			length += 4;
		}
	}
	return length;
}
function randomString() {
	return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}

//#endregion
//#region node_modules/.pnpm/engine.io-client@6.6.2/node_modules/engine.io-client/build/esm/contrib/parseqs.js
function encode(obj) {
	let str = "";
	for (let i in obj) if (obj.hasOwnProperty(i)) {
		if (str.length) str += "&";
		str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
	}
	return str;
}
function decode(qs) {
	let qry = {};
	let pairs = qs.split("&");
	for (let i = 0, l = pairs.length; i < l; i++) {
		let pair = pairs[i].split("=");
		qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	}
	return qry;
}

//#endregion
//#region node_modules/.pnpm/engine.io-client@6.6.2/node_modules/engine.io-client/build/esm/transport.js
var TransportError = class extends Error {
	constructor(reason, description, context) {
		super(reason);
		this.description = description;
		this.context = context;
		this.type = "TransportError";
	}
};
var Transport = class extends Emitter {
	/**
	* Transport abstract constructor.
	*
	* @param {Object} opts - options
	* @protected
	*/
	constructor(opts) {
		super();
		this.writable = false;
		installTimerFunctions(this, opts);
		this.opts = opts;
		this.query = opts.query;
		this.socket = opts.socket;
		this.supportsBinary = !opts.forceBase64;
	}
	/**
	* Emits an error.
	*
	* @param {String} reason
	* @param description
	* @param context - the error context
	* @return {Transport} for chaining
	* @protected
	*/
	onError(reason, description, context) {
		super.emitReserved("error", new TransportError(reason, description, context));
		return this;
	}
	/**
	* Opens the transport.
	*/
	open() {
		this.readyState = "opening";
		this.doOpen();
		return this;
	}
	/**
	* Closes the transport.
	*/
	close() {
		if (this.readyState === "opening" || this.readyState === "open") {
			this.doClose();
			this.onClose();
		}
		return this;
	}
	/**
	* Sends multiple packets.
	*
	* @param {Array} packets
	*/
	send(packets) {
		if (this.readyState === "open") this.write(packets);
else {}
	}
	/**
	* Called upon open
	*
	* @protected
	*/
	onOpen() {
		this.readyState = "open";
		this.writable = true;
		super.emitReserved("open");
	}
	/**
	* Called with data.
	*
	* @param {String} data
	* @protected
	*/
	onData(data) {
		const packet = decodePacket(data, this.socket.binaryType);
		this.onPacket(packet);
	}
	/**
	* Called with a decoded packet.
	*
	* @protected
	*/
	onPacket(packet) {
		super.emitReserved("packet", packet);
	}
	/**
	* Called upon close.
	*
	* @protected
	*/
	onClose(details) {
		this.readyState = "closed";
		super.emitReserved("close", details);
	}
	/**
	* Pauses the transport, in order not to lose packets during an upgrade.
	*
	* @param onPause
	*/
	pause(onPause) {}
	createUri(schema, query = {}) {
		return schema + "://" + this._hostname() + this._port() + this.opts.path + this._query(query);
	}
	_hostname() {
		const hostname = this.opts.hostname;
		return hostname.indexOf(":") === -1 ? hostname : "[" + hostname + "]";
	}
	_port() {
		if (this.opts.port && (this.opts.secure && Number(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80)) return ":" + this.opts.port;
else return "";
	}
	_query(query) {
		const encodedQuery = encode(query);
		return encodedQuery.length ? "?" + encodedQuery : "";
	}
};

//#endregion
//#region node_modules/.pnpm/engine.io-client@6.6.2/node_modules/engine.io-client/build/esm/transports/polling.js
var Polling = class extends Transport {
	constructor() {
		super(...arguments);
		this._polling = false;
	}
	get name() {
		return "polling";
	}
	/**
	* Opens the socket (triggers polling). We write a PING message to determine
	* when the transport is open.
	*
	* @protected
	*/
	doOpen() {
		this._poll();
	}
	/**
	* Pauses polling.
	*
	* @param {Function} onPause - callback upon buffers are flushed and transport is paused
	* @package
	*/
	pause(onPause) {
		this.readyState = "pausing";
		const pause = () => {
			this.readyState = "paused";
			onPause();
		};
		if (this._polling || !this.writable) {
			let total = 0;
			if (this._polling) {
				total++;
				this.once("pollComplete", function() {
					--total || pause();
				});
			}
			if (!this.writable) {
				total++;
				this.once("drain", function() {
					--total || pause();
				});
			}
		} else pause();
	}
	/**
	* Starts polling cycle.
	*
	* @private
	*/
	_poll() {
		this._polling = true;
		this.doPoll();
		this.emitReserved("poll");
	}
	/**
	* Overloads onData to detect payloads.
	*
	* @protected
	*/
	onData(data) {
		const callback = (packet) => {
			if ("opening" === this.readyState && packet.type === "open") this.onOpen();
			if ("close" === packet.type) {
				this.onClose({ description: "transport closed by the server" });
				return false;
			}
			this.onPacket(packet);
		};
		decodePayload(data, this.socket.binaryType).forEach(callback);
		if ("closed" !== this.readyState) {
			this._polling = false;
			this.emitReserved("pollComplete");
			if ("open" === this.readyState) this._poll();
else {}
		}
	}
	/**
	* For polling, send a close packet.
	*
	* @protected
	*/
	doClose() {
		const close = () => {
			this.write([{ type: "close" }]);
		};
		if ("open" === this.readyState) close();
else this.once("open", close);
	}
	/**
	* Writes a packets payload.
	*
	* @param {Array} packets - data packets
	* @protected
	*/
	write(packets) {
		this.writable = false;
		encodePayload(packets, (data) => {
			this.doWrite(data, () => {
				this.writable = true;
				this.emitReserved("drain");
			});
		});
	}
	/**
	* Generates uri for connection.
	*
	* @private
	*/
	uri() {
		const schema = this.opts.secure ? "https" : "http";
		const query = this.query || {};
		if (false !== this.opts.timestampRequests) query[this.opts.timestampParam] = randomString();
		if (!this.supportsBinary && !query.sid) query.b64 = 1;
		return this.createUri(schema, query);
	}
};

//#endregion
//#region node_modules/.pnpm/engine.io-client@6.6.2/node_modules/engine.io-client/build/esm/contrib/has-cors.js
let value = false;
try {
	value = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
} catch (err) {}
const hasCORS = value;

//#endregion
//#region node_modules/.pnpm/engine.io-client@6.6.2/node_modules/engine.io-client/build/esm/transports/polling-xhr.js
function empty() {}
var BaseXHR = class extends Polling {
	/**
	* XHR Polling constructor.
	*
	* @param {Object} opts
	* @package
	*/
	constructor(opts) {
		super(opts);
		if (typeof location !== "undefined") {
			const isSSL = "https:" === location.protocol;
			let port = location.port;
			if (!port) port = isSSL ? "443" : "80";
			this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
		}
	}
	/**
	* Sends data.
	*
	* @param {String} data to send.
	* @param {Function} called upon flush.
	* @private
	*/
	doWrite(data, fn) {
		const req = this.request({
			method: "POST",
			data
		});
		req.on("success", fn);
		req.on("error", (xhrStatus, context) => {
			this.onError("xhr post error", xhrStatus, context);
		});
	}
	/**
	* Starts a poll cycle.
	*
	* @private
	*/
	doPoll() {
		const req = this.request();
		req.on("data", this.onData.bind(this));
		req.on("error", (xhrStatus, context) => {
			this.onError("xhr poll error", xhrStatus, context);
		});
		this.pollXhr = req;
	}
};
var Request = class Request extends Emitter {
	/**
	* Request constructor
	*
	* @param {Object} options
	* @package
	*/
	constructor(createRequest, uri, opts) {
		super();
		this.createRequest = createRequest;
		installTimerFunctions(this, opts);
		this._opts = opts;
		this._method = opts.method || "GET";
		this._uri = uri;
		this._data = undefined !== opts.data ? opts.data : null;
		this._create();
	}
	/**
	* Creates the XHR object and sends the request.
	*
	* @private
	*/
	_create() {
		var _a;
		const opts = pick(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
		opts.xdomain = !!this._opts.xd;
		const xhr = this._xhr = this.createRequest(opts);
		try {
			xhr.open(this._method, this._uri, true);
			try {
				if (this._opts.extraHeaders) {
					xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
					for (let i in this._opts.extraHeaders) if (this._opts.extraHeaders.hasOwnProperty(i)) xhr.setRequestHeader(i, this._opts.extraHeaders[i]);
				}
			} catch (e) {}
			if ("POST" === this._method) try {
				xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
			} catch (e) {}
			try {
				xhr.setRequestHeader("Accept", "*/*");
			} catch (e) {}
			(_a = this._opts.cookieJar) === null || _a === void 0 ? void 0 : _a.addCookies(xhr);
			if ("withCredentials" in xhr) xhr.withCredentials = this._opts.withCredentials;
			if (this._opts.requestTimeout) xhr.timeout = this._opts.requestTimeout;
			xhr.onreadystatechange = () => {
				var _a$1;
				if (xhr.readyState === 3) (_a$1 = this._opts.cookieJar) === null || _a$1 === void 0 ? void 0 : _a$1.parseCookies(
					// @ts-ignore
					xhr.getResponseHeader("set-cookie")
);
				if (4 !== xhr.readyState) return;
				if (200 === xhr.status || 1223 === xhr.status) this._onLoad();
else this.setTimeoutFn(() => {
					this._onError(typeof xhr.status === "number" ? xhr.status : 0);
				}, 0);
			};
			xhr.send(this._data);
		} catch (e) {
			this.setTimeoutFn(() => {
				this._onError(e);
			}, 0);
			return;
		}
		if (typeof document !== "undefined") {
			this._index = Request.requestsCount++;
			Request.requests[this._index] = this;
		}
	}
	/**
	* Called upon error.
	*
	* @private
	*/
	_onError(err) {
		this.emitReserved("error", err, this._xhr);
		this._cleanup(true);
	}
	/**
	* Cleans up house.
	*
	* @private
	*/
	_cleanup(fromError) {
		if ("undefined" === typeof this._xhr || null === this._xhr) return;
		this._xhr.onreadystatechange = empty;
		if (fromError) try {
			this._xhr.abort();
		} catch (e) {}
		if (typeof document !== "undefined") delete Request.requests[this._index];
		this._xhr = null;
	}
	/**
	* Called upon load.
	*
	* @private
	*/
	_onLoad() {
		const data = this._xhr.responseText;
		if (data !== null) {
			this.emitReserved("data", data);
			this.emitReserved("success");
			this._cleanup();
		}
	}
	/**
	* Aborts the request.
	*
	* @package
	*/
	abort() {
		this._cleanup();
	}
};
Request.requestsCount = 0;
Request.requests = {};
/**
* Aborts pending requests when unloading the window. This is needed to prevent
* memory leaks (e.g. when using IE) and to ensure that no spurious error is
* emitted.
*/
if (typeof document !== "undefined") {
	if (typeof attachEvent === "function") attachEvent("onunload", unloadHandler);
else if (typeof addEventListener === "function") {
		const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
		addEventListener(terminationEvent, unloadHandler, false);
	}
}
function unloadHandler() {
	for (let i in Request.requests) if (Request.requests.hasOwnProperty(i)) Request.requests[i].abort();
}
const hasXHR2 = function() {
	const xhr = newRequest({ xdomain: false });
	return xhr && xhr.responseType !== null;
}();
var XHR = class extends BaseXHR {
	constructor(opts) {
		super(opts);
		const forceBase64 = opts && opts.forceBase64;
		this.supportsBinary = hasXHR2 && !forceBase64;
	}
	request(opts = {}) {
		Object.assign(opts, { xd: this.xd }, this.opts);
		return new Request(newRequest, this.uri(), opts);
	}
};
function newRequest(opts) {
	const xdomain = opts.xdomain;
	try {
		if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) return new XMLHttpRequest();
	} catch (e) {}
	if (!xdomain) try {
		return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
	} catch (e) {}
}

//#endregion
//#region node_modules/.pnpm/engine.io-client@6.6.2/node_modules/engine.io-client/build/esm/transports/websocket.js
const isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
var BaseWS = class extends Transport {
	get name() {
		return "websocket";
	}
	doOpen() {
		const uri = this.uri();
		const protocols = this.opts.protocols;
		const opts = isReactNative ? {} : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
		if (this.opts.extraHeaders) opts.headers = this.opts.extraHeaders;
		try {
			this.ws = this.createSocket(uri, protocols, opts);
		} catch (err) {
			return this.emitReserved("error", err);
		}
		this.ws.binaryType = this.socket.binaryType;
		this.addEventListeners();
	}
	/**
	* Adds event listeners to the socket
	*
	* @private
	*/
	addEventListeners() {
		this.ws.onopen = () => {
			if (this.opts.autoUnref) this.ws._socket.unref();
			this.onOpen();
		};
		this.ws.onclose = (closeEvent) => this.onClose({
			description: "websocket connection closed",
			context: closeEvent
		});
		this.ws.onmessage = (ev) => this.onData(ev.data);
		this.ws.onerror = (e) => this.onError("websocket error", e);
	}
	write(packets) {
		this.writable = false;
		for (let i = 0; i < packets.length; i++) {
			const packet = packets[i];
			const lastPacket = i === packets.length - 1;
			encodePacket(packet, this.supportsBinary, (data) => {
				try {
					this.doWrite(packet, data);
				} catch (e) {}
				if (lastPacket) nextTick(() => {
					this.writable = true;
					this.emitReserved("drain");
				}, this.setTimeoutFn);
			});
		}
	}
	doClose() {
		if (typeof this.ws !== "undefined") {
			this.ws.onerror = () => {};
			this.ws.close();
			this.ws = null;
		}
	}
	/**
	* Generates uri for connection.
	*
	* @private
	*/
	uri() {
		const schema = this.opts.secure ? "wss" : "ws";
		const query = this.query || {};
		if (this.opts.timestampRequests) query[this.opts.timestampParam] = randomString();
		if (!this.supportsBinary) query.b64 = 1;
		return this.createUri(schema, query);
	}
};
const WebSocketCtor = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
var WS = class extends BaseWS {
	createSocket(uri, protocols, opts) {
		return !isReactNative ? protocols ? new WebSocketCtor(uri, protocols) : new WebSocketCtor(uri) : new WebSocketCtor(uri, protocols, opts);
	}
	doWrite(_packet, data) {
		this.ws.send(data);
	}
};

//#endregion
//#region node_modules/.pnpm/engine.io-client@6.6.2/node_modules/engine.io-client/build/esm/transports/webtransport.js
var WT = class extends Transport {
	get name() {
		return "webtransport";
	}
	doOpen() {
		try {
			this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
		} catch (err) {
			return this.emitReserved("error", err);
		}
		this._transport.closed.then(() => {
			this.onClose();
		}).catch((err) => {
			this.onError("webtransport error", err);
		});
		this._transport.ready.then(() => {
			this._transport.createBidirectionalStream().then((stream) => {
				const decoderStream = createPacketDecoderStream(Number.MAX_SAFE_INTEGER, this.socket.binaryType);
				const reader = stream.readable.pipeThrough(decoderStream).getReader();
				const encoderStream = createPacketEncoderStream();
				encoderStream.readable.pipeTo(stream.writable);
				this._writer = encoderStream.writable.getWriter();
				const read = () => {
					reader.read().then(({ done, value: value$1 }) => {
						if (done) return;
						this.onPacket(value$1);
						read();
					}).catch((err) => {});
				};
				read();
				const packet = { type: "open" };
				if (this.query.sid) packet.data = `{"sid":"${this.query.sid}"}`;
				this._writer.write(packet).then(() => this.onOpen());
			});
		});
	}
	write(packets) {
		this.writable = false;
		for (let i = 0; i < packets.length; i++) {
			const packet = packets[i];
			const lastPacket = i === packets.length - 1;
			this._writer.write(packet).then(() => {
				if (lastPacket) nextTick(() => {
					this.writable = true;
					this.emitReserved("drain");
				}, this.setTimeoutFn);
			});
		}
	}
	doClose() {
		var _a;
		(_a = this._transport) === null || _a === void 0 ? void 0 : _a.close();
	}
};

//#endregion
//#region node_modules/.pnpm/engine.io-client@6.6.2/node_modules/engine.io-client/build/esm/transports/index.js
const transports = {
	websocket: WS,
	webtransport: WT,
	polling: XHR
};

//#endregion
//#region node_modules/.pnpm/engine.io-client@6.6.2/node_modules/engine.io-client/build/esm/contrib/parseuri.js
/**
* Parses a URI
*
* Note: we could also have used the built-in URL object, but it isn't supported on all platforms.
*
* See:
* - https://developer.mozilla.org/en-US/docs/Web/API/URL
* - https://caniuse.com/url
* - https://www.rfc-editor.org/rfc/rfc3986#appendix-B
*
* History of the parse() method:
* - first commit: https://github.com/socketio/socket.io-client/commit/4ee1d5d94b3906a9c052b459f1a818b15f38f91c
* - export into its own module: https://github.com/socketio/engine.io-client/commit/de2c561e4564efeb78f1bdb1ba39ef81b2822cb3
* - reimport: https://github.com/socketio/engine.io-client/commit/df32277c3f6d622eec5ed09f493cae3f3391d242
*
* @author Steven Levithan <stevenlevithan.com> (MIT license)
* @api private
*/
const re = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
const parts = [
	"source",
	"protocol",
	"authority",
	"userInfo",
	"user",
	"password",
	"host",
	"port",
	"relative",
	"path",
	"directory",
	"file",
	"query",
	"anchor"
];
function parse(str) {
	if (str.length > 8e3) throw "URI too long";
	const src = str, b = str.indexOf("["), e = str.indexOf("]");
	if (b != -1 && e != -1) str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ";") + str.substring(e, str.length);
	let m = re.exec(str || ""), uri = {}, i = 14;
	while (i--) uri[parts[i]] = m[i] || "";
	if (b != -1 && e != -1) {
		uri.source = src;
		uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
		uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
		uri.ipv6uri = true;
	}
	uri.pathNames = pathNames(uri, uri["path"]);
	uri.queryKey = queryKey(uri, uri["query"]);
	return uri;
}
function pathNames(obj, path) {
	const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
	if (path.slice(0, 1) == "/" || path.length === 0) names.splice(0, 1);
	if (path.slice(-1) == "/") names.splice(names.length - 1, 1);
	return names;
}
function queryKey(uri, query) {
	const data = {};
	query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function($0, $1, $2) {
		if ($1) data[$1] = $2;
	});
	return data;
}

//#endregion
//#region node_modules/.pnpm/engine.io-client@6.6.2/node_modules/engine.io-client/build/esm/socket.js
const withEventListeners = typeof addEventListener === "function" && typeof removeEventListener === "function";
const OFFLINE_EVENT_LISTENERS = [];
if (withEventListeners) addEventListener("offline", () => {
	OFFLINE_EVENT_LISTENERS.forEach((listener) => listener());
}, false);
var SocketWithoutUpgrade = class SocketWithoutUpgrade extends Emitter {
	/**
	* Socket constructor.
	*
	* @param {String|Object} uri - uri or options
	* @param {Object} opts - options
	*/
	constructor(uri, opts) {
		super();
		this.binaryType = defaultBinaryType;
		this.writeBuffer = [];
		this._prevBufferLen = 0;
		this._pingInterval = -1;
		this._pingTimeout = -1;
		this._maxPayload = -1;
		/**
		* The expiration timestamp of the {@link _pingTimeoutTimer} object is tracked, in case the timer is throttled and the
		* callback is not fired on time. This can happen for example when a laptop is suspended or when a phone is locked.
		*/
		this._pingTimeoutTime = Infinity;
		if (uri && "object" === typeof uri) {
			opts = uri;
			uri = null;
		}
		if (uri) {
			const parsedUri = parse(uri);
			opts.hostname = parsedUri.host;
			opts.secure = parsedUri.protocol === "https" || parsedUri.protocol === "wss";
			opts.port = parsedUri.port;
			if (parsedUri.query) opts.query = parsedUri.query;
		} else if (opts.host) opts.hostname = parse(opts.host).host;
		installTimerFunctions(this, opts);
		this.secure = null != opts.secure ? opts.secure : typeof location !== "undefined" && "https:" === location.protocol;
		if (opts.hostname && !opts.port) opts.port = this.secure ? "443" : "80";
		this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
		this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : this.secure ? "443" : "80");
		this.transports = [];
		this._transportsByName = {};
		opts.transports.forEach((t) => {
			const transportName = t.prototype.name;
			this.transports.push(transportName);
			this._transportsByName[transportName] = t;
		});
		this.opts = Object.assign({
			path: "/engine.io",
			agent: false,
			withCredentials: false,
			upgrade: true,
			timestampParam: "t",
			rememberUpgrade: false,
			addTrailingSlash: true,
			rejectUnauthorized: true,
			perMessageDeflate: { threshold: 1024 },
			transportOptions: {},
			closeOnBeforeunload: false
		}, opts);
		this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : "");
		if (typeof this.opts.query === "string") this.opts.query = decode(this.opts.query);
		if (withEventListeners) {
			if (this.opts.closeOnBeforeunload) {
				this._beforeunloadEventListener = () => {
					if (this.transport) {
						this.transport.removeAllListeners();
						this.transport.close();
					}
				};
				addEventListener("beforeunload", this._beforeunloadEventListener, false);
			}
			if (this.hostname !== "localhost") {
				this._offlineEventListener = () => {
					this._onClose("transport close", { description: "network connection lost" });
				};
				OFFLINE_EVENT_LISTENERS.push(this._offlineEventListener);
			}
		}
		if (this.opts.withCredentials) this._cookieJar = createCookieJar();
		this._open();
	}
	/**
	* Creates transport of the given type.
	*
	* @param {String} name - transport name
	* @return {Transport}
	* @private
	*/
	createTransport(name) {
		const query = Object.assign({}, this.opts.query);
		query.EIO = protocol$2;
		query.transport = name;
		if (this.id) query.sid = this.id;
		const opts = Object.assign({}, this.opts, {
			query,
			socket: this,
			hostname: this.hostname,
			secure: this.secure,
			port: this.port
		}, this.opts.transportOptions[name]);
		return new this._transportsByName[name](opts);
	}
	/**
	* Initializes transport to use and starts probe.
	*
	* @private
	*/
	_open() {
		if (this.transports.length === 0) {
			this.setTimeoutFn(() => {
				this.emitReserved("error", "No transports available");
			}, 0);
			return;
		}
		const transportName = this.opts.rememberUpgrade && SocketWithoutUpgrade.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
		this.readyState = "opening";
		const transport = this.createTransport(transportName);
		transport.open();
		this.setTransport(transport);
	}
	/**
	* Sets the current transport. Disables the existing one (if any).
	*
	* @private
	*/
	setTransport(transport) {
		if (this.transport) this.transport.removeAllListeners();
		this.transport = transport;
		transport.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (reason) => this._onClose("transport close", reason));
	}
	/**
	* Called when connection is deemed open.
	*
	* @private
	*/
	onOpen() {
		this.readyState = "open";
		SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === this.transport.name;
		this.emitReserved("open");
		this.flush();
	}
	/**
	* Handles a packet.
	*
	* @private
	*/
	_onPacket(packet) {
		if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
			this.emitReserved("packet", packet);
			this.emitReserved("heartbeat");
			switch (packet.type) {
				case "open":
					this.onHandshake(JSON.parse(packet.data));
					break;
				case "ping":
					this._sendPacket("pong");
					this.emitReserved("ping");
					this.emitReserved("pong");
					this._resetPingTimeout();
					break;
				case "error":
					const err = new Error("server error");
					err.code = packet.data;
					this._onError(err);
					break;
				case "message":
					this.emitReserved("data", packet.data);
					this.emitReserved("message", packet.data);
					break;
			}
		} else {}
	}
	/**
	* Called upon handshake completion.
	*
	* @param {Object} data - handshake obj
	* @private
	*/
	onHandshake(data) {
		this.emitReserved("handshake", data);
		this.id = data.sid;
		this.transport.query.sid = data.sid;
		this._pingInterval = data.pingInterval;
		this._pingTimeout = data.pingTimeout;
		this._maxPayload = data.maxPayload;
		this.onOpen();
		if ("closed" === this.readyState) return;
		this._resetPingTimeout();
	}
	/**
	* Sets and resets ping timeout timer based on server pings.
	*
	* @private
	*/
	_resetPingTimeout() {
		this.clearTimeoutFn(this._pingTimeoutTimer);
		const delay = this._pingInterval + this._pingTimeout;
		this._pingTimeoutTime = Date.now() + delay;
		this._pingTimeoutTimer = this.setTimeoutFn(() => {
			this._onClose("ping timeout");
		}, delay);
		if (this.opts.autoUnref) this._pingTimeoutTimer.unref();
	}
	/**
	* Called on `drain` event
	*
	* @private
	*/
	_onDrain() {
		this.writeBuffer.splice(0, this._prevBufferLen);
		this._prevBufferLen = 0;
		if (0 === this.writeBuffer.length) this.emitReserved("drain");
else this.flush();
	}
	/**
	* Flush write buffers.
	*
	* @private
	*/
	flush() {
		if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
			const packets = this._getWritablePackets();
			this.transport.send(packets);
			this._prevBufferLen = packets.length;
			this.emitReserved("flush");
		}
	}
	/**
	* Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
	* long-polling)
	*
	* @private
	*/
	_getWritablePackets() {
		const shouldCheckPayloadSize = this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1;
		if (!shouldCheckPayloadSize) return this.writeBuffer;
		let payloadSize = 1;
		for (let i = 0; i < this.writeBuffer.length; i++) {
			const data = this.writeBuffer[i].data;
			if (data) payloadSize += byteLength(data);
			if (i > 0 && payloadSize > this._maxPayload) return this.writeBuffer.slice(0, i);
			payloadSize += 2;
		}
		return this.writeBuffer;
	}
	/**
	* Checks whether the heartbeat timer has expired but the socket has not yet been notified.
	*
	* Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
	* `write()` method then the message would not be buffered by the Socket.IO client.
	*
	* @return {boolean}
	* @private
	*/
	_hasPingExpired() {
		if (!this._pingTimeoutTime) return true;
		const hasExpired = Date.now() > this._pingTimeoutTime;
		if (hasExpired) {
			this._pingTimeoutTime = 0;
			nextTick(() => {
				this._onClose("ping timeout");
			}, this.setTimeoutFn);
		}
		return hasExpired;
	}
	/**
	* Sends a message.
	*
	* @param {String} msg - message.
	* @param {Object} options.
	* @param {Function} fn - callback function.
	* @return {Socket} for chaining.
	*/
	write(msg, options, fn) {
		this._sendPacket("message", msg, options, fn);
		return this;
	}
	/**
	* Sends a message. Alias of {@link Socket#write}.
	*
	* @param {String} msg - message.
	* @param {Object} options.
	* @param {Function} fn - callback function.
	* @return {Socket} for chaining.
	*/
	send(msg, options, fn) {
		this._sendPacket("message", msg, options, fn);
		return this;
	}
	/**
	* Sends a packet.
	*
	* @param {String} type: packet type.
	* @param {String} data.
	* @param {Object} options.
	* @param {Function} fn - callback function.
	* @private
	*/
	_sendPacket(type, data, options, fn) {
		if ("function" === typeof data) {
			fn = data;
			data = undefined;
		}
		if ("function" === typeof options) {
			fn = options;
			options = null;
		}
		if ("closing" === this.readyState || "closed" === this.readyState) return;
		options = options || {};
		options.compress = false !== options.compress;
		const packet = {
			type,
			data,
			options
		};
		this.emitReserved("packetCreate", packet);
		this.writeBuffer.push(packet);
		if (fn) this.once("flush", fn);
		this.flush();
	}
	/**
	* Closes the connection.
	*/
	close() {
		const close = () => {
			this._onClose("forced close");
			this.transport.close();
		};
		const cleanupAndClose = () => {
			this.off("upgrade", cleanupAndClose);
			this.off("upgradeError", cleanupAndClose);
			close();
		};
		const waitForUpgrade = () => {
			this.once("upgrade", cleanupAndClose);
			this.once("upgradeError", cleanupAndClose);
		};
		if ("opening" === this.readyState || "open" === this.readyState) {
			this.readyState = "closing";
			if (this.writeBuffer.length) this.once("drain", () => {
				if (this.upgrading) waitForUpgrade();
else close();
			});
else if (this.upgrading) waitForUpgrade();
else close();
		}
		return this;
	}
	/**
	* Called upon transport error
	*
	* @private
	*/
	_onError(err) {
		SocketWithoutUpgrade.priorWebsocketSuccess = false;
		if (this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening") {
			this.transports.shift();
			return this._open();
		}
		this.emitReserved("error", err);
		this._onClose("transport error", err);
	}
	/**
	* Called upon transport close.
	*
	* @private
	*/
	_onClose(reason, description) {
		if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
			this.clearTimeoutFn(this._pingTimeoutTimer);
			this.transport.removeAllListeners("close");
			this.transport.close();
			this.transport.removeAllListeners();
			if (withEventListeners) {
				if (this._beforeunloadEventListener) removeEventListener("beforeunload", this._beforeunloadEventListener, false);
				if (this._offlineEventListener) {
					const i = OFFLINE_EVENT_LISTENERS.indexOf(this._offlineEventListener);
					if (i !== -1) OFFLINE_EVENT_LISTENERS.splice(i, 1);
				}
			}
			this.readyState = "closed";
			this.id = null;
			this.emitReserved("close", reason, description);
			this.writeBuffer = [];
			this._prevBufferLen = 0;
		}
	}
};
SocketWithoutUpgrade.protocol = protocol$2;
var SocketWithUpgrade = class extends SocketWithoutUpgrade {
	constructor() {
		super(...arguments);
		this._upgrades = [];
	}
	onOpen() {
		super.onOpen();
		if ("open" === this.readyState && this.opts.upgrade) for (let i = 0; i < this._upgrades.length; i++) this._probe(this._upgrades[i]);
	}
	/**
	* Probes a transport.
	*
	* @param {String} name - transport name
	* @private
	*/
	_probe(name) {
		let transport = this.createTransport(name);
		let failed = false;
		SocketWithoutUpgrade.priorWebsocketSuccess = false;
		const onTransportOpen = () => {
			if (failed) return;
			transport.send([{
				type: "ping",
				data: "probe"
			}]);
			transport.once("packet", (msg) => {
				if (failed) return;
				if ("pong" === msg.type && "probe" === msg.data) {
					this.upgrading = true;
					this.emitReserved("upgrading", transport);
					if (!transport) return;
					SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === transport.name;
					this.transport.pause(() => {
						if (failed) return;
						if ("closed" === this.readyState) return;
						cleanup();
						this.setTransport(transport);
						transport.send([{ type: "upgrade" }]);
						this.emitReserved("upgrade", transport);
						transport = null;
						this.upgrading = false;
						this.flush();
					});
				} else {
					const err = new Error("probe error");
					err.transport = transport.name;
					this.emitReserved("upgradeError", err);
				}
			});
		};
		function freezeTransport() {
			if (failed) return;
			failed = true;
			cleanup();
			transport.close();
			transport = null;
		}
		const onerror = (err) => {
			const error = new Error("probe error: " + err);
			error.transport = transport.name;
			freezeTransport();
			this.emitReserved("upgradeError", error);
		};
		function onTransportClose() {
			onerror("transport closed");
		}
		function onclose() {
			onerror("socket closed");
		}
		function onupgrade(to) {
			if (transport && to.name !== transport.name) freezeTransport();
		}
		const cleanup = () => {
			transport.removeListener("open", onTransportOpen);
			transport.removeListener("error", onerror);
			transport.removeListener("close", onTransportClose);
			this.off("close", onclose);
			this.off("upgrading", onupgrade);
		};
		transport.once("open", onTransportOpen);
		transport.once("error", onerror);
		transport.once("close", onTransportClose);
		this.once("close", onclose);
		this.once("upgrading", onupgrade);
		if (this._upgrades.indexOf("webtransport") !== -1 && name !== "webtransport") this.setTimeoutFn(() => {
			if (!failed) transport.open();
		}, 200);
else transport.open();
	}
	onHandshake(data) {
		this._upgrades = this._filterUpgrades(data.upgrades);
		super.onHandshake(data);
	}
	/**
	* Filters upgrades, returning only those matching client transports.
	*
	* @param {Array} upgrades - server upgrades
	* @private
	*/
	_filterUpgrades(upgrades) {
		const filteredUpgrades = [];
		for (let i = 0; i < upgrades.length; i++) if (~this.transports.indexOf(upgrades[i])) filteredUpgrades.push(upgrades[i]);
		return filteredUpgrades;
	}
};
var Socket$1 = class extends SocketWithUpgrade {
	constructor(uri, opts = {}) {
		const o = typeof uri === "object" ? uri : opts;
		if (!o.transports || o.transports && typeof o.transports[0] === "string") o.transports = (o.transports || [
			"polling",
			"websocket",
			"webtransport"
		]).map((transportName) => transports[transportName]).filter((t) => !!t);
		super(uri, o);
	}
};

//#endregion
//#region node_modules/.pnpm/engine.io-client@6.6.2/node_modules/engine.io-client/build/esm/index.js
const protocol$1 = Socket$1.protocol;

//#endregion
//#region node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/url.js
function url(uri, path = "", loc) {
	let obj = uri;
	loc = loc || typeof location !== "undefined" && location;
	if (null == uri) uri = loc.protocol + "//" + loc.host;
	if (typeof uri === "string") {
		if ("/" === uri.charAt(0)) if ("/" === uri.charAt(1)) uri = loc.protocol + uri;
else uri = loc.host + uri;
		if (!/^(https?|wss?):\/\//.test(uri)) if ("undefined" !== typeof loc) uri = loc.protocol + "//" + uri;
else uri = "https://" + uri;
		obj = parse(uri);
	}
	if (!obj.port) {
		if (/^(http|ws)$/.test(obj.protocol)) obj.port = "80";
else if (/^(http|ws)s$/.test(obj.protocol)) obj.port = "443";
	}
	obj.path = obj.path || "/";
	const ipv6 = obj.host.indexOf(":") !== -1;
	const host = ipv6 ? "[" + obj.host + "]" : obj.host;
	obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
	obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port);
	return obj;
}

//#endregion
//#region node_modules/.pnpm/socket.io-parser@4.2.4/node_modules/socket.io-parser/build/esm/is-binary.js
const withNativeArrayBuffer = typeof ArrayBuffer === "function";
const isView = (obj) => {
	return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
};
const toString = Object.prototype.toString;
const withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
const withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
function isBinary(obj) {
	return withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj)) || withNativeBlob && obj instanceof Blob || withNativeFile && obj instanceof File;
}
function hasBinary(obj, toJSON) {
	if (!obj || typeof obj !== "object") return false;
	if (Array.isArray(obj)) {
		for (let i = 0, l = obj.length; i < l; i++) if (hasBinary(obj[i])) return true;
		return false;
	}
	if (isBinary(obj)) return true;
	if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) return hasBinary(obj.toJSON(), true);
	for (const key in obj) if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) return true;
	return false;
}

//#endregion
//#region node_modules/.pnpm/socket.io-parser@4.2.4/node_modules/socket.io-parser/build/esm/binary.js
function deconstructPacket(packet) {
	const buffers = [];
	const packetData = packet.data;
	const pack = packet;
	pack.data = _deconstructPacket(packetData, buffers);
	pack.attachments = buffers.length;
	return {
		packet: pack,
		buffers
	};
}
function _deconstructPacket(data, buffers) {
	if (!data) return data;
	if (isBinary(data)) {
		const placeholder = {
			_placeholder: true,
			num: buffers.length
		};
		buffers.push(data);
		return placeholder;
	} else if (Array.isArray(data)) {
		const newData = new Array(data.length);
		for (let i = 0; i < data.length; i++) newData[i] = _deconstructPacket(data[i], buffers);
		return newData;
	} else if (typeof data === "object" && !(data instanceof Date)) {
		const newData = {};
		for (const key in data) if (Object.prototype.hasOwnProperty.call(data, key)) newData[key] = _deconstructPacket(data[key], buffers);
		return newData;
	}
	return data;
}
function reconstructPacket(packet, buffers) {
	packet.data = _reconstructPacket(packet.data, buffers);
	delete packet.attachments;
	return packet;
}
function _reconstructPacket(data, buffers) {
	if (!data) return data;
	if (data && data._placeholder === true) {
		const isIndexValid = typeof data.num === "number" && data.num >= 0 && data.num < buffers.length;
		if (isIndexValid) return buffers[data.num];
else throw new Error("illegal attachments");
	} else if (Array.isArray(data)) for (let i = 0; i < data.length; i++) data[i] = _reconstructPacket(data[i], buffers);
else if (typeof data === "object") {
		for (const key in data) if (Object.prototype.hasOwnProperty.call(data, key)) data[key] = _reconstructPacket(data[key], buffers);
	}
	return data;
}

//#endregion
//#region node_modules/.pnpm/socket.io-parser@4.2.4/node_modules/socket.io-parser/build/esm/index.js
var esm_exports = {};
__export(esm_exports, {
	Decoder: () => Decoder,
	Encoder: () => Encoder,
	PacketType: () => PacketType,
	protocol: () => protocol
});
/**
* These strings must not be used as event names, as they have a special meaning.
*/
const RESERVED_EVENTS$1 = [
	"connect",
	"connect_error",
	"disconnect",
	"disconnecting",
	"newListener",
	"removeListener"
];
const protocol = 5;
var PacketType;
(function(PacketType$1) {
	PacketType$1[PacketType$1["CONNECT"] = 0] = "CONNECT";
	PacketType$1[PacketType$1["DISCONNECT"] = 1] = "DISCONNECT";
	PacketType$1[PacketType$1["EVENT"] = 2] = "EVENT";
	PacketType$1[PacketType$1["ACK"] = 3] = "ACK";
	PacketType$1[PacketType$1["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
	PacketType$1[PacketType$1["BINARY_EVENT"] = 5] = "BINARY_EVENT";
	PacketType$1[PacketType$1["BINARY_ACK"] = 6] = "BINARY_ACK";
})(PacketType || (PacketType = {}));
var Encoder = class {
	/**
	* Encoder constructor
	*
	* @param {function} replacer - custom replacer to pass down to JSON.parse
	*/
	constructor(replacer) {
		this.replacer = replacer;
	}
	/**
	* Encode a packet as a single string if non-binary, or as a
	* buffer sequence, depending on packet type.
	*
	* @param {Object} obj - packet object
	*/
	encode(obj) {
		if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
			if (hasBinary(obj)) return this.encodeAsBinary({
				type: obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK,
				nsp: obj.nsp,
				data: obj.data,
				id: obj.id
			});
		}
		return [this.encodeAsString(obj)];
	}
	/**
	* Encode packet as string.
	*/
	encodeAsString(obj) {
		let str = "" + obj.type;
		if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) str += obj.attachments + "-";
		if (obj.nsp && "/" !== obj.nsp) str += obj.nsp + ",";
		if (null != obj.id) str += obj.id;
		if (null != obj.data) str += JSON.stringify(obj.data, this.replacer);
		return str;
	}
	/**
	* Encode packet as 'buffer sequence' by removing blobs, and
	* deconstructing packet into object with placeholders and
	* a list of buffers.
	*/
	encodeAsBinary(obj) {
		const deconstruction = deconstructPacket(obj);
		const pack = this.encodeAsString(deconstruction.packet);
		const buffers = deconstruction.buffers;
		buffers.unshift(pack);
		return buffers;
	}
};
function isObject(value$1) {
	return Object.prototype.toString.call(value$1) === "[object Object]";
}
var Decoder = class Decoder extends Emitter {
	/**
	* Decoder constructor
	*
	* @param {function} reviver - custom reviver to pass down to JSON.stringify
	*/
	constructor(reviver) {
		super();
		this.reviver = reviver;
	}
	/**
	* Decodes an encoded packet string into packet JSON.
	*
	* @param {String} obj - encoded packet
	*/
	add(obj) {
		let packet;
		if (typeof obj === "string") {
			if (this.reconstructor) throw new Error("got plaintext data when reconstructing a packet");
			packet = this.decodeString(obj);
			const isBinaryEvent = packet.type === PacketType.BINARY_EVENT;
			if (isBinaryEvent || packet.type === PacketType.BINARY_ACK) {
				packet.type = isBinaryEvent ? PacketType.EVENT : PacketType.ACK;
				this.reconstructor = new BinaryReconstructor(packet);
				if (packet.attachments === 0) super.emitReserved("decoded", packet);
			} else super.emitReserved("decoded", packet);
		} else if (isBinary(obj) || obj.base64) if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
else {
			packet = this.reconstructor.takeBinaryData(obj);
			if (packet) {
				this.reconstructor = null;
				super.emitReserved("decoded", packet);
			}
		}
else throw new Error("Unknown type: " + obj);
	}
	/**
	* Decode a packet String (JSON data)
	*
	* @param {String} str
	* @return {Object} packet
	*/
	decodeString(str) {
		let i = 0;
		const p = { type: Number(str.charAt(0)) };
		if (PacketType[p.type] === undefined) throw new Error("unknown packet type " + p.type);
		if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
			const start = i + 1;
			while (str.charAt(++i) !== "-" && i != str.length);
			const buf = str.substring(start, i);
			if (buf != Number(buf) || str.charAt(i) !== "-") throw new Error("Illegal attachments");
			p.attachments = Number(buf);
		}
		if ("/" === str.charAt(i + 1)) {
			const start = i + 1;
			while (++i) {
				const c = str.charAt(i);
				if ("," === c) break;
				if (i === str.length) break;
			}
			p.nsp = str.substring(start, i);
		} else p.nsp = "/";
		const next = str.charAt(i + 1);
		if ("" !== next && Number(next) == next) {
			const start = i + 1;
			while (++i) {
				const c = str.charAt(i);
				if (null == c || Number(c) != c) {
					--i;
					break;
				}
				if (i === str.length) break;
			}
			p.id = Number(str.substring(start, i + 1));
		}
		if (str.charAt(++i)) {
			const payload = this.tryParse(str.substr(i));
			if (Decoder.isPayloadValid(p.type, payload)) p.data = payload;
else throw new Error("invalid payload");
		}
		return p;
	}
	tryParse(str) {
		try {
			return JSON.parse(str, this.reviver);
		} catch (e) {
			return false;
		}
	}
	static isPayloadValid(type, payload) {
		switch (type) {
			case PacketType.CONNECT: return isObject(payload);
			case PacketType.DISCONNECT: return payload === undefined;
			case PacketType.CONNECT_ERROR: return typeof payload === "string" || isObject(payload);
			case PacketType.EVENT:
			case PacketType.BINARY_EVENT: return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS$1.indexOf(payload[0]) === -1);
			case PacketType.ACK:
			case PacketType.BINARY_ACK: return Array.isArray(payload);
		}
	}
	/**
	* Deallocates a parser's resources
	*/
	destroy() {
		if (this.reconstructor) {
			this.reconstructor.finishedReconstruction();
			this.reconstructor = null;
		}
	}
};
var BinaryReconstructor = class {
	constructor(packet) {
		this.packet = packet;
		this.buffers = [];
		this.reconPack = packet;
	}
	/**
	* Method to be called when binary data received from connection
	* after a BINARY_EVENT packet.
	*
	* @param {Buffer | ArrayBuffer} binData - the raw binary data received
	* @return {null | Object} returns null if more binary data is expected or
	*   a reconstructed packet object if all buffers have been received.
	*/
	takeBinaryData(binData) {
		this.buffers.push(binData);
		if (this.buffers.length === this.reconPack.attachments) {
			const packet = reconstructPacket(this.reconPack, this.buffers);
			this.finishedReconstruction();
			return packet;
		}
		return null;
	}
	/**
	* Cleans up binary packet reconstruction variables.
	*/
	finishedReconstruction() {
		this.reconPack = null;
		this.buffers = [];
	}
};

//#endregion
//#region node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/on.js
function on(obj, ev, fn) {
	obj.on(ev, fn);
	return function subDestroy() {
		obj.off(ev, fn);
	};
}

//#endregion
//#region node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/socket.js
/**
* Internal events.
* These events can't be emitted by the user.
*/
const RESERVED_EVENTS = Object.freeze({
	connect: 1,
	connect_error: 1,
	disconnect: 1,
	disconnecting: 1,
	newListener: 1,
	removeListener: 1
});
var Socket = class extends Emitter {
	/**
	* `Socket` constructor.
	*/
	constructor(io, nsp, opts) {
		super();
		/**
		* Whether the socket is currently connected to the server.
		*
		* @example
		* const socket = io();
		*
		* socket.on("connect", () => {
		*   console.log(socket.connected); // true
		* });
		*
		* socket.on("disconnect", () => {
		*   console.log(socket.connected); // false
		* });
		*/
		this.connected = false;
		/**
		* Whether the connection state was recovered after a temporary disconnection. In that case, any missed packets will
		* be transmitted by the server.
		*/
		this.recovered = false;
		/**
		* Buffer for packets received before the CONNECT packet
		*/
		this.receiveBuffer = [];
		/**
		* Buffer for packets that will be sent once the socket is connected
		*/
		this.sendBuffer = [];
		/**
		* The queue of packets to be sent with retry in case of failure.
		*
		* Packets are sent one by one, each waiting for the server acknowledgement, in order to guarantee the delivery order.
		* @private
		*/
		this._queue = [];
		/**
		* A sequence to generate the ID of the {@link QueuedPacket}.
		* @private
		*/
		this._queueSeq = 0;
		this.ids = 0;
		/**
		* A map containing acknowledgement handlers.
		*
		* The `withError` attribute is used to differentiate handlers that accept an error as first argument:
		*
		* - `socket.emit("test", (err, value) => { ... })` with `ackTimeout` option
		* - `socket.timeout(5000).emit("test", (err, value) => { ... })`
		* - `const value = await socket.emitWithAck("test")`
		*
		* From those that don't:
		*
		* - `socket.emit("test", (value) => { ... });`
		*
		* In the first case, the handlers will be called with an error when:
		*
		* - the timeout is reached
		* - the socket gets disconnected
		*
		* In the second case, the handlers will be simply discarded upon disconnection, since the client will never receive
		* an acknowledgement from the server.
		*
		* @private
		*/
		this.acks = {};
		this.flags = {};
		this.io = io;
		this.nsp = nsp;
		if (opts && opts.auth) this.auth = opts.auth;
		this._opts = Object.assign({}, opts);
		if (this.io._autoConnect) this.open();
	}
	/**
	* Whether the socket is currently disconnected
	*
	* @example
	* const socket = io();
	*
	* socket.on("connect", () => {
	*   console.log(socket.disconnected); // false
	* });
	*
	* socket.on("disconnect", () => {
	*   console.log(socket.disconnected); // true
	* });
	*/
	get disconnected() {
		return !this.connected;
	}
	/**
	* Subscribe to open, close and packet events
	*
	* @private
	*/
	subEvents() {
		if (this.subs) return;
		const io = this.io;
		this.subs = [
			on(io, "open", this.onopen.bind(this)),
			on(io, "packet", this.onpacket.bind(this)),
			on(io, "error", this.onerror.bind(this)),
			on(io, "close", this.onclose.bind(this))
		];
	}
	/**
	* Whether the Socket will try to reconnect when its Manager connects or reconnects.
	*
	* @example
	* const socket = io();
	*
	* console.log(socket.active); // true
	*
	* socket.on("disconnect", (reason) => {
	*   if (reason === "io server disconnect") {
	*     // the disconnection was initiated by the server, you need to manually reconnect
	*     console.log(socket.active); // false
	*   }
	*   // else the socket will automatically try to reconnect
	*   console.log(socket.active); // true
	* });
	*/
	get active() {
		return !!this.subs;
	}
	/**
	* "Opens" the socket.
	*
	* @example
	* const socket = io({
	*   autoConnect: false
	* });
	*
	* socket.connect();
	*/
	connect() {
		if (this.connected) return this;
		this.subEvents();
		if (!this.io["_reconnecting"]) this.io.open();
		if ("open" === this.io._readyState) this.onopen();
		return this;
	}
	/**
	* Alias for {@link connect()}.
	*/
	open() {
		return this.connect();
	}
	/**
	* Sends a `message` event.
	*
	* This method mimics the WebSocket.send() method.
	*
	* @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
	*
	* @example
	* socket.send("hello");
	*
	* // this is equivalent to
	* socket.emit("message", "hello");
	*
	* @return self
	*/
	send(...args) {
		args.unshift("message");
		this.emit.apply(this, args);
		return this;
	}
	/**
	* Override `emit`.
	* If the event is in `events`, it's emitted normally.
	*
	* @example
	* socket.emit("hello", "world");
	*
	* // all serializable datastructures are supported (no need to call JSON.stringify)
	* socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
	*
	* // with an acknowledgement from the server
	* socket.emit("hello", "world", (val) => {
	*   // ...
	* });
	*
	* @return self
	*/
	emit(ev, ...args) {
		var _a, _b, _c;
		if (RESERVED_EVENTS.hasOwnProperty(ev)) throw new Error("\"" + ev.toString() + "\" is a reserved event name");
		args.unshift(ev);
		if (this._opts.retries && !this.flags.fromQueue && !this.flags.volatile) {
			this._addToQueue(args);
			return this;
		}
		const packet = {
			type: PacketType.EVENT,
			data: args
		};
		packet.options = {};
		packet.options.compress = this.flags.compress !== false;
		if ("function" === typeof args[args.length - 1]) {
			const id = this.ids++;
			const ack = args.pop();
			this._registerAckCallback(id, ack);
			packet.id = id;
		}
		const isTransportWritable = (_b = (_a = this.io.engine) === null || _a === void 0 ? void 0 : _a.transport) === null || _b === void 0 ? void 0 : _b.writable;
		const isConnected = this.connected && !((_c = this.io.engine) === null || _c === void 0 ? void 0 : _c._hasPingExpired());
		const discardPacket = this.flags.volatile && !isTransportWritable;
		if (discardPacket) {} else if (isConnected) {
			this.notifyOutgoingListeners(packet);
			this.packet(packet);
		} else this.sendBuffer.push(packet);
		this.flags = {};
		return this;
	}
	/**
	* @private
	*/
	_registerAckCallback(id, ack) {
		var _a;
		const timeout = (_a = this.flags.timeout) !== null && _a !== void 0 ? _a : this._opts.ackTimeout;
		if (timeout === undefined) {
			this.acks[id] = ack;
			return;
		}
		const timer = this.io.setTimeoutFn(() => {
			delete this.acks[id];
			for (let i = 0; i < this.sendBuffer.length; i++) if (this.sendBuffer[i].id === id) this.sendBuffer.splice(i, 1);
			ack.call(this, new Error("operation has timed out"));
		}, timeout);
		const fn = (...args) => {
			this.io.clearTimeoutFn(timer);
			ack.apply(this, args);
		};
		fn.withError = true;
		this.acks[id] = fn;
	}
	/**
	* Emits an event and waits for an acknowledgement
	*
	* @example
	* // without timeout
	* const response = await socket.emitWithAck("hello", "world");
	*
	* // with a specific timeout
	* try {
	*   const response = await socket.timeout(1000).emitWithAck("hello", "world");
	* } catch (err) {
	*   // the server did not acknowledge the event in the given delay
	* }
	*
	* @return a Promise that will be fulfilled when the server acknowledges the event
	*/
	emitWithAck(ev, ...args) {
		return new Promise((resolve, reject) => {
			const fn = (arg1, arg2) => {
				return arg1 ? reject(arg1) : resolve(arg2);
			};
			fn.withError = true;
			args.push(fn);
			this.emit(ev, ...args);
		});
	}
	/**
	* Add the packet to the queue.
	* @param args
	* @private
	*/
	_addToQueue(args) {
		let ack;
		if (typeof args[args.length - 1] === "function") ack = args.pop();
		const packet = {
			id: this._queueSeq++,
			tryCount: 0,
			pending: false,
			args,
			flags: Object.assign({ fromQueue: true }, this.flags)
		};
		args.push((err, ...responseArgs) => {
			if (packet !== this._queue[0]) return;
			const hasError = err !== null;
			if (hasError) {
				if (packet.tryCount > this._opts.retries) {
					this._queue.shift();
					if (ack) ack(err);
				}
			} else {
				this._queue.shift();
				if (ack) ack(null, ...responseArgs);
			}
			packet.pending = false;
			return this._drainQueue();
		});
		this._queue.push(packet);
		this._drainQueue();
	}
	/**
	* Send the first packet of the queue, and wait for an acknowledgement from the server.
	* @param force - whether to resend a packet that has not been acknowledged yet
	*
	* @private
	*/
	_drainQueue(force = false) {
		if (!this.connected || this._queue.length === 0) return;
		const packet = this._queue[0];
		if (packet.pending && !force) return;
		packet.pending = true;
		packet.tryCount++;
		this.flags = packet.flags;
		this.emit.apply(this, packet.args);
	}
	/**
	* Sends a packet.
	*
	* @param packet
	* @private
	*/
	packet(packet) {
		packet.nsp = this.nsp;
		this.io._packet(packet);
	}
	/**
	* Called upon engine `open`.
	*
	* @private
	*/
	onopen() {
		if (typeof this.auth == "function") this.auth((data) => {
			this._sendConnectPacket(data);
		});
else this._sendConnectPacket(this.auth);
	}
	/**
	* Sends a CONNECT packet to initiate the Socket.IO session.
	*
	* @param data
	* @private
	*/
	_sendConnectPacket(data) {
		this.packet({
			type: PacketType.CONNECT,
			data: this._pid ? Object.assign({
				pid: this._pid,
				offset: this._lastOffset
			}, data) : data
		});
	}
	/**
	* Called upon engine or manager `error`.
	*
	* @param err
	* @private
	*/
	onerror(err) {
		if (!this.connected) this.emitReserved("connect_error", err);
	}
	/**
	* Called upon engine `close`.
	*
	* @param reason
	* @param description
	* @private
	*/
	onclose(reason, description) {
		this.connected = false;
		delete this.id;
		this.emitReserved("disconnect", reason, description);
		this._clearAcks();
	}
	/**
	* Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
	* the server.
	*
	* @private
	*/
	_clearAcks() {
		Object.keys(this.acks).forEach((id) => {
			const isBuffered = this.sendBuffer.some((packet) => String(packet.id) === id);
			if (!isBuffered) {
				const ack = this.acks[id];
				delete this.acks[id];
				if (ack.withError) ack.call(this, new Error("socket has been disconnected"));
			}
		});
	}
	/**
	* Called with socket packet.
	*
	* @param packet
	* @private
	*/
	onpacket(packet) {
		const sameNamespace = packet.nsp === this.nsp;
		if (!sameNamespace) return;
		switch (packet.type) {
			case PacketType.CONNECT:
				if (packet.data && packet.data.sid) this.onconnect(packet.data.sid, packet.data.pid);
else this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
				break;
			case PacketType.EVENT:
			case PacketType.BINARY_EVENT:
				this.onevent(packet);
				break;
			case PacketType.ACK:
			case PacketType.BINARY_ACK:
				this.onack(packet);
				break;
			case PacketType.DISCONNECT:
				this.ondisconnect();
				break;
			case PacketType.CONNECT_ERROR:
				this.destroy();
				const err = new Error(packet.data.message);
				err.data = packet.data.data;
				this.emitReserved("connect_error", err);
				break;
		}
	}
	/**
	* Called upon a server event.
	*
	* @param packet
	* @private
	*/
	onevent(packet) {
		const args = packet.data || [];
		if (null != packet.id) args.push(this.ack(packet.id));
		if (this.connected) this.emitEvent(args);
else this.receiveBuffer.push(Object.freeze(args));
	}
	emitEvent(args) {
		if (this._anyListeners && this._anyListeners.length) {
			const listeners = this._anyListeners.slice();
			for (const listener of listeners) listener.apply(this, args);
		}
		super.emit.apply(this, args);
		if (this._pid && args.length && typeof args[args.length - 1] === "string") this._lastOffset = args[args.length - 1];
	}
	/**
	* Produces an ack callback to emit with an event.
	*
	* @private
	*/
	ack(id) {
		const self$1 = this;
		let sent = false;
		return function(...args) {
			if (sent) return;
			sent = true;
			self$1.packet({
				type: PacketType.ACK,
				id,
				data: args
			});
		};
	}
	/**
	* Called upon a server acknowledgement.
	*
	* @param packet
	* @private
	*/
	onack(packet) {
		const ack = this.acks[packet.id];
		if (typeof ack !== "function") return;
		delete this.acks[packet.id];
		if (ack.withError) packet.data.unshift(null);
		ack.apply(this, packet.data);
	}
	/**
	* Called upon server connect.
	*
	* @private
	*/
	onconnect(id, pid) {
		this.id = id;
		this.recovered = pid && this._pid === pid;
		this._pid = pid;
		this.connected = true;
		this.emitBuffered();
		this.emitReserved("connect");
		this._drainQueue(true);
	}
	/**
	* Emit buffered events (received and emitted).
	*
	* @private
	*/
	emitBuffered() {
		this.receiveBuffer.forEach((args) => this.emitEvent(args));
		this.receiveBuffer = [];
		this.sendBuffer.forEach((packet) => {
			this.notifyOutgoingListeners(packet);
			this.packet(packet);
		});
		this.sendBuffer = [];
	}
	/**
	* Called upon server disconnect.
	*
	* @private
	*/
	ondisconnect() {
		this.destroy();
		this.onclose("io server disconnect");
	}
	/**
	* Called upon forced client/server side disconnections,
	* this method ensures the manager stops tracking us and
	* that reconnections don't get triggered for this.
	*
	* @private
	*/
	destroy() {
		if (this.subs) {
			this.subs.forEach((subDestroy) => subDestroy());
			this.subs = undefined;
		}
		this.io["_destroy"](this);
	}
	/**
	* Disconnects the socket manually. In that case, the socket will not try to reconnect.
	*
	* If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
	*
	* @example
	* const socket = io();
	*
	* socket.on("disconnect", (reason) => {
	*   // console.log(reason); prints "io client disconnect"
	* });
	*
	* socket.disconnect();
	*
	* @return self
	*/
	disconnect() {
		if (this.connected) this.packet({ type: PacketType.DISCONNECT });
		this.destroy();
		if (this.connected) this.onclose("io client disconnect");
		return this;
	}
	/**
	* Alias for {@link disconnect()}.
	*
	* @return self
	*/
	close() {
		return this.disconnect();
	}
	/**
	* Sets the compress flag.
	*
	* @example
	* socket.compress(false).emit("hello");
	*
	* @param compress - if `true`, compresses the sending data
	* @return self
	*/
	compress(compress) {
		this.flags.compress = compress;
		return this;
	}
	/**
	* Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
	* ready to send messages.
	*
	* @example
	* socket.volatile.emit("hello"); // the server may or may not receive it
	*
	* @returns self
	*/
	get volatile() {
		this.flags.volatile = true;
		return this;
	}
	/**
	* Sets a modifier for a subsequent event emission that the callback will be called with an error when the
	* given number of milliseconds have elapsed without an acknowledgement from the server:
	*
	* @example
	* socket.timeout(5000).emit("my-event", (err) => {
	*   if (err) {
	*     // the server did not acknowledge the event in the given delay
	*   }
	* });
	*
	* @returns self
	*/
	timeout(timeout) {
		this.flags.timeout = timeout;
		return this;
	}
	/**
	* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
	* callback.
	*
	* @example
	* socket.onAny((event, ...args) => {
	*   console.log(`got ${event}`);
	* });
	*
	* @param listener
	*/
	onAny(listener) {
		this._anyListeners = this._anyListeners || [];
		this._anyListeners.push(listener);
		return this;
	}
	/**
	* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
	* callback. The listener is added to the beginning of the listeners array.
	*
	* @example
	* socket.prependAny((event, ...args) => {
	*   console.log(`got event ${event}`);
	* });
	*
	* @param listener
	*/
	prependAny(listener) {
		this._anyListeners = this._anyListeners || [];
		this._anyListeners.unshift(listener);
		return this;
	}
	/**
	* Removes the listener that will be fired when any event is emitted.
	*
	* @example
	* const catchAllListener = (event, ...args) => {
	*   console.log(`got event ${event}`);
	* }
	*
	* socket.onAny(catchAllListener);
	*
	* // remove a specific listener
	* socket.offAny(catchAllListener);
	*
	* // or remove all listeners
	* socket.offAny();
	*
	* @param listener
	*/
	offAny(listener) {
		if (!this._anyListeners) return this;
		if (listener) {
			const listeners = this._anyListeners;
			for (let i = 0; i < listeners.length; i++) if (listener === listeners[i]) {
				listeners.splice(i, 1);
				return this;
			}
		} else this._anyListeners = [];
		return this;
	}
	/**
	* Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
	* e.g. to remove listeners.
	*/
	listenersAny() {
		return this._anyListeners || [];
	}
	/**
	* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
	* callback.
	*
	* Note: acknowledgements sent to the server are not included.
	*
	* @example
	* socket.onAnyOutgoing((event, ...args) => {
	*   console.log(`sent event ${event}`);
	* });
	*
	* @param listener
	*/
	onAnyOutgoing(listener) {
		this._anyOutgoingListeners = this._anyOutgoingListeners || [];
		this._anyOutgoingListeners.push(listener);
		return this;
	}
	/**
	* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
	* callback. The listener is added to the beginning of the listeners array.
	*
	* Note: acknowledgements sent to the server are not included.
	*
	* @example
	* socket.prependAnyOutgoing((event, ...args) => {
	*   console.log(`sent event ${event}`);
	* });
	*
	* @param listener
	*/
	prependAnyOutgoing(listener) {
		this._anyOutgoingListeners = this._anyOutgoingListeners || [];
		this._anyOutgoingListeners.unshift(listener);
		return this;
	}
	/**
	* Removes the listener that will be fired when any event is emitted.
	*
	* @example
	* const catchAllListener = (event, ...args) => {
	*   console.log(`sent event ${event}`);
	* }
	*
	* socket.onAnyOutgoing(catchAllListener);
	*
	* // remove a specific listener
	* socket.offAnyOutgoing(catchAllListener);
	*
	* // or remove all listeners
	* socket.offAnyOutgoing();
	*
	* @param [listener] - the catch-all listener (optional)
	*/
	offAnyOutgoing(listener) {
		if (!this._anyOutgoingListeners) return this;
		if (listener) {
			const listeners = this._anyOutgoingListeners;
			for (let i = 0; i < listeners.length; i++) if (listener === listeners[i]) {
				listeners.splice(i, 1);
				return this;
			}
		} else this._anyOutgoingListeners = [];
		return this;
	}
	/**
	* Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
	* e.g. to remove listeners.
	*/
	listenersAnyOutgoing() {
		return this._anyOutgoingListeners || [];
	}
	/**
	* Notify the listeners for each packet sent
	*
	* @param packet
	*
	* @private
	*/
	notifyOutgoingListeners(packet) {
		if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
			const listeners = this._anyOutgoingListeners.slice();
			for (const listener of listeners) listener.apply(this, packet.data);
		}
	}
};

//#endregion
//#region node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/contrib/backo2.js
function Backoff(opts) {
	opts = opts || {};
	this.ms = opts.min || 100;
	this.max = opts.max || 1e4;
	this.factor = opts.factor || 2;
	this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
	this.attempts = 0;
}
/**
* Return the backoff duration.
*
* @return {Number}
* @api public
*/
Backoff.prototype.duration = function() {
	var ms = this.ms * Math.pow(this.factor, this.attempts++);
	if (this.jitter) {
		var rand = Math.random();
		var deviation = Math.floor(rand * this.jitter * ms);
		ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
	}
	return Math.min(ms, this.max) | 0;
};
/**
* Reset the number of attempts.
*
* @api public
*/
Backoff.prototype.reset = function() {
	this.attempts = 0;
};
/**
* Set the minimum duration
*
* @api public
*/
Backoff.prototype.setMin = function(min) {
	this.ms = min;
};
/**
* Set the maximum duration
*
* @api public
*/
Backoff.prototype.setMax = function(max) {
	this.max = max;
};
/**
* Set the jitter
*
* @api public
*/
Backoff.prototype.setJitter = function(jitter) {
	this.jitter = jitter;
};

//#endregion
//#region node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/manager.js
var Manager = class extends Emitter {
	constructor(uri, opts) {
		var _a;
		super();
		this.nsps = {};
		this.subs = [];
		if (uri && "object" === typeof uri) {
			opts = uri;
			uri = undefined;
		}
		opts = opts || {};
		opts.path = opts.path || "/socket.io";
		this.opts = opts;
		installTimerFunctions(this, opts);
		this.reconnection(opts.reconnection !== false);
		this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
		this.reconnectionDelay(opts.reconnectionDelay || 1e3);
		this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
		this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : .5);
		this.backoff = new Backoff({
			min: this.reconnectionDelay(),
			max: this.reconnectionDelayMax(),
			jitter: this.randomizationFactor()
		});
		this.timeout(null == opts.timeout ? 2e4 : opts.timeout);
		this._readyState = "closed";
		this.uri = uri;
		const _parser = opts.parser || esm_exports;
		this.encoder = new _parser.Encoder();
		this.decoder = new _parser.Decoder();
		this._autoConnect = opts.autoConnect !== false;
		if (this._autoConnect) this.open();
	}
	reconnection(v) {
		if (!arguments.length) return this._reconnection;
		this._reconnection = !!v;
		if (!v) this.skipReconnect = true;
		return this;
	}
	reconnectionAttempts(v) {
		if (v === undefined) return this._reconnectionAttempts;
		this._reconnectionAttempts = v;
		return this;
	}
	reconnectionDelay(v) {
		var _a;
		if (v === undefined) return this._reconnectionDelay;
		this._reconnectionDelay = v;
		(_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
		return this;
	}
	randomizationFactor(v) {
		var _a;
		if (v === undefined) return this._randomizationFactor;
		this._randomizationFactor = v;
		(_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
		return this;
	}
	reconnectionDelayMax(v) {
		var _a;
		if (v === undefined) return this._reconnectionDelayMax;
		this._reconnectionDelayMax = v;
		(_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
		return this;
	}
	timeout(v) {
		if (!arguments.length) return this._timeout;
		this._timeout = v;
		return this;
	}
	/**
	* Starts trying to reconnect if reconnection is enabled and we have not
	* started reconnecting yet
	*
	* @private
	*/
	maybeReconnectOnOpen() {
		if (!this._reconnecting && this._reconnection && this.backoff.attempts === 0) this.reconnect();
	}
	/**
	* Sets the current transport `socket`.
	*
	* @param {Function} fn - optional, callback
	* @return self
	* @public
	*/
	open(fn) {
		if (~this._readyState.indexOf("open")) return this;
		this.engine = new Socket$1(this.uri, this.opts);
		const socket = this.engine;
		const self$1 = this;
		this._readyState = "opening";
		this.skipReconnect = false;
		const openSubDestroy = on(socket, "open", function() {
			self$1.onopen();
			fn && fn();
		});
		const onError = (err) => {
			this.cleanup();
			this._readyState = "closed";
			this.emitReserved("error", err);
			if (fn) fn(err);
else this.maybeReconnectOnOpen();
		};
		const errorSub = on(socket, "error", onError);
		if (false !== this._timeout) {
			const timeout = this._timeout;
			const timer = this.setTimeoutFn(() => {
				openSubDestroy();
				onError(new Error("timeout"));
				socket.close();
			}, timeout);
			if (this.opts.autoUnref) timer.unref();
			this.subs.push(() => {
				this.clearTimeoutFn(timer);
			});
		}
		this.subs.push(openSubDestroy);
		this.subs.push(errorSub);
		return this;
	}
	/**
	* Alias for open()
	*
	* @return self
	* @public
	*/
	connect(fn) {
		return this.open(fn);
	}
	/**
	* Called upon transport open.
	*
	* @private
	*/
	onopen() {
		this.cleanup();
		this._readyState = "open";
		this.emitReserved("open");
		const socket = this.engine;
		this.subs.push(
			on(socket, "ping", this.onping.bind(this)),
			on(socket, "data", this.ondata.bind(this)),
			on(socket, "error", this.onerror.bind(this)),
			on(socket, "close", this.onclose.bind(this)),
			// @ts-ignore
			on(this.decoder, "decoded", this.ondecoded.bind(this))
);
	}
	/**
	* Called upon a ping.
	*
	* @private
	*/
	onping() {
		this.emitReserved("ping");
	}
	/**
	* Called with data.
	*
	* @private
	*/
	ondata(data) {
		try {
			this.decoder.add(data);
		} catch (e) {
			this.onclose("parse error", e);
		}
	}
	/**
	* Called when parser fully decodes a packet.
	*
	* @private
	*/
	ondecoded(packet) {
		nextTick(() => {
			this.emitReserved("packet", packet);
		}, this.setTimeoutFn);
	}
	/**
	* Called upon socket error.
	*
	* @private
	*/
	onerror(err) {
		this.emitReserved("error", err);
	}
	/**
	* Creates a new socket for the given `nsp`.
	*
	* @return {Socket}
	* @public
	*/
	socket(nsp, opts) {
		let socket = this.nsps[nsp];
		if (!socket) {
			socket = new Socket(this, nsp, opts);
			this.nsps[nsp] = socket;
		} else if (this._autoConnect && !socket.active) socket.connect();
		return socket;
	}
	/**
	* Called upon a socket close.
	*
	* @param socket
	* @private
	*/
	_destroy(socket) {
		const nsps = Object.keys(this.nsps);
		for (const nsp of nsps) {
			const socket$1 = this.nsps[nsp];
			if (socket$1.active) return;
		}
		this._close();
	}
	/**
	* Writes a packet.
	*
	* @param packet
	* @private
	*/
	_packet(packet) {
		const encodedPackets = this.encoder.encode(packet);
		for (let i = 0; i < encodedPackets.length; i++) this.engine.write(encodedPackets[i], packet.options);
	}
	/**
	* Clean up transport subscriptions and packet buffer.
	*
	* @private
	*/
	cleanup() {
		this.subs.forEach((subDestroy) => subDestroy());
		this.subs.length = 0;
		this.decoder.destroy();
	}
	/**
	* Close the current socket.
	*
	* @private
	*/
	_close() {
		this.skipReconnect = true;
		this._reconnecting = false;
		this.onclose("forced close");
	}
	/**
	* Alias for close()
	*
	* @private
	*/
	disconnect() {
		return this._close();
	}
	/**
	* Called when:
	*
	* - the low-level engine is closed
	* - the parser encountered a badly formatted packet
	* - all sockets are disconnected
	*
	* @private
	*/
	onclose(reason, description) {
		var _a;
		this.cleanup();
		(_a = this.engine) === null || _a === void 0 ? void 0 : _a.close();
		this.backoff.reset();
		this._readyState = "closed";
		this.emitReserved("close", reason, description);
		if (this._reconnection && !this.skipReconnect) this.reconnect();
	}
	/**
	* Attempt a reconnection.
	*
	* @private
	*/
	reconnect() {
		if (this._reconnecting || this.skipReconnect) return this;
		const self$1 = this;
		if (this.backoff.attempts >= this._reconnectionAttempts) {
			this.backoff.reset();
			this.emitReserved("reconnect_failed");
			this._reconnecting = false;
		} else {
			const delay = this.backoff.duration();
			this._reconnecting = true;
			const timer = this.setTimeoutFn(() => {
				if (self$1.skipReconnect) return;
				this.emitReserved("reconnect_attempt", self$1.backoff.attempts);
				if (self$1.skipReconnect) return;
				self$1.open((err) => {
					if (err) {
						self$1._reconnecting = false;
						self$1.reconnect();
						this.emitReserved("reconnect_error", err);
					} else self$1.onreconnect();
				});
			}, delay);
			if (this.opts.autoUnref) timer.unref();
			this.subs.push(() => {
				this.clearTimeoutFn(timer);
			});
		}
	}
	/**
	* Called upon successful reconnect.
	*
	* @private
	*/
	onreconnect() {
		const attempt = this.backoff.attempts;
		this._reconnecting = false;
		this.backoff.reset();
		this.emitReserved("reconnect", attempt);
	}
};

//#endregion
//#region node_modules/.pnpm/socket.io-client@4.8.1/node_modules/socket.io-client/build/esm/index.js
/**
* Managers cache.
*/
const cache = {};
function lookup(uri, opts) {
	if (typeof uri === "object") {
		opts = uri;
		uri = undefined;
	}
	opts = opts || {};
	const parsed = url(uri, opts.path || "/socket.io");
	const source = parsed.source;
	const id = parsed.id;
	const path = parsed.path;
	const sameNamespace = cache[id] && path in cache[id]["nsps"];
	const newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
	let io;
	if (newConnection) io = new Manager(source, opts);
else {
		if (!cache[id]) cache[id] = new Manager(source, opts);
		io = cache[id];
	}
	if (parsed.query && !opts.query) opts.query = parsed.queryKey;
	return io.socket(parsed.path, opts);
}
Object.assign(lookup, {
	Manager,
	Socket,
	io: lookup,
	connect: lookup
});

//#endregion
//#region plugins/lastfm/listenbrainz.ts
const { store: store$2 } = shelter.plugin;
const { createEffect, createRoot } = shelter.solid;
const FETCH_SHPROX_UA_HEADER = { "X-Shprox-UA": "ShelterLastFm/0.0.0 ( https://github.com/yellowsink/shelter-plugins )" };
const listenBrainzLookupAdditional = async (basicTrack) => {
	if (!store$2.lbLookup) return;
	if (basicTrack.additional_info?.release_mbid) return;
	try {
		const metaRes = await fetch(`https://shcors.uwu.network/https://api.listenbrainz.org/1/metadata/lookup/?${new URLSearchParams({
			recording_name: basicTrack.track_name,
			artist_name: basicTrack.artist_name,
			metadata: "true",
			inc: "artist tag release"
		})}`, { headers: FETCH_SHPROX_UA_HEADER }).then((r) => r.json());
		basicTrack.additional_info = {
			...basicTrack?.additional_info,
			...metaRes
		};
	} catch (e) {
		console.error("SHELTER LASTFM: finding listenbrainz MBID for track", basicTrack, "failed, ", e);
	}
};
const listenBrainzAlbumArtLookup = async (track) => {
	let albumArtUrl;
	if (track.additional_info?.release_mbid) {
		const relArtCheck = await fetch(`https://coverartarchive.org/release/${track.additional_info?.release_mbid}/front`, {
			method: "HEAD",
			redirect: "manual"
		});
		if (relArtCheck.status !== 404) albumArtUrl = `https://aart.yellows.ink/release/${track.additional_info.release_mbid}.webp`;
else {
			const rgLookup = await fetch(`https://shcors.uwu.network/https://musicbrainz.org/ws/2/release/${track.additional_info.release_mbid}?fmt=json&inc=release-groups`, { headers: FETCH_SHPROX_UA_HEADER });
			if (rgLookup.ok) {
				const releaseJson = await rgLookup.json();
				albumArtUrl = `https://aart.yellows.ink/release-group/${releaseJson["release-group"].id}.webp`;
			}
		}
	}
	if (albumArtUrl) {
		const testRes = await fetch(albumArtUrl, { method: "HEAD" });
		if (!testRes.ok) albumArtUrl = undefined;
	}
	return albumArtUrl;
};
const cacheKeySel = (song) => `${song.track_name}|${song.artist_name}|${song.release_name}`;
const additionalMemoized = memoize_default(listenBrainzLookupAdditional, cacheKeySel);
const aartMemoized = memoize_default(listenBrainzAlbumArtLookup, cacheKeySel);
const lbResToTrack = (res, aart, playNow) => ({
	name: res.track_name,
	artist: res.artist_name,
	album: res.release_name,
	albumArt: aart,
	url: res.additional_info?.recording_mbid ? `https://musicbrainz.org/recording/${res.additional_info.recording_mbid}` : `NOURL_${res.track_name}:${res.artist_name}:${res.release_name}`,
	nowPlaying: playNow
});
const getScrobbleListenbrainz = async () => {
	const nowPlayingRes = await fetch(`https://shcors.uwu.network/https://api.listenbrainz.org/1/user/${store$2.user}/playing-now`, { headers: FETCH_SHPROX_UA_HEADER }).then((r) => r.json());
	if (!nowPlayingRes?.payload?.count) return;
	const track = nowPlayingRes.payload.listens[0].track_metadata;
	await additionalMemoized(track);
	const albumArtUrl = await aartMemoized(track);
	return lbResToTrack(track, albumArtUrl, nowPlayingRes.payload.listens[0].playing_now);
};
var LbWebsocket = class {
	#socket;
	#pendingSocket;
	#lastUsername;
	#dispose;
	handler;
	constructor(handler) {
		this.handler = handler;
		createRoot((DISPOSE) => {
			this.#dispose = DISPOSE;
			createEffect(() => {
				const nextUser = store$2.user?.toLowerCase?.();
				if (store$2.service !== "lbz") this.tearDownSocket(false);
else if (this.#lastUsername !== nextUser || !this.#socket && !this.#pendingSocket) getScrobbleListenbrainz().then(this.handler).then(() => this.#startSocket(nextUser));
			});
		});
	}
	#startSocket(nextUser) {
		if (this.#pendingSocket) this.#pendingSocket.close();
		this.#pendingSocket = lookup("https://shcors.uwu.network", {
			path: "/https://listenbrainz.org/socket.io",
			transports: ["websocket"]
		});
		this.#pendingSocket.once("connect", () => this.#onConnect(nextUser));
		this.#pendingSocket.on("playing_now", (pn) => this.#playingNowHandler(pn));
		const s = this.#pendingSocket;
		const intCode = setInterval(() => {
			if (s !== this.#pendingSocket && s !== this.#socket) return clearInterval(intCode);
			if (!s.connected) {
				s.connect();
				s.once("connect", () => s.emit("json", { user: nextUser }));
			}
		}, 1e4);
	}
	#onConnect(nextUser) {
		this.#socket?.close();
		this.#socket = this.#pendingSocket;
		this.#pendingSocket = undefined;
		this.#lastUsername = nextUser;
		this.#socket.emit("json", { user: nextUser });
	}
	async #playingNowHandler(pn) {
		const res = JSON.parse(pn);
		const playingNowObject = res?.track_metadata;
		if (!playingNowObject) return;
		await additionalMemoized(playingNowObject);
		const albumArt = await aartMemoized(playingNowObject);
		this.handler?.(lbResToTrack(playingNowObject, albumArt, res.playing_now));
	}
	tearDownSocket(dispose = true) {
		this.#socket?.close();
		this.#pendingSocket?.close();
		this.#socket = undefined;
		this.#pendingSocket = undefined;
		if (dispose) this.#dispose?.();
	}
};

//#endregion
//#region solid-js/web
var require_web = __commonJS({ "solid-js/web"(exports, module) {
	module.exports = shelter.solidWeb;
} });

//#endregion
//#region plugins/lastfm/Settings.tsx
var import_web = __toESM(require_web());
var import_web$1 = __toESM(require_web());
var import_web$2 = __toESM(require_web());
var import_web$3 = __toESM(require_web());
var import_web$4 = __toESM(require_web());
var import_web$5 = __toESM(require_web());
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<div style="display: flex"><!#><!/><!#><!/></div>`, 6);
const { store: store$1 } = shelter.plugin;
const { TextBox, SwitchItem, Header, HeaderTags, Divider, Text, LinkButton, Space, Button, ButtonColors, ButtonLooks, ButtonSizes } = shelter.ui;
const { Show } = shelter.solid;
const ServiceButton = (props) => (0, import_web$4.createComponent)(Button, {
	grow: true,
	onClick: () => store$1.service = props.service,
	get color() {
		return store$1.service === props.service ? ButtonColors.BRAND : ButtonColors.SECONDARY;
	},
	get look() {
		return ButtonLooks.OUTLINED;
	},
	get size() {
		return ButtonSizes.TINY;
	},
	get children() {
		return props.children;
	}
});
const settings = () => [
	(0, import_web$4.createComponent)(Header, {
		get tag() {
			return HeaderTags.H3;
		},
		children: "Application Name"
	}),
	(0, import_web$4.createComponent)(TextBox, {
		placeholder: DEFAULT_NAME,
		get value() {
			return store$1.appName ?? "";
		},
		onInput: (v) => store$1.appName = v
	}),
	(0, import_web$4.createComponent)(Header, {
		get tag() {
			return HeaderTags.H3;
		},
		children: "Service"
	}),
	(() => {
		const _el$ = (0, import_web$1.getNextElement)(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = (0, import_web$2.getNextMarker)(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = (0, import_web$2.getNextMarker)(_el$4.nextSibling);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(ServiceButton, {
			service: "lfm",
			children: "Last.fm"
		}), _el$3, _co$);
		(0, import_web$3.insert)(_el$, (0, import_web$4.createComponent)(ServiceButton, {
			service: "lbz",
			children: "Listenbrainz"
		}), _el$5, _co$2);
		return _el$;
	})(),
	(0, import_web$4.createComponent)(Header, {
		get tag() {
			return HeaderTags.H3;
		},
		get children() {
			return [(0, import_web$5.memo)(() => store$1.service === "lbz" ? "Listenbrainz" : "Last.fm"), " username (required)"];
		}
	}),
	(0, import_web$4.createComponent)(TextBox, {
		get value() {
			return store$1.user ?? "";
		},
		onInput: (v) => store$1.user = v
	}),
	(0, import_web$4.createComponent)(Show, {
		get when() {
			return store$1.service === "lbz";
		},
		get children() {
			return (0, import_web$4.createComponent)(SwitchItem, {
				get value() {
					return store$1.lbLookup;
				},
				onChange: (v) => store$1.lbLookup = v,
				note: "Depending on the scrobbler, Listenbrainz may not be able to return a release ID with the current track. If this happens, we can't fetch an album cover. This option will search musicbrainz for a matching release if this happens, to attempt to find a (hopefully correct) cover. If you get incorrect album art, turn this off. If you get missing album art, turn this on.",
				children: "Search Musicbrainz for missing releases"
			});
		}
	}),
	(0, import_web$4.createComponent)(Header, {
		get tag() {
			return HeaderTags.H3;
		},
		children: "Update interval (seconds)"
	}),
	(0, import_web$4.createComponent)(TextBox, {
		placeholder: DEFAULT_INTERVAL / 1e3 + "",
		get value() {
			return store$1.interval ? store$1.interval / 1e3 + "" : "";
		},
		onInput: (v) => (!v || !isNaN(parseFloat(v))) && (store$1.interval = !v ? undefined : parseFloat(v) * 1e3 || DEFAULT_INTERVAL)
	}),
	(0, import_web$4.createComponent)(Divider, {
		mt: true,
		mb: true
	}),
	(0, import_web$4.createComponent)(SwitchItem, {
		get value() {
			return store$1.stamp;
		},
		onChange: (v) => store$1.stamp = v,
		note: "Show time since song started playing",
		children: "Show time elapsed"
	}),
	(0, import_web$4.createComponent)(SwitchItem, {
		get value() {
			return store$1.ignoreSpotify;
		},
		onChange: (v) => store$1.ignoreSpotify = v,
		note: "Hide the status if Spotify is playing",
		children: "Hide when using Spotify"
	}),
	(0, import_web$4.createComponent)(SwitchItem, {
		get value() {
			return store$1.alwaysShare;
		},
		onChange: (v) => store$1.alwaysShare = v,
		note: "Share activity even if you have activities disabled",
		children: "Always show activity"
	}),
	(0, import_web$4.createComponent)(Text, { get children() {
		return [
			"Thanks to",
			(0, import_web$4.createComponent)(LinkButton, {
				href: "https://github.com/amsyarasyiq/letup/blob/main/plugins/Last.fm",
				get children() {
					return [
						(0, import_web$4.createComponent)(Space, {}),
						"Pylix's Vendetta plugin",
						(0, import_web$4.createComponent)(Space, {})
					];
				}
			}),
			"for useful implementation details and reference."
		];
	} })
];

//#endregion
//#region plugins/lastfm/index.ts
const { plugin: { store }, flux: { storesFlat, dispatcher } } = shelter;
store.stamp ??= true;
store.ignoreSpotify ??= true;
store.service ??= "lfm";
store.lbLookup ??= true;
store.alwaysShare ??= false;
const UserStore = storesFlat.UserStore;
const PresenceStore = storesFlat.PresenceStore;
const setPresence = async (name = "", activity, start) => dispatcher.dispatch({
	type: "LOCAL_ACTIVITY_UPDATE",
	activity: activity ? {
		name,
		type: 2,
		details: activity.name,
		state: activity.artist,
		application_id: DISCORD_APP_ID,
		timestamps: store.stamp ? { start } : undefined,
		assets: {
			large_image: activity.albumArt && await getAsset(activity.albumArt),
			large_text: activity.album
		}
	} : null,
	socketId: "Last.fm@shelter"
});
const getScrobbleLastfm = async () => {
	const params = new URLSearchParams({
		method: "user.getrecenttracks",
		user: store.user,
		api_key: LFM_API_KEY,
		format: "json",
		limit: "1",
		extended: "1"
	});
	const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`);
	if (!res.ok) return;
	const lastTrack = (await res.json())?.recenttracks?.track?.[0];
	if (!lastTrack) return;
	return {
		name: lastTrack.name,
		artist: lastTrack.artist.name,
		album: lastTrack.album["#text"],
		albumArt: lastTrack.image[3]["#text"],
		url: lastTrack.url,
		nowPlaying: !!lastTrack["@attr"]?.nowplaying
	};
};
const isSpotifyPlaying = () => {
	for (const activity of PresenceStore.getActivities(UserStore.getCurrentUser()?.id)) if (activity?.type === ACTIVITY_TYPE_LISTENING && activity.application_id !== DISCORD_APP_ID) return true;
	return false;
};
let lastUrl;
let startTimestamp;
const handleNewStatus = (track) => {
	if (!store.user) return setPresence();
	if (store.ignoreSpotify && isSpotifyPlaying()) return setPresence();
	if (!track?.nowPlaying) {
		startTimestamp = null;
		return setPresence();
	}
	if (track.url !== lastUrl || !startTimestamp) startTimestamp = Date.now();
	lastUrl = track.url;
	let appName = store.appName || DEFAULT_NAME;
	appName = appName.replaceAll(/{{(.+)}}/g, (_, code) => eval(`(c)=>{with(c){try{return ${code}}catch(e){return e}}}`)(track));
	return setPresence(appName, track, startTimestamp);
};
const updateStatusInterval = async () => {
	if (!store.user) return setPresence();
	if (store.ignoreSpotify && isSpotifyPlaying()) return setPresence();
	if (store.service !== "lbz") await handleNewStatus(await getScrobbleLastfm());
};
let interval;
const restartLoop = () => (interval && clearInterval(interval), interval = setInterval(updateStatusInterval, store.interval || DEFAULT_INTERVAL));
const unpatch = shelter.patcher.after("getActivities", shelter.flux.stores.LocalActivityStore, (_, res) => {
	if (!store.alwaysShare) return;
	res.filter = function(predicate) {
		if (!predicate.toString().includes("shouldShowActivity")) return Array.prototype.filter.call(this, predicate);
		return Array.prototype.filter.call(this, (event) => {
			if (event?.type === 2 && event.application_id === DISCORD_APP_ID) return true;
			return predicate(event);
		});
	};
	return res;
});
restartLoop();
const lbSocket = new LbWebsocket(handleNewStatus);
const onUnload = () => (clearInterval(interval), setPresence(), unpatch(), lbSocket.tearDownSocket());

//#endregion
exports.onUnload = onUnload
exports.settings = settings
return exports;
})({});