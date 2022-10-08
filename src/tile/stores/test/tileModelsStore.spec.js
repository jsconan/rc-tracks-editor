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
import { StraightTileModel, TileCounter } from '../../models';
import tileModelsStore from '../tileModelsStore.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

describe('tileModelsStore', () => {
    it('is a function', () => {
        expect(tileModelsStore).toEqual(expect.any(Function));
    });

    describe('throws error', () => {
        it('if the given object is not a TileCounter', () => {
            expect(() => tileModelsStore({})).toThrow('The object must be an instance of TileCounter!');

            const store = tileModelsStore();
            expect(() => store.bind({})).toThrow('The object must be an instance of TileCounter!');
        });
    });

    it('creates a store', () => {
        const counter = new TileCounter();
        const store = tileModelsStore(counter);

        expect(store).toEqual(expect.any(Object));
        expect(store.subscribe).toEqual(expect.any(Function));
        expect(store.notify).toEqual(expect.any(Function));
        expect(store.bind).toEqual(expect.any(Function));
        expect(store.unbind).toEqual(expect.any(Function));
        expect(store.boundTo).toBe(counter);
    });

    it('updates the store each time a counter is modified', () => {
        const counter = new TileCounter();
        const store = tileModelsStore(counter);

        expect(store.boundTo).toBe(counter);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).not.toBe(counter);
            expect(value).toEqual(counter.getModelList());
        });

        store.subscribe(callback);

        const tile = new StraightTileModel(specs);
        counter.add(tile);
        counter.remove(tile);

        expect(callback).toHaveBeenCalledTimes(3);
    });

    it('updates the store when calling the notify API', () => {
        const counter = new TileCounter();
        let currentEvent = null;
        const updateCallback = jest.fn().mockImplementation((value, event) => {
            expect(event).toBe(currentEvent);
            expect(value).toBe(counter);
            return value;
        });
        const store = tileModelsStore(counter, updateCallback);

        expect(store.boundTo).toBe(counter);

        const subscriberCallback = jest.fn().mockImplementation(value => {
            expect(value).toBe(counter);
        });

        store.subscribe(subscriberCallback);

        currentEvent = 'test';
        store.notify(currentEvent);

        expect(updateCallback).toHaveBeenCalledTimes(2);
        expect(subscriberCallback).toHaveBeenCalledTimes(2);
    });

    it('can bind the counter later', () => {
        const counter = new TileCounter();
        const store = tileModelsStore();

        const callback = jest.fn().mockImplementation(value => {
            if (value) {
                expect(value).not.toBe(counter);
                expect(value).toEqual(counter.getModelList());
            }
        });

        store.subscribe(callback);

        const tile = new StraightTileModel(specs);
        counter.add(tile);

        expect(store.boundTo).toBeNull();
        expect(store.bind(counter)).toBe(store);
        expect(store.boundTo).toBe(counter);

        counter.clear();

        expect(callback).toHaveBeenCalledTimes(3);
    });

    it('can replace the event emitter later', () => {
        const counter1 = new TileCounter();
        const counter2 = new TileCounter();
        const store = tileModelsStore(counter1);

        const callback1 = jest.fn().mockImplementation(value => {
            expect(value).not.toBe(counter1);
            expect(value).toEqual(counter1.getModelList());
        });

        const callback2 = jest.fn().mockImplementation(value => {
            expect(value).not.toBe(counter2);
            expect(value).toEqual(counter2.getModelList());
        });

        const unsubscribe = store.subscribe(callback1);

        const tile = new StraightTileModel(specs);
        counter1.add(tile);

        unsubscribe();

        expect(store.boundTo).toBe(counter1);

        store.bind(counter2);
        store.subscribe(callback2);

        expect(store.boundTo).toBe(counter2);

        counter2.add(tile);

        expect(callback1).toHaveBeenCalledTimes(2);
        expect(callback2).toHaveBeenCalledTimes(2);
    });

    it('accepts a callback to set the store each time a listed event is emitted', () => {
        const counter = new TileCounter();
        const data = {};

        let currentEvent = null;
        const update = jest.fn().mockImplementation((value, event) => {
            expect(event).toBe(currentEvent);
            expect(value).toBe(counter);
            return data;
        });

        const store = tileModelsStore(counter, update);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(data);
        });

        store.subscribe(callback);

        currentEvent = 'clear';
        counter.clear();

        expect(update).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('can release the listeners', () => {
        const counter = new TileCounter();
        const store = tileModelsStore(counter);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).not.toBe(counter);
            expect(value).toEqual(counter.getModelList());
        });

        store.subscribe(callback);

        const tile = new StraightTileModel(specs);
        counter.add(tile);

        expect(store.boundTo).toBe(counter);

        expect(store.unbind()).toBe(store);

        expect(store.boundTo).toBeNull();

        counter.clear();

        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('does not impact the other listeners when releasing', () => {
        const clear = new TileCounter();
        const store = tileModelsStore(clear);

        const listener = jest.fn();

        clear.on('clear', listener);

        clear.clear();

        store.unbind();

        clear.clear();

        expect(listener).toHaveBeenCalledTimes(2);
    });

    it('can notify changes applied to the counter', () => {
        const counter = new TileCounter();
        const store = tileModelsStore(counter);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).not.toBe(counter);
            expect(value).toMatchSnapshot();
        });

        const unsubscribe = store.subscribe(callback); // callback called

        const tile = new StraightTileModel(specs);
        counter.add(tile); // callback called
        counter.remove(tile); // callback called
        counter.add(tile); // callback called

        counter.clear(); // callback called

        unsubscribe();
        counter.add(tile);

        expect(callback).toHaveBeenCalledTimes(5);
    });
});
