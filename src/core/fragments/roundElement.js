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

import { STRAIGHT_ANGLE } from '../helpers';
import { SVGPath, Vector2D } from '../models';

/**
 * Builds the SVG path for rendering a round element.
 * @param {number} x - The X-coordinate of the center of the element.
 * @param {number} y - The Y-coordinate of the center of the element.
 * @param {number} radius - The radius of the curve.
 * @param {number} addition - An additional distance added to the outline.
 * @returns {SVGPath} - Returns the path for the shape.
 */
export function roundElementPath(x, y, radius, addition = 0) {
    const actualRadius = radius + addition;
    const center = new Vector2D(x, y);
    const start = center.addScalarX(actualRadius);
    const end = center.subScalarX(actualRadius);

    return new SVGPath()
        .moveTo(start)
        .arcCurveTo(actualRadius, STRAIGHT_ANGLE, end)
        .arcCurveTo(actualRadius, STRAIGHT_ANGLE, start)
        .close();
}
