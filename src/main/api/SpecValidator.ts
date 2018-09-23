import SpecError from './SpecError'

export default interface SpecValidator {
  (it: any, path?: string | null): SpecError | null
  validate(it: any, path?: string | null): SpecError | null
  usingHint(hint: string): SpecValidator
}