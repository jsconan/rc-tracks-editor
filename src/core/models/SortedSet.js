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
import { TreeNode } from './TreeNode.js';

/**
 * Defines a sorted set structure.
 *
 * A sorted set is a set where the values are sorted so that a traversal will return a sorted list.
 */
export class SortedSet {
    /**
     * Creates a sorted set.
     * @param {*} source - A list of values to inject in the set.
     */
    constructor(source) {
        this.tree = TreeNode.create();
        this.size = 0;

        if (source) {
            for (const value of source) {
                this.add(value);
            }
        }
    }

    /**
     * Tells whether a value exists or not.
     * @param {*} value - The value to check.
     * @returns {boolean} - Returns `true` if the value exist.
     */
    has(value) {
        return this.tree.has(value);
    }

    /**
     * Adds a value to the set.
     * @param {*} value - The value to add.
     * @returns {SortedMap} - Chains the instance.
     */
    add(value) {
        const feedback = {};
        this.tree = this.tree.insert(value, null, feedback);

        if (feedback.added) {
            this.size++;
        }

        return this;
    }

    /**
     * Deletes a value.
     * @param {*} value - The value to remove.
     * @returns {boolean} - Returns `true` if something was deleted.
     */
    delete(value) {
        const feedback = {};
        this.tree = this.tree.delete(value, feedback);

        if (feedback.deleted) {
            this.size--;
            return true;
        }

        return false;
    }

    /**
     * Removes all values from the set.
     */
    clear() {
        this.tree = TreeNode.create();
        this.size = 0;
    }

    /**
     * Calls a function on every values of the map.
     * @param {eachKeyValue} each - A callback called for each value.
     * @param {*} [thisArg] - An optional call context for the callback. If omitted it will be defaulted to `undefined`.
     * @throws {TypeError} - If the callback is not supplied or is not a function.
     */
    forEach(each, thisArg) {
        validateCallback(each);

        for (const { key } of this.tree) {
            each.call(thisArg, key, this);
        }
    }

    /**
     * Produces an iterator to loop over all the values.
     * @yields {*} - The next value in the set.
     * @generator
     */
    *values() {
        for (const { key } of this.tree) {
            yield key;
        }
    }

    /**
     * Produces an iterator to loop over all the values.
     * @yields {*} - The next value in the set.
     * @generator
     */
    *[Symbol.iterator]() {
        yield* this.values();
    }
}

/**
 * Represents a callback function that is invoked for each key/value pair of a `SortedMap` object.
 * Mainly used when applying a traversal algorithm, like `forEach()`.
 * @param {*} value - The current value being traversed.
 * @param {*} key - The current key being traversed.
 * @param {SortedMap} map - The `SortedMap` instance being traversed.
 * @returns {*} - It may return a value that will impact the result of the visit.
 * @callback eachKeyValue
 */
