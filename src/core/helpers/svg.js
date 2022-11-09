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
 * Renders a path command for moving the current point at particular coordinates.
 * @param {Vector2D} v - The coordinates of the point.
 * @returns {string} - Returns the SVG path command MoveTo.
 */
export const moveTo = v => `M ${v.x} ${v.y}`;

/**
 * Renders a path command for drawing a line from the current point to particular coordinates.
 * @param {Vector2D} v - The coordinates of the ending point of the line.
 * @returns {string} - Returns the SVG path command LineTo.
 */
export const lineTo = v => `L ${v.x} ${v.y}`;

/**
 * Renders a path command for drawing an arc from the current point to particular coordinates.
 * @param {number} r - The radius of the arc.
 * @param {Vector2D} v - The coordinates of the ending point of the arc.
 * @param {number} l - A flag to set either the large arc (`1`) or the small arc (`0`).
 * @param {number} s - A flag to set either the  clockwise turning arc (`1`) or the counterclockwise turning arc (`0`).
 * @param {number} a - The rotation angle of the arc.
 * @returns {string} - Returns the SVG path command ArcTo.
 */
export const arcTo = (r, v, l = 0, s = 0, a = 0) => `A ${r} ${r} ${a} ${l} ${s} ${v.x} ${v.y}`;

/**
 * Renders path commands for drawing a polyline.
 * @param {Vector2D[]} points - The list of points defining the polyline.
 * @param {boolean} open - A flag to open the polyline using the MoveTo command instead of LineTo.
 * @param {boolean} close - A flag to close the polyline.
 * @returns {string} - Returns the SVG path.
 */
export const pathLine = (points, open = true, close = true) => {
    let path = '';

    if (!Array.isArray(points) || !points.length) {
        return path;
    }

    let i = 0;
    const len = points.length;
    if (open && len > 1) {
        path = moveTo(points[0]);
        i++;
    }

    while (i < len) {
        const point = points[i++];
        if (point) {
            path = `${path} ${lineTo(point)}`;
        }
    }

    if (close && len > 1) {
        path = `${path} Z`;
    }

    return path.trim();
};

/**
 * @typedef {import('../models').Vector2D} Vector2D
 */
