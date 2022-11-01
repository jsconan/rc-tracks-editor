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
import { ListNavigator } from './ListNavigator.js';

/**
 * Navigates inside a menu.
 * Differentiates focus and hover.
 */
export class MenuNavigator {
    /**
     * Focused element.
     * @type {ListNavigator}
     * @private
     */
    #focus = null;

    /**
     * Hovered element.
     * @type {ListNavigator}
     * @private
     */
    #hover = null;

    /**
     * Creates a navigator for navigating inside a menu.
     * @param {*} elements - The list of elements in the menu.
     */
    constructor(elements = []) {
        eventEmitterMixin(this);

        this.#focus = new ListNavigator(elements);
        this.#hover = new ListNavigator(elements);

        this.#focus.on('enter', (element, index) => this.emit('focus', element, index));
        this.#focus.on('leave', (element, index) => this.emit('blur', element, index));
        this.#focus.delegate('setelements', this);
        this.#hover.delegate('enter', this);
        this.#hover.delegate('leave', this);
    }

    /**
     * Gets the list of elements in the menu.
     * @type {Array}
     */
    get elements() {
        return this.#focus.elements;
    }

    /**
     * Gets the number of elements in the menu.
     * @type {number}
     */
    get length() {
        return this.#focus.length;
    }

    /**
     * Gets the index of the focused element. -1 means no element is focused.
     * @type {number}
     */
    get focusedIndex() {
        return this.#focus.selectedIndex;
    }

    /**
     * Gets the index of the hovered element. -1 means no element is hovered.
     * @type {number}
     */
    get hoveredIndex() {
        return this.#hover.selectedIndex;
    }

    /**
     * Gets the focused element.
     * @type {*}
     */
    get focused() {
        return this.#focus.selected;
    }

    /**
     * Gets the hovered element.
     * @type {*}
     */
    get hovered() {
        return this.#hover.selected;
    }

    /**
     * Sets the list of elements in the menu.
     * @param {*} elements - The list of elements in the menu.
     * @returns {MenuNavigator} - Chains the instance.
     * @fires setelements
     */
    setElements(elements) {
        this.#focus.elements = elements;
        this.#hover.elements = elements;

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
        this.#focus.selectedIndex = index;

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
        this.#hover.selectedIndex = index;

        return this;
    }

    /**
     * Hovers the focused element.
     * @returns {MenuNavigator} - Chains the instance.
     * @fires leave
     * @fires enter
     */
    hoverFocused() {
        this.#hover.selectedIndex = this.#focus.selectedIndex;
    }

    /**
     * Focuses the hovered element.
     * @returns {MenuNavigator} - Chains the instance.
     * @fires blur
     * @fires focus
     */
    focusHovered() {
        this.#focus.selectedIndex = this.#hover.selectedIndex;
    }

    /**
     * Focuses the next element.
     * @returns {MenuNavigator} - Chains the instance.
     * @fires blur
     * @fires focus
     */
    focusNext() {
        this.#focus.next();

        return this;
    }

    /**
     * Focuses the previous element.
     * @returns {MenuNavigator} - Chains the instance.
     * @fires blur
     * @fires focus
     */
    focusPrevious() {
        this.#focus.previous();

        return this;
    }
}

/**
 * Notifies the list of elements has changed.
 * @event setelements
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
