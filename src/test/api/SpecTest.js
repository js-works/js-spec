"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var Spec_1 = require("../../main/api/Spec");
var data = {
    level1: {
        someShape: {
            someInteger: 42,
            someNumber: 1.23,
            someIntegers: [1, 2, 3]
        },
        someArray: [0, 1, 2, 'some string', 4],
        fourtyTwo: 42,
        minusOne: -1,
        zero: 0,
        level2: {
            someArray: [0, 1, 2, 'some string', 4],
        }
    },
    someArray: [0, 1, 2, 3, new Date, 4],
    someIntegers: [100, 200, 300]
};
mocha_1.describe('Testing Spec.arrayOf', function () {
    mocha_1.it('should work properly in success case', function () {
        var result = Spec_1.default.arrayOf(Spec_1.default.integer)(data.someIntegers);
        chai_1.expect(result)
            .to.eql(null);
    });
    mocha_1.it('should work properly in error case', function () {
        var paths = [null, 'some.path'];
        paths.forEach(function (path) {
            var result = Spec_1.default.arrayOf(Spec_1.default.integer)(data.level1.someArray, path);
            chai_1.expect(result)
                .to.not.eql(null);
            chai_1.expect(result.path)
                .to.eql(path === null ? null : path + '.3');
        });
    });
});
mocha_1.describe('Testing Spec.or', function () {
    mocha_1.it('should work properly in success case', function () {
        var result = Spec_1.default.arrayOf(Spec_1.default.or(Spec_1.default.integer, Spec_1.default.string))(data.someArray, 'someArray');
        chai_1.expect(result)
            .to.eql(null);
    });
    mocha_1.it('should work properly in error case', function () {
    });
});
//# sourceMappingURL=SpecTest.js.map