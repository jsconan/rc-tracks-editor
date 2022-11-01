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

import { adjust, between, increase } from '../values.js';

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

describe('between', () => {
    it('is a function', () => {
        expect(between).toEqual(expect.any(Function));
    });

    it.each([
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [-1, 0, 0, 0],
        [1, -1, 1, 1],
        [2, -1, 1, 1],
        [-2, -1, 1, -1]
    ])('adjusts the value %s to be between %s and %s', (value, min, max, expected) => {
        expect(between(value, min, max)).toBe(expected);
    });
});

describe('increase', () => {
    it('is a function', () => {
        expect(increase).toEqual(expect.any(Function));
    });

    it.each([
        [0, 0, 0, 0],
        [1, 10, 0, 11],
        [1, -10, 0, -9],
        [0, 1, 3, 1],
        [1, 1, 3, 2],
        [2, 1, 3, 0],
        [0, -1, 3, 2],
        [2, -1, 3, 1],
        [1, -1, 3, 0]
    ])('increase the value %s by %s having a limit of %s', (value, amount, limit, expected) => {
        expect(increase(value, amount, limit)).toBe(expected);
    });
});
