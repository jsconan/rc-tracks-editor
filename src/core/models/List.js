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
 * Represents an observable list.
 * Each change in the list will be notified to the subscribers.
 * @mixes EventEmitter
 */
export class List {
    /**
     * Creates an observable list.
     * Each change in the list will be notified to the subscribers.
     * @param {*} source - An iterable object that can be used to initialize the list.
     */
    constructor(source = []) {
        eventEmitterMixin(this);

        this.list = [...source];
        source = void 0;
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
     * Applies a callback to each value from the list.
     * @param {listCallback} walker - A callback that will be applied to each value of the list.
     * @returns {List} - Chains the instance.
     * @throws {TypeError} - If the given callback is not a function.
     */
    forEach(walker) {
        validateCallback(walker);

        this.list.forEach((value, index) => walker.call(this, value, index, this));

        return this;
    }

    /**
     * Maps the values of the list to an array.
     * @param {listCallback} mapper - A mapper callback that will be applied to each value of the list.
     * @returns {Array}
     * @throws {TypeError} - If the given callback is not a function.
     */
    map(mapper) {
        validateCallback(mapper);

        return this.list.map((value, index) => mapper.call(this, value, index, this));
    }

    /**
     * Finds the index of a value from the list. If the values does not exist in the list, `-1` is returned.
     * @param {listCallback|*} filter - Either a filter callback that will be applied to each value of the list
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
     * Gets the first value of the list.
     * @returns {*} - The value at the first index. It may be undefined.
     */
    first() {
        return this.get(0);
    }

    /**
     * Gets the last value of the list.
     * @returns {*} - The value at the last index. It may be undefined.
     */
    last() {
        return this.get(this.list.length - 1);
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
     * @param {*} value - The value to set at the index.
     * @returns {List} - Chains the instance.
     * @fires set
     * @throws {ReferenceError} - If the given index is out of bounds.
     */
    set(index, value) {
        if (index < 0 || index >= this.length) {
            throw new ReferenceError('The list index is out of bounds!');
        }

        const previous = this.list[index];
        this.list[index] = value;

        this.emit('set', index, value, previous);

        return this;
    }

    /**
     * Inserts values at a particular index.
     * @param {number} index - The index where to insert the values.
     * @param {...*} values - The values to insert at the index.
     * @returns {List} - Chains the instance.
     * @fires add
     */
    insert(index, ...values) {
        this.list.splice(index, 0, ...values);

        this.emit('add', index, ...values);

        return this;
    }

    /**
     * Adds values at the end of the list.
     * @param {...*} values - The values to add.
     * @returns {List} - Chains the instance.
     * @fires add
     */
    add(...values) {
        const index = this.list.length;
        this.list.push(...values);

        this.emit('add', index, ...values);

        return this;
    }

    /**
     * Removes values from the given index.
     * @param {number} index - The index from where remove the values.
     * @param {number} count - The number of values to remove from the index.
     * @returns {number} - The number of deleted values.
     * @fires delete
     */
    delete(index, count = 1) {
        const removed = this.list.splice(index, count);
        const deleted = removed.length;

        if (deleted) {
            this.emit('delete', index, ...removed);
        }

        return deleted;
    }

    /**
     * Clears the list.
     * @returns {List} - Chains the instance.
     * @fires clear
     */
    clear() {
        this.list = [];

        this.emit('clear');

        return this;
    }

    /**
     * Loads values from another source. The list is cleared before.
     * @param {*} iterator - An iterable object that can be used to fill the list.
     * @returns {List} - Chains the instance.
     * @fires load
     */
    load(iterator) {
        if (!iterator || !iterator[Symbol.iterator]) {
            return this;
        }

        this.list = [...iterator];

        this.emit('load');

        return this;
    }

    /**
     * Copy the list to an array.
     * @returns {Array} - An array containing the values from the list, in the same order.
     */
    toArray() {
        return [...this.list];
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
 * Callback called from the iteration algorithms.
 * @param {*} value - The current value being traversed.
 * @param {number} index - The index of the current value being traversed.
 * @returns {*} - Returns a value expected by the context.
 * @callback listCallback
 */

/**
 * Notifies a value has been set to the list.
 * @event set
 * @param {number} index - The index where the value was set.
 * @param {*} newValue - The new value.
 * @param {*} oldValue - The previous value.
 */

/**
 * Notifies values have been added to the list.
 * @event add
 * @param {number} index - The index from where the values have been added.
 * @param {...*} values - The added values.
 */

/**
 * Notifies values have been removed from the list.
 * @event delete
 * @param {number} index - The index from where the values were removed.
 * @param {...*} values - The removed values.
 */

/**
 * Notifies the list has been cleared.
 * @event clear
 */

/**
 * Notifies the list has been loaded.
 * @event load
 */
