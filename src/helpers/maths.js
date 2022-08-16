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
 * A right angle in degrees.
 * @type {number}
 */
export const RIGHT_ANGLE = 90;

/**
 * A straight angle in degrees.
 * @type {number}
 */
export const STRAIGHT_ANGLE = 180;

/**
 * Compute the cosine from an angle given in degrees.
 * @param {number} degree - The angle given in degrees.
 * @returns {number}
 */
export const cos = degree => Math.cos((degree * Math.PI) / STRAIGHT_ANGLE);

/**
 * Compute the sine from an angle given in degrees.
 * @param {number} degree - The angle given in degrees.
 * @returns {number}
 */
export const sin = degree => Math.sin((degree * Math.PI) / STRAIGHT_ANGLE);
