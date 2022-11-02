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

import { getCoord, getRect } from '../coord.js';

describe('getCoord', () => {
    it('is a function', () => {
        expect(getCoord).toEqual(expect.any(Function));
    });

    it.each([
        [{}, { x: void 0, y: void 0 }],
        [
            { x: 10, y: 20 },
            { x: 10, y: 20 }
        ],
        [
            { x: 1, y: 2, width: 10, height: 20 },
            { x: 1, y: 2 }
        ]
    ])('extract the coordinates from %s', (coord, expected) => {
        expect(getCoord(coord)).toStrictEqual(expected);
    });
});

describe('getRect', () => {
    it('is a function', () => {
        expect(getRect).toEqual(expect.any(Function));
    });

    it.each([
        [{}, { x: void 0, y: void 0, width: void 0, height: void 0 }],
        [
            { x: 10, y: 20 },
            { x: 10, y: 20, width: void 0, height: void 0 }
        ],
        [
            { x: 1, y: 2, width: 10, height: 20 },
            { x: 1, y: 2, width: 10, height: 20 }
        ],
        [
            { x: 1, y: 2, width: 10, height: 20, top: 4, left: 5, bottom: 6, right: 7 },
            { x: 1, y: 2, width: 10, height: 20 }
        ]
    ])('extract the coordinates from %s', (coord, expected) => {
        expect(getRect(coord)).toStrictEqual(expected);
    });
});
