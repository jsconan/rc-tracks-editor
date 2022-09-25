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

import { TileSpecifications } from '../../config';
import { CurvedTileEnlargedModel } from '../CurvedTileEnlargedModel';
import { CurvedTileModel } from '../CurvedTileModel';
import { StraightTileModel } from '../StraightTileModel.js';
import { TileModelCounter } from '../TileModelCounter.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const maxRatio = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks, maxRatio);
const source = [
    new StraightTileModel(specs),
    new CurvedTileEnlargedModel(specs),
    new StraightTileModel(specs),
    new CurvedTileModel(specs),
    new CurvedTileModel(specs),
    new StraightTileModel(specs)
];
const entries = [
    [source[0].modelId, 3],
    [source[1].modelId, 1],
    [source[3].modelId, 2]
];
const keys = entries.map(entry => entry[0]);

describe('TileModelCounter', () => {
    it('is a class', () => {
        expect(TileModelCounter).toEqual(expect.any(Function));
    });

    it('can be initialized with a source', () => {
        expect([...new TileModelCounter()]).toEqual([]);
        expect([...new TileModelCounter(source)]).toEqual(entries);
    });

    it('has a size', () => {
        expect(new TileModelCounter().size).toBe(0);
        expect(new TileModelCounter(source).size).toBe(entries.length);
    });

    it('implements the iteration protocol', () => {
        const counters = new TileModelCounter(source);

        expect(counters[Symbol.iterator]).toEqual(expect.any(Function));
        expect(counters[Symbol.iterator]()).not.toBe(counters[Symbol.iterator]());
        expect([...counters]).toStrictEqual(entries);
    });

    it('can produce an iterator for getting the keys', () => {
        const counters = new TileModelCounter(source);

        expect(counters.keys).toEqual(expect.any(Function));
        expect(counters.keys()[Symbol.iterator]).toEqual(expect.any(Function));

        expect(counters.keys()).not.toBe(counters.keys());
        expect([...counters.keys()]).toStrictEqual(keys);
    });

    it('can walk over its counters', () => {
        const counters = new TileModelCounter(source);

        expect(counters.forEach).toEqual(expect.any(Function));

        const iterator = entries[Symbol.iterator]();
        const callback = jest.fn().mockImplementation(function (value, key, thisCounters) {
            expect(this).toBe(counters);
            expect(thisCounters).toBe(counters);
            const [iteratorKey, iteratorValue] = iterator.next().value;
            expect(value).toBe(iteratorValue);
            expect(key).toBe(iteratorKey);
        });

        expect(counters.forEach(callback)).toBe(counters);
        expect(callback).toHaveBeenCalledTimes(entries.length);
    });

    it('needs a valid callback to walk over counters', () => {
        expect(() => new TileModelCounter().forEach()).toThrow('A callback function is expected!');
    });

    it('can map its counters', () => {
        const counters = new TileModelCounter(source);

        expect(counters.map).toEqual(expect.any(Function));

        const iterator = entries[Symbol.iterator]();
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
        expect(callback).toHaveBeenCalledTimes(entries.length);
    });

    it('needs a valid callback to map counters', () => {
        expect(() => new TileModelCounter().map()).toThrow('A callback function is expected!');
    });

    it('can tell if a counter exists', () => {
        const counters = new TileModelCounter(source);

        expect(counters.has(keys[0])).toBeTruthy();
        expect(counters.has(keys[1])).toBeTruthy();
        expect(counters.has(keys[2])).toBeTruthy();
        expect(counters.has('key')).toBeFalsy();
    });

    it('can get the value of a counter', () => {
        const counters = new TileModelCounter(source);

        expect(counters.get(keys[0])).toBe(3);
        expect(counters.get(keys[1])).toBe(1);
        expect(counters.get(keys[2])).toBe(2);
        expect(counters.get('key')).toBe(0);
    });

    it('can set the value of a counter', () => {
        const counters = new TileModelCounter(source);

        expect(counters.get(keys[0])).toBe(3);
        expect(counters.set(keys[0], 10)).toBe(counters);
        expect(counters.get(keys[0])).toBe(10);

        expect(counters.get('key')).toBe(0);
        expect(counters.set('key', 1)).toBe(counters);
        expect(counters.get('key')).toBe(1);
    });

    it('can only set whole numbers', () => {
        const counters = new TileModelCounter(source);

        expect(counters.get(keys[0])).toBe(3);
        expect(counters.set(keys[0], 1.2)).toBe(counters);
        expect(counters.get(keys[0])).toBe(1);

        expect(counters.set(keys[0], 2.9)).toBe(counters);
        expect(counters.get(keys[0])).toBe(2);

        expect(counters.set(keys[0], 'c')).toBe(counters);
        expect(counters.get(keys[0])).toBe(0);
    });

    it('emits an event when setting a counter', () => {
        const counters = new TileModelCounter(source);

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
        const counters = new TileModelCounter(source);

        expect(counters.has(keys[0])).toBeTruthy();
        expect(counters.delete(keys[0])).toBeTruthy();
        expect(counters.has(keys[0])).toBeFalsy();
        expect(counters.get(keys[0])).toBe(0);
        expect(counters.delete(keys[0])).toBeFalsy();
    });

    it('can delete a model', () => {
        const counters = new TileModelCounter(source);

        expect(counters.getTileModel(keys[0])).not.toBeNull();
        expect(counters.delete(keys[0])).toBeTruthy();
        expect(counters.getTileModel(keys[0])).toBeNull();
    });

    it('emits an event when removing a counter', () => {
        const counters = new TileModelCounter(source);
        const tileModel = counters.getTileModel(keys[1]);

        const deleteCallback = jest.fn().mockImplementation((key, value) => {
            expect(key).toBe(keys[1]);
            expect(value).toBe(1);
        });

        const deleteModelCallback = jest.fn().mockImplementation((key, model) => {
            expect(key).toBe(keys[1]);
            expect(model).toBe(tileModel);
        });

        counters.on('delete', deleteCallback);
        counters.on('deletemodel', deleteModelCallback);

        counters.delete(keys[1]);
        counters.delete(keys[1]);
        expect(deleteCallback).toHaveBeenCalledTimes(1);
        expect(deleteModelCallback).toHaveBeenCalledTimes(1);
    });

    it('can increment a counter', () => {
        const counters = new TileModelCounter();

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
        const counters = new TileModelCounter(source);

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
        const counters = new TileModelCounter();

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
        const counters = new TileModelCounter(source);

        const callback = jest.fn().mockImplementation((key, value, previous) => {
            expect(key).toBe(keys[1]);
            expect(value).toBe(0);
            expect(previous).toBe(1);
        });

        counters.on('set', callback);

        counters.decrement(keys[1]);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can list the counted tile models', () => {
        const counters = new TileModelCounter(source);

        expect(counters.getTileModels()).toMatchSnapshot();
    });

    it('can get the tile model for a given key', () => {
        const counters = new TileModelCounter(source);

        expect(counters.getTileModel(keys[0])).toMatchSnapshot();
        expect(counters.getTileModel(keys[1])).toMatchSnapshot();
        expect(counters.getTileModel(keys[2])).toMatchSnapshot();
        expect(counters.getTileModel(keys[3])).toBeNull();
    });

    it('can add a tile to the counters', () => {
        const counters = new TileModelCounter(source);

        expect(counters.get(keys[2])).toBe(2);
        expect(counters.add(new CurvedTileModel(specs))).toBe(counters);
        expect(counters.get(keys[2])).toBe(3);
    });

    it('can register a tile model', () => {
        const counters = new TileModelCounter(source);
        const tile = new CurvedTileModel(specs, CurvedTileModel.DIRECTION_LEFT, 2);

        expect(counters.get(tile.modelId)).toBe(0);
        expect(counters.getTileModel(tile.modelId)).toBeNull();

        counters.add(tile);

        expect(counters.get(tile.modelId)).toBe(1);
        expect(counters.getTileModel(tile.modelId)).not.toBeNull();
    });

    it('emits an event when registering a tile model', () => {
        const counters = new TileModelCounter(source);
        const tile = new CurvedTileModel(specs, CurvedTileModel.DIRECTION_LEFT, 2);

        const callback = jest.fn().mockImplementation((key, model) => {
            expect(key).toBe(tile.modelId);
            expect(model).toBeInstanceOf(CurvedTileModel);
            expect(model.modelId).toBe(tile.modelId);
        });

        counters.on('addmodel', callback);

        expect(counters.get(tile.modelId)).toBe(0);

        counters.add(tile);
        counters.add(tile);

        expect(counters.get(tile.modelId)).toBe(2);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can remove a tile from the counters', () => {
        const counters = new TileModelCounter(source);

        expect(counters.get(keys[2])).toBe(2);
        expect(counters.remove(new CurvedTileModel(specs))).toBe(counters);
        expect(counters.get(keys[2])).toBe(1);
    });

    it('can unregister a tile model', () => {
        const counters = new TileModelCounter(source);
        const tile = new CurvedTileEnlargedModel(specs);

        expect(counters.get(tile.modelId)).toBe(1);
        expect(counters.getTileModel(tile.modelId)).not.toBeNull();

        counters.remove(tile);

        expect(counters.get(tile.modelId)).toBe(0);
        expect(counters.getTileModel(tile.modelId)).toBeNull();
    });

    it('emits an event when un-registering a tile model', () => {
        const counters = new TileModelCounter(source);
        const tile = new CurvedTileModel(specs);

        const callback = jest.fn().mockImplementation((key, model) => {
            expect(key).toBe(tile.modelId);
            expect(model).toBeInstanceOf(CurvedTileModel);
            expect(model.modelId).toBe(tile.modelId);
        });

        counters.on('deletemodel', callback);

        expect(counters.get(tile.modelId)).toBe(2);

        counters.remove(tile);
        counters.remove(tile);

        expect(counters.get(tile.modelId)).toBe(0);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can removes all counters', () => {
        const counters = new TileModelCounter(source);

        expect([...counters]).toStrictEqual(entries);
        expect(counters.clear()).toBe(counters);
        expect([...counters]).toStrictEqual([]);
        expect(counters.getTileModels()).toStrictEqual([]);
    });

    it('emits an event when removing all counters', () => {
        const counters = new TileModelCounter(source);

        const callback = jest.fn();

        counters.on('clear', callback);

        counters.clear();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can export counters', () => {
        const counters = new TileModelCounter(source);

        expect(counters.toObject()).toMatchSnapshot();
    });

    describe('can notify changes', () => {
        it('applied to the counters', () => {
            const counters = new TileModelCounter(source);

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

        it('applied to the list of tile models', () => {
            const counters = new TileModelCounter(source);

            const callback = jest.fn().mockImplementation(value => {
                expect(value).toMatchSnapshot();
            });

            expect(counters.tileModelsStore).toEqual(expect.any(Object));
            expect(counters.tileModelsStore.subscribe).toEqual(expect.any(Function));

            const unsubscribe = counters.tileModelsStore.subscribe(callback); // callback called

            counters.notifyTileModels(); // callback called
            counters.add(new CurvedTileEnlargedModel(specs));
            counters.remove(new CurvedTileEnlargedModel(specs));
            counters.delete(keys[1]); // callback called
            counters.remove(new CurvedTileEnlargedModel(specs));
            counters.add(new CurvedTileEnlargedModel(specs)); // callback called
            counters.delete(keys[1]); // callback called
            counters.increment(keys[1]);
            counters.decrement(keys[1]);
            counters.clear(); // callback called

            unsubscribe();
            counters.add(new StraightTileModel(specs));

            expect(callback).toHaveBeenCalledTimes(6);
        });
    });
});
