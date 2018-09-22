type Validator =
  (it: any, path?: string | null) => null | boolean | Error

export default Validator
