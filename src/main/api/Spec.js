import SpecError from './SpecError.js';

const Spec = {
    boolean(it, path = null) {
        return it === true || it === false
            ? null
            : _createError('Must be boolean', path);
    },

    number(it, path = null) {
        return typeof it === 'number'
            ? null
            : _createError('Must be a number', path);
    },

    string(it, path = null) {
        return typeof it === 'string'
            ? null
            : _createError('Must be a string', path);
    },

    object(it, path = null) {
        return it !== null && typeof it === 'object'
            ? null
            : _createError('Must be an object', path);
    },

    array(it, path = null) {
        return Array.isArray(it)
            ? null
            : _createError('Must be an array', path);
    },

    arrayOf(constraint) {
        return (it, path = null) => {
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
        };
    },

    func(it, path = null) {
        return typeof it === 'function'
            ? null
            : _createError('Must be a function', path);
    },

    integer(it, path = null) {
        return Number.isSafeInteger(it)
            ? null
            : _createError('Must be an integer', path);
    },

    positiveInteger(it, path = null) {
        return Number.isSafeInteger(it) && it > 0
            ? null
            : _createError('Must be a positve integer', path);
    },

    negativeInteger(it, path = null) {
        return Number.isSafeInteger(it) && it < 0
            ? null
            : _createError('Must be a negative integer', path);
    },

    nonNegativeInteger(it, path = null) {
        return Number.isSafeInteger(it) && it >= 0
            ? null
            : _createError('Must be a non-negative integer', path);
    },

    nonPositiveInteger(it, path = null) {
        return Number.isSafeInteger(it) && it <= 0
            ? null
            : _createError('Must be a non-positive integer', path);
    },

    something(it, path) {
        return it === undefined || it === null
            ? _createError('Must not be ' + it, path)
            : null;
    },

    nothing(it, path) {
        return it !== undefined || it !== null
            ? _createError('Must be undefined or null', path)
            : null;
    },

    optional(constraint) {
        return (it, path) => it === undefined
            ? null
            : checkConstraint(constraint, it, path);
    },

    nullable(constraint) {
        return (it, path) => it === null
            ? null
            : checkConstraint(constraint, it, path);
    },

    orNothing(constraint) {
        return (it, path) => it === undefined || it === null
            ? null
            : checkConstraint(constraint, it, path);
    },

    oneOf(items) {
        return (it, path = null) => !items.every(item => item !== it)
            ? null
            : _createError('Must be one of: ' + items.join(', '), path);
    },

    match(regex) {
        return (it, path = null) => {
            let ret = null;

            if (typeof it !== 'string') {
                ret = _createError('Must be a string', path);
            } else if (!it.match(regex)) {
                ret = _createError('Must match regex ' + regex, path);
            }

            return ret;
        };
    },

    valid(condition, errMsg = null) {
        return (it, path = null) => {
            let ret = null,
                result = condition(it);

            if (result instanceof SpecError) {
                ret = _createError(result.shortMessage, path);
            } else if (result !== null && result !== undefined && !result) {
                ret = _createError(errMsg || 'Invalid value', path);
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
            : _createError('Must be instance of ' + type.name, path);
    },

    is(value) {
        return (it, path = null) => it === value
            ? null
            : _createError('Must be identical to ' + value, path);
    },

    isNot(value) {
        return (it, path = null) => it !== value
            ? null
            : _createError('Must be not be identical to ' + value, path);
    },

    equal(value) {
        return (it, path = null) => it == value
            ? null
            : _createError('Must be equal to ' + value, path);
    },

    notEqual(value) {
        return (it, path = null) => it != value
            ? null
            : _createError('Must not be equal to ' + value, path);
    },

    length(constraint) {
        return _specNonNegativeIntegerProp(constraint, 'length');
    },

    size(constraint) {
        return _specNonNegativeIntegerProp(constraint, 'size');
    },

    greater(value) {
        return (it, path) => it > value
            ? null
            : _createError('Must be greater than ' + value, path);
    },

    greaterOrEqual(value) {
        return (it, path) => it >= value
            ? null
            : _createError('Must be greater or equal ' + value, path);
    },

    less(value) {
        return (it, path) => it < value
            ? null
            : _createError('Must be less than ' + value, path);
    },

    lessOrEqual(value) {
        return (it, path) => it <= value
            ? null
            : _createError('Must be less or equal ' + value, path);
    },

    between(left, right) {
        return (it, path) => it >= left && it <= right
            ? null
            : _createError(`Must be between ${left} and ${right}`, path);
    },

    iterable(it, path = null) {
        return it !== null
            && typeof it === 'object'
            && typeof it[Symbol.iterator] === 'function'
            ? null
            : _createError('Must be iterable', path);
    },

    keys(constraint) {
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
    },

    values(constraint) {
        return (it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'object') {
                ret = _createError('Must be an object');
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
                ret = _createError('Must be unique', path);
            }
        }

        return ret;
    },

    // TODO - what about additional properties?
    shape(shape) {
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
    },

    statics(shape) {
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
    },


    any() {
        return null;
    },

    and(...constraints) {
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
    },

    or(...constraints) {
        let ret = null;

        if (constraints && typeof constraints[Symbol.iterator] === 'function') {
            ret = (it, path = null) =>
                !constraints.every(constraint => constraint(it, path))
                    ? null
                    : _createError('Invalid value', path);
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
                    : _createError(
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
    },

    notIn(collection) {
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

export default Spec;

// --- Local functions ----------------------------------------------

function _buildSubPath(path, key) {
    let ret = null;

    if (path !== undefined && path !== null) {
        ret = !path ? key : `${path}.${key}`;
    }

    return ret;
}

function _createError(errMsg, path)  {
    const
        fullErrMsg =
            'Constraint violation'
                + (path ? ` at '${path}'` : '')
                + `: ${errMsg}`;

    return new SpecError(fullErrMsg, errMsg, path);
}

function _specNonNegativeIntegerProp(propName, constraint) {
    return (it, path) => {
        let ret = null;

        if (!it || typeof it !== 'object') {
            ret = _createError('Must be an object', path);
        } else {
            const value = it[propName];

            if (!Number.isSafeInteger(value) || value <= 0) {
                ret = _createError(
                    `Must have a adequate '${propName}' property`, path);
            } else {
                ret = checkConstraint(constraint, it, `${path}.${propName}`);
            }
        }

        return ret;
    };
}

function checkConstraint(constraint, it, path) {
    const result = constraint(it, path);

    return result === false
        ? _createError('Invalid value', path)
        : (!result ? null : _createError(result, path));
}