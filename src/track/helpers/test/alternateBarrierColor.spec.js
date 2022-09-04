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

import alternateBarrierColor from '../alternateBarrierColor.js';

describe('alternateBarrierColor', () => {
    it('is a function', () => {
        expect(alternateBarrierColor).toEqual(expect.any(Function));
    });

    it('alternates the colors with respect to the given index', () => {
        expect(alternateBarrierColor(0)).toBe('even');
        expect(alternateBarrierColor(1)).toBe('odd');
    });

    it('loop back to the beginning when the given index exceeds the length', () => {
        expect(alternateBarrierColor(2)).toBe('even');
        expect(alternateBarrierColor(3)).toBe('odd');
    });
});
