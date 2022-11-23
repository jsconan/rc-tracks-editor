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

import { enlargeArc, RIGHT_ANGLE } from '../helpers';
import { SVGPath, Vector2D } from '../models';

/**
 * Builds the SVG path for rendering a curve.
 * @param {number} x - The X-coordinate of the center of the curve.
 * @param {number} y - The Y-coordinate of the center of the curve.
 * @param {number} width - The width between the inner and the outer curve.
 * @param {number} radius - The radius of the inner curve.
 * @param {number} angle - Tha angle of the curve.
 * @param {number} rotation - The start angle of the curve.
 * @param {number} addition - An additional distance added to the outline.
 * @returns {SVGPath} - Returns the path for the shape.
 */
export function curvedElementPath(x, y, width, radius, angle, rotation = 0, addition = 0) {
    addition = Math.min(addition, radius);

    const center = new Vector2D(x, y);

    let innerRadius, innerAngle, innerCenter;

    if (angle === RIGHT_ANGLE) {
        innerRadius = radius;
        innerAngle = angle;
        innerCenter = center.subScalar(addition);
    } else {
        innerRadius = radius - addition;
        innerAngle = enlargeArc(angle, innerRadius, addition * 2);
        innerCenter = center;
    }

    const innerStart = rotation + (angle - innerAngle) / 2;
    const innerEnd = innerStart + innerAngle;

    const outerRadius = radius + width + addition;
    const outerAngle = enlargeArc(angle, outerRadius, addition * 2);
    const outerStart = rotation + (angle - outerAngle) / 2;
    const outerEnd = outerStart + outerAngle;
    const outerCenter = center;

    return new SVGPath()
        .polarMoveTo(innerRadius, innerStart, innerCenter)
        .arcCurveTo(innerRadius, -innerAngle, Vector2D.polar(innerRadius, innerEnd, innerCenter))
        .polarLineTo(outerRadius, outerEnd, outerCenter)
        .arcCurveTo(outerRadius, outerAngle, Vector2D.polar(outerRadius, outerStart, outerCenter))
        .close();
}
