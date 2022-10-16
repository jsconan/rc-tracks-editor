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

import validateAPI from '../validateAPI.js';

describe('validateAPI', () => {
    it('is a function', () => {
        expect(validateAPI).toEqual(expect.any(Function));
    });

    it('validates an object implements an API', () => {
        expect(() => validateAPI({})).not.toThrow();
        expect(() => validateAPI({}, [])).not.toThrow();
        expect(() => validateAPI({ set() {} }, ['set'])).not.toThrow();
    });

    it('throws an error if the object does not implement all the functions', () => {
        expect(() => validateAPI({}, ['set'])).toThrow('The object must implement the function: set');
        expect(() => validateAPI({ get() {} }, ['set'])).toThrow('The object must implement the function: set');
        expect(() => validateAPI({ set() {} }, ['set', 'get'])).toThrow(
            'The object must implement the functions: set, get'
        );
    });
});
