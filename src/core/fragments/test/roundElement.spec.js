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

import { roundElementPath } from '../roundElement.js';
import { SVGPath } from '../../models';

describe('roundElementPath', () => {
    it('is a function', () => {
        expect(roundElementPath).toEqual(expect.any(Function));
    });

    it('returns a SVG path', () => {
        expect(roundElementPath(0, 0, 10, 5)).toBeInstanceOf(SVGPath);
    });

    it.each([
        [100, 100, 50, void 0],
        [100, 100, 50, 5]
    ])('draws a curved arrow tip at %s,%s having radius=%s, with %s added', (x, y, radius, addition) => {
        expect(roundElementPath(x, y, radius, addition).toString()).toMatchSnapshot();
    });
});
