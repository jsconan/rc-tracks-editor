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

import { TileSpecifications } from '../../../tile/config';
import { CurvedTileEnlargedModel, CurvedTileModel, StraightTileModel, TileCounter } from '../../../tile/models';
import { TileSet } from '../TileSet.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const maxRatio = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks, maxRatio);
const tiles = [
    new StraightTileModel(specs),
    new CurvedTileEnlargedModel(specs),
    new StraightTileModel(specs),
    new CurvedTileModel(specs),
    new CurvedTileModel(specs),
    new StraightTileModel(specs)
];
const models = [
    new StraightTileModel(specs),
    new CurvedTileModel(specs, CurvedTileModel.DIRECTION_RIGHT, 1),
    new CurvedTileModel(specs, CurvedTileModel.DIRECTION_RIGHT, 2),
    new CurvedTileModel(specs, CurvedTileModel.DIRECTION_RIGHT, 3),
    new CurvedTileModel(specs, CurvedTileModel.DIRECTION_RIGHT, 4),
    new CurvedTileEnlargedModel(specs)
];
const defaultEntries = [
    [models[0].modelId, Number.POSITIVE_INFINITY],
    [models[1].modelId, Number.POSITIVE_INFINITY],
    [models[2].modelId, Number.POSITIVE_INFINITY],
    [models[3].modelId, Number.POSITIVE_INFINITY],
    [models[4].modelId, Number.POSITIVE_INFINITY],
    [models[5].modelId, Number.POSITIVE_INFINITY]
];
const entries = [
    [tiles[0].modelId, 3],
    [tiles[1].modelId, 1],
    [tiles[3].modelId, 2]
];
const keys = entries.map(entry => entry[0]);
const counters = [
    [tiles[0], 3],
    [tiles[1], 1],
    [tiles[3], 2]
];

describe('TileSet', () => {
    it('is a class', () => {
        expect(TileSet).toEqual(expect.any(Function));
    });

    it('extends the class TileCounter', () => {
        expect(new TileSet(specs)).toBeInstanceOf(TileCounter);
    });

    it('needs a specifications object', () => {
        const counter = new TileSet(specs);

        expect(counter.specs).toBe(specs);

        expect(() => new TileSet()).toThrow('The specifications object must be an instance of TileSpecifications!');
        expect(() => new TileSet({})).toThrow('The specifications object must be an instance of TileSpecifications!');
    });

    it('is created with a default set', () => {
        expect([...new TileSet(specs)]).toEqual(defaultEntries);
    });

    it('can be initialized with a list of tiles', () => {
        expect([...new TileSet(specs, tiles)]).toEqual(entries);
    });

    it('can be initialized with a list of model counters', () => {
        expect([...new TileSet(specs, counters)]).toEqual(entries);
    });

    it('can set the specifications of the tile models', () => {
        const counter = new TileSet(specs);
        const newSpecs = new TileSpecifications(10, 1, 2);
        const callback = jest.fn().mockImplementation(s => {
            expect(s).toBe(newSpecs);
        });

        counter.on('specs', callback);

        expect(counter.setSpecs(newSpecs)).toBe(counter);
        counter.load(tiles);

        expect(counter.setSpecs(newSpecs)).toBe(counter);
        expect(counter.getModelList()).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('has a size', () => {
        expect(new TileSet(specs).size).toBe(defaultEntries.length);
        expect(new TileSet(specs, []).size).toBe(0);
        expect(new TileSet(specs, tiles).size).toBe(entries.length);
    });

    it('implements the iteration protocol', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter[Symbol.iterator]).toEqual(expect.any(Function));
        expect(counter[Symbol.iterator]()).not.toBe(counter[Symbol.iterator]());
        expect([...counter]).toStrictEqual(entries);
    });

    it('can produce an iterator for getting the keys', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.keys).toEqual(expect.any(Function));
        expect(counter.keys()[Symbol.iterator]).toEqual(expect.any(Function));

        expect(counter.keys()).not.toBe(counter.keys());
        expect([...counter.keys()]).toStrictEqual(keys);
    });

    it('can walk over its counters', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.forEach).toEqual(expect.any(Function));

        const iterator = entries[Symbol.iterator]();
        const callback = jest.fn().mockImplementation(function (value, key, thisCounters) {
            expect(this).toBe(counter);
            expect(thisCounters).toBe(counter);
            const [iteratorKey, iteratorValue] = iterator.next().value;
            expect(value).toBe(iteratorValue);
            expect(key).toBe(iteratorKey);
        });

        expect(counter.forEach(callback)).toBe(counter);
        expect(callback).toHaveBeenCalledTimes(entries.length);
    });

    it('needs a valid callback to walk over counters', () => {
        expect(() => new TileSet(specs).forEach()).toThrow('A callback function is expected!');
    });

    it('can map its counters', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.map).toEqual(expect.any(Function));

        const iterator = entries[Symbol.iterator]();
        const callback = jest.fn().mockImplementation(function (value, key, thisCounter) {
            expect(this).toBe(counter);
            expect(thisCounter).toBe(counter);
            const [iteratorKey, iteratorValue] = iterator.next().value;
            expect(value).toBe(iteratorValue);
            expect(key).toBe(iteratorKey);
            return value * 10;
        });

        const mapped = counter.map(callback);
        expect(mapped).not.toBe(counter);
        expect(mapped).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(entries.length);
    });

    it('needs a valid callback to map counters', () => {
        expect(() => new TileSet(specs).map()).toThrow('A callback function is expected!');
    });

    it('can tell if a counter exists', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.has(keys[0])).toBeTruthy();
        expect(counter.has(keys[1])).toBeTruthy();
        expect(counter.has(keys[2])).toBeTruthy();
        expect(counter.has('key')).toBeFalsy();
    });

    it('can get the value of a counter', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.get(keys[0])).toBe(3);
        expect(counter.get(keys[1])).toBe(1);
        expect(counter.get(keys[2])).toBe(2);
        expect(counter.get('key')).toBe(0);
    });

    it('can set the value of a counter', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.get(keys[0])).toBe(3);
        expect(counter.set(keys[0], 10)).toBe(counter);
        expect(counter.get(keys[0])).toBe(10);

        expect(counter.get('key')).toBe(0);
        expect(counter.set('key', 1)).toBe(counter);
        expect(counter.get('key')).toBe(1);
    });

    it('can only set whole numbers', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.get(keys[0])).toBe(3);
        expect(counter.set(keys[0], 1.2)).toBe(counter);
        expect(counter.get(keys[0])).toBe(1);

        expect(counter.set(keys[0], 2.9)).toBe(counter);
        expect(counter.get(keys[0])).toBe(2);

        expect(counter.set(keys[0], 'c')).toBe(counter);
        expect(counter.get(keys[0])).toBe(0);
    });

    it('emits an event when setting a counter', () => {
        const counter = new TileSet(specs, tiles);

        const callback = jest.fn().mockImplementation((key, value, previous) => {
            expect([key, value, previous]).toMatchSnapshot();
        });

        counter.on('set', callback);

        counter.set(keys[0], 3);
        counter.set(keys[1], 4);
        counter.set(keys[2], 5);
        expect(callback).toHaveBeenCalledTimes(3);
    });

    it('can delete a counter', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.has(keys[0])).toBeTruthy();
        expect(counter.delete(keys[0])).toBeTruthy();
        expect(counter.has(keys[0])).toBeFalsy();
        expect(counter.get(keys[0])).toBe(0);
        expect(counter.delete(keys[0])).toBeFalsy();
    });

    it('can delete a model', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.getModel(keys[0])).not.toBeNull();
        expect(counter.delete(keys[0])).toBeTruthy();
        expect(counter.getModel(keys[0])).toBeNull();
    });

    it('emits an event when removing a counter', () => {
        const counter = new TileSet(specs, tiles);
        const tileModel = counter.getModel(keys[1]);

        const deleteCallback = jest.fn().mockImplementation((key, value) => {
            expect(key).toBe(keys[1]);
            expect(value).toBe(1);
        });

        const removeModelCallback = jest.fn().mockImplementation((key, model) => {
            expect(key).toBe(keys[1]);
            expect(model).toBe(tileModel);
        });

        counter.on('delete', deleteCallback);
        counter.on('removemodel', removeModelCallback);

        counter.delete(keys[1]);
        counter.delete(keys[1]);
        expect(deleteCallback).toHaveBeenCalledTimes(1);
        expect(removeModelCallback).toHaveBeenCalledTimes(1);
    });

    it('can increment a counter', () => {
        const counter = new TileSet(specs, []);

        expect(counter.get(keys[0])).toBe(0);
        expect(counter.increment(keys[0])).toBe(counter);
        expect(counter.get(keys[0])).toBe(1);
        expect(counter.increment(keys[0], 2)).toBe(counter);
        expect(counter.get(keys[0])).toBe(3);

        expect(counter.increment(keys[0], 2.5)).toBe(counter);
        expect(counter.get(keys[0])).toBe(5);

        expect(counter.increment(keys[0], 0)).toBe(counter);
        expect(counter.get(keys[0])).toBe(6);
    });

    it('emits an event when incrementing a counter', () => {
        const counter = new TileSet(specs, tiles);

        const callback = jest.fn().mockImplementation((key, value, previous) => {
            expect(key).toBe(keys[1]);
            expect(value).toBe(2);
            expect(previous).toBe(1);
        });

        counter.on('set', callback);

        counter.increment(keys[1]);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can decrement a counter', () => {
        const counter = new TileSet(specs, []);

        expect(counter.get(keys[0])).toBe(0);
        expect(counter.decrement(keys[0])).toBe(counter);
        expect(counter.get(keys[0])).toBe(-1);
        expect(counter.decrement(keys[0], 2)).toBe(counter);
        expect(counter.get(keys[0])).toBe(-3);

        expect(counter.decrement(keys[0], 2.5)).toBe(counter);
        expect(counter.get(keys[0])).toBe(-5);

        expect(counter.decrement(keys[0], 0)).toBe(counter);
        expect(counter.get(keys[0])).toBe(-6);
    });

    it('emits an event when decrementing a counter', () => {
        const counter = new TileSet(specs, tiles);

        const callback = jest.fn().mockImplementation((key, value, previous) => {
            expect(key).toBe(keys[1]);
            expect(value).toBe(0);
            expect(previous).toBe(1);
        });

        counter.on('set', callback);

        counter.decrement(keys[1]);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can list the counters', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.getCounterList()).toMatchSnapshot();
    });

    it('can list the counted tile models', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.getModelList()).toMatchSnapshot();
    });

    it('can get the tile model for a given key', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.getModel(keys[0])).toMatchSnapshot();
        expect(counter.getModel(keys[1])).toMatchSnapshot();
        expect(counter.getModel(keys[2])).toMatchSnapshot();
        expect(counter.getModel(keys[3])).toBeNull();
    });

    it('can add a tile to the counters', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.get(keys[2])).toBe(2);
        expect(counter.add(new CurvedTileModel(specs))).toBe(counter);
        expect(counter.get(keys[2])).toBe(3);
    });

    it('can add multiple tiles to the counters', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.get(keys[2])).toBe(2);
        expect(counter.add(new CurvedTileModel(specs), 3)).toBe(counter);
        expect(counter.get(keys[2])).toBe(5);
    });

    it('can register a tile model', () => {
        const counter = new TileSet(specs, tiles);
        const tile = new CurvedTileModel(specs, CurvedTileModel.DIRECTION_LEFT, 2);

        expect(counter.get(tile.modelId)).toBe(0);
        expect(counter.getModel(tile.modelId)).toBeNull();

        counter.add(tile);

        expect(counter.get(tile.modelId)).toBe(1);
        expect(counter.getModel(tile.modelId)).not.toBeNull();
    });

    it('emits an event when registering a tile model', () => {
        const counter = new TileSet(specs, tiles);
        const tile = new CurvedTileModel(specs, CurvedTileModel.DIRECTION_LEFT, 2);

        const modelCallback = jest.fn().mockImplementation((key, model) => {
            expect(key).toBe(tile.modelId);
            expect(model).toBeInstanceOf(CurvedTileModel);
            expect(model.modelId).toBe(tile.modelId);
        });
        const tileCallback = jest.fn().mockImplementation((model, amount) => {
            expect(model).toBe(tile);
            expect(amount).toBe(2);
        });

        counter.on('addmodel', modelCallback);
        counter.on('addtile', tileCallback);

        expect(counter.get(tile.modelId)).toBe(0);

        counter.add(tile, 2);
        counter.add(tile, 2);

        expect(counter.get(tile.modelId)).toBe(4);
        expect(modelCallback).toHaveBeenCalledTimes(1);
        expect(tileCallback).toHaveBeenCalledTimes(2);
    });

    it('can remove a tile from the counters', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.get(keys[2])).toBe(2);
        expect(counter.remove(new CurvedTileModel(specs))).toBe(counter);
        expect(counter.get(keys[2])).toBe(1);
    });

    it('can remove multiple tiles from the counters', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.get(keys[2])).toBe(2);
        expect(counter.remove(new CurvedTileModel(specs), 2)).toBe(counter);
        expect(counter.get(keys[2])).toBe(0);
    });

    it('can unregister a tile model', () => {
        const counter = new TileSet(specs, tiles);
        const tile = new CurvedTileEnlargedModel(specs);

        expect(counter.get(tile.modelId)).toBe(1);
        expect(counter.getModel(tile.modelId)).not.toBeNull();

        counter.remove(tile);

        expect(counter.get(tile.modelId)).toBe(0);
        expect(counter.getModel(tile.modelId)).toBeNull();
    });

    it('emits an event when un-registering a tile model', () => {
        const counter = new TileSet(specs, tiles);
        const tile = new CurvedTileModel(specs);
        let count = 2;

        const modelCallback = jest.fn().mockImplementation((key, model) => {
            expect(key).toBe(tile.modelId);
            expect(model).toBeInstanceOf(CurvedTileModel);
            expect(model.modelId).toBe(tile.modelId);
        });
        const tileCallback = jest.fn().mockImplementation((model, amount) => {
            expect(model).toBe(tile);
            expect(amount).toBe(count);
        });

        counter.on('removemodel', modelCallback);
        counter.on('removetile', tileCallback);

        expect(counter.get(tile.modelId)).toBe(2);

        counter.add(tile);
        counter.remove(tile, 2);
        count = 1;
        counter.remove(tile, 2);
        counter.remove(tile, 2);

        expect(counter.get(tile.modelId)).toBe(0);
        expect(modelCallback).toHaveBeenCalledTimes(1);
        expect(tileCallback).toHaveBeenCalledTimes(2);
    });

    it('can removes all counters', () => {
        const counter = new TileSet(specs, tiles);

        expect([...counter]).toStrictEqual(entries);
        expect(counter.clear()).toBe(counter);
        expect([...counter]).toStrictEqual([]);
        expect(counter.getModelList()).toStrictEqual([]);
    });

    it('emits an event when removing all counters', () => {
        const counter = new TileSet(specs, tiles);

        const callback = jest.fn();

        counter.on('clear', callback);

        counter.clear();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can load counters from a list of tiles', () => {
        const counter = new TileSet(specs, []);

        expect([...counter]).toStrictEqual([]);
        expect(counter.load({})).toBe(counter);
        expect([...counter]).toStrictEqual([]);
        expect(counter.load(tiles)).toBe(counter);
        expect([...counter]).toStrictEqual(entries);
    });

    it('can load counters from a list of model counters', () => {
        const counter = new TileSet(specs, []);

        expect([...counter]).toStrictEqual([]);
        expect(counter.load(counters)).toBe(counter);
        expect([...counter]).toStrictEqual(entries);
    });

    it('emits an event when loading counters', () => {
        const counter = new TileSet(specs, []);

        const callback = jest.fn();

        counter.on('load', callback);

        counter.load({});
        counter.load(tiles);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can load counters from the full list of tile models', () => {
        const counter = new TileSet(specs, []);

        const callback = jest.fn();

        counter.on('load', callback);

        expect([...counter]).toStrictEqual([]);

        expect(counter.loadAllModels()).toBe(counter);
        expect([...counter]).toMatchSnapshot();

        expect(counter.loadAllModels(10)).toBe(counter);
        expect([...counter]).toMatchSnapshot();

        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('can export counters', () => {
        const counter = new TileSet(specs, tiles);

        expect(counter.toObject()).toMatchSnapshot();
    });

    it('can reset counters', () => {
        const counter = new TileSet(specs, tiles);
        const tile = new CurvedTileModel(specs);

        const callback = jest.fn();

        counter.on('reset', callback);

        counter.remove(tile, 3);
        expect(counter.toObject()).toMatchSnapshot();
        expect(counter.counter.toObject()).toMatchSnapshot();

        counter.reset();

        expect(counter.toObject()).toMatchSnapshot();
        expect(counter.counter.toObject()).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can consume counters', () => {
        const counter = new TileSet(specs, tiles);
        const tile = new CurvedTileModel(specs);

        const callback = jest.fn();

        counter.on('consume', callback);

        expect(counter.toObject()).toMatchSnapshot();

        counter.consume([tile, tile, tile]);

        expect(counter.toObject()).toMatchSnapshot();
        expect(counter.counter.toObject()).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(1);
    });
});
