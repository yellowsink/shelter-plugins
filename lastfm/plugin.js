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

//#region plugins/lastfm/cfg.ts
const DEFAULT_NAME = "{{name}}";
const DEFAULT_INTERVAL = 5e3;
const DISCORD_APP_ID = "1107251687984472144";
const LFM_API_KEY = "311958e99f6ee58518756f83720db787";
const ACTIVITY_TYPE_LISTENING = 2;

//#endregion
//#region plugins/lastfm/assets.ts
const { post } = shelter.http;
const cache = new Map();
async function getAsset(url) {
	if (cache.has(url)) return cache.get(url);
	const res = await post({
		url: `/applications/${DISCORD_APP_ID}/external-assets`,
		body: { urls: [url] },
		oldFormErrors: false
	});
	if (res.ok) {
		const path = "mp:" + res.body[0].external_asset_path;
		cache.set(url, path);
		return path;
	}
	cache.set(url, undefined);
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
function getRawTag(value) {
	var isOwn = hasOwnProperty$3.call(value, symToStringTag$1), tag = value[symToStringTag$1];
	try {
		value[symToStringTag$1] = undefined;
		var unmasked = true;
	} catch (e) {}
	var result = nativeObjectToString$1.call(value);
	if (unmasked) if (isOwn) value[symToStringTag$1] = tag;
else delete value[symToStringTag$1];
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
function objectToString(value) {
	return nativeObjectToString.call(value);
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
function baseGetTag(value) {
	if (value == null) return value === undefined ? undefinedTag : nullTag;
	return symToStringTag && symToStringTag in Object(value) ? _getRawTag_default(value) : _objectToString_default(value);
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
function isObject(value) {
	var type = typeof value;
	return value != null && (type == "object" || type == "function");
}
var isObject_default = isObject;

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
function isFunction(value) {
	if (!isObject_default(value)) return false;
	var tag = _baseGetTag_default(value);
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
function baseIsNative(value) {
	if (!isObject_default(value) || _isMasked_default(value)) return false;
	var pattern = isFunction_default(value) ? reIsNative : reIsHostCtor;
	return pattern.test(_toSource_default(value));
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
	var value = _getValue_default(object, key);
	return _baseIsNative_default(value) ? value : undefined;
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
function hashSet(key, value) {
	var data = this.__data__;
	this.size += this.has(key) ? 0 : 1;
	data[key] = _nativeCreate_default && value === undefined ? HASH_UNDEFINED : value;
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
function eq(value, other) {
	return value === other || value !== value && other !== other;
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
function listCacheSet(key, value) {
	var data = this.__data__, index = _assocIndexOf_default(data, key);
	if (index < 0) {
		++this.size;
		data.push([key, value]);
	} else data[index][1] = value;
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
function isKeyable(value) {
	var type = typeof value;
	return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
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
function mapCacheSet(key, value) {
	var data = _getMapData_default(this, key), size = data.size;
	data.set(key, value);
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
		var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache$1 = memoized.cache;
		if (cache$1.has(key)) return cache$1.get(key);
		var result = func.apply(this, args);
		memoized.cache = cache$1.set(key, result) || cache$1;
		return result;
	};
	memoized.cache = new (memoize.Cache || _MapCache_default)();
	return memoized;
}
memoize.Cache = _MapCache_default;
var memoize_default = memoize;

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
	const getFn = store.service === "lbz" ? getScrobbleListenbrainz : getScrobbleLastfm;
	await handleNewStatus(await getFn());
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
const onUnload = () => (clearInterval(interval), setPresence(), unpatch());

//#endregion
exports.onUnload = onUnload
exports.settings = settings
return exports;
})({});