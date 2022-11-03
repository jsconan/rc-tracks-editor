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

import { between, increase } from '../helpers';
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
     * The index of the element that will be selected by default. -1 means no element.
     * @type {number}
     * @private
     */
    #defaultSelectedIndex = -1;

    /**
     * Creates a navigator for navigating through a list of elements.
     * @param {*} elements - The list of elements.
     */
    constructor(elements = []) {
        eventEmitterMixin(this);

        this.#elements = Array.from(elements);
    }

    /**
     * Gets the number of elements in the list.
     * @type {number}
     */
    get length() {
        return this.#elements.length;
    }

    /**
     * Gets the list of elements.
     * @type {Array}
     */
    get elements() {
        return [...this.#elements];
    }

    /**
     * Sets the list of elements.
     * @param {*} elements - The list of elements.
     * @fires setelements
     */
    set elements(elements) {
        const index = this.#selectedIndex;
        this.selectedIndex = -1;

        this.#elements = Array.from(elements);

        this.emit('setelements');

        this.selectedIndex = index;
    }

    /**
     * Gets the element that will be selected by default.
     * @type {*}
     */
    get defaultSelected() {
        if (this.#defaultSelectedIndex > -1) {
            return this.#elements[this.#defaultSelectedIndex];
        }

        return null;
    }

    /**
     * Sets the index of the element that will be selected by default. `null` means no element.
     * @param {*} element - The element that will be selected by default.
     */
    set defaultSelected(element) {
        if (null === element) {
            this.#defaultSelectedIndex = -1;
            return;
        }

        this.#defaultSelectedIndex = this.#elements.indexOf(element);
    }

    /**
     * Gets the index of the element that will be selected by default. -1 means no element.
     * @type {number}
     */
    get defaultSelectedIndex() {
        return this.#defaultSelectedIndex;
    }

    /**
     * Sets the index of the element that will be selected by default. -1 means no element.
     * @param {number} index - The index of the element that will be selected by default.
     */
    set defaultSelectedIndex(index) {
        this.#defaultSelectedIndex = between(index, -1, this.#elements.length - 1);
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
     * Sets the selected element.
     * @param {*} element - The element to select. `null` means no element is selected.
     */
    set selected(element) {
        if (null === element) {
            this.selectedIndex = -1;
            return;
        }

        this.selectedIndex = this.#elements.indexOf(element);
    }

    /**
     * Gets the index of the selected element. -1 means no element is selected.
     * @type {number}
     */
    get selectedIndex() {
        return this.#selectedIndex;
    }

    /**
     * Sets the index of the selected element. -1 means no element is selected.
     * @param {number} index - The index of the selected element in the list.
     * @fires leave
     * @fires enter
     */
    set selectedIndex(index) {
        const selectedIndex = between(index, -1, this.#elements.length - 1);

        if (this.#selectedIndex === selectedIndex) {
            return;
        }

        if (this.#selectedIndex > -1) {
            this.emit('leave', this.selected, this.#selectedIndex);
        }

        this.#selectedIndex = selectedIndex;

        if (this.#selectedIndex > -1) {
            this.emit('enter', this.selected, this.#selectedIndex);
        }
    }

    /**
     * Finds the index of an element in the list.
     * @param {*} element - A reference to the searched element.
     * @returns {number} - The index of the element, or `-1` if not found.
     */
    indexOf(element) {
        return this.#elements.indexOf(element);
    }

    /**
     * Finds the index of an element in the list.
     * @param {searchPredicate} predicate - A predicate function that must return `true` for the matching element.
     * @returns {number} - The index of the element, or `-1` if not found.
     * @throws {TypeError} - If the predicate is not a function.
     */
    findIndex(predicate) {
        return this.#elements.findIndex(predicate);
    }

    /**
     * Selects the default element if none is selected.
     * @returns {ListNavigator} - Chains the instance.
     * @fires enter
     */
    select() {
        if (this.#selectedIndex < 0 && this.#defaultSelectedIndex > -1) {
            this.selectedIndex = this.#defaultSelectedIndex;
        }

        return this;
    }

    /**
     * Selects the next element in the list.
     * If the end is reached, restart from the beginning.
     * @returns {ListNavigator} - Chains the instance.
     * @fires leave
     * @fires enter
     */
    next() {
        let next = this.#defaultSelectedIndex;

        if (this.#selectedIndex > -1 || this.#defaultSelectedIndex < 0) {
            next = increase(this.#selectedIndex, 1, this.#elements.length);
        }

        this.selectedIndex = next;

        return this;
    }

    /**
     * Selects the previous element in the list.
     * If the beginning is reached, restart from the end.
     * @returns {ListNavigator} - Chains the instance.
     * @fires leave
     * @fires enter
     */
    previous() {
        let previous = this.#defaultSelectedIndex;

        if (this.#selectedIndex > -1 || this.#defaultSelectedIndex < 0) {
            const current = Math.max(0, this.#selectedIndex);
            previous = increase(current, -1, this.#elements.length);
        }

        this.selectedIndex = previous;

        return this;
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

/**
 * Callback called from searching an element in the list.
 * @param {*} element - The element being traversed.
 * @param {number} index - The index of the element being traversed.
 * @returns {boolean} - Returns `true` if the traversed element matches.
 * @callback searchPredicate
 */
