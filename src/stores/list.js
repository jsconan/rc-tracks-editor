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
 * Represents an observable list.
 * Each change in the list will be notified to the subscribers.
 */
export default class List {
    /**
     * Creates an observable list.
     * Each change in the list will be notified to the subscribers.
     * @param {*} source - An iterable object that can be used to initialize the list.
     */
    constructor(source = []) {
        this.list = [...source];
        const { subscribe, set } = writable(this);
        source = void 0;

        /**
         * Notifies all subscribers.
         * @returns {List} - Chains the list.
         */
        this.notify = () => {
            set(this);

            return this;
        };

        /**
         * Adds a subscriber that will be notified each time the list is modified.
         * @function subscribe
         * @param {function} subscriber - A callback that will receive notifications when the list is changed.
         * @returns {function} - Return a callback for removing the subscription.
         */
        this.subscribe = subscribe;
    }

    /**
     * The number of values in the list.
     * @type {number}
     */
    get length() {
        return this.list.length;
    }

    /**
     * Iterates over the values from the list.
     * @yields {*} - The next value in the list.
     * @generator
     * @function list.@@iterator
     */
    *[Symbol.iterator]() {
        yield* this.list.values();
    }

    /**
     * Returns an iterator for the values from the list.
     * @yields {*} - The next value in the list.
     * @generator
     */
    *values() {
        yield* this.list.values();
    }

    /**
     * Maps the values of the list to an array.
     * @param {function} mapper - A mapper callback that will be applied to each value of the list.
     * @returns {Array}
     */
    map(mapper) {
        if ('function' !== typeof mapper) {
            throw new TypeError('A callback function is expected!');
        }

        return this.list.map((value, index) => mapper.call(this, value, index, this));
    }

    /**
     * Finds the index of a value from the list. If the values does not exist in the list, `-1` is returned.
     * @param {function|*} filter - Either a filter callback that will be applied to each value of the list
     * and that must return true when the received value matches, or the searched value.
     * @returns {number} - The index of the value in the list, or -1 if not found.
     */
    find(filter) {
        if ('function' === typeof filter) {
            return this.list.findIndex((value, index) => filter.call(this, value, index, this));
        }

        return this.list.indexOf(filter);
    }

    /**
     * Gets the value at a particular index.
     * @param {number} index - The index of the value to get
     * @returns {*} - The value at the given index. It may be undefined.
     */
    get(index) {
        return this.list[index];
    }

    /**
     * Sets a value at a particular index.
     * @param {number} index - The index where to set the value.
     * @param {*} value  - The value to set at the index.
     * @returns {List} - Chains the list.
     */
    set(index, value) {
        this.list[index] = value;

        return this.notify();
    }

    /**
     * Inserts a value at a particular index.
     * @param {number} index - The index where to insert the value.
     * @param {*} value  - The value to insert at the index.
     * @returns {List} - Chains the list.
     */
    insert(index, ...value) {
        this.list.splice(index, 0, ...value);

        return this.notify();
    }

    /**
     * Adds a value at the end of the list.
     * @param {*} value  - The value to add.
     * @returns {List} - Chains the list.
     */
    add(...value) {
        this.list.push(...value);

        return this.notify();
    }

    /**
     * Removes a value from the given index.
     * @param {number} index - The index from where remove the value.
     * @param {number} count - The number of values to remove from the index.
     * @returns {number} - The number of deleted values.
     */
    delete(index, count = 1) {
        const deleted = this.list.splice(index, count).length;

        if (deleted) {
            this.notify();
        }

        return deleted;
    }

    /**
     * Clears the list.
     * @returns {List} - Chains the list.
     */
    clear() {
        this.list = [];

        return this.notify();
    }

    /**
     * Loads values from another source. The list is cleared before.
     * @param {*} iterator - An iterable object that can be used to fill the list.
     * @returns {List} - Chains the list.
     */
    load(iterator) {
        if (!iterator || !iterator[Symbol.iterator]) {
            return this;
        }

        this.list = [...iterator];

        return this.notify();
    }

    /**
     * Copy the list to an array.
     * @returns {Array} - An array containing the values from the list, in the same order.
     */
    toArray() {
        return [...this.list];
    }
}
