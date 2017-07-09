import { describe, it } from 'mocha';
import { expect } from 'chai';

import Spec from '../../main/api/Spec.js';
import SpecError from '../../main/api/SpecError.js';

/**
 * @test {Spec}
 */
describe('Testing SpecError construction and message properties', () => {
    const
        longMessage = 'long message',
        shortMessage = 'short message',
        path = 'some.test.path',
        specError = new SpecError(longMessage, shortMessage, path);

    it('should read long message properly', () => {
        expect(specError.message)
            .to.eql(longMessage);
    });

    it('should read short message properly', () => {
        expect(specError.shortMessage)
            .to.eql(shortMessage);
    });
    
    it('should read property properly', () => {
        expect(specError.path)
            .to.eql(path);
    });
});
