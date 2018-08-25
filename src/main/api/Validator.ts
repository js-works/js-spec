import SpecValidator from './SpecValidator';
import SpecError from './SpecError';

type Validator =
  (it: any, path?: string | null) => null | boolean | Error;

export default Validator;
