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
 * Defines a sorted map structure.
 *
 * A sorted map is a map where the keys are sorted so that a traversal will return a sorted list.
 */
export class SortedMap {
    /**
     * Creates a sorted map.
     * @param {*} source - A list of key/value pairs to inject in the map.
     */
    constructor(source) {
        this.tree = TreeNode.create();
        this.size = 0;

        if (source) {
            for (const [key, value] of source) {
                this.set(key, value);
            }
        }
    }

    /**
     * Tells whether a key exists or not.
     * @param {*} key - The key to check.
     * @returns {boolean} - Returns `true` if the keys exist.
     */
    has(key) {
        return this.tree.has(key);
    }

    /**
     * Gets the value registered under the given key.
     * If the value does not exist, `undefined` will be returned.
     * @param {*} key - The key to check.
     * @returns {*} - Returns the registered value, or `undefined`.
     */
    get(key) {
        return this.tree.get(key);
    }

    /**
     * Sets a value under a key.
     * @param {*} key - The key to set.
     * @param {*} value - The value to register under the key.
     * @returns {SortedMap} - Chains the instance.
     */
    set(key, value) {
        const feedback = {};
        this.tree = this.tree.insert(key, value, feedback);

        if (feedback.added) {
            this.size++;
        }

        return this;
    }

    /**
     * Deletes a key.
     * @param {*} key - The key to remove.
     * @returns {boolean} - Returns `true` if something was deleted.
     */
    delete(key) {
        const feedback = {};
        this.tree = this.tree.delete(key, feedback);

        if (feedback.deleted) {
            this.size--;
            return true;
        }

        return false;
    }

    /**
     * Removes all elements from the map.
     */
    clear() {
        this.tree = TreeNode.create();
        this.size = 0;
    }

    /**
     * Calls a function on every key/value pairs of the map.
     * @param {eachKeyValue} each - A callback called for each keys/value pair.
     * @param {*} [thisArg] - An optional call context for the callback. If omitted it will be defaulted to `undefined`.
     * @throws {TypeError} - If the callback is not supplied or is not a function.
     */
    forEach(each, thisArg) {
        validateCallback(each);

        for (const { key, value } of this.tree) {
            each.call(thisArg, value, key, this);
        }
    }

    /**
     * Produces an iterator to loop over all the keys.
     * @yields {*} - The next key in the map.
     * @generator
     */
    *keys() {
        for (const { key } of this.tree) {
            yield key;
        }
    }

    /**
     * Produces an iterator to loop over all the values.
     * @yields {*} - The next value in the map.
     * @generator
     */
    *values() {
        for (const { value } of this.tree) {
            yield value;
        }
    }

    /**
     * Produces an iterator to loop over all the key/value pairs.
     * @yields {*} - The next key/value pair in the map.
     * @generator
     */
    *entries() {
        for (const { key, value } of this.tree) {
            yield [key, value];
        }
    }

    /**
     * Produces an iterator to loop over all the key/value pairs.
     * @yields {*} - The next key/value pair in the map.
     * @generator
     */
    *[Symbol.iterator]() {
        yield* this.entries();
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
