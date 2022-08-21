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

import { cos, sin } from './trigo.js';
import { getPoint } from './point.js';

/**
 * Rotates a point around the origin by the given angle.
 * @param {import('./point').point} point - The coordinates of the point.
 * @param {number} angle - The angle, given in degrees.
 * @returns {import('./point').point}
 */
export const rotate = (point, angle) => {
    const x = point.x * cos(angle) - point.y * sin(angle);
    const y = point.x * sin(angle) + point.y * cos(angle);

    return getPoint(x, y);
};

/**
 * Rotates a point around a given center by the given angle.
 * @param {import('./point').point} point - The coordinates of the point.
 * @param {number} angle - The angle, given in degrees.
 * @param {point} center - The coordinates of the center.
 * @returns {import('./point').point}
 */
export const rotateAround = (point, angle, center = { x: 0, y: 0 }) => {
    const x1 = point.x - center.x;
    const y1 = point.y - center.y;

    const x2 = x1 * cos(angle) - y1 * sin(angle);
    const y2 = x1 * sin(angle) + y1 * cos(angle);

    const x = x2 + center.x;
    const y = y2 + center.y;

    return getPoint(x, y);
};
