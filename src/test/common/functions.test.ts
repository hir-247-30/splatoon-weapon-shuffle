import { assert } from 'chai';
import { describe, it } from 'mocha';
import { chooseRandomly, shuffle, assertUndefined } from '@common/functions';

describe('common/functions', () => {
    describe('chooseRandomly', () => {
        it('should choose an element from array', () => {
            const array = [1, 2, 3, 4, 5];
            const choice = chooseRandomly(array);
            
            assert.isTrue(array.includes(choice));
        });

        it('should choose the only element from single element array', () => {
            const array = ['only'];
            const choice = chooseRandomly(array);
            
            assert.equal(choice, 'only');
        });

        it('should throw error for empty array', () => {
            const array: number[] = [];
            
            assert.throws(() => {
                chooseRandomly(array);
            }, 'undefined detected');
        });
    });

    describe('shuffle', () => {
        it('should return array with same length', () => {
            const array = [1, 2, 3, 4, 5];
            const shuffled = shuffle(array);
            
            assert.equal(shuffled.length, array.length);
        });

        it('should contain all original elements', () => {
            const array = [1, 2, 3, 4, 5];
            const shuffled = shuffle(array);
            
            array.forEach(element => {
                assert.isTrue(shuffled.includes(element));
            });
        });

        it('should not modify original array', () => {
            const array = [1, 2, 3, 4, 5];
            const original = [...array];
            shuffle(array);
            
            assert.deepEqual(array, original);
        });

        it('should handle empty array', () => {
            const array: number[] = [];
            const shuffled = shuffle(array);
            
            assert.deepEqual(shuffled, []);
        });

        it('should handle single element array', () => {
            const array = ['single'];
            const shuffled = shuffle(array);
            
            assert.deepEqual(shuffled, ['single']);
        });
    });

    describe('assertUndefined', () => {
        it('should not throw for defined values', () => {
            assert.doesNotThrow(() => {
                assertUndefined(5);
            });
            
            assert.doesNotThrow(() => {
                assertUndefined('string');
            });
            
            assert.doesNotThrow(() => {
                assertUndefined({});
            });
            
            assert.doesNotThrow(() => {
                assertUndefined([]);
            });
            
            assert.doesNotThrow(() => {
                assertUndefined(0);
            });
            
            assert.doesNotThrow(() => {
                assertUndefined(false);
            });
        });

        it('should throw for undefined', () => {
            assert.throws(() => {
                assertUndefined(undefined);
            }, 'undefined detected');
        });
    });
});