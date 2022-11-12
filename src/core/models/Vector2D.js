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

import { toDegrees, toRadians } from '../helpers';

/**
 * Represents a 2D vector.
 */
export class Vector2D {
    /**
     * Builds a vector from the given cartesian coordinates.
     * @param {number} x - The X-coordinate of the vector.
     * @param {number} y - The Y-coordinate of the vector.
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Sets the coordinates from another vector.
     * @param {Vector2D} vector - The other vector from which set the coordinates.
     * @returns {Vector2D} - Chains the instance.
     */
    set(vector) {
        this.x = vector.x;
        this.y = vector.y;

        return this;
    }

    /**
     * Sets the X-coordinate from another vector.
     * @param {Vector2D} vector - The other vector from which set the X-coordinate.
     * @returns {Vector2D} - Chains the instance.
     */
    setX(vector) {
        this.x = vector.x;

        return this;
    }

    /**
     * Sets the Y-coordinate from another vector.
     * @param {Vector2D} vector - The other vector from which set the Y-coordinate.
     * @returns {Vector2D} - Chains the instance.
     */
    setY(vector) {
        this.y = vector.y;

        return this;
    }

    /**
     * Sets the coordinates of the vector.
     * @param {number} x - The X-coordinate of the vector.
     * @param {number} y - The Y-coordinate of the vector.
     * @returns {Vector2D} - Chains the instance.
     */
    setCoord(x, y) {
        this.x = x;
        this.y = y;

        return this;
    }

    /**
     * Sets the coordinates of the vector from a scalar value.
     * @param {number} scalar - The scalar value to set as coordinates of the vector.
     * @returns {Vector2D} - Chains the instance.
     */
    setScalar(scalar) {
        this.x = scalar;
        this.y = scalar;

        return this;
    }

    /**
     * Sets the X-coordinate of the vector from a scalar value.
     * @param {number} scalar - The scalar value to set as the X-coordinate of the vector.
     * @returns {Vector2D} - Chains the instance.
     */
    setScalarX(scalar) {
        this.x = scalar;

        return this;
    }

    /**
     * Sets the Y-coordinate of the vector from a scalar value.
     * @param {number} scalar -  The scalar value to set as the Y-coordinate of the vector.
     * @returns {Vector2D} - Chains the instance.
     */
    setScalarY(scalar) {
        this.y = scalar;

        return this;
    }

    /**
     * Creates a copy of the vector.
     * @returns {Vector2D} - A new vector at the same coordinates.
     */
    clone() {
        return new Vector2D(this.x, this.y);
    }

    /**
     * Creates a copy of the vector with thw same X-coordinate.
     * @returns {Vector2D} - A new vector at the same X-coordinates.
     */
    cloneX() {
        return new Vector2D(this.x, 0);
    }

    /**
     * Creates a copy of the vector with thw same Y-coordinate.
     * @returns {Vector2D} - A new vector at the same Y-coordinates.
     */
    cloneY() {
        return new Vector2D(0, this.y);
    }

    /**
     * Creates a new vector having the coordinates of the given vector.
     * @param {Vector2D} vector - The target vector to copy the coordinates from.
     * @returns {Vector2D} - A new vector with the copied coordinates.
     */
    copy(vector) {
        return new Vector2D(vector.x, vector.y);
    }

    /**
     * Creates a new vector having the X-coordinate of the given vector and the Y-coordinate of the current vector.
     * @param {Vector2D} vector - The target vector to copy the coordinates from.
     * @returns {Vector2D} - A new vector with the copied coordinates.
     */
    copyX(vector) {
        return new Vector2D(vector.x, this.y);
    }

    /**
     * Creates a new vector having the X-coordinate of the current vector and the Y-coordinate of the given vector.
     * @param {Vector2D} vector - The target vector to copy the coordinates from.
     * @returns {Vector2D} - A new vector with the copied coordinates.
     */
    copyY(vector) {
        return new Vector2D(this.x, vector.y);
    }

    /**
     * Creates a new vector having the given coordinates.
     * @param {number} x - The X-coordinate of the vector.
     * @param {number} y - The Y-coordinate of the vector.
     * @returns {Vector2D} - A new vector with the copied coordinates.
     */
    copyCoord(x, y) {
        return new Vector2D(x, y);
    }

    /**
     * Creates a new vector having the coordinates set from the given scalar value.
     * @param {number} scalar - The scalar value to set as coordinates of the vector.
     * @returns {Vector2D} - A new vector with the copied coordinates.
     */
    copyScalar(scalar) {
        return new Vector2D(scalar, scalar);
    }

    /**
     * Creates a new vector having the X-coordinate set from the given scalar value and the Y-coordinate of the current vector.
     * @param {number} scalar - The scalar value to set as the X-coordinate of the vector.
     * @returns {Vector2D} - A new vector with the copied coordinates.
     */
    copyScalarX(scalar) {
        return new Vector2D(scalar, this.y);
    }

    /**
     * Creates a new vector having the the X-coordinate of the current vector and the Y-coordinate set from the given scalar value.
     * @param {number} scalar - The scalar value to set as the Y-coordinate of the vector.
     * @returns {Vector2D} - A new vector with the copied coordinates.
     */
    copyScalarY(scalar) {
        return new Vector2D(this.x, scalar);
    }

    /**
     * Adds the coordinates of another vector.
     * @param {Vector2D} vector - The other vector to add.
     * @returns {Vector2D} - A new vector resulting of the addition.
     */
    add(vector) {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    /**
     * Adds the X-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to add.
     * @returns {Vector2D} - A new vector resulting of the addition.
     */
    addX(vector) {
        return new Vector2D(this.x + vector.x, this.y);
    }

    /**
     * Adds the Y-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to add.
     * @returns {Vector2D} - A new vector resulting of the addition.
     */
    addY(vector) {
        return new Vector2D(this.x, this.y + vector.y);
    }

    /**
     * Adds the given coordinates.
     * @param {number} x - The X-coordinate to add.
     * @param {number} y - The Y-coordinate to add.
     * @returns {Vector2D} - A new vector resulting of the addition.
     */
    addCoord(x, y) {
        return new Vector2D(this.x + x, this.y + y);
    }

    /**
     * Adds a scalar value to the coordinates.
     * @param {number} scalar - The scalar value to add.
     * @returns {Vector2D} - A new vector resulting of the addition.
     */
    addScalar(scalar) {
        return new Vector2D(this.x + scalar, this.y + scalar);
    }

    /**
     * Adds a scalar value to the X-coordinate.
     * @param {number} scalar - The scalar value to add.
     * @returns {Vector2D} - A new vector resulting of the addition.
     */
    addScalarX(scalar) {
        return new Vector2D(this.x + scalar, this.y);
    }

    /**
     * Adds a scalar value to the Y-coordinate.
     * @param {number} scalar - The scalar value to add.
     * @returns {Vector2D} - A new vector resulting of the addition.
     */
    addScalarY(scalar) {
        return new Vector2D(this.x, this.y + scalar);
    }

    /**
     * Subtracts the coordinates of another vector.
     * @param {Vector2D} vector - The other vector to subtract.
     * @returns {Vector2D} - A new vector resulting of the subtraction.
     */
    sub(vector) {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }

    /**
     * Subtracts the X-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to subtract.
     * @returns {Vector2D} - A new vector resulting of the subtraction.
     */
    subX(vector) {
        return new Vector2D(this.x - vector.x, this.y);
    }

    /**
     * Subtracts the Y-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to subtract.
     * @returns {Vector2D} - A new vector resulting of the subtraction.
     */
    subY(vector) {
        return new Vector2D(this.x, this.y - vector.y);
    }

    /**
     * Subtracts the given coordinates.
     * @param {number} x - The X-coordinate to subtract.
     * @param {number} y - The Y-coordinate to subtract.
     * @returns {Vector2D} - A new vector resulting of the subtraction.
     */
    subCoord(x, y) {
        return new Vector2D(this.x - x, this.y - y);
    }

    /**
     * Subtracts a scalar value from the coordinates.
     * @param {number} scalar - The scalar value to subtract.
     * @returns {Vector2D} - A new vector resulting of the subtraction.
     */
    subScalar(scalar) {
        return new Vector2D(this.x - scalar, this.y - scalar);
    }

    /**
     * Subtracts a scalar value from the X-coordinate.
     * @param {number} scalar - The scalar value to subtract.
     * @returns {Vector2D} - A new vector resulting of the subtraction.
     */
    subScalarX(scalar) {
        return new Vector2D(this.x - scalar, this.y);
    }

    /**
     * Subtracts a scalar value from the Y-coordinate.
     * @param {number} scalar - The scalar value to subtract.
     * @returns {Vector2D} - A new vector resulting of the subtraction.
     */
    subScalarY(scalar) {
        return new Vector2D(this.x, this.y - scalar);
    }

    /**
     * Multiplies by the coordinates of another vector.
     * @param {Vector2D} vector - The other vector to multiply by.
     * @returns {Vector2D} - A new vector resulting of the multiplication.
     */
    mul(vector) {
        return new Vector2D(this.x * vector.x, this.y * vector.y);
    }

    /**
     * Multiplies by the X-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to multiply by.
     * @returns {Vector2D} - A new vector resulting of the multiplication.
     */
    mulX(vector) {
        return new Vector2D(this.x * vector.x, this.y);
    }

    /**
     * Multiplies by the Y-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to multiply by.
     * @returns {Vector2D} - A new vector resulting of the multiplication.
     */
    mulY(vector) {
        return new Vector2D(this.x, this.y * vector.y);
    }

    /**
     * Multiplies the given coordinates.
     * @param {number} x - The X-coordinate to multiply by.
     * @param {number} y - The Y-coordinate to multiply by.
     * @returns {Vector2D} - A new vector resulting of the multiplication.
     */
    mulCoord(x, y) {
        return new Vector2D(this.x * x, this.y * y);
    }

    /**
     * Multiplies the coordinates by a scalar value.
     * @param {number} scalar - The scalar value to multiply by.
     * @returns {Vector2D} - A new vector resulting of the multiplication.
     */
    mulScalar(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    /**
     * Multiplies the X-coordinate by a scalar value.
     * @param {number} scalar - The scalar value to multiply by.
     * @returns {Vector2D} - A new vector resulting of the multiplication.
     */
    mulScalarX(scalar) {
        return new Vector2D(this.x * scalar, this.y);
    }

    /**
     * Multiplies the Y-coordinate by a scalar value.
     * @param {number} scalar - The scalar value to multiply by.
     * @returns {Vector2D} - A new vector resulting of the multiplication.
     */
    mulScalarY(scalar) {
        return new Vector2D(this.x, this.y * scalar);
    }

    /**
     * Divides by the coordinates of another vector.
     * @param {Vector2D} vector - The other vector to divide by.
     * @returns {Vector2D} - A new vector resulting of the division.
     */
    div(vector) {
        return new Vector2D(this.x / vector.x, this.y / vector.y);
    }

    /**
     * Divides by the X-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to divide by.
     * @returns {Vector2D} - A new vector resulting of the division.
     */
    divX(vector) {
        return new Vector2D(this.x / vector.x, this.y);
    }

    /**
     * Divides by the Y-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to divide by.
     * @returns {Vector2D} - A new vector resulting of the division.
     */
    divY(vector) {
        return new Vector2D(this.x, this.y / vector.y);
    }

    /**
     * Divides the given coordinates.
     * @param {number} x - The X-coordinate to divide by.
     * @param {number} y - The Y-coordinate to divide by.
     * @returns {Vector2D} - A new vector resulting of the division.
     */
    divCoord(x, y) {
        return new Vector2D(this.x / x, this.y / y);
    }

    /**
     * Divides the coordinates by a scalar value.
     * @param {number} scalar - The scalar value to divide by.
     * @returns {Vector2D} - A new vector resulting of the division.
     */
    divScalar(scalar) {
        return new Vector2D(this.x / scalar, this.y / scalar);
    }

    /**
     * Divides the X-coordinate by a scalar value.
     * @param {number} scalar - The scalar value to divide by.
     * @returns {Vector2D} - A new vector resulting of the division.
     */
    divScalarX(scalar) {
        return new Vector2D(this.x / scalar, this.y);
    }

    /**
     * Divides the Y-coordinate by a scalar value.
     * @param {number} scalar - The scalar value to divide by.
     * @returns {Vector2D} - A new vector resulting of the division.
     */
    divScalarY(scalar) {
        return new Vector2D(this.x, this.y / scalar);
    }

    /**
     * Negates the coordinates.
     * @returns {Vector2D} - A new vector with negated coordinates.
     */
    negate() {
        return new Vector2D(-this.x, -this.y);
    }

    /**
     * Creates an orthogonal vector of the current vector.
     * @returns {Vector2D} - A new vector perpendicular to the source one.
     */
    ortho() {
        return new Vector2D(this.y, -this.x);
    }

    /**
     * Rounds the coordinates.
     * @returns {Vector2D} - A new vector with rounded coordinates.
     */
    round() {
        return new Vector2D(Math.round(this.x), Math.round(this.y));
    }

    /**
     * Computes the length of the vector.
     * @returns {number} - The length of the vector.
     */
    length() {
        return Math.hypot(this.x, this.y);
    }

    /**
     * Normalizes the vector, so that its length is 1.
     * If the vector is null, it will be normalized to [1, 0].
     * @returns {Vector2D} - The normalized vector.
     */
    normalize() {
        const l = this.length();

        if (l) {
            return this.divScalar(l);
        }

        return new Vector2D(1, 0);
    }

    /**
     * Changes the length of the vector.
     * @param {number} length - The new length for the vector.
     * @returns {Vector2D} - The extended vector.
     */
    extend(length) {
        return this.normalize().mulScalar(length);
    }

    /**
     * Computes the dot product with another vector.
     * @param {Vector2D} vector - The other vector for the dot product.
     * @returns {number} - The result of the dot product.
     */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    /**
     * Computes the cross product with another vector.
     * @param {Vector2D} vector - The other vector for the cross product.
     * @returns {number} - The result of the cross product.
     */
    cross(vector) {
        return this.x * vector.y - this.y * vector.x;
    }

    /**
     * Computes the euclidean distance to another vector.
     * @param {Vector2D} vector - The other vector for the distance.
     * @returns {number} - The distance between the 2 vectors.
     */
    distance(vector) {
        const dx = this.x - vector.x;
        const dy = this.y - vector.y;

        return Math.hypot(dx, dy);
    }

    /**
     * Computes the angle of the vector toward the X-axis.
     * @returns {number} - The angle of the vector, in degrees.
     */
    angle() {
        return toDegrees(Math.atan2(this.y, this.x));
    }

    /**
     * Computes the angle between the vector and another vector.
     * @param {Vector2D} vector - The other vector to compute the angle.
     * @returns {number} - The angle between the 2 vectors, in degrees.
     */
    angleWith(vector) {
        return toDegrees(Math.atan2(this.x * vector.y - this.y * vector.x, this.x * vector.x + this.y * vector.y));
    }

    /**
     * Projects the vector on another vector.
     * @param {Vector2D} vector - The other vector to project on.
     * @returns {Vector2D} - A new vector resulting of the projection.
     */
    projectOn(vector) {
        const normalized = vector.normalize();
        return normalized.mulScalar(this.dot(normalized));
    }

    /**
     * Rotates the vector around the origin by the given angle.
     * @param {number} angle - The rotation angle, given in degrees.
     * @returns {Vector2D} - A new vector rotated by the given angle.
     */
    rotate(angle) {
        const rad = toRadians(angle);
        const x = this.x * Math.cos(rad) - this.y * Math.sin(rad);
        const y = this.x * Math.sin(rad) + this.y * Math.cos(rad);

        return new Vector2D(x, y);
    }

    /**
     * Rotates the vector around the origin to the given angle.
     * @param {number} angle - The target angle, given in degrees.
     * @returns {Vector2D} - A new vector rotated to the given angle.
     */
    rotateTo(angle) {
        return this.rotate(angle - this.angle());
    }

    /**
     * Rotates the vector around the given center by the given angle.
     * @param {number} angle - The rotation angle, given in degrees.
     * * @param {Vector2D} center - The coordinates of the center.
     * @returns {Vector2D} - A new vector rotated by the given angle.
     */
    rotateAround(angle, center) {
        return this.sub(center).rotate(angle).add(center);
    }

    /**
     * Rotates the vector around the given center to the given angle.
     * @param {number} angle - The target angle, given in degrees.
     * * @param {Vector2D} center - The coordinates of the center.
     * @returns {Vector2D} - A new vector rotated to the given angle.
     */
    rotateAroundTo(angle, center) {
        const v = this.sub(center);
        return v.rotate(angle - v.angle()).add(center);
    }

    /**
     * Checks whether or nor the vector equals another.
     * @param {Vector2D} vector
     * @returns {boolean} - `true` if the vectors are equal.
     */
    equals(vector) {
        return this.x === vector.x && this.y === vector.y;
    }

    /**
     * Converts the vector to a string.
     * @returns {string} - The string representation of the vector.
     */
    toString() {
        return `${this.x},${this.y}`;
    }

    /**
     * Converts the vector to an array.
     * @returns {Array} - The array representation of the vector.
     */
    toArray() {
        return [this.x, this.y];
    }

    /**
     * Converts the vector to an object.
     * @returns {coord} - The object representation of the vector.
     */
    toObject() {
        return { x: this.x, y: this.y };
    }

    /**
     * Validates that the given object is an instance of the class.
     * Otherwise, an error is thrown.
     * @param {object} object - The instance to validate.
     * @throws {TypeError} - If the given object is not a valid instance.
     */
    static validateInstance(object) {
        if (!(object instanceof this)) {
            throw new TypeError(`The object must be an instance of ${this.name}!`);
        }
    }

    /**
     * Creates a vector from the given cartesian coordinates.
     * @param {number} x - The X-coordinate of the vector.
     * @param {number} y - The Y-coordinate of the vector.
     * @returns {Vector2D} - A new vector with the given coordinates.
     */
    static vector(x = 0, y = 0) {
        return new Vector2D(x, y);
    }

    /**
     * Creates a vector from the given polar coordinates.
     * @param {number|Vector2D} radius - The radius coordinate.
     * Elliptic polar coordinates can be given through a vector.
     * @param {number} angle - The angle coordinate, given in degrees.
     * @param {Vector2D} center - The coordinates of the center.
     * @returns {Vector2D} - A new vector with the given coordinates.
     */
    static polar(radius = 0, angle = 0, center = Vector2D.ORIGIN) {
        let rx, ry;
        if (radius instanceof Vector2D) {
            rx = radius.x;
            ry = radius.y;
        } else {
            rx = radius;
            ry = radius;
        }

        const rad = toRadians(angle);
        const x = center.x + Math.cos(rad) * rx;
        const y = center.y + Math.sin(rad) * ry;

        return new Vector2D(x, y);
    }

    /**
     * Creates a vector from the cartesian coordinates given as an array.
     * @param {number[]} coord - The cartesian coordinates of the form [x, y].
     * @returns {Vector2D} - A new vector with the given coordinates.
     */
    static fromArray(coord = []) {
        return new Vector2D(coord[0], coord[1]);
    }

    /**
     * Creates a vector from the cartesian coordinates given as an object.
     * @param {coord} coord - The cartesian coordinates of the form {x, y}.
     * @returns {Vector2D} - A new vector with the given coordinates.
     */
    static fromObject(coord = { x: 0, y: 0 }) {
        return new Vector2D(coord.x, coord.y);
    }

    /**
     * Computes the point at the intersection of two lines.
     * Each line is defined by two points.
     * If the lines cannot intersect (i.e. are parallel), it returns `null`.
     *
     * @param {Vector2D} a1 - A first point on the first line.
     * @param {Vector2D} b1 - A second point on the first line.
     * @param {Vector2D} a2 - A first point on the second line.
     * @param {Vector2D} b2 - A second point on the second line.
     * @returns {Vector2D} - The point at the intersection, or null if there is none.
     */
    static intersect(a1, b1, a2, b2) {
        const i = b1.sub(a1);
        const j = b2.sub(a2);
        const n = i.cross(j);

        if (n) {
            const k = -(a1.x * j.y - a2.x * j.y - j.x * a1.y + j.x * a2.y) / n;
            return new Vector2D(a1.x + k * i.x, a1.y + k * i.y);
        }

        return null;
    }
}

/**
 * Represents the origin of cartesian coordinates as a vector.
 * @constant {Vector2D} Vector2D.ORIGIN
 */
Object.defineProperty(Vector2D, 'ORIGIN', {
    value: Object.freeze(new Vector2D()),
    writable: false,
    enumerable: true,
    configurable: true
});

/**
 * @typedef {import('../helpers/coord.js').coord} coord - Represents coordinates.
 */
