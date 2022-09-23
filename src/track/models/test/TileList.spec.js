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
        list.appendTile();
        expect(list.length).toBe(1);
    });

    it('implements the iteration protocol', () => {
        const list = new TileList(specs);
        list.appendTile();

        expect(list[Symbol.iterator]).toEqual(expect.any(Function));
        expect(list[Symbol.iterator]()).not.toBe(list[Symbol.iterator]());
        expect([...list]).toMatchSnapshot();
    });

    it('can produce an iterator', () => {
        const list = new TileList(specs);
        list.appendTile();

        expect(list.values).toEqual(expect.any(Function));
        expect(list.values()[Symbol.iterator]).toEqual(expect.any(Function));

        expect(list.values()).not.toBe(list.values());
        expect([...list.values()]).toMatchSnapshot();
    });

    describe('throws error', () => {
        it('when trying to create an instance with an invalid specifications object', () => {
            // @ts-expect-error
            expect(() => new TileList({})).toThrow(
                'The specifications object must be an instance of TileSpecifications!'
            );
        });

        it('when trying to set an invalid specifications object', () => {
            const track = new TileList(specs);
            // @ts-expect-error
            expect(() => track.setSpecs({})).toThrow(
                'The specifications object must be an instance of TileSpecifications!'
            );
        });

        it('when trying to add a tile with an invalid type', () => {
            const track = new TileList(specs);
            expect(() => track.appendTile('')).toThrow('A valid type of tile is needed!');
        });

        it('when trying to add a tile with an invalid direction', () => {
            const track = new TileList(specs);
            expect(() => track.appendTile(CURVED_TILE_TYPE, '')).toThrow('A valid direction is needed!');
        });
    });

    it('can set the specifications of the tile', () => {
        const list = new TileList(specs);
        const newSpecs = new TileSpecifications(10, 1, 2);
        list.appendTile();

        expect(list.specs).toBeInstanceOf(TileSpecifications);
        expect(list.specs).not.toBe(newSpecs);
        expect(list.setSpecs(newSpecs)).toBe(list);
        expect(list.specs).toBe(newSpecs);
        expect(list).toMatchSnapshot();
    });

    it('can get the index of a tile in the track', () => {
        const list = new TileList(specs);

        list.appendTile();
        const id = list.appendTile();
        list.appendTile();

        expect(list.getTileIndex(id)).toBe(1);
        expect(list.getTileIndex('id')).toBe(-1);
    });

    describe('can get a tile from the track', () => {
        it('by its identifier', () => {
            const list = new TileList(specs);

            list.appendTile();
            const id = list.appendTile();
            list.appendTile();

            expect(list.getTile(id)).toBe(list.tiles.get(1));
            expect(list.getTile(id)).toBeInstanceOf(StraightTileModel);
            expect(list.getTile('id')).toBeNull();
        });

        it('by its index', () => {
            const list = new TileList(specs);

            list.appendTile();
            list.appendTile();
            list.appendTile();

            expect(list.getTileAt(1)).toBe(list.tiles.get(1));
            expect(list.getTileAt(1)).toBeInstanceOf(StraightTileModel);
            expect(list.getTileAt(3)).toBeNull();
        });
    });

    describe('can build a track', () => {
        it('with the given size', () => {
            const list = new TileList(specs);

            expect(list).toBeInstanceOf(TileList);
            expect(list).toMatchSnapshot();
        });

        describe('adding tiles', () => {
            describe('at the last position', () => {
                it('with the default specifications', () => {
                    const list = new TileList(specs);

                    const id = list.appendTile();

                    expect(id).toEqual(expect.any(String));
                    expect(list).toMatchSnapshot();
                });

                it('with a particular type', () => {
                    const list = new TileList(specs);

                    const id = list.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                    expect(id).toEqual(expect.any(String));
                    expect(list).toMatchSnapshot();
                });
            });

            describe('at the first position', () => {
                it('with the default specifications', () => {
                    const list = new TileList(specs);

                    list.appendTile();
                    const id = list.prependTile();

                    expect(id).toEqual(expect.any(String));
                    expect(list).toMatchSnapshot();
                });

                it('with a particular type', () => {
                    const list = new TileList(specs);

                    list.appendTile();
                    const id = list.prependTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                    expect(id).toEqual(expect.any(String));
                    expect(list).toMatchSnapshot();
                });
            });
        });

        describe('removing tiles', () => {
            it('from the start', () => {
                const list = new TileList(specs);

                const id = list.appendTile();
                list.appendTile();
                list.appendTile();

                expect(list.removeTile(id)).toBeTruthy();
                expect(list).toMatchSnapshot();
            });

            it('from the middle', () => {
                const list = new TileList(specs);

                list.appendTile();
                const id = list.appendTile();
                list.appendTile();

                expect(list.removeTile(id)).toBeTruthy();
                expect(list).toMatchSnapshot();
            });

            it('from the end', () => {
                const list = new TileList(specs);

                list.appendTile();
                list.appendTile();
                const id = list.appendTile();

                expect(list.removeTile(id)).toBeTruthy();
                expect(list).toMatchSnapshot();
            });

            it('at inexistent position', () => {
                const list = new TileList(specs);

                list.appendTile();

                expect(list.removeTile('id')).toBeFalsy();
                expect(list).toMatchSnapshot();
            });
        });

        describe('replacing tiles', () => {
            it('with a tile having default specifications', () => {
                const list = new TileList(specs);

                list.appendTile();
                const id = list.appendTile();
                list.appendTile();
                const newId = list.replaceTile(id);

                expect(newId).toEqual(expect.any(String));
                expect(newId).not.toBe(id);
                expect(list).toMatchSnapshot();
            });

            it('with a tile having a particular type', () => {
                const list = new TileList(specs);

                list.appendTile();
                list.appendTile();
                const id = list.appendTile();
                const newId = list.replaceTile(id, CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                expect(newId).toEqual(expect.any(String));
                expect(newId).not.toBe(id);
                expect(list).toMatchSnapshot();
            });

            it('at inexistent position', () => {
                const list = new TileList(specs);

                list.appendTile();
                expect(list.replaceTile('id')).toBeNull();
                expect(list).toMatchSnapshot();
            });
        });

        describe('inserting tiles', () => {
            describe('before', () => {
                it('an inexistent position', () => {
                    const list = new TileList(specs);

                    list.appendTile();

                    expect(list.insertTileBefore('id')).toBeNull();
                    expect(list).toMatchSnapshot();
                });

                it('the first position', () => {
                    const list = new TileList(specs);

                    const id = list.appendTile();
                    list.appendTile();
                    const newId = list.insertTileBefore(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(list).toMatchSnapshot();
                });

                it('the last position', () => {
                    const list = new TileList(specs);

                    list.appendTile();
                    const id = list.appendTile();
                    const newId = list.insertTileBefore(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(list).toMatchSnapshot();
                });

                it('a position in the middle', () => {
                    const list = new TileList(specs);

                    list.appendTile();
                    const id = list.appendTile();
                    list.appendTile();
                    const newId = list.insertTileBefore(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(list).toMatchSnapshot();
                });

                it('with a particular type', () => {
                    const list = new TileList(specs);

                    const id = list.appendTile();
                    const newId = list.insertTileBefore(id, CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(list).toMatchSnapshot();
                });
            });

            describe('after', () => {
                it('an inexistent position', () => {
                    const list = new TileList(specs);

                    list.appendTile();

                    expect(list.insertTileAfter('id')).toBeNull();
                    expect(list).toMatchSnapshot();
                });

                it('the first position', () => {
                    const list = new TileList(specs);

                    const id = list.appendTile();
                    list.appendTile();
                    const newId = list.insertTileAfter(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(list).toMatchSnapshot();
                });

                it('the last position', () => {
                    const list = new TileList(specs);

                    list.appendTile();
                    const id = list.appendTile();
                    const newId = list.insertTileAfter(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(list).toMatchSnapshot();
                });

                it('a position in the middle', () => {
                    const list = new TileList(specs);

                    list.appendTile();
                    const id = list.appendTile();
                    list.appendTile();
                    const newId = list.insertTileAfter(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(list).toMatchSnapshot();
                });

                it('with a particular type', () => {
                    const list = new TileList(specs);

                    const id = list.appendTile();
                    const newId = list.insertTileAfter(id, CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(list).toMatchSnapshot();
                });
            });
        });
    });

    it('can rebuilds the stats', () => {
        const list = new TileList(specs);

        expect([...list.stats]).toEqual([]);
        expect(list.rebuildStats()).toBe(list);
        expect([...list.stats]).toEqual([]);

        list.appendTile(CURVED_TILE_TYPE);

        expect(list.stats).toMatchSnapshot();

        list.getTileAt(0).setRatio(3);

        expect(list.rebuildStats()).toBe(list);
        expect(list.stats).toMatchSnapshot();
    });

    it('can export to an object', () => {
        const list = new TileList(specs);
        list.appendTile(CURVED_TILE_TYPE);

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

        list.appendTile();

        // @ts-expect-error
        expect(list.import({})).toBe(list);
        expect(list).toMatchSnapshot();

        expect(list.import(data)).toBe(list);
        expect(list).toMatchSnapshot();
    });

    it('can clear the list', () => {
        const list = new TileList(specs);
        list.appendTile(CURVED_TILE_TYPE);

        expect(list.clear()).toBe(list);
        expect(list).toMatchSnapshot();
    });

    describe('can notify changes', () => {
        it('for changes applying to the tiles', () => {
            const list = new TileList(specs);

            const callback = jest.fn().mockImplementation(value => {
                expect(value).toBe(list);
                expect(value).toMatchSnapshot();
            });

            const unsubscribe = list.subscribe(callback); // callback called

            list.setSpecs(specs);
            const id1 = list.appendTile(CURVED_TILE_TYPE); // callback called
            const id2 = list.prependTile(CURVED_TILE_TYPE); // callback called
            list.removeTile(id1); // callback called
            const id3 = list.replaceTile(id2); // callback called
            list.insertTileBefore(id3); // callback called
            list.insertTileAfter(id3); // callback called
            const data = list.export();
            list.clear(); // callback called
            list.import(data); // callback called
            list.setSpecs(new TileSpecifications(10, 1, 2)); // callback called
            list.rebuildStats();

            unsubscribe();
            list.appendTile();

            expect(callback).toHaveBeenCalledTimes(10);
        });

        it('for changes applying to the stats', () => {
            const list = new TileList(specs);

            const callback = jest.fn().mockImplementation(value => {
                expect(value).toBe(list.stats);
                expect(value).toMatchSnapshot();
            });

            const unsubscribe = list.stats.subscribe(callback); // callback called

            list.setSpecs(specs);
            const id1 = list.appendTile(CURVED_TILE_TYPE); // callback called
            const id2 = list.prependTile(CURVED_TILE_TYPE); // callback called
            list.removeTile(id1); // callback called
            const id3 = list.replaceTile(id2); // callback called twice
            list.insertTileBefore(id3); // callback called
            list.insertTileAfter(id3); // callback called
            const data = list.export();
            list.clear(); // callback called
            list.import(data); // callback called
            list.setSpecs(new TileSpecifications(10, 1, 2));
            list.rebuildStats(); // callback called

            unsubscribe();
            list.appendTile();

            expect(callback).toHaveBeenCalledTimes(11);
        });
    });

    it('can validate an object is an instance of the class', () => {
        const list = new TileList(specs);
        expect(() => TileList.validateInstance(list)).not.toThrow();
        expect(() => TileList.validateInstance({})).toThrow('The model must be an instance of TileList!');
    });
});
