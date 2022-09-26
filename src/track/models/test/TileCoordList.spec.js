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

    it('has a length', () => {
        const list = new TileList(specs);
        const listCoord = new TileCoordList(list, mockBuilder);

        expect(listCoord.length).toBe(0);

        list.append();

        expect(listCoord.length).toBe(1);
    });

    it('implements the iteration protocol', () => {
        const list = new TileList(specs);
        const listCoord = new TileCoordList(list, mockBuilder);
        list.append();

        expect(listCoord[Symbol.iterator]).toEqual(expect.any(Function));
        expect(listCoord[Symbol.iterator]()).not.toBe(listCoord[Symbol.iterator]());
        expect([...listCoord]).toMatchSnapshot();
    });

    it('can produce an iterator', () => {
        const list = new TileList(specs);
        const listCoord = new TileCoordList(list, mockBuilder);
        list.append();

        expect(listCoord.values).toEqual(expect.any(Function));
        expect(listCoord.values()[Symbol.iterator]).toEqual(expect.any(Function));

        expect(listCoord.values()).not.toBe(listCoord.values());
        expect([...listCoord.values()]).toMatchSnapshot();
    });

    describe('throws error', () => {
        it('when trying to create an instance with an invalid list', () => {
            expect(() => new TileCoordList({})).toThrow('The model must be an instance of TileList!');
        });

        it('when trying to create an instance with an invalid builder', () => {
            expect(() => new TileCoordList(new TileList(specs), {})).toThrow('A builder function is expected!');
        });

        it('when trying to set an invalid list', () => {
            const listCoord = new TileCoordList(new TileList(specs), mockBuilder);
            expect(() => listCoord.setList({})).toThrow('The model must be an instance of TileList!');
        });

        it('when trying to set an invalid builder', () => {
            const listCoord = new TileCoordList(new TileList(specs), mockBuilder);
            expect(() => listCoord.setBuilder({})).toThrow('A builder function is expected!');
        });
    });

    describe('can set', () => {
        it('a list of tiles', () => {
            const oldList = new TileList(specs);
            const newList = new TileList(specs);
            const listCoord = new TileCoordList(oldList, mockBuilder);

            expect(listCoord.list).toBe(oldList);
            expect(listCoord.setList(newList)).toBe(listCoord);
            expect(listCoord.list).toBe(newList);
        });

        it('a builder function', () => {
            const listCoord = new TileCoordList(new TileList(specs), mockBuilder);
            const builder = () => {};

            expect(listCoord.builder).not.toBe(builder);
            expect(listCoord.setBuilder(builder)).toBe(listCoord);
            expect(listCoord.builder).toBe(builder);
        });

        it('the options for the builder', () => {
            const listCoord = new TileCoordList(new TileList(specs), mockBuilder, { dummy: true });
            const options = { foo: 'bar' };

            expect(listCoord.hasOption('dummy')).toBeTruthy();
            expect(listCoord.setOptions(options)).toBe(listCoord);
            expect(listCoord.options).not.toBe(options);
            expect(listCoord.hasOption('dummy')).toBeFalsy();
            expect(listCoord.getOption('foo')).toBe(options.foo);
        });
    });

    describe('manage options for the builder', () => {
        it('setting the value of an option', () => {
            const listCoord = new TileCoordList(new TileList(specs), mockBuilder);

            expect(listCoord.hasOption('foo')).toBeFalsy();
            expect(listCoord.setOption('foo', 'bar')).toBe(listCoord);
            expect(listCoord.hasOption('foo')).toBeTruthy();
            expect(listCoord.getOption('foo')).toBe('bar');
        });

        it('getting the value of an option', () => {
            const listCoord = new TileCoordList(new TileList(specs), mockBuilder);

            expect(listCoord.getOption('foo')).toBeUndefined();
            listCoord.setOption('foo', 'bar');
            expect(listCoord.getOption('foo')).toBe('bar');
        });

        it('checking if an option is assigned', () => {
            const listCoord = new TileCoordList(new TileList(specs), mockBuilder);

            expect(listCoord.hasOption('foo')).toBeFalsy();
            listCoord.setOption('foo', 'bar');
            expect(listCoord.hasOption('foo')).toBeTruthy();
        });
    });

    describe('manage the built coordinates', () => {
        const list = new TileList(specs);
        const listCoord = new TileCoordList(list, mockBuilder);

        list.append();
        const tile = list.append();
        list.append();

        it('getting the identifier of a tile at a particular index', () => {
            expect(listCoord.getIndex(tile.id)).toBe(1);
            expect(listCoord.getIndex('foo')).toBe(-1);
        });

        it('getting the coordinate of a tile from its identifier', () => {
            expect(listCoord.get(tile.id)).toBe(`coord-${tile.id}`);
            expect(listCoord.get('foo')).toBeNull();
        });

        it('getting the coordinate of a tile at a particular index', () => {
            expect(listCoord.getAt(1)).toBe(`coord-${tile.id}`);
            expect(listCoord.getAt(3)).toBeNull();

            const emptyBridge = new TileCoordList(new TileList(specs), () => {});
            expect(emptyBridge.getAt(0)).toBeNull();
        });
    });

    describe('can build coordinates', () => {
        it('with the given builder options', () => {
            const theList = new TileList(specs);
            theList.append();

            const builder = (list, options) => {
                expect(list).toBe(theList);
                expect(options).toEqual(expect.any(Object));
                expect(options.foo).toBe('bar');
                return mockBuilder(list);
            };

            const listCoord = new TileCoordList(theList, builder, { foo: 'bar' });

            const callback = jest.fn().mockImplementation(() => {
                expect(listCoord.listCoord).toMatchSnapshot();
            });
            const unsubscribe = listCoord.subscribe(callback);

            expect(callback).toHaveBeenCalledTimes(1);
            unsubscribe();
        });

        it('when the list of tiles is changed', () => {
            const oldList = new TileList(specs);
            oldList.append();

            const newList = new TileList(specs);
            newList.append();

            const listCoord = new TileCoordList(oldList, mockBuilder);

            const callback = jest.fn().mockImplementation(() => {
                expect(listCoord.listCoord).toMatchSnapshot();
            });
            const unsubscribe = listCoord.subscribe(callback);

            expect(listCoord.setList(newList)).toBe(listCoord);
            oldList.append();
            newList.append();

            expect(callback).toHaveBeenCalledTimes(3);

            unsubscribe();
        });

        it('when the builder function is changed', () => {
            const list = new TileList(specs);
            list.append();

            const listCoord = new TileCoordList(list, mockBuilder);

            const callback = jest.fn().mockImplementation(() => {
                expect(listCoord.listCoord).toMatchSnapshot();
            });
            const unsubscribe = listCoord.subscribe(callback);

            const newBuilder = () => list.tiles.map(tile => `coord-${tile.id}`);
            expect(listCoord.setBuilder(newBuilder)).toBe(listCoord);

            expect(callback).toHaveBeenCalledTimes(2);

            unsubscribe();
        });

        it('each time a tile is added', () => {
            const theList = new TileList(specs);
            const listCoord = new TileCoordList(theList, mockBuilder);

            const callback = jest.fn().mockImplementation(() => {
                expect(listCoord.listCoord).toMatchSnapshot();
            });
            const unsubscribe = listCoord.subscribe(callback);

            theList.append();

            expect(callback).toHaveBeenCalledTimes(2);
            unsubscribe();
        });

        it('each time an option is changed', () => {
            const theList = new TileList(specs);
            theList.append();

            const listCoord = new TileCoordList(theList, mockBuilder);

            const callback = jest.fn().mockImplementation(() => {
                expect(listCoord.listCoord).toMatchSnapshot();
            });
            const unsubscribe = listCoord.subscribe(callback);

            listCoord.setOption('foo', 'bar');
            listCoord.setOptions({});

            expect(callback).toHaveBeenCalledTimes(3);
            unsubscribe();
        });

        it('each time the build function is called', () => {
            const theList = new TileList(specs);
            theList.append();

            const listCoord = new TileCoordList(theList, mockBuilder);

            const callback = jest.fn().mockImplementation(() => {
                expect(listCoord.listCoord).toMatchSnapshot();
            });
            const unsubscribe = listCoord.subscribe(callback);

            listCoord.build();

            expect(callback).toHaveBeenCalledTimes(2);
            unsubscribe();
        });
    });

    it('can validate an object is an instance of the class', () => {
        const list = new TileList(specs);
        const listCoord = new TileCoordList(list, mockBuilder);
        expect(() => TileCoordList.validateInstance(listCoord)).not.toThrow();
        expect(() => TileCoordList.validateInstance({})).toThrow('The model must be an instance of TileCoordList!');
    });
});
