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
        const map = new DoubleMap(source);
        expect([...map]).toMatchSnapshot();
    });

    it('can be initialized with another instance', () => {
        const other = new DoubleMap(source);
        const map = new DoubleMap(other);
        expect([...map]).toMatchSnapshot();
    });

    it('has a size', () => {
        expect(new DoubleMap().size).toBe(0);
        expect(new DoubleMap().size2).toBe(0);

        expect(new DoubleMap(source).size).toBe(nbPrimaryKeys);
        expect(new DoubleMap(source).size2).toBe(nbSecondaryKeys);
    });

    it('is an iterator', () => {
        const map = new DoubleMap(source);

        expect(map[Symbol.iterator]).toEqual(expect.any(Function));
        expect(map[Symbol.iterator]()).not.toBe(map[Symbol.iterator]());
        expect([...map]).toStrictEqual(source);
    });

    it('can produce an iterator to the entries', () => {
        const map = new DoubleMap(source);

        expect(map.entries).toEqual(expect.any(Function));
        expect(map.entries()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(map.entries()).not.toBe(map.entries());
        expect([...map.entries()]).toStrictEqual(source);
    });

    it('can produce an iterator to the entries for a particular primary key', () => {
        const map = new DoubleMap(source);

        expect(map.entries).toEqual(expect.any(Function));
        expect(map.entries('C1')[Symbol.iterator]).toEqual(expect.any(Function));
        expect(map.entries('C1')).not.toBe(map.entries('C1'));
        expect([...map.entries('C1')]).toMatchSnapshot();
        expect([...map.entries('C2')]).toMatchSnapshot();
        expect([...map.entries('C3')]).toStrictEqual([]);
    });

    it('can produce an iterator to the values', () => {
        const map = new DoubleMap(source);

        expect(map.values).toEqual(expect.any(Function));
        expect(map.values()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(map.values()).not.toBe(map.values());
        expect([...map.values()]).toMatchSnapshot();
    });

    it('can produce an iterator to the values for a particular primary key', () => {
        const map = new DoubleMap(source);

        expect(map.values).toEqual(expect.any(Function));
        expect(map.values('C1')[Symbol.iterator]).toEqual(expect.any(Function));
        expect(map.values('C1')).not.toBe(map.values('C1'));
        expect([...map.values('C1')]).toMatchSnapshot();
        expect([...map.values('C2')]).toMatchSnapshot();
        expect([...map.values('C3')]).toStrictEqual([]);
    });

    it('can produce an iterator to the keys', () => {
        const map = new DoubleMap(source);

        expect(map.keys).toEqual(expect.any(Function));
        expect(map.keys()[Symbol.iterator]).toEqual(expect.any(Function));
        expect(map.keys()).not.toBe(map.keys());
        expect([...map.keys()]).toMatchSnapshot();
    });

    it('can produce an iterator to the keys for a particular primary key', () => {
        const map = new DoubleMap(source);

        expect(map.keys).toEqual(expect.any(Function));
        expect(map.keys('C1')[Symbol.iterator]).toEqual(expect.any(Function));
        expect(map.keys('C1')).not.toBe(map.keys('C1'));
        expect([...map.keys('C1')]).toMatchSnapshot();
        expect([...map.keys('C2')]).toMatchSnapshot();
        expect([...map.keys('C3')]).toStrictEqual([]);
    });

    it('allows iterating using a callback', () => {
        const map = new DoubleMap(source);

        const iterator = source.values();
        const callback = jest.fn().mockImplementation(function (value, secondaryKey, primaryKey, thisMap) {
            const current = iterator.next().value;
            expect(this).toBeUndefined();
            expect(thisMap).toBe(map);
            expect(primaryKey).toBe(current[0]);
            expect(secondaryKey).toBe(current[1]);
            expect(value).toBe(current[2]);
        });

        expect(map.forEach(callback)).toBeUndefined();
        expect(callback).toHaveBeenCalledTimes(source.length);
    });

    it('allows iterating using a callback, with binding', () => {
        const map = new DoubleMap(source);

        const context = {};
        const iterator = source.values();
        const callback = jest.fn().mockImplementation(function (value, secondaryKey, primaryKey, thisMap) {
            const current = iterator.next().value;
            expect(this).toBe(context);
            expect(thisMap).toBe(map);
            expect(primaryKey).toBe(current[0]);
            expect(secondaryKey).toBe(current[1]);
            expect(value).toBe(current[2]);
        });

        expect(map.forEach(callback, context)).toBeUndefined();
        expect(callback).toHaveBeenCalledTimes(source.length);
    });

    it('needs a callback to iterate over entries', () => {
        const map = new DoubleMap();
        expect(() => map.forEach()).toThrow('A callback function is expected!');
    });

    it('tells if a key exists', () => {
        const map = new DoubleMap(source);

        expect(map.has('C1')).toBeTruthy();
        expect(map.has('C2')).toBeTruthy();
        expect(map.has('C3')).toBeFalsy();
    });

    it('tells if a key pair exists', () => {
        const map = new DoubleMap(source);

        expect(map.has('C1', 'L1')).toBeTruthy();
        expect(map.has('C1', 'L2')).toBeTruthy();
        expect(map.has('C2', 'L1')).toBeTruthy();
        expect(map.has('C2', 'L2')).toBeTruthy();

        expect(map.has('C1', 'L3')).toBeFalsy();
        expect(map.has('C2', 'L3')).toBeFalsy();
        expect(map.has('C3', 'L3')).toBeFalsy();
    });

    it('tells if a keys/value set exists', () => {
        const map = new DoubleMap(source);

        expect(map.has('C1', 'L1', 1)).toBeTruthy();
        expect(map.has('C2', 'L2', 4)).toBeTruthy();
        expect(map.has('C3', 'L3', 9)).toBeFalsy();
    });

    it('can get the value of a key', () => {
        const map = new DoubleMap(source);

        expect(map.get('C1')).toBeDefined();
        expect(map.get('C1')).toEqual(expect.any(Map));
        expect([...map.get('C1')]).toMatchSnapshot;

        expect(map.get('C3')).toBeUndefined();
    });

    it('can get the value of a couple of keys', () => {
        const map = new DoubleMap(source);

        expect(map.get('C1', 'L1')).toBeDefined();
        expect(map.get('C1', 'L1')).toBe(1);

        expect(map.get('C3', 'L3')).toBeUndefined();
    });

    it('can set values', () => {
        const map = new DoubleMap();

        expect(map.size).toBe(0);
        expect(map.has('C1')).toBeFalsy();
        expect(map.set('C1', 'L1', 1)).toBe(map);

        expect(map.has('C1')).toBeTruthy();
        expect(map.has('C1', 'L1')).toBeTruthy();
        expect(map.has('C1', 'L1', 1)).toBeTruthy();
        expect(map.has('C1', 'L2')).toBeFalsy();
        expect(map.size).toBe(1);
        expect(map.size2).toBe(1);
    });

    it('cannot set incomplete keys', () => {
        const map = new DoubleMap();

        expect(map.set('C1')).toBe(map);

        expect(map.size).toBe(0);
        expect(map.size2).toBe(0);
    });

    it('can delete keys', () => {
        const map = new DoubleMap(source);

        expect(map.size).toBe(nbPrimaryKeys);
        expect(map.size2).toBe(nbSecondaryKeys);
        expect(map.get('C1', 'L1')).toBe(1);
        expect(map.get('C1', 'L2')).toBe(2);
        expect(map.delete('C1')).toBeTruthy();
        expect(map.delete('C1')).toBeFalsy();
        expect(map.get('C1')).toBeUndefined();
        expect(map.get('C1', 'L1')).toBeUndefined();
        expect(map.get('C1', 'L2')).toBeUndefined();
        expect(map.size).toBe(nbPrimaryKeys - 1);
        expect(map.size2).toBe(nbSecondaryKeys - 2);
    });

    it('can delete a couple of keys', () => {
        const map = new DoubleMap(source);

        expect(map.size).toBe(nbPrimaryKeys);
        expect(map.size2).toBe(nbSecondaryKeys);
        expect(map.get('C1', 'L1')).toBe(1);

        expect(map.delete('C1', 'L1')).toBeTruthy();
        expect(map.delete('C1', 'L1')).toBeFalsy();

        expect(map.size).toBe(nbPrimaryKeys);
        expect(map.size2).toBe(nbSecondaryKeys - 1);
        expect(map.get('C1', 'L2')).toBe(2);

        expect(map.delete('C1', 'L2')).toBeTruthy();
        expect(map.delete('C1', 'L2')).toBeFalsy();

        expect(map.get('C1')).toBeUndefined();
        expect(map.size).toBe(nbPrimaryKeys - 1);
        expect(map.size2).toBe(nbSecondaryKeys - 2);
    });

    it('can delete values', () => {
        const map = new DoubleMap(source);

        expect(map.size).toBe(nbPrimaryKeys);
        expect(map.size2).toBe(nbSecondaryKeys);
        expect(map.get('C1', 'L1')).toBe(1);

        expect(map.delete('C1', 'L1', 1)).toBeTruthy();
        expect(map.delete('C1', 'L1', 1)).toBeFalsy();

        expect(map.size).toBe(nbPrimaryKeys);
        expect(map.size2).toBe(nbSecondaryKeys - 1);
        expect(map.get('C1', 'L2')).toBe(2);

        expect(map.delete('C1', 'L3', 3)).toBeFalsy();
        expect(map.size).toBe(nbPrimaryKeys);
        expect(map.size2).toBe(nbSecondaryKeys - 1);

        expect(map.delete('C1', 'L2', 2)).toBeTruthy();
        expect(map.delete('C1', 'L2', 2)).toBeFalsy();

        expect(map.size).toBe(nbPrimaryKeys - 1);
        expect(map.size2).toBe(nbSecondaryKeys - 2);
        expect(map.get('C1')).toBeUndefined();
    });

    it('does not delete values without a match', () => {
        const map = new DoubleMap(source);

        expect(map.size).toBe(nbPrimaryKeys);
        expect(map.size2).toBe(nbSecondaryKeys);
        expect(map.delete('C3', 'C3', 9)).toBeFalsy();
        expect([...map]).toStrictEqual(source);
        expect(map.size).toBe(nbPrimaryKeys);
        expect(map.size2).toBe(nbSecondaryKeys);
    });

    it('can clear the map', () => {
        const map = new DoubleMap(source);

        expect([...map]).toStrictEqual(source);
        expect(map.size).toBe(nbPrimaryKeys);
        expect(map.size2).toBe(nbSecondaryKeys);

        expect(map.clear()).toBeUndefined();

        expect([...map]).toStrictEqual([]);
        expect(map.size).toBe(0);
        expect(map.size2).toBe(0);
    });
});
