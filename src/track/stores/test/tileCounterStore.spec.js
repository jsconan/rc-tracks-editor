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
import { StraightTileModel, TileModelCounter } from '../../models';
import tileCounterStore from '../tileCounterStore.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

describe('tileCounterStore', () => {
    it('is a function', () => {
        expect(tileCounterStore).toEqual(expect.any(Function));
    });

    describe('throws error', () => {
        it('if the given object is not a TileModelCounter', () => {
            expect(() => tileCounterStore({})).toThrow('The object must be an instance of TileModelCounter!');

            const store = tileCounterStore();
            expect(() => store.bind({})).toThrow('The object must be an instance of TileModelCounter!');
        });
    });

    it('creates a store', () => {
        const counter = new TileModelCounter();
        const store = tileCounterStore(counter);

        expect(store).toEqual(expect.any(Object));
        expect(store.subscribe).toEqual(expect.any(Function));
        expect(store.bind).toEqual(expect.any(Function));
        expect(store.unbind).toEqual(expect.any(Function));
        expect(store.boundTo).toBe(counter);
    });

    it('updates the store each time a counter is modified', () => {
        const counter = new TileModelCounter();
        const store = tileCounterStore(counter);

        expect(store.boundTo).toBe(counter);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(counter);
        });

        store.subscribe(callback);

        const tile = new StraightTileModel(specs);
        counter.add(tile);
        counter.remove(tile);

        expect(callback).toHaveBeenCalledTimes(4);
    });

    it('can bind the list of tiles later', () => {
        const counter = new TileModelCounter();
        const store = tileCounterStore();

        const callback = jest.fn().mockImplementation(value => {
            if (value) {
                expect(value).toBe(counter);
            }
        });

        store.subscribe(callback);

        counter.clear();

        expect(store.boundTo).toBeNull();
        expect(store.bind(counter)).toBe(store);
        expect(store.boundTo).toBe(counter);

        counter.clear();

        expect(callback).toHaveBeenCalledTimes(3);
    });

    it('can replace the event emitter later', () => {
        const counter1 = new TileModelCounter();
        const counter2 = new TileModelCounter();
        const store = tileCounterStore(counter1);

        const callback1 = jest.fn().mockImplementation(value => {
            expect(value).toBe(counter1);
        });

        const callback2 = jest.fn().mockImplementation(value => {
            expect(value).toBe(counter2);
        });

        const unsubscribe = store.subscribe(callback1);

        unsubscribe();

        expect(store.boundTo).toBe(counter1);

        store.bind(counter2);
        store.subscribe(callback2);

        expect(store.boundTo).toBe(counter2);

        counter2.clear();

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(2);
    });

    it('can release the listeners', () => {
        const counter = new TileModelCounter();
        const store = tileCounterStore(counter);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(counter);
        });

        store.subscribe(callback);

        counter.clear();

        expect(store.boundTo).toBe(counter);

        expect(store.unbind()).toBe(store);

        expect(store.boundTo).toBeNull();

        counter.clear();

        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('does not impact the other listeners when releasing', () => {
        const clear = new TileModelCounter();
        const store = tileCounterStore(clear);

        const listener = jest.fn();

        clear.on('clear', listener);

        clear.clear();

        store.unbind();

        clear.clear();

        expect(listener).toHaveBeenCalledTimes(2);
    });

    it('can notify changes applied to the counter', () => {
        const counter = new TileModelCounter();
        const store = tileCounterStore(counter);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(counter);
            expect(value).toMatchSnapshot();
        });

        const unsubscribe = store.subscribe(callback); // callback called

        const tile = new StraightTileModel(specs);
        counter.add(tile); // callback called
        counter.remove(tile); // callback called x2

        counter.clear(); // callback called

        unsubscribe();
        counter.clear();

        expect(callback).toHaveBeenCalledTimes(5);
    });
});
