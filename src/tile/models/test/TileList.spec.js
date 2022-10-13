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

import {
    CURVED_TILE_ENLARGED_TYPE,
    CURVED_TILE_TYPE,
    STRAIGHT_TILE_TYPE,
    TILE_DIRECTION_LEFT,
    TILE_DIRECTION_RIGHT
} from '../../helpers';
import { List } from '../../../core/models';
import { CurvedTileModel } from '../CurvedTileModel.js';
import { CurvedTileEnlargedModel } from '../CurvedTileEnlargedModel.js';
import { StraightTileModel } from '../StraightTileModel.js';
import { TileSpecifications } from '../../config';
import { TileList } from '../TileList.js';
import { TileModel } from '../TileModel.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications({ laneWidth, barrierWidth, barrierChunks });

const source = [new StraightTileModel(specs), new CurvedTileModel(specs), new CurvedTileEnlargedModel(specs)];

describe('TileList', () => {
    it('is a class', () => {
        expect(TileList).toEqual(expect.any(Function));
    });

    it('extends the class List', () => {
        expect(new TileList(specs)).toBeInstanceOf(List);
    });

    it('needs a specifications object', () => {
        const list = new TileList(specs);

        expect(list.specs).toBe(specs);

        expect(() => new TileList()).toThrow('The specifications object must be an instance of TileSpecifications!');
        expect(() => new TileList({})).toThrow('The specifications object must be an instance of TileSpecifications!');
    });

    it('can be initialized with a source', () => {
        expect([...new TileList(specs)]).toEqual([]);
        expect([...new TileList(specs, source)]).toMatchSnapshot();
    });

    it('has a length', () => {
        const list = new TileList(specs);

        expect(list.length).toBe(0);

        list.load(source);

        expect(list.length).toBe(3);
    });

    it('implements the iteration protocol', () => {
        const list = new TileList(specs, source);

        expect(list[Symbol.iterator]).toEqual(expect.any(Function));
        expect(list[Symbol.iterator]()).not.toBe(list[Symbol.iterator]());

        expect([...list]).toMatchSnapshot();
    });

    it('can produce an iterator', () => {
        const list = new TileList(specs, source);

        expect(list.values).toEqual(expect.any(Function));
        expect(list.values()[Symbol.iterator]).toEqual(expect.any(Function));

        expect(list.values()).not.toBe(list.values());
        expect([...list.values()]).toMatchSnapshot();
    });

    it('can walk over its values', () => {
        const list = new TileList(specs, source);

        expect(list.forEach).toEqual(expect.any(Function));

        const iterator = source[Symbol.iterator]();
        let i = 0;
        const callback = jest.fn().mockImplementation(function (tile, index, thisList) {
            expect(this).toBe(list);
            expect(thisList).toBe(list);
            expect(tile).toBe(iterator.next().value);
            expect(index).toBe(i++);
        });

        expect(list.forEach(callback)).toBe(list);
        expect(callback).toHaveBeenCalledTimes(source.length);
    });

    it('needs a valid callback to walk over values', () => {
        expect(() => new TileList(specs).forEach()).toThrow('A callback function is expected!');
    });

    it('can map its values', () => {
        const list = new TileList(specs, source);

        expect(list.map).toEqual(expect.any(Function));

        const iterator = source[Symbol.iterator]();
        let i = 0;
        const callback = jest.fn().mockImplementation(function (tile, index, thisList) {
            expect(this).toBe(list);
            expect(thisList).toBe(list);
            expect(tile).toBe(iterator.next().value);
            expect(index).toBe(i++);
            return tile.modelId;
        });

        const mapped = list.map(callback);
        expect(mapped).not.toBe(list);
        expect(mapped).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(source.length);
    });

    it('needs a valid callback to map values', () => {
        expect(() => new TileList(specs).map()).toThrow('A callback function is expected!');
    });

    describe('throws error', () => {
        it('when trying to set an invalid specifications object', () => {
            const list = new TileList(specs);
            expect(() => list.setSpecs({})).toThrow(
                'The specifications object must be an instance of TileSpecifications!'
            );
        });

        it('when trying to add a tile that is not a TileModel', () => {
            const list = new TileList(specs);
            expect(() => list.add({})).toThrow('The object must be an instance of TileModel!');
            expect(() => list.set(0, {})).toThrow('The object must be an instance of TileModel!');
            expect(() => list.insert(0, {})).toThrow('The object must be an instance of TileModel!');
            expect(() => list.load([{}])).toThrow('The object must be an instance of TileModel!');
        });

        it('when trying to add a tile with an invalid type', () => {
            const list = new TileList(specs);
            const tile = list.append();
            expect(() => list.append('')).toThrow('A valid type of tile is needed!');
            expect(() => list.prepend('')).toThrow('A valid type of tile is needed!');
            expect(() => list.replace(tile.id, '')).toThrow('A valid type of tile is needed!');
            expect(() => list.insertBefore(tile.id, '')).toThrow('A valid type of tile is needed!');
            expect(() => list.insertAfter(tile.id, '')).toThrow('A valid type of tile is needed!');
            expect(() => list.import([{ type: '' }])).toThrow('A valid type of tile is needed!');
        });

        it('when trying to add a tile with an invalid direction', () => {
            const list = new TileList(specs);
            const tile = list.append();
            expect(() => list.append(CURVED_TILE_TYPE, '')).toThrow('A valid direction is needed!');
            expect(() => list.prepend(CURVED_TILE_TYPE, '')).toThrow('A valid direction is needed!');
            expect(() => list.replace(tile.id, CURVED_TILE_TYPE, '')).toThrow('A valid direction is needed!');
            expect(() => list.insertBefore(tile.id, CURVED_TILE_TYPE, '')).toThrow('A valid direction is needed!');
            expect(() => list.insertAfter(tile.id, CURVED_TILE_TYPE, '')).toThrow('A valid direction is needed!');
            expect(() => list.import([{ type: CURVED_TILE_TYPE, direction: '' }])).toThrow(
                'A valid direction is needed!'
            );
        });

        it('if a value is attempted to be set at a wrong index', () => {
            const list = new TileList(specs, source);
            const tile = new StraightTileModel(specs);
            expect(() => list.set(-1, tile)).toThrow('The list index is out of bounds!');
            expect(() => list.set(3, tile)).toThrow('The list index is out of bounds!');
        });
    });

    it('can set the specifications of the tiles', () => {
        const list = new TileList(specs);
        const newSpecs = new TileSpecifications({ laneWidth: 10, barrierWidth: 1, barrierChunks: 2 });
        const callback = jest.fn().mockImplementation(s => {
            expect(s).toBe(newSpecs);
        });

        list.on('specs', callback);

        list.append();

        expect(list.specs).toBeInstanceOf(TileSpecifications);
        expect(list.specs).not.toBe(newSpecs);
        expect(list.setSpecs(newSpecs)).toBe(list);
        expect(list.specs).toBe(newSpecs);
        expect(list).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    describe('can find the index of a particular tile', () => {
        it('using a search value', () => {
            const list = new TileList(specs, source);

            expect(list.find).toEqual(expect.any(Function));

            expect(list.find(source[1])).toBe(1);
        });

        it('using a filter callback', () => {
            const list = new TileList(specs, source);

            expect(list.find).toEqual(expect.any(Function));

            const iterator = source[Symbol.iterator]();
            let i = 0;
            const callback = jest.fn().mockImplementation(function (tile, index, thisList) {
                expect(this).toBe(list);
                expect(thisList).toBe(list);
                expect(tile).toBe(iterator.next().value);
                expect(index).toBe(i++);
                return tile.modelId === 'curved-tile-1';
            });

            expect(list.find(callback)).toBe(1);
            expect(callback).toHaveBeenCalledTimes(2);
        });

        it('but returns -1 if no value match the search ', () => {
            const list = new TileList(specs, source);

            expect(list.find(4)).toBe(-1);

            const iterator = source[Symbol.iterator]();
            let i = 0;
            const callback = jest.fn().mockImplementation(function (tile, index, thisList) {
                expect(this).toBe(list);
                expect(thisList).toBe(list);
                expect(tile).toBe(iterator.next().value);
                expect(index).toBe(i++);
                return tile.modelId === 'curved-tile-2';
            });

            expect(list.find(callback)).toBe(-1);
            expect(callback).toHaveBeenCalledTimes(3);
        });
    });

    it('can get the index of a tile in the list', () => {
        const list = new TileList(specs, source);
        const tile = source[1];

        expect(list.getIndex(tile.id)).toBe(1);
        expect(list.getIndex('id')).toBe(-1);
    });

    describe('can get a tile from the list', () => {
        it('by its identifier', () => {
            const list = new TileList(specs, source);
            const tile = source[1];

            expect(list.getById(tile.id)).toBe(tile);
            expect(list.getById('id')).toBeNull();
        });

        it('by its index', () => {
            const list = new TileList(specs, source);
            const tile = source[1];

            expect(list.get(1)).toBe(tile);
            expect(list.get(3)).toBeNull();
        });

        it('from the first position', () => {
            const list = new TileList(specs);

            expect(list.first).toEqual(expect.any(Function));

            expect(list.first()).toBeNull();

            list.load(source);

            expect(list.first()).toBe(source[0]);
        });

        it('from the last position', () => {
            const list = new TileList(specs);

            expect(list.last).toEqual(expect.any(Function));

            expect(list.last()).toBeNull();

            list.load(source);

            expect(list.last()).toBe(source[2]);
        });
    });

    describe('can set a tile', () => {
        it('at a particular index', () => {
            const list = new TileList(specs, source);

            expect(list.set).toEqual(expect.any(Function));

            expect(list.set(0, new StraightTileModel(specs, TILE_DIRECTION_LEFT, 2))).toBe(list);
            expect(list.set(1, new CurvedTileModel(specs, TILE_DIRECTION_LEFT, 2))).toBe(list);
            expect(list.set(2, new CurvedTileEnlargedModel(specs, TILE_DIRECTION_LEFT, 2))).toBe(list);
            expect([...list]).toMatchSnapshot();
        });

        it('in place of an existing tile', () => {
            const list = new TileList(specs, source);

            expect(list.setById).toEqual(expect.any(Function));

            expect(list.setById(source[1].id, new StraightTileModel(specs, TILE_DIRECTION_LEFT, 2))).toBe(list);
            expect(list.setById('id', new StraightTileModel(specs, TILE_DIRECTION_LEFT, 3))).toBe(list);
            expect([...list]).toMatchSnapshot();
        });
    });

    it('emits an event when setting a tile', () => {
        const list = new TileList(specs, source);

        const callback = jest.fn().mockImplementation((index, value, previous) => {
            expect([index, value, previous]).toMatchSnapshot();
        });

        list.on('set', callback);

        list.set(0, new StraightTileModel(specs, TILE_DIRECTION_LEFT, 3));
        list.setById(source[1].id, new CurvedTileModel(specs, TILE_DIRECTION_LEFT, 3));
        list.setById('id', new CurvedTileModel(specs));
        list.set(2, new CurvedTileEnlargedModel(specs, TILE_DIRECTION_LEFT, 3));
        expect(callback).toHaveBeenCalledTimes(3);
    });

    describe('can insert tiles', () => {
        it('at a particular index', () => {
            const list = new TileList(specs, source);

            expect(list.insert).toEqual(expect.any(Function));

            expect(
                list.insert(
                    1,
                    new StraightTileModel(specs, TILE_DIRECTION_LEFT, 2),
                    new StraightTileModel(specs, TILE_DIRECTION_LEFT, 3)
                )
            ).toBe(list);
            expect([...list]).toMatchSnapshot();
        });

        it('at the beginning', () => {
            const list = new TileList(specs, source);

            expect(list.insert).toEqual(expect.any(Function));

            expect(
                list.insert(
                    0,
                    new StraightTileModel(specs, TILE_DIRECTION_LEFT, 2),
                    new StraightTileModel(specs, TILE_DIRECTION_LEFT, 3)
                )
            ).toBe(list);
            expect([...list]).toMatchSnapshot();
        });

        it('at the end', () => {
            const list = new TileList(specs, source);

            expect(list.insert).toEqual(expect.any(Function));

            expect(
                list.insert(
                    3,
                    new StraightTileModel(specs, TILE_DIRECTION_LEFT, 2),
                    new StraightTileModel(specs, TILE_DIRECTION_LEFT, 3)
                )
            ).toBe(list);
            expect([...list]).toMatchSnapshot();
        });
    });

    it('emits an event when inserting values', () => {
        const list = new TileList(specs);

        const callback = jest.fn().mockImplementation((index, ...value) => {
            expect([index, ...value]).toMatchSnapshot();
        });

        list.on('add', callback);

        list.insert(
            1,
            new StraightTileModel(specs, TILE_DIRECTION_LEFT, 2),
            new StraightTileModel(specs, TILE_DIRECTION_LEFT, 3)
        );
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can add tiles to the list', () => {
        const list = new TileList(specs);

        expect(list.add).toEqual(expect.any(Function));

        expect(
            list.add(
                new StraightTileModel(specs, TILE_DIRECTION_LEFT, 2),
                new StraightTileModel(specs, TILE_DIRECTION_LEFT, 3)
            )
        ).toBe(list);
        expect([...list]).toMatchSnapshot();
    });

    it('emits an event when adding tiles', () => {
        const list = new TileList(specs, source);

        const callback = jest.fn().mockImplementation((index, ...value) => {
            expect([index, ...value]).toMatchSnapshot();
        });

        list.on('add', callback);

        list.add(
            new StraightTileModel(specs, TILE_DIRECTION_LEFT, 2),
            new StraightTileModel(specs, TILE_DIRECTION_LEFT, 3)
        );
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can remove tiles from a particular index', () => {
        const list = new TileList(specs, source);

        expect(list.delete).toEqual(expect.any(Function));

        expect(list.delete(1, 2)).toBe(2);
        expect(list.delete(2)).toBe(0);
        expect([...list]).toMatchSnapshot();
    });

    it('emits an event when removing tiles from a particular index', () => {
        const list = new TileList(specs, source);

        const callback = jest.fn().mockImplementation((index, ...value) => {
            expect([index, ...value]).toMatchSnapshot();
        });

        list.on('delete', callback);

        list.delete(1, 2);
        list.delete(1, 2);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    describe('can remove tiles by their identifier', () => {
        it('from the start', () => {
            const list = new TileList(specs, source);
            const tile = source[0];

            expect(list.remove(tile.id)).toBeTruthy();
            expect(list).toMatchSnapshot();
        });

        it('from the middle', () => {
            const list = new TileList(specs, source);
            const tile = source[1];

            expect(list.remove(tile.id)).toBeTruthy();
            expect(list).toMatchSnapshot();
        });

        it('from the end', () => {
            const list = new TileList(specs, source);
            const tile = source[2];

            expect(list.remove(tile.id)).toBeTruthy();
            expect(list).toMatchSnapshot();
        });

        it('at inexistent position', () => {
            const list = new TileList(specs, source);

            expect(list.remove('id')).toBeFalsy();
            expect(list).toMatchSnapshot();
        });

        it('emits an event when removing a tile by it identifier', () => {
            const list = new TileList(specs, source);
            const tile = source[0];

            const callback = jest.fn().mockImplementation((index, removed) => {
                expect(index).toBe(0);
                expect(removed).toBe(tile);
            });

            list.on('delete', callback);

            list.remove(tile.id);
            expect(callback).toHaveBeenCalledTimes(1);
        });
    });

    it('can clear the list', () => {
        const list = new TileList(specs, source);

        expect(list.clear).toEqual(expect.any(Function));

        expect([...list]).toEqual(source);
        expect(list.clear()).toBe(list);
        expect([...list]).toEqual([]);
    });

    it('emits an event when clearing the list', () => {
        const list = new TileList(specs, source);

        const callback = jest.fn();

        list.on('clear', callback);

        list.clear();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can load tiles from another source', () => {
        const list = new TileList(specs);

        expect(list.load).toEqual(expect.any(Function));

        expect(list.load({})).toBe(list);
        expect([...list]).toEqual([]);

        expect(list.load(source)).toBe(list);
        expect([...list]).toEqual(source);
    });

    it('emits an event when loading the list', () => {
        const list = new TileList(specs);

        const callback = jest.fn();

        list.on('load', callback);

        list.load(source);
        list.load({});
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can export the values to an array', () => {
        const list = new TileList(specs, source);

        expect(list.toArray).toEqual(expect.any(Function));
        expect(list.toArray()).toEqual(source);
    });

    describe('can create tiles', () => {
        describe('at the last position', () => {
            it('with the default specifications', () => {
                const list = new TileList(specs);

                const tile = list.append();

                expect(tile).toBeInstanceOf(TileModel);
                expect(list).toMatchSnapshot();
            });

            it('with a particular type', () => {
                const list = new TileList(specs);

                const tile = list.append(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                expect(tile).toBeInstanceOf(TileModel);
                expect(list).toMatchSnapshot();
            });

            it('emits an event when adding a tile', () => {
                const list = new TileList(specs, source);

                const callback = jest.fn().mockImplementation((index, tile) => {
                    expect(index).toBe(3);
                    expect(tile).toBeInstanceOf(TileModel);
                });

                list.on('add', callback);

                list.append();
                expect(callback).toHaveBeenCalledTimes(1);
            });
        });

        describe('replacing tiles', () => {
            it('with a tile having default specifications', () => {
                const list = new TileList(specs);

                list.append();
                const tile = list.append();
                list.append();
                const newTile = list.replace(tile.id);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(list).toMatchSnapshot();
            });

            it('with a tile having a particular type', () => {
                const list = new TileList(specs);

                list.append();
                list.append();
                const tile = list.append();
                const newTile = list.replace(tile.id, CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(list).toMatchSnapshot();
            });

            it('at inexistent position', () => {
                const list = new TileList(specs);

                list.append();
                expect(list.replace('id')).toBeNull();
                expect(list).toMatchSnapshot();
            });

            it('emits an event when replacing a tile', () => {
                const list = new TileList(specs);
                const tile = list.append();

                const callback = jest.fn().mockImplementation((index, newTile, oldTile) => {
                    expect(index).toBe(0);
                    expect(newTile).toBeInstanceOf(TileModel);
                    expect(newTile).not.toBe(oldTile);
                    expect(oldTile).toBe(tile);
                });

                list.on('set', callback);

                list.replace(tile.id);
                expect(callback).toHaveBeenCalledTimes(1);
            });
        });

        describe('at the first position', () => {
            it('with the default specifications', () => {
                const list = new TileList(specs);

                list.append();
                const tile = list.prepend();

                expect(tile).toBeInstanceOf(TileModel);
                expect(list).toMatchSnapshot();
            });

            it('with a particular type', () => {
                const list = new TileList(specs);

                list.append();
                const tile = list.prepend(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                expect(tile).toBeInstanceOf(TileModel);
                expect(list).toMatchSnapshot();
            });

            it('emits an event when adding a tile', () => {
                const list = new TileList(specs);

                const callback = jest.fn().mockImplementation((index, tile) => {
                    expect(index).toBe(0);
                    expect(tile).toBeInstanceOf(TileModel);
                });

                list.on('add', callback);

                list.prepend();
                expect(callback).toHaveBeenCalledTimes(1);
            });
        });

        describe('before', () => {
            it('an inexistent position', () => {
                const list = new TileList(specs);

                list.append();

                expect(list.insertBefore('id')).toBeNull();
                expect(list).toMatchSnapshot();
            });

            it('the first position', () => {
                const list = new TileList(specs);

                const tile = list.append();
                list.append();
                const newTile = list.insertBefore(tile.id);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(list).toMatchSnapshot();
            });

            it('the last position', () => {
                const list = new TileList(specs);

                list.append();
                const tile = list.append();
                const newTile = list.insertBefore(tile.id);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(list).toMatchSnapshot();
            });

            it('a position in the middle', () => {
                const list = new TileList(specs);

                list.append();
                const tile = list.append();
                list.append();
                const newTile = list.insertBefore(tile.id);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(list).toMatchSnapshot();
            });

            it('with a particular type', () => {
                const list = new TileList(specs);

                const tile = list.append();
                const newTile = list.insertBefore(tile.id, CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(list).toMatchSnapshot();
            });

            it('emits an event when inserting a tile', () => {
                const list = new TileList(specs);
                const tile = list.append();

                const callback = jest.fn().mockImplementation((index, newTile) => {
                    expect(index).toBe(0);
                    expect(newTile).toBeInstanceOf(TileModel);
                    expect(newTile).not.toBe(tile);
                });

                list.on('add', callback);

                list.insertBefore(tile.id);
                expect(callback).toHaveBeenCalledTimes(1);
            });
        });

        describe('after', () => {
            it('an inexistent position', () => {
                const list = new TileList(specs);

                list.append();

                expect(list.insertAfter('id')).toBeNull();
                expect(list).toMatchSnapshot();
            });

            it('the first position', () => {
                const list = new TileList(specs);

                const tile = list.append();
                list.append();
                const newTile = list.insertAfter(tile.id);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(list).toMatchSnapshot();
            });

            it('the last position', () => {
                const list = new TileList(specs);

                list.append();
                const tile = list.append();
                const newTile = list.insertAfter(tile.id);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(list).toMatchSnapshot();
            });

            it('a position in the middle', () => {
                const list = new TileList(specs);

                list.append();
                const tile = list.append();
                list.append();
                const newTile = list.insertAfter(tile.id);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(list).toMatchSnapshot();
            });

            it('with a particular type', () => {
                const list = new TileList(specs);

                const tile = list.append();
                const newTile = list.insertAfter(tile.id, CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(list).toMatchSnapshot();
            });

            it('emits an event when inserting a tile', () => {
                const list = new TileList(specs);
                const tile = list.append();

                const callback = jest.fn().mockImplementation((index, newTile) => {
                    expect(index).toBe(1);
                    expect(newTile).toBeInstanceOf(TileModel);
                    expect(newTile).not.toBe(tile);
                });

                list.on('add', callback);

                list.insertAfter(tile.id);
                expect(callback).toHaveBeenCalledTimes(1);
            });
        });
    });

    it('can export to an object', () => {
        const list = new TileList(specs);
        list.append(CURVED_TILE_TYPE);

        expect(list.export()).toMatchSnapshot();
    });

    it('can import from an object', () => {
        const list = new TileList(specs);
        const data = [
            {
                type: CURVED_TILE_TYPE,
                direction: TILE_DIRECTION_LEFT,
                ratio: 1
            },
            null,
            {
                type: CURVED_TILE_TYPE,
                direction: TILE_DIRECTION_RIGHT,
                ratio: 1
            }
        ];

        const callback = jest.fn();
        list.on('load', callback);

        list.append();

        expect(list.import({})).toBe(list);
        expect(list).toMatchSnapshot();

        expect(list.import(data)).toBe(list);
        expect(list).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    describe('has a static method', () => {
        describe('createTile', () => {
            describe('which throws error', () => {
                it('when trying to create a tile with an invalid specifications object', () => {
                    expect(() => TileList.createTile({})).toThrow(
                        'The specifications object must be an instance of TileSpecifications!'
                    );
                });

                it('when trying to create a tile with an invalid type', () => {
                    expect(() => TileList.createTile(specs, '')).toThrow('A valid type of tile is needed!');
                    expect(() => TileList.createTile(specs, 'tile')).toThrow('A valid type of tile is needed!');
                });

                it('when trying to create a tile with an invalid direction', () => {
                    expect(() => TileList.createTile(specs, CURVED_TILE_TYPE, '')).toThrow(
                        'A valid direction is needed!'
                    );
                    expect(() => TileList.createTile(specs, CURVED_TILE_TYPE, 'top')).toThrow(
                        'A valid direction is needed!'
                    );
                });
            });

            describe('which creates a tile', () => {
                it.each([
                    [STRAIGHT_TILE_TYPE, StraightTileModel],
                    [CURVED_TILE_TYPE, CurvedTileModel],
                    [CURVED_TILE_ENLARGED_TYPE, CurvedTileEnlargedModel]
                ])('of the type %s', (type, constructor) => {
                    const tile = TileList.createTile(specs, type);
                    expect(tile).toBeInstanceOf(constructor);
                    expect(tile.type).toBe(type);
                });

                it.each([TILE_DIRECTION_LEFT, TILE_DIRECTION_RIGHT])('having the direction %s', direction => {
                    const straightTile = TileList.createTile(specs, STRAIGHT_TILE_TYPE, direction);
                    const curvedTile = TileList.createTile(specs, CURVED_TILE_TYPE, direction);
                    const enlargedTile = TileList.createTile(specs, CURVED_TILE_ENLARGED_TYPE, direction);
                    expect(straightTile.direction).toBe(direction);
                    expect(curvedTile.direction).toBe(direction);
                    expect(enlargedTile.direction).toBe(direction);
                });

                it.each([1, 2, 3, 4])('with the size ratio %s', ratio => {
                    const curvedTile = TileList.createTile(specs, CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, ratio);
                    expect(curvedTile.ratio).toBe(ratio);
                });
            });
        });

        describe('identify', () => {
            it('which can assign a unique identifier to a tile', () => {
                const tile = TileList.createTile(specs);
                expect(tile.id).toBe(tile.modelId);
                expect(TileList.identify(tile)).toBe(tile);
                expect(tile.id).not.toBe(tile.modelId);

                const tile2 = TileList.createTile(specs);
                TileList.identify(tile2);
                expect(tile2.modelId).toBe(tile.modelId);
                expect(tile2.id).not.toBe(tile.id);

                const obj = {};
                expect(obj.id).toBeUndefined();
                expect(TileList.identify(obj)).toBe(obj);
                expect(obj.id).toEqual(expect.any(String));

                expect(TileList.identify()).toBeUndefined();
            });
        });

        describe('validateInstance', () => {
            it('which can validate an object is an instance of the class', () => {
                const list = new TileList(specs);
                expect(() => TileList.validateInstance(list)).not.toThrow();
                expect(() => TileList.validateInstance({})).toThrow('The object must be an instance of TileList!');
            });
        });
    });
});
