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
 * Extracts coordinates from an object.
 * @param {*} coord - The object containing the coordinates.
 * @returns {coord} - The coordinates.
 */
export const getCoord = coord => {
    const { x, y } = coord;
    return { x, y };
};

/**
 * Extracts the coordinates of a rectangle from an object.
 * @param {*} coord - The object containing the coordinates.
 * @returns {rectangle} - The coordinates of a rectangle.
 */
export const getRect = coord => {
    const { x, y, width, height } = coord;
    return { x, y, width, height };
};

/**
 * @typedef {object} coord - Represents coordinates.
 * @property {number} x - The left coordinate.
 * @property {number} y - The top coordinate.
 */

/**
 * @typedef {object} rectangle - Represents the coordinates of a rectangle.
 * @property {number} x - The left coordinate of the rectangle.
 * @property {number} y - The top coordinate of the rectangle.
 * @property {number} width - The width of the rectangle.
 * @property {number} height - The height of the rectangle.
 */
