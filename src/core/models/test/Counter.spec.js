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

import { Counter } from '../Counter.js';

const source = [
    ['c1', 0],
    ['c2', 1],
    ['c3', -1]
];
const keys = ['c1', 'c2', 'c3'];

describe('Counter', () => {
    it('is a class', () => {
        expect(Counter).toEqual(expect.any(Function));
    });

    it('can be initialized with a source', () => {
        expect([...new Counter()]).toEqual([]);
        expect([...new Counter(source)]).toEqual(source);
    });

    it('has a size', () => {
        expect(new Counter().size).toBe(0);
        expect(new Counter(source).size).toBe(3);
    });

    it('implements the iteration protocol', () => {
        const counters = new Counter(source);

        expect(counters[Symbol.iterator]).toEqual(expect.any(Function));
        expect(counters[Symbol.iterator]()).not.toBe(counters[Symbol.iterator]());
        expect([...counters]).toStrictEqual(source);
    });

    it('can produce an iterator for getting the keys', () => {
        const counters = new Counter(source);

        expect(counters.keys).toEqual(expect.any(Function));
        expect(counters.keys()[Symbol.iterator]).toEqual(expect.any(Function));

        expect(counters.keys()).not.toBe(counters.keys());
        expect([...counters.keys()]).toStrictEqual(keys);
    });

    it('can walk over its counters', () => {
        const counters = new Counter(source);

        expect(counters.forEach).toEqual(expect.any(Function));

        const iterator = source[Symbol.iterator]();
        const callback = jest.fn().mockImplementation(function (value, key, thisCounters) {
            expect(this).toBe(counters);
            expect(thisCounters).toBe(counters);
            const [iteratorKey, iteratorValue] = iterator.next().value;
            expect(value).toBe(iteratorValue);
            expect(key).toBe(iteratorKey);
        });

        expect(counters.forEach(callback)).toBe(counters);
        expect(callback).toHaveBeenCalledTimes(source.length);
    });

    it('needs a valid callback to walk over counters', () => {
        expect(() => new Counter().forEach()).toThrow('A callback function is expected!');
    });

    it('can map its counters', () => {
        const counters = new Counter(source);

        expect(counters.map).toEqual(expect.any(Function));

        const iterator = source[Symbol.iterator]();
        const callback = jest.fn().mockImplementation(function (value, key, thisCounter) {
            expect(this).toBe(counters);
            expect(thisCounter).toBe(counters);
            const [iteratorKey, iteratorValue] = iterator.next().value;
            expect(value).toBe(iteratorValue);
            expect(key).toBe(iteratorKey);
            return value * 10;
        });

        const mapped = counters.map(callback);
        expect(mapped).not.toBe(counters);
        expect(mapped).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(source.length);
    });

    it('needs a valid callback to map counters', () => {
        expect(() => new Counter().map()).toThrow('A callback function is expected!');
    });

    it('can tell if a counter exists', () => {
        const counters = new Counter(source);

        expect(counters.has('c1')).toBeTruthy();
        expect(counters.has('c2')).toBeTruthy();
        expect(counters.has('c3')).toBeTruthy();
        expect(counters.has('c4')).toBeFalsy();
    });

    it('can get the value of a counter', () => {
        const counters = new Counter(source);

        expect(counters.get('c1')).toBe(0);
        expect(counters.get('c2')).toBe(1);
        expect(counters.get('c3')).toBe(-1);
        expect(counters.get('c4')).toBe(0);
    });

    it('can set the value of a counter', () => {
        const counters = new Counter(source);

        expect(counters.get('c1')).toBe(0);
        expect(counters.set('c1', 10)).toBe(counters);
        expect(counters.get('c1')).toBe(10);

        expect(counters.get('c4')).toBe(0);
        expect(counters.set('c4', 1)).toBe(counters);
        expect(counters.get('c4')).toBe(1);
    });

    it('can only set whole numbers', () => {
        const counters = new Counter(source);

        expect(counters.get('c1')).toBe(0);
        expect(counters.set('c1', 1.2)).toBe(counters);
        expect(counters.get('c1')).toBe(1);

        expect(counters.set('c1', 2.9)).toBe(counters);
        expect(counters.get('c1')).toBe(2);

        expect(counters.set('c1', 'c')).toBe(counters);
        expect(counters.get('c1')).toBe(0);
    });

    it('can delete a counter', () => {
        const counters = new Counter(source);

        expect(counters.has('c1')).toBeTruthy();
        expect(counters.delete('c1')).toBeTruthy();
        expect(counters.has('c1')).toBeFalsy();
        expect(counters.get('c1')).toBe(0);
        expect(counters.delete('c1')).toBeFalsy();
    });

    it('can increment a counter', () => {
        const counters = new Counter();

        expect(counters.get('c1')).toBe(0);
        expect(counters.increment('c1')).toBe(counters);
        expect(counters.get('c1')).toBe(1);
        expect(counters.increment('c1', 2)).toBe(counters);
        expect(counters.get('c1')).toBe(3);

        expect(counters.increment('c1', 2.5)).toBe(counters);
        expect(counters.get('c1')).toBe(5);

        expect(counters.increment('c1', 0)).toBe(counters);
        expect(counters.get('c1')).toBe(6);
    });

    it('can decrement a counter', () => {
        const counters = new Counter();

        expect(counters.get('c1')).toBe(0);
        expect(counters.decrement('c1')).toBe(counters);
        expect(counters.get('c1')).toBe(-1);
        expect(counters.decrement('c1', 2)).toBe(counters);
        expect(counters.get('c1')).toBe(-3);

        expect(counters.decrement('c1', 2.5)).toBe(counters);
        expect(counters.get('c1')).toBe(-5);

        expect(counters.decrement('c1', 0)).toBe(counters);
        expect(counters.get('c1')).toBe(-6);
    });

    it('can removes all counters', () => {
        const counters = new Counter(source);

        expect([...counters]).toStrictEqual(source);
        expect(counters.clear()).toBe(counters);
        expect([...counters]).toStrictEqual([]);
    });

    it('can load counters', () => {
        const counters = new Counter();
        counters.set('c', 1);

        expect([...counters]).toStrictEqual([['c', 1]]);
        expect(counters.load({})).toBe(counters);
        expect([...counters]).toStrictEqual([['c', 1]]);

        expect(counters.load(source)).toBe(counters);
        expect([...counters]).toStrictEqual(source);
    });

    it('can reset counters', () => {
        const counters = new Counter();
        counters.set('a', 2);
        counters.set('b', 3);

        expect([...counters]).toStrictEqual([
            ['a', 2],
            ['b', 3]
        ]);
        expect(counters.reset()).toBe(counters);
        expect([...counters]).toStrictEqual([
            ['a', 0],
            ['b', 0]
        ]);

        expect(counters.reset(['a', 'b', 'c', 'a', 'c'])).toBe(counters);
        expect([...counters]).toStrictEqual([
            ['a', 2],
            ['b', 1],
            ['c', 2]
        ]);
    });

    it('can export counters', () => {
        const counters = new Counter(source);

        expect(counters.toObject()).toMatchSnapshot();
    });

    it('can notify changes', () => {
        const counters = new Counter(source);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(counters);
            expect([...value]).toMatchSnapshot();
        });

        const unsubscribe = counters.subscribe(callback); // callback called

        counters.notify(); // callback called
        counters.set('c1', 3); // callback called
        counters.delete('c2'); // callback called
        counters.delete('c2');
        counters.increment('c2'); // callback called
        counters.decrement('c2'); // callback called
        counters.clear(); // callback called
        counters.load(source); // callback called
        counters.load({});
        counters.reset(source); // callback called
        counters.reset({}); // callback called

        unsubscribe();
        counters.increment('c1');

        expect(callback).toHaveBeenCalledTimes(10);
    });
});
