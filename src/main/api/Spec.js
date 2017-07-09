import SpecError from './SpecError.js';

const Spec = {
    boolean(it, path = null) {
        return it === true || it === false
            ? null
            : createError('Must be boolean', path);
    },

    number(it, path = null) {
        return typeof it === 'number'
            ? null
            : createError('Must be a number', path);
    },

    string(it, path = null) {
        return typeof it === 'string'
            ? null
            : createError('Must be a string', path);
    },

    object(it, path = null) {
        return it !== null && typeof it === 'object'
            ? null
            : createError('Must be an object', path);
    },

    array(it, path = null) {
        return Array.isArray(it)
            ? null
            : createError('Must be an array', path);
    },

    arrayOf(constraint) {
        return (it, path = null) => {
            let ret = null;

            if (!Array.isArray(it)) {
                ret = createError('Must be an array', path);
            } else {
                for (let i = 0; i < it.length; ++i) {
                    const
                        path = !path ? null : `${path}.${i}`,
                        result = constraint(it, path);

                    if (result === false) {
                        ret = createError('Invalid value', path);
                    } else if (result) {
                        ret = createError(result, path);
                    }
                }
            }

            return ret;
        };
    },

    func(it, path = null) {
        return typeof it === 'function'
            ? null
            : createError('Must be a function', path);
    },

    integer(it, path = null) {
        return Number.isSafeInteger(it)
            ? null
            : createError('Must be an integer', path);
    },

    positiveInteger(it, path = null) {
        return Number.isSafeInteger(it) && it > 0
            ? null
            : createError('Must be a positve integer', path);
    },

    negativeInteger(it, path = null) {
        return Number.isSafeInteger(it) && it < 0
            ? null
            : createError('Must be a negative integer', path);
    },

    nonNegativeInteger(it, path = null) {
        return Number.isSafeInteger(it) && it >= 0
            ? null
            : createError('Must be a non-negative integer', path);
    },

    nonPositiveInteger(it, path = null) {
        return Number.isSafeInteger(it) && it <= 0
            ? null
            : createError('Must be a non-positive integer', path);
    },

    something(it, path) {
        return it === undefined || it === null
            ? createError('Must not be ' + it, path)
            : null;
    },

    nothing(it, path) {
        return it !== undefined || it !== null
            ? createError('Must be undefined or null', path)
            : null;
    },

    optional(constraint) {
        return (it, path) => it === undefined
            ? null
            : constraint(it, path);
    },

    nullable(constraint) {
        return (it, path) => it === null
            ? null
            : constraint(it, path);
    },

    orNothing(constraint) {
        return (it, path) => it === undefined || it === null
            ? null
            : constraint(it, path);
    },

    oneOf(items) {
        return (it, path = null) => !items.every(item => item !== it)
            ? null
            : createError('Must be one of: ' + items.join(', '), path);
    },

    match(regex) {
        return (it, path = null) => {
            let ret = null;

            if (typeof it !== 'string') {
                ret = createError('Must be a string', path);
            } else if (!it.match(regex)) {
                ret = createError('Must match regex ' + regex, path);
            }

            return ret;
        };
    },

    valid(condition, errMsg = null) {
        return (it, path = null) => {
            let ret = null,
                result = condition(it);

            if (result instanceof SpecError) {
                ret = createError(result.shortMessage, path);
            } else if (result !== null && result !== undefined && !result) {
                ret = createError(errMsg || 'Invalid value', path);
            }

            return ret;
        };
    },

    instanceOf(type) {
        if (typeof type !== 'function') {
            throw new Error(
                "[Spec.instanceOf] First paramter 'type' must be a function");
        }

        return (it, path = null) => it instanceof type
            ? null
            : createError('Must be instance of ' + type.name, path);
    },

    is(value) {
        return (it, path = null) => it === value
            ? null
            : createError('Must be identical to ' + value, path);
    },

    isNot(value) {
        return (it, path = null) => it !== value
            ? null
            : createError('Must be not be identical to ' + value, path);
    },

    equal(value) {
        return (it, path = null) => it == value
            ? null
            : createError('Must be equal to ' + value, path);
    },

    notEqual(value) {
        return (it, path = null) => it != value
            ? null
            : createError('Must not be equal to ' + value, path);
    },

    length(constraint) {
        return specNonNegativeIntegerProp(constraint, 'length');
    },

    size(constraint) {
        return specNonNegativeIntegerProp(constraint, 'size');
    },

    greater(value) {
        return (it, path) => it > value
            ? null
            : createError('Must be greater than ' + value, path);
    },

    greaterOrEqual(value) {
        return (it, path) => it >= value
            ? null
            : createError('Must be greater or equal ' + value, path);
    },

    less(value) {
        return (it, path) => it < value
            ? null
            : createError('Must be less than ' + value, path);
    },

    lessOrEqual(value) {
        return (it, path) => it <= value
            ? null
            : createError('Must be less or equal ' + value, path);
    },

    between(left, right) {
        return (it, path) => it >= left && it <= right
            ? null
            : createError(`Must be between ${left} and ${right}`, path);
    },

    iterable(it, path = null) {
        return it !== null
            && typeof it === 'object'
            && typeof it[Symbol.iterator] === 'function'
            ? null
            : createError('Must be iterable', path);
    },

    keys(constraint) {
        return (it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'object') {
                ret = createError('Must be an object', path);
            } else {
                for (let key of Object.keys(it)) {
                    const error = constraint(key);

                    if (error) {
                        ret = createError(`Key '${key}' is invalid: ${error.shortMessage}`, path);
                        break;
                    }
                }
            }

            return ret;
        };
    },

    values(constraint) {
        return (it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'object') {
                ret = createError('Must be an object');
            } else {
                for (let key of Object.keys(it)) {
                    const
                        value = it[key],
                        subPath = buildSubPath(path, key);

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
    },

    unique(it, path = null) {
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
                ret = createError('Must be unique', path);
            }
        }

        return ret;
    },

    // TODO - what about additional properties?
    shape(shape) {
        return (it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'object') {
                ret = createError('Must be an object', path);
            } else {
                for (const key of Object.keys(shape)) {
                    const subPath = buildSubPath(path, key);

                    ret = shape[key](it[key], subPath);

                    if (ret) {
                        break;
                    }
                }
            }

            return ret;
        };
    },

    statics(shape) {
        return (it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'function') {
                ret = createError('Must be an constructor function', path);
            } else {
                for (const key of Object.keys(shape)) {
                    const subPath = buildSubPath(path, key);

                    ret = shape[key](it[key], subPath);

                    if (ret) {
                        break;
                    }
                }
            }

            return ret;
        };
    },


    any() {
        return null;
    },

    and(...constraints) {
        return (it, path = null) => {
            let ret = null;

            for (let constraint of constraints) {
                const error = constraint(it, path);

                if (error) {
                    ret = error;
                    break;
                }
            }

            return ret;
        };
    },

    or(...constraints) {
        let ret = null;

        if (constraints && typeof constraints[Symbol.iterator] === 'function') {
            ret = (it, path = null) =>
                !constraints.every(constraint => constraint(it, path))
                    ? null
                    : createError('Invalid value', path);
        } else if (constraints !== null && typeof constraints === 'object') {
            const keys = Object.keys(constraints);

            ret = (it, path = null) => {
                let foundSome = false;

                for (let key of keys) {
                    const
                        constraint = constraints[key],
                        result = constraint(it, path);

                    if (result === null) {
                        foundSome = true;
                        break;
                    }
                }

                return foundSome
                    ? null
                    : createError(
                        'Invalid value (allowed would be <'
                        + keys.join('> or <')
                        + '>)', path);
            };
        } else {
            // TODO
        }

        return ret;
    },
    
    in(collection) {
        return (it, path) => {
            let ret = null;
            
            if (collection instanceof Set) {
                if (!collection.has(it)) {
                    ret = createError('Invalid value', path);
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
                    ret = createError('Invalid value', path);
                }
            }
            
            return ret;
        };
    },

    notIn(collection) {
        return (it, path) => {
            let ret = null;
            
            if (collection instanceof Set) {
                if (collection.has(it)) {
                    ret = createError('Invalid value', path);
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
                    ret = createError('Invalid value', path);
                }
            }
            
            return ret;
        };
    }
};


Object.freeze(Spec);

export default Spec;

// --- Local functions ----------------------------------------------

function buildSubPath(path, key) {
    let ret = null;

    if (path !== undefined && path !== null) {
        ret = !path ? key : `${path}.${key}`;
    }

    return ret;
}

function createError(errMsg, path)  {
    const
        fullErrMsg =
            'Constraint violation'
                + (path ? ` at '${path}'` : '')
                + `: ${errMsg}`;

    return new SpecError(fullErrMsg, errMsg, path);
}


function specNonNegativeIntegerProp(propName, constraint) {
    return (it, path) => {
        let ret = null;

        if (!it || typeof it !== 'object') {
            ret = createError('Must be an object', path);
        } else {
            const value = it[propName];

            if (!Number.isSafeInteger(value) || value <= 0) {
                ret = createError(
                    `Must have a adequate '${propName}' property`, path);
            } else {
                ret = constraint(it, `${path}.${propName}`);
            }
        }

        return ret;
    };
}
