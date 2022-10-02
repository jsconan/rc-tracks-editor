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
    TILE_DIRECTION_RIGHT
} from '../../../tile/helpers';
import { TileSpecifications } from '../../../tile/config';
import { TileList } from '../../../tile/models/TileList.js';
import { TrackBuilder } from '../TrackBuilder.js';

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

describe('TrackBuilder', () => {
    it('is a class', () => {
        expect(TrackBuilder).toEqual(expect.any(Function));
    });

    describe('throws error', () => {
        it('when trying to create an instance with an invalid builder', () => {
            expect(() => new TrackBuilder({})).toThrow('A builder function is expected!');
        });

        it('when trying to build an invalid list', () => {
            const trackBuilder = new TrackBuilder(mockBuilder);
            expect(() => trackBuilder.build({})).toThrow('The object must be an instance of TileList!');
        });

        it('when trying to set an invalid builder', () => {
            const trackBuilder = new TrackBuilder(mockBuilder);
            expect(() => trackBuilder.setBuilder({})).toThrow('A builder function is expected!');
        });
    });

    describe('can set', () => {
        it('a builder function', () => {
            const trackBuilder = new TrackBuilder(mockBuilder);
            const builder = () => {};

            expect(trackBuilder.builder).not.toBe(builder);
            expect(trackBuilder.setBuilder(builder)).toBe(trackBuilder);
            expect(trackBuilder.builder).toBe(builder);
        });

        it('the options for the builder', () => {
            const trackBuilder = new TrackBuilder(mockBuilder, { dummy: true });
            const options = { foo: 'bar' };

            expect(trackBuilder.hasOption('dummy')).toBeTruthy();
            expect(trackBuilder.setOptions(options)).toBe(trackBuilder);
            expect(trackBuilder.options).not.toBe(options);
            expect(trackBuilder.hasOption('dummy')).toBeFalsy();
            expect(trackBuilder.getOption('foo')).toBe(options.foo);
        });
    });

    describe('manage options for the builder', () => {
        it('setting the value of an option', () => {
            const trackBuilder = new TrackBuilder(mockBuilder);

            expect(trackBuilder.hasOption('foo')).toBeFalsy();
            expect(trackBuilder.setOption('foo', 'bar')).toBe(trackBuilder);
            expect(trackBuilder.hasOption('foo')).toBeTruthy();
            expect(trackBuilder.getOption('foo')).toBe('bar');
        });

        it('getting the value of an option', () => {
            const trackBuilder = new TrackBuilder(mockBuilder);

            expect(trackBuilder.getOption('foo')).toBeUndefined();
            trackBuilder.setOption('foo', 'bar');
            expect(trackBuilder.getOption('foo')).toBe('bar');
        });

        it('checking if an option is assigned', () => {
            const trackBuilder = new TrackBuilder(mockBuilder);

            expect(trackBuilder.hasOption('foo')).toBeFalsy();
            trackBuilder.setOption('foo', 'bar');
            expect(trackBuilder.hasOption('foo')).toBeTruthy();
        });
    });

    describe('emit events', () => {
        it('when replacing the builder', () => {
            const trackBuilder = new TrackBuilder(mockBuilder);
            const builder = () => {};

            const callback = jest.fn().mockImplementation((newBuilder, oldBuilder) => {
                expect(newBuilder).toBe(builder);
                expect(oldBuilder).toBe(mockBuilder);
            });

            trackBuilder.on('builder', callback);
            trackBuilder.setBuilder(builder);

            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('when replacing the options', () => {
            const defaultOptions = {
                foo: 'bar'
            };
            const options = {
                bar: 'foo'
            };
            const trackBuilder = new TrackBuilder(mockBuilder, defaultOptions);

            const callback = jest.fn().mockImplementation((newOptions, oldOptions) => {
                expect(newOptions).toEqual(options);
                expect(oldOptions).toEqual(defaultOptions);
            });

            trackBuilder.on('options', callback);
            trackBuilder.setOptions(options);

            expect(callback).toHaveBeenCalledTimes(1);
        });

        it.each([
            ['an existing option', { foo: 'bar' }, 'bar'],
            ['a new option', {}, void 0]
        ])('when setting %s', (type, options, previous) => {
            const trackBuilder = new TrackBuilder(mockBuilder, options);

            const callback = jest.fn().mockImplementation((name, newValue, oldValue) => {
                expect(name).toBe('foo');
                expect(newValue).toEqual('baz');
                expect(oldValue).toEqual(previous);
            });

            trackBuilder.on('option', callback);
            trackBuilder.setOption('foo', 'baz');

            expect(callback).toHaveBeenCalledTimes(1);
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

            const trackBuilder = new TrackBuilder(builder, { foo: 'bar' });

            expect(trackBuilder.build(tileList)).toMatchSnapshot();
        });

        it('with a new builder', () => {
            const trackBuilder = new TrackBuilder(mockBuilder);

            expect(trackBuilder.build(tileList)).toMatchSnapshot();

            const newBuilder = list => list.map(tile => `coord-${tile.id}`);
            trackBuilder.setBuilder(newBuilder);

            expect(trackBuilder.build(tileList)).toMatchSnapshot();
        });
    });

    it('can validate an object is an instance of the class', () => {
        const trackBuilder = new TrackBuilder(mockBuilder);
        expect(() => TrackBuilder.validateInstance(trackBuilder)).not.toThrow();
        expect(() => TrackBuilder.validateInstance({})).toThrow('The object must be an instance of TrackBuilder!');
    });
});
