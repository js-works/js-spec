import SpecError from './SpecError'
import SpecValidator from './SpecValidator'
import Validator from './Validator'
import createSpecError from '../internal/createSpecError'

const Spec = {
  from: (f: (it: any, path: String) => SpecError | null) => {
    return _specValidator(f)
  },

  any:
    _specValidator(() => null),
  
  never:
    _specValidator(it =>
      _checkConstraint(() => false, it)),

  boolean: 
    _specValidator(
      it => it === true || it === false
        ? null
        : 'Must be boolean'),

  number:
    _specValidator(
      it => typeof it === 'number'
        ? null
        : 'Must be a number'),

  positiveNumber:
    _specValidator(
      it => typeof it === 'number' && it > 0
        ? null
        : 'Must be a positive number'),

  nonpositiveNumber:
    _specValidator(
      it => typeof it === 'number' && it <= 0
        ? null
        : 'Must be a nonpositive number'),

  negativeNumber:
    _specValidator(
      it => typeof it === 'number' && it < 0
        ? null
        : 'Must be a negative number'),

  nonnegativeNumber:
    _specValidator(
      it => typeof it === 'number' && it >= 0
        ? null
        : 'Must be a nonnegative number'),

  float:
    _specValidator(
      it => typeof it === 'number' && isFinite(it)
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite number'
          : 'Must be a number')),

  positiveFloat:
    _specValidator(
      it => typeof it === 'number' && isFinite(it) && it > 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite positive number'
          : 'Must be a positive number')),

  nonpositiveFloat:
    _specValidator(
      it => typeof it === 'number' && isFinite(it) && it <= 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite nonpositive number'
          : 'Must be a nonpositive number')),

  negativeFloat:
    _specValidator(
      it => typeof it === 'number' && isFinite(it) && it < 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite negative number'
          : 'Must be a negative number')),

  nonnegativeFloat:
    _specValidator(
      it => typeof it === 'number' && isFinite(it) && it >= 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite nonnegative number'
          : 'Must be a nonnegative number')),

  integer:
    _specValidator(
      it => Number.isInteger(it)
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite integer'
          : 'Must be an integer')),

  positiveInteger:
    _specValidator(
      it => Number.isInteger(it) && it > 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite positive integer'
          : 'Must be a positive integer')),

  nonpositiveInteger:
    _specValidator(
      it => Number.isInteger(it) && it <= 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite nonpositive integer'
          : 'Must be a nonpositive integer')),

  negativeInteger:
    _specValidator(
      it => Number.isInteger(it) && it < 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite negative integer'
          : 'Must be a negative integer')),

  nonnegativeInteger:
    _specValidator(
      it => Number.isInteger(it) && it >= 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite nonnegative integer'
          : 'Must be a nonnegative integer')),

  finite:
    _specValidator(
      it => isFinite(it) 
        ? null
        : 'Must be finite'),

  infinite:
     _specValidator(
      it => it === Number.POSITIVE_INFINITY || it === Number.NEGATIVE_INFINITY
        ? null
        : 'Must be infinite'),

  string:
    _specValidator(
      it => typeof it === 'string'
        ? null
        : 'Must be a string'),

  function:
    _specValidator(
      it => typeof it === 'function'
        ? null
        : 'Must be a function'),

  object:
     _specValidator(
      it => it !== null && typeof it === 'object'
        ? null
        : 'Must be an object'),

  array:
     _specValidator(
      it => Array.isArray(it)
        ? null
        : 'Must be an array'),

  iterable:
    _specValidator(
      it => typeof it === 'string'
        || (it
          && typeof it === 'object'
          && typeof it[_symbolIterator] === 'function') 
        ? null
        : 'Must be iterable'),

  observable:
    _specValidator(
      it => it !== null && typeof it === 'object'
        && typeof it[_symbolObservable] === 'function'
        && it[_symbolObservable]() === it
        ? null
        : 'Must be an observable'),

  date:
    _specValidator(
      it => it instanceof Date && !isNaN(it.getDate()) 
        ? null
        : 'Must be a valid date'),
  
  something:
    _specValidator(
      it => it !== undefined && it !== null
        ? null
        : 'Must not be undefined or null'),

  nothing:
    _specValidator(
      it => it === undefined || it === null
        ? null
        : 'Must be undefined or null'),

  hasSomeKeys:
    _specValidator(
      it => it === undefined || it === null || Object.keys(it).length === 0
        ? 'Must have Keys'
        : null),
  
  is(value: any): SpecValidator {
    return _specValidator(
      it => it === value    
        ? null
        : 'Must be identical to ' + value,
    )
  },

  isNot(value: any): SpecValidator {
    return _specValidator(
      it => it !== value    
        ? null
        : 'Must not be identical to ' + value
    )
  },

  equal(value: any): SpecValidator {
    return _specValidator(
      it => it == value    
        ? null
        : 'Must be equal to ' + value,
    )
  },

  notEqual(value: any): SpecValidator {
    return _specValidator(
      it => it != value    
        ? null
        : 'Must not be equal to ' + value
    )
  },

  optional(constraint: Validator): SpecValidator {
    return _specValidator(
      (it, path) => it === undefined
        ? null
        : _checkConstraint(constraint, it, path))
  },

  nullable(constraint: Validator): SpecValidator {
    return _specValidator(
      (it, path) => it === null
        ? null
        : _checkConstraint(constraint, it, path))
  },

  nullableOptional(constraint: Validator): SpecValidator {
    return _specValidator((it, path) =>
      it === undefined || it === null
        ? null
        : _checkConstraint(constraint, it, path))
  },

  fail(message: string = 'Invald value'): SpecValidator {
    const validate = () => new Error(message)

    return _specValidator((it, path) =>
      _checkConstraint(validate, it, path))
  },

  oneOf(...items: any[]): SpecValidator {
    return _specValidator(it =>
      !items.every(item => item !== it)
        ? null
        : 'Must be one of: ' + items.join(', '))
  },

  unique(pickValue?: (item: any) => any): SpecValidator {
    return _specValidator((it, path) => {
      let ret: any = Spec.iterable.validate(it, path)

      if (ret === null) {
        let itemCount = 0

        if (Array.isArray(it)) {
          itemCount = it.length
        } else {
          // eslint-disable-next-line no-unused-vars
          for (let item of it) {
            ++itemCount
          }
        }

        const setToCompare = 
          pickValue === undefined
            ? new Set(it)
            : new Set(Array.from(it).map(pickValue))

        if (itemCount > setToCompare.size) {
          ret = 'Must be unique'
        }
      }

      return ret
    })
  },

  instanceOf(type: Function): SpecValidator {
    if (typeof type !== 'function') {
      throw new Error(
        "[Spec.instanceOf] First paramter 'type' must be a function")
    }

    return _specValidator((it, path = null) => it instanceof type
      ? null
      : 'Must be instance of ' + type.name)
  },

  extends(type: Function): SpecValidator {
    if (typeof type !== 'function') {
      throw new Error(
        "[Spec.extends] First paramter 'type' must be a function")
    }

    return _specValidator((it, path = null) => 
      typeof it === 'function' && (it === type || it.prototype instanceof type)
        ? null
        : 'Must be a subclass of ' + type.name)
  },
  
  arrayOf(constraint: Validator): SpecValidator {
    return _specValidator(
      (it, path = null) => {
        let ret = Spec.array.validate(it, path)

        if (ret === null) {
          for (let i = 0; i < it.length; ++i) {
            const
              subPath = _buildSubPath(path, String(i)),
              result = _checkConstraint(constraint, it[i], subPath)

            if (result) {
              ret = result

              break
            } 
          }
        }

        return ret
      }
    )
  },

  singleOf(constraint: Validator): SpecValidator {
    return _specValidator(
      (it, path = null) => {
        let ret = null

        if (!Array.isArray(it)) {
          ret = 'Must be an array'
        } else if (it.length !== 1) {
          ret = 'Must be a single element array'
        } else {
          ret = _checkConstraint(constraint, it[0], _buildSubPath(path, '0'))
        }

        return ret
      }
    )
  },

  match(regex: RegExp): SpecValidator {
    return _specValidator(it => {
      let ret = null

      if (typeof it !== 'string') {
        ret = 'Must be a string'
      } else if (!it.match(regex)) {
        ret = 'Must match regex ' + regex
      }

      return ret
    })
  },

  valid(condition: (it: any) => boolean): SpecValidator {
    return _specValidator((it, path = null) => {
       return condition(it)
        ? null
        : 'Invalid value'
    })
  },

  prop(
    selector: number | string | (string | number)[],
    constraint: Validator
  ): SpecValidator {
    const
      typeOfSelector = typeof selector,
      selectorIsArray = Array.isArray(selector)
    
    if (typeOfSelector !== 'string'
        && typeOfSelector !== 'number'
        && !selectorIsArray) {
      
      throw new TypeError(
          "[Spec.selector] First argument 'selector' must either be "
            + 'a string or a number or an nonempty array')
    } else if (selectorIsArray && (selector as any).length === 0) {
      throw new TypeError(
          "[Spec.selector] First argument 'selector' must not be an "
            + 'empty array')
    }

    return _specValidator((it, path) => {
      let value: any

      if (it === undefined || it === null) {
        value = undefined
      } else if (!selectorIsArray) {
        value = it[selector as any]
      } else {
        value = it
  
        for (let i = 0; i < (selector as any).length; ++i) {
          const key = (selector as any)[i]

          if (value !== undefined && value !== null) {
            value = value[key]
          } else {
            value = undefined
            break
          }
        }
      }

      const subpath =
        selectorIsArray
          ? (selector as any).join('.')
          : (selector as string)

      return _checkConstraint(constraint, value, _buildSubPath(path, subpath))
    })
  },
  
  hasOwnProp(propName: string): SpecValidator {
    return _specValidator(
      it => it === undefined || it === null || !it.hasOwnProperty(propName)
        ? `Must have own property "${propName}"`
        : null)
  },

  greater(value: any): SpecValidator {
    return _specValidator(
      it => it > value    
        ? null
        : 'Must be greater than ' + value
    )
  },

  greaterOrEqual(value: any): SpecValidator {
    return _specValidator(
      it => it >= value    
        ? null
        : 'Must be greater or equal ' + value
    )
  },

  less(value: any): SpecValidator {
    return _specValidator(
      it => it < value    
        ? null
        : 'Must be less than ' + value
    )
  },

  lessOrEqual(value: any): SpecValidator {
    return _specValidator(
      it => it <= value    
        ? null
        : 'Must be less or equal ' + value
    )
  },

  between(left: any, right: any, excludeLeft: boolean = false,
    excludeRight: boolean = false): SpecValidator {
 
    return _specValidator((it, path): any => {
      let ret: string | null = null

      const ok =
        (!excludeLeft && it >= left || excludeLeft && it > left)
        && (!excludeRight && it <= right || excludeRight && it < right); 

      if (!ok) {
        const
          infoLeft = excludeLeft ? '(excluded)' : '(included)',
          infoRight = excludeRight ? '(excluded)' : '(included)'

        ret = `Must be between ${left} ${infoLeft} `
          + `and ${right} ${infoRight}`
      }

      return ret
    })
  },

  all(constraint: Validator): SpecValidator {
    return _specValidator((it, path) => {
      let ret = null

      if (it !== undefined && it !== null) {
        const
          isIterable = typeof it[_symbolIterator] === 'function',
          isArray = Array.isArray(it)

        if (!isIterable && !isArray) {
          ret = 'Must be iterable'
        } else if (isArray) {
          for (let i = 0; i < it.length; ++i) {
            const
              value = it[i],
              subPath = _buildSubPath(path, i), 
              result = _checkConstraint(constraint, value, subPath)

            if (result) {
              ret = result
              break
            }
          }
        } else {
          for (let value of it) {
            let i = 0

            const
              subPath = _buildSubPath(path, i++), 
              result = _checkConstraint(constraint, value, subPath)

            if (result) {
              ret = result
              break
            }
          }
        }
      }

      return ret
    })
  },

  keysOf(constraint: Validator): SpecValidator {
    return _specValidator((it, path) => {
      let ret = null

      if (it === null || typeof it !== 'object') {
        ret = 'Must be an object'
      } else {
        for (let key of Object.keys(it)) {
          const error = _checkConstraint(constraint, key, path)

          if (error) {
            ret = `Key '${key}' is invalid => ${error.hint}`
            break
          }
        }
      }

      return ret
    })
  },

  valuesOf(constraint: Validator): SpecValidator {
    return _specValidator((it, path) => {
      let ret = null

      if (it === null || typeof it !== 'object') {
        ret = 'Must be an object'
      } else {
        for (let key of Object.keys(it)) {
          const
            value = it[key],
            subPath = _buildSubPath(path, key)

          const result = _checkConstraint(constraint, value, subPath)

          if (result) {
            // TODO
            ret = result
            break
          }
        }
      }

      return ret
    })
  },
  
  shape(strictShape: { [key: string]: Validator }): SpecValidator {
    const strictShapeKeys = Object.keys(strictShape)

    return _specValidator((it, path) => {
      let ret = null

      if (it === null || typeof it !== 'object') {
        ret = 'Must be an object'
      } else {
        for (const key of strictShapeKeys) {
          const subPath = _buildSubPath(path, key)

          ret = _checkConstraint(strictShape[key], (it as any)[key], subPath)

          if (ret) {
            if (path === null) {
              ret = 'Invalid structure'
            }

            break
          }
        }
      }

      return ret
    })
  },

  strictShape(shape: { [key: string]: Validator }): SpecValidator {
    const shapeKeyObj: { [key: string]: boolean } = {}
    let numShapeKeys = 0

    const shapeKeys = Object.keys(shape)

    for (let key of Object.keys(shape)) {
      shapeKeyObj[key] = true
      ++numShapeKeys
    }

    return _specValidator((it, path) => {
      let ret = null

      if (it === null || typeof it !== 'object') {
        ret = 'Must be an object'
      } else {
        const itsKeys = Object.keys(it)

        for (const key of itsKeys) {
          if (shapeKeyObj[key] !== true) {
            ret = `Illegal key '${key}'`
            break
          }
        }

        if (!ret) {
          for (const key of shapeKeys) {
            if (shapeKeyObj[key] !== true) {
              ret = `Illegal key '${key}'`
              break
            }

            const subPath = _buildSubPath(path, key)

            ret = _checkConstraint(shape[key], (it as any)[key], subPath)

            if (ret) {
              if (path === null) {
                ret = 'Invalid shape'
              }

              break
            }
          }
        }
      }

      return ret
    })
  },

  and(...constraints: Validator[]): SpecValidator {
    return _specValidator((it, path = null) => {
      let ret = null

      for (let constraint of constraints) {
        // XXX
        const error = _checkConstraint(constraint, it, path)

        if (error) {
          ret = error

          break
        }
      }

      return ret
    })
  },

  or(...constraints: (Validator | { when: Validator, then: Validator })[]): SpecValidator {
    return _specValidator((it, path) => {
      let ret = undefined

      for (let i = 0; i < constraints.length; ++i) {
        const
          constraint = constraints[i]
        
        if (_isValidator(constraint)) {
          const result = _checkConstraint(
            constraint as Validator, it, path)

          if (result === null) {
            ret = null
            break
          } 
        } else if (constraint !== null
          && typeof constraint === 'object'
          
          && (typeof (constraint as any).when === 'function')
          
          && _isValidator((constraint as any).then)) {

          const whenValid =
            _checkConstraint((constraint as any).when, it, null) === null

          if (whenValid) {
            ret = _checkConstraint(
              (constraint as any).then, it, path)

            break
          }
        } else {
          throw new Error('[Spec.or] Arguments must be validators or objects of type { when: validator, then: validator }')
        }
      }

      if (ret === undefined) {
        ret = 'Invalid value'
      }

      return ret
    })
  },
  
  when(
    condition: Validator,
    validatorIfTrue: Validator,
    validatorIfFalse?: Validator) {

    if (!_isValidator(condition)) {
      throw new Error('[Spec.when] First argument "condition" '
        + 'must either be a function or a SpecValidator')
    } else if (!_isValidator(validatorIfTrue)) {
      throw new Error('[Spec.when] Second argument "validatorIfTrue" '
        + 'must either be a function or a SpecValidator')
    } else if (validatorIfFalse !== undefined
      && !_isValidator(validatorIfFalse)) {
      
      throw new Error('[Spec.when] Thrid argument "validatorIfFalse" '
        + 'must either be a function, a SpecValidator or undefined')
    }

    return _specValidator((it, path) => {
      let ret = null

      if (_checkConstraint(condition, it) === null) {
        ret = _checkConstraint(validatorIfTrue, it, path)
      } else if (validatorIfFalse) {
        ret = _checkConstraint(validatorIfFalse, it, path)
      }

      return ret
    })
  },

  in(collection: any): SpecValidator {
    return _specValidator((it, path) => {
      let ret = null
      
      if (collection instanceof Set) {
        if (!collection.has(it)) {
          ret = 'Invalid value', path
        }
      } else if (collection
        && typeof collection[_symbolIterator] === 'function') {
        
        let found = false
        
        for (let item of collection) {
          if (item === it) {
            found = true
            break
          }
        }
        
        if (!found) {
          ret = 'Invalid value'
        }
      }
      
      return ret
    })
  },

  notIn(collection: any): SpecValidator {
    return _specValidator((it, path) => {
      let ret = null

      if (collection instanceof Set) {
        if (collection.has(it)) {
          ret = 'Invalid value'
        }
      } else if (collection
        && typeof collection[_symbolIterator] === 'function') {
        
        let found = false
        
        for (let item of collection) {
          if (item === it) {
            found = true
            break
          }
        }
        
        if (found) {
          ret = 'Invalid value'
        }
      }
      
      return ret
    })
  },

  lazy(getValidator: () => Validator) {
    let validator: Function = null

    return _specValidator((it, path) => {
      if (!validator) {
        try {
          const result = getValidator()

          if (typeof result !== 'function') {
            throw new Error('Lazy validator provider must return a function')
          }

          validator = _specValidator(result as ((it: any, path: string | null) => null | Error | string))
        } catch (err) {
          throw new Error(
            '[Spec.lazy] Error while retrieving spec validator: '
              + err)
        }
      }

      return validator(it, path)
    })
  }
}

Object.freeze(Spec)

export default Spec

// --- Local ----------------------------------------------
/**
 * @hidden 
 */
const _symbolIterator =
  typeof Symbol === 'function' && Symbol.iterator
    ? Symbol.iterator
    : '@@iterator'

/**
 * @hidden 
 */
const _symbolObservable =
  typeof Symbol === 'function' && (<any>Symbol).observable
    ? (<any>Symbol).observable
    : '@@observable'

/**
 * @hidden 
 */
function  _validate(it: any, path: string): SpecError | null {
  return this(it, path)
}

/**
 * @hidden 
 */
function  _usingHint(hint: string) {
  if (typeof hint != 'string') {
    throw new Error("[SpecValidator.usingHint] First argument 'hint' must be a string")
  }

  return _specValidator((it: any, path?: null | string) =>
    this(it, path) !== null
      ? createSpecError(hint, path)
      : null
  )
}

/**
 * @hidden 
 */
function _specValidator(f: (it: any, path: string | null) => Error | string | boolean | null): SpecValidator {
  const ret: any = function (it: any, path: string | null = '') {
    const result: any = f(it, path)

    let
      errMsg = null,
      subpath: string | null = path

    if (result && result !== true) {

      if (typeof result === 'string') {
        errMsg = result
      } else if (result.hint && typeof result.hint === 'string') {
        errMsg = result.hint
      } else if (result.message && typeof result.message === 'string') {
        errMsg = result.message
      } else {
        errMsg = 'Invalid value'
      }

      if (typeof result.path === 'string' && result.path.trim() !== '') {
        subpath = result.path
      }
    }

    return errMsg === null ? null : createSpecError(errMsg, subpath)
  }

  ret.validate = _validate
  ret.usingHint = _usingHint

  return ret
}


/**
 * @hidden 
 */
function _isValidator(it: any) {
  return typeof it === 'function'
//    && typeof it.usingHint === 'function'; // TODO
}

/**
 * @hidden 
 */
function _buildSubPath(path: String | null, key: string | number): string | null {
  let ret = null

  if (path === '') {
    ret = String(key)
  } else if (path) {
    ret = !path ? String(key) : `${path}.${key}`
  }

  return ret
}

/**
 * @hidden
 */
function _checkConstraint(constraint: Validator, it: any, path: null | string = null): null | SpecError {
  let ret = null

  const
    validator = constraint && (<any>constraint)['js-spec:validate'] || constraint,
    result = (validator as Function)(it, path)

  const errPath =
    typeof path === 'string'
      && result && typeof result.path === 'string'
      && result.path.length > path.length
      && result.path.startsWith(path)

    ? result.path
    : path

  if (result === false) {
    ret = createSpecError('Invalid value', errPath)
  } else if (result instanceof SpecError && result.hint) {
    ret = createSpecError(result.hint, errPath)
  } else if (result instanceof Error) {
    ret = createSpecError(result.message, errPath)
  } else if (result !== true && result !== null) {
    ret = createSpecError(String(result), errPath)
  }
  
  return ret
}
