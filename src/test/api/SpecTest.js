import { describe, it } from 'mocha';
import { expect } from 'chai';

import Spec from '../../main/api/Spec.js';
import SpecError from '../../main/api/SpecError.js';

const data = {
    level1: {
        someShape: {
            someInteger: 42,
            someNumber: 1.23,
            someIntegers: [1, 2, 3]
        },
        someArray: [0, 1, 2, 'some string', 4],
        fourtyTwo: 42,
        minusOne: -1,
        zero: 0,
        level2: {
            someArray: [0, 1, 2, 'some string', 4],
        }
    },

    someArray: [0, 1, 2, 3, new Date, 4], 
    someIntegers: [100, 200, 300]
};


/**
 * @test {Spec.arrayOf}
 */
describe('Testing Spec.arrayOf', () => {
    it('should work properly in success case', () => {
        const result = Spec.arrayOf(Spec.integer)(data.someIntegers);

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.arrayOf(Spec.integer)(data.level1.someArray, path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path + '.3');
        });
    });
});
