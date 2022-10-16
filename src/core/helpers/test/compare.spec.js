/**
 * RC Tracks Editor
 * Copyright (c) 2022 Jean-Sébastien CONAN
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { compare, compareGeneric, compareNumbers, compareObjects, compareStrings, getCompare } from '../compare';

class Compare {
    constructor(value) {
        this.value = value;
    }

    compare(obj) {
        return compare(this.value, obj.value);
    }
}

describe('compareStrings', () => {
    it('is a function', () => {
        expect(compareStrings).toEqual(expect.any(Function));
    });

    it('compares strings', () => {
        expect(compareStrings('a', 'b')).toBe(-1);
        expect(compareStrings('b', 'a')).toBe(1);
        expect(compareStrings('a', 'a')).toBe(0);
    });
});

describe('compareNumbers', () => {
    it('is a function', () => {
        expect(compareNumbers).toEqual(expect.any(Function));
    });

    it('compares numbers', () => {
        expect(compareNumbers(1, 2)).toBe(-1);
        expect(compareNumbers(2, 1)).toBe(1);
        expect(compareNumbers(1, 1)).toBe(0);
    });
});

describe('compareObjects', () => {
    it('is a function', () => {
        expect(compareObjects).toEqual(expect.any(Function));
    });

    it('compares objects implementing a compare function', () => {
        const obj1 = new Compare(1);
        const obj2 = new Compare(2);

        expect(compareObjects(obj1, obj2)).toBe(-1);
        expect(compareObjects(obj2, obj1)).toBe(1);
        expect(compareObjects(obj1, obj1)).toBe(0);
    });
});

describe('compareGeneric', () => {
    it('is a function', () => {
        expect(compareGeneric).toEqual(expect.any(Function));
    });

    it('compares generic values', () => {
        expect(compareGeneric('a', 'b')).toBe(-1);
        expect(compareGeneric('b', 'a')).toBe(1);
        expect(compareGeneric('a', 'a')).toBe(0);

        expect(compareGeneric(1, 2)).toBe(-1);
        expect(compareGeneric(2, 1)).toBe(1);
        expect(compareGeneric(1, 1)).toBe(0);

        expect(compareGeneric(false, true)).toBe(-1);
        expect(compareGeneric(true, false)).toBe(1);
        expect(compareGeneric(true, true)).toBe(0);
    });
});

describe('compare', () => {
    it('is a function', () => {
        expect(compare).toEqual(expect.any(Function));
    });

    it('compares values', () => {
        expect(compare('a', 'b')).toBe(-1);
        expect(compare('b', 'a')).toBe(1);
        expect(compare('a', 'a')).toBe(0);

        expect(compare(1, 2)).toBe(-1);
        expect(compare(2, 1)).toBe(1);
        expect(compare(1, 1)).toBe(0);

        expect(compare(false, true)).toBe(-1);
        expect(compare(true, false)).toBe(1);
        expect(compare(true, true)).toBe(0);

        const obj1 = new Compare(1);
        const obj2 = new Compare(2);

        expect(compare(obj1, obj2)).toBe(-1);
        expect(compare(obj2, obj1)).toBe(1);
        expect(compare(obj1, obj1)).toBe(0);
    });
});

describe('getCompare', () => {
    it('is a function', () => {
        expect(getCompare).toEqual(expect.any(Function));
    });

    it('produces a compare function', () => {
        expect(getCompare('a')).toBe(compareStrings);
        expect(getCompare(1)).toBe(compareNumbers);
        expect(getCompare(new Compare(1))).toBe(compareObjects);
        expect(getCompare(true)).toBe(compareGeneric);
    });
});
