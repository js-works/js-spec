import SpecValidator from './SpecValidator';
import SpecError from './SpecError';

type Validator =
    { validate(it: any, path: string | null): boolean | string | Error | null } 
    | { (it: any, path: string | null): boolean | string | Error | null };

export default Validator;
