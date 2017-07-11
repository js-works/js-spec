//import { describe, it } from 'mocha';
import { expect } from 'chai';

import Spec from '../../main/api/Spec';
import SpecError from '../../main/api/SpecError';

const validateSimpleSpecTestConfig = Spec.shape({
    spec: Spec.valid(it => typeof it === 'function'
        && typeof it.usingHint === 'function'),

    validValues: Spec.array,
    invalidValues: Spec.array
});

const data = {
    level1: {
        someShape: {
            someInteger: 42,
            someNumber: 1.23,
            someIntegers: [1, 2, 3]
        },
        someArray: [0, 1, 2, 'some string', 4],
        level2: {
            someArray: [0, 1, 2, 'some string', 4],
        }
    },

    true: true,
    fourtyTwo: 42,
    twelveDotThree: 12.3,
    minusOne: -1,
    zero: 0,
    text: 'text',
    arrayOfIntegersAndDates: [0, 1, 2, 3, new Date, 4], 
    arrayOfIntegers: [100, 200, 300]
}

describe('Spec.boolean', () => {
    runSimpleSpecTest({
        spec: Spec.boolean,
        validValues: [true, false],
        invalidValues: [undefined, null, 42, 'some text']
    });
});

describe('Spec.number', () => {
    runSimpleSpecTest({
        spec: Spec.number,
        validValues: [0, 1, -1, 42, -42, 12.34, -12.34],
        
        invalidValues: [undefined, null, true, false, {}, '0', Infinity, -Infinity]
    });
});

describe('Spec.positiveNumber', () => {
    runSimpleSpecTest({
        spec: Spec.positiveNumber,
        validValues: [1, 2, 3, 42],
        invalidValues: [undefined, null, true, false, {}, '0', 0, -1, Infinity, '1']
    });
});

describe('Spec.nonPositiveNumber', () => {
    runSimpleSpecTest({
        spec: Spec.nonPositiveNumber,
        validValues: [0, -1, -2, -12.34],
        invalidValues: [undefined, null, true, false, {}, '0', 2, 3, '-1', -Infinity]
    });
});

describe('Spec.negativeNumber', () => {
    runSimpleSpecTest({
        spec: Spec.negativeNumber,
        validValues: [-1, -12.34, -42],
        invalidValues: [undefined, null, true, false, {}, 1, 2, 1.2, '-1', -Infinity]
    });
});

describe('Spec.nonNegativeNumber', () => {
    runSimpleSpecTest({
        spec: Spec.nonNegativeNumber,
        validValues: [0, 1, 2, 12.34, 42],
        invalidValues: [undefined, null, true, false, {}, -1, -12.34, '1', Infinity]
    });
});

describe('Spec.integer', () => {
    runSimpleSpecTest({
        spec: Spec.integer,
        validValues: [0, 1, -1, 42, -42],
        invalidValues: [undefined, null, true, false, {}, 1.1, '1', Infinity]
    });
});

describe('Spec.positiveInteger', () => {
    runSimpleSpecTest({
        spec: Spec.positiveInteger,
        validValues: [1, 2, 3, 42],
        invalidValues: [undefined, null, true, false, {}, 0, -1, '1', Infinity]
    });
});

describe('Spec.nonPositiveInteger', () => {
    runSimpleSpecTest({
        spec: Spec.nonPositiveInteger,
        validValues: [0, -1, -2, -42],
        invalidValues: [undefined, null, true, false, {}, 1, 2, -1.23, '-1', -Infinity]
    });
});

describe('Spec.negativeInteger', () => {
    runSimpleSpecTest({
        spec: Spec.negativeInteger,
        validValues: [-1, -2, -42],
        invalidValues: [undefined, null, true, false, {}, 0, 1, 2, -1.23, '-1', -Infinity]
    });
});

describe('Spec.nonNegativeInteger', () => {
    runSimpleSpecTest({
        spec: Spec.nonNegativeInteger,
        validValues: [0, 1, 2, 42],
        invalidValues: [undefined, null, true, false, {}, -1, -2, 1.23, '1', Infinity]
    });
});

describe('Spec.finite', () => {
    runSimpleSpecTest({
        spec: Spec.finite,
        validValues: [1, -1, 2, -2, 3, '1', '-1', '2', '-2', true, false, null, [], [1]],
        invalidValues: [undefined, Infinity, -Infinity, {}]
    });
});

describe('Spec.infinite', () => {
    runSimpleSpecTest({
        spec: Spec.infinite,
        validValues: [undefined, Infinity, -Infinity, {}]
        invalidValues: [1, -1, 2, -2, 3, '1', '-1', '2', '-2', true, false, null, [], [1]],
    });
});

describe('Spec.string', () => {
    runSimpleSpecTest({
        spec: Spec.string,
        validValues: ['', 'some text'],
        invalidValues: [undefined, null, true, false, 0, 1, -1, 1,23, -1.23, {}, []]
    });
});

describe('Spec.func', () => {
    runSimpleSpecTest({
        spec: Spec.func,
        validValues: [() => {}, Object, Array, Date],
        invalidValues: [undefined, null, true, false, 0, 1, -1, "", {}, []]
    });
});

describe('Spec.object', () => {
    runSimpleSpecTest({
        spec: Spec.object,
        validValues: [{}, [], new Date],
        invalidValues: [undefined, null, true, false, 0, 1, -1, ""]
    });
});

describe('Spec.array', () => {
    runSimpleSpecTest({
        spec: Spec.array,
        validValues: [[], [0], [1, 2, 3], new Array],
        invalidValues: [undefined, null, true, false, 0, 1, -1, {}]
    });
});

describe('Spec.iterable', () => {
    runSimpleSpecTest({
        spec: Spec.iterable,
        validValues: ["123", [1, 2, 3], new Set()],
        invalidValues: [undefined, null, true, false, 0, 1, -1, {}]
    });
});

describe('Spec.unique', () => {
    runSimpleSpecTest({
        spec: Spec.unique,
        validValues: [[], [1, 2, 3]],
        invalidValues: [undefined, null, true, false, 0, 1, -1, {}, [1, 2, 1]]
    });
});

describe('Spec.date', () => {
    runSimpleSpecTest({
        spec: Spec.date,
        validValues: [new Date()],
        invalidValues: [undefined, null, true, false, 0, 1, -1, {}, '1989-11-09']
    });
});

/*
    it('should work properly in success case', () => {
        const result = Spec.boolean(true);

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.boolean(42, path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path);
        });
    });
*/
});

describe('Testing Spec.number', () => {
    it('should work properly in success case', () => {
        const result = Spec.number(12.34);

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.number('some text', path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path);
        });
    });
});

describe('Testing Spec.integer', () => {
    it('should work properly in success case', () => {
        const result = Spec.integer(42);

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.integer(12.34, path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path);
        });
    });
});

describe('Testing Spec.string', () => {
    it('should work properly in success case', () => {
        const result = Spec.string('some text');

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.string(42, path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path);
        });
    });
});

describe('Testing Spec.object', () => {
    it('should work properly in success case', () => {
        const result = Spec.object({ something: 42 });

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.object(42, path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path);
        });
    });
});

describe('Testing Spec.date', () => {
    it('should work properly in success case', () => {
        const result = Spec.date(new Date());

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.date(42, path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path);
        });
    });
});

describe('Testing Spec.array', () => {
    it('should work properly in success case', () => {
        const result = Spec.array([1, 2, 3]);

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.array(42, path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path);
        });
    });
});

describe('Testing Spec.arrayOf', () => {
    it('should work properly in success case', () => {
        const result = Spec.arrayOf(Spec.integer)([1, 2, 3]);

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.arrayOf(Spec.integer)([1, 2, 3, new Date], path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path + '.3');

        });
    });
});

describe('Testing Spec.or', () => {
    it('should work properly in success case', () => {
        const result =
            Spec.arrayOf(
                Spec.or(
                    Spec.integer,
                    Spec.date))(data.arrayOfIntegersAndDates);

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
    });
});

// --------------------------------------

function runSimpleSpecTest(config: any) {
    const configCheckResult = validateSimpleSpecTestConfig(config, '');

    if (configCheckResult) {
        throw new Error(
            "[runSimpleSpecTest] Fist argument 'config' is invalid: "
            + configCheckResult.message);
    }

    it('should work properly in success case', () => {
        for (let value of config.validValues) {
            const result = config.spec(value);

            if (result) {
                throw result;
            }
        }
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        for (let path of paths) {
            for (let value of config.invalidValues) {
                const result = config.spec(value, path);

                if (!(result instanceof SpecError)) {
                    throw new Error(
                        'Result of spec test should have been a SpecError');
                } else if (path !== null && typeof result.path !== 'string') {
                    throw new Error(
                        'Path property of SpecError should be a string');
                }
            }
        }
    });
} 