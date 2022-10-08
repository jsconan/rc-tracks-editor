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
import { eventEmitterMixin } from '../mixins';

/**
 * Represents a set of counters.
 */
export class Counter extends Map {
    /**
     * Creates an observable set of counters.
     * Each change in the counters will be notified to the subscribers.
     * @param {*} source - An iterable object that can be used to initialize the counters.
     */
    constructor(source = null) {
        super();

        eventEmitterMixin(this);

        if (source) {
            this.load(source);
            source = void 0;
        }
    }

    /**
     * Applies a callback to each counter from the list.
     * @param {function} walker - A callback that will be applied to each counter of the list.
     * @returns {Counter} - Chains the instance.
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
        return super.get(key) || 0;
    }

    /**
     * Sets the value for a particular counter.
     * @param {string} key - The key of the counter to set.
     * @param {number} value  - The new value of the counter. It must be a whole number.
     * @returns {Counter} - Chains the instance.
     * @fires set
     */
    set(key, value) {
        const previous = super.get(key) || 0;
        super.set(key, Math.floor(value) || 0);

        this.emit('set', key, value, previous);

        return this;
    }

    /**
     * Removes a counter.
     * @param {string} key - The key of the counter to delete.
     * @returns {boolean} - Returns `true` if a counter was deleted.
     * @fires delete
     */
    delete(key) {
        const value = super.get(key) || 0;
        const deleted = super.delete(key);

        if (deleted) {
            this.emit('delete', key, value);
        }

        return deleted;
    }

    /**
     * Increments a counter.
     * @param {string} key - The key of the counter to increment.
     * @param {number} amount - The amount to add to the counter.
     * @returns {Counter} - Chains the instance.
     * @fires set
     */
    increment(key, amount = 1) {
        const value = Math.floor(amount) || 1;
        return this.set(key, this.get(key) + value);
    }

    /**
     * Decrements a counter.
     * @param {string} key - The key of the counter to decrement.
     * @param {number} amount - The amount to subtract from the counter.
     * @returns {Counter} - Chains the instance.
     * @fires set
     */
    decrement(key, amount = 1) {
        const value = Math.floor(amount) || 1;
        return this.set(key, this.get(key) - value);
    }

    /**
     * Removes all counters.
     * @returns {Counter} - Chains the instance.
     * @fires clear
     */
    clear() {
        super.clear();

        this.emit('clear');

        return this;
    }

    /**
     * Loads counter from another source. The counters are cleared before.
     * @param {*} iterator - An iterable object that can be used to set the counters.
     * @returns {Counter} - Chains the instance.
     * @fires load
     */
    load(iterator) {
        if (!iterator || !iterator[Symbol.iterator]) {
            return this;
        }

        super.clear();
        for (const [key, value] of iterator) {
            super.set(key, Math.floor(value) || 0);
        }

        this.emit('load');

        return this;
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
 * Notifies a value has been set to a counter.
 * @event set
 * @param {string} key - The key of the counter that was set.
 * @param {number} newValue - The new value.
 * @param {number} oldValue - The previous value.
 */

/**
 * Notifies a counter has been removed.
 * @event delete
 * @param {string} key - The key of the counter that was removed.
 * @param {number} value - The last value of the removed counter.
 */

/**
 * Notifies all counters has been removed.
 * @event clear
 */

/**
 * Notifies the counters has been loaded.
 * @event load
 */
