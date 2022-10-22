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

import adjust from '../adjust.js';

describe('adjust', () => {
    it('is a function', () => {
        expect(adjust).toEqual(expect.any(Function));
    });

    it.each([
        [1, 1],
        [-1, -1],
        [Math.PI, Math.PI],
        [-Math.PI, -Math.PI],
        [44.99999999999994, 45],
        [-44.99999999999994, -45]
    ])('adjusts the value %s', (value, expected) => {
        expect(adjust(value)).toBe(expected);
    });
});
