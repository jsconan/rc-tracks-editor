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

import { buildList } from '../../helpers';
import { CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, TILE_DIRECTION_RIGHT } from '../../../tile/helpers';
import { CurvedTileEnlargedModel, CurvedTileModel, StraightTileModel, TileModel } from '../../../tile/models';
import { TileSpecifications } from '../../../tile/config';
import { TrackModel } from '../TrackModel.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications({ laneWidth, barrierWidth, barrierChunks });
const source = [new StraightTileModel(specs), new CurvedTileModel(specs), new CurvedTileEnlargedModel(specs)];

describe('TrackModel', () => {
    it('is a class', () => {
        expect(TrackModel).toEqual(expect.any(Function));
    });

    it('needs a specifications object', () => {
        const track = new TrackModel(specs);

        expect(track.specs).toBe(specs);

        expect(() => new TrackModel()).toThrow('The specifications object must be an instance of TileSpecifications!');
        expect(() => new TrackModel({})).toThrow(
            'The specifications object must be an instance of TileSpecifications!'
        );
    });

    it('can be initialized with a source', () => {
        expect([...new TrackModel(specs)]).toEqual([]);
        expect([...new TrackModel(specs, source)]).toMatchSnapshot();
    });

    it('has a length', () => {
        const track = new TrackModel(specs);

        expect(track.length).toBe(0);

        track.load(source);

        expect(track.length).toBe(3);
    });

    it('implements the iteration protocol', () => {
        const track = new TrackModel(specs, source);

        expect(track[Symbol.iterator]).toEqual(expect.any(Function));
        expect(track[Symbol.iterator]()).not.toBe(track[Symbol.iterator]());

        expect([...track]).toMatchSnapshot();
    });

    it('can produce an iterator', () => {
        const track = new TrackModel(specs, source);

        expect(track.values).toEqual(expect.any(Function));
        expect(track.values()[Symbol.iterator]).toEqual(expect.any(Function));

        expect(track.values()).not.toBe(track.values());
        expect([...track.values()]).toMatchSnapshot();
    });

    describe('throws error', () => {
        it('when trying to set an invalid specifications object', () => {
            const track = new TrackModel(specs);
            expect(() => track.setSpecs({})).toThrow(
                'The specifications object must be an instance of TileSpecifications!'
            );
        });

        it('when trying to set an invalid builder', () => {
            const track = new TrackModel(specs);
            expect(() => track.setBuilder({})).toThrow('A builder function is expected!');
        });

        it('when trying to add a tile that is not a TileModel', () => {
            const track = new TrackModel(specs);
            expect(() => track.load([{}])).toThrow('The object must be an instance of TileModel!');
        });

        it('when trying to add a tile with an invalid type', () => {
            const track = new TrackModel(specs);
            const tile = track.append();
            expect(() => track.append('')).toThrow('A valid type of tile is needed!');
            expect(() => track.prepend('')).toThrow('A valid type of tile is needed!');
            expect(() => track.replace(tile.id, '')).toThrow('A valid type of tile is needed!');
            expect(() => track.insertBefore(tile.id, '')).toThrow('A valid type of tile is needed!');
            expect(() => track.insertAfter(tile.id, '')).toThrow('A valid type of tile is needed!');
            expect(() => track.import([{ type: '' }])).toThrow('A valid type of tile is needed!');
        });

        it('when trying to add a tile with an invalid direction', () => {
            const track = new TrackModel(specs);
            const tile = track.append();
            expect(() => track.append(CURVED_TILE_TYPE, '')).toThrow('A valid direction is needed!');
            expect(() => track.prepend(CURVED_TILE_TYPE, '')).toThrow('A valid direction is needed!');
            expect(() => track.replace(tile.id, CURVED_TILE_TYPE, '')).toThrow('A valid direction is needed!');
            expect(() => track.insertBefore(tile.id, CURVED_TILE_TYPE, '')).toThrow('A valid direction is needed!');
            expect(() => track.insertAfter(tile.id, CURVED_TILE_TYPE, '')).toThrow('A valid direction is needed!');
            expect(() => track.import([{ type: CURVED_TILE_TYPE, direction: '' }])).toThrow(
                'A valid direction is needed!'
            );
        });
    });

    it('can set the specifications of the tiles', () => {
        const track = new TrackModel(specs);
        const newSpecs = new TileSpecifications({ laneWidth: 10, barrierWidth: 1, barrierChunks: 2 });
        const callback = jest.fn().mockImplementation(s => {
            expect(s).toBe(newSpecs);
        });

        track.on('specs', callback);

        track.append();

        expect(track.specs).toBeInstanceOf(TileSpecifications);
        expect(track.specs).not.toBe(newSpecs);
        expect(track.setSpecs(newSpecs)).toBe(track);
        expect(track.specs).toBe(newSpecs);
        expect(track).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can get the index of a tile in the track', () => {
        const track = new TrackModel(specs, source);
        const tile = source[1];

        expect(track.getIndex(tile.id)).toBe(1);
        expect(track.getIndex('id')).toBe(-1);
    });

    describe('can get a tile from the track', () => {
        it('by its identifier', () => {
            const track = new TrackModel(specs, source);
            const tile = source[1];

            expect(track.getById(tile.id)).toBe(tile);
            expect(track.getById('id')).toBeNull();
        });

        it('by its index', () => {
            const track = new TrackModel(specs, source);
            const tile = source[1];

            expect(track.get(1)).toBe(tile);
            expect(track.get(3)).toBeNull();
        });

        it('from the first position', () => {
            const track = new TrackModel(specs);

            expect(track.first).toEqual(expect.any(Function));

            expect(track.first()).toBeNull();

            track.load(source);

            expect(track.first()).toBe(source[0]);
        });

        it('from the last position', () => {
            const track = new TrackModel(specs);

            expect(track.last).toEqual(expect.any(Function));

            expect(track.last()).toBeNull();

            track.load(source);

            expect(track.last()).toBe(source[2]);
        });
    });

    describe('can delete tiles from the track using index', () => {
        it('from the start', () => {
            const track = new TrackModel(specs, source);

            expect(track.delete(0)).toBe(1);
            expect(track).toMatchSnapshot();
        });

        it('from the middle', () => {
            const track = new TrackModel(specs, source);

            expect(track.delete(1)).toBe(1);
            expect(track).toMatchSnapshot();
        });

        it('from the end', () => {
            const track = new TrackModel(specs, source);

            expect(track.delete(2)).toBe(1);
            expect(track).toMatchSnapshot();
        });

        it('at inexistent position', () => {
            const track = new TrackModel(specs, source);

            expect(track.delete(10)).toBe(0);
            expect(track).toMatchSnapshot();
        });

        it('and emits an event', () => {
            const track = new TrackModel(specs, source);
            const tile = source[0];

            const callback = jest.fn().mockImplementation(removed => {
                expect(removed).toBe(tile);
            });

            track.on('remove', callback);

            track.delete(0);
            expect(callback).toHaveBeenCalledTimes(1);
        });
    });

    describe('can remove tiles from the track using identifier', () => {
        it('from the start', () => {
            const track = new TrackModel(specs, source);
            const tile = source[0];

            expect(track.remove(tile.id)).toBeTruthy();
            expect(track).toMatchSnapshot();
        });

        it('from the middle', () => {
            const track = new TrackModel(specs, source);
            const tile = source[1];

            expect(track.remove(tile.id)).toBeTruthy();
            expect(track).toMatchSnapshot();
        });

        it('from the end', () => {
            const track = new TrackModel(specs, source);
            const tile = source[2];

            expect(track.remove(tile.id)).toBeTruthy();
            expect(track).toMatchSnapshot();
        });

        it('at inexistent position', () => {
            const track = new TrackModel(specs, source);

            expect(track.remove('id')).toBeFalsy();
            expect(track).toMatchSnapshot();
        });

        it('and emits an event', () => {
            const track = new TrackModel(specs, source);
            const tile = source[0];

            const callback = jest.fn().mockImplementation(removed => {
                expect(removed).toBe(tile);
            });

            track.on('remove', callback);

            track.remove(tile.id);
            expect(callback).toHaveBeenCalledTimes(1);
        });
    });

    it('can clear the track', () => {
        const track = new TrackModel(specs, source);

        expect(track.clear).toEqual(expect.any(Function));

        expect([...track]).toEqual(source);
        expect(track.clear()).toBe(track);
        expect([...track]).toEqual([]);
    });

    it('emits an event when clearing the track', () => {
        const track = new TrackModel(specs, source);

        const callback = jest.fn();

        track.on('clear', callback);

        track.clear();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can load tiles from another source', () => {
        const track = new TrackModel(specs);

        expect(track.load).toEqual(expect.any(Function));

        expect(track.load({})).toBe(track);
        expect([...track]).toEqual([]);

        expect(track.load(source)).toBe(track);
        expect([...track]).toEqual(source);
    });

    it('emits an event when loading the track', () => {
        const track = new TrackModel(specs);

        const callback = jest.fn();

        track.on('load', callback);

        track.load(source);
        track.load({});
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('notifies an update happen in the tiles', () => {
        const track = new TrackModel(specs);

        const callback = jest.fn();

        track.on('update', callback);

        track.update();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    describe('can create tiles', () => {
        describe('at the last position', () => {
            it('with the default specifications', () => {
                const track = new TrackModel(specs);

                const tile = track.append();

                expect(tile).toBeInstanceOf(TileModel);
                expect(track).toMatchSnapshot();
            });

            it('with a particular type', () => {
                const track = new TrackModel(specs);

                const tile = track.append(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                expect(tile).toBeInstanceOf(TileModel);
                expect(track).toMatchSnapshot();
            });

            it('and emits an event', () => {
                const track = new TrackModel(specs, source);

                const callback = jest.fn().mockImplementation(tile => {
                    expect(tile).toBeInstanceOf(TileModel);
                });

                track.on('add', callback);

                track.append();
                expect(callback).toHaveBeenCalledTimes(1);
            });
        });

        describe('replacing tiles', () => {
            it('with a tile having default specifications', () => {
                const track = new TrackModel(specs);

                track.append();
                const tile = track.append();
                track.append();
                const newTile = track.replace(tile.id);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(track).toMatchSnapshot();
            });

            it('with a tile having a particular type', () => {
                const track = new TrackModel(specs);

                track.append();
                track.append();
                const tile = track.append();
                const newTile = track.replace(tile.id, CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(track).toMatchSnapshot();
            });

            it('at inexistent position', () => {
                const track = new TrackModel(specs);

                track.append();
                expect(track.replace('id')).toBeNull();
                expect(track).toMatchSnapshot();
            });

            it('and emits an event', () => {
                const track = new TrackModel(specs);
                const tile = track.append();

                const removeCallback = jest.fn().mockImplementation(oldTile => {
                    expect(oldTile).toBe(tile);
                });
                const addCallback = jest.fn().mockImplementation(newTile => {
                    expect(newTile).toBeInstanceOf(TileModel);
                    expect(newTile).not.toBe(tile);
                });

                track.on('remove', removeCallback);
                track.on('add', addCallback);

                track.replace(tile.id);
                expect(removeCallback).toHaveBeenCalledTimes(1);
            });
        });

        describe('at the first position', () => {
            it('with the default specifications', () => {
                const track = new TrackModel(specs);

                track.append();
                const tile = track.prepend();

                expect(tile).toBeInstanceOf(TileModel);
                expect(track).toMatchSnapshot();
            });

            it('with a particular type', () => {
                const track = new TrackModel(specs);

                track.append();
                const tile = track.prepend(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                expect(tile).toBeInstanceOf(TileModel);
                expect(track).toMatchSnapshot();
            });

            it('and emits an event', () => {
                const track = new TrackModel(specs);

                const callback = jest.fn().mockImplementation(tile => {
                    expect(tile).toBeInstanceOf(TileModel);
                });

                track.on('add', callback);

                track.prepend();
                expect(callback).toHaveBeenCalledTimes(1);
            });
        });

        describe('at a given position', () => {
            it('with the default specifications', () => {
                const track = new TrackModel(specs);

                track.append();
                track.append();
                const tile = track.insertAt(1);

                expect(tile).toBeInstanceOf(TileModel);
                expect(track).toMatchSnapshot();
            });

            it('with a particular type', () => {
                const track = new TrackModel(specs);

                track.append();
                track.append();
                const tile = track.insertAt(1, CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                expect(tile).toBeInstanceOf(TileModel);
                expect(track).toMatchSnapshot();
            });

            it('if the index is valid', () => {
                const track = new TrackModel(specs);

                const tile = track.insertAt(-1);
                expect(tile).toBeNull();
                expect(track).toMatchSnapshot();
            });

            it('emits an event when adding a tile', () => {
                const track = new TrackModel(specs);

                const callback = jest.fn().mockImplementation(tile => {
                    expect(tile).toBeInstanceOf(TileModel);
                });

                track.on('add', callback);

                track.insertAt(0);
                expect(callback).toHaveBeenCalledTimes(1);
            });
        });

        describe('before', () => {
            it('an inexistent position', () => {
                const track = new TrackModel(specs);

                track.append();

                expect(track.insertBefore('id')).toBeNull();
                expect(track).toMatchSnapshot();
            });

            it('the first position', () => {
                const track = new TrackModel(specs);

                const tile = track.append();
                track.append();
                const newTile = track.insertBefore(tile.id);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(track).toMatchSnapshot();
            });

            it('the last position', () => {
                const track = new TrackModel(specs);

                track.append();
                const tile = track.append();
                const newTile = track.insertBefore(tile.id);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(track).toMatchSnapshot();
            });

            it('a position in the middle', () => {
                const track = new TrackModel(specs);

                track.append();
                const tile = track.append();
                track.append();
                const newTile = track.insertBefore(tile.id);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(track).toMatchSnapshot();
            });

            it('with a particular type', () => {
                const track = new TrackModel(specs);

                const tile = track.append();
                const newTile = track.insertBefore(tile.id, CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(track).toMatchSnapshot();
            });

            it('and emits an event', () => {
                const track = new TrackModel(specs);
                const tile = track.append();

                const callback = jest.fn().mockImplementation(newTile => {
                    expect(newTile).toBeInstanceOf(TileModel);
                    expect(newTile).not.toBe(tile);
                });

                track.on('add', callback);

                track.insertBefore(tile.id);
                expect(callback).toHaveBeenCalledTimes(1);
            });
        });

        describe('after', () => {
            it('an inexistent position', () => {
                const track = new TrackModel(specs);

                track.append();

                expect(track.insertAfter('id')).toBeNull();
                expect(track).toMatchSnapshot();
            });

            it('the first position', () => {
                const track = new TrackModel(specs);

                const tile = track.append();
                track.append();
                const newTile = track.insertAfter(tile.id);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(track).toMatchSnapshot();
            });

            it('the last position', () => {
                const track = new TrackModel(specs);

                track.append();
                const tile = track.append();
                const newTile = track.insertAfter(tile.id);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(track).toMatchSnapshot();
            });

            it('a position in the middle', () => {
                const track = new TrackModel(specs);

                track.append();
                const tile = track.append();
                track.append();
                const newTile = track.insertAfter(tile.id);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(track).toMatchSnapshot();
            });

            it('with a particular type', () => {
                const track = new TrackModel(specs);

                const tile = track.append();
                const newTile = track.insertAfter(tile.id, CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

                expect(newTile).toBeInstanceOf(TileModel);
                expect(newTile).not.toBe(tile);
                expect(newTile.id).not.toBe(tile.id);
                expect(track).toMatchSnapshot();
            });

            it('and emits an event', () => {
                const track = new TrackModel(specs);
                const tile = track.append();

                const callback = jest.fn().mockImplementation(newTile => {
                    expect(newTile).toBeInstanceOf(TileModel);
                    expect(newTile).not.toBe(tile);
                });

                track.on('add', callback);

                track.insertAfter(tile.id);
                expect(callback).toHaveBeenCalledTimes(1);
            });
        });
    });

    it('can export to an object', () => {
        const track = new TrackModel(specs);
        track.append(CURVED_TILE_TYPE);

        expect(track.export()).toMatchSnapshot();
    });

    it('can import from an object', () => {
        const track = new TrackModel(specs);
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
        track.on('load', callback);

        track.append();

        expect(track.import({})).toBe(track);
        expect(track).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(0);

        expect(track.import(data)).toBe(track);
        expect(track).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    describe('can manage the builder', () => {
        it('changing it', () => {
            const track = new TrackModel(specs);
            const builder = () => {};

            expect(track.builder.builder).not.toBe(builder);
            expect(track.setBuilder(builder)).toBe(track);
            expect(track.builder.builder).toBe(builder);
        });

        it('replacing the options', () => {
            const track = new TrackModel(specs);
            const options = { foo: 'bar' };

            expect(track.hasBuilderOption('foo')).toBeFalsy();
            expect(track.setBuilderOptions(options)).toBe(track);
            expect(track.hasBuilderOption('foo')).toBeTruthy();
            expect(track.getBuilderOption('foo')).toBe('bar');
        });

        it('setting the value of an option', () => {
            const track = new TrackModel(specs);

            expect(track.hasBuilderOption('foo')).toBeFalsy();
            expect(track.setBuilderOption('foo', 'bar')).toBe(track);
            expect(track.hasBuilderOption('foo')).toBeTruthy();
            expect(track.getBuilderOption('foo')).toBe('bar');
        });

        it('getting the value of an option', () => {
            const track = new TrackModel(specs);

            expect(track.getBuilderOption('foo')).toBeUndefined();
            track.setBuilderOption('foo', 'bar');
            expect(track.getBuilderOption('foo')).toBe('bar');
        });

        it('checking if an option is assigned', () => {
            const track = new TrackModel(specs);

            expect(track.hasBuilderOption('foo')).toBeFalsy();
            track.setBuilderOption('foo', 'bar');
            expect(track.hasBuilderOption('foo')).toBeTruthy();
        });
    });

    describe('can notify changes', () => {
        it.each([
            ['tilesStore', 14],
            ['modelsStore', 6],
            ['counterStore', 10]
        ])('through the %s', (name, count) => {
            const track = new TrackModel(specs);
            const store = track[name];

            const callback = jest.fn().mockImplementation(value => {
                expect(value).toMatchSnapshot();
            });

            const unsubscribe = store.subscribe(callback); // callback called

            track.setSpecs(specs);
            const tile1 = track.append(CURVED_TILE_TYPE); // event: add (add) / (addtile, addmodel)
            const tile2 = track.prepend(CURVED_TILE_TYPE); // event: add (add) / (addtile)
            track.remove(tile1.id); // event: delete (remove) / (removetile)
            const tile3 = track.replace(tile2.id); // event: set (add, remove) / (removetile, removemodel, addtile, addmodel)
            track.insertBefore(tile3.id); // event: add (add) / (addtile)
            track.insertAfter(tile3.id); // event: add (add) / (addtile)
            const data = track.export();
            track.clear(); // event: clear (clear) / (rebuild)
            track.import(data); // event: load (load) / (rebuild)
            track.setSpecs(new TileSpecifications({ laneWidth: 10, barrierWidth: 1, barrierChunks: 2 })); // event: specs (specs) / (none)
            track.update(); // event: update (update) / (none)
            track.setBuilderOption('startAngle', 90); // event: option (rebuild) / (none)
            track.setBuilderOptions({ startX: 10, startY: 10 }); // event: options (rebuild) / (none)
            track.setBuilder(buildList); // event: builder (rebuild) / (none)

            unsubscribe();
            track.append();

            expect(callback).toHaveBeenCalledTimes(count);
        });
    });

    it('can validate an object is an instance of the class', () => {
        const track = new TrackModel(specs);
        expect(() => TrackModel.validateInstance(track)).not.toThrow();
        expect(() => TrackModel.validateInstance({})).toThrow('The object must be an instance of TrackModel!');
    });
});
