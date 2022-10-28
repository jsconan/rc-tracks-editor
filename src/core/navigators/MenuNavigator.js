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
 * Represents a navigator for managing a menu using a mouse and/or a keyboard.
 */
export class MenuNavigator {
    /**
     * The list of elements in the menu.
     * @type {Array}
     * @private
     */
    #elements = [];

    /**
     * The index of the focused element. -1 means no element is focused.
     * @type {number}
     * @private
     */
    #focusedIndex = -1;

    /**
     * The index of the hovered element. -1 means no element is hovered.
     * @type {number}
     * @private
     */
    #hoveredIndex = -1;

    /**
     * Creates a navigator for managing a menu using a mouse and/or a keyboard.
     * @param {*} elements - The list of elements in the menu.
     */
    constructor(elements = []) {
        eventEmitterMixin(this);

        this.#elements = Array.from(elements);
    }

    /**
     * Gets the list of elements in the menu.
     * @type {Array}
     */
    get elements() {
        return [...this.#elements];
    }

    /**
     * Gets the number of elements in the menu.
     * @type {number}
     */
    get length() {
        return this.#elements.length;
    }

    /**
     * Gets the index of the focused element. -1 means no element is focused.
     * @type {number}
     */
    get focusedIndex() {
        return this.#focusedIndex;
    }

    /**
     * Gets the index of the hovered element. -1 means no element is hovered.
     * @type {number}
     */
    get hoveredIndex() {
        return this.#hoveredIndex;
    }

    /**
     * Gets the focused element.
     * @type {*}
     */
    get focused() {
        if (this.#focusedIndex > -1) {
            return this.#elements[this.#focusedIndex];
        }
        return null;
    }

    /**
     * Gets the hovered element.
     * @type {*}
     */
    get hovered() {
        if (this.#hoveredIndex > -1) {
            return this.#elements[this.#hoveredIndex];
        }
        return null;
    }

    /**
     * Sets the list of elements in the menu.
     * @param {*} elements - The list of elements in the menu.
     * @returns {MenuNavigator} - Chains the instance.
     * @fires elements
     */
    setElements(elements) {
        this.#elements = Array.from(elements);
        this.#focusedIndex = -1;
        this.#hoveredIndex = -1;

        this.emit('elements', this.elements);

        return this;
    }

    /**
     * Selects the focused element.
     * An index < 0 will deselect the element.
     * @param {number} index - The index of the focused element in the menu.
     * @returns {MenuNavigator} - Chains the instance.
     * @fires blur
     * @fires focus
     */
    setFocused(index) {
        const focusedIndex = Math.min(Math.max(-1, index), this.#elements.length);

        if (this.#focusedIndex === focusedIndex) {
            return this;
        }

        if (this.#focusedIndex > -1) {
            this.emit('blur', this.focused, this.#focusedIndex);
        }

        this.#focusedIndex = focusedIndex;

        if (this.#focusedIndex > -1) {
            this.emit('focus', this.focused, this.#focusedIndex);
        }

        return this;
    }

    /**
     * Selects the hovered element.
     * An index < 0 will deselect the element.
     * @param {number} index - The index of the hovered element in the menu.
     * @returns {MenuNavigator} - Chains the instance.
     * @fires leave
     * @fires enter
     */
    setHovered(index) {
        const hoveredIndex = Math.min(Math.max(-1, index), this.#elements.length);

        if (this.#hoveredIndex === hoveredIndex) {
            return this;
        }

        if (this.#hoveredIndex > -1) {
            this.emit('leave', this.hovered, this.#hoveredIndex);
        }

        this.#hoveredIndex = hoveredIndex;

        if (this.#hoveredIndex > -1) {
            this.emit('enter', this.hovered, this.#hoveredIndex);
        }

        return this;
    }

    /**
     * Hovers the focused element.
     * @returns {MenuNavigator} - Chains the instance.
     * @fires leave
     * @fires enter
     */
    hoverFocused() {
        return this.setHovered(this.#focusedIndex);
    }

    /**
     * Focuses the hovered element.
     * @returns {MenuNavigator} - Chains the instance.
     * @fires blur
     * @fires focus
     */
    focusHovered() {
        return this.setFocused(this.#hoveredIndex);
    }

    /**
     * Focuses the next element.
     * @returns {MenuNavigator} - Chains the instance.
     * @fires blur
     * @fires focus
     */
    focusNext() {
        const length = this.#elements.length;
        const index = (this.#focusedIndex + length + 1) % length;
        return this.setFocused(index);
    }

    /**
     * Focuses the previous element.
     * @returns {MenuNavigator} - Chains the instance.
     * @fires blur
     * @fires focus
     */
    focusPrevious() {
        if (this.#focusedIndex < 0) {
            this.#focusedIndex = 0;
        }

        const length = this.#elements.length;
        const index = (this.#focusedIndex + length - 1) % length;
        return this.setFocused(index);
    }
}

/**
 * Notifies the list of elements has changed.
 * @event elements
 * @param {Array} elements - The list of elements in the menu.
 */

/**
 * Notifies an element has lost focus.
 * @event blur
 * @param {*} element - The element which lost focus.
 * @param {number} index - The index of the element in the menu.
 */

/**
 * Notifies an element has gained focus.
 * @event focus
 * @param {*} element - The element which got focus.
 * @param {number} index - The index of the element in the menu.
 */

/**
 * Notifies the pointer left an element.
 * @event leave
 * @param {*} element - The element which lost the pointer.
 * @param {number} index - The index of the element in the menu.
 */

/**
 * Notifies the pointer entered an element.
 * @event enter
 * @param {*} element - The element which received the pointer.
 * @param {number} index - The index of the element in the menu.
 */
