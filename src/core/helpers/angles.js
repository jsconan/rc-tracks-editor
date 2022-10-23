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

import { adjust } from '../../core/helpers';

/**
 * A right angle in degrees.
 * @type {number}
 */
export const RIGHT_ANGLE = 90;

/**
 * A straight angle in degrees.
 * @type {number}
 */
export const STRAIGHT_ANGLE = 180;

/**
 * Degrees in a circle.
 * @type {number}
 */
export const CIRCLE = 360;

/**
 * The number of degrees per radian.
 * @type {number}
 */
export const DEGREES_PER_RADIANS = 180 / Math.PI;

/**
 * Converts an angle given in degrees to radians.
 * @param {number} angle - The angle given in degrees.
 * @returns {number} - The angle converted to radians.
 */
export const toRadians = angle => angle / DEGREES_PER_RADIANS;

/**
 * Converts an angle given in radians to degrees.
 * @param {number} angle - The angle given in radians.
 * @returns {number} - The angle converted to degrees.
 */
export const toDegrees = angle => angle * DEGREES_PER_RADIANS;

/**
 * Adjusts an angle given in degrees so that it remains within the domain.
 * @param {number} angle - The angle given in degrees.
 * @returns {number} - The angle adjusted in degrees.
 */
export const degrees = angle => ((angle % CIRCLE) + CIRCLE) % CIRCLE;

/**
 * Gets the quadrant in which the given angle is contained.
 * @param {number} angle - The angle given in degrees.
 * @returns {number} - The quadrant containing the given angle.
 */
export const quadrant = angle => Math.floor(degrees(angle) / RIGHT_ANGLE);

/**
 * The angle of the last quadrant.
 * @type {number}
 * @private
 */
const lastQuadrant = STRAIGHT_ANGLE + RIGHT_ANGLE;

/**
 * The a value added to an angle for getting the closest quadrant.
 * @type {number}
 * @private
 */
const shiftAngle = RIGHT_ANGLE / 2;

/**
 * Returns the angle of the closest quadrant with respect to an angle.
 * @param {number} angle - The angle from which get the quadrant angle.
 * @returns {number} - Returns the angle of the closest quadrant.
 */
export const quadrantAngle = angle => {
    const edge = quadrant(adjust(angle) + shiftAngle) * RIGHT_ANGLE;
    if (!edge && angle > lastQuadrant) {
        return CIRCLE;
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
