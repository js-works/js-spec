import SpecError from './SpecError';
import SpecValidator from './SpecValidator';
import createSpecValidator from '../internal/createSpecValidator';

export default class Spec {
    /**
     * @hidden
     */
    private constructor() {
        throw new Error('[Spec.constructor] Class Spec is not instantiable');
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
            it => typeof it === 'number'
                ? null
                : 'Must be a number'
        ));
    }

    static get string(): SpecValidator {
        return cache.string || (cache.srring = createSpecValidator(
            it => typeof it === 'string'
                ? null
                : 'Must be a string'
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

    static arrayOf(constraint) {
        return createSpecValidator(
            (it, path = null) => {
                let ret = Spec.array(it, path);

                if (ret === null) {
                    for (let i = 0; i < it.length; ++i) {
                        const
                            subPath = _buildSubPath(path, i),
                            result = checkConstraint(constraint, it[i], subPath);

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

    static get func(): SpecValidator {
        return cache.func || (cache.func = createSpecValidator(
            it => typeof it === 'function'
                ? null
                : 'Must be a function'
        ));
    }

    static get integer(): SpecValidator {
        return cache.func || (cache.func = createSpecValidator(
            it => Number.isSafeInteger(it)
                ? null
                : 'Must be a integer'
        ));
    }

    static get positiveInteger(): SpecValidator{
        return cache.positiveInteger || 
            (cache.positiveInteger = createSpecValidator(
                it => Number.isSafeInteger(it) && it > 0
                    ? null
                    : 'Must be a positive integer'
            ));
    }

    static get negativeInteger(): SpecValidator {
        return cache.negativeInteger || 
            (cache.negativeInteger = createSpecValidator(
                it => Number.isSafeInteger(it) && it < 0
                    ? null
                    : 'Must be a negative integer',
            ));
    }

    static get nonNegativeInteger(): SpecValidator {
        return cache.nonNegativeInteger || 
            (cache.nonNegativeInteger = createSpecValidator(
                it => Number.isSafeInteger(it) && it >= 0
                    ? null
                    : 'Must be a non-negative integer'
            ));
    }

    static get nonPositiveInteger(): SpecValidator {
        return cache.nonPositiveInteger || 
            (cache.nonPositiveInteger = createSpecValidator(
                it => Number.isSafeInteger(it) && it <= 0
                    ? null
                    : 'Must be a non-positive integer',
            ));
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
            it => it === undefined && it === null
                ? null
                : 'Must be undefined or null'
        ));
    }

    static optional(constraint): SpecValidator {
        return (it, path) => it === undefined
            ? null
            : checkConstraint(constraint, it, path);
    }

    static nullable(constraint): SpecValidator {
        return (it, path) => it === null
            ? null
            : checkConstraint(constraint, it, path);
    }

    static orNothing(constraint): SpecValidator {
        return (it, path) => it === undefined || it === null
            ? null
            : checkConstraint(constraint, it, path);
    }

    static oneOf(items): SpecValidator {
        return (it, path = null) => !items.every(item => item !== it)
            ? null
            : _createError('Must be one of: ' + items.join(', '), path);
    }

    static match(regex): SpecValidator {
        return (it, path = null) => {
            let ret = null;

            if (typeof it !== 'string') {
                ret = _createError('Must be a string', path);
            } else if (!it.match(regex)) {
                ret = _createError('Must match regex ' + regex, path);
            }

            return ret;
        };
    }

    static valid(condition: (it: any) => boolean): SpecValidator {
        return createSpecValidator((it, path = null) => {
             return condition(it)
                ? null
                : 'Invalid value'
        });
    }

    static instanceOf(type): SpecValidator {
        if (typeof type !== 'function') {
            throw new Error(
                "[Spec.instanceOf] First paramter 'type' must be a function");
        }

        return (it, path = null) => it instanceof type
            ? null
            : _createError('Must be instance of ' + type.name, path);
    }

    static is(value): SpecValidator {
        return createSpecValidator(
            it => it === value        
                ? null
                : 'Must be identical to ' + value,
        );
    }

    static isNot(value): SpecValidator {
        return createSpecValidator(
            it => it !== value        
                ? null
                : 'Must not be identical to ' + value
        );
    }

    static equal(value): SpecValidator {
        return createSpecValidator(
            it => it == value        
                ? null
                : 'Must be equal to ' + value,
        );
    }

    static notEqual(value): SpecValidator {
        return createSpecValidator(
            it => it != value        
                ? null
                : 'Must not be equal to ' + value
        );
    }

    static size(constraint): SpecValidator {
        return (it, path) => {
            let ret = null;

            if (!it || typeof it !== 'object') {
                ret = _createError('Must be an object', path);
            } else {
                const
                    propName = it.length !== undefined ? 'length' : 'size',
                    size = it[propName];

                if (!Number.isSafeInteger(size) || size <= 0) {
                    ret = _createError(
                        `Must have a adequate '${propName}' property`, path);
                } else {
                    ret = checkConstraint(constraint, it, `${path}.${propName}`);
                }
            }

            return ret;
        };
    }

    static greater(value): SpecValidator {
        return createSpecValidator(
            it => it > value        
                ? null
                : 'Must be greater than ' + value
        );
    }

    static greaterOrEqual(value): SpecValidator {
        return createSpecValidator(
            it => it >= value        
                ? null
                : 'Must be greater or equal ' + value
        );
    }

    static less(value): SpecValidator {
        return createSpecValidator(
            it => it < value        
                ? null
                : 'Must be less than ' + value
        );
    }

    static lessOrEqual(value): SpecValidator {
        return createSpecValidator(
            it => it <= value        
                ? null
                : 'Must be less or equal ' + value
        );
    }

    static between(left, right): SpecValidator {
        return createSpecValidator(
            it => it >= left && it <= right        
                ? null
                : `Must be between ${left} and ${right}`,
        );
    }

    static get iterable(): SpecValidator {
        return createSpecValidator(
            it => it && typeof it === 'object'
                && typeof it[Symbol.iterator] === 'function'        
                ? null
                : `Must be iterable`
        );
    }

    static keys(constraint): SpecValidator {
        return (it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'object') {
                ret = _createError('Must be an object', path);
            } else {
                for (let key of Object.keys(it)) {
                    const error = constraint(key);

                    if (error) {
                        ret = _createError(`Key '${key}' is invalid: ${error.shortMessage}`, path);
                        break;
                    }
                }
            }

            return ret;
        };
    }

    static values(constraint): SpecValidator {
        return (it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'object') {
                ret = _createError('Must be an object', null);
            } else {
                for (let key of Object.keys(it)) {
                    const
                        value = it[key],
                        subPath = _buildSubPath(path, key);

                    const error = constraint(value, subPath);

                    if (error) {
                        // TODO
                        ret = error;
                        break;
                    }
                }
            }

            return ret;
        };
    }

    static unique(it, path = null): SpecValidator {
        let ret = Spec.iterable(it, path);

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
 //               ret = _createError('Must be unique', path);
            }
        }

        return ret;
    }

    // TODO - what about additional properties?
    static shape(shape): SpecValidator {
        return (it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'object') {
                ret = _createError('Must be an object', path);
            } else {
                for (const key of Object.keys(shape)) {
                    const subPath = _buildSubPath(path, key);

                    ret = shape[key](it[key], subPath);

                    if (ret) {
                        break;
                    }
                }
            }

            return ret;
        };
    }

    static statics(shape): SpecValidator {
        return (it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'function') {
                ret = _createError('Must be an constructor function', path);
            } else {
                for (const key of Object.keys(shape)) {
                    const subPath = _buildSubPath(path, key);

                    ret = shape[key](it[key], subPath);

                    if (ret) {
                        break;
                    }
                }
            }

            return ret;
        };
    }

    static get any(): SpecValidator {
        return cache.any || (cache.any = createSpecValidator(() => null));
    }

    static and(...constraints): SpecValidator {
        return (it, path = null) => {
            let ret = null;

            for (let constraint of constraints) {
                const error = checkConstraint(constraint, it, path);

                if (error) {
                    ret = error;
                    break;
                }
            }

            return ret;
        };
    }

    static or(...constraints: Function[]): SpecValidator {
        return createSpecValidator(
            it => !constraints.every(constraint =>
                !!checkConstraint(constraint, it, null))
                ? null
                : 'Invalid value'
        );
    }
    
    static in(collection): SpecValidator {
        return (it, path) => {
            let ret = null;
            
            if (collection instanceof Set) {
                if (!collection.has(it)) {
                    ret = _createError('Invalid value', path);
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
                    ret = _createError('Invalid value', path);
                }
            }
            
            return ret;
        };
    }

    static notIn(collection): SpecValidator {
        return (it, path) => {
            let ret = null;
            
            if (collection instanceof Set) {
                if (collection.has(it)) {
                    ret = _createError('Invalid value', path);
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
                    ret = _createError('Invalid value', path);
                }
            }
            
            return ret;
        };
    }
};


Object.freeze(Spec);

// --- Local ----------------------------------------------

/**
 * @hidden 
 */
function _buildSubPath(path, key) {
    let ret = null;

    if (path !== undefined && path !== null) {
        ret = !path ? key : `${path}.${key}`;
    }

    return ret;
}

/**
 * @hidden
 */
function checkConstraint(constraint: Function, it: any, path: String = null) {
    const result = constraint(it, path);

    return result === false
        ? _createError('Invalid value', path)
        : (!result ? null : _createError(result, path));
}

/**
 * @hidden
 */
const cache: any = {};
