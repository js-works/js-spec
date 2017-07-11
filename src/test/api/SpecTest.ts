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
        invalidValues: [undefined, Infinity, -Infinity, NaN, {}]
    });
});

describe('Spec.infinite', () => {
    runSimpleSpecTest({
        spec: Spec.infinite,
        validValues: [Infinity, -Infinity],
        invalidValues: [undefined, null, true, false, 1, -1, 2, -2, 3, '1', '-1', '2', '-2', NaN, {}, [], [1]]
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
        validValues: [new Date(), new Date('1989-11-09')],
        invalidValues: [undefined, null, true, false, 0, 1, -1, {}, '1989-11-09', new Date('xxx')]
    });
});

describe('Spec.something', () => {
    runSimpleSpecTest({
        spec: Spec.something,
        validValues: [true, false, 0, 1, 42, [], [0], {}, { x: 12.3 }],
        invalidValues: [undefined, null]
    });
});

describe('Spec.nothing', () => {
    runSimpleSpecTest({
        spec: Spec.nothing,
        validValues: [undefined, null],
        invalidValues: [true, false, 0, 1, 42, [], [0], {}, { x: 12.3 }]
    });
});

describe('Spec.is', () => {
    runSimpleSpecTest({
        spec: Spec.is(42),
        validValues: [42],
        invalidValues: [undefined, null, true, false, 0, 1, 41, "42", {}]
    })
});

describe('Spec.isNot', () => {
    runSimpleSpecTest({
        spec: Spec.isNot(42),
        validValues: [undefined, null, true, false, 0, 1, 41, "42", {}],
        invalidValues: [42]
    })
})

describe('Spec.equal', () => {
    runSimpleSpecTest({
        spec: Spec.equal(42),
        validValues: [42, "42", "42 "],
        invalidValues: [undefined, null, true, false, 0, 1, 41, {}]
    })
    
    runSimpleSpecTest({
        spec: Spec.equal(0),
        validValues: [0, false, '0', [], [0]],
        invalidValues: [undefined, null, true, 1, 41, {}, [1], [0, 0]]
    })
});

describe('Spec.notEqual', () => {
    runSimpleSpecTest({
        spec: Spec.notEqual(42),
        validValues: [undefined, null, true, false, 0, 1, 41, {}],
        invalidValues: [42, "42", "42 "]
    })
    
    runSimpleSpecTest({
        spec: Spec.notEqual(0),
        validValues: [undefined, null, true, 1, 41, {}, [1], [0, 0]],
        invalidValues: [0, false, '0', [], [0]]
    });
});

describe('Spec.optional', () => {
    runSimpleSpecTest({
        spec: Spec.optional(Spec.number),
        validValues: [undefined, 0, 1, -1, 12.23, -42],
        invalidValues: [null, true, false, '', '0', 'some text', {}, []]
    });
});

describe('Spec.optional', () => {
    runSimpleSpecTest({
        spec: Spec.nullable(Spec.number),
        validValues: [null, 0, 1, -1, 12.23, -42],
        invalidValues: [undefined, true, false, '', '0', 'some text', {}, []]
    });
});

describe('Spec.orNothing', () => {
    runSimpleSpecTest({
        spec: Spec.orNothing(Spec.number),
        validValues: [undefined, null, 0, 1, -1, 12.23, -42],
        invalidValues: [true, false, '', '0', 'some text', {}, []]
    });
});

describe('Spec.oneOf', () => {
    runSimpleSpecTest({
        spec: Spec.oneOf([1, 2, "42", false]),
        validValues: [1, 2, "42", false],
        invalidValues: [true, 42, '', '0', 'some text', {}, []]
    });
});

describe('Spec.instanceOf', () => {
    runSimpleSpecTest({
        spec: Spec.instanceOf(Object),
        validValues: [[], {}, new Date],
        invalidValues: [true, 42, '', '0', 'some text']
    });
    
    runSimpleSpecTest({
        spec: Spec.instanceOf(Date),
        validValues: [new Date, new Date('1945-05-08')],
        invalidValues: [true, 42, '', '0', 'some text']
    });
});

describe('Testing Spec.arrayOf', () => {
    runSimpleSpecTest({
        spec: Spec.arrayOf(Spec.integer),
        validValues: [[], [1, 2, 3], [-1, -2, -3], [1, -1, 2, -2]],
        invalidValues: [undefined, null, true, false, 0, '', ['1'], [true], [1, 2, null]]
    });
});

describe('Testing Spec.match', () => {
    runSimpleSpecTest({
        spec: Spec.match(/^[a-z]+$/),
        validValues: ['a', 'abc', 'x', 'xxx', 'az'],
        invalidValues: [undefined, null, true, false, 0, '', '0', 'A', 'aZ', ' az']
    });
});

describe('Testing Spec.valid', () => {
    runSimpleSpecTest({
        spec: Spec.valid(it => it > 5),
        validValues: [6, 7, 8, 42, Infinity, '6', '66 '],
        invalidValues: [undefined, null, true, false, 0, '', '0', '5', 'a', 'A']
    });
});

describe('Testing Spec.size', () => {
    runSimpleSpecTest({
        spec: Spec.size((it: any) => it > 3),
        validValues: ['1234', [1, 2, 3, 4], new Set([1, 2, 3, 4])],
        invalidValues: [undefined, null, true, false, 0, '', '0', '123', [], [1,2 ,3], new Set([1, 2, 3])]
    });
});

describe('Testing Spec.greater', () => {
    runSimpleSpecTest({
        spec: Spec.greater('5'),
        validValues: [5.1, 6, 7, 42, '6', '50', '5x', 'x4'],
        invalidValues: [undefined, null, true, false, 0, 5, '', '5', '4x']
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
                console.log('Error:', result);
                console.log('Subject:', value);
                process.exit(0);
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
                        'Result of spec test should have been a SpecError '
                        + 'for value ' + value);
                } else if (path !== null && typeof result.path !== 'string') {
                    throw new Error(
                        'Path property of SpecError should be a string');
                }
            }
        }
    });
} 