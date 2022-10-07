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

import { SortedMap } from '../SortedMap.js';

const ordered = [
    [0, 'zero'],
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
    [4, 'four'],
    [5, 'five'],
    [6, 'six']
];
const random = [
    [4, 'four'],
    [1, 'one'],
    [5, 'five'],
    [3, 'three'],
    [0, 'zero'],
    [6, 'six'],
    [2, 'two']
];
const keys = [0, 1, 2, 3, 4, 5, 6];
const values = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];

describe('SortedMap', () => {
    it('is a class', () => {
        expect(SortedMap).toEqual(expect.any(Function));
    });

    it('can be initialized with values', () => {
        const map = new SortedMap(random);
        expect([...map]).toEqual(ordered);
    });

    it('can be initialized with another instance', () => {
        const source = new SortedMap(ordered);
        const map = new SortedMap(source);
        expect([...map]).toEqual(ordered);
    });

    it('has a size', () => {
        expect(new SortedMap().size).toBe(0);

        expect(new SortedMap([[1, 1]]).size).toBe(1);

        expect(
            new SortedMap([
                [1, 2],
                [2, 3]
            ]).size
        ).toBe(2);
    });

    it('is an iterator', () => {
        const map = new SortedMap(random);

        expect(map[Symbol.iterator]).toEqual(expect.any(Function));
        expect(map[Symbol.iterator]()).not.toBe(map[Symbol.iterator]());
        expect([...map]).toStrictEqual(ordered);
    });

    it('can produce an iterator to the entries', () => {
        const map = new SortedMap(random);

        expect(map.entries).toEqual(expect.any(Function));
        expect(map.entries()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(map.entries()).not.toBe(map.entries());
        expect([...map.entries()]).toStrictEqual(ordered);
    });

    it('can produce an iterator to the values', () => {
        const map = new SortedMap(random);

        expect(map.values).toEqual(expect.any(Function));
        expect(map.values()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(map.values()).not.toBe(map.values());
        expect([...map.values()]).toStrictEqual(values);
    });

    it('can produce an iterator to the keys', () => {
        const map = new SortedMap(random);

        expect(map.keys).toEqual(expect.any(Function));
        expect(map.keys()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(map.keys()).not.toBe(map.keys());
        expect([...map.keys()]).toStrictEqual(keys);
    });

    it('allows iterating using a callback', () => {
        const map = new SortedMap(random);

        const iterator = ordered.values();
        const callback = jest.fn().mockImplementation(function (value, key, thisMap) {
            const current = iterator.next().value;
            expect(this).toBeUndefined();
            expect(thisMap).toBe(map);
            expect(key).toBe(current[0]);
            expect(value).toStrictEqual(current[1]);
        });

        expect(map.forEach(callback)).toBeUndefined();
        expect(callback).toHaveBeenCalledTimes(ordered.length);
    });

    it('allows iterating using a callback, with binding', () => {
        const map = new SortedMap(random);

        const context = {};
        const iterator = ordered.values();
        const callback = jest.fn().mockImplementation(function (value, key, thisMap) {
            const current = iterator.next().value;
            expect(this).toBe(context);
            expect(thisMap).toBe(map);
            expect(key).toBe(current[0]);
            expect(value).toStrictEqual(current[1]);
        });

        expect(map.forEach(callback, context)).toBeUndefined();
        expect(callback).toHaveBeenCalledTimes(ordered.length);
    });

    it('needs a callback to iterate over entries', () => {
        const map = new SortedMap();
        expect(() => map.forEach()).toThrow('A callback function is expected!');
    });

    it('allows mapping using a callback', () => {
        const map = new SortedMap(random);

        const iterator = ordered.values();
        const callback = jest.fn().mockImplementation(function (value, key, thisMap) {
            const current = iterator.next().value;
            expect(this).toBeUndefined();
            expect(thisMap).toBe(map);
            expect(key).toBe(current[0]);
            expect(value).toStrictEqual(current[1]);
            return key;
        });

        expect(map.map(callback)).toEqual(keys);
        expect(callback).toHaveBeenCalledTimes(ordered.length);
    });

    it('allows mapping using a callback, with binding', () => {
        const map = new SortedMap(random);

        const context = {};
        const iterator = ordered.values();
        const callback = jest.fn().mockImplementation(function (value, key, thisMap) {
            const current = iterator.next().value;
            expect(this).toBe(context);
            expect(thisMap).toBe(map);
            expect(key).toBe(current[0]);
            expect(value).toStrictEqual(current[1]);
            return key;
        });

        expect(map.map(callback, context)).toEqual(keys);
        expect(callback).toHaveBeenCalledTimes(ordered.length);
    });

    it('needs a mapping to iterate over entries', () => {
        const map = new SortedMap();
        expect(() => map.map()).toThrow('A callback function is expected!');
    });

    it('tells if a key exists', () => {
        const map = new SortedMap([
            [1, 2],
            [2, 3]
        ]);

        expect(map.has(1)).toBeTruthy();
        expect(map.has(2)).toBeTruthy();
        expect(map.has(3)).toBeFalsy();
    });

    it('can get the value of a key', () => {
        const map = new SortedMap(random);

        expect(map.get(1)).toBeDefined();
        expect(map.get(1)).toBe(values[1]);

        expect(map.get(8)).toBeUndefined();
    });

    it('can set values', () => {
        const map = new SortedMap();

        expect(map.size).toBe(0);
        expect(map.has(1)).toBeFalsy();
        expect(map.set(1, 2)).toBe(map);
        expect(map.has(1)).toBeTruthy();
        expect(map.get(1)).toBe(2);
        expect(map.set(1, 3)).toBe(map);
        expect(map.get(1)).toBe(3);
        expect(map.size).toBe(1);
    });

    it('can delete keys', () => {
        const map = new SortedMap([
            [1, 2],
            [2, 3]
        ]);

        expect(map.size).toBe(2);
        expect(map.get(1)).toBe(2);
        expect(map.delete(1)).toBeTruthy();
        expect(map.delete(1)).toBeFalsy();
        expect(map.get(1)).toBeUndefined();
        expect(map.size).toBe(1);
    });

    it('can clear the map', () => {
        const map = new SortedMap(random);

        expect([...map]).toStrictEqual(ordered);
        expect(map.size).toBe(ordered.length);

        expect(map.clear()).toBeUndefined();

        expect([...map]).toStrictEqual([]);
        expect(map.size).toBe(0);
    });
});
