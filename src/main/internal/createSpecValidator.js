"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createSpecError_1 = require("./createSpecError");
function createSpecValidator(fn) {
    var validator = (function (it, path) {
        var ret = null;
        var result = fn(it, path);
        if (result && result !== true) {
            var errMsg = null, subpath = path;
            if (typeof result === 'string') {
                errMsg = result;
            }
            else if (result.shortMessage && typeof result.shortMessage === 'string') {
                errMsg = result.shortMessage;
            }
            else if (result.message && typeof result.message === 'string') {
                errMsg = result.message;
            }
            else {
                errMsg = 'Invalid value';
            }
            if (typeof result.path === 'string' && result.path.trim() !== '') {
                subpath = result.path;
            }
            ret = createSpecError_1.default(errMsg, subpath);
        }
        return ret;
    });
    validator.usingHint = function (hint) {
        return createSpecValidator(function (it, path) {
            return fn(it, path) !== null
                ? hint
                : null;
        });
    };
    return validator;
}
exports.default = createSpecValidator;
//# sourceMappingURL=createSpecValidator.js.map