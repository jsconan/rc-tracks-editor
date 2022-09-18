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

import { Vector2D } from '../../models/Vector2D.js';
import { arcTo, lineTo, moveTo } from '../svg.js';

describe('moveTo', () => {
    it('is a function', () => {
        expect(moveTo).toEqual(expect.any(Function));
    });

    it.each([
        [0, 0, 'M 0 0'],
        [10, 20, 'M 10 20'],
        [-5, -6, 'M -5 -6']
    ])('renders the path command MoveTo(x=%s, y=%s)', (x, y, expected) => {
        const v = new Vector2D(x, y);
        expect(moveTo(v)).toBe(expected);
    });
});

describe('lineTo', () => {
    it('is a function', () => {
        expect(lineTo).toEqual(expect.any(Function));
    });

    it.each([
        [0, 0, 'L 0 0'],
        [10, 20, 'L 10 20'],
        [-5, -6, 'L -5 -6']
    ])('renders the path command LineTo(x=%s, y=%s)', (x, y, expected) => {
        const v = new Vector2D(x, y);
        expect(lineTo(v)).toBe(expected);
    });
});

describe('arcTo', () => {
    it('is a function', () => {
        expect(arcTo).toEqual(expect.any(Function));
    });

    it.each([
        [0, void 0, void 0, void 0, 0, 0, 'A 0 0 0 0 0 0 0'],
        [20, 0, 0, 0, 34, 60, 'A 20 20 0 0 0 34 60'],
        [-10, 20, 0, 0, -5, -6, 'A -10 -10 20 0 0 -5 -6']
    ])('renders the path command ArcTo(r=%s, a=%s, l=%s, s=%s, x=%s, y=%s)', (r, a, l, s, x, y, expected) => {
        const v = new Vector2D(x, y);
        expect(arcTo(r, v, l, s, a)).toBe(expected);
    });
});
