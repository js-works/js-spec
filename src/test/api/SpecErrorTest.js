"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var SpecError_1 = require("../../main/api/SpecError");
mocha_1.describe('Testing SpecError construction and reading properties', function () {
    var longMessage = 'long message', shortMessage = 'short message', path = 'some.test.path', specError = new SpecError_1.default(longMessage, shortMessage, path);
    mocha_1.it('should read long message properly', function () {
        chai_1.expect(specError.message)
            .to.eql(longMessage);
    });
    mocha_1.it('should read short message properly', function () {
        chai_1.expect(specError.shortMessage)
            .to.eql(shortMessage);
    });
    mocha_1.it('should read path properly', function () {
        chai_1.expect(specError.path)
            .to.eql(path);
    });
});
//# sourceMappingURL=SpecErrorTest.js.map