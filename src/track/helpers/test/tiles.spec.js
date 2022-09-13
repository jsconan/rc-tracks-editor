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
    DEFAULT_TILE_TYPE,
    flipTileDirection,
    isDirectionValid,
    isTypeValid,
    STRAIGHT_TILE_TYPE,
    TILE_DIRECTION_LEFT,
    TILE_DIRECTION_RIGHT
} from '../tiles.js';

describe('isDirectionValid', () => {
    it('is a function', () => {
        expect(isDirectionValid).toEqual(expect.any(Function));
    });

    it.each([TILE_DIRECTION_RIGHT, TILE_DIRECTION_LEFT])('tells the direction "%s" is valid', direction => {
        expect(isDirectionValid(direction)).toBeTruthy();
    });

    it.each([-1, 0, 1, 2])('tells the direction "%s" is not valid', direction => {
        expect(isDirectionValid(direction)).toBeFalsy();
    });
});

describe('isTypeValid', () => {
    it('is a function', () => {
        expect(isTypeValid).toEqual(expect.any(Function));
    });

    it.each([STRAIGHT_TILE_TYPE, CURVED_TILE_TYPE, CURVED_TILE_ENLARGED_TYPE])(
        'tells the type "%s" is valid',
        direction => {
            expect(isTypeValid(direction)).toBeTruthy();
        }
    );

    it.each([DEFAULT_TILE_TYPE, 'left', 'right'])('tells the type "%s" is not valid', direction => {
        expect(isTypeValid(direction)).toBeFalsy();
    });
});

describe('flipTileDirection', () => {
    it('is a function', () => {
        expect(flipTileDirection).toEqual(expect.any(Function));
    });

    it.each([
        [TILE_DIRECTION_RIGHT, TILE_DIRECTION_LEFT],
        [TILE_DIRECTION_LEFT, TILE_DIRECTION_RIGHT]
    ])('flips the direction from %s to %s', (direction, flippedDirection) => {
        expect(flipTileDirection(direction)).toBe(flippedDirection);
    });
});
