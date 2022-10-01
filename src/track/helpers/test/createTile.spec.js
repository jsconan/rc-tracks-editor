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
} from '../../../tile/helpers';
import { TileSpecifications } from '../../../tile/config';
import { CurvedTileEnlargedModel, CurvedTileModel, StraightTileModel } from '../../../tile/models';
import createTile from '../createTile.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

describe('createTile', () => {
    it('is a function', () => {
        expect(createTile).toEqual(expect.any(Function));
    });

    describe('throws error', () => {
        it('when trying to create a tile with an invalid specifications object', () => {
            expect(() => createTile({})).toThrow(
                'The specifications object must be an instance of TileSpecifications!'
            );
        });

        it('when trying to create a tile with an invalid type', () => {
            expect(() => createTile(specs, '')).toThrow('A valid type of tile is needed!');
            expect(() => createTile(specs, 'tile')).toThrow('A valid type of tile is needed!');
        });

        it('when trying to create a tile with an invalid direction', () => {
            expect(() => createTile(specs, CURVED_TILE_TYPE, '')).toThrow('A valid direction is needed!');
            expect(() => createTile(specs, CURVED_TILE_TYPE, 'top')).toThrow('A valid direction is needed!');
        });
    });

    describe('create a tile', () => {
        it.each([
            [STRAIGHT_TILE_TYPE, StraightTileModel],
            [CURVED_TILE_TYPE, CurvedTileModel],
            [CURVED_TILE_ENLARGED_TYPE, CurvedTileEnlargedModel]
        ])('of the type %s', (type, constructor) => {
            const tile = createTile(specs, type);
            expect(tile).toBeInstanceOf(constructor);
            expect(tile.type).toBe(type);
        });

        it.each([TILE_DIRECTION_LEFT, TILE_DIRECTION_RIGHT])('having the direction %s', direction => {
            const straightTile = createTile(specs, STRAIGHT_TILE_TYPE, direction);
            const curvedTile = createTile(specs, CURVED_TILE_TYPE, direction);
            const enlargedTile = createTile(specs, CURVED_TILE_ENLARGED_TYPE, direction);
            expect(straightTile.direction).toBe(direction);
            expect(curvedTile.direction).toBe(direction);
            expect(enlargedTile.direction).toBe(direction);
        });

        it.each([1, 2, 3, 4])('with the size ratio %s', ratio => {
            const curvedTile = createTile(specs, CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, ratio);
            expect(curvedTile.ratio).toBe(ratio);
        });
    });
});
