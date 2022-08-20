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

import { cos, sin } from './maths';
import { getPoint } from './point';

/**
 * Computes the X-coordinate of a polar point given a radius and an angle.
 * @param {number} radius - The radius.
 * @param {number} angle - The angle, given in degrees.
 * @returns {number}
 */
export const polarX = (radius, angle) => cos(angle) * radius;

/**
 * Computes the Y-coordinate of a polar point given a radius and an angle.
 * @param {number} radius - The radius.
 * @param {number} angle - The angle, given in degrees.
 * @returns {number}
 */
export const polarY = (radius, angle) => sin(angle) * radius;

/**
 * Computes the coordinates of a polar point given a radius and an angle.
 * @param {number} radius - The radius.
 * @param {number} angle - The angle, given in degrees.
 * @param {import("./point").point} center - The coordinates of the center.
 * @returns {import("./point").point}
 */
export const polar = (radius, angle, center = { x: 0, y: 0 }) => {
    const x = center.x + polarX(radius, angle);
    const y = center.y + polarY(radius, angle);

    return getPoint(x, y);
};
