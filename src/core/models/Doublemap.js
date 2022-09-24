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

/**
 * Defines a doublemap structure.
 *
 * A doublemap is a `Map` where each value is indexed by two keys, a primary and a secondary. Internally, it
 * relies on a combination of `Map` objects. The primary keys are managed by a first `Map`, then each key
 * is associated with a another `Map` object that contains the secondary keys and the related values. In the
 * end, it could be seen as a two-dimensional associative array.
 */
export class Doublemap extends Map {
    /**
     * Creates a doublemap.
     * @param {*} source - A list of primaryKey/secondaryKey/value sets to inject in the map.
     */
    constructor(source) {
        super();

        if (source) {
            for (const [primaryKey, secondaryKey, value] of source) {
                this.set(primaryKey, secondaryKey, value);
            }
        }
    }

    /**
     * The amount of secondary keys registered in the map.
     * @type {number}
     */
    get size2() {
        let size = 0;
        for (const bucket of super.values()) {
            size += bucket.size;
        }
        return size;
    }

    /**
     * Tells whether a key exists or not.
     * It accepts either the primary key only, or the two keys, or the two keys and the value.
     * @param {*} primaryKey - The primary key to check.
     * @param {*} [secondaryKey] - The secondary key to check.
     * @param {*} [value] - An optional value to check together with the pair of keys.
     * @returns {boolean} - Returns `true` if the keys exist.
     */
    has(primaryKey, secondaryKey, value) {
        const undefinedValue = 'undefined' === typeof value;
        if ('undefined' === typeof secondaryKey && undefinedValue) {
            return super.has(primaryKey);
        }

        const bucket = super.get(primaryKey);
        if (!bucket) {
            return false;
        }

        if (undefinedValue) {
            return bucket.has(secondaryKey);
        }

        return bucket.get(secondaryKey) === value;
    }

    /**
     * Gets the value registered under the given pair of keys.
     * If the value does not exist, `undefined` will be returned.
     * @param {*} primaryKey - The primary key to check.
     * @param {*} [secondaryKey] - The secondary key to check.
     * @returns {*} - Returns either the secondary `Map`, the registered value, or `undefined`.
     */
    get(primaryKey, secondaryKey) {
        const bucket = super.get(primaryKey);

        if (!bucket || 'undefined' === typeof secondaryKey) {
            return bucket;
        }

        return bucket.get(secondaryKey);
    }

    /**
     * Sets a value under a pair of keys.
     * @param {*} primaryKey - The primary key to check.
     * @param {*} secondaryKey - The secondary key to check.
     * @param {*} value - The value to register under the keys.
     * @returns {Doublemap} - Chains the instance.
     */
    set(primaryKey, secondaryKey, value) {
        if ('undefined' !== typeof secondaryKey) {
            let bucket = super.get(primaryKey);
            if (!bucket) {
                bucket = new Map();
                super.set(primaryKey, bucket);
            }
            bucket.set(secondaryKey, value);
        }
        return this;
    }

    /**
     * Deletes a key. If only the primary key is supplied, all its secondary keys will be deleted.
     * If all keys are supplied, only the exact pair will be deleted.
     * If the value is also supplied, it will only be removed if it matches the registered value.
     * @param {*} primaryKey - The primary key to check.
     * @param {*} [secondaryKey] - The secondary key to check.
     * @param {*} [value] - An optional value to remove from the key.
     * @returns {boolean} - Returns `true` if something was deleted.
     */
    delete(primaryKey, secondaryKey, value) {
        const undefinedValue = 'undefined' === typeof value;
        if ('undefined' === typeof secondaryKey && undefinedValue) {
            return super.delete(primaryKey);
        }

        const bucket = super.get(primaryKey);
        if (!bucket) {
            return false;
        }

        if (undefinedValue || bucket.get(secondaryKey) === value) {
            const deleted = bucket.delete(secondaryKey);

            if (!bucket.size) {
                super.delete(primaryKey);
            }

            return deleted;
        }

        return false;
    }

    /**
     * Calls a function on every primaryKey/secondaryKey/value sets of the map.
     * @param {eachKeysValue} each - A callback called for each keys/value pair.
     * @param {*} [thisArg] - An optional call context for the callback. If omitted it will be defaulted to `undefined`.
     * @throws {TypeError} - If the callback is not supplied or is not a function.
     */
    forEach(each, thisArg) {
        validateCallback(each);

        for (const [primaryKey, secondaryKey, value] of this.entries()) {
            each.call(thisArg, value, secondaryKey, primaryKey, this);
        }
    }

    /**
     * Produces an iterator to loop over all the keys.
     * If the primary key is supplied, the iterator will list its secondary keys if any.
     * @param {*} [key] - The primary key for which list the secondary keys.
     * @yields {*} - The next value in the map.
     * @generator
     */
    *keys(key) {
        if ('undefined' !== typeof key) {
            const bucket = super.get(key);
            if (bucket) {
                yield* bucket.keys();
            }
            return;
        }

        for (const [primaryKey, bucket] of super.entries()) {
            for (const secondaryKey of bucket.keys()) {
                yield [primaryKey, secondaryKey];
            }
        }
    }

    /**
     * Produces an iterator to loop over all the values.
     * If the primary key is supplied, the iterator will list its values.
     * Otherwise, it will loops through all secondary map as well.
     * @param {*} [key] - The primary key for which list the values.
     * @yields {*} -  The next value in the map.
     * @generator
     */
    *values(key) {
        if ('undefined' !== typeof key) {
            const bucket = super.get(key);
            if (bucket) {
                yield* bucket.values();
            }
            return;
        }

        for (const bucket of super.values()) {
            yield* bucket.values();
        }
    }

    /**
     * Produces an iterator to loop over all the primaryKey/secondaryKey/value sets.
     * If the primary key is supplied, the iterator will list its key/value pairs.
     * @param {*} [key] - The primary key for which list the values.
     * @yields {*} - The next primaryKey/secondaryKey/value set in the map.
     * @generator
     */
    *entries(key) {
        if ('undefined' !== typeof key) {
            const bucket = super.get(key);
            if (bucket) {
                yield* bucket.entries();
            }
            return;
        }

        for (const [primaryKey, bucket] of super.entries()) {
            for (const [secondaryKey, value] of bucket) {
                yield [primaryKey, secondaryKey, value];
            }
        }
    }

    /**
     * Produces an iterator to loop over all the primaryKey/secondaryKey/value sets.
     * @yields {*} - The next primaryKey/secondaryKey/value set in the map.
     * @generator
     */
    *[Symbol.iterator]() {
        yield* this.entries();
    }
}

/**
 * Represents a callback function that is invoked for each primaryKey/secondaryKey/value set of a `Doublemap`
 * object. Mainly used when applying a traversal algorithm, like `forEach()`.
 * @param {*} value - The current value being traversed.
 * @param {*} secondaryKey - The current secondaryKey being traversed.
 * @param {*} primaryKey - The current primaryKey being traversed.
 * @param {Doublemap} map - The `Doublemap` instance being traversed.
 * @callback eachKeysValue
 */
