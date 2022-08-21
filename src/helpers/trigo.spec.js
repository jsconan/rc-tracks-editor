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

import { cos, deg2rad, rad2deg, sin } from './trigo.js';

describe('deg2rad', () => {
    it('is a function', () => {
        expect(deg2rad).toEqual(expect.any(Function));
    });

    it('converts degrees to radians', () => {
        expect(deg2rad(90)).toBe(Math.PI / 2);
        expect(deg2rad(180)).toBe(Math.PI);
        expect(deg2rad(270)).toBe((Math.PI / 2) * 3);
        expect(deg2rad(360)).toBe(Math.PI * 2);
    });
});

describe('rag2deg', () => {
    it('is a function', () => {
        expect(rad2deg).toEqual(expect.any(Function));
    });

    it('converts radians to degrees', () => {
        expect(rad2deg(Math.PI / 2)).toBe(90);
        expect(rad2deg(Math.PI)).toBe(180);
        expect(rad2deg((Math.PI / 2) * 3)).toBe(270);
        expect(rad2deg(Math.PI * 2)).toBe(360);
    });
});

describe('cos', () => {
    it('is a function', () => {
        expect(cos).toEqual(expect.any(Function));
    });

    it('computes the cosine from an angle given in degrees', () => {
        expect(cos(90)).toBeCloseTo(0, 5);
    });
});

describe('sin', () => {
    it('is a function', () => {
        expect(sin).toEqual(expect.any(Function));
    });

    it('computes the sine from an angle given in degrees', () => {
        expect(sin(90)).toBe(1);
    });
});
