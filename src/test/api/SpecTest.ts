//import { describe, it } from 'mocha';
import { expect } from 'chai';

import Spec from '../../main/api/Spec';
import SpecError from '../../main/api/SpecError';

const data = {
    level1: {
        someShape: {
            someInteger: 42,
            someNumber: 1.23,
            someIntegers: [1, 2, 3]
        },
        someArray: [0, 1, 2, 'some string', 4],
        level2: {
            someArray: [0, 1, 2, 'some string', 4],
        }
    },

    true: true,
    fourtyTwo: 42,
    twelveDotThree: 12.3,
    minusOne: -1,
    zero: 0,
    text: 'text',
    arrayOfIntegersAndDates: [0, 1, 2, 3, new Date, 4], 
    arrayOfIntegers: [100, 200, 300]
}

describe('Testing Spec.boolean', () => {
    it('should work properly in success case', () => {
        const result = Spec.boolean(true);

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.boolean(42, path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path);
        });
    });
});

describe('Testing Spec.number', () => {
    it('should work properly in success case', () => {
        const result = Spec.number(12.34);

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.number('some text', path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path);
        });
    });
});

describe('Testing Spec.integer', () => {
    it('should work properly in success case', () => {
        const result = Spec.integer(42);

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.integer(12.34, path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path);
        });
    });
});

describe('Testing Spec.string', () => {
    it('should work properly in success case', () => {
        const result = Spec.string('some text');

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.string(42, path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path);
        });
    });
});

describe('Testing Spec.object', () => {
    it('should work properly in success case', () => {
        const result = Spec.object({ something: 42 });

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.object(42, path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path);
        });
    });
});

describe('Testing Spec.date', () => {
    it('should work properly in success case', () => {
        const result = Spec.date(new Date());

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.date(42, path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path);
        });
    });
});

describe('Testing Spec.array', () => {
    it('should work properly in success case', () => {
        const result = Spec.array([1, 2, 3]);

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.array(42, path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path);
        });
    });
});

describe('Testing Spec.arrayOf', () => {
    it('should work properly in success case', () => {
        const result = Spec.arrayOf(Spec.integer)([1, 2, 3]);

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
        const paths = [null, 'some.path'];

        paths.forEach(path => {
            const result = Spec.arrayOf(Spec.integer)([1, 2, 3, new Date], path);

            expect(result)
                .to.not.eql(null);
            
            expect(result.path)
                .to.eql(path === null ? null : path + '.3');

        });
    });
});

describe('Testing Spec.or', () => {
    it('should work properly in success case', () => {
        const result =
            Spec.arrayOf(
                Spec.or(
                    Spec.integer,
                    Spec.date))(data.arrayOfIntegersAndDates);

        expect(result)
            .to.eql(null);
    });
    
    it('should work properly in error case', () => {
    });
});
