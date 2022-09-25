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
const keys = source.map(entry => entry[0]);

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
        expect(new Counter(source).size).toBe(source.length);
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

        expect(counters.has(keys[0])).toBeTruthy();
        expect(counters.has(keys[1])).toBeTruthy();
        expect(counters.has(keys[2])).toBeTruthy();
        expect(counters.has('key')).toBeFalsy();
    });

    it('can get the value of a counter', () => {
        const counters = new Counter(source);

        expect(counters.get(keys[0])).toBe(0);
        expect(counters.get(keys[1])).toBe(1);
        expect(counters.get(keys[2])).toBe(-1);
        expect(counters.get('key')).toBe(0);
    });

    it('can set the value of a counter', () => {
        const counters = new Counter(source);

        expect(counters.get(keys[0])).toBe(0);
        expect(counters.set(keys[0], 10)).toBe(counters);
        expect(counters.get(keys[0])).toBe(10);

        expect(counters.get('key')).toBe(0);
        expect(counters.set('key', 1)).toBe(counters);
        expect(counters.get('key')).toBe(1);
    });

    it('can only set whole numbers', () => {
        const counters = new Counter(source);

        expect(counters.get(keys[0])).toBe(0);
        expect(counters.set(keys[0], 1.2)).toBe(counters);
        expect(counters.get(keys[0])).toBe(1);

        expect(counters.set(keys[0], 2.9)).toBe(counters);
        expect(counters.get(keys[0])).toBe(2);

        expect(counters.set(keys[0], 'c')).toBe(counters);
        expect(counters.get(keys[0])).toBe(0);
    });

    it('emits an event when setting a counter', () => {
        const counters = new Counter(source);

        const callback = jest.fn().mockImplementation((key, value, previous) => {
            expect([key, value, previous]).toMatchSnapshot();
        });

        counters.on('set', callback);

        counters.set(keys[0], 3);
        counters.set(keys[1], 4);
        counters.set(keys[2], 5);
        expect(callback).toHaveBeenCalledTimes(3);
    });

    it('can delete a counter', () => {
        const counters = new Counter(source);

        expect(counters.has(keys[0])).toBeTruthy();
        expect(counters.delete(keys[0])).toBeTruthy();
        expect(counters.has(keys[0])).toBeFalsy();
        expect(counters.get(keys[0])).toBe(0);
        expect(counters.delete(keys[0])).toBeFalsy();
    });

    it('emits an event when removing a counter', () => {
        const counters = new Counter(source);

        const callback = jest.fn().mockImplementation((key, value) => {
            expect(key).toBe(keys[1]);
            expect(value).toBe(1);
        });

        counters.on('delete', callback);

        counters.delete(keys[1]);
        counters.delete(keys[1]);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can increment a counter', () => {
        const counters = new Counter();

        expect(counters.get(keys[0])).toBe(0);
        expect(counters.increment(keys[0])).toBe(counters);
        expect(counters.get(keys[0])).toBe(1);
        expect(counters.increment(keys[0], 2)).toBe(counters);
        expect(counters.get(keys[0])).toBe(3);

        expect(counters.increment(keys[0], 2.5)).toBe(counters);
        expect(counters.get(keys[0])).toBe(5);

        expect(counters.increment(keys[0], 0)).toBe(counters);
        expect(counters.get(keys[0])).toBe(6);
    });

    it('emits an event when incrementing a counter', () => {
        const counters = new Counter(source);

        const callback = jest.fn().mockImplementation((key, value, previous) => {
            expect(key).toBe(keys[1]);
            expect(value).toBe(2);
            expect(previous).toBe(1);
        });

        counters.on('set', callback);

        counters.increment(keys[1]);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can decrement a counter', () => {
        const counters = new Counter();

        expect(counters.get(keys[0])).toBe(0);
        expect(counters.decrement(keys[0])).toBe(counters);
        expect(counters.get(keys[0])).toBe(-1);
        expect(counters.decrement(keys[0], 2)).toBe(counters);
        expect(counters.get(keys[0])).toBe(-3);

        expect(counters.decrement(keys[0], 2.5)).toBe(counters);
        expect(counters.get(keys[0])).toBe(-5);

        expect(counters.decrement(keys[0], 0)).toBe(counters);
        expect(counters.get(keys[0])).toBe(-6);
    });

    it('emits an event when decrementing a counter', () => {
        const counters = new Counter(source);

        const callback = jest.fn().mockImplementation((key, value, previous) => {
            expect(key).toBe(keys[1]);
            expect(value).toBe(0);
            expect(previous).toBe(1);
        });

        counters.on('set', callback);

        counters.decrement(keys[1]);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can removes all counters', () => {
        const counters = new Counter(source);

        expect([...counters]).toStrictEqual(source);
        expect(counters.clear()).toBe(counters);
        expect([...counters]).toStrictEqual([]);
    });

    it('emits an event when removing all counters', () => {
        const counters = new Counter(source);

        const callback = jest.fn();

        counters.on('clear', callback);

        counters.clear();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can export counters', () => {
        const counters = new Counter(source);

        expect(counters.toObject()).toMatchSnapshot();
    });

    it('can notify changes', () => {
        const counters = new Counter(source);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(counters);
            expect(value).toMatchSnapshot();
        });

        const unsubscribe = counters.subscribe(callback); // callback called

        counters.notify(); // callback called
        counters.set(keys[0], 3); // callback called
        counters.delete(keys[1]); // callback called
        counters.delete(keys[1]);
        counters.increment(keys[1]); // callback called
        counters.decrement(keys[1]); // callback called
        counters.clear(); // callback called

        unsubscribe();
        counters.increment(keys[0]);

        expect(callback).toHaveBeenCalledTimes(7);
    });
});
