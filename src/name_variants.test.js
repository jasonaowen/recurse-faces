import {powerSet} from './name_variants'

describe('powerSet', () => {
    it(`calculate power set of an empty array`, () => {
        expect(powerSet([])).toEqual(new Set([[]]));
    });

    it(`ensure order of power set of 1 does not matter`, () => {
        expect(powerSet([1])).toEqual(new Set([[], [1]]));
        expect(powerSet([1])).toEqual(new Set([[1], []]));
    });

    it(`calculate power set of an array of size 2 correctly`, () => {
        expect(powerSet([1,2])).toEqual(new Set([[], [1], [2], [1, 2]]));
    });

    it(`calculate power set of an array of size 3 correctly`, () => {
        expect(powerSet([1,2,3])).toEqual(new Set([[], [1], [2], [3],
            [1, 2], [1, 3], [2, 3], [1, 2, 3]]));
    });
});

