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
import { TilesList } from '../TilesList.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

describe('TilesList', () => {
    it('is a class', () => {
        expect(TilesList).toEqual(expect.any(Function));
    });

    describe('throws error', () => {
        it('when trying to create an instance with an invalid specifications object', () => {
            // @ts-expect-error
            expect(() => new TilesList({})).toThrow('A valid specifications object is needed!');
        });

        it('when trying to set an invalid specifications object', () => {
            const track = new TilesList(specs);
            // @ts-expect-error
            expect(() => track.setSpecs({})).toThrow('A valid specifications object is needed!');
        });

        it('when trying to add a tile with an invalid type', () => {
            const track = new TilesList(specs);
            expect(() => track.appendTile('')).toThrow('A valid type of tile is needed!');
        });

        it('when trying to add a tile with an invalid direction', () => {
            const track = new TilesList(specs);
            expect(() => track.appendTile(CURVED_TILE_TYPE, '')).toThrow('A valid direction is needed!');
        });
    });

    it('can set the specifications of the tile', () => {
        const track = new TilesList(specs);
        const newSpecs = new TileSpecifications(10, 1, 2);
        track.appendTile();

        expect(track.specs).toBeInstanceOf(TileSpecifications);
        expect(track.specs).not.toBe(newSpecs);
        expect(track.setSpecs(newSpecs)).toBe(track);
        expect(track.specs).toBe(newSpecs);
        expect(track).toMatchSnapshot();
    });

    it('can get the index of a tile in the track', () => {
        const track = new TilesList(specs);

        track.appendTile();
        const id = track.appendTile();
        track.appendTile();

        expect(track.getTileIndex(id)).toBe(1);
        expect(track.getTileIndex('id')).toBe(-1);
    });

    describe('can get a tile from the track', () => {
        it('by its identifier', () => {
            const track = new TilesList(specs);

            track.appendTile();
            const id = track.appendTile();
            track.appendTile();

            expect(track.getTile(id)).toBe(track.tiles.get(1));
            expect(track.getTile(id)).toBeInstanceOf(StraightTileModel);
            expect(track.getTile('id')).toBeNull();
        });

        it('by its index', () => {
            const track = new TilesList(specs);

            track.appendTile();
            track.appendTile();
            track.appendTile();

            expect(track.getTileAt(1)).toBe(track.tiles.get(1));
            expect(track.getTileAt(1)).toBeInstanceOf(StraightTileModel);
            expect(track.getTileAt(3)).toBeNull();
        });
    });

    describe('can build a track', () => {
        it('with the given size', () => {
            const track = new TilesList(specs);

            expect(track).toBeInstanceOf(TilesList);
            expect(track).toMatchSnapshot();
        });

        describe('adding tiles', () => {
            describe('at the last position', () => {
                it('with the default specifications', () => {
                    const track = new TilesList(specs);

                    const id = track.appendTile();

                    expect(id).toEqual(expect.any(String));
                    expect(track).toMatchSnapshot();
                });

                it('with a particular type', () => {
                    const track = new TilesList(specs);

                    const id = track.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                    expect(id).toEqual(expect.any(String));
                    expect(track).toMatchSnapshot();
                });
            });

            describe('at the first position', () => {
                it('with the default specifications', () => {
                    const track = new TilesList(specs);

                    track.appendTile();
                    const id = track.prependTile();

                    expect(id).toEqual(expect.any(String));
                    expect(track).toMatchSnapshot();
                });

                it('with a particular type', () => {
                    const track = new TilesList(specs);

                    track.appendTile();
                    const id = track.prependTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                    expect(id).toEqual(expect.any(String));
                    expect(track).toMatchSnapshot();
                });
            });
        });

        describe('removing tiles', () => {
            it('from the start', () => {
                const track = new TilesList(specs);

                const id = track.appendTile();
                track.appendTile();
                track.appendTile();

                expect(track.removeTile(id)).toBeTruthy();
                expect(track).toMatchSnapshot();
            });

            it('from the middle', () => {
                const track = new TilesList(specs);

                track.appendTile();
                const id = track.appendTile();
                track.appendTile();

                expect(track.removeTile(id)).toBeTruthy();
                expect(track).toMatchSnapshot();
            });

            it('from the end', () => {
                const track = new TilesList(specs);

                track.appendTile();
                track.appendTile();
                const id = track.appendTile();

                expect(track.removeTile(id)).toBeTruthy();
                expect(track).toMatchSnapshot();
            });

            it('at inexistent position', () => {
                const track = new TilesList(specs);

                track.appendTile();

                expect(track.removeTile('id')).toBeFalsy();
                expect(track).toMatchSnapshot();
            });
        });

        describe('replacing tiles', () => {
            it('with a tile having default specifications', () => {
                const track = new TilesList(specs);

                track.appendTile();
                const id = track.appendTile();
                track.appendTile();
                const newId = track.replaceTile(id);

                expect(newId).toEqual(expect.any(String));
                expect(newId).not.toBe(id);
                expect(track).toMatchSnapshot();
            });

            it('with a tile having a particular type', () => {
                const track = new TilesList(specs);

                track.appendTile();
                track.appendTile();
                const id = track.appendTile();
                const newId = track.replaceTile(id, CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                expect(newId).toEqual(expect.any(String));
                expect(newId).not.toBe(id);
                expect(track).toMatchSnapshot();
            });

            it('at inexistent position', () => {
                const track = new TilesList(specs);

                track.appendTile();
                expect(track.replaceTile('id')).toBeNull();
                expect(track).toMatchSnapshot();
            });
        });

        describe('inserting tiles', () => {
            describe('before', () => {
                it('an inexistent position', () => {
                    const track = new TilesList(specs);

                    track.appendTile();

                    expect(track.insertTileBefore('id')).toBeNull();
                    expect(track).toMatchSnapshot();
                });

                it('the first position', () => {
                    const track = new TilesList(specs);

                    const id = track.appendTile();
                    track.appendTile();
                    const newId = track.insertTileBefore(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });

                it('the last position', () => {
                    const track = new TilesList(specs);

                    track.appendTile();
                    const id = track.appendTile();
                    const newId = track.insertTileBefore(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });

                it('a position in the middle', () => {
                    const track = new TilesList(specs);

                    track.appendTile();
                    const id = track.appendTile();
                    track.appendTile();
                    const newId = track.insertTileBefore(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });

                it('with a particular type', () => {
                    const track = new TilesList(specs);

                    const id = track.appendTile();
                    const newId = track.insertTileBefore(id, CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });
            });

            describe('after', () => {
                it('an inexistent position', () => {
                    const track = new TilesList(specs);

                    track.appendTile();

                    expect(track.insertTileAfter('id')).toBeNull();
                    expect(track).toMatchSnapshot();
                });

                it('the first position', () => {
                    const track = new TilesList(specs);

                    const id = track.appendTile();
                    track.appendTile();
                    const newId = track.insertTileAfter(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });

                it('the last position', () => {
                    const track = new TilesList(specs);

                    track.appendTile();
                    const id = track.appendTile();
                    const newId = track.insertTileAfter(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });

                it('a position in the middle', () => {
                    const track = new TilesList(specs);

                    track.appendTile();
                    const id = track.appendTile();
                    track.appendTile();
                    const newId = track.insertTileAfter(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });

                it('with a particular type', () => {
                    const track = new TilesList(specs);

                    const id = track.appendTile();
                    const newId = track.insertTileAfter(id, CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });
            });
        });
    });

    it('can rebuilds the stats', () => {
        const track = new TilesList(specs);

        expect([...track.stats]).toEqual([]);
        expect(track.rebuildStats()).toBe(track);
        expect([...track.stats]).toEqual([]);

        track.appendTile(CURVED_TILE_TYPE);

        expect(track.stats).toMatchSnapshot();

        track.getTileAt(0).setRatio(3);

        expect(track.rebuildStats()).toBe(track);
        expect(track.stats).toMatchSnapshot();
    });

    it('can export to an object', () => {
        const track = new TilesList(specs);
        track.appendTile(CURVED_TILE_TYPE);

        expect(track.export()).toMatchSnapshot();
    });

    it('can import from an object', () => {
        const track = new TilesList(specs);
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

        track.appendTile();

        // @ts-expect-error
        expect(track.import({})).toBe(track);
        expect(track).toMatchSnapshot();

        expect(track.import(data)).toBe(track);
        expect(track).toMatchSnapshot();
    });

    it('can clear the list', () => {
        const track = new TilesList(specs);
        track.appendTile(CURVED_TILE_TYPE);

        expect(track.clear()).toBe(track);
        expect(track).toMatchSnapshot();
    });

    describe('can notify changes', () => {
        it('for changes applying to the tiles', () => {
            const track = new TilesList(specs);

            const callback = jest.fn().mockImplementation(value => {
                expect(value).toBe(track);
                expect(value).toMatchSnapshot();
            });

            const unsubscribe = track.subscribe(callback); // callback called

            track.setSpecs(specs);
            const id1 = track.appendTile(CURVED_TILE_TYPE); // callback called
            const id2 = track.prependTile(CURVED_TILE_TYPE); // callback called
            track.removeTile(id1); // callback called
            const id3 = track.replaceTile(id2); // callback called
            track.insertTileBefore(id3); // callback called
            track.insertTileAfter(id3); // callback called
            const data = track.export();
            track.clear(); // callback called
            track.import(data); // callback called
            track.setSpecs(new TileSpecifications(10, 1, 2)); // callback called
            track.rebuildStats();

            unsubscribe();
            track.appendTile();

            expect(callback).toHaveBeenCalledTimes(10);
        });

        it('for changes applying to the stats', () => {
            const track = new TilesList(specs);

            const callback = jest.fn().mockImplementation(value => {
                expect(value).toBe(track.stats);
                expect(value).toMatchSnapshot();
            });

            const unsubscribe = track.stats.subscribe(callback); // callback called

            track.setSpecs(specs);
            const id1 = track.appendTile(CURVED_TILE_TYPE); // callback called
            const id2 = track.prependTile(CURVED_TILE_TYPE); // callback called
            track.removeTile(id1); // callback called
            const id3 = track.replaceTile(id2); // callback called twice
            track.insertTileBefore(id3); // callback called
            track.insertTileAfter(id3); // callback called
            const data = track.export();
            track.clear(); // callback called
            track.import(data); // callback called
            track.setSpecs(new TileSpecifications(10, 1, 2));
            track.rebuildStats(); // callback called

            unsubscribe();
            track.appendTile();

            expect(callback).toHaveBeenCalledTimes(11);
        });
    });
});
