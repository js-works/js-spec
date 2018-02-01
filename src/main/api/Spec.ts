import SpecError from './SpecError';
import SpecValidator from './SpecValidator';
import Validator from './Validator';
import createSpecError from '../internal/createSpecError';

export default class Spec {
    /**
     * @hidden
     */
    private constructor() {
        throw new Error('[Spec.constructor] Class Spec is not instantiable');
    }

    static get any(): SpecValidator {
        return cache.any || (cache.any = SpecValidator.from(() => null));
    }

    static get boolean(): SpecValidator {
        return cache.boolean || (cache.boolean = SpecValidator.from(
            it => it === true || it === false
                ? null
                : 'Must be boolean'
        ));
    }

    static get number(): SpecValidator {
        return cache.number || (cache.number = SpecValidator.from(
            it => typeof it === 'number'
                ? null
                : 'Must be a number')
        );
    }

    static get positiveNumber(): SpecValidator {
        return cache.positiveNumber || 
            (cache.positiveNumber = SpecValidator.from(
                it => typeof it === 'number' && it > 0
                    ? null
                    : 'Must be a positive number')
            );
    }

    static get nonpositiveNumber(): SpecValidator {
        return cache.nonpositiveNumber || 
            (cache.nonpositiveNumber = SpecValidator.from(
                it => typeof it === 'number' && it <= 0
                    ? null
                    : 'Must be a nonpositive number')
            );
    }

    static get negativeNumber(): SpecValidator {
        return cache.negativeNumber || 
            (cache.negativeNumber = SpecValidator.from(
                it => typeof it === 'number' && it < 0
                    ? null
                    : 'Must be a negative number')
            );
    }

    static get nonnegativeNumber(): SpecValidator {
        return cache.nonnegativeNumber || 
            (cache.nonnegativeNumber = SpecValidator.from(
                it => typeof it === 'number' && it >= 0
                    ? null
                    : 'Must be a nonnegative number')
            );
    }

    static get float(): SpecValidator {
        return cache.float || (cache.float = SpecValidator.from(
            it => typeof it === 'number' && isFinite(it)
                ? null
                : (Math.abs(it) === Infinity
                    ? 'Must be a finite number'
                    : 'Must be a number')
        ));
    }

    static get positiveFloat(): SpecValidator {
        return cache.positiveFloat || 
            (cache.positiveFloat = SpecValidator.from(
                it => typeof it === 'number' && isFinite(it) && it > 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite positive number'
                        : 'Must be a positive number')
            ));
    }

    static get nonpositiveFloat(): SpecValidator {
        return cache.nonpositiveFloat || 
            (cache.nonpositiveFloat = SpecValidator.from(
                it => typeof it === 'number' && isFinite(it) && it <= 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite nonpositive number'
                        : 'Must be a nonpositive number')
            ));
    }

    static get negativeFloat(): SpecValidator {
        return cache.negativeFloat || 
            (cache.negativeFloat = SpecValidator.from(
                it => typeof it === 'number' && isFinite(it) && it < 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite negative number'
                        : 'Must be a negative number')
            ));
    }

    static get nonnegativeFloat(): SpecValidator {
        return cache.nonnegativeFloat || 
            (cache.nonnegativeFloat = SpecValidator.from(
                it => typeof it === 'number' && isFinite(it) && it >= 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite nonnegative number'
                        : 'Must be a nonnegative number')
            ));
    }

    static get integer(): SpecValidator {
        return cache.integer || (cache.integer = SpecValidator.from(
            it => Number.isInteger(it)
                ? null
                : (Math.abs(it) === Infinity
                    ? 'Must be a finite integer'
                    : 'Must be an integer')
        ));
    }

    static get positiveInteger(): SpecValidator {
        return cache.positiveInteger || 
            (cache.positiveInteger = SpecValidator.from(
                it => Number.isInteger(it) && it > 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite positive integer'
                        : 'Must be a positive integer')
            ));
    }

    static get nonpositiveInteger(): SpecValidator {
        return cache.nonpositiveInteger || 
            (cache.nonpositiveInteger = SpecValidator.from(
                it => Number.isInteger(it) && it <= 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite nonpositive integer'
                        : 'Must be a nonpositive integer')
            ));
    }

    static get negativeInteger(): SpecValidator {
        return cache.negativeInteger || 
            (cache.negativeInteger = SpecValidator.from(
                it => Number.isInteger(it) && it < 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite negative integer'
                        : 'Must be a negative integer')
            ));
    }

    static get nonnegativeInteger(): SpecValidator {
        return cache.nonnegativeInteger || 
            (cache.nonnegativeInteger = SpecValidator.from(
                it => Number.isInteger(it) && it >= 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite nonnegative integer'
                        : 'Must be a nonnegative integer')
            ));
    }

    static get finite(): SpecValidator {
        return cache.finite || 
            (cache.finite = SpecValidator.from(
                it => isFinite(it) 
                    ? null
                    : 'Must be finite'
            ));
    }

    static get infinite(): SpecValidator {
        return cache.infinite || 
            (cache.infinite = SpecValidator.from(
                it => it === Number.POSITIVE_INFINITY || it === Number.NEGATIVE_INFINITY
                    ? null
                    : 'Must be infinite'
            ));
    }

    static get string(): SpecValidator {
        return cache.string || (cache.srring = SpecValidator.from(
            it => typeof it === 'string'
                ? null
                : 'Must be a string'
        ));
    }

    static get function(): SpecValidator {
        return cache.func || (cache.func = SpecValidator.from(
            it => typeof it === 'function'
                ? null
                : 'Must be a function'
        ));
    }

    static get object(): SpecValidator {
        return cache.object || (cache.object = SpecValidator.from(
            it => it !== null && typeof it === 'object'
                ? null
                : 'Must be an object'
        ));
    }

    static get array(): SpecValidator {
        return cache.array || (cache.array = SpecValidator.from(
            it => Array.isArray(it)
                ? null
                : 'Must be an array'
        ));
    }

    static get iterable(): SpecValidator {
        return SpecValidator.from(
            it => typeof it === 'string'
                || (it
                    && typeof it === 'object'
                    && typeof it[Symbol.iterator] === 'function') 
                ? null
                : 'Must be iterable'
        );
    }

    static get unique(): SpecValidator {
        return cache.unique || (cache.unique =
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
            }));
    }

    static get date(): SpecValidator {
        return cache.date || (cache.date = SpecValidator.from(
            it => it instanceof Date && !isNaN(it.getDate()) 
                ? null
                : 'Must be a valid date'
        ))
    }
    
    static get something(): SpecValidator {
        return cache.something || (cache.something = SpecValidator.from(
            it => it !== undefined && it !== null
                ? null
                : 'Must not be undefined or null'
        ));
    }

    static get nothing(): SpecValidator {
        return cache.nothing || (cache.nothing = SpecValidator.from(
            it => it === undefined || it === null
                ? null
                : 'Must be undefined or null'
        ));
    }

    static get hasSomeKeys(): SpecValidator {
        return cache.hasSomeKeys || (cache.hasSomeKeys = SpecValidator.from(
            it => it === undefined || it === null || Object.keys(it).length === 0
                ? 'Must have Keys'
                : null
        ));
    }

    static get validator(): SpecValidator {
        return cache.validator || (cache.validator = SpecValidator.from(
            it => typeof it === 'function' || it instanceof SpecValidator
                ? null
                : 'Must either be a function or a instance of SpecValidator'

         //       || it && typeof it.validate === 'function'
         //           ? null
         //           : "Must be a function or an object with funtion 'validate'"
        ));
    }

    static is(value: any): SpecValidator {
        return SpecValidator.from(
            it => it === value        
                ? null
                : 'Must be identical to ' + value,
        );
    }

    static isNot(value: any): SpecValidator {
        return SpecValidator.from(
            it => it !== value        
                ? null
                : 'Must not be identical to ' + value
        );
    }

    static equal(value: any): SpecValidator {
        return SpecValidator.from(
            it => it == value        
                ? null
                : 'Must be equal to ' + value,
        );
    }

    static notEqual(value: any): SpecValidator {
        return SpecValidator.from(
            it => it != value        
                ? null
                : 'Must not be equal to ' + value
        );
    }

    static optional(constraint: Validator): SpecValidator {
        return SpecValidator.from(
            (it, path) => it === undefined
                ? null
                : _checkConstraint(constraint, it, path));
    }

    static nullable(constraint: Validator): SpecValidator {
        return SpecValidator.from(
            (it, path) => it === null
                ? null
                : _checkConstraint(constraint, it, path));
    }

    static nullableOptional(constraint: Validator): SpecValidator {
        return SpecValidator.from((it, path) =>
            it === undefined || it === null
                ? null
                : _checkConstraint(constraint, it, path));
    }

    static oneOf(...items: any[]): SpecValidator {
        return SpecValidator.from(it =>
            !items.every(item => item !== it)
                ? null
                : 'Must be one of: ' + items.join(', '));
    }

    static instanceOf(type: Function): SpecValidator {
        if (typeof type !== 'function') {
            throw new Error(
                "[Spec.instanceOf] First paramter 'type' must be a function");
        }

        return SpecValidator.from((it, path = null) => it instanceof type
            ? null
            : 'Must be instance of ' + type.name);
    }
    
    static arrayOf(constraint: Validator): SpecValidator {
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
    }

    static match(regex: RegExp): SpecValidator {
        return SpecValidator.from(it => {
            let ret = null;

            if (typeof it !== 'string') {
                ret = 'Must be a string';
            } else if (!it.match(regex)) {
                ret = 'Must match regex ' + regex;
            }

            return ret;
        });
    }

    static valid(condition: (it: any) => boolean): SpecValidator {
        return SpecValidator.from((it, path = null) => {
             return condition(it)
                ? null
                : 'Invalid value'
        });
    }

    static prop(propName: string, constraint: Validator): SpecValidator {
        return SpecValidator.from((it, path) => {
            let ret = null;

            const prop =
                it === undefined || it === null
                ? undefined
                : it[propName];           

            return _checkConstraint(constraint, prop, _buildSubPath(path, propName));
        });
    }

    static greater(value: any): SpecValidator {
        return SpecValidator.from(
            it => it > value        
                ? null
                : 'Must be greater than ' + value
        );
    }

    static greaterOrEqual(value: any): SpecValidator {
        return SpecValidator.from(
            it => it >= value        
                ? null
                : 'Must be greater or equal ' + value
        );
    }

    static less(value: any): SpecValidator {
        return SpecValidator.from(
            it => it < value        
                ? null
                : 'Must be less than ' + value
        );
    }

    static lessOrEqual(value: any): SpecValidator {
        return SpecValidator.from(
            it => it <= value        
                ? null
                : 'Must be less or equal ' + value
        );
    }

    static between(left: any, right: any, excludeLeft: boolean = false,
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
    }

    static keysOf(constraint: Validator): SpecValidator {
        return SpecValidator.from((it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'object') {
                ret = 'Must be an object';
            } else {
                for (let key of Object.keys(it)) {
                    const error = _checkConstraint(constraint, key, path);

                    if (error) { /// XXX
                        ret = `Key '${key}' is invalid => ${error.hint}`;
                        break;
                    }
                }
            }

            return ret;
        });
    }

    static valuesOf(constraint: Validator): SpecValidator {
        return SpecValidator.from((it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'object') {
                ret = 'Must be an object';
            } else {
                for (let key of Object.keys(it)) {
                    const
                        value = it[key],
                        subPath = _buildSubPath(path, key);
// XXX
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
    }

    static shape(shape: { [key: string]: Validator }): SpecValidator {
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
    }
    
    static extensibleShape(shape: { [key: string]: Validator }): SpecValidator {
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
    }

    static and(...constraints: Validator[]): SpecValidator {
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
    }

    static or(...constraints: (Validator | { when: Validator, check: Validator })[]): SpecValidator {
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
    }    

    static in(collection: any): SpecValidator {
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
    }

    static notIn(collection: any): SpecValidator {
        return SpecValidator.from((it, path) => {
            let ret = null;
 // XXX           
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
    }

    static lazy(getValidator: () => Validator) {
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

// --- Local ----------------------------------------------

/**
 * @hidden 
 */
function _isValidator(it: any) {
    return typeof it === 'function'
        || it instanceof SpecValidator;
        // || it && typeof it.validate === 'function';    
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

/**
 * @hidden
 */
const cache: any = {};
