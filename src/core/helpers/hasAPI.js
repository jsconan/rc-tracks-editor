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
 * Checks if an object implements a list of functions.
 * @param {*} obj - The object to check.
 * @param {Array} api - The list of functions to check.
 * @return {boolean} - Returns `true` if the given object implements the expected API.
 */
export default (obj, api) =>
    'object' === typeof obj && Array.from(api || []).every(method => 'function' === typeof obj[method]);
