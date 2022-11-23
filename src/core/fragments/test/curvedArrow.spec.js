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

import { curvedArrowPath } from '../curvedArrow.js';
import { SVGPath } from '../../models';

describe('curvedArrowPath', () => {
    it('is a function', () => {
        expect(curvedArrowPath).toEqual(expect.any(Function));
    });

    it('returns a SVG path', () => {
        expect(curvedArrowPath()).toBeInstanceOf(SVGPath);
    });

    it.each([
        [100, 100, 60, 50, 80, 60, void 0, void 0, void 0],
        [100, 100, 60, 50, 80, 60, 0, void 0, void 0],
        [100, 100, 60, 50, 80, 60, 10, void 0, void 0],
        [100, 100, 60, 50, 80, 60, 10, false, void 0],
        [100, 100, 60, 50, 80, 60, 10, true, void 0],
        [100, 100, 60, 50, 80, 60, 10, false, 30],
        [100, 100, 60, 50, 80, 60, 10, true, 30],
        [100, 100, 60, 50, 80, 360, 10, true, 30],
        [100, 100, 60, 50, 80, 360, 0, true, 30]
    ])(
        'draws a curved arrow tip at %s,%s having width=%s and height=%s, radius=%s and angle=%s, thickness=%s, clockwise=%s, rotated by %s',
        (x, y, width, height, radius, angle, thickness, clockwise, rotation) => {
            expect(
                curvedArrowPath(x, y, width, height, radius, angle, thickness, clockwise, rotation).toString()
            ).toMatchSnapshot();
        }
    );
});
