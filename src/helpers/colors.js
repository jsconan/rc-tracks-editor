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
 * A list of colors for the barriers.
 * @type {string[]}
 */
const barrierColors = ['even', 'odd'];

/**
 * Returns the element at the given position.
 * A modulo is applied to the position so that it cannot be outside of the given array.
 * @param {number} i - The position in the given list.
 * @param {array} list - A list from which get an element at the given position.
 * @returns {*} - The element at the given position.
 */
export const alternate = (i, list) => list[i % list.length];

/**
 * Returns the color for a barrier element at the given position.
 * @param {number} i - The position of the barrier element.
 * @returns {string} - The color for the barrier element.
 */
export const alternateBarrierColor = i => alternate(i, barrierColors);
