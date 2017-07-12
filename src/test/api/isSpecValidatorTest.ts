//import { describe, it } from 'mocha';
import { expect } from 'chai';

import isSpecValidator from '../../main/api/isSpecValidator';
import Spec from '../../main/api/Spec';

describe('isSpecValidator', () => {
    it('should recognize Spec.integer as Spec validator', () => {
        expect(isSpecValidator(Spec.integer))
            .to.be.true;
    });

    it('should distinguish a Spec validator from a normal function', () => {
        expect(isSpecValidator(() => true))
            .to.be.false;
    });
});
