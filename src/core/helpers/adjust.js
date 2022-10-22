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

/**
 * The smallest value allowed to differ from a rounded value.
 * @type {number}
 * @private
 */
const EPSILON = 0.0000000000001;

/**
 * Adjusts a number so that it would not differ less than EPSILON from its rounded value.
 * @param {number} number - The number to adjust.
 * @returns {number} - The adjusted number.
 */
export default number => {
    const rounded = Math.round(number);
    if (Math.abs(rounded - number) <= EPSILON) {
        return rounded;
    }
    return number;
};
