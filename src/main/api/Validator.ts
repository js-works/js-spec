type Validator<T = any> =
  (it: T, path?: string | null) => null | boolean | Error

export default Validator
