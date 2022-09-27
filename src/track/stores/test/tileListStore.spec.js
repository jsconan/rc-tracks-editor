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

import { CURVED_TILE_TYPE } from '../../helpers';
import { TileSpecifications } from '../../config';
import { TileList } from '../../models';
import tileListStore from '../tileListStore.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

describe('tileListStore', () => {
    it('is a function', () => {
        expect(tileListStore).toEqual(expect.any(Function));
    });

    describe('throws error', () => {
        it('if the given object is not a TileList', () => {
            expect(() => tileListStore({})).toThrow('The model must be an instance of TileList!');

            const store = tileListStore();
            expect(() => store.bind({})).toThrow('The model must be an instance of TileList!');
        });
    });

    it('creates a store', () => {
        const list = new TileList(specs);
        const store = tileListStore(list);

        expect(store).toEqual(expect.any(Object));
        expect(store.subscribe).toEqual(expect.any(Function));
        expect(store.bind).toEqual(expect.any(Function));
        expect(store.unbind).toEqual(expect.any(Function));
        expect(store.boundTo).toBe(list);
    });

    it('updates the store each time the list of tiles is modified', () => {
        const list = new TileList(specs);
        const store = tileListStore(list);

        expect(store.boundTo).toBe(list);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(list);
        });

        store.subscribe(callback);

        const tile = list.append();
        list.remove(tile.id);
        list.update();

        expect(callback).toHaveBeenCalledTimes(4);
    });

    it('can bind the list of tiles later', () => {
        const list = new TileList(specs);
        const store = tileListStore();

        const callback = jest.fn().mockImplementation(value => {
            if (value) {
                expect(value).toBe(list);
            }
        });

        store.subscribe(callback);

        list.update();

        expect(store.boundTo).toBeNull();
        expect(store.bind(list)).toBe(store);
        expect(store.boundTo).toBe(list);

        list.update();

        expect(callback).toHaveBeenCalledTimes(3);
    });

    it('can replace the event emitter later', () => {
        const list1 = new TileList(specs);
        const list2 = new TileList(specs);
        const store = tileListStore(list1);

        const callback1 = jest.fn().mockImplementation(value => {
            expect(value).toBe(list1);
        });

        const callback2 = jest.fn().mockImplementation(value => {
            expect(value).toBe(list2);
        });

        const unsubscribe = store.subscribe(callback1);

        unsubscribe();

        expect(store.boundTo).toBe(list1);

        store.bind(list2);
        store.subscribe(callback2);

        expect(store.boundTo).toBe(list2);

        list2.update();

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(2);
    });

    it('can release the listeners', () => {
        const list = new TileList(specs);
        const store = tileListStore(list);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(list);
        });

        store.subscribe(callback);

        list.update();

        expect(store.boundTo).toBe(list);

        expect(store.unbind()).toBe(store);

        expect(store.boundTo).toBeNull();

        list.update();

        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('does not impact the other listeners when releasing', () => {
        const list = new TileList(specs);
        const store = tileListStore(list);

        const listener = jest.fn();

        list.on('update', listener);

        list.update();

        store.unbind();

        list.update();

        expect(listener).toHaveBeenCalledTimes(2);
    });

    it('can notify changes applied to the list', () => {
        const list = new TileList(specs);
        const store = tileListStore(list);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(list);
            expect(value).toMatchSnapshot();
        });

        const unsubscribe = store.subscribe(callback); // callback called

        list.setSpecs(specs);
        const tile1 = list.append(CURVED_TILE_TYPE); // callback called
        const tile2 = list.prepend(CURVED_TILE_TYPE); // callback called
        list.remove(tile1.id); // callback called
        const tile3 = list.replace(tile2.id); // callback called
        list.insertBefore(tile3.id); // callback called
        list.insertAfter(tile3.id); // callback called
        const data = list.export();
        list.clear(); // callback called
        list.import(data); // callback called
        list.setSpecs(new TileSpecifications(10, 1, 2)); // callback called
        list.update(); // callback called

        unsubscribe();
        list.append();

        expect(callback).toHaveBeenCalledTimes(11);
    });
});
