"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createSpecError_1 = require("../internal/createSpecError");
var createSpecValidator_1 = require("../internal/createSpecValidator");
var Spec = (function () {
    function Spec() {
        throw new Error('[Spec.constructor] Class Spec is not instantiable');
    }
    Object.defineProperty(Spec, "boolean", {
        get: function () {
            return cache.boolean || (cache.boolean = createSpecValidator_1.default(function (it) { return it === true || it === false
                ? null
                : 'Must be boolean'; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spec, "number", {
        get: function () {
            return cache.number || (cache.number = createSpecValidator_1.default(function (it) { return typeof it === 'number'
                ? null
                : 'Must be a number'; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spec, "string", {
        get: function () {
            return cache.string || (cache.srring = createSpecValidator_1.default(function (it) { return typeof it === 'string'
                ? null
                : 'Must be a string'; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spec, "object", {
        get: function () {
            return cache.object || (cache.object = createSpecValidator_1.default(function (it) { return it !== null && typeof it === 'object'
                ? null
                : 'Must be an object'; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spec, "array", {
        get: function () {
            return cache.array || (cache.array = createSpecValidator_1.default(function (it) { return Array.isArray(it)
                ? null
                : 'Must be an array'; }));
        },
        enumerable: true,
        configurable: true
    });
    Spec.arrayOf = function (constraint) {
        return createSpecValidator_1.default(function (it, path) {
            if (path === void 0) { path = null; }
            var ret = Spec.array(it, path);
            if (ret === null) {
                for (var i = 0; i < it.length; ++i) {
                    var subPath = _buildSubPath(path, String(i)), result = constraint(it[i], subPath);
                    if (result) {
                        ret = result;
                        break;
                    }
                }
            }
            return ret;
        });
    };
    Object.defineProperty(Spec, "func", {
        get: function () {
            return cache.func || (cache.func = createSpecValidator_1.default(function (it) { return typeof it === 'function'
                ? null
                : 'Must be a function'; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spec, "integer", {
        get: function () {
            return cache.func || (cache.func = createSpecValidator_1.default(function (it) { return Number.isSafeInteger(it)
                ? null
                : 'Must be an integer'; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spec, "positiveInteger", {
        get: function () {
            return cache.positiveInteger ||
                (cache.positiveInteger = createSpecValidator_1.default(function (it) { return Number.isSafeInteger(it) && it > 0
                    ? null
                    : 'Must be a positive integer'; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spec, "negativeInteger", {
        get: function () {
            return cache.negativeInteger ||
                (cache.negativeInteger = createSpecValidator_1.default(function (it) { return Number.isSafeInteger(it) && it < 0
                    ? null
                    : 'Must be a negative integer'; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spec, "nonNegativeInteger", {
        get: function () {
            return cache.nonNegativeInteger ||
                (cache.nonNegativeInteger = createSpecValidator_1.default(function (it) { return Number.isSafeInteger(it) && it >= 0
                    ? null
                    : 'Must be a non-negative integer'; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spec, "nonPositiveInteger", {
        get: function () {
            return cache.nonPositiveInteger ||
                (cache.nonPositiveInteger = createSpecValidator_1.default(function (it) { return Number.isSafeInteger(it) && it <= 0
                    ? null
                    : 'Must be a non-positive integer'; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spec, "something", {
        get: function () {
            return cache.something || (cache.something = createSpecValidator_1.default(function (it) { return it !== undefined && it !== null
                ? null
                : 'Must not be undefined or null'; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spec, "nothing", {
        get: function () {
            return cache.nothing || (cache.nothing = createSpecValidator_1.default(function (it) { return it === undefined && it === null
                ? null
                : 'Must be undefined or null'; }));
        },
        enumerable: true,
        configurable: true
    });
    Spec.optional = function (constraint) {
        return createSpecValidator_1.default(function (it, path) { return it === undefined
            ? null
            : constraint(it, path); });
    };
    Spec.nullable = function (constraint) {
        return createSpecValidator_1.default(function (it, path) { return it === null
            ? null
            : constraint(it, path); });
    };
    Spec.orNothing = function (constraint) {
        return createSpecValidator_1.default(function (it, path) {
            return it === undefined || it === null
                ? null
                : constraint(it, path);
        });
    };
    Spec.oneOf = function (items) {
        return createSpecValidator_1.default(function (it) {
            return !items.every(function (item) { return item !== it; })
                ? null
                : 'Must be one of: ' + items.join(', ');
        });
    };
    Spec.match = function (regex) {
        return createSpecValidator_1.default(function (it) {
            var ret = null;
            if (typeof it !== 'string') {
                ret = 'Must be a string';
            }
            else if (!it.match(regex)) {
                ret = 'Must match regex ' + regex;
            }
            return ret;
        });
    };
    Spec.valid = function (condition) {
        return createSpecValidator_1.default(function (it, path) {
            if (path === void 0) { path = null; }
            return condition(it)
                ? null
                : 'Invalid value';
        });
    };
    Spec.instanceOf = function (type) {
        if (typeof type !== 'function') {
            throw new Error("[Spec.instanceOf] First paramter 'type' must be a function");
        }
        return createSpecValidator_1.default(function (it, path) {
            if (path === void 0) { path = null; }
            return it instanceof type
                ? null
                : 'Must be instance of ' + type.name;
        });
    };
    Spec.is = function (value) {
        return createSpecValidator_1.default(function (it) { return it === value
            ? null
            : 'Must be identical to ' + value; });
    };
    Spec.isNot = function (value) {
        return createSpecValidator_1.default(function (it) { return it !== value
            ? null
            : 'Must not be identical to ' + value; });
    };
    Spec.equal = function (value) {
        return createSpecValidator_1.default(function (it) { return it == value
            ? null
            : 'Must be equal to ' + value; });
    };
    Spec.notEqual = function (value) {
        return createSpecValidator_1.default(function (it) { return it != value
            ? null
            : 'Must not be equal to ' + value; });
    };
    Spec.size = function (constraint) {
        return createSpecValidator_1.default(function (it, path) {
            var ret = null;
            if (!it || typeof it !== 'object') {
                ret = 'Must be an object';
            }
            else {
                var propName = it.length !== undefined ? 'length' : 'size', size = it[propName];
                if (!Number.isSafeInteger(size) || size <= 0) {
                    ret = "Must have a adequate '" + propName + "' property";
                }
                else {
                    ret = constraint(it, _buildSubPath(path, propName));
                }
            }
            return ret;
        });
    };
    Spec.greater = function (value) {
        return createSpecValidator_1.default(function (it) { return it > value
            ? null
            : 'Must be greater than ' + value; });
    };
    Spec.greaterOrEqual = function (value) {
        return createSpecValidator_1.default(function (it) { return it >= value
            ? null
            : 'Must be greater or equal ' + value; });
    };
    Spec.less = function (value) {
        return createSpecValidator_1.default(function (it) { return it < value
            ? null
            : 'Must be less than ' + value; });
    };
    Spec.lessOrEqual = function (value) {
        return createSpecValidator_1.default(function (it) { return it <= value
            ? null
            : 'Must be less or equal ' + value; });
    };
    Spec.between = function (left, right) {
        return createSpecValidator_1.default(function (it) { return it >= left && it <= right
            ? null
            : "Must be between " + left + " and " + right; });
    };
    Object.defineProperty(Spec, "iterable", {
        get: function () {
            return createSpecValidator_1.default(function (it) { return it && typeof it === 'object'
                && typeof it[Symbol.iterator] === 'function'
                ? null
                : "Must be iterable"; });
        },
        enumerable: true,
        configurable: true
    });
    Spec.keys = function (constraint) {
        return createSpecValidator_1.default(function (it, path) {
            var ret = null;
            if (it === null || typeof it !== 'object') {
                ret = 'Must be an object';
            }
            else {
                for (var _i = 0, _a = Object.keys(it); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var error = constraint(key);
                    if (error) {
                        ret = "Key '" + key + "' is invalid: " + error.shortMessage;
                        break;
                    }
                }
            }
            return ret;
        });
    };
    Spec.values = function (constraint) {
        return createSpecValidator_1.default(function (it, path) {
            var ret = null;
            if (it === null || typeof it !== 'object') {
                ret = 'Must be an object';
            }
            else {
                for (var _i = 0, _a = Object.keys(it); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var value = it[key], subPath = _buildSubPath(path, key);
                    var result = constraint(value, subPath);
                    if (result) {
                        ret = result;
                        break;
                    }
                }
            }
            return ret;
        });
    };
    Object.defineProperty(Spec, "unique", {
        get: function () {
            return cache.unique || (cache.unique =
                createSpecValidator_1.default(function (it, path) {
                    var ret = Spec.iterable(it, path);
                    if (ret === null) {
                        var itemCount = 0;
                        if (Array.isArray(it)) {
                            itemCount = it.length;
                        }
                        else {
                            for (var _i = 0, it_1 = it; _i < it_1.length; _i++) {
                                var item = it_1[_i];
                                ++itemCount;
                            }
                        }
                        if (itemCount > new Set(it).size) {
                            ret = 'Must be unique';
                        }
                    }
                    return ret;
                }));
        },
        enumerable: true,
        configurable: true
    });
    Spec.shape = function (shape) {
        return createSpecValidator_1.default(function (it, path) {
            var ret = null;
            if (it === null || typeof it !== 'object') {
                ret = 'Must be an object';
            }
            else {
                for (var _i = 0, _a = Object.keys(shape); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var subPath = _buildSubPath(path, key);
                    ret = shape[key](it[key], subPath);
                    if (ret) {
                        break;
                    }
                }
            }
            return ret;
        });
    };
    Spec.statics = function (shape) {
        return createSpecValidator_1.default(function (it, path) {
            var ret = null;
            if (it === null || typeof it !== 'function') {
                ret = 'Must be an constructor function';
            }
            else {
                for (var _i = 0, _a = Object.keys(shape); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var subPath = _buildSubPath(path, key);
                    ret = shape[key](it[key], subPath);
                    if (ret) {
                        break;
                    }
                }
            }
            return ret;
        });
    };
    Object.defineProperty(Spec, "any", {
        get: function () {
            return cache.any || (cache.any = createSpecValidator_1.default(function () { return null; }));
        },
        enumerable: true,
        configurable: true
    });
    Spec.and = function () {
        var constraints = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            constraints[_i] = arguments[_i];
        }
        return createSpecValidator_1.default(function (it, path) {
            if (path === void 0) { path = null; }
            var ret = null;
            for (var _i = 0, constraints_1 = constraints; _i < constraints_1.length; _i++) {
                var constraint = constraints_1[_i];
                var error = _checkConstraint(constraint, it, path);
                if (error) {
                    ret = error;
                    break;
                }
            }
            return ret;
        });
    };
    Spec.or = function () {
        var constraints = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            constraints[_i] = arguments[_i];
        }
        return createSpecValidator_1.default(function (it) { return !constraints.every(function (constraint) {
            return !!_checkConstraint(constraint, it, null);
        })
            ? null
            : 'Invalid value'; });
    };
    Spec.in = function (collection) {
        return createSpecValidator_1.default(function (it, path) {
            var ret = null;
            if (collection instanceof Set) {
                if (!collection.has(it)) {
                    ret = 'Invalid value', path;
                }
            }
            else if (collection
                && typeof collection[Symbol.iterator] === 'function') {
                var found = false;
                for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
                    var item = collection_1[_i];
                    if (item === it) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    ret = 'Invalid value';
                }
            }
            return ret;
        });
    };
    Spec.notIn = function (collection) {
        return createSpecValidator_1.default(function (it, path) {
            var ret = null;
            if (collection instanceof Set) {
                if (collection.has(it)) {
                    ret = 'Invalid value';
                }
            }
            else if (collection
                && typeof collection[Symbol.iterator] === 'function') {
                var found = false;
                for (var _i = 0, collection_2 = collection; _i < collection_2.length; _i++) {
                    var item = collection_2[_i];
                    if (item === it) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    ret = 'Invalid value';
                }
            }
            return ret;
        });
    };
    return Spec;
}());
exports.default = Spec;
;
Object.freeze(Spec);
function _buildSubPath(path, key) {
    var ret = null;
    if (path === '') {
        ret = key;
    }
    else if (path) {
        ret = !path ? key : path + "." + key;
    }
    return ret;
}
function _checkConstraint(constraint, it, path) {
    if (path === void 0) { path = null; }
    var result = constraint(it, path);
    return result === false
        ? createSpecError_1.default('Invalid value', path)
        : (!result ? null : createSpecError_1.default(result, path));
}
var cache = {};
//# sourceMappingURL=Spec.js.map