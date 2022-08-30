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

import listFactory from '../list';

const source = [1, 2, 3];

describe('list', () => {
    it('is a factory', () => {
        expect(listFactory).toEqual(expect.any(Function));
    });

    it('is a creates object', () => {
        expect(listFactory()).toEqual(expect.any(Object));
    });

    it('is a creates unique object', () => {
        expect(listFactory()).not.toBe(listFactory());
    });

    it('can be initialized with a source', () => {
        expect([...listFactory()]).toEqual([]);
        expect([...listFactory(source)]).toEqual(source);
    });

    it('has a length', () => {
        expect(listFactory().length).toBe(0);
        expect(listFactory(source).length).toBe(3);
    });

    it('implements the iteration protocol', () => {
        const list = listFactory(source);

        expect(list[Symbol.iterator]).toEqual(expect.any(Function));
        expect(list[Symbol.iterator]()).not.toBe(list[Symbol.iterator]());
        expect([...list]).toStrictEqual(source);
    });

    it('can produce an iterator', () => {
        const list = listFactory(source);

        expect(list.values).toEqual(expect.any(Function));
        expect(list.values()[Symbol.iterator]).toEqual(expect.any(Function));

        expect(list.values()).not.toBe(list.values());
        expect([...list.values()]).toStrictEqual(source);
    });

    it('can map its values', () => {
        const list = listFactory(source);

        expect(list.map).toEqual(expect.any(Function));

        const iterator = source[Symbol.iterator]();
        let i = 0;
        const callback = jest.fn().mockImplementation(function (value, index, thisList) {
            expect(this).toBe(list);
            expect(thisList).toBe(list);
            expect(value).toBe(iterator.next().value);
            expect(index).toBe(i++);
            return value * 10;
        });

        const mapped = list.map(callback);
        expect(mapped).not.toBe(list);
        expect(mapped).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(source.length);
    });

    it('needs a valid callback to map values', () => {
        expect(() => listFactory().map()).toThrow('A callback function is expected!');
    });

    describe('can find the index of a particular value', () => {
        it('using a search value', () => {
            const list = listFactory(source);

            expect(list.find).toEqual(expect.any(Function));

            expect(list.find(2)).toBe(1);
        });

        it('using a filter callback', () => {
            const list = listFactory(source);

            expect(list.find).toEqual(expect.any(Function));

            const iterator = source[Symbol.iterator]();
            let i = 0;
            const callback = jest.fn().mockImplementation(function (value, index, thisList) {
                expect(this).toBe(list);
                expect(thisList).toBe(list);
                expect(value).toBe(iterator.next().value);
                expect(index).toBe(i++);
                return value === 2;
            });

            expect(list.find(callback)).toBe(1);
            expect(callback).toHaveBeenCalledTimes(2);
        });

        it('but returns -1 if no value match the search ', () => {
            const list = listFactory(source);

            expect(list.find(4)).toBe(-1);

            const iterator = source[Symbol.iterator]();
            let i = 0;
            const callback = jest.fn().mockImplementation(function (value, index, thisList) {
                expect(this).toBe(list);
                expect(thisList).toBe(list);
                expect(value).toBe(iterator.next().value);
                expect(index).toBe(i++);
                return value === 4;
            });

            expect(list.find(callback)).toBe(-1);
            expect(callback).toHaveBeenCalledTimes(3);
        });
    });

    it('can read a value at a particular index', () => {
        const list = listFactory(source);

        expect(list.get).toEqual(expect.any(Function));

        expect(list.get(0)).toBe(source[0]);
        expect(list.get(1)).toBe(source[1]);
        expect(list.get(2)).toBe(source[2]);
        expect(list.get(3)).toBeUndefined();
    });

    it('can write a value at a particular index', () => {
        const list = listFactory(source);

        expect(list.set).toEqual(expect.any(Function));

        expect(list.set(0, 3)).toBe(list);
        expect(list.set(1, 4)).toBe(list);
        expect(list.set(2, 5)).toBe(list);
        expect([...list]).toMatchSnapshot();
    });

    describe('can insert a value', () => {
        it('at a particular index', () => {
            const list = listFactory(source);

            expect(list.insert).toEqual(expect.any(Function));

            expect(list.insert(1, 4)).toBe(list);
            expect([...list]).toMatchSnapshot();
        });

        it('at the beginning', () => {
            const list = listFactory(source);

            expect(list.insert).toEqual(expect.any(Function));

            expect(list.insert(0, 4)).toBe(list);
            expect([...list]).toMatchSnapshot();
        });

        it('at the end', () => {
            const list = listFactory(source);

            expect(list.insert).toEqual(expect.any(Function));

            expect(list.insert(3, 4)).toBe(list);
            expect([...list]).toMatchSnapshot();
        });
    });

    it('can add a value to the list', () => {
        const list = listFactory(source);

        expect(list.add).toEqual(expect.any(Function));

        expect(list.add(4)).toBe(list);
        expect([...list]).toMatchSnapshot();
    });

    it('can remove a value from a particular index', () => {
        const list = listFactory(source);

        expect(list.delete).toEqual(expect.any(Function));

        expect(list.delete(1)).toBeTruthy();
        expect(list.delete(2)).toBeFalsy();
        expect([...list]).toMatchSnapshot();
    });

    it('can clear the list', () => {
        const list = listFactory(source);

        expect(list.clear).toEqual(expect.any(Function));

        expect([...list]).toEqual(source);
        expect(list.clear()).toBe(list);
        expect([...list]).toEqual([]);
    });

    it('can load values from another source', () => {
        const list = listFactory();

        expect(list.load).toEqual(expect.any(Function));

        expect(list.load({})).toBe(list);
        expect([...list]).toEqual([]);

        expect(list.load(source)).toBe(list);
        expect([...list]).toEqual(source);
    });

    it('can export the values to an array', () => {
        const list = listFactory(source);

        expect(list.toArray).toEqual(expect.any(Function));
        expect(list.toArray()).toEqual(source);
    });

    it('can notify changes', () => {
        const list = listFactory(source);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(list);
            expect([...value]).toMatchSnapshot();
        });

        const unsubscribe = list.subscribe(callback); // callback called

        list.notify(); // callback called
        list.insert(0, 0); // callback called
        list.add(5); // callback called
        list.set(4, 4); // callback called
        list.delete(5);
        list.delete(2); // callback called
        list.clear(); // callback called
        list.load(source); // callback called

        unsubscribe();
        list.add(4);

        expect(callback).toHaveBeenCalledTimes(8);
    });
});
