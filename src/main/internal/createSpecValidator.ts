import SpecValidator from '../api/SpecValidator';
import SpecError from '../api/SpecError';
import createSpecError from './createSpecError';

/**
 * @hidden
 */
export default function createSpecValidator(
    fn: (it: any, path: string | null) => any): SpecValidator {
    
    const validator = ((it: any, path: string | null) => {
        let ret = null;

        const result = fn(it, path);

        if (result && result !== true) {
            let
                errMsg = null,
                subpath = path;

            if (typeof result === 'string') {
                errMsg = result;
            } else if (result.shortMessage && typeof result.shortMessage === 'string') {
                errMsg = result.shortMessage;
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
    }) as SpecValidator;


    validator.usingHint = (hint: string): SpecValidator => {
        return createSpecValidator((it: any, path: string | null) =>
            fn(it, path) !== null
                ? hint
                : null
        );
    };

    return validator;
}