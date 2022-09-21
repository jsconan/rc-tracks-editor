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
import { TileList } from '../TileList.js';
import { TileCoordList } from '../TileCoordList.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

const mockBuilder = list => {
    const tiles = list.tiles.map(tile => `coord-${tile.id}`);
    return { tiles };
};

describe('TileCoordList', () => {
    it('is a class', () => {
        expect(TileCoordList).toEqual(expect.any(Function));
    });

    describe('throws error', () => {
        it('when trying to create an instance with an invalid list', () => {
            // @ts-expect-error
            expect(() => new TileCoordList({})).toThrow('The model must be an instance of TileList!');
        });

        it('when trying to create an instance with an invalid builder', () => {
            // @ts-expect-error
            expect(() => new TileCoordList(new TileList(specs), {})).toThrow('A builder function is expected!');
        });

        it('when trying to set an invalid list', () => {
            const bridge = new TileCoordList(new TileList(specs), mockBuilder);
            // @ts-expect-error
            expect(() => bridge.setList({})).toThrow('The model must be an instance of TileList!');
        });

        it('when trying to set an invalid builder', () => {
            const bridge = new TileCoordList(new TileList(specs), mockBuilder);
            // @ts-expect-error
            expect(() => bridge.setBuilder({})).toThrow('A builder function is expected!');
        });
    });

    describe('can set', () => {
        it('a list of tiles', () => {
            const oldList = new TileList(specs);
            const newList = new TileList(specs);
            const bridge = new TileCoordList(oldList, mockBuilder);

            expect(bridge.list).toBe(oldList);
            expect(bridge.setList(newList)).toBe(bridge);
            expect(bridge.list).toBe(newList);
        });

        it('a builder function', () => {
            const bridge = new TileCoordList(new TileList(specs), mockBuilder);
            const builder = () => {};

            expect(bridge.builder).not.toBe(builder);
            expect(bridge.setBuilder(builder)).toBe(bridge);
            expect(bridge.builder).toBe(builder);
        });

        it('the options for the builder', () => {
            const bridge = new TileCoordList(new TileList(specs), mockBuilder, { dummy: true });
            const options = { foo: 'bar' };

            expect(bridge.hasOption('dummy')).toBeTruthy();
            expect(bridge.setOptions(options)).toBe(bridge);
            expect(bridge.options).not.toBe(options);
            expect(bridge.hasOption('dummy')).toBeFalsy();
            expect(bridge.getOption('foo')).toBe(options.foo);
        });
    });

    describe('manage options for the builder', () => {
        it('setting the value of an option', () => {
            const bridge = new TileCoordList(new TileList(specs), mockBuilder);

            expect(bridge.hasOption('foo')).toBeFalsy();
            expect(bridge.setOption('foo', 'bar')).toBe(bridge);
            expect(bridge.hasOption('foo')).toBeTruthy();
            expect(bridge.getOption('foo')).toBe('bar');
        });

        it('getting the value of an option', () => {
            const bridge = new TileCoordList(new TileList(specs), mockBuilder);

            expect(bridge.getOption('foo')).toBeUndefined();
            bridge.setOption('foo', 'bar');
            expect(bridge.getOption('foo')).toBe('bar');
        });

        it('checking if an option is assigned', () => {
            const bridge = new TileCoordList(new TileList(specs), mockBuilder);

            expect(bridge.hasOption('foo')).toBeFalsy();
            bridge.setOption('foo', 'bar');
            expect(bridge.hasOption('foo')).toBeTruthy();
        });
    });

    describe('manage the built coordinates', () => {
        const list = new TileList(specs);
        const bridge = new TileCoordList(list, mockBuilder);

        list.appendTile();
        const id = list.appendTile();
        list.appendTile();

        it('getting the identifier of a tile at a particular index', () => {
            expect(bridge.getTileIndex(id)).toBe(1);
            expect(bridge.getTileIndex('foo')).toBe(-1);
        });

        it('getting the coordinate of a tile from its identifier', () => {
            expect(bridge.getTile(id)).toBe(`coord-${id}`);
            expect(bridge.getTile('foo')).toBeNull();
        });

        it('getting the coordinate of a tile at a particular index', () => {
            expect(bridge.getTileAt(1)).toBe(`coord-${id}`);
            expect(bridge.getTileAt(3)).toBeNull();

            const emptyBridge = new TileCoordList(new TileList(specs), () => {});
            expect(emptyBridge.getTileAt(0)).toBeNull();
        });
    });

    describe('can build coordinates', () => {
        it('with the given builder options', () => {
            const theList = new TileList(specs);
            theList.appendTile();

            const builder = (list, options) => {
                expect(list).toBe(theList);
                expect(options).toEqual(expect.any(Object));
                expect(options.foo).toBe('bar');
                return mockBuilder(list);
            };

            const bridge = new TileCoordList(theList, builder, { foo: 'bar' });

            const callback = jest.fn().mockImplementation(() => {
                expect(bridge.listCoord).toMatchSnapshot();
            });
            const unsubscribe = bridge.subscribe(callback);

            expect(callback).toHaveBeenCalledTimes(1);
            unsubscribe();
        });

        it('when the list of tiles is changed', () => {
            const oldList = new TileList(specs);
            oldList.appendTile();

            const newList = new TileList(specs);
            newList.appendTile();

            const bridge = new TileCoordList(oldList, mockBuilder);

            const callback = jest.fn().mockImplementation(() => {
                expect(bridge.listCoord).toMatchSnapshot();
            });
            const unsubscribe = bridge.subscribe(callback);

            expect(bridge.setList(newList)).toBe(bridge);
            oldList.appendTile();
            newList.appendTile();

            expect(callback).toHaveBeenCalledTimes(3);

            unsubscribe();
        });

        it('when the builder function is changed', () => {
            const list = new TileList(specs);
            list.appendTile();

            const bridge = new TileCoordList(list, mockBuilder);

            const callback = jest.fn().mockImplementation(() => {
                expect(bridge.listCoord).toMatchSnapshot();
            });
            const unsubscribe = bridge.subscribe(callback);

            const newBuilder = () => list.tiles.map(tile => `coord-${tile.id}`);
            expect(bridge.setBuilder(newBuilder)).toBe(bridge);

            expect(callback).toHaveBeenCalledTimes(2);

            unsubscribe();
        });

        it('each time a tile is added', () => {
            const theList = new TileList(specs);
            const bridge = new TileCoordList(theList, mockBuilder);

            const callback = jest.fn().mockImplementation(() => {
                expect(bridge.listCoord).toMatchSnapshot();
            });
            const unsubscribe = bridge.subscribe(callback);

            theList.appendTile();

            expect(callback).toHaveBeenCalledTimes(2);
            unsubscribe();
        });

        it('each time an option is changed', () => {
            const theList = new TileList(specs);
            theList.appendTile();

            const bridge = new TileCoordList(theList, mockBuilder);

            const callback = jest.fn().mockImplementation(() => {
                expect(bridge.listCoord).toMatchSnapshot();
            });
            const unsubscribe = bridge.subscribe(callback);

            bridge.setOption('foo', 'bar');
            bridge.setOptions({});

            expect(callback).toHaveBeenCalledTimes(3);
            unsubscribe();
        });

        it('each time the build function is called', () => {
            const theList = new TileList(specs);
            theList.appendTile();

            const bridge = new TileCoordList(theList, mockBuilder);

            const callback = jest.fn().mockImplementation(() => {
                expect(bridge.listCoord).toMatchSnapshot();
            });
            const unsubscribe = bridge.subscribe(callback);

            bridge.build();

            expect(callback).toHaveBeenCalledTimes(2);
            unsubscribe();
        });
    });

    it('can validate an object is an instance of the class', () => {
        const list = new TileList(specs);
        const bridge = new TileCoordList(list, mockBuilder);
        expect(() => TileCoordList.validateInstance(bridge)).not.toThrow();
        expect(() => TileCoordList.validateInstance({})).toThrow('The model must be an instance of TileCoordList!');
    });
});
