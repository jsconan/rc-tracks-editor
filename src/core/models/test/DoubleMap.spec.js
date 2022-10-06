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

import { DoubleMap } from '../DoubleMap.js';

describe('DoubleMap', () => {
    const source = [
        ['C1', 'L1', 1],
        ['C1', 'L2', 2],
        ['C2', 'L1', 3],
        ['C2', 'L2', 4]
    ];
    const nbPrimaryKeys = 2;
    const nbSecondaryKeys = 4;

    it('is a class', () => {
        expect(DoubleMap).toEqual(expect.any(Function));
    });

    it('is a kind of Map', () => {
        expect(new DoubleMap()).toBeInstanceOf(Map);
    });

    it('can be initialized with values', () => {
        const doublemap = new DoubleMap(source);
        expect([...doublemap]).toMatchSnapshot();
    });

    it('can be initialized with another instance', () => {
        const other = new DoubleMap(source);
        const doublemap = new DoubleMap(other);
        expect([...doublemap]).toMatchSnapshot();
    });

    it('has a size', () => {
        expect(new DoubleMap().size).toBe(0);
        expect(new DoubleMap().size2).toBe(0);

        expect(new DoubleMap(source).size).toBe(nbPrimaryKeys);
        expect(new DoubleMap(source).size2).toBe(nbSecondaryKeys);
    });

    it('is an iterator', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap[Symbol.iterator]).toEqual(expect.any(Function));
        expect(doublemap[Symbol.iterator]()).not.toBe(doublemap[Symbol.iterator]());
        expect([...doublemap]).toStrictEqual(source);
    });

    it('can produce an iterator to the entries', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap.entries).toEqual(expect.any(Function));
        expect(doublemap.entries()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(doublemap.entries()).not.toBe(doublemap.entries());
        expect([...doublemap.entries()]).toStrictEqual(source);
    });

    it('can produce an iterator to the entries for a particular primary key', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap.entries).toEqual(expect.any(Function));
        expect(doublemap.entries('C1')[Symbol.iterator]).toEqual(expect.any(Function));
        expect(doublemap.entries('C1')).not.toBe(doublemap.entries('C1'));
        expect([...doublemap.entries('C1')]).toMatchSnapshot();
        expect([...doublemap.entries('C2')]).toMatchSnapshot();
        expect([...doublemap.entries('C3')]).toStrictEqual([]);
    });

    it('can produce an iterator to the values', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap.values).toEqual(expect.any(Function));
        expect(doublemap.values()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(doublemap.values()).not.toBe(doublemap.values());
        expect([...doublemap.values()]).toMatchSnapshot();
    });

    it('can produce an iterator to the values for a particular primary key', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap.values).toEqual(expect.any(Function));
        expect(doublemap.values('C1')[Symbol.iterator]).toEqual(expect.any(Function));
        expect(doublemap.values('C1')).not.toBe(doublemap.values('C1'));
        expect([...doublemap.values('C1')]).toMatchSnapshot();
        expect([...doublemap.values('C2')]).toMatchSnapshot();
        expect([...doublemap.values('C3')]).toStrictEqual([]);
    });

    it('can produce an iterator to the keys', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap.keys).toEqual(expect.any(Function));
        expect(doublemap.keys()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(doublemap.keys()).not.toBe(doublemap.keys());
        expect([...doublemap.keys()]).toMatchSnapshot();
    });

    it('can produce an iterator to the keys for a particular primary key', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap.keys).toEqual(expect.any(Function));
        expect(doublemap.keys('C1')[Symbol.iterator]).toEqual(expect.any(Function));
        expect(doublemap.keys('C1')).not.toBe(doublemap.keys('C1'));
        expect([...doublemap.keys('C1')]).toMatchSnapshot();
        expect([...doublemap.keys('C2')]).toMatchSnapshot();
        expect([...doublemap.keys('C3')]).toStrictEqual([]);
    });

    it('allows iterating using a callback', () => {
        const doublemap = new DoubleMap(source);

        const iterator = source.values();
        const callback = jest.fn().mockImplementation(function (value, secondaryKey, primaryKey, map) {
            const current = iterator.next().value;
            expect(this).toBeUndefined();
            expect(map).toBe(doublemap);
            expect(primaryKey).toBe(current[0]);
            expect(secondaryKey).toBe(current[1]);
            expect(value).toBe(current[2]);
        });

        expect(doublemap.forEach(callback)).toBeUndefined();
        expect(callback).toHaveBeenCalledTimes(source.length);
    });

    it('allows iterating using a callback, with binding', () => {
        const doublemap = new DoubleMap(source);

        const context = {};
        const iterator = source.values();
        const callback = jest.fn().mockImplementation(function (value, secondaryKey, primaryKey, map) {
            const current = iterator.next().value;
            expect(this).toBe(context);
            expect(map).toBe(doublemap);
            expect(primaryKey).toBe(current[0]);
            expect(secondaryKey).toBe(current[1]);
            expect(value).toBe(current[2]);
        });

        expect(doublemap.forEach(callback, context)).toBeUndefined();
        expect(callback).toHaveBeenCalledTimes(source.length);
    });

    it('needs a callback to iterate over entries', () => {
        const doublemap = new DoubleMap();
        expect(() => doublemap.forEach()).toThrow('A callback function is expected!');
    });

    it('tells if a key exists', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap.has('C1')).toBeTruthy();
        expect(doublemap.has('C2')).toBeTruthy();
        expect(doublemap.has('C3')).toBeFalsy();
    });

    it('tells if a key pair exists', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap.has('C1', 'L1')).toBeTruthy();
        expect(doublemap.has('C1', 'L2')).toBeTruthy();
        expect(doublemap.has('C2', 'L1')).toBeTruthy();
        expect(doublemap.has('C2', 'L2')).toBeTruthy();

        expect(doublemap.has('C1', 'L3')).toBeFalsy();
        expect(doublemap.has('C2', 'L3')).toBeFalsy();
        expect(doublemap.has('C3', 'L3')).toBeFalsy();
    });

    it('tells if a keys/value set exists', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap.has('C1', 'L1', 1)).toBeTruthy();
        expect(doublemap.has('C2', 'L2', 4)).toBeTruthy();
        expect(doublemap.has('C3', 'L3', 9)).toBeFalsy();
    });

    it('can get the value of a key', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap.get('C1')).toBeDefined();
        expect(doublemap.get('C1')).toEqual(expect.any(Map));
        expect([...doublemap.get('C1')]).toMatchSnapshot;

        expect(doublemap.get('C3')).toBeUndefined();
    });

    it('can get the value of a couple of keys', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap.get('C1', 'L1')).toBeDefined();
        expect(doublemap.get('C1', 'L1')).toBe(1);

        expect(doublemap.get('C3', 'L3')).toBeUndefined();
    });

    it('can set values', () => {
        const doublemap = new DoubleMap();

        expect(doublemap.size).toBe(0);
        expect(doublemap.has('C1')).toBeFalsy();
        expect(doublemap.set('C1', 'L1', 1)).toBe(doublemap);

        expect(doublemap.has('C1')).toBeTruthy();
        expect(doublemap.has('C1', 'L1')).toBeTruthy();
        expect(doublemap.has('C1', 'L1', 1)).toBeTruthy();
        expect(doublemap.has('C1', 'L2')).toBeFalsy();
        expect(doublemap.size).toBe(1);
        expect(doublemap.size2).toBe(1);
    });

    it('cannot set incomplete keys', () => {
        const doublemap = new DoubleMap();

        expect(doublemap.set('C1')).toBe(doublemap);

        expect(doublemap.size).toBe(0);
        expect(doublemap.size2).toBe(0);
    });

    it('can delete keys', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap.size).toBe(nbPrimaryKeys);
        expect(doublemap.size2).toBe(nbSecondaryKeys);
        expect(doublemap.get('C1', 'L1')).toBe(1);
        expect(doublemap.get('C1', 'L2')).toBe(2);
        expect(doublemap.delete('C1')).toBeTruthy();
        expect(doublemap.delete('C1')).toBeFalsy();
        expect(doublemap.get('C1')).toBeUndefined();
        expect(doublemap.get('C1', 'L1')).toBeUndefined();
        expect(doublemap.get('C1', 'L2')).toBeUndefined();
        expect(doublemap.size).toBe(nbPrimaryKeys - 1);
        expect(doublemap.size2).toBe(nbSecondaryKeys - 2);
    });

    it('can delete a couple of keys', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap.size).toBe(nbPrimaryKeys);
        expect(doublemap.size2).toBe(nbSecondaryKeys);
        expect(doublemap.get('C1', 'L1')).toBe(1);

        expect(doublemap.delete('C1', 'L1')).toBeTruthy();
        expect(doublemap.delete('C1', 'L1')).toBeFalsy();

        expect(doublemap.size).toBe(nbPrimaryKeys);
        expect(doublemap.size2).toBe(nbSecondaryKeys - 1);
        expect(doublemap.get('C1', 'L2')).toBe(2);

        expect(doublemap.delete('C1', 'L2')).toBeTruthy();
        expect(doublemap.delete('C1', 'L2')).toBeFalsy();

        expect(doublemap.get('C1')).toBeUndefined();
        expect(doublemap.size).toBe(nbPrimaryKeys - 1);
        expect(doublemap.size2).toBe(nbSecondaryKeys - 2);
    });

    it('can delete values', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap.size).toBe(nbPrimaryKeys);
        expect(doublemap.size2).toBe(nbSecondaryKeys);
        expect(doublemap.get('C1', 'L1')).toBe(1);

        expect(doublemap.delete('C1', 'L1', 1)).toBeTruthy();
        expect(doublemap.delete('C1', 'L1', 1)).toBeFalsy();

        expect(doublemap.size).toBe(nbPrimaryKeys);
        expect(doublemap.size2).toBe(nbSecondaryKeys - 1);
        expect(doublemap.get('C1', 'L2')).toBe(2);

        expect(doublemap.delete('C1', 'L3', 3)).toBeFalsy();
        expect(doublemap.size).toBe(nbPrimaryKeys);
        expect(doublemap.size2).toBe(nbSecondaryKeys - 1);

        expect(doublemap.delete('C1', 'L2', 2)).toBeTruthy();
        expect(doublemap.delete('C1', 'L2', 2)).toBeFalsy();

        expect(doublemap.size).toBe(nbPrimaryKeys - 1);
        expect(doublemap.size2).toBe(nbSecondaryKeys - 2);
        expect(doublemap.get('C1')).toBeUndefined();
    });

    it('does not delete values without a match', () => {
        const doublemap = new DoubleMap(source);

        expect(doublemap.size).toBe(nbPrimaryKeys);
        expect(doublemap.size2).toBe(nbSecondaryKeys);
        expect(doublemap.delete('C3', 'C3', 9)).toBeFalsy();
        expect([...doublemap]).toStrictEqual(source);
        expect(doublemap.size).toBe(nbPrimaryKeys);
        expect(doublemap.size2).toBe(nbSecondaryKeys);
    });

    it('can clear the map', () => {
        const doublemap = new DoubleMap(source);

        expect([...doublemap]).toStrictEqual(source);
        expect(doublemap.size).toBe(nbPrimaryKeys);
        expect(doublemap.size2).toBe(nbSecondaryKeys);

        expect(doublemap.clear()).toBeUndefined();

        expect([...doublemap]).toStrictEqual([]);
        expect(doublemap.size).toBe(0);
        expect(doublemap.size2).toBe(0);
    });
});
