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

import { validateCallback } from '../helpers';
import { Vector2D } from './Vector2D.js';

/**
 * Represents a 2D polygon.
 */
export class Polygon2D {
    /**
     * Builds a polygon from the given cartesian coordinates.
     * @param {...Vector2D[]} points - The coordinates of the polygon.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    constructor(...points) {
        this.load(points.flat());
    }

    /**
     * The number of points in the polygon.
     * @type {number}
     */
    get length() {
        return this.points.length;
    }

    /**
     * Iterates over the points from the polygon.
     * @yields {*} - The next point of the polygon.
     * @generator
     */
    *[Symbol.iterator]() {
        yield* this.points.values();
    }

    /**
     * Returns an iterator for the points from the polygon.
     * @yields {*} - The next point of the polygon.
     * @generator
     */
    *values() {
        yield* this.points.values();
    }

    /**
     * Applies a callback to each point of the polygon.
     * @param {polygonCallback} walker - A callback that will be applied to each point of the polygon.
     * @returns {List} - Chains the instance.
     * @throws {TypeError} - If the given callback is not a function.
     */
    forEach(walker) {
        validateCallback(walker);

        this.points.forEach((point, index) => walker.call(this, point, index, this));

        return this;
    }

    /**
     * Maps the points of the polygon to an array.
     * @param {polygonCallback} mapper - A mapper callback that will be applied to each point of the polygon.
     * @returns {Array}
     * @throws {TypeError} - If the given callback is not a function.
     */
    map(mapper) {
        validateCallback(mapper);

        return this.points.map((point, index) => mapper.call(this, point, index, this));
    }

    /**
     * Gets a point at a particular index.
     * @param {number} index - The index of the point to get
     * @returns {Vector2D} - The point at the given index. It may be undefined.
     */
    get(index) {
        return this.points[index];
    }

    /**
     * Sets a point at a particular index.
     * @param {number} index - The index where to set the point.
     * @param {Vector2D} point - The point to set at the index.
     * @returns {Polygon2D} - Chains the instance.
     * @throws {TypeError} - If the given point is not a Vector2D.
     * @throws {ReferenceError} - If the given index is out of bounds.
     */
    set(index, point) {
        if (index < 0 || index >= this.length) {
            throw new ReferenceError('The list index is out of bounds!');
        }

        Vector2D.validateInstance(point);

        this.points[index] = point;

        return this;
    }

    /**
     * Inserts points at a particular index.
     * @param {number} index - The index where to insert the points.
     * @param {...Vector2D|...Polygon2D} points - The points to insert at the index.
     * @returns {Polygon2D} - Chains the instance.
     * @throws {TypeError} - If the given point is not a Vector2D.
     */
    insert(index, ...points) {
        this.points.splice(index, 0, ...Polygon2D.extractPoints(points));

        return this;
    }

    /**
     * Inserts a point at a particular index from the given coordinates.
     * @param {number} index - The index where to insert the point.
     * @param {number} x - The X-coordinate of the point to insert.
     * @param {number} y - The Y-coordinate  of the point to insert.
     * @returns {Polygon2D} - Chains the instance.
     */
    insertPoint(index, x, y) {
        return this.insert(index, new Vector2D(x, y));
    }

    /**
     * Adds points at the end of the polygon.
     * @param {...Vector2D|...Polygon2D} points - The points to add.
     * @returns {Polygon2D} - Chains the instance.
     * @throws {TypeError} - If the given point is not a Vector2D.
     */
    add(...points) {
        this.points.push(...Polygon2D.extractPoints(points));

        return this;
    }

    /**
     * Inserts a point at the end of the polygon from the given coordinates.
     * @param {number} x - The X-coordinate of the point to insert.
     * @param {number} y - The Y-coordinate  of the point to insert.
     * @returns {Polygon2D} - Chains the instance.
     */
    addPoint(x, y) {
        return this.add(new Vector2D(x, y));
    }

    /**
     * Removes points from the given index.
     * @param {number} index - The index from where remove the points.
     * @param {number} count - The number of points to remove from the index.
     * @returns {number} - The number of deleted points.
     * @fires delete
     */
    delete(index, count = 1) {
        const removed = this.points.splice(index, count);

        return removed.length;
    }

    /**
     * Clears the polygon.
     * @returns {Polygon2D} - Chains the instance.
     */
    clear() {
        this.points = [];

        return this;
    }

    /**
     * Loads points from another source. The polygon is cleared before.
     * @param {*} iterator - An iterable object that can be used to set the points.
     * @returns {Polygon2D} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    load(iterator) {
        if (!iterator || !iterator[Symbol.iterator]) {
            return this;
        }

        this.points = Polygon2D.extractPoints(iterator);

        return this;
    }

    /**
     * Translates the polygon by the given vector.
     * @param {Vector2D} vector - The move to apply to the each point of the polygon.
     * @returns {Polygon2D} - Chains the instance.
     */
    translate(vector) {
        this.points = this.points.map(point => point.add(vector));

        return this;
    }

    /**
     * Rotates the polygon by the given angle around the origin (0, 0).
     * @param {number} angle - The rotation angle.
     * @returns {Polygon2D} - Chains the instance.
     */
    rotate(angle) {
        this.points = this.points.map(point => point.rotate(angle));

        return this;
    }

    /**
     * Rotates the polygon by the given angle around the given center.
     * @param {number} angle - The rotation angle.
     * @param {Vector2D} center - The rotation center.
     * @returns {Polygon2D} - Chains the instance.
     */
    rotateAround(angle, center) {
        this.points = this.points.map(point => point.rotateAround(angle, center));

        return this;
    }

    /**
     * Converts the polygon to a string.
     * @returns {string} - The string representation of the polygon.
     */
    toString() {
        return this.points.join(' ');
    }

    /**
     * Copy the polygon to an array.
     * @returns {Array} - An array containing the points from the polygon.
     */
    toArray() {
        return [...this.points];
    }

    /**
     * Extracts points from an iterator. It allows instances of Vector2D and Polygon2D.
     * Other values throw an error.
     * @param {*} points - An iterable object for listing the points.
     * @returns {Vector2D[]} - Returns a list of points.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    static extractPoints(points) {
        let list = [];
        for (let p of points) {
            if (p instanceof this) {
                list = [...list, ...p.points];
                continue;
            }

            if (Array.isArray(p)) {
                p = Vector2D.fromArray(p);
            }

            Vector2D.validateInstance(p);
            list.push(p);
        }

        return list;
    }

    /**
     * Validates that the given points are instances of Vector2D.
     * Otherwise, an error is thrown.
     * @param {*} points - An iterable object for listing the points.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    static validatePoints(points) {
        for (const p of points) {
            Vector2D.validateInstance(p);
        }
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
}

/**
 * @typedef {import("./Vector2D.js").Vector2D} Vector2D
 */

/**
 * Callback called from the iteration algorithms.
 * @param {Vector2D} point - The current point being traversed.
 * @param {number} index - The index of the current point being traversed.
 * @returns {Vector2D} - Returns a point expected by the context.
 * @callback polygonCallback
 */
