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

import { Vector2D } from '../../models';
import { arcTo, lineTo, moveTo, pathLine } from '../svg.js';

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

describe('pathLine', () => {
    it('is a function', () => {
        expect(pathLine).toEqual(expect.any(Function));
    });

    it('builds a path line from a list of points', () => {
        const points0 = [];
        const points1 = [new Vector2D(10, 10)];
        const points2 = [new Vector2D(10, 10), new Vector2D(20, 10)];
        const points3 = [new Vector2D(10, 10), new Vector2D(20, 10), new Vector2D(10, 20)];
        const points4 = [new Vector2D(10, 10), void 0, new Vector2D(20, 10), null, new Vector2D(10, 20)];

        expect(pathLine(points0)).toBe('');
        expect(pathLine(points0, false)).toBe('');
        expect(pathLine(points0, false, false)).toBe('');

        expect(pathLine(points1)).toBe('L 10 10');
        expect(pathLine(points1, false)).toBe('L 10 10');
        expect(pathLine(points1, false, false)).toBe('L 10 10');

        expect(pathLine(points2)).toBe('M 10 10 L 20 10 Z');
        expect(pathLine(points2, false)).toBe('L 10 10 L 20 10 Z');
        expect(pathLine(points2, false, false)).toBe('L 10 10 L 20 10');

        expect(pathLine(points3)).toBe('M 10 10 L 20 10 L 10 20 Z');
        expect(pathLine(points3, true, true)).toBe('M 10 10 L 20 10 L 10 20 Z');
        expect(pathLine(points3, false, true)).toBe('L 10 10 L 20 10 L 10 20 Z');
        expect(pathLine(points3, true, false)).toBe('M 10 10 L 20 10 L 10 20');
        expect(pathLine(points3, false, false)).toBe('L 10 10 L 20 10 L 10 20');

        expect(pathLine(points4)).toBe('M 10 10 L 20 10 L 10 20 Z');
        expect(pathLine(points4, true, true)).toBe('M 10 10 L 20 10 L 10 20 Z');
        expect(pathLine(points4, false, true)).toBe('L 10 10 L 20 10 L 10 20 Z');
        expect(pathLine(points4, true, false)).toBe('M 10 10 L 20 10 L 10 20');
        expect(pathLine(points4, false, false)).toBe('L 10 10 L 20 10 L 10 20');
    });
});
