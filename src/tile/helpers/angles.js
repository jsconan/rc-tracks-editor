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

import { Vector2D } from '../../core/models';

const lastQuadrant = Vector2D.STRAIGHT_ANGLE + Vector2D.RIGHT_ANGLE;
const shiftAngle = Vector2D.RIGHT_ANGLE / 2;

/**
 * Returns the angle of the closest quadrant with respect to an angle.
 * @param {number} angle - The angle from which get the quadrant angle.
 * @returns {number} - Returns the angle of the closest quadrant.
 */
export const quadrantAngle = angle => {
    const edge = Vector2D.quadrant(angle + shiftAngle) * Vector2D.RIGHT_ANGLE;
    if (!edge && angle > lastQuadrant) {
        return Vector2D.CIRCLE;
    }
    return edge;
};

/**
 * Returns the angle of the closest quadrant included in a range of angles.
 * The range is not expected to be higher than 90 degrees wide.
 * @param {number} start - The start angle of the range.
 * @param {number} end - The end angle of the range.
 * @returns {number} - The quadrant angle contained by the range. It may be null.
 */
export const quadrantRange = (start, end) => {
    const startQuadrant = quadrantAngle(start);
    const endQuadrant = quadrantAngle(end);

    if (start < startQuadrant && startQuadrant < end) {
        return startQuadrant;
    }

    if (start < endQuadrant && endQuadrant < end) {
        return endQuadrant;
    }

    return null;
};
