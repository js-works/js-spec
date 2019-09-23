import SpecError from './SpecError'

export default interface SpecValidator<T = any> {
  (it: T, path?: string | null): SpecError | null
  validate(it: T, path?: string | null): SpecError | null
  usingHint(hint: string): SpecValidator
}