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

import { Polygon2D, SVGPath, Vector2D } from '../models';

/**
 * Builds the SVG path for rendering an arrow tip.
 * @param {number} x - The X-coordinate of the center of the arrow.
 * @param {number} y - The Y-coordinate of the center of the arrow.
 * @param {number} width - The width of the arrow.
 * @param {number} height - The height of the arrow.
 * @param {number} rotation - The rotation angle.
 * @returns {SVGPath} - Returns the path for the shape.
 */
export function arrowTipPath(x, y, width, height, rotation = 0) {
    const center = new Vector2D(x, y);
    const halfW = width / 2;
    const halfH = height / 2;

    return SVGPath.fromPolygon(
        new Polygon2D([
            new Vector2D(-halfW / 2, 0),
            new Vector2D(-halfW, -halfH),
            new Vector2D(halfW, 0),
            new Vector2D(-halfW, halfH)
        ])
            .rotate(rotation)
            .translate(center)
    );
}
