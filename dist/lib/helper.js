"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toStr = Object.prototype.toString;
var TO_STRING_REG = /\[object\s(\w+)\]/;
var TO_STRING_MEMORIZE_MAP = {};
function getType(value) {
    var typeKey = toStr.call(value);
    var type = TO_STRING_MEMORIZE_MAP[typeKey];
    if (!type) {
        var match = typeKey.match(TO_STRING_REG);
        type = match && match[1] ? match[1].toLowerCase() : '';
        if (type) {
            TO_STRING_MEMORIZE_MAP[typeKey] = type;
        }
    }
    return type;
}
exports.getType = getType;
function isObject(value) {
    return getType(value) === 'object';
}
exports.isObject = isObject;
function isArray(value) {
    return getType(value) === 'array';
}
exports.isArray = isArray;
var NATURAL_NUM_REG = /^(?:0|[1-9]\d*)$/;
function isIndex(value) {
    return typeof value === 'string'
        ? NATURAL_NUM_REG.test(value)
        : value >= 0 && value % 1 === 0;
}
exports.isIndex = isIndex;
function caskPath(path) {
    if (typeof path === 'string') {
        return path
            .replace(/\[/g, '.')
            .replace(/\]/g, '')
            .split('.');
    }
    return path;
}
exports.caskPath = caskPath;
function get(source, path, defaultValue) {
    var paths = caskPath(path);
    var length = paths.length;
    var index = 0;
    while (source != null && index < length) {
        source = source[paths[index++]];
    }
    return source === undefined || index === 0 ? defaultValue : source;
}
exports.get = get;
function merge(target, source) {
    var value, mergeValue;
    for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
            value = target[prop];
            mergeValue = source[prop];
            if (isObject(mergeValue) && isObject(value)) {
                target[prop] = merge(value, mergeValue);
            }
            else {
                target[prop] = mergeValue;
            }
        }
    }
    return target;
}
exports.merge = merge;
function compose(funcs) {
    if (funcs.length === 0) {
        return function (arg) { return arg; };
    }
    if (funcs.length === 1) {
        return funcs[0];
    }
    return funcs.reduce(function (a, b) { return function (arg) { return a(b(arg)); }; });
}
exports.compose = compose;
