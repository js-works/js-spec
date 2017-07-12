import SpecError from './SpecError';
import SpecValidator from './SpecValidator';
import createSpecValidator from './createSpecValidator';
import createSpecError from '../internal/createSpecError';

export default class Spec {
    /**
     * @hidden
     */
    private constructor() {
        throw new Error('[Spec.constructor] Class Spec is not instantiable');
    }

    static get any(): SpecValidator {
        return cache.any || (cache.any = createSpecValidator(() => null));
    }

    static get boolean(): SpecValidator {
        return cache.boolean || (cache.boolean = createSpecValidator(
            it => it === true || it === false
                ? null
                : 'Must be boolean'
        ));
    }

    static get number(): SpecValidator {
        return cache.number || (cache.number = createSpecValidator(
            it => typeof it === 'number' && isFinite(it)
                ? null
                : (Math.abs(it) === Infinity
                    ? 'Must be a finite number'
                    : 'Must be a number')
        ));
    }

    static get positiveNumber(): SpecValidator {
        return cache.positiveNumber || 
            (cache.positiveNumber = createSpecValidator(
                it => typeof it === 'number' && isFinite(it) && it > 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite positive number'
                        : 'Must be a positive number')
            ));
    }

    static get nonPositiveNumber(): SpecValidator {
        return cache.nonPositiveNumber || 
            (cache.nonPositiveNumber = createSpecValidator(
                it => typeof it === 'number' && isFinite(it) && it <= 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite non-positive number'
                        : 'Must be a non-positive number')
            ));
    }

    static get negativeNumber(): SpecValidator {
        return cache.negativeNumber || 
            (cache.negativeNumber = createSpecValidator(
                it => typeof it === 'number' && isFinite(it) && it < 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite negative number'
                        : 'Must be a negative number')
            ));
    }

    static get nonNegativeNumber(): SpecValidator {
        return cache.nonNegativeNumber || 
            (cache.nonNegativeNumber = createSpecValidator(
                it => typeof it === 'number' && isFinite(it) && it >= 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite non-negative number'
                        : 'Must be a non-negative number')
            ));
    }

    static get integer(): SpecValidator {
        return cache.integer || (cache.integer = createSpecValidator(
            it => Number.isSafeInteger(it)
                ? null
                : (Math.abs(it) === Infinity
                    ? 'Must be a finite integer'
                    : 'Must be an integer')
        ));
    }

    static get positiveInteger(): SpecValidator {
        return cache.positiveInteger || 
            (cache.positiveInteger = createSpecValidator(
                it => Number.isSafeInteger(it) && it > 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite positive integer'
                        : 'Must be a positive integer')
            ));
    }

    static get nonPositiveInteger(): SpecValidator {
        return cache.nonPositiveInteger || 
            (cache.nonPositiveInteger = createSpecValidator(
                it => Number.isSafeInteger(it) && it <= 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite non-positive integer'
                        : 'Must be a non-positive integer')
            ));
    }

    static get negativeInteger(): SpecValidator {
        return cache.negativeInteger || 
            (cache.negativeInteger = createSpecValidator(
                it => Number.isSafeInteger(it) && it < 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite negative integer'
                        : 'Must be a negative integer')
            ));
    }

    static get nonNegativeInteger(): SpecValidator {
        return cache.nonNegativeInteger || 
            (cache.nonNegativeInteger = createSpecValidator(
                it => Number.isSafeInteger(it) && it >= 0
                    ? null
                    : (Math.abs(it) === Infinity
                        ? 'Must be a finite non-negative integer'
                        : 'Must be a non-negative integer')
            ));
    }

    static get finite(): SpecValidator {
        return cache.finite || 
            (cache.finite = createSpecValidator(
                it => isFinite(it) 
                    ? null
                    : 'Must be finite'
            ));
    }

    static get infinite(): SpecValidator {
        return cache.infinite || 
            (cache.infinite = createSpecValidator(
                it => it === Number.POSITIVE_INFINITY || it === Number.NEGATIVE_INFINITY
                    ? null
                    : 'Must be infinite'
            ));
    }

    static get string(): SpecValidator {
        return cache.string || (cache.srring = createSpecValidator(
            it => typeof it === 'string'
                ? null
                : 'Must be a string'
        ));
    }

    static get func(): SpecValidator {
        return cache.func || (cache.func = createSpecValidator(
            it => typeof it === 'function'
                ? null
                : 'Must be a function'
        ));
    }

    static get object(): SpecValidator {
        return cache.object || (cache.object = createSpecValidator(
            it => it !== null && typeof it === 'object'
                ? null
                : 'Must be an object'
        ));
    }

    static get array(): SpecValidator {
        return cache.array || (cache.array = createSpecValidator(
            it => Array.isArray(it)
                ? null
                : 'Must be an array'
        ));
    }

    static get iterable(): SpecValidator {
        return createSpecValidator(
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
            createSpecValidator((it, path) => {
                let ret: any = Spec.iterable(it, path);

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
        return cache.date || (cache.date = createSpecValidator(
            it => it instanceof Date && !isNaN(it.getDate()) 
                ? null
                : 'Must be a valid date'
        ))
    }
    
    static get something(): SpecValidator {
        return cache.something || (cache.something = createSpecValidator(
            it => it !== undefined && it !== null
                ? null
                : 'Must not be undefined or null'
        ));
    }

    static get nothing(): SpecValidator {
        return cache.nothing || (cache.nothing = createSpecValidator(
            it => it === undefined || it === null
                ? null
                : 'Must be undefined or null'
        ));
    }

    static get hasKeys(): SpecValidator {
        return cache.hasKeys || (cache.hasKeys = createSpecValidator(
            it => it === undefined || it === null || Object.keys(it).length === 0
                ? 'Must have Keys'
                : null
        ));
    }

    static is(value: any): SpecValidator {
        return createSpecValidator(
            it => it === value        
                ? null
                : 'Must be identical to ' + value,
        );
    }

    static isNot(value: any): SpecValidator {
        return createSpecValidator(
            it => it !== value        
                ? null
                : 'Must not be identical to ' + value
        );
    }

    static equal(value: any): SpecValidator {
        return createSpecValidator(
            it => it == value        
                ? null
                : 'Must be equal to ' + value,
        );
    }

    static notEqual(value: any): SpecValidator {
        return createSpecValidator(
            it => it != value        
                ? null
                : 'Must not be equal to ' + value
        );
    }

    static optional(constraint: Function): SpecValidator {
        return createSpecValidator(
            (it, path) => it === undefined
                ? null
                : constraint(it, path));
    }

    static nullable(constraint: Function): SpecValidator {
        return createSpecValidator(
            (it, path) => it === null
                ? null
                : constraint(it, path));
    }

    static orNothing(constraint: Function): SpecValidator {
        return createSpecValidator((it, path) =>
            it === undefined || it === null
                ? null
                : constraint(it, path));
    }

    static oneOf(...items: any[]): SpecValidator {
        return createSpecValidator(it =>
            !items.every(item => item !== it)
                ? null
                : 'Must be one of: ' + items.join(', '));
    }

    static instanceOf(type: Function): SpecValidator {
        if (typeof type !== 'function') {
            throw new Error(
                "[Spec.instanceOf] First paramter 'type' must be a function");
        }

        return createSpecValidator((it, path = null) => it instanceof type
            ? null
            : 'Must be instance of ' + type.name);
    }
    
    static arrayOf(constraint: Function): SpecValidator {
        return createSpecValidator(
            (it, path = null) => {
                let ret = Spec.array(it, path);

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
        return createSpecValidator(it => {
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
        return createSpecValidator((it, path = null) => {
             return condition(it)
                ? null
                : 'Invalid value'
        });
    }

    static size(constraint: Function): SpecValidator {
        return createSpecValidator((it, path) => {
            let ret = null;

            if (it === null
                || typeof it !== 'object' && typeof it !== 'string') {
            
                ret = 'Must be something with size/length';
            } else {
                const
                    propName = Array.isArray(it) || typeof it === 'string'
                        ? 'length'
                        : 'size',
                    
                    size = it[propName];

                if (!Number.isSafeInteger(size) || size <= 0) {
                    ret = `Must have a adequate '${propName}' property`;
                } else {
                    ret = _checkConstraint(constraint, size, _buildSubPath(path, propName));
                }
            }

            return ret;
        });
    }

    static greater(value: any): SpecValidator {
        return createSpecValidator(
            it => it > value        
                ? null
                : 'Must be greater than ' + value
        );
    }

    static greaterOrEqual(value: any): SpecValidator {
        return createSpecValidator(
            it => it >= value        
                ? null
                : 'Must be greater or equal ' + value
        );
    }

    static less(value: any): SpecValidator {
        return createSpecValidator(
            it => it < value        
                ? null
                : 'Must be less than ' + value
        );
    }

    static lessOrEqual(value: any): SpecValidator {
        return createSpecValidator(
            it => it <= value        
                ? null
                : 'Must be less or equal ' + value
        );
    }

    static between(left: any, right: any): SpecValidator {
        return createSpecValidator(
            it => it >= left && it <= right        
                ? null
                : `Must be between ${left} and ${right}`
        );
    }

    static keys(constraint: Function): SpecValidator {
        return createSpecValidator((it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'object') {
                ret = 'Must be an object';
            } else {
                for (let key of Object.keys(it)) {
                    const error = constraint(key);

                    if (error) { /// XXX
                        ret = `Key '${key}' is invalid: ${error.shortMessage}`;
                        break;
                    }
                }
            }

            return ret;
        });
    }

    static values(constraint: Function): SpecValidator {
        return createSpecValidator((it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'object') {
                ret = 'Must be an object';
            } else {
                for (let key of Object.keys(it)) {
                    const
                        value = it[key],
                        subPath = _buildSubPath(path, key);
// XXX
                    const result = constraint(value, subPath);

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

    // TODO - what about additional properties?
    static shape(shape: { [key: string]: Function }): SpecValidator {
        return createSpecValidator((it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'object') {
                ret = 'Must be an object';
            } else {
                for (const key of Object.keys(shape)) {
                    const subPath = _buildSubPath(path, key);

                    // XXX
                    ret = shape[key]((it as any)[key], subPath);

                    if (ret) {
                        break;
                    }
                }
            }

            return ret;
        });
    }

    static statics(shape: { [key: string] : Function }): SpecValidator {
        return createSpecValidator((it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'function') {
                ret = 'Must be an constructor function';
            } else {
                for (const key of Object.keys(shape)) {
                    const subPath = _buildSubPath(path, key);

                    // XXX
                    ret = shape[key]((it as any)[key], subPath);

                    if (ret) {
                        break;
                    }
                }
            }

            return ret;
        });
    }

    static and(...constraints: Function[]): SpecValidator {
        return createSpecValidator((it, path = null) => {
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

    static or(...constraints: Function[]): SpecValidator {
        return createSpecValidator(
            it => !constraints.every(constraint =>
                // XXX
                _checkConstraint(constraint, it, null) !== null)
                ? null
                : 'Invalid value'
        );
    }
    
    static in(collection: any): SpecValidator {
        return createSpecValidator((it, path) => {
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
        return createSpecValidator((it, path) => {
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
};


Object.freeze(Spec);

// --- Local ----------------------------------------------

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
function _checkConstraint(constraint: Function, it: any, path: string | null = null): null | SpecError {
    let ret = null;

    const result = constraint(it, path);

    if (result === false) {
        ret = createSpecError('Invalid value', path);
    } else if (result instanceof SpecError && result.shortMessage) {
        ret = createSpecError(result.shortMessage, path)
    } else if (result !== true && result !== null) {
        ret = createSpecError(String(result), path);
    }
    
    return ret;
}

/**
 * @hidden
 */
const cache: any = {};
