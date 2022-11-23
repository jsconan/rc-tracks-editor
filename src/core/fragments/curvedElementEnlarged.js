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

import { SVGPath, Vector2D } from '../models';

/**
 * Builds the SVG path for rendering an enlarged curve.
 * @param {number} x - The X-coordinate of the center of the curve.
 * @param {number} y - The Y-coordinate of the center of the curve.
 * @param {number} width - The width between the inner and the outer curve.
 * @param {number} radius - The radius of the inner curve.
 * @param {number} side - Tha length of the curve side.
 * @param {number} addition - An additional distance added to the outline.
 * @returns {SVGPath} - Returns the path for the shape.
 */
export function curvedElementEnlargedPath(x, y, width, radius, side, addition = 0) {
    addition = Math.min(addition, radius);

    const outerRadius = radius + width - side + addition;
    const center = new Vector2D(x, y).subScalar(addition);

    return new SVGPath()
        .moveTo(center.addScalarX(radius))
        .ellipticalArcCurveTo(radius, 0, 0, 1, center.addScalarY(radius))
        .verticalLineBy(width + addition * 2)
        .horizontalLineBy(side + addition)
        .ellipticalArcCurveBy(outerRadius, 0, 0, 0, new Vector2D(outerRadius, -outerRadius))
        .verticalLineBy(-side - addition)
        .close();
}
