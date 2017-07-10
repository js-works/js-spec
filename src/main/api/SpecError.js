"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpecError = (function () {
    function SpecError(message, shortMessage, path) {
        if (shortMessage === void 0) { shortMessage = null; }
        if (path === void 0) { path = null; }
        this.message = message;
        this.shortMessage = shortMessage;
        this.path = path;
        Object.freeze(this);
    }
    SpecError.prototype.toString = function () {
        return 'SpecError: '
            + this.message
            + (this.path ? "(path: " + this.path + ")" : '');
    };
    return SpecError;
}());
exports.default = SpecError;
//# sourceMappingURL=SpecError.js.map