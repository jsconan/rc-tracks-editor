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

import { enlargeArc, getArcAngle } from '../helpers';
import { SVGPath, Vector2D } from '../models';

/**
 * Builds the SVG path for rendering a curved arrow.
 * @param {number} x - The X-coordinate of the center of the curve.
 * @param {number} y - The Y-coordinate of the center of the curve.
 * @param {number} width - The width of the arrow.
 * @param {number} height - The height of the arrow.
 * @param {number} radius - The radius of the curve.
 * @param {number} angle - Tha angle of the curve.
 * @param {number} thickness - The thickness of the arrow.
 * @param {boolean} clockwise - Is the arrow clockwise or counter-clockwise?
 * @param {number} rotation - The start angle of the curve.
 * @returns {SVGPath} - Returns the path for the shape.
 */
export function curvedArrowPath(
    x,
    y,
    width,
    height,
    radius,
    angle,
    thickness = void 0,
    clockwise = true,
    rotation = 0
) {
    if (!angle) {
        angle = getArcAngle(width, radius);
    }

    if ('number' !== typeof thickness) {
        thickness = height / 3;
    }

    const center = new Vector2D(x, y);
    const tipEdgeRadius = radius;
    const tipInnerRadius = tipEdgeRadius - height / 2;
    const tipOuterRadius = tipInnerRadius + height;
    const innerRadius = tipEdgeRadius - thickness / 2;
    const outerRadius = innerRadius + thickness;
    const bodyAngle = enlargeArc(angle, tipOuterRadius, -height);

    let bodyStart, bodyEnd, tipStart, tipEnd;

    if (clockwise) {
        bodyStart = rotation;
        bodyEnd = bodyStart + bodyAngle;
        tipStart = bodyEnd;
        tipEnd = bodyStart + angle;
    } else {
        bodyEnd = rotation + angle;
        bodyStart = bodyEnd - bodyAngle;
        tipEnd = rotation;
        tipStart = bodyStart;
    }

    const path = new SVGPath();

    if (clockwise) {
        return path
            .polarMoveTo(innerRadius, bodyStart, center)
            .arcCurveTo(innerRadius, -bodyAngle, Vector2D.polar(innerRadius, bodyEnd, center))
            .polarLineTo(tipInnerRadius, tipStart, center)
            .polarLineTo(tipEdgeRadius, tipEnd, center)
            .polarLineTo(tipOuterRadius, tipStart, center)
            .polarLineTo(outerRadius, bodyEnd, center)
            .arcCurveTo(outerRadius, bodyAngle, Vector2D.polar(outerRadius, bodyStart, center))
            .close();
    } else {
        return path
            .polarMoveTo(tipEdgeRadius, tipEnd, center)
            .polarLineTo(tipOuterRadius, tipStart, center)
            .polarLineTo(outerRadius, bodyStart, center)
            .arcCurveTo(outerRadius, -bodyAngle, Vector2D.polar(outerRadius, bodyEnd, center))
            .polarLineTo(innerRadius, bodyEnd, center)
            .arcCurveTo(innerRadius, bodyAngle, Vector2D.polar(innerRadius, bodyStart, center))
            .polarLineTo(tipInnerRadius, tipStart, center)
            .close();
    }
}
