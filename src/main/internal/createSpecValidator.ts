import SpecValidator from '../api/SpecValidator';
import SpecError from '../api/SpecError';
import createSpecError from './createSpecError';

/**
 * @hidden
 */
export default function createSpecValidator(
    fn: (it: any, path: string | null) => string | null): SpecValidator {
    
    const validator: SpecValidator = ((it: any, path: string | null) => {
        const errMsg = fn(it, path);

        return errMsg !== null
            ? createSpecError(errMsg, path)
            : null
    }) as SpecValidator;


    validator.withHint = (hint: string): SpecValidator => {
        return createSpecValidator((it: any, path: string | null) =>
            fn(it, path) !== null
                ? hint
                : null
        );
    };

    return validator;
}