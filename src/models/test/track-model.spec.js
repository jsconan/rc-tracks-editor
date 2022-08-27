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

import CurvedTileModel from '../curved-tile-model.js';
import TileModel from '../tile-model.js';
import TileReferenceModel from '../tile-reference-model.js';
import TrackModel from '../track-model.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;

describe('TrackModel', () => {
    it('is a class', () => {
        expect(TrackModel).toEqual(expect.any(Function));
    });

    it('can get the index of a tile in the track', () => {
        const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

        track.addTile();
        const id = track.addTile();
        track.addTile();

        expect(track.getTileIndex(id)).toBe(1);
        expect(track.getTileIndex('id')).toBe(-1);
    });

    describe('can get a tile from the track', () => {
        it('by its identifier', () => {
            const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

            track.addTile();
            const id = track.addTile();
            track.addTile();

            expect(track.getTile(id)).toBe(track.track[1]);
            expect(track.getTile(id)).toBeInstanceOf(TileReferenceModel);
            expect(track.getTile('id')).toBeNull();
        });

        it('by its index', () => {
            const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

            track.addTile();
            track.addTile();
            track.addTile();

            expect(track.getTileAt(1)).toBe(track.track[1]);
            expect(track.getTileAt(1)).toBeInstanceOf(TileReferenceModel);
            expect(track.getTileAt(3)).toBeNull();
        });
    });

    describe('can build a track', () => {
        it('with the given size', () => {
            const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

            expect(track).toBeInstanceOf(TrackModel);
            expect(track).toMatchSnapshot();
        });

        describe('adding tiles', () => {
            describe('at the last position', () => {
                it('with the default specifications', () => {
                    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                    const id = track.addTile();

                    expect(id).toEqual(expect.any(String));
                    expect(track).toMatchSnapshot();
                });

                it('with a particular type', () => {
                    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                    const id = track.addTile(CurvedTileModel.TYPE, TileModel.DIRECTION_LEFT, 2);

                    expect(id).toEqual(expect.any(String));
                    expect(track).toMatchSnapshot();
                });
            });

            describe('at the first position', () => {
                it('with the default specifications', () => {
                    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                    track.addTile();
                    const id = track.addFirstTile();

                    expect(id).toEqual(expect.any(String));
                    expect(track).toMatchSnapshot();
                });

                it('with a particular type', () => {
                    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                    track.addTile();
                    const id = track.addFirstTile(CurvedTileModel.TYPE, TileModel.DIRECTION_LEFT, 2);

                    expect(id).toEqual(expect.any(String));
                    expect(track).toMatchSnapshot();
                });
            });
        });

        describe('removing tiles', () => {
            it('from the start', () => {
                const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                const id = track.addTile();
                track.addTile();
                track.addTile();

                expect(track.removeTile(id)).toBeTruthy();
                expect(track).toMatchSnapshot();
            });

            it('from the middle', () => {
                const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                track.addTile();
                const id = track.addTile();
                track.addTile();

                expect(track.removeTile(id)).toBeTruthy();
                expect(track).toMatchSnapshot();
            });

            it('from the end', () => {
                const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                track.addTile();
                track.addTile();
                const id = track.addTile();

                expect(track.removeTile(id)).toBeTruthy();
                expect(track).toMatchSnapshot();
            });

            it('at inexistent position', () => {
                const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                track.addTile();

                expect(track.removeTile('id')).toBeFalsy();
                expect(track).toMatchSnapshot();
            });
        });

        describe('replacing tiles', () => {
            it('with a tile having default specifications', () => {
                const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                track.addTile();
                const id = track.addTile();
                track.addTile();
                const newId = track.replaceTile(id);

                expect(newId).toEqual(expect.any(String));
                expect(newId).not.toBe(id);
                expect(track).toMatchSnapshot();
            });

            it('with a tile having a particular type', () => {
                const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                track.addTile();
                track.addTile();
                const id = track.addTile();
                const newId = track.replaceTile(id, CurvedTileModel.TYPE, TileModel.DIRECTION_LEFT, 2);

                expect(newId).toEqual(expect.any(String));
                expect(newId).not.toBe(id);
                expect(track).toMatchSnapshot();
            });

            it('at inexistent position', () => {
                const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                track.addTile();
                expect(track.replaceTile('id')).toBeNull();
                expect(track).toMatchSnapshot();
            });
        });

        describe('inserting tiles', () => {
            describe('before', () => {
                it('an inexistent position', () => {
                    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                    track.addTile();

                    expect(track.insertBefore('id')).toBeNull();
                    expect(track).toMatchSnapshot();
                });

                it('the first position', () => {
                    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                    const id = track.addTile();
                    track.addTile();
                    const newId = track.insertBefore(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });

                it('the last position', () => {
                    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                    track.addTile();
                    const id = track.addTile();
                    const newId = track.insertBefore(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });

                it('a position in the middle', () => {
                    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                    track.addTile();
                    const id = track.addTile();
                    track.addTile();
                    const newId = track.insertBefore(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });

                it('with a particular type', () => {
                    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                    const id = track.addTile();
                    const newId = track.insertBefore(id, CurvedTileModel.TYPE, TileModel.DIRECTION_LEFT, 2);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });
            });

            describe('after', () => {
                it('an inexistent position', () => {
                    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                    track.addTile();

                    expect(track.insertAfter('id')).toBeNull();
                    expect(track).toMatchSnapshot();
                });

                it('the first position', () => {
                    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                    const id = track.addTile();
                    track.addTile();
                    const newId = track.insertAfter(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });

                it('the last position', () => {
                    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                    track.addTile();
                    const id = track.addTile();
                    const newId = track.insertAfter(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });

                it('a position in the middle', () => {
                    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                    track.addTile();
                    const id = track.addTile();
                    track.addTile();
                    const newId = track.insertAfter(id);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });

                it('with a particular type', () => {
                    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                    const id = track.addTile();
                    const newId = track.insertAfter(id, CurvedTileModel.TYPE, TileModel.DIRECTION_LEFT, 2);

                    expect(newId).toEqual(expect.any(String));
                    expect(newId).not.toBe(id);
                    expect(track).toMatchSnapshot();
                });
            });
        });

        describe('for rendering', () => {
            it('using default position', () => {
                const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                track.addTile();
                track.addTile(CurvedTileModel.TYPE);
                track.addTile();
                track.addTile(CurvedTileModel.TYPE);
                track.addTile();
                track.addTile(CurvedTileModel.TYPE);
                track.addTile();
                track.addTile(CurvedTileModel.TYPE);

                expect(track.build()).toMatchSnapshot();
            });

            it('using a start position and angle', () => {
                const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

                track.addTile();
                track.addTile(CurvedTileModel.TYPE);
                track.addTile();
                track.addTile(CurvedTileModel.TYPE);
                track.addTile();
                track.addTile(CurvedTileModel.TYPE);
                track.addTile();
                track.addTile(CurvedTileModel.TYPE);

                expect(track.build(100, 100, 45)).toMatchSnapshot();
            });
        });
    });

    it('can export to an object', () => {
        const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);
        track.addTile(CurvedTileModel.TYPE);
        expect(track.export()).toMatchSnapshot();
    });

    it('can import from an object', () => {
        const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);
        const data = [
            {
                type: CurvedTileModel.TYPE,
                direction: TileModel.DIRECTION_LEFT,
                ratio: 2
            }
        ];

        track.addTile();

        expect(track.import({})).toBe(track);
        expect(track).toMatchSnapshot();

        expect(track.import(data)).toBe(track);
        expect(track).toMatchSnapshot();
    });
});
