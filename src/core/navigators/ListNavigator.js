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

import { eventEmitterMixin } from '../mixins';

/**
 * Navigates through a list of elements.
 */
export class ListNavigator {
    /**
     * The list of elements.
     * @type {Array}
     * @private
     */
    #elements = [];

    /**
     * The index of the selected element. -1 means no element is selected.
     * @type {number}
     * @private
     */
    #selectedIndex = -1;

    /**
     * Creates a navigator for navigating through a list of elements.
     * @param {*} elements - The list of elements.
     */
    constructor(elements = []) {
        eventEmitterMixin(this);

        this.#elements = Array.from(elements);
    }

    /**
     * Gets the list of elements.
     * @type {Array}
     */
    get elements() {
        return [...this.#elements];
    }

    /**
     * Gets the number of elements in the list.
     * @type {number}
     */
    get length() {
        return this.#elements.length;
    }

    /**
     * Gets the index of the selected element. -1 means no element is selected.
     * @type {number}
     */
    get selectedIndex() {
        return this.#selectedIndex;
    }

    /**
     * Gets the selected element.
     * @type {*}
     */
    get selected() {
        if (this.#selectedIndex > -1) {
            return this.#elements[this.#selectedIndex];
        }

        return null;
    }

    /**
     * Sets the list of elements.
     * @param {*} elements - The list of elements.
     * @returns {ListNavigator} - Chains the instance.
     * @fires setelements
     */
    setElements(elements) {
        const index = this.#selectedIndex;
        this.select(-1);

        this.#elements = Array.from(elements);

        this.emit('setelements');

        this.select(index);

        return this;
    }

    /**
     * Selects an element.
     * An index < 0 means not selection.
     * @param {number} index - The index of the selected element in the list.
     * @returns {ListNavigator} - Chains the instance.
     * @fires enter
     * @fires leave
     */
    select(index) {
        const selectedIndex = Math.min(Math.max(-1, index), this.#elements.length - 1);

        if (this.#selectedIndex === selectedIndex) {
            return this;
        }

        if (this.#selectedIndex > -1) {
            this.emit('leave', this.selected, this.#selectedIndex);
        }

        this.#selectedIndex = selectedIndex;

        if (this.#selectedIndex > -1) {
            this.emit('enter', this.selected, this.#selectedIndex);
        }

        return this;
    }

    /**
     * Selects the next element in the list.
     * If the end is reached, restart from the beginning.
     * @returns {ListNavigator} - Chains the instance.
     * @fires enter
     * @fires leave
     */
    selectNext() {
        const length = this.#elements.length;
        const next = (this.#selectedIndex + length + 1) % length;
        return this.select(next);
    }

    /**
     * Selects the previous element in the list.
     * If the beginning is reached, restart from the end.
     * @returns {ListNavigator} - Chains the instance.
     * @fires enter
     * @fires leave
     */
    selectPrevious() {
        const length = this.#elements.length;
        const current = Math.max(0, this.#selectedIndex);
        const previous = (current + length - 1) % length;
        return this.select(previous);
    }
}

/**
 * Notifies the list of elements has changed.
 * @event setelements
 */

/**
 * Notifies an element was deselected.
 * @event leave
 * @param {*} element - The deselected element.
 * @param {number} index - The index of the element in the list.
 */

/**
 * Notifies an element is selected.
 * @event enter
 * @param {*} element - The selected element.
 * @param {number} index - The index of the element in the list.
 */
