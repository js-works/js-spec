import SpecError from '../api/SpecError';

/**
 * @hidden
 */
export default function createSpecError(errMsg: string, path: string | null)  {
    const
        fullErrMsg =
            'Constraint violation'
                + (path ? ` at '${path}'` : '')
                + `: ${errMsg}`;

    return new SpecError(fullErrMsg, errMsg, path);
}
