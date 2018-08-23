import SpecError from './SpecError';
import SpecValidator from './SpecValidator';
import Validator from './Validator';
import createSpecError from '../internal/createSpecError';

const symbolObservable = (Symbol as any).observable;

const Spec = {
  any:
    SpecValidator.from(() => null),

  boolean: 
    SpecValidator.from(
      it => it === true || it === false
        ? null
        : 'Must be boolean'),

  number:
    SpecValidator.from(
      it => typeof it === 'number'
        ? null
        : 'Must be a number'),

  positiveNumber:
    SpecValidator.from(
      it => typeof it === 'number' && it > 0
        ? null
        : 'Must be a positive number'),

  nonpositiveNumber:
    SpecValidator.from(
      it => typeof it === 'number' && it <= 0
        ? null
        : 'Must be a nonpositive number'),

  negativeNumber:
    SpecValidator.from(
      it => typeof it === 'number' && it < 0
        ? null
        : 'Must be a negative number'),

  nonnegativeNumber:
    SpecValidator.from(
      it => typeof it === 'number' && it >= 0
        ? null
        : 'Must be a nonnegative number'),

  float:
    SpecValidator.from(
      it => typeof it === 'number' && isFinite(it)
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite number'
          : 'Must be a number')),

  positiveFloat:
    SpecValidator.from(
      it => typeof it === 'number' && isFinite(it) && it > 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite positive number'
          : 'Must be a positive number')),

  nonpositiveFloat:
    SpecValidator.from(
      it => typeof it === 'number' && isFinite(it) && it <= 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite nonpositive number'
          : 'Must be a nonpositive number')),

  negativeFloat:
    SpecValidator.from(
      it => typeof it === 'number' && isFinite(it) && it < 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite negative number'
          : 'Must be a negative number')),

  nonnegativeFloat:
    SpecValidator.from(
      it => typeof it === 'number' && isFinite(it) && it >= 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite nonnegative number'
          : 'Must be a nonnegative number')),

  integer:
    SpecValidator.from(
      it => Number.isInteger(it)
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite integer'
          : 'Must be an integer')),

  positiveInteger:
    SpecValidator.from(
      it => Number.isInteger(it) && it > 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite positive integer'
          : 'Must be a positive integer')),

  nonpositiveInteger:
    SpecValidator.from(
      it => Number.isInteger(it) && it <= 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite nonpositive integer'
          : 'Must be a nonpositive integer')),

  negativeInteger:
    SpecValidator.from(
      it => Number.isInteger(it) && it < 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite negative integer'
          : 'Must be a negative integer')),

  nonnegativeInteger:
    SpecValidator.from(
      it => Number.isInteger(it) && it >= 0
        ? null
        : (Math.abs(it) === Infinity
          ? 'Must be a finite nonnegative integer'
          : 'Must be a nonnegative integer')),

  finite:
    SpecValidator.from(
      it => isFinite(it) 
        ? null
        : 'Must be finite'),

  infinite:
     SpecValidator.from(
      it => it === Number.POSITIVE_INFINITY || it === Number.NEGATIVE_INFINITY
        ? null
        : 'Must be infinite'),

  string:
    SpecValidator.from(
      it => typeof it === 'string'
        ? null
        : 'Must be a string'),

  function:
    SpecValidator.from(
      it => typeof it === 'function'
        ? null
        : 'Must be a function'),

  object:
     SpecValidator.from(
      it => it !== null && typeof it === 'object'
        ? null
        : 'Must be an object'),

  array:
     SpecValidator.from(
      it => Array.isArray(it)
        ? null
        : 'Must be an array'),

  iterable:
    SpecValidator.from(
      it => typeof it === 'string'
        || (it
          && typeof it === 'object'
          && typeof it[Symbol.iterator] === 'function') 
        ? null
        : 'Must be iterable'),

  observable:
    SpecValidator.from(
      it => it !== null && typeof it === 'object'
        && Boolean(symbolObservable)
        && typeof it[symbolObservable] === 'function'
        && it[symbolObservable]() === it
        ? null
        : 'Must be an observable'),

  unique:
    SpecValidator.from((it, path) => {
      let ret: any = Spec.iterable.validate(it, path);

      if (ret === null) {
        let itemCount = 0;

        if (Array.isArray(it)) {
          itemCount = it.length;
        } else {
          // eslint-disable-next-line no-unused-vars
          for (let item of it) {
            ++itemCount;
          }
        }
        
        if (itemCount > new Set(it).size) {
          ret = 'Must be unique';
        }
      }

      return ret;
    }),

  date:
    SpecValidator.from(
      it => it instanceof Date && !isNaN(it.getDate()) 
        ? null
        : 'Must be a valid date'),
  
  something:
    SpecValidator.from(
      it => it !== undefined && it !== null
        ? null
        : 'Must not be undefined or null'),

  nothing:
    SpecValidator.from(
      it => it === undefined || it === null
        ? null
        : 'Must be undefined or null'),

  hasSomeKeys:
    SpecValidator.from(
      it => it === undefined || it === null || Object.keys(it).length === 0
        ? 'Must have Keys'
        : null),

  validator:
    SpecValidator.from(
      it => typeof it === 'function' || it instanceof SpecValidator
        ? null
        : 'Must either be a function or a instance of SpecValidator'),

  is(value: any): SpecValidator {
    return SpecValidator.from(
      it => it === value    
        ? null
        : 'Must be identical to ' + value,
    );
  },

  isNot(value: any): SpecValidator {
    return SpecValidator.from(
      it => it !== value    
        ? null
        : 'Must not be identical to ' + value
    );
  },

  equal(value: any): SpecValidator {
    return SpecValidator.from(
      it => it == value    
        ? null
        : 'Must be equal to ' + value,
    );
  },

  notEqual(value: any): SpecValidator {
    return SpecValidator.from(
      it => it != value    
        ? null
        : 'Must not be equal to ' + value
    );
  },

  optional(constraint: Validator): SpecValidator {
    return SpecValidator.from(
      (it, path) => it === undefined
        ? null
        : _checkConstraint(constraint, it, path));
  },

  nullable(constraint: Validator): SpecValidator {
    return SpecValidator.from(
      (it, path) => it === null
        ? null
        : _checkConstraint(constraint, it, path));
  },

  nullableOptional(constraint: Validator): SpecValidator {
    return SpecValidator.from((it, path) =>
      it === undefined || it === null
        ? null
        : _checkConstraint(constraint, it, path));
  },

  oneOf(...items: any[]): SpecValidator {
    return SpecValidator.from(it =>
      !items.every(item => item !== it)
        ? null
        : 'Must be one of: ' + items.join(', '));
  },

  instanceOf(type: Function): SpecValidator {
    if (typeof type !== 'function') {
      throw new Error(
        "[Spec.instanceOf] First paramter 'type' must be a function");
    }

    return SpecValidator.from((it, path = null) => it instanceof type
      ? null
      : 'Must be instance of ' + type.name);
  },

  extends(type: Function): SpecValidator {
    if (typeof type !== 'function') {
      throw new Error(
        "[Spec.extends] First paramter 'type' must be a function");
    }

    return SpecValidator.from((it, path = null) => 
      typeof it === 'function' && (it === type || it.prototype instanceof type)
        ? null
        : 'Must be a subclass of ' + type.name);
  },
  
  arrayOf(constraint: Validator): SpecValidator {
    return SpecValidator.from(
      (it, path = null) => {
        let ret = Spec.array.validate(it, path);

        if (ret === null) {
          for (let i = 0; i < it.length; ++i) {
            const
              subPath = _buildSubPath(path, String(i)),
              result = _checkConstraint(constraint, it[i], subPath);

            if (result) {
              ret = result;

              break;
            } 
          }
        }

        return ret;
      }
    );
  },

  singleOf(constraint: Validator): SpecValidator {
    return SpecValidator.from(
      (it, path = null) => {
        let ret = null;

        if (!Array.isArray(it)) {
          ret = 'Must be an array';
        } else if (it.length !== 1) {
          ret = 'Must be a single element array';
        } else {
          ret = _checkConstraint(constraint, it[0], _buildSubPath(path, '0'));
        }

        return ret;
      }
    )
  },

  match(regex: RegExp): SpecValidator {
    return SpecValidator.from(it => {
      let ret = null;

      if (typeof it !== 'string') {
        ret = 'Must be a string';
      } else if (!it.match(regex)) {
        ret = 'Must match regex ' + regex;
      }

      return ret;
    });
  },

  valid(condition: (it: any) => boolean): SpecValidator {
    return SpecValidator.from((it, path = null) => {
       return condition(it)
        ? null
        : 'Invalid value'
    });
  },

  prop(
    selector: number | string | (string | number)[],
    constraint: Validator
  ): SpecValidator {
    const
      typeOfSelector = typeof selector,
      selectorIsArray = Array.isArray(selector);
    
    if (typeOfSelector !== 'string'
        && typeOfSelector !== 'number'
        && !selectorIsArray) {
      
      throw new TypeError(
          "[Spec.selector] First argument 'selector' must either be "
            + 'a string or a number or an nonempty array');
    } else if (selectorIsArray && (selector as any).length === 0) {
      throw new TypeError(
          "[Spec.selector] First argument 'selector' must not be an "
            + 'empty array');
    }

    return SpecValidator.from((it, path) => {
      let value: any;

      if (it === undefined || it === null) {
        value = undefined;
      } else if (!selectorIsArray) {
        value = it[selector as any];
      } else {
        value = it;
  
        for (let i = 0; i < (selector as any).length; ++i) {
          const key = (selector as any)[i];

          if (value !== undefined && value !== null) {
            value = value[key];
          } else {
            value = undefined;
            break;
          }
        }
      }

      const subpath =
        selectorIsArray
          ? (selector as any).join('.')
          : (selector as string);

      return _checkConstraint(constraint, value, _buildSubPath(path, subpath));
    });
  },

  greater(value: any): SpecValidator {
    return SpecValidator.from(
      it => it > value    
        ? null
        : 'Must be greater than ' + value
    );
  },

  greaterOrEqual(value: any): SpecValidator {
    return SpecValidator.from(
      it => it >= value    
        ? null
        : 'Must be greater or equal ' + value
    );
  },

  less(value: any): SpecValidator {
    return SpecValidator.from(
      it => it < value    
        ? null
        : 'Must be less than ' + value
    );
  },

  lessOrEqual(value: any): SpecValidator {
    return SpecValidator.from(
      it => it <= value    
        ? null
        : 'Must be less or equal ' + value
    );
  },

  between(left: any, right: any, excludeLeft: boolean = false,
    excludeRight: boolean = false): SpecValidator {
 
    return SpecValidator.from((it, path): any => {
      let ret: string | null = null;

      const ok =
        (!excludeLeft && it >= left || excludeLeft && it > left)
        && (!excludeRight && it <= right || excludeRight && it < right); 

      if (!ok) {
        const
          infoLeft = excludeLeft ? '(excluded)' : '(included)',
          infoRight = excludeRight ? '(excluded)' : '(included)';

        ret = `Must be between ${left} ${infoLeft} `
          + `and ${right} ${infoRight}`
      }

      return ret;
    });
  },

  keysOf(constraint: Validator): SpecValidator {
    return SpecValidator.from((it, path) => {
      let ret = null;

      if (it === null || typeof it !== 'object') {
        ret = 'Must be an object';
      } else {
        for (let key of Object.keys(it)) {
          const error = _checkConstraint(constraint, key, path);

          if (error) {
            ret = `Key '${key}' is invalid => ${error.hint}`;
            break;
          }
        }
      }

      return ret;
    });
  },

  valuesOf(constraint: Validator): SpecValidator {
    return SpecValidator.from((it, path) => {
      let ret = null;

      if (it === null || typeof it !== 'object') {
        ret = 'Must be an object';
      } else {
        for (let key of Object.keys(it)) {
          const
            value = it[key],
            subPath = _buildSubPath(path, key);

          const result = _checkConstraint(constraint, value, subPath);

          if (result) {
            // TODO
            ret = result;
            break;
          }
        }
      }

      return ret;
    });
  },

  shape(shape: { [key: string]: Validator }): SpecValidator {
    const shapeKeyObj: { [key: string]: boolean } = {};
    let numShapeKeys = 0;

    const shapeKeys = Object.keys(shape);

    for (let key of Object.keys(shape)) {
      shapeKeyObj[key] = true;
      ++numShapeKeys;
    }

    return SpecValidator.from((it, path) => {
      let ret = null;

      if (it === null || typeof it !== 'object') {
        ret = 'Must be an object';
      } else {
        const itsKeys = Object.keys(it);

        for (const key of itsKeys) {
          if (shapeKeyObj[key] !== true) {
            ret = `Illegal shape key '${key}'`;
            break;
          }
        }

        if (!ret) {
          for (const key of shapeKeys) {
            if (shapeKeyObj[key] !== true) {
              ret = `Illegal shape key '${key}'`;
              break;
            }

            const subPath = _buildSubPath(path, key);

            // XXX
            ret = _checkConstraint(shape[key], (it as any)[key], subPath);

            if (ret) {
              if (path === null) {
                ret = 'Invalid shape';
              }

              break;
            }
          }
        }
      }

      return ret;
    });
  },
  
  extensibleShape(shape: { [key: string]: Validator }): SpecValidator {
    const shapeKeys = Object.keys(shape);

    return SpecValidator.from((it, path) => {
      let ret = null;

      if (it === null || typeof it !== 'object') {
        ret = 'Must be an object';
      } else {
        for (const key of shapeKeys) {
          const subPath = _buildSubPath(path, key);

          ret = _checkConstraint(shape[key], (it as any)[key], subPath);

          if (ret) {
            if (path === null) {
              ret = 'Invalid structure';
            }

            break;
          }
        }
      }

      return ret;
    });
  },

  and(...constraints: Validator[]): SpecValidator {
    return SpecValidator.from((it, path = null) => {
      let ret = null;

      for (let constraint of constraints) {
        // XXX
        const error = _checkConstraint(constraint, it, path);

        if (error) {
          ret = error;

          break;
        }
      }

      return ret;
    });
  },

  or(...constraints: (Validator | { when: Validator, check: Validator })[]): SpecValidator {
    return SpecValidator.from((it, path) => {
      let ret = undefined;

      for (let i = 0; i < constraints.length; ++i) {
        const
          constraint = constraints[i];
        
        if (_isValidator(constraint)) {
          const result = _checkConstraint(
            constraint as Validator, it, path);

          if (result === null) {
            ret = null;
            break;
          } 
        } else if (constraint !== null
          && typeof constraint === 'object'
          
          && (typeof (constraint as any).when === 'function'
            || (constraint as any).when instanceof SpecValidator)
          
          && _isValidator((constraint as any).check)) {

          const whenValid =
            (constraint as any).when instanceof SpecValidator
            ? (constraint as any).when.validate(it, null) === null
            : !!(constraint as any).when(it)

          if (whenValid) {
            ret = _checkConstraint(
              (constraint as any).check, it, path);

            break;
          }
        } else {
          throw new Error('[Spec.or] Arguments must be either validators or objects of type { when: function, check: validator }')
        }
      }

      if (ret === undefined) {
        ret = 'Invalid value';
      }

      return ret;
    });
  },
  
  when(
    condition: Validator,
    validatorIfTrue: Validator,
    validatorIfFalse?: Validator) {

    if (!_isValidator(condition)) {
      throw new Error('[Spec.when] First argument "condition" '
        + 'must either be a function or a SpecValidator');
    } else if (!_isValidator(validatorIfTrue)) {
      throw new Error('[Spec.when] Second argument "validatorIfTrue" '
        + 'must either be a function or a SpecValidator');
    } else if (validatorIfFalse !== undefined
      && !_isValidator(validatorIfFalse)) {
      
      throw new Error('[Spec.when] Thrid argument "validatorIfFalse" '
        + 'must either be a function, a SpecValidator or undefined');
    }

    return SpecValidator.from((it, path) => {
      let ret = null;

      if (_checkConstraint(condition, it) === null) {
        ret = _checkConstraint(validatorIfTrue, it, path);
      } else if (validatorIfFalse) {
        ret = _checkConstraint(validatorIfFalse, it, path);
      }

      return ret;
    });
  },

  in(collection: any): SpecValidator {
    return SpecValidator.from((it, path) => {
      let ret = null;
      
      if (collection instanceof Set) {
        if (!collection.has(it)) {
          ret = 'Invalid value', path;
        }
      } else if (collection
        && typeof collection[Symbol.iterator] === 'function') {
        
        let found = false;
        
        for (let item of collection) {
          if (item === it) {
            found = true;
            break;
          }
        }
        
        if (!found) {
          ret = 'Invalid value';
        }
      }
      
      return ret;
    });
  },

  notIn(collection: any): SpecValidator {
    return SpecValidator.from((it, path) => {
      let ret = null;

      if (collection instanceof Set) {
        if (collection.has(it)) {
          ret = 'Invalid value';
        }
      } else if (collection
        && typeof collection[Symbol.iterator] === 'function') {
        
        let found = false;
        
        for (let item of collection) {
          if (item === it) {
            found = true;
            break;
          }
        }
        
        if (found) {
          ret = 'Invalid value';
        }
      }
      
      return ret;
    });
  },

  lazy(getValidator: () => Validator) {
    let validator: Function = null;

    return SpecValidator.from((it, path) => {
      if (!validator) {
        try {
          const result = getValidator();

          if (typeof result !== 'function' && (!result || typeof result.validate !== 'function')) {
            throw new Error('Lazy validator provider must return a proper validator');
          }

          validator = typeof result === 'function'
            ? result
            : result.validate.bind(result);
        } catch (err) {
          throw new Error(
            '[Spec.lazy] Error while retrieving spec validator: '
              + err);
        }
      }

      return validator(it, path);
    });
  }
};

Object.freeze(Spec);

export default Spec;

// --- Local ----------------------------------------------

/**
 * @hidden 
 */
function _isValidator(it: any) {
  return typeof it === 'function'
    || it instanceof SpecValidator;
}

/**
 * @hidden 
 */
function _buildSubPath(path: String | null, key: string): string | null {
  let ret = null;

  if (path === '') {
    ret = key;
  } else if (path) {
    ret = !path ? key : `${path}.${key}`;
  }

  return ret;
}

/**
 * @hidden
 */
function _checkConstraint(constraint: Validator, it: any, path: null | string = null): null | SpecError {
  let ret = null;

  const result = constraint instanceof SpecValidator
    ? constraint.validate(it, path)
    : (constraint as Function)(it, path);

  const errPath =
    typeof path === 'string'
      && result && typeof result.path === 'string'
      && result.path.length > path.length
      && result.path.startsWith(path)

    ? result.path
    : path;

  if (result === false) {
    ret = createSpecError('Invalid value', errPath);
  } else if (result instanceof SpecError && result.hint) {
    ret = createSpecError(result.hint, errPath)
  } else if (result !== true && result !== null) {
    ret = createSpecError(String(result), errPath);
  }
  
  return ret;
}
