//import { describe, it } from 'mocha';
import { expect } from 'chai';

import Spec from '../../main/api/Spec';
import SpecValidator from '../../main/api/SpecValidator';
import SpecError from '../../main/api/SpecError';

const validateSimpleSpecTestConfig = Spec.shape({
    spec: it => it instanceof SpecValidator || typeof it === 'function',
    validValues: Spec.array,
    invalidValues: Spec.array
});

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

describe('Spec.function', () => {
    runSimpleSpecTest({
        spec: Spec.function,
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

describe('Spec.hasSomeKeys', () => {
    runSimpleSpecTest({
        spec: Spec.hasSomeKeys,
        validValues: ['x', '123', [0], { n: 42 }],
        invalidValues: [undefined, null, true, false, 0, 42, '', [], {}, new Set([1, 2, 3])]
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
        spec: Spec.oneOf(1, 2, "42", false),
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

describe('Spec.arrayOf', () => {
    runSimpleSpecTest({
        spec: Spec.arrayOf(Spec.integer),
        validValues: [[], [1, 2, 3], [-1, -2, -3], [1, -1, 2, -2]],
        invalidValues: [undefined, null, true, false, 0, '', ['1'], [true], [1, 2, null]]
    });
});

describe('Spec.match', () => {
    runSimpleSpecTest({
        spec: Spec.match(/^[a-z]+$/),
        validValues: ['a', 'abc', 'x', 'xxx', 'az'],
        invalidValues: [undefined, null, true, false, 0, '', '0', 'A', 'aZ', ' az']
    });
});

describe('Spec.valid', () => {
    runSimpleSpecTest({
        spec: Spec.valid(it => it > 5),
        validValues: [6, 7, 8, 42, Infinity, '6', '66 '],
        invalidValues: [undefined, null, true, false, 0, '', '0', '5', 'a', 'A']
    });
});

describe('Spec.size', () => {
    runSimpleSpecTest({
        spec: Spec.size((it: any) => it > 3),
        validValues: ['1234', [1, 2, 3, 4], new Set([1, 2, 3, 4])],
        invalidValues: [undefined, null, true, false, 0, '', '0', '123', [], [1,2 ,3], new Set([1, 2, 3])]
    });
});

describe('Spec.greater', () => {
    runSimpleSpecTest({
        spec: Spec.greater('5'),
        validValues: [5.1, 6, 7, 42, '6', '50', '5x', 'x4'],
        invalidValues: [undefined, null, true, false, 0, 5, '', '5', '4x']
    });
});

describe('Spec.greaterOrEqual', () => {
    runSimpleSpecTest({
        spec: Spec.greaterOrEqual('5'),
        validValues: [5, 5.1, 6, 7, 42, '5', '6', '50', '5x', 'x4'],
        invalidValues: [undefined, null, true, false, 0, 4.9, '', '4x']
    });
});

describe('Spec.less', () => {
    runSimpleSpecTest({
        spec: Spec.less('5'),
        validValues: [null, true, false, 0, 1, 2, 4, '', '4.9', []],
        invalidValues: [undefined, 5, 5.1, 6, '5x', {}]
    });
});

describe('Spec.lessOrEqual', () => {
    runSimpleSpecTest({
        spec: Spec.lessOrEqual('5'),
        validValues: [null, true, false, 0, 1, 2, 4, 4.9, 5, 5.0, '', '4.9', '5', []],
        invalidValues: [undefined, 5.1, 6, '5x', {}]
    });
});

describe('Spec.between', () => {
    runSimpleSpecTest({
        spec: Spec.between(0, 100),
        validValues: [true, false, null, 1, 2, 2.22, 3, 42, 100, '100', [], [0]],
        invalidValues: [undefined, -1, -42, '-42', [0, 0], [101], {}]
    });
});

describe('Spec.keysOf', () => {
    runSimpleSpecTest({
        spec: Spec.keysOf(Spec.match(/^[a-z]+$/)),
        validValues: [{}, { a: 1, b: 2 }, { abc: 123, xyz: 789 }],
        invalidValues: [undefined, null, true, false, 0, 1, '', 'some text', { A: 1, b: 2}]
    });
});

describe('Spec.valuesOf', () => {
    runSimpleSpecTest({
        spec: Spec.valuesOf(Spec.number),
        validValues: [{}, { a: 1, b: 2 }, { A: 123.4, B: 678.9 }],
        invalidValues: [undefined, null, true, false, 0, 1, '', 'some text', { a: 1, b: '2'}]
    });
});

describe('Spec.and', () => {
    runSimpleSpecTest({
        spec: Spec.and(Spec.string, (it: string) => it.indexOf('x') !== -1),
        validValues: ['x', 'axb', 'xab', 'abx', 'xxx', 'aaxxbb'],
        invalidValues: [undefined, null, true, false, 0, 1, '', 'some string', '', 'X']
    });
});

describe('Spec.or', () => {
    runSimpleSpecTest({
        spec: Spec.or(Spec.string, Spec.number),
        validValues: ['', 'xxx', 'some text', 0, 1, -1, 12.3, -12.3],
        invalidValues: [undefined, null, true, false, [], {}, Infinity, -Infinity]
    });
});

describe('Spec.in', () => {
    runSimpleSpecTest({
        spec: Spec.in(new Set([1, 2, 3, 4, 5])),
        validValues: [1, 2, 3, 4, 5],
        invalidValues: [undefined, null, true, false, '1', '2', [], {}]
    });
});

describe('Spec.notIn', () => {
    runSimpleSpecTest({
        spec: Spec.notIn(new Set([1, 2, 3, 4, 5])),
        validValues: [undefined, null, true, false, '1', '2', [], {}],
        invalidValues: [1, 2, 3, 4, 5],
    });
});

describe('Spec.shape', () => {
    const
        spec = Spec.shape({
            id: Spec.positiveInteger,
            firstName: Spec.string,
            lastName: Spec.string,

            addresses:
                Spec.arrayOf(
                        Spec.shape({
                            addressType: Spec.oneOf('home', 'work', 'other'),
                            street: Spec.string,
                            zipCode: Spec.string,
                            city: Spec.string
                    })
                )
        }),

        valid = {
            id: 12345,
            firstName: 'Jane',
            lastName: 'Doe',
            addresses: [{
                addressType: 'home',
                street: 'Home Street 123',
                zipCode: '888',
                city: 'Home Town'
            }, {
                addressType: 'work',
                street: 'Work Street 456',
                zipCode: '999',
                city: 'Work city'
            }]
        },

        invalid = {
            id: 12345,
            firstName: 'Jane',
            lastName: 'Doe',
            addresses: [{
                addressType: 'home',
                street: 'Home Street 123',
                zipCode: '888',
                city: 'Home Town'
            }, {
                addressType: 'work',
                street: 'Work Street 456',
                zipCode: 999, // Invalid!!! Zip code must be a strig!
                city: 'Work city'
            }]
        };


    runSimpleSpecTest({
        spec,
        validValues: [valid],
        invalidValues: [undefined, null, true, false, 0, 1, '', '1', {}, [], invalid],
    });
});

describe('Spec.statics', () => {
    const
        spec = Spec.statics({
            id: Spec.positiveInteger,
            keys: Spec.arrayOf(Spec.string)
        }),

        valid = class {
            static get id() {
              return 5;
            }

            static get keys() {
               return ['key1', 'key2', 'key3']
           }
        },
        
        invalid = class {
            static get id() {
              return 5;
            }

            static get keys() {
               return ['key1', 'key2', 333] // Invalid!!! 333 is not a string!
           }
        };

    runSimpleSpecTest({
        spec,
        validValues: [valid],
        invalidValues: [undefined, null, true, false, 0, 1, '', '1', {}, [], invalid, Date],
    });
});

describe('Spec.lazy', () => {
    it('must handle recursive specs properly', () => {
        const spec =
            Spec.shape({
                child:
                    Spec.or(
                        Spec.nothing,
                        Spec.lazy(() => spec))
                }),
            
            data: any = {
                child: {
                    child: {
                        child: null
                    }
                }
            };

        expect(spec.validate(data))
            .to.eql(null);    
    });
})

describe('Spec', () => {
    const 
        spec = Spec.shape({
            level1: Spec.shape({
                level2: Spec.shape({
                    arr: Spec.arrayOf(Spec.integer)
                })
            })
        });
        
    it('must return proper error messages with path information', () => {
        const result = spec.validate({ level1: { level2: { arr: [123, '234'] } } }, '');

        expect(result).to.be.instanceof(SpecError);

        expect(result.message).to.eql(
            "Constraint violation at 'level1.level2.arr.1': "
            + 'Must be an integer');

        expect(result.hint).to.eql('Must be an integer');

        expect(result.path).to.eql('level1.level2.arr.1');
    });
    
    it('must return proper error messages without path information', () => {
        const result = spec.validate({ level1: { level2: { arr: [123, '234'] } } });

        expect(result).to.be.instanceof(SpecError);

        expect(result.message).to.eql(
            "Constraint violation: "
            + 'Invalid shape');

        expect(result.hint).to.eql('Invalid shape');

        expect(result.path).to.eql(null);
    });

    it('must return proper error messages when using custom hint', () => {
        const result =
            spec.usingHint('Please provide valid configuration')
                .validate({ level1: { level2: { arr: [123, '234'] } } });

        expect(result).to.be.instanceof(SpecError);

        expect(result.message).to.eql(
            "Constraint violation: "
            + 'Please provide valid configuration');

        expect(result.hint).to.eql('Please provide valid configuration');

        expect(result.path).to.eql(null);
    });
});

// --------------------------------------

function runSimpleSpecTest(config: { spec: SpecValidator, validValues: any[], invalidValues: any[]}) {
    const configCheckResult = validateSimpleSpecTestConfig.validate(config, '');

    if (configCheckResult) {
        throw new Error(
            "[runSimpleSpecTest] Fist argument 'config' is invalid: "
            + configCheckResult.message);
    }

    it('should work properly in success case', () => {
        for (let value of config.validValues) {
            const result = config.spec.validate(value, '');

            if (result) {
                console.log('Error:', result);
                console.log('Subject:', value);
                process.exit(0);
                throw result;
            }
        }
    });
    
    it('should work properly in error case', () => {
        const paths = ['some.path', null];

        for (let path of paths) {
            for (let value of config.invalidValues) {
                const result = config.spec.validate(value, path);

                if (!(result instanceof SpecError)) {
                    console.log((result as any).hint, result instanceof Error, result instanceof SpecError, result);
                    process.exit(0)

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

/*
describe('Just a test', () => {
    it('should work', () => {

        // Insert here

        console.log(spec(data, ''));

        console.log('--- done ---')
        process.exit(0);
    });
});
*/