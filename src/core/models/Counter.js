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
import { validateCallback } from '../helpers';

/**
 * Represents a set of counters.
 */
export class Counter extends Map {
    /**
     * Creates an observable set of counters.
     * Each change in the counters will be notified to the subscribers.
     * @param {*} source - An iterable object that can be used to initialize the counters.
     */
    constructor(source = []) {
        super();
        const { subscribe, set } = writable(this);

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

        for (const [key, value] of source) {
            this.set(key, value);
        }
    }

    /**
     * Applies a callback to each counter from the list.
     * @param {function} walker - A callback that will be applied to each counter of the list.
     * @returns {Counter} - Chains the counter.
     * @throws {TypeError} - If the given callback is not a function.
     */
    forEach(walker) {
        validateCallback(walker);

        super.forEach((value, key) => walker.call(this, value, key, this));

        return this;
    }

    /**
     * Maps the counters to an object.
     * @param {function} mapper - A mapper callback that will be applied to each counter.
     * @returns {object}
     * @throws {TypeError} - If the given callback is not a function.
     */
    map(mapper) {
        validateCallback(mapper);

        const counters = {};

        for (const [key, value] of this.entries()) {
            counters[key] = mapper.call(this, value, key, this);
        }

        return counters;
    }

    /**
     * Gets the value for a particular counter.
     * @param {string} key - The key of the counter to read.
     * @returns {number} - The current value of the counter. It returns 0 if the counter does not exist.
     */
    get(key) {
        if (this.has(key)) {
            return super.get(key);
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
        super.set(key, Math.floor(value) || 0);

        return this.notify();
    }

    /**
     * Removes a counter.
     * @param {string} key - The key of the counter to delete.
     * @returns {boolean} - Returns `true` if a counter was deleted.
     */
    delete(key) {
        const deleted = super.delete(key);

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
        return this.set(key, this.get(key) + value);
    }

    /**
     * Decrements a counter.
     * @param {string} key - The key of the counter to decrement.
     * @param {number} amount - The amount to subtract from the counter.
     * @returns {Counter} - Chains the counter.
     */
    decrement(key, amount = 1) {
        const value = Math.floor(amount) || 1;
        return this.set(key, this.get(key) - value);
    }

    /**
     * Removes all counters.
     * @returns {Counter} - Chains the counter.
     */
    clear() {
        super.clear();

        return this.notify();
    }

    /**
     * Exports the counters to an object.
     * @returns {object} - An object containing the counters.
     */
    toObject() {
        const counters = {};

        for (const [key, value] of this.entries()) {
            counters[key] = value;
        }

        return counters;
    }
}
