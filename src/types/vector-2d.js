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
     * Creates a copy of the current vector.
     * @returns {Vector2D} - A new vector at the same coordinates.
     */
    clone() {
        return new Vector2D(this.x, this.y);
    }

    /**
     * Sets the coordinates of the vector.
     * @param {number} x - The X-coordinate of the vector.
     * @param {number} y - The Y-coordinate of the vector.
     */
    set(x, y) {
        this.x = x;
        this.y = y;

        return this;
    }

    /**
     * Sets the X-coordinate of the vector.
     * @param {number} x - The X-coordinate of the vector.
     */
    setX(x) {
        this.x = x;

        return this;
    }

    /**
     * Sets the Y-coordinate of the vector.
     * @param {number} y - The Y-coordinate of the vector.
     */
    setY(y) {
        this.y = y;

        return this;
    }

    /**
     * Copies the coordinates of another vector.
     * @param {Vector2D} vector
     * @returns {Vector2D}
     */
    copy(vector) {
        this.x = vector.x;
        this.y = vector.y;

        return this;
    }

    /**
     * Copies the X-coordinate of another vector.
     * @param {Vector2D} vector
     * @returns {Vector2D}
     */
    copyX(vector) {
        this.x = vector.x;

        return this;
    }

    /**
     * Copies the Y-coordinate of another vector.
     * @param {Vector2D} vector
     * @returns {Vector2D}
     */
    copyY(vector) {
        this.y = vector.y;

        return this;
    }

    /**
     * Adds the coordinates of another vector.
     * @param {Vector2D} vector - The other vector to add.
     * @returns {Vector2D}
     */
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    /**
     * Adds the X-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to add.
     * @returns {Vector2D}
     */
    addX(vector) {
        this.x += vector.x;

        return this;
    }

    /**
     * Adds the Y-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to add.
     * @returns {Vector2D}
     */
    addY(vector) {
        this.y += vector.y;

        return this;
    }

    /**
     * Adds a scalar value to the coordinates.
     * @param {number} scalar - The scalar value to add.
     * @returns {Vector2D}
     */
    addScalar(scalar) {
        this.x += scalar;
        this.y += scalar;

        return this;
    }

    /**
     * Adds a scalar value to the X-coordinate.
     * @param {number} scalar - The scalar value to add.
     * @returns {Vector2D}
     */
    addScalarX(scalar) {
        this.x += scalar;

        return this;
    }

    /**
     * Adds a scalar value to the Y-coordinate.
     * @param {number} scalar - The scalar value to add.
     * @returns {Vector2D}
     */
    addScalarY(scalar) {
        this.y += scalar;

        return this;
    }

    /**
     * Subtracts the coordinates of another vector.
     * @param {Vector2D} vector - The other vector to subtract.
     * @returns {Vector2D}
     */
    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }

    /**
     * Subtracts the X-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to subtract.
     * @returns {Vector2D}
     */
    subX(vector) {
        this.x -= vector.x;

        return this;
    }

    /**
     * Subtracts the Y-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to subtract.
     * @returns {Vector2D}
     */
    subY(vector) {
        this.y -= vector.y;

        return this;
    }

    /**
     * Subtracts a scalar value from the coordinates.
     * @param {number} scalar - The scalar value to subtract.
     * @returns {Vector2D}
     */
    subScalar(scalar) {
        this.x -= scalar;
        this.y -= scalar;

        return this;
    }

    /**
     * Subtracts a scalar value from the X-coordinate.
     * @param {number} scalar - The scalar value to subtract.
     * @returns {Vector2D}
     */
    subScalarX(scalar) {
        this.x -= scalar;

        return this;
    }

    /**
     * Subtracts a scalar value from the Y-coordinate.
     * @param {number} scalar - The scalar value to subtract.
     * @returns {Vector2D}
     */
    subScalarY(scalar) {
        this.y -= scalar;

        return this;
    }

    /**
     * Multiplies by the coordinates of another vector.
     * @param {Vector2D} vector - The other vector to multiply by.
     * @returns {Vector2D}
     */
    mul(vector) {
        this.x *= vector.x;
        this.y *= vector.y;

        return this;
    }

    /**
     * Multiplies by the X-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to multiply by.
     * @returns {Vector2D}
     */
    mulX(vector) {
        this.x *= vector.x;

        return this;
    }

    /**
     * Multiplies by the Y-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to multiply by.
     * @returns {Vector2D}
     */
    mulY(vector) {
        this.y *= vector.y;

        return this;
    }

    /**
     * Multiplies the coordinates by a scalar value.
     * @param {number} scalar - The scalar value to multiply by.
     * @returns {Vector2D}
     */
    mulScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    }

    /**
     * Multiplies the X-coordinate by a scalar value.
     * @param {number} scalar - The scalar value to multiply by.
     * @returns {Vector2D}
     */
    mulScalarX(scalar) {
        this.x *= scalar;

        return this;
    }

    /**
     * Multiplies the Y-coordinate by a scalar value.
     * @param {number} scalar - The scalar value to multiply by.
     * @returns {Vector2D}
     */
    mulScalarY(scalar) {
        this.y *= scalar;

        return this;
    }

    /**
     * Divides by the coordinates of another vector.
     * @param {Vector2D} vector - The other vector to divide by.
     * @returns {Vector2D}
     */
    div(vector) {
        this.x /= vector.x;
        this.y /= vector.y;

        return this;
    }

    /**
     * Divides by the X-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to divide by.
     * @returns {Vector2D}
     */
    divX(vector) {
        this.x /= vector.x;

        return this;
    }

    /**
     * Divides by the Y-coordinate of another vector.
     * @param {Vector2D} vector - The other vector to divide by.
     * @returns {Vector2D}
     */
    divY(vector) {
        this.y /= vector.y;

        return this;
    }

    /**
     * Divides the coordinates by a scalar value.
     * @param {number} scalar - The scalar value to divide by.
     * @returns {Vector2D}
     */
    divScalar(scalar) {
        this.x /= scalar;
        this.y /= scalar;

        return this;
    }

    /**
     * Divides the X-coordinate by a scalar value.
     * @param {number} scalar - The scalar value to divide by.
     * @returns {Vector2D}
     */
    divScalarX(scalar) {
        this.x /= scalar;

        return this;
    }

    /**
     * Divides the Y-coordinate by a scalar value.
     * @param {number} scalar - The scalar value to divide by.
     * @returns {Vector2D}
     */
    divScalarY(scalar) {
        this.y /= scalar;

        return this;
    }

    /**
     * Inverts the coordinates.
     * @returns {Vector2D}
     */
    invert() {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    }

    /**
     * Inverts the X-coordinates.
     * @returns {Vector2D}
     */
    invertX() {
        this.x = -this.x;

        return this;
    }

    /**
     * Inverts the Y-coordinates.
     * @returns {Vector2D}
     */
    invertY() {
        this.y = -this.y;

        return this;
    }

    /**
     * Creates an orthogonal vector of the current vector.
     * @returns {Vector2D}
     */
    normal() {
        return this.set(this.y, -this.x);
    }

    /**
     * Rounds the coordinates.
     * @returns {Vector2D}
     */
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        return this;
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
     * @returns {Vector2D}
     */
    normalize() {
        const l = this.length();

        if (l) {
            this.divScalar(l);
        } else {
            this.x = 1;
            this.y = 0;
        }

        return this;
    }

    /**
     * Changes the length of the vector.
     * @param {number} length - The new length for the vector.
     * @returns {Vector2D}
     */
    extend(length) {
        return this.normalize().mulScalar(length);
    }

    /**
     * Computes the dot product with another vector.
     * @param {Vector2D} vector - The other vector for the dot product.
     * @returns {number}
     */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    /**
     * Computes the cross product with another vector.
     * @param {Vector2D} vector - The other vector for the cross product.
     * @returns {number}
     */
    cross(vector) {
        return this.x * vector.y - this.y * vector.x;
    }

    /**
     * Computes the euclidean distance to another vector.
     * @param {Vector2D} vector - The other vector for the distance.
     * @returns {number}
     */
    distance(vector) {
        const dx = this.x - vector.x;
        const dy = this.y - vector.y;

        return Math.hypot(dx, dy);
    }

    /**
     * Computes the angle of the vector toward the X-axis.
     * @returns {number}
     */
    angle() {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Rotates the vector around the origin by the given angle.
     * @param {number} angle - The rotation angle, given in radians.
     * @returns {Vector2D}
     */
    rotate(angle) {
        const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);

        this.x = x;
        this.y = y;

        return this;
    }

    /**
     * Rotates the vector around the origin to the given angle.
     * @param {number} angle - The target angle, given in radians.
     * @returns {Vector2D}
     */
    rotateTo(angle) {
        return this.rotate(angle - this.angle());
    }

    /**
     * Rotates the vector around the given center by the given angle.
     * @param {number} angle - The rotation angle, given in radians.
     * * @param {Vector2D} center - The coordinates of the center.
     * @returns {Vector2D}
     */
    rotateAround(angle, center) {
        const v = this.clone();

        v.sub(center);
        v.rotate(angle);
        v.add(center);

        this.x = v.x;
        this.y = v.y;

        return this;
    }

    /**
     * Rotates the vector around the given center to the given angle.
     * @param {number} angle - The target angle, given in radians.
     * * @param {Vector2D} center - The coordinates of the center.
     * @returns {Vector2D}
     */
    rotateAroundTo(angle, center) {
        const v = this.clone();

        v.sub(center);
        v.rotate(angle - v.angle());
        v.add(center);

        this.x = v.x;
        this.y = v.y;

        return this;
    }

    /**
     * Checks whether or nor the vector equals another.
     * @param {Vector2D} vector
     * @returns {boolean}
     */
    equals(vector) {
        return this.x === vector.x && this.y === vector.y;
    }

    /**
     * Creates a normalized copy of the vector.
     * @returns {Vector2D}
     */
    toNorm() {
        return this.clone().normalize();
    }

    /**
     * Creates a perpendicular copy of the vector.
     * @returns {Vector2D}
     */
    toNormal() {
        return this.clone().normal();
    }

    /**
     * Converts the vector to a string
     * @returns {string}
     */
    toString() {
        return `x: ${this.x}, y: ${this.y}`;
    }

    /**
     * Converts the vector to an array
     * @returns {Array}
     */
    toArray() {
        return [this.x, this.y];
    }

    /**
     * Converts the vector to an object
     * @returns {object}
     */
    toObject() {
        return { x: this.x, y: this.y };
    }

    /**
     * Creates a vector from the given cartesian coordinates.
     * @param {number} x - The X-coordinate of the vector.
     * @param {number} y - The Y-coordinate of the vector.
     * @returns {Vector2D}
     */
    static vector(x = 0, y = 0) {
        return new Vector2D(x, y);
    }

    /**
     * Creates a vector from the given polar coordinates.
     * @param {number} radius - The radius coordinate.
     * @param {number} angle - The angle coordinate, given in radians.
     * @param {Vector2D} center - The coordinates of the center.
     * @returns {Vector2D}
     */
    static polar(radius = 0, angle = 0, center = Vector2D.origin) {
        const x = center.x + Math.cos(angle) * radius;
        const y = center.y + Math.sin(angle) * radius;

        return new Vector2D(x, y);
    }

    /**
     * Creates a vector from the cartesian coordinates given as an array.
     * @param {number[]} array - The cartesian coordinates of the form [x, y].
     * @returns {Vector2D}
     */
    static fromArray(array = []) {
        return new Vector2D(array[0], array[1]);
    }

    /**
     * Creates a vector from the cartesian coordinates given as an object.
     * @param {object} object - The cartesian coordinates of the form {x, y}.
     * @returns {Vector2D}
     */
    static fromObject(object = {}) {
        return new Vector2D(object.x, object.y);
    }
}

/**
 * Represents the origin of cartesian coordinates as a vector.
 * @type {Vector2D}
 * @property {Vector2D} Vector2D.origin
 */
Object.defineProperty(Vector2D, 'origin', {
    value: new Vector2D(),
    writable: false,
    enumerable: true,
    configurable: true
});
Object.freeze(Vector2D.origin);
