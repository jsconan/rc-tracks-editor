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

import validateCallback from './validateCallback.js';

/**
 * @type {RegExp} - A words separator.
 * @private
 */
const separator = /\s+/;

/**
 * Split a list of words into an array, and walks over each.
 * The list can be given either as an array or as a string containing words separated by a space.
 * @function eachWord
 * @param {string|string[]} list - The list of words. It can be an array, or it can be a string with words separated by a space.
 * @param {function} walker - A callback applied to each word.
 * @returns {string[]} - Returns the list of words in an array.
 * @throws {TypeError} - If the given callback is not a function.
 */
export default (list, walker) => {
    if (!list) {
        return [];
    }

    if ('string' === typeof list) {
        list = list.trim().split(separator);
    }

    if (walker) {
        validateCallback(walker);
        Array.from(list).forEach(walker);
    }

    return list;
};
