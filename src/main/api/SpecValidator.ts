import SpecError from './SpecError';
import Validator from './Validator';

import createSpecError from '../internal/createSpecError';

class SpecValidator {
  static from(validator: Validator) {
    let ret: SpecValidator;

    if (validator instanceof SpecValidator) {
      ret = validator;
    /*
    } else if (validator
      && typeof validator === 'object'
      && typeof validator.validate === 'function') {

      ret = Object.create(SpecValidator.prototype);
      ret.__validate = validator.validate.bind(validator);
    */
    } else if (typeof validator === 'function') {
      ret = Object.create(SpecValidator.prototype);
      ret.__validate = validator;      
    } else {
      throw new Error('[SpecValidator.from] '
        + "First argument must either be a function or an object with method 'validate'");
    }

    return ret;
  }
  
  private __validate: Function;

  constructor() {
    throw new Error(
      '[SpecValidator.constructor] SpecValidator is not instantiable via constructor '
      + '- please use static method SpecValidator.create or SpecValidator.from instead');
  }

  validate(it: any, path: string | null = ''): SpecError | null {
    let ret = null;

    const result = this.__validate(it, path);

    if (result && result !== true) {
      let errMsg: string | null = null,
        subpath: string | null = path;

      if (typeof result === 'string') {
        errMsg = result;
      } else if (result.hint && typeof result.hint === 'string') {
        errMsg = result.hint;
      } else if (result.message && typeof result.message === 'string') {
        errMsg = result.message;
      } else {
        errMsg = 'Invalid value';
      }

      if (typeof result.path === 'string' && result.path.trim() !== '') {
        subpath = result.path;
      }

      ret = createSpecError(errMsg, subpath);
    }

    return ret;
  }

  usingHint(hint: string): SpecValidator {
    if (typeof hint != 'string') {
      throw new Error("[SpecValidator#usingHint] First argument 'hint' must be a string");
    }

    return SpecValidator.from((it: any, path?: null | string) =>
      this.__validate(it, path) !== null
        ? createSpecError(hint, path)
        : null
    );
  }
};

export default SpecValidator;