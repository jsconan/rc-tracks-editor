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

import { quadrantAngle, quadrantRange } from '../angles.js';

describe('quadrantAngle', () => {
    it('is a function', () => {
        expect(quadrantAngle).toEqual(expect.any(Function));
    });

    it.each([
        [0, 0],
        [40, 0],
        [50, 90],
        [90, 90],
        [130, 90],
        [140, 180],
        [180, 180],
        [220, 180],
        [240, 270],
        [270, 270],
        [310, 270],
        [320, 360],
        [360, 360]
    ])('returns the quadrant angle for %s', (angle, expected) => {
        expect(quadrantAngle(angle)).toBe(expected);
    });
});

describe('quadrantRange', () => {
    it('is a function', () => {
        expect(quadrantRange).toEqual(expect.any(Function));
    });

    it.each([
        [0, 90, null],
        [-45, 45, 0],
        [30, 120, 90],
        [10, 100, 90],
        [100, 180, null],
        [100, 190, 180],
        [210, 300, 270],
        [210, 270, null],
        [280, 370, 360],
        [280, 360, null]
    ])('returns the quadrant angles for the range [%s : %s]', (start, end, expected) => {
        expect(quadrantRange(start, end)).toEqual(expected);
    });
});
