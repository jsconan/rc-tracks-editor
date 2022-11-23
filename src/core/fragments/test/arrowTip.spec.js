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

import { arrowTipPath } from '../arrowTip.js';
import { SVGPath } from '../../models';

describe('arrowTipPath', () => {
    it('is a function', () => {
        expect(arrowTipPath).toEqual(expect.any(Function));
    });

    it('returns a SVG path', () => {
        expect(arrowTipPath()).toBeInstanceOf(SVGPath);
    });

    it.each([
        [100, 100, 60, 50, void 0],
        [100, 100, 60, 50, 30]
    ])('draws an arrow tip at %s,%s having width=%s and height=%s, rotated by %s', (x, y, width, height, rotation) => {
        expect(arrowTipPath(x, y, width, height, rotation).toString()).toMatchSnapshot();
    });
});
