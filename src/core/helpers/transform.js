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
 * Rotate an element around the center.
 * By default, the center is at the origin of the coordinates system.
 * @param {number} angle - The rotation angle, in degrees.
 * @param {number} x - The X-coordinate of the center of rotation.
 * @param {number} y - The Y-coordinate of the center of rotation.
 * @returns {string} - Returns a rotation command.
 */
export const rotate = (angle = 0, x = 0, y = 0) => `rotate(${angle} ${x} ${y})`;
