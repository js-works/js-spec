import symbolIsSpecValidator from '../internal/symbolIsSpecValidator';

export default function isSpecValidator(it: any) {
    return typeof it === 'function' && it[symbolIsSpecValidator as any] === true;
}
