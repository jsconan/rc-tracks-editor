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

import { SortedSet } from '../SortedSet';

const ordered = [0, 1, 2, 3, 4, 5, 6];
const random = [4, 1, 5, 3, 0, 6, 2];

describe('SortedSet', () => {
    it('is a class', () => {
        expect(SortedSet).toEqual(expect.any(Function));
    });

    it('can be initialized with values', () => {
        const set = new SortedSet(random);
        expect([...set]).toEqual(ordered);
    });

    it('can be initialized with another instance', () => {
        const source = new SortedSet(ordered);
        const set = new SortedSet(source);
        expect([...set]).toEqual(ordered);
    });

    it('has a size', () => {
        expect(new SortedSet().size).toBe(0);

        expect(new SortedSet([1]).size).toBe(1);

        expect(new SortedSet([1, 2]).size).toBe(2);
    });

    it('is an iterator', () => {
        const set = new SortedSet(random);

        expect(set[Symbol.iterator]).toEqual(expect.any(Function));
        expect(set[Symbol.iterator]()).not.toBe(set[Symbol.iterator]());
        expect([...set]).toStrictEqual(ordered);
    });

    it('can produce an iterator to the values', () => {
        const set = new SortedSet(random);

        expect(set.values).toEqual(expect.any(Function));
        expect(set.values()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(set.values()).not.toBe(set.values());
        expect([...set.values()]).toStrictEqual(ordered);
    });

    it('allows iterating using a callback', () => {
        const set = new SortedSet(random);

        const iterator = ordered.values();
        const callback = jest.fn().mockImplementation(function (value, thisMap) {
            expect(this).toBeUndefined();
            expect(thisMap).toBe(set);
            expect(value).toStrictEqual(iterator.next().value);
        });

        expect(set.forEach(callback)).toBeUndefined();
        expect(callback).toHaveBeenCalledTimes(ordered.length);
    });

    it('allows iterating using a callback, with binding', () => {
        const set = new SortedSet(random);

        const context = {};
        const iterator = ordered.values();
        const callback = jest.fn().mockImplementation(function (value, thisMap) {
            expect(this).toBe(context);
            expect(thisMap).toBe(set);
            expect(value).toStrictEqual(iterator.next().value);
        });

        expect(set.forEach(callback, context)).toBeUndefined();
        expect(callback).toHaveBeenCalledTimes(ordered.length);
    });

    it('needs a callback to iterate over entries', () => {
        const set = new SortedSet();
        expect(() => set.forEach()).toThrow('A callback function is expected!');
    });

    it('tells if a value exists', () => {
        const set = new SortedSet([1, 2]);

        expect(set.has(1)).toBeTruthy();
        expect(set.has(2)).toBeTruthy();
        expect(set.has(3)).toBeFalsy();
    });

    it('can add values', () => {
        const set = new SortedSet();

        expect(set.size).toBe(0);
        expect(set.has(1)).toBeFalsy();
        expect(set.add(1)).toBe(set);
        expect(set.has(1)).toBeTruthy();
        expect(set.add(1)).toBe(set);
        expect(set.size).toBe(1);
    });

    it('can delete values', () => {
        const set = new SortedSet([1, 2]);

        expect(set.size).toBe(2);
        expect(set.has(1)).toBeTruthy();
        expect(set.delete(1)).toBeTruthy();
        expect(set.delete(1)).toBeFalsy();
        expect(set.has(1)).toBeFalsy();
        expect(set.size).toBe(1);
    });

    it('can clear the set', () => {
        const set = new SortedSet(random);

        expect([...set]).toStrictEqual(ordered);
        expect(set.size).toBe(ordered.length);

        expect(set.clear()).toBeUndefined();

        expect([...set]).toStrictEqual([]);
        expect(set.size).toBe(0);
    });
});
