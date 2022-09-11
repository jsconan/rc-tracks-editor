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

import { writable } from 'svelte/store';

/**
 * Represents an observable set of counters.
 * Each change in the counters will be notified to the subscribers.
 */
export class Counter {
    /**
     * Creates an observable set of counters.
     * Each change in the counters will be notified to the subscribers.
     * @param {*} source - An iterable object that can be used to initialize the counters.
     */
    constructor(source = []) {
        this.counters = new Map();
        const { subscribe, set } = writable(this);

        for (const [key, value] of source) {
            this.counters.set(key, Math.floor(value) || 0);
        }

        /**
         * Notifies all subscribers.
         * @returns {Counter} - Chains the counter.
         */
        this.notify = () => {
            set(this);

            return this;
        };

        /**
         * Adds a subscriber that will be notified each time a counter is modified.
         * @function subscribe
         * @param {function} subscriber - A callback that will receive notifications when a counter is changed.
         * @returns {function} - Returns a callback for removing the subscription.
         */
        this.subscribe = subscribe;
    }

    /**
     * The number of managed counters.
     * @type {number}
     */
    get size() {
        return this.counters.size;
    }

    /**
     * Iterates over the counters.
     * @yields {*} - The next counter in the list.
     * @generator
     */
    *[Symbol.iterator]() {
        yield* this.counters.entries();
    }

    /**
     * Iterates over the counter keys.
     * @yields {*} - The next key in the list.
     * @generator
     */
    *keys() {
        yield* this.counters.keys();
    }

    /**
     * Applies a callback to each counter from the list.
     * @param {function} walker - A callback that will be applied to each counter of the list.
     * @returns {Counter} - Chains the counter.
     */
    forEach(walker) {
        if ('function' !== typeof walker) {
            throw new TypeError('A callback function is expected!');
        }

        this.counters.forEach((value, key) => walker.call(this, value, key, this));

        return this;
    }

    /**
     * Maps the counters to an object.
     * @param {function} mapper - A mapper callback that will be applied to each counter.
     * @returns {object}
     */
    map(mapper) {
        if ('function' !== typeof mapper) {
            throw new TypeError('A callback function is expected!');
        }

        const counters = {};

        for (const [key, value] of this.counters.entries()) {
            counters[key] = mapper.call(this, value, key, this);
        }

        return counters;
    }

    /**
     * Tells whether a counter exists or not.
     * @param {string} key - The key of the counter to check.
     * @returns {boolean} - Returns `true` if the counter exists.
     */
    has(key) {
        return this.counters.has(key);
    }

    /**
     * Gets the value for a particular counter.
     * @param {string} key - The key of the counter to read.
     * @returns {number} - The current value of the counter. It returns 0 if the counter does not exist.
     */
    get(key) {
        if (this.counters.has(key)) {
            return this.counters.get(key);
        }
        return 0;
    }

    /**
     * Sets the value for a particular counter.
     * @param {string} key - The key of the counter to set.
     * @param {number} value  - The new value of the counter. It must be a whole number.
     * @returns {Counter} - Chains the counter.
     */
    set(key, value) {
        this.counters.set(key, Math.floor(value) || 0);

        return this.notify();
    }

    /**
     * Removes a counter.
     * @param {string} key - The key of the counter to delete.
     * @returns {boolean} - Returns `true` if a counter was deleted.
     */
    delete(key) {
        const deleted = this.counters.delete(key);

        if (deleted) {
            this.notify();
        }

        return deleted;
    }

    /**
     * Increments a counter.
     * @param {string} key - The key of the counter to increment.
     * @param {number} amount - The amount to add to the counter.
     * @returns {Counter} - Chains the counter.
     */
    increment(key, amount = 1) {
        const value = Math.floor(amount) || 1;
        this.counters.set(key, this.get(key) + value);

        return this.notify();
    }

    /**
     * Decrements a counter.
     * @param {string} key - The key of the counter to decrement.
     * @param {number} amount - The amount to subtract from the counter.
     * @returns {Counter} - Chains the counter.
     */
    decrement(key, amount = 1) {
        const value = Math.floor(amount) || 1;
        this.counters.set(key, this.get(key) - value);

        return this.notify();
    }

    /**
     * Removes all counters.
     * @returns {Counter} - Chains the counter.
     */
    clear() {
        this.counters.clear();

        return this.notify();
    }

    /**
     * Loads counters from another source. The existing counters are removed before.
     * @param {*} iterator - An iterable object that can be used to set the counters.
     * @returns {Counter} - Chains the counter.
     */
    load(iterator) {
        if (!iterator || !iterator[Symbol.iterator]) {
            return this;
        }

        this.counters.clear();
        for (const [key, value] of iterator) {
            this.counters.set(key, Math.floor(value) || 0);
        }

        return this.notify();
    }

    /**
     * Counts the occurrences from the given source. The existing counters are reset before.
     * @param {*} [iterator] - An iterable object that can be used to set the counters.
     * @returns {Counter} - Chains the counter.
     */
    reset(iterator) {
        for (const key of this.counters.keys()) {
            this.counters.set(key, 0);
        }

        if (iterator && iterator[Symbol.iterator]) {
            for (const key of iterator) {
                this.counters.set(key, this.get(key) + 1);
            }
        }

        return this.notify();
    }

    /**
     * Exports the counters to an object.
     * @returns {object} - An object containing the counters.
     */
    toObject() {
        const counters = {};

        for (const [key, value] of this.counters.entries()) {
            counters[key] = value;
        }

        return counters;
    }
}
