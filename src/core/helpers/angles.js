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
export const DEGREES_PER_RADIANS = STRAIGHT_ANGLE / Math.PI;

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
 * Adjusts an angle given in degrees so that it remains within the domain [0..360[.
 * @param {number} angle - The angle given in degrees.
 * @returns {number} - The angle adjusted in degrees.
 */
export const absDegrees = angle => ((angle % CIRCLE) + CIRCLE) % CIRCLE;

/**
 * Adjusts an angle given in degrees so that it remains within the domain [-360..360].
 * @param {number} angle - The angle given in degrees.
 * @returns {number} - The angle adjusted in degrees.
 */
export const degrees = angle => {
    if (Math.abs(angle) <= CIRCLE) {
        return angle;
    }

    return angle % CIRCLE;
};

/**
 * Gets the quadrant in which the given angle is contained.
 * @param {number} angle - The angle given in degrees.
 * @returns {number} - The quadrant containing the given angle.
 */
export const quadrant = angle => Math.floor(absDegrees(angle) / RIGHT_ANGLE);

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

/**
 * Gets the circumference of a circle given the radius.
 * @param {number} radius - The radius of the circle.
 * @returns {number} - The circumference
 */
export const circumference = radius => Math.PI * radius * 2;

/**
 * Gets the width of an arc given the radius and the angle.
 * @param {number} angle - The angle of the arc, given in degrees
 * @param {number} radius - The radius of the circle.
 * @returns {number} - The width of the arc.
 */
export const getArcWidth = (angle, radius) => Math.abs((circumference(radius) * degrees(angle)) / CIRCLE);

/**
 * Gets the angle of an arc given the radius and the width.
 * @param {number} width - The width of the arc.
 * @param {number} radius - The radius of the circle.
 * @returns {number} - The angle of the arc, given in degrees
 */
export const getArcAngle = (width, radius) => {
    if (!radius) {
        return 0;
    }

    const circum = circumference(radius);

    if (Math.abs(width) >= circum) {
        return CIRCLE;
    }

    return (width * CIRCLE) / circum;
};

/**
 * Gets the width of a chord given the radius and the angle.
 * @param {number} angle - The angle of the chord, given in degrees.
 * @param {number} radius - The radius of the circle.
 * @returns {number} - The width of the chord.
 */
export const getChordWidth = (angle, radius) => Math.abs(radius * 2 * Math.sin(toRadians(degrees(angle) / 2)));

/**
 * Gets the distance to a chord given the radius and the angle.
 *
 * @param {number} angle - The angle of the chord, given in degrees.
 * @param {number} radius - The radius of the circle.
 * @returns {number} - The distance to the chord.
 */
export const getChordDistance = (angle, radius) => radius * Math.cos(toRadians(degrees(angle) / 2));

/**
 * Gets the height of a chord given the radius and the angle.
 *
 * @param {number} angle - The angle of the chord, given in degrees.
 * @param {number} radius - The radius of the circle.
 * @returns {number} - The height of the chord.
 */
export const getChordHeight = (angle, radius) => radius - getChordDistance(angle, radius);

/**
 * Gets the angle of a chord given the radius and the width.
 *
 * @param {number} width - The width of the chord.
 * @param {number} radius - The radius of the circle.
 * @returns {number} - The angle of the chord, given in degrees
 */
export const getChordAngle = (width, radius) => {
    if (!radius) {
        return 0;
    }

    const diameter = radius * 2;

    if (Math.abs(width) >= diameter) {
        return STRAIGHT_ANGLE;
    }

    return toDegrees(Math.asin(width / diameter) * 2);
};

/**
 * Adds a length to an arc represented by an angle and a radius.
 * @param {number} angle - The angle of the arc, given in degrees.
 * @param {number} radius - The radius of the arc.
 * @param {number} addition - The length to add to the arc.
 * @returns {number} - The adjusted angle of the arc
 */
export const enlargeArc = (angle, radius, addition) => {
    if (!addition) {
        return degrees(angle);
    }

    const circum = circumference(radius);
    const length = Math.abs((circum * degrees(angle)) / CIRCLE) + addition;

    if (length <= 0) {
        return 0;
    }

    if (length >= circum) {
        return CIRCLE;
    }

    return (length * CIRCLE) / circum;
};

/**
 * Adds a length to a chord represented by an angle and a radius.
 * @param {number} angle - The angle of the arc, given in degrees.
 * @param {number} radius - The radius of the arc.
 * @param {number} addition - The length to add to the arc.
 * @returns {number} - The adjusted angle of the arc
 */
export const enlargeChord = (angle, radius, addition) => {
    if (!addition) {
        return degrees(angle);
    }

    if (addition <= -radius) {
        return 0;
    }

    if (addition >= radius) {
        return STRAIGHT_ANGLE;
    }

    const width = getChordWidth(angle, radius);
    return getChordAngle(width + addition, radius);
};
