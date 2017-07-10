"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpecError_1 = require("../api/SpecError");
function createSpecError(errMsg, path) {
    var fullErrMsg = 'Constraint violation'
        + (path ? " at '" + path + "'" : '')
        + (": " + errMsg);
    return new SpecError_1.default(fullErrMsg, errMsg, path);
}
exports.default = createSpecError;
//# sourceMappingURL=createSpecError.js.map