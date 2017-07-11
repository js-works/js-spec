import SpecError from './SpecError';

type SpecValidator = {
    (it: any, path?: String): null | SpecError;

    usingHint(hint: string): SpecValidator;
};

export default SpecValidator;