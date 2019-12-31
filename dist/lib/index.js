"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var messages_1 = require("./messages");
var patterns_1 = require("./patterns");
var helper_1 = require("./helper");
var hasProp = Object.prototype.hasOwnProperty;
function sprintf() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var template = args[0];
    var index = 0;
    return template.replace(/%s/g, function () { return args[++index]; });
}
var RULES = {
    required: function (value, callback, options, rule) {
        var fullField = options.fullField, label = options.label;
        if (rule.required &&
            (value === '' ||
                typeof value === 'undefined' ||
                (helper_1.isArray(value) && value.length === 0))) {
            return callback({
                field: fullField,
                message: rule.message || sprintf(messages_1.default.required, label || fullField),
            });
        }
        return callback();
    },
    whitespace: function (value, callback, options, rule) {
        var fullField = options.fullField, label = options.label;
        if (/^\s+$/.test(value) || value === '') {
            return callback({
                field: fullField,
                message: rule.message || sprintf(messages_1.default.whitespace, label || fullField),
            });
        }
        return callback();
    },
    enum: function (value, callback, options, rule) {
        var fullField = options.fullField, label = options.label;
        var enumItems = helper_1.isArray(rule.enum) ? rule.enum : [];
        if (enumItems.indexOf(value) === -1) {
            return callback({
                field: fullField,
                message: rule.message ||
                    sprintf(messages_1.default.enum, label || fullField, (rule.enum || []).join(',')),
            });
        }
        return callback();
    },
    equal: function (value, callback, options, rule) {
        var fullField = options.fullField, label = options.label;
        if (value !== rule.equal) {
            return callback({
                field: fullField,
                message: rule.message ||
                    sprintf(messages_1.default.equal, label || fullField, rule.equal),
            });
        }
        return callback();
    },
    equalTo: function (value, callback, options, rule, source) {
        var fullField = options.fullField, label = options.label;
        if (value !== helper_1.get(source, rule.equalTo)) {
            return callback({
                field: fullField,
                message: rule.message ||
                    sprintf(messages_1.default.equalTo, label || fullField, rule.equalTo),
            });
        }
        return callback();
    },
    pattern: function (value, callback, options, rule) {
        var pattern = rule.pattern;
        var fullField = options.fullField, label = options.label;
        if (pattern instanceof RegExp) {
            pattern.lastIndex = 0;
            if (!pattern.test(value)) {
                return callback({
                    field: fullField,
                    message: rule.message || sprintf(messages_1.default.pattern, label || fullField),
                });
            }
        }
        return callback();
    },
    range: function (value, callback, options, rule) {
        var _a = rule, min = _a.min, max = _a.max;
        var range = rule.range, len = rule.len;
        var fullField = options.fullField, label = options.label;
        var valueType = typeof value;
        var NUMBER_TYPE = 'number';
        var key;
        var val;
        if (valueType === 'string') {
            key = 'string';
            val = value.length;
        }
        else if (valueType === NUMBER_TYPE) {
            key = NUMBER_TYPE;
            val = value;
        }
        else if (helper_1.isArray(value)) {
            key = 'array';
            val = value.length;
        }
        if (!key || typeof val !== NUMBER_TYPE) {
            return callback();
        }
        if (helper_1.isArray(range) && range[0] < range[1]) {
            min = range[0];
            max = range[1];
        }
        var hasMin = typeof min === NUMBER_TYPE;
        var hasMax = typeof max === NUMBER_TYPE;
        var hasLen = typeof len === NUMBER_TYPE;
        if (hasLen) {
            if (val !== len) {
                return callback({
                    field: fullField,
                    message: rule.message || sprintf(messages_1.default[key].len, label || fullField, len),
                });
            }
        }
        else if (hasMin && hasMax) {
            if (val > max || val < min) {
                return callback({
                    field: fullField,
                    message: rule.message ||
                        sprintf(messages_1.default[key].range, label || fullField, min, max),
                });
            }
        }
        else if (hasMin) {
            if (val < min) {
                return callback({
                    field: fullField,
                    message: rule.message || sprintf(messages_1.default[key].min, label || fullField, min),
                });
            }
        }
        else if (hasMax) {
            if (val > max) {
                return callback({
                    field: fullField,
                    message: rule.message || sprintf(messages_1.default[key].max, label || fullField, max),
                });
            }
        }
        return callback();
    },
    type: function (value, callback, options, rule) {
        var type = rule.type;
        var fullField = options.fullField, label = options.label;
        var pattern = patterns_1.default[type];
        if (pattern instanceof RegExp) {
            pattern.lastIndex = 0;
            if (!pattern.test(value)) {
                return callback({
                    field: fullField,
                    message: rule.message || sprintf(messages_1.default.type[type], label || fullField),
                });
            }
            return callback();
        }
        var valueType = helper_1.getType(value);
        var isNum = valueType === 'number';
        if (type === 'integer') {
            if (!isNum || parseInt(value, 10) !== value) {
                return callback({
                    field: fullField,
                    message: rule.message || sprintf(messages_1.default.type.integer, label || fullField),
                });
            }
        }
        else if (type === 'float') {
            if (!isNum || parseInt(value, 10) === value) {
                return callback({
                    field: fullField,
                    message: rule.message || sprintf(messages_1.default.type.float, label || fullField),
                });
            }
        }
        else if (valueType !== type) {
            return callback({
                field: fullField,
                message: rule.message || sprintf(messages_1.default.type[type], label || fullField),
            });
        }
        return callback();
    },
};
var Xvalidator = /** @class */ (function () {
    function Xvalidator(descriptor) {
        this.descriptor = {};
        this.descriptor = descriptor;
    }
    Xvalidator.prototype.getValidateMethod = function (rule, ruleType) {
        var validateMethod = rule.validator || RULES[ruleType];
        if (ruleType === 'len' || ruleType === 'min' || ruleType === 'max') {
            validateMethod = RULES.range;
        }
        return validateMethod;
    };
    Xvalidator.prototype.tranverseValidate = function (target, descriptor, paths, options, middlewares, validateCallback, source) {
        var _loop_1 = function (key) {
            var descriptorItem = descriptor[key];
            var sourceItem = target && target[key];
            var own = target && hasProp.call(target, key);
            var deep = helper_1.isObject(sourceItem) ||
                helper_1.isArray(sourceItem) ||
                (descriptorItem &&
                    descriptorItem.fields &&
                    (descriptorItem.type === 'array' ||
                        descriptorItem.type === 'object'));
            var nextPaths = paths.concat(helper_1.isIndex(key) ? "[" + key + "]" : key);
            var fullField = nextPaths.join('.').replace(/\.\[/g, '[');
            var rules = helper_1.isArray(descriptorItem)
                ? descriptorItem
                : [descriptorItem];
            var ruleLen = rules.length;
            var _loop_2 = function (i) {
                var _a = rules[i], fields = _a.fields, label = _a.label, defaultField = _a.defaultField, rule = __rest(_a, ["fields", "label", "defaultField"]);
                var ruleKeys = Object.keys(rule);
                var ruleKeysLen = ruleKeys.length;
                if (deep && (fields || defaultField)) {
                    if (fields) {
                        this_1.tranverseValidate(sourceItem, fields, nextPaths, options, middlewares, validateCallback, source);
                    }
                    else if (defaultField) {
                        var defaultFields = {};
                        for (var k in sourceItem) {
                            defaultFields[k] = defaultField;
                        }
                        this_1.tranverseValidate(sourceItem, defaultFields, nextPaths, options, middlewares, validateCallback, source);
                    }
                }
                else if ((own || rule.required) && ruleKeysLen > 0) {
                    var _loop_3 = function (j) {
                        var ruleType = ruleKeys[j];
                        var validateMethod = this_1.getValidateMethod(rule, ruleKeys[j]);
                        if (validateMethod) {
                            middlewares.push(function (next) { return function (errors) {
                                var len = errors.length;
                                if (options.first &&
                                    len > 0 &&
                                    errors[len - 1].field === fullField) {
                                    return next(errors);
                                }
                                if (rule.trigger &&
                                    !options.force &&
                                    options.trigger !== rule.trigger) {
                                    return next(errors);
                                }
                                validateMethod(sourceItem, function (error) {
                                    if (error) {
                                        error.ruleType = ruleType;
                                        errors.push(error);
                                        if (options.firstField === true ||
                                            options.firstField === fullField) {
                                            validateCallback(errors);
                                            return;
                                        }
                                    }
                                    next(errors);
                                }, { field: key, fullField: fullField, label: label }, rule, source);
                            }; });
                        }
                    };
                    for (var j = 0; j < ruleKeysLen; j++) {
                        _loop_3(j);
                    }
                }
            };
            for (var i = 0; i < ruleLen; i++) {
                _loop_2(i);
            }
        };
        var this_1 = this;
        for (var key in descriptor) {
            _loop_1(key);
        }
    };
    Xvalidator.prototype.validate = function (target, options, callback, source) {
        var _a, _b;
        if (options === void 0) { options = {}; }
        var _c = options.fullField, fullField = _c === void 0 ? '' : _c, _d = options.firstField, firstField = _d === void 0 ? false : _d, _e = options.first, first = _e === void 0 ? true : _e, _f = options.trigger, trigger = _f === void 0 ? '' : _f, _g = options.force, force = _g === void 0 ? true : _g;
        var descriptor = this.descriptor;
        if (fullField) {
            var descriptorItem = helper_1.get(descriptor, fullField
                .replace(/\[/g, '.')
                .replace(/\]/g, '')
                .split('.')
                .join('.fields.'));
            if (!descriptorItem) {
                return callback([]);
            }
            descriptor = (_a = {},
                _a[fullField] = descriptorItem,
                _a);
            target = (_b = {}, _b[fullField] = target, _b);
        }
        var validateCallback = function (errors) {
            callback(errors);
        };
        var middlewares = [];
        this.tranverseValidate(target, descriptor, [], { fullField: fullField, firstField: firstField, first: first, trigger: trigger, force: force }, middlewares, validateCallback, source);
        var dispatch = helper_1.compose(middlewares)(validateCallback);
        dispatch([]);
    };
    return Xvalidator;
}());
exports.default = Xvalidator;
