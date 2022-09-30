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
import { TileListBuilder } from '../TileListBuilder.js';
import { CURVED_TILE_ENLARGED_TYPE, CURVED_TILE_TYPE, STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT } from '../../helpers';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

const mockBuilder = list => {
    const tiles = list.map(tile => `coord-${tile.id}`);
    return { tiles };
};

const tileList = new TileList(specs);
tileList.import([
    { type: STRAIGHT_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_ENLARGED_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 }
]);

describe('TileListBuilder', () => {
    it('is a class', () => {
        expect(TileListBuilder).toEqual(expect.any(Function));
    });

    describe('throws error', () => {
        it('when trying to create an instance with an invalid builder', () => {
            expect(() => new TileListBuilder({})).toThrow('A builder function is expected!');
        });

        it('when trying to build an invalid list', () => {
            const listBuilder = new TileListBuilder(mockBuilder);
            expect(() => listBuilder.build({})).toThrow('The object must be an instance of TileList!');
        });

        it('when trying to set an invalid builder', () => {
            const listBuilder = new TileListBuilder(mockBuilder);
            expect(() => listBuilder.setBuilder({})).toThrow('A builder function is expected!');
        });
    });

    describe('can set', () => {
        it('a builder function', () => {
            const listBuilder = new TileListBuilder(mockBuilder);
            const builder = () => {};

            expect(listBuilder.builder).not.toBe(builder);
            expect(listBuilder.setBuilder(builder)).toBe(listBuilder);
            expect(listBuilder.builder).toBe(builder);
        });

        it('the options for the builder', () => {
            const listBuilder = new TileListBuilder(mockBuilder, { dummy: true });
            const options = { foo: 'bar' };

            expect(listBuilder.hasOption('dummy')).toBeTruthy();
            expect(listBuilder.setOptions(options)).toBe(listBuilder);
            expect(listBuilder.options).not.toBe(options);
            expect(listBuilder.hasOption('dummy')).toBeFalsy();
            expect(listBuilder.getOption('foo')).toBe(options.foo);
        });
    });

    describe('manage options for the builder', () => {
        it('setting the value of an option', () => {
            const listBuilder = new TileListBuilder(mockBuilder);

            expect(listBuilder.hasOption('foo')).toBeFalsy();
            expect(listBuilder.setOption('foo', 'bar')).toBe(listBuilder);
            expect(listBuilder.hasOption('foo')).toBeTruthy();
            expect(listBuilder.getOption('foo')).toBe('bar');
        });

        it('getting the value of an option', () => {
            const listBuilder = new TileListBuilder(mockBuilder);

            expect(listBuilder.getOption('foo')).toBeUndefined();
            listBuilder.setOption('foo', 'bar');
            expect(listBuilder.getOption('foo')).toBe('bar');
        });

        it('checking if an option is assigned', () => {
            const listBuilder = new TileListBuilder(mockBuilder);

            expect(listBuilder.hasOption('foo')).toBeFalsy();
            listBuilder.setOption('foo', 'bar');
            expect(listBuilder.hasOption('foo')).toBeTruthy();
        });
    });

    describe('can build coordinates', () => {
        it('with the given builder options', () => {
            const builder = (list, options) => {
                expect(list).toBe(tileList);
                expect(options).toEqual(expect.any(Object));
                expect(options.foo).toBe('bar');
                return mockBuilder(list);
            };

            const listBuilder = new TileListBuilder(builder, { foo: 'bar' });

            expect(listBuilder.build(tileList)).toMatchSnapshot();
        });

        it('with a new builder', () => {
            const listBuilder = new TileListBuilder(mockBuilder);

            expect(listBuilder.build(tileList)).toMatchSnapshot();

            const newBuilder = list => list.map(tile => `coord-${tile.id}`);
            listBuilder.setBuilder(newBuilder);

            expect(listBuilder.build(tileList)).toMatchSnapshot();
        });
    });

    it('can validate an object is an instance of the class', () => {
        const listBuilder = new TileListBuilder(mockBuilder);
        expect(() => TileListBuilder.validateInstance(listBuilder)).not.toThrow();
        expect(() => TileListBuilder.validateInstance({})).toThrow(
            'The object must be an instance of TileListBuilder!'
        );
    });
});
