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
        const map = new MultiMap([
            [1, '1'],
            [2, '2'],
            [3, '3'],
            [1, 'I'],
            [2, 'II'],
            [3, 'III']
        ]);
        expect([...map]).toMatchSnapshot();
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
        const map = new MultiMap(source);
        expect([...map]).toMatchSnapshot();
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
        const map = new MultiMap(source);

        expect(map[Symbol.iterator]).toEqual(expect.any(Function));
        expect(map[Symbol.iterator]()).not.toBe(map[Symbol.iterator]());
        expect([...map]).toStrictEqual(source);
    });

    it('can produce an iterator to the entries', () => {
        const source = [
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 3]
        ];
        const map = new MultiMap(source);

        expect(map.entries).toEqual(expect.any(Function));
        expect(map.entries()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(map.entries()).not.toBe(map.entries());
        expect([...map.entries()]).toStrictEqual(source);
    });

    it('can produce an iterator to the values', () => {
        const source = [
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 3]
        ];
        const map = new MultiMap(source);

        expect(map.values).toEqual(expect.any(Function));
        expect(map.values()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(map.values()).not.toBe(map.values());
        expect([...map.values()]).toStrictEqual([1, 2, 2, 3]);
    });

    it('can produce an iterator to the keys', () => {
        const source = [
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 3]
        ];
        const map = new MultiMap(source);

        expect(map.keys).toEqual(expect.any(Function));
        expect(map.keys()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(map.keys()).not.toBe(map.keys());
        expect([...map.keys()]).toStrictEqual([1, 2]);
    });

    it('allows iterating using a callback', () => {
        const source = [
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 3]
        ];
        const map = new MultiMap(source);

        const iterator = source.values();
        const callback = jest.fn().mockImplementation(function (value, key, thisMap) {
            const current = iterator.next().value;
            expect(this).toBeUndefined();
            expect(thisMap).toBe(map);
            expect(key).toBe(current[0]);
            expect(value).toStrictEqual(current[1]);
        });

        expect(map.forEach(callback)).toBeUndefined();
        expect(callback).toHaveBeenCalledTimes(source.length);
    });

    it('allows iterating using a callback, with binding', () => {
        const source = [
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 3]
        ];
        const map = new MultiMap(source);

        const context = {};
        const iterator = source.values();
        const callback = jest.fn().mockImplementation(function (value, key, thisMap) {
            const current = iterator.next().value;
            expect(this).toBe(context);
            expect(thisMap).toBe(map);
            expect(key).toBe(current[0]);
            expect(value).toStrictEqual(current[1]);
        });

        expect(map.forEach(callback, context)).toBeUndefined();
        expect(callback).toHaveBeenCalledTimes(source.length);
    });

    it('needs a callback to iterate over entries', () => {
        const map = new MultiMap();
        expect(() => map.forEach()).toThrow('A callback function is expected!');
    });

    it('tells if a key exists', () => {
        const map = new MultiMap([
            [1, 2],
            [2, 3]
        ]);

        expect(map.has(1)).toBeTruthy();
        expect(map.has(2)).toBeTruthy();
        expect(map.has(3)).toBeFalsy();
    });

    it('tells if a key/value pair exists', () => {
        const map = new MultiMap([
            [1, 2],
            [2, 3]
        ]);

        expect(map.has(1, 2)).toBeTruthy();
        expect(map.has(2, 3)).toBeTruthy();

        expect(map.has(1, 3)).toBeFalsy();
        expect(map.has(2, 4)).toBeFalsy();
        expect(map.has(3, 5)).toBeFalsy();
    });

    it('can get the value of a key', () => {
        const map = new MultiMap([
            [1, 1],
            [1, 2],
            [2, 2]
        ]);

        expect(map.get(1)).toBeDefined();
        expect(map.get(1)).toEqual(expect.any(Set));
        expect([...map.get(1)]).toStrictEqual([1, 2]);

        expect(map.get(2)).toBeDefined();
        expect(map.get(2)).toEqual(expect.any(Set));
        expect([...map.get(2)]).toStrictEqual([2]);

        expect(map.get(3)).toBeUndefined();
    });

    it('can set values', () => {
        const map = new MultiMap();

        expect(map.size).toBe(0);
        expect(map.has(1)).toBeFalsy();
        expect(map.set(1, 2)).toBe(map);
        expect(map.has(1)).toBeTruthy();
        expect(map.size).toBe(1);
    });

    it('sets values in a bucket', () => {
        const map = new MultiMap();

        map.set(1, 2);
        expect(map.get(1)).toEqual(expect.any(Set));
        expect(map.get(1).has(2)).toBeTruthy();
    });

    it('can set multiple values under the same key', () => {
        const map = new MultiMap();

        expect(map.size).toBe(0);
        map.set(1, 2);
        map.set(1, 3);
        expect(map.size).toBe(1);
        expect(map.get(1).has(2)).toBeTruthy();
        expect(map.get(1).has(3)).toBeTruthy();
        expect([...map.get(1)]).toStrictEqual([2, 3]);
    });

    it('can delete keys', () => {
        const map = new MultiMap([
            [1, 2],
            [2, 3]
        ]);

        expect(map.size).toBe(2);
        expect(map.get(1)).toEqual(expect.any(Set));
        expect(map.delete(1)).toBeTruthy();
        expect(map.delete(1)).toBeFalsy();
        expect(map.get(1)).toBeUndefined();
        expect(map.size).toBe(1);
    });

    it('can delete values', () => {
        const map = new MultiMap([
            [1, 1],
            [1, 2]
        ]);

        expect(map.size).toBe(1);
        expect(map.delete(1, 2)).toBeTruthy();
        expect(map.delete(1, 2)).toBeFalsy();
        expect(map.get(1)).toEqual(expect.any(Set));
        expect(map.size).toBe(1);

        expect(map.delete(1, 1)).toBeTruthy();
        expect(map.delete(1, 1)).toBeFalsy();
        expect(map.get(1)).toBeUndefined();
        expect(map.size).toBe(0);
    });

    it('does not delete values without a match', () => {
        const values = [
            [1, 1],
            [1, 2]
        ];
        const map = new MultiMap(values);

        expect(map.size).toBe(1);
        expect(map.delete(1, 3)).toBeFalsy();
        expect([...map]).toStrictEqual(values);
        expect(map.size).toBe(1);
    });

    it('can clear the map', () => {
        const source = [
            [1, 2],
            [2, 3]
        ];
        const map = new MultiMap(source);

        expect([...map]).toStrictEqual(source);
        expect(map.size).toBe(source.length);

        expect(map.clear()).toBeUndefined();

        expect([...map]).toStrictEqual([]);
        expect(map.size).toBe(0);
    });
});
