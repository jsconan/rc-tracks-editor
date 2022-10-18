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

import { barrierColor, groundColor } from '../colors.js';

const colorEven = {
    fill: 'var(--color-even)'
};
const colorOdd = {
    fill: 'var(--color-odd)'
};
const colorGround = {
    fill: 'var(--color-ground)',
    stroke: 'var(--color-separator)',
    strokeWidth: 1
};

describe('barrierColor', () => {
    it('is a function', () => {
        expect(barrierColor).toEqual(expect.any(Function));
    });

    it('alternates the colors with respect to the given index', () => {
        expect(barrierColor(0)).toStrictEqual(colorEven);
        expect(barrierColor(1)).toStrictEqual(colorOdd);
    });

    it('loop back to the beginning when the given index exceeds the length', () => {
        expect(barrierColor(2)).toStrictEqual(colorEven);
        expect(barrierColor(3)).toStrictEqual(colorOdd);
    });
});

describe('groundColor', () => {
    it('is a function', () => {
        expect(groundColor).toEqual(expect.any(Function));
    });

    it('returns with the color attributes for a tile ground', () => {
        expect(groundColor()).toStrictEqual(colorGround);
    });
});
