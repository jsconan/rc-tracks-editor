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

import { MultiMap } from '../MultiMap.js';

describe('MultiMap', () => {
    it('is a class', () => {
        expect(MultiMap).toEqual(expect.any(Function));
    });

    it('is a kind of Map', () => {
        expect(new MultiMap()).toBeInstanceOf(Map);
    });

    it('can be initialized with values', () => {
        const multimap = new MultiMap([
            [1, '1'],
            [2, '2'],
            [3, '3'],
            [1, 'I'],
            [2, 'II'],
            [3, 'III']
        ]);
        expect([...multimap]).toMatchSnapshot();
    });

    it('can be initialized with another instance', () => {
        const source = new MultiMap([
            [1, '1'],
            [2, '2'],
            [3, '3'],
            [1, 'I'],
            [2, 'II'],
            [3, 'III']
        ]);
        const multimap = new MultiMap(source);
        expect([...multimap]).toMatchSnapshot();
    });

    it('has a size', () => {
        expect(new MultiMap().size).toBe(0);

        expect(
            new MultiMap([
                [1, 1],
                [1, 2]
            ]).size
        ).toBe(1);

        expect(
            new MultiMap([
                [1, 2],
                [2, 3]
            ]).size
        ).toBe(2);
    });

    it('is an iterator', () => {
        const source = [
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 3]
        ];
        const multimap = new MultiMap(source);

        expect(multimap[Symbol.iterator]).toEqual(expect.any(Function));
        expect(multimap[Symbol.iterator]()).not.toBe(multimap[Symbol.iterator]());
        expect([...multimap]).toStrictEqual(source);
    });

    it('can produce an iterator to the entries', () => {
        const source = [
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 3]
        ];
        const multimap = new MultiMap(source);

        expect(multimap.entries).toEqual(expect.any(Function));
        expect(multimap.entries()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(multimap.entries()).not.toBe(multimap.entries());
        expect([...multimap.entries()]).toStrictEqual(source);
    });

    it('can produce an iterator to the values', () => {
        const source = [
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 3]
        ];
        const multimap = new MultiMap(source);

        expect(multimap.values).toEqual(expect.any(Function));
        expect(multimap.values()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(multimap.values()).not.toBe(multimap.values());
        expect([...multimap.values()]).toStrictEqual([1, 2, 2, 3]);
    });

    it('can produce an iterator to the keys', () => {
        const source = [
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 3]
        ];
        const multimap = new MultiMap(source);

        expect(multimap.keys).toEqual(expect.any(Function));
        expect(multimap.keys()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(multimap.keys()).not.toBe(multimap.keys());
        expect([...multimap.keys()]).toStrictEqual([1, 2]);
    });

    it('allows iterating using a callback', () => {
        const source = [
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 3]
        ];
        const multimap = new MultiMap(source);

        const iterator = source.values();
        const callback = jest.fn().mockImplementation(function (value, key, map) {
            const current = iterator.next().value;
            expect(this).toBeUndefined();
            expect(map).toBe(multimap);
            expect(key).toBe(current[0]);
            expect(value).toStrictEqual(current[1]);
        });

        expect(multimap.forEach(callback)).toBeUndefined();
        expect(callback).toHaveBeenCalledTimes(source.length);
    });

    it('allows iterating using a callback, with binding', () => {
        const source = [
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 3]
        ];
        const multimap = new MultiMap(source);

        const context = {};
        const iterator = source.values();
        const callback = jest.fn().mockImplementation(function (value, key, map) {
            const current = iterator.next().value;
            expect(this).toBe(context);
            expect(map).toBe(multimap);
            expect(key).toBe(current[0]);
            expect(value).toStrictEqual(current[1]);
        });

        expect(multimap.forEach(callback, context)).toBeUndefined();
        expect(callback).toHaveBeenCalledTimes(source.length);
    });

    it('needs a callback to iterate over entries', () => {
        const multimap = new MultiMap();
        expect(() => multimap.forEach()).toThrow('A callback function is expected!');
    });

    it('tells if a key exists', () => {
        const multimap = new MultiMap([
            [1, 2],
            [2, 3]
        ]);

        expect(multimap.has(1)).toBeTruthy();
        expect(multimap.has(2)).toBeTruthy();
        expect(multimap.has(3)).toBeFalsy();
    });

    it('tells if a key/value pair exists', () => {
        const multimap = new MultiMap([
            [1, 2],
            [2, 3]
        ]);

        expect(multimap.has(1, 2)).toBeTruthy();
        expect(multimap.has(2, 3)).toBeTruthy();

        expect(multimap.has(1, 3)).toBeFalsy();
        expect(multimap.has(2, 4)).toBeFalsy();
        expect(multimap.has(3, 5)).toBeFalsy();
    });

    it('can get the value of a key', () => {
        const multimap = new MultiMap([
            [1, 1],
            [1, 2],
            [2, 2]
        ]);

        expect(multimap.get(1)).toBeDefined();
        expect(multimap.get(1)).toEqual(expect.any(Set));
        expect([...multimap.get(1)]).toStrictEqual([1, 2]);

        expect(multimap.get(2)).toBeDefined();
        expect(multimap.get(2)).toEqual(expect.any(Set));
        expect([...multimap.get(2)]).toStrictEqual([2]);

        expect(multimap.get(3)).toBeUndefined();
    });

    it('can set values', () => {
        const multimap = new MultiMap();

        expect(multimap.size).toBe(0);
        expect(multimap.has(1)).toBeFalsy();
        expect(multimap.set(1, 2)).toBe(multimap);
        expect(multimap.has(1)).toBeTruthy();
        expect(multimap.size).toBe(1);
    });

    it('sets values in a bucket', () => {
        const multimap = new MultiMap();

        multimap.set(1, 2);
        expect(multimap.get(1)).toEqual(expect.any(Set));
        expect(multimap.get(1).has(2)).toBeTruthy();
    });

    it('can set multiple values under the same key', () => {
        const multimap = new MultiMap();

        expect(multimap.size).toBe(0);
        multimap.set(1, 2);
        multimap.set(1, 3);
        expect(multimap.size).toBe(1);
        expect(multimap.get(1).has(2)).toBeTruthy();
        expect(multimap.get(1).has(3)).toBeTruthy();
        expect([...multimap.get(1)]).toStrictEqual([2, 3]);
    });

    it('can delete keys', () => {
        const multimap = new MultiMap([
            [1, 2],
            [2, 3]
        ]);

        expect(multimap.size).toBe(2);
        expect(multimap.get(1)).toEqual(expect.any(Set));
        expect(multimap.delete(1)).toBeTruthy();
        expect(multimap.delete(1)).toBeFalsy();
        expect(multimap.get(1)).toBeUndefined();
        expect(multimap.size).toBe(1);
    });

    it('can delete values', () => {
        const multimap = new MultiMap([
            [1, 1],
            [1, 2]
        ]);

        expect(multimap.size).toBe(1);
        expect(multimap.delete(1, 2)).toBeTruthy();
        expect(multimap.delete(1, 2)).toBeFalsy();
        expect(multimap.get(1)).toEqual(expect.any(Set));
        expect(multimap.size).toBe(1);

        expect(multimap.delete(1, 1)).toBeTruthy();
        expect(multimap.delete(1, 1)).toBeFalsy();
        expect(multimap.get(1)).toBeUndefined();
        expect(multimap.size).toBe(0);
    });

    it('does not delete values without a match', () => {
        const values = [
            [1, 1],
            [1, 2]
        ];
        const multimap = new MultiMap(values);

        expect(multimap.size).toBe(1);
        expect(multimap.delete(1, 3)).toBeFalsy();
        expect([...multimap]).toStrictEqual(values);
        expect(multimap.size).toBe(1);
    });

    it('can clear the map', () => {
        const source = [
            [1, 2],
            [2, 3]
        ];
        const multimap = new MultiMap(source);

        expect([...multimap]).toStrictEqual(source);
        expect(multimap.size).toBe(source.length);

        expect(multimap.clear()).toBeUndefined();

        expect([...multimap]).toStrictEqual([]);
        expect(multimap.size).toBe(0);
    });
});
