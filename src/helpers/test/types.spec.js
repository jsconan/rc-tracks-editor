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

import { defined } from '../types.js';

describe('defined', () => {
    it.each([void 0])('tells if a value is not defined (%s)', value => {
        expect(defined(value)).toBeFalsy();
    });

    it.each([0, null, {}, [], false])('tells if a value is defined (%s)', value => {
        expect(defined(value)).toBeTruthy();
    });
});
