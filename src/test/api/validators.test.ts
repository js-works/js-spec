// needed for the tests of Spec.observable
import 'symbol-observable'
import { from, of, range } from 'rxjs'

//import { describe, it } from 'mocha'
import { expect } from 'chai'

import * as StandardModule from '../../main/js-spec'
import * as Spec from '../../main/api/validators'
import SpecValidator from '../../main/api/SpecValidator'
import SpecError from '../../main/api/SpecError'

const validateSimpleSpecTestConfig = Spec.exact({
  spec: Spec.func,
  validValues: Spec.array,
  invalidValues: Spec.array
})

describe('Validator: any', () => {
  runSimpleSpecTest({
    spec: Spec.any,
    validValues: [undefined, null, true, false, 42, -42, 'some text', {}, [], new Date],
    invalidValues: []
  })
})

describe('Validator: boolean', () => {
  runSimpleSpecTest({
    spec: Spec.boolean,
    validValues: [true, false],
    invalidValues: [undefined, null, 42, 'some text']
  })
})

describe('Validator: number', () => {
  runSimpleSpecTest({
    spec: Spec.number,
    validValues: [0, 1, -1, 42, -42, 12.34, -12.34, Infinity, -Infinity],
    
    invalidValues: [undefined, null, true, false, {}, '0']
  })
})

describe('Validator: positiveNumber', () => {
  runSimpleSpecTest({
    spec: Spec.positiveNumber,
    validValues: [1, 2, 3, 42, Infinity],
    invalidValues: [undefined, null, true, false, {}, '0', 0, -1, -Infinity, '1']
  })
})

describe('Validator: nonpositiveNumber', () => {
  runSimpleSpecTest({
    spec: Spec.nonpositiveNumber,
    validValues: [0, -1, -2, -12.34, -Infinity],
    invalidValues: [undefined, null, true, false, {}, '0', 2, 3, '-1', Infinity]
  })
})

describe('Validator: negativeNumber', () => {
  runSimpleSpecTest({
    spec: Spec.negativeNumber,
    validValues: [-1, -12.34, -42, -Infinity],
    invalidValues: [undefined, null, true, false, {}, 1, 2, 1.2, '-1', Infinity]
  })
})

describe('Validator: nonnegativeNumber', () => {
  runSimpleSpecTest({
    spec: Spec.nonnegativeNumber,
    validValues: [0, 1, 2, 12.34, 42, Infinity],
    invalidValues: [undefined, null, true, false, {}, -1, -12.34, '1', -Infinity]
  })
})

describe('Validator: float', () => {
  runSimpleSpecTest({
    spec: Spec.float,
    validValues: [0, 1, -1, 42, -42, 12.34, -12.34],
    invalidValues: [undefined, null, true, false, {}, '0', Infinity, -Infinity]
  })
})

describe('Validator: positiveFloat', () => {
  runSimpleSpecTest({
    spec: Spec.positiveFloat,
    validValues: [1, 2, 3, 42],
    invalidValues: [undefined, null, true, false, {}, '0', 0, -1, Infinity, '1']
  })
})

describe('Validator: nonpositiveFloat', () => {
  runSimpleSpecTest({
    spec: Spec.nonpositiveFloat,
    validValues: [0, -1, -2, -12.34],
    invalidValues: [undefined, null, true, false, {}, '0', 2, 3, '-1', -Infinity]
  })
})

describe('Validator: negativeFloat', () => {
  runSimpleSpecTest({
    spec: Spec.negativeFloat,
    validValues: [-1, -12.34, -42],
    invalidValues: [undefined, null, true, false, {}, 1, 2, 1.2, '-1', -Infinity]
  })
})

describe('Validator: nonnegativeFloat', () => {
  runSimpleSpecTest({
    spec: Spec.nonnegativeFloat,
    validValues: [0, 1, 2, 12.34, 42],
    invalidValues: [undefined, null, true, false, {}, -1, -12.34, '1', Infinity]
  })
})

describe('Validator: integer', () => {
  runSimpleSpecTest({
    spec: Spec.integer,
    validValues: [0, 1, -1, 42, -42],
    invalidValues: [undefined, null, true, false, {}, 1.1, '1', Infinity]
  })
})

describe('Validator: positiveInteger', () => {
  runSimpleSpecTest({
    spec: Spec.positiveInteger,
    validValues: [1, 2, 3, 42],
    invalidValues: [undefined, null, true, false, {}, 0, -1, '1', Infinity]
  })
})

describe('Validator: nonpositiveInteger', () => {
  runSimpleSpecTest({
    spec: Spec.nonpositiveInteger,
    validValues: [0, -1, -2, -42],
    invalidValues: [undefined, null, true, false, {}, 1, 2, -1.23, '-1', -Infinity]
  })
})

describe('Validator: negativeInteger', () => {
  runSimpleSpecTest({
    spec: Spec.negativeInteger,
    validValues: [-1, -2, -42],
    invalidValues: [undefined, null, true, false, {}, 0, 1, 2, -1.23, '-1', -Infinity]
  })
})

describe('Validator: nonnegativeInteger', () => {
  runSimpleSpecTest({
    spec: Spec.nonnegativeInteger,
    validValues: [0, 1, 2, 42],
    invalidValues: [undefined, null, true, false, {}, -1, -2, 1.23, '1', Infinity]
  })
})

describe('Validator: finite', () => {
  runSimpleSpecTest({
    spec: Spec.finite,
    validValues: [1, -1, 2, -2, 3, '1', '-1', '2', '-2', true, false, null, [], [1]],
    invalidValues: [undefined, Infinity, -Infinity, NaN, {}]
  })
})

describe('Validator: infinite', () => {
  runSimpleSpecTest({
    spec: Spec.infinite,
    validValues: [Infinity, -Infinity],
    invalidValues: [undefined, null, true, false, 1, -1, 2, -2, 3, '1', '-1', '2', '-2', NaN, {}, [], [1]]
  })
})

describe('Validator: string', () => {
  runSimpleSpecTest({
    spec: Spec.string,
    validValues: ['', 'some text'],
    invalidValues: [undefined, null, true, false, 0, 1, -1, 1,23, -1.23, {}, []]
  })
})

describe('Validator: function', () => {
  runSimpleSpecTest({
    spec: Spec.func,
    validValues: [() => {}, Object, Array, Date],
    invalidValues: [undefined, null, true, false, 0, 1, -1, "", {}, []]
  })
})

describe('Validator: object', () => {
  runSimpleSpecTest({
    spec: Spec.object,
    validValues: [{}, [], new Date],
    invalidValues: [undefined, null, true, false, 0, 1, -1, ""]
  })
})

describe('Validator: emptyObject', () => {
  runSimpleSpecTest({
    spec: Spec.emptyObject,
    validValues: [{}, new Object()],
    invalidValues: [undefined, null, true, false, 0, 1, -1, "", { a: 1 }, { '': 2}]
  })
})

describe('Validator: array', () => {
  runSimpleSpecTest({
    spec: Spec.array,
    validValues: [[], [0], [1, 2, 3], new Array],
    invalidValues: [undefined, null, true, false, 0, 1, -1, {}]
  })
})

describe('Validator: iterable', () => {
  runSimpleSpecTest({
    spec: Spec.iterable,
    validValues: ["123", [1, 2, 3], new Set()],
    invalidValues: [undefined, null, true, false, 0, 1, -1, {}]
  })
})

describe('Validator: observable', () => {
  runSimpleSpecTest({
    spec: Spec.observable,
    validValues: [of(1, 2, 3), from([2, 3, 4]), range(1, 10)],
    invalidValues: [undefined, null, true, false, 0, 1, -1, {},
      { [(Symbol as any).observable]: (): any => null}]
  })
})

describe('Validator: date', () => {
  runSimpleSpecTest({
    spec: Spec.date,
    validValues: [new Date(), new Date('1989-11-09')],
    invalidValues: [undefined, null, true, false, 0, 1, -1, {}, '1989-11-09', new Date('xxx')]
  })
})

describe('Validator: something', () => {
  runSimpleSpecTest({
    spec: Spec.something,
    validValues: [true, false, 0, 1, 42, [], [0], {}, { x: 12.3 }],
    invalidValues: [undefined, null]
  })
})

describe('Validator: nothing', () => {
  runSimpleSpecTest({
    spec: Spec.nothing,
    validValues: [undefined, null],
    invalidValues: [true, false, 0, 1, 42, [], [0], {}, { x: 12.3 }]
  })
})

describe('Validator: hasSomeKeys', () => {
  runSimpleSpecTest({
    spec: Spec.hasSomeKeys,
    validValues: ['x', '123', [0], { n: 42 }],
    invalidValues: [undefined, null, true, false, 0, 42, '', [], {}, new Set([1, 2, 3])]
  })
})

describe('Validator: is', () => {
  runSimpleSpecTest({
    spec: Spec.is(42),
    validValues: [42],
    invalidValues: [undefined, null, true, false, 0, 1, 41, "42", {}]
  })
})

describe('Validator: isNot', () => {
  runSimpleSpecTest({
    spec: Spec.isNot(42),
    validValues: [undefined, null, true, false, 0, 1, 41, "42", {}],
    invalidValues: [42]
  })
})

describe('Validator: equal', () => {
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
})

describe('Validator: notEqual', () => {
  runSimpleSpecTest({
    spec: Spec.notEqual(42),
    validValues: [undefined, null, true, false, 0, 1, 41, {}],
    invalidValues: [42, "42", "42 "]
  })
  
  runSimpleSpecTest({
    spec: Spec.notEqual(0),
    validValues: [undefined, null, true, 1, 41, {}, [1], [0, 0]],
    invalidValues: [0, false, '0', [], [0]]
  })
})

describe('Validator: optional', () => {
  runSimpleSpecTest({
    spec: Spec.optional(Spec.number),
    validValues: [undefined, 0, 1, -1, 12.23, -42],
    invalidValues: [null, true, false, '', '0', 'some text', {}, []]
  })
})

describe('Validator: nullable', () => {
  runSimpleSpecTest({
    spec: Spec.nullable(Spec.number),
    validValues: [null, 0, 1, -1, 12.23, -42],
    invalidValues: [undefined, true, false, '', '0', 'some text', {}, []]
  })
})

describe('Validator: nullableOptional', () => {
  runSimpleSpecTest({
    spec: Spec.nullableOptional(Spec.number),
    validValues: [undefined, null, 0, 1, -1, 12.23, -42],
    invalidValues: [true, false, '', '0', 'some text', {}, []]
  })
})

describe('Validator: fail', () => {
  runSimpleSpecTest({
    spec: Spec.fail(),
    validValues: [],
    invalidValues: [undefined, null, true, false, 0, -1, 1, -42, 42, 123.45, -123.45, '', '0', 'some text', {}, [], new Date]
  })
})

describe('Validator: oneOf', () => {
  runSimpleSpecTest({
    spec: Spec.oneOf(1, 2, "42", false),
    validValues: [1, 2, "42", false],
    invalidValues: [true, 42, '', '0', 'some text', {}, []]
  })
})

describe('Validator: unique', () => {
  runSimpleSpecTest({
    spec: Spec.unique(),
    validValues: [[], [1, 2, 3]],
    invalidValues: [undefined, null, true, false, 0, 1, -1, {}, [1, 2, 1]]
  })
  
  runSimpleSpecTest({
    spec: Spec.unique((it: any) => it[0]),
    validValues: [[], [[1], [2], [3]]],
    invalidValues: [undefined, null, true, false, 0, 1, -1, {}, [[1], [2], [1]]]
  })
})

describe('Validator: instanceOf', () => {
  runSimpleSpecTest({
    spec: Spec.instanceOf(Object),
    validValues: [[], {}, new Date],
    invalidValues: [true, 42, '', '0', 'some text']
  })
  
  runSimpleSpecTest({
    spec: Spec.instanceOf(Date),
    validValues: [new Date, new Date('1945-05-08')],
    invalidValues: [true, 42, '', '0', 'some text']
  })
})

describe('Validator: extends', () => {
  const
    A = class {},
    B = class extends A {},
    C = class {}

  runSimpleSpecTest({
    spec: Spec.extending(A),
    validValues: [A, B],
    invalidValues: [true, 42, '', C]
  })
  
  runSimpleSpecTest({
    spec: Spec.instanceOf(Date),
    validValues: [new Date, new Date('1945-05-08')],
    invalidValues: [true, 42, '', '0', 'some text']
  })
})

describe('Validator: arrayOf', () => {
  runSimpleSpecTest({
    spec: Spec.arrayOf(Spec.integer),
    validValues: [[], [1, 2, 3], [-1, -2, -3], [1, -1, 2, -2]],
    invalidValues: [undefined, null, true, false, 0, '', ['1'], [true], [1, 2, null]]
  })
})

describe('Validator: singleOf', () => {
  runSimpleSpecTest({
    spec: Spec.singleOf(Spec.integer),
    validValues: [[1], [-1], [0], [42]],
    invalidValues: [undefined, null, true, false, 0, '', [], [1.1], [true], [1, 2]]
  })
})

describe('Validator: match', () => {
  runSimpleSpecTest({
    spec: Spec.match(/^[a-z]+$/),
    validValues: ['a', 'abc', 'x', 'xxx', 'az'],
    invalidValues: [undefined, null, true, false, 0, '', '0', 'A', 'aZ', ' az']
  })
})

describe('Validator: valid', () => {
  runSimpleSpecTest({
    spec: Spec.valid(it => it > 5),
    validValues: [6, 7, 8, 42, Infinity, '6', '66 '],
    invalidValues: [undefined, null, true, false, 0, '', '0', '5', 'a', 'A']
  })
})

describe('Validator: prop', () => {
  runSimpleSpecTest({
    spec: Spec.prop('length', (it: any) => it > 3),
    validValues: ['1234', { length: 12 }],
    invalidValues: [undefined, null, true, false, 0, '', '0', '123', {}, { length: 1 }]
  })

  runSimpleSpecTest({
    spec: Spec.prop(['x', 'y'], Spec.is(42)),
    validValues: [{ x: { y: 42 } }, { x: { y: 42, z: 43 } }],
    invalidValues: [undefined, null, true, false, 0, '', '0', '123', {}, { x: { y: 43 } }]
  })
})

describe('Validator: hasOwnProp', () => {
  runSimpleSpecTest({
    spec: Spec.hasOwnProp('x'),
    validValues: [{ x: 1 }, { x: 2, y: 3 }],
    invalidValues: [undefined, null, true, false, 0, 42, '', [], {}, new Set([1, 2, 3])]
  })
})

describe('Validator: greater', () => {
  runSimpleSpecTest({
    spec: Spec.greater('5'),
    validValues: [5.1, 6, 7, 42, '6', '50', '5x', 'x4'],
    invalidValues: [undefined, null, true, false, 0, 5, '', '5', '4x']
  })
})

describe('Validator: greaterOrEqual', () => {
  runSimpleSpecTest({
    spec: Spec.greaterOrEqual('5'),
    validValues: [5, 5.1, 6, 7, 42, '5', '6', '50', '5x', 'x4'],
    invalidValues: [undefined, null, true, false, 0, 4.9, '', '4x']
  })
})

describe('Validator: less', () => {
  runSimpleSpecTest({
    spec: Spec.less('5'),
    validValues: [null, true, false, 0, 1, 2, 4, '', '4.9', []],
    invalidValues: [undefined, 5, 5.1, 6, '5x', {}]
  })
})

describe('Validator: lessOrEqual', () => {
  runSimpleSpecTest({
    spec: Spec.lessOrEqual('5'),
    validValues: [null, true, false, 0, 1, 2, 4, 4.9, 5, 5.0, '', '4.9', '5', []],
    invalidValues: [undefined, 5.1, 6, '5x', {}]
  })
})

describe('Validator: between', () => {
  runSimpleSpecTest({
    spec: Spec.between(0, 100),
    validValues: [true, false, null, 1, 2, 2.22, 3, 42, 100, '100', [], [0]],
    invalidValues: [undefined, -1, -42, '-42', [0, 0], [101], {}]
  })
  
  runSimpleSpecTest({
    spec: Spec.between(0, 100, true, true),
    validValues: [0.01, 1, 2, 90, 99, 99.99],
    invalidValues: [0, 100]
  })
})

describe('Validator: all', () => {
  runSimpleSpecTest({
    spec: Spec.all(Spec.number),
    validValues: [undefined, null, [], [1, 2, 3], new Set([123.45, -42])],
    invalidValues: [true, false, 0, 1, ['x', 'y']]
  })
})

describe('Validator: keysOf', () => {
  runSimpleSpecTest({
    spec: Spec.keysOf(Spec.match(/^[a-z]+$/)),
    validValues: [{}, { a: 1, b: 2 }, { abc: 123, xyz: 789 }],
    invalidValues: [undefined, null, true, false, 0, 1, '', 'some text', { A: 1, b: 2}]
  })
})

describe('Validator: valuesOf', () => {
  runSimpleSpecTest({
    spec: Spec.valuesOf(Spec.number),
    validValues: [{}, { a: 1, b: 2 }, { A: 123.4, B: 678.9 }],
    invalidValues: [undefined, null, true, false, 0, 1, '', 'some text', { a: 1, b: '2'}]
  })
})

describe('Validator: and', () => {
  runSimpleSpecTest({
    spec: Spec.and(Spec.string, (it: string) => it.indexOf('x') !== -1),
    validValues: ['x', 'axb', 'xab', 'abx', 'xxx', 'aaxxbb'],
    invalidValues: [undefined, null, true, false, 0, 1, '', 'some string', '', 'X']
  })
})

describe('Validator: or', () => {
  runSimpleSpecTest({
    spec: Spec.or(Spec.string, Spec.number),
    validValues: ['', 'xxx', 'some text', 0, 1, -1, 12.3, -12.3, Infinity, -Infinity],
    invalidValues: [undefined, null, true, false, [], {}]
  })

  const spec =
    Spec.or(
      {
        when: Spec.array,
        then: (it: any) => !!it && it.length === 2
      },
      {
        when: Spec.integer,

        then:
          Spec.exact({
            type: Spec.is('integer'),
            value: Spec.integer
          })
      },

      {
        when:
          (it: any) => it && it.type === 'string',

        then:
          Spec.exact({
            type: Spec.is('string'),
            value: Spec.string
          })
      })

  runSimpleSpecTest({
    spec,
    validValues: [
//      { type: 'integer', value: 13},
      { type: 'string', value: 'some text'},
      [1, 2]
    ],
    invalidValues: [
      undefined, null, true, false, [], {},
      { type: 'integer', value: 'some text' },
      { type: 'string', value: 42},
      { type: 'boolean', value: true },
      [1, 2, 3]
    ]
  })
})

describe('Validator: when (using function as first argument that returns true)', () => {
  runSimpleSpecTest({
    spec: Spec.when(() => true, Spec.positiveNumber, Spec.negativeNumber),
    validValues: [1, 2, 3, 4, 5],
    invalidValues: [-1, -2, -3, -4, -5]
  })
})

describe('Validator: when (using function as first argument that returns false)', () => {
  runSimpleSpecTest({
    spec: Spec.when(() => false, Spec.positiveNumber, Spec.negativeNumber),
    validValues: [-1, -2, -3, -4, -5],
    invalidValues: [1, 2, 3, 4, 5]
  })
})

describe('Validator: when (using SpecValidator as first argument)', () => {
  runSimpleSpecTest({
    spec: Spec.when(Spec.valid(() => false), Spec.positiveNumber, Spec.negativeNumber),
    validValues: [-1, -2, -3, -4, -5],
    invalidValues: [1, 2, 3, 4, 5]
  })
})

describe('Validator: in', () => {
  runSimpleSpecTest({
    spec: Spec.isIn(new Set([1, 2, 3, 4, 5])),
    validValues: [1, 2, 3, 4, 5],
    invalidValues: [undefined, null, true, false, '1', '2', [], {}]
  })
})

describe('Validator: notIn', () => {
  runSimpleSpecTest({
    spec: Spec.isNotIn(new Set([1, 2, 3, 4, 5])),
    validValues: [undefined, null, true, false, '1', '2', [], {}],
    invalidValues: [1, 2, 3, 4, 5],
  })
})

describe('Validator: shape', () => {
  const
    spec1 = Spec.shape({
      firstName: Spec.string,
      lastName: Spec.string
    }),

    spec2 = Spec.shape({
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

    valid1 = {
      firstName: 'Jane',
      lastName: 'Doe',
      someOtherValue: 123
    },

    valid2 = {
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

    invalid1 = {
      firstName: 'Jane',
      city: 'Seattle'
    },

    invalid2 = {
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
    }


  runSimpleSpecTest({
    spec: spec1,
    validValues: [valid1],
    invalidValues: [undefined, null, true, false, 0, 1, '', '1', {}, [], invalid1],
  })

  runSimpleSpecTest({
    spec: spec2,
    validValues: [valid2],
    invalidValues: [undefined, null, true, false, 0, 1, '', '1', {}, [], invalid2],
  })
})

describe('Validator: exact', () => {
  const
    spec1 = Spec.exact({
      firstName: Spec.string,
      lastName: Spec.string
    }),

    spec2 = Spec.exact({
      id: Spec.positiveInteger,
      firstName: Spec.string,
      lastName: Spec.string,

      addresses:
        Spec.arrayOf(
            Spec.exact({
              addressType: Spec.oneOf('home', 'work', 'other'),
              street: Spec.string,
              zipCode: Spec.string,
              city: Spec.string
          })
        )
    }),

    valid1 = {
      firstName: 'Jane',
      lastName: 'Doe'
    },

    valid2 = {
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

    invalid1 = {
      firstName: 'Jane',
      lastName: 'Doe',
      city: 'Seattle'
    },

    invalid2 = {
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
    }


  runSimpleSpecTest({
    spec: spec1,
    validValues: [valid1],
    invalidValues: [undefined, null, true, false, 0, 1, '', '1', {}, [], invalid1, invalid2],
  })

  runSimpleSpecTest({
    spec: spec2,
    validValues: [valid2],
    invalidValues: [undefined, null, true, false, 0, 1, '', '1', {}, [], invalid1, invalid2],
  })
})

describe('Validator: props', () => {
  runSimpleSpecTest({
    spec:
      Spec.props({
        required: {
          a: Spec.number,
          b: Spec.number
        },

        optional: {
          c: Spec.string,
          d: Spec.string
        },

        validate: (it: any) => it && it.hasOwnProperty('e')
      }),

    validValues: [
      { a: 1, b: 2, e: 'z'},
      { a: 1, b: 2, c: 'x', e: 'z'},
      { a: 1, b: 2, c: 'x', d: 'y', e: 'z'}
    ],

    invalidValues: [
      undefined, null, true, false, 0, '', '0', '123', {},
      { a: 1, e: 'z' },
      { a: 1, b: 'w', e: 'z'},
      { a: 1, b: 2, c: 3, e: 'z' },
      { a: 1, b: 2, c: 'x' },
      { a: 1, b: 2, c: 'x', d: 3, e: 'z'}
    ]
  })
})

describe('Validator: checkProps (not extensible)', () => {
  runSimpleSpecTest({
    spec:
      Spec.checkProps({
        required: {
          a: Spec.number,
          b: Spec.number
        },

        optional: {
          c: Spec.string,
          d: Spec.string
        },

        validate: (it: any) => it && it.a === 1
      }),

    validValues: [
      { a: 1, b: 2},
      { a: 1, b: 2, c: 'x'},
      { a: 1, b: 2, c: 'x', d: 'y'}
    ],

    invalidValues: [
      undefined, null, true, false, 0, '', '0', '123',
      {},
      { a: 1 },
      { a: 2, b: 2 },
      { a: 1, b: 'w' },
      { a: 2, b: 2, c: 3 },
      { a: 1, b: 2, c: 'x', d: 4 },
      { a: 1, b: 2, c: 'x', d: 'y', e: 'z'}
    ]
  })
})

describe('Validator: checkProps (extensible)', () => {
  runSimpleSpecTest({
    spec:
      Spec.checkProps({
        required: {
          a: Spec.number,
          b: Spec.number
        },

        optional: {
          c: Spec.string,
          d: Spec.string
        },

        extensible: true,

        validate: (it: any) => it && it.a === 1
      }),

    validValues: [
      { a: 1, b: 2},
      { a: 1, b: 2, c: 'x'},
      { a: 1, b: 2, c: 'x', d: 'y'},
      { a: 1, b: 2, c: 'x', d: 'y', e: 'z'}
    ],

    invalidValues: [
      undefined, null, true, false, 0, '', '0', '123',
      {},
      { a: 1 },
      { a: 2, b: 2 },
      { a: 1, b: 'w' },
      { a: 2, b: 2, c: 3 },
      { a: 1, b: 2, c: 'x', d: 4 },
    ]
  })
})

describe('Validator: lazy', () => {
  it('must handle recursive specs properly', () => {
    const spec =
      Spec.exact({
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
      }

    expect(spec.validate(data))
      .to.eql(null);  
  })
})

describe('Spec', () => {
  const 
    spec = Spec.exact({
      level1: Spec.exact({
        level2: Spec.exact({
          arr: Spec.arrayOf(Spec.integer)
        })
      })
    })
    
  it('must return proper error messages with path information', () => {
    const result = spec.validate({ level1: { level2: { arr: [123, '234'] } } }, '')

    expect(result).to.be.instanceof(SpecError)

    expect(result.message).to.eql(
      "Constraint violation for 'level1.level2.arr.1': "
      + 'Must be an integer')

    expect(result.hint).to.eql('Must be an integer')

    expect(result.path).to.eql('level1.level2.arr.1')
  })
  
  it('must return proper error messages without path information', () => {
    const result = spec.validate({ level1: { level2: { arr: [123, '234'] } } }, null)

    expect(result).to.be.instanceof(SpecError)

    expect(result.message).to.eql(
      'Constraint violation: Invalid shape')

    expect(result.hint).to.eql('Invalid shape')

    expect(result.path).to.eql(null)
  })

  it('must return proper error messages when using custom hint', () => {
    const result =
      spec.usingHint('Please provide valid configuration')
        .validate({ level1: { level2: { arr: [123, '234'] } } }, null)

    expect(result).to.be.instanceof(SpecError)

    expect(result.message).to.eql(
      "Constraint violation: "
      + 'Please provide valid configuration')

    expect(result.hint).to.eql('Please provide valid configuration')

    expect(result.path).to.eql(null)
  })
})

// --------------------------------------

function runSimpleSpecTest(config: { spec: SpecValidator, validValues: any[], invalidValues: any[]}) {
  const configCheckResult = validateSimpleSpecTestConfig.validate(config, '')

  if (configCheckResult) {
    throw new Error(
      "[runSimpleSpecTest] Fist argument 'config' is invalid: "
      + configCheckResult.message)
  }

  it('should work properly in success case', () => {
    for (let value of config.validValues) {
      const result = config.spec.validate(value, '')

      if (result) {
        throw result
      }
    }
  })
  
  it('should work properly in error case', () => {
    const paths = ['some.path', null]

    for (let path of paths) {
      for (let value of config.invalidValues) {
        const result = config.spec.validate(value, path)

        if (!(result instanceof SpecError)) {
          throw new Error(
            'Result of spec test should have been a SpecError '
            + 'for value ' + value)
        } else if (path !== null && typeof result.path !== 'string') {
          throw new Error(
            'Path property of SpecError should be a string')
        }
      }
    }
  })
}
