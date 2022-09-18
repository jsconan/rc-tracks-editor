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

import { rotate } from '../transform.js';

describe('rotate', () => {
    it('is a function', () => {
        expect(rotate).toEqual(expect.any(Function));
    });

    it.each([
        [void 0, void 0, void 0, 'rotate(0 0 0)'],
        [10, 20, 30, 'rotate(10 20 30)'],
        [-10, -20, -30, 'rotate(-10 -20 -30)']
    ])('renders the transform command rotate(%s %s %s)', (angle, x, y, expected) => {
        expect(rotate(angle, x, y)).toBe(expected);
    });
});
