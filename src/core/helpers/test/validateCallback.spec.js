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

import validateCallback from '../validateCallback.js';

describe('validateCallback', () => {
    it('is a function', () => {
        expect(validateCallback).toEqual(expect.any(Function));
    });

    it('validates a function', () => {
        expect(() => validateCallback(() => {})).not.toThrow();
        expect(() => validateCallback(function () {})).not.toThrow();
    });

    it.each([void 0, {}, [], true, 1])(
        'throws an error if the callback is not a function, example with "%s"',
        callback => {
            expect(() => validateCallback(callback)).toThrow('A callback function is expected!');
        }
    );

    it('can customize the error thrown if the callback is not a function', () => {
        expect(() => validateCallback({}, 'foo')).toThrow('A foo function is expected!');
    });
});
