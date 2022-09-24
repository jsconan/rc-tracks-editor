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
 * Defines a multimap structure.
 *
 * A multimap is a `Map` where each key can have multiple values. Internally, each key receives a bucket that
 * contains the values. This bucket is represented by a `Set`, which contains the list of values registered
 * under the key.
 *
 * When a value is set to a key, a bucket is created if needed, and the value is added to it.
 * Each further set to the same key will add values to the bucket.
 *
 * When a value is deleted from a key, the value is removed from the bucket bound to the key.
 * If the bucket is empty, the key is also removed.
 *
 * When a key is deleted, the bucket is deleted, removing all registered values as well.
 *
 * The iterators work as follow, considering a multimap such as `{ one: [1, 2], two:[3, 4] }`:
 * - `keys()` allows to loop over all the unique keys registered.
 *
 *   Say with the above example: `['one', 'two']`
 *
 * - `values()z allows to loop over all the values registered, one by one.
 *
 *   Say with the above example: `[1, 2, 3, 4]`
 *
 * - `entries()` allows to loop over all the unique key/value pairs.
 *
 *   Say with the above example: `[['one', 1], ['one', 2], ['two', 3], ['two', 4]]`
 *
 * - Exporting a multimap to an array, like with `[...multimap]`, will produce an array of key/value pairs.
 *
 *   Say with the above example: `[['one', 1], ['one', 2], ['two', 3], ['two', 4]]`
 *
 * A multimap can be initialized from either an array or another instance. When an array is used, it must be an array
 * of key/value pairs. To assign multiple values to a key, the key can be duplicated in several pairs, for example:
 * `[['one', 1], ['one', 2], ['two', 3], ['two', 4]]`.
 *
 * The `get()` method will give direct access to the bucket used to store values.
 */
export class Multimap extends Map {
    /**
     * Creates a multimap.
     * @param {*} source - A list of key/value pairs to inject in the map.
     */
    constructor(source) {
        super(source);
    }

    /**
     * Tells whether a key exists or not. When the value is supplied, it also tells whether the key/pair exists or not.
     * @param {*} key - The key to check.
     * @param {*} [value] - An optional value to check together with the key.
     * @returns {boolean} - Returns `true` if the keys exists.
     */
    has(key, value) {
        if ('undefined' === typeof value) {
            return super.has(key);
        }

        const bucket = this.get(key);
        if (bucket) {
            return bucket.has(value);
        }
        return false;
    }

    /**
     * Sets a value under a key. Several different values can be set under the same key. However, each value must be
     * unique within a key.
     * When setting a value to a key, a bucket is created if needed, and the value is added to it. Each further set
     * to the same key will add values to the bucket.
     * @param {*} key - The key to set.
     * @param {*} value - The value to register under the key.
     * @returns {Multimap} - Chains the instance.
     */
    // @ts-expect-error
    set(key, value) {
        let bucket = this.get(key);
        if (!bucket) {
            bucket = new Set();
            super.set(key, bucket);
        }
        bucket.add(value);
        return this;
    }

    /**
     * Deletes a key.
     * If only the key is supplied, the bucket is deleted, removing all registered values as well.
     * If a value is supplied, it is removed from the bucket bound to the key.
     * If the bucket is empty, the key is also removed.
     * @param {*} key - The key to delete.
     * @param {*} [value] - An optional value to remove from the key.
     * @returns {boolean} - Returns `true` if something was deleted.
     */
    delete(key, value) {
        if ('undefined' !== typeof value) {
            const bucket = this.get(key);
            if (bucket) {
                const deleted = bucket.delete(value);
                if (deleted) {
                    super.set(key, bucket);
                }

                if (bucket.size) {
                    return deleted;
                }
            }
        }

        return super.delete(key);
    }

    /**
     * Calls a function on every key/value pairs of the map.
     * @param {eachKeyValue} each - A callback called for each key/value pair.
     * @param {*} [thisArg] - An optional call context for the callback. If omitted it will be defaulted to `undefined`.
     * @throws {TypeError} - If the callback is not supplied or is not a function.
     */
    // @ts-expect-error
    forEach(each, thisArg) {
        validateCallback(each);

        for (const [key, bucket] of super.entries()) {
            for (const value of bucket) {
                each.call(thisArg, value, key, this);
            }
        }
    }

    /**
     * Produces an iterator to loop over all the values. This iterator will give an access to each single value. If a
     * key has several values, each of them will be iterated separately.
     * Say if we have a multimap such as `{ one: [1, 2], two:[3, 4] }`, the iterator will successively loop over the
     * values: `[1, 2, 3, 4]`.
     * @yields {*} - The next value in the map.
     * @generator
     */
    *values() {
        for (const bucket of super.values()) {
            for (const value of bucket) {
                yield value;
            }
        }
    }

    /**
     * Produces an iterator to loop over all the key/value pairs. This iterator will give an access to each single
     * key/value pair. If a key have several values, each of them will be iterated separately together with its key.
     * Say if we have a multimap such as `{ one: [1, 2], two:[3, 4] }`, the iterator will successively loop over the
     * entries: `[['one', 1], ['one', 2], ['two', 3], ['two', 4]]`.
     * @yields {*} - The next key/value pair in the map.
     * @generator
     */
    // @ts-expect-error
    *entries() {
        for (const [key, bucket] of super.entries()) {
            for (const value of bucket) {
                yield [key, value];
            }
        }
    }

    /**
     * Produces an iterator to loop over all the key/value pairs. This iterator will give an access to each single
     * key/value pair. If a key have several values, each of them will be iterated separately together with its key.
     * Say if we have a multimap such as `{ one: [1, 2], two:[3, 4] }`, the iterator will successively loop over the
     * entries: `[['one', 1], ['one', 2], ['two', 3], ['two', 4]]`.
     * @yields {*} - The next key/value pair in the map.
     * @generator
     */
    // @ts-expect-error
    *[Symbol.iterator]() {
        yield* this.entries();
    }
}

/**
 * Represents a callback function that is invoked for each key/value pair of a `Multimap` object.
 * Mainly used when applying a traversal algorithm, like `forEach()`.
 * @param {*} value - The current value being traversed.
 * @param {*} key - The current key being traversed.
 * @param {Multimap} map - The `Multimap` instance being traversed.
 * @callback eachKeyValue
 */
