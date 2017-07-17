import SpecValidator from './SpecValidator';
import SpecError from './SpecError';

type Validator =
    { validate(it: any, path: String | null): boolean | string | Error | null } 
    | { (it: any, path: String | null): boolean | string | Error | null };

export default Validator;
