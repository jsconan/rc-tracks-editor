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

import { CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, TILE_DIRECTION_RIGHT } from '../../helpers';
import { StraightTileModel } from '../StraightTileModel.js';
import { TileSpecifications } from '../../config';
import { TileList } from '../TileList.js';
import { TileModel } from '../TileModel.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

describe('TileList', () => {
    it('is a class', () => {
        expect(TileList).toEqual(expect.any(Function));
    });

    it('has a length', () => {
        const list = new TileList(specs);
        expect(list.length).toBe(0);
        list.append();
        expect(list.length).toBe(1);
    });

    it('implements the iteration protocol', () => {
        const list = new TileList(specs);
        list.append();

        expect(list[Symbol.iterator]).toEqual(expect.any(Function));
        expect(list[Symbol.iterator]()).not.toBe(list[Symbol.iterator]());
        expect([...list]).toMatchSnapshot();
    });

    it('can produce an iterator', () => {
        const list = new TileList(specs);
        list.append();

        expect(list.values).toEqual(expect.any(Function));
        expect(list.values()[Symbol.iterator]).toEqual(expect.any(Function));

        expect(list.values()).not.toBe(list.values());
        expect([...list.values()]).toMatchSnapshot();
    });

    describe('throws error', () => {
        it('when trying to create an instance with an invalid specifications object', () => {
            expect(() => new TileList({})).toThrow(
                'The specifications object must be an instance of TileSpecifications!'
            );
        });

        it('when trying to set an invalid specifications object', () => {
            const track = new TileList(specs);
            expect(() => track.setSpecs({})).toThrow(
                'The specifications object must be an instance of TileSpecifications!'
            );
        });

        it('when trying to add a tile with an invalid type', () => {
            const track = new TileList(specs);
            expect(() => track.append('')).toThrow('A valid type of tile is needed!');
        });

        it('when trying to add a tile with an invalid direction', () => {
            const track = new TileList(specs);
            expect(() => track.append(CURVED_TILE_TYPE, '')).toThrow('A valid direction is needed!');
        });
    });

    it('can set the specifications of the tiles', () => {
        const list = new TileList(specs);
        const newSpecs = new TileSpecifications(10, 1, 2);

        list.append();

        expect(list.specs).toBeInstanceOf(TileSpecifications);
        expect(list.specs).not.toBe(newSpecs);
        expect(list.setSpecs(newSpecs)).toBe(list);
        expect(list.specs).toBe(newSpecs);
        expect(list).toMatchSnapshot();
    });

    it('can get the index of a tile in the track', () => {
        const list = new TileList(specs);

        list.append();
        const tile = list.append();
        list.append();

        expect(list.getIndex(tile.id)).toBe(1);
        expect(list.getIndex('id')).toBe(-1);
    });

    describe('can get a tile from the track', () => {
        it('by its identifier', () => {
            const list = new TileList(specs);

            list.append();
            const tile = list.append();
            list.append();

            expect(list.get(tile.id)).toBe(list.tiles.get(1));
            expect(list.get(tile.id)).toBeInstanceOf(StraightTileModel);
            expect(list.get('id')).toBeNull();
        });

        it('by its index', () => {
            const list = new TileList(specs);

            list.append();
            list.append();
            list.append();

            expect(list.getAt(1)).toBe(list.tiles.get(1));
            expect(list.getAt(1)).toBeInstanceOf(StraightTileModel);
            expect(list.getAt(3)).toBeNull();
        });
    });

    describe('can build a track', () => {
        it('with the given size', () => {
            const list = new TileList(specs);

            expect(list).toMatchSnapshot();
        });

        describe('adding tiles', () => {
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
            });
        });

        describe('removing tiles', () => {
            it('from the start', () => {
                const list = new TileList(specs);

                const tile = list.append();
                list.append();
                list.append();

                expect(list.remove(tile.id)).toBeTruthy();
                expect(list).toMatchSnapshot();
            });

            it('from the middle', () => {
                const list = new TileList(specs);

                list.append();
                const tile = list.append();
                list.append();

                expect(list.remove(tile.id)).toBeTruthy();
                expect(list).toMatchSnapshot();
            });

            it('from the end', () => {
                const list = new TileList(specs);

                list.append();
                list.append();
                const tile = list.append();

                expect(list.remove(tile.id)).toBeTruthy();
                expect(list).toMatchSnapshot();
            });

            it('at inexistent position', () => {
                const list = new TileList(specs);

                list.append();

                expect(list.remove('id')).toBeFalsy();
                expect(list).toMatchSnapshot();
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
        });

        describe('inserting tiles', () => {
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

        list.append();

        expect(list.import({})).toBe(list);
        expect(list).toMatchSnapshot();

        expect(list.import(data)).toBe(list);
        expect(list).toMatchSnapshot();
    });

    it('can clear the list', () => {
        const list = new TileList(specs);

        list.append(CURVED_TILE_TYPE);

        expect(list.clear()).toBe(list);
        expect(list).toMatchSnapshot();
    });

    it('can notify changes', () => {
        const list = new TileList(specs);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(list);
            expect(value).toMatchSnapshot();
        });

        const unsubscribe = list.subscribe(callback); // callback called

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

    it('can validate an object is an instance of the class', () => {
        const list = new TileList(specs);
        expect(() => TileList.validateInstance(list)).not.toThrow();
        expect(() => TileList.validateInstance({})).toThrow('The model must be an instance of TileList!');
    });
});
