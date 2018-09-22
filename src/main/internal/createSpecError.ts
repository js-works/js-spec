import SpecError from '../api/SpecError'

/**
 * @hidden
 */
export default function createSpecError(errMsg: string, path: string | null): SpecError  {
  const
    fullErrMsg =
      'Constraint violation'
        + (path ? ` at '${path}'` : '')
        + `: ${errMsg}`

  return new SpecError(fullErrMsg, errMsg, path)
}
