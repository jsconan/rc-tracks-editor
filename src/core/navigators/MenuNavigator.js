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
     * Gets the number of elements in the menu.
     * @type {number}
     */
    get length() {
        return this.#focus.length;
    }

    /**
     * Gets the list of elements in the menu.
     * @type {Array}
     */
    get elements() {
        return this.#focus.elements;
    }

    /**
     * Sets the list of elements in the menu.
     * @param {*} elements - The list of elements in the menu.
     * @fires setelements
     */
    set elements(elements) {
        this.#focus.elements = elements;
        this.#hover.elements = elements;
    }

    /**
     * Gets the element that will be focused by default.
     * @type {*}
     */
    get defaultFocused() {
        return this.#focus.defaultSelected;
    }

    /**
     * Sets the index of the element that will be focused by default. `null` means no element.
     * @param {*} element - The element that will be focused by default.
     */
    set defaultFocused(element) {
        this.#focus.defaultSelected = element;
    }

    /**
     * Gets the index of the element that will be focused by default. -1 means no element.
     * @type {number}
     */
    get defaultFocusedIndex() {
        return this.#focus.defaultSelectedIndex;
    }

    /**
     * Sets the index of the element that will be focused by default. -1 means no element.
     * @param {number} index - The index of the element that will be focused by default.
     */
    set defaultFocusedIndex(index) {
        this.#focus.defaultSelectedIndex = index;
    }

    /**
     * Gets the focused element.
     * @type {*}
     */
    get focused() {
        return this.#focus.selected;
    }

    /**
     * Sets the focused element.
     * @param {*} - element - The focused element.
     * @fires blur
     * @fires focus
     */
    set focused(element) {
        this.#focus.selected = element;
    }

    /**
     * Gets the index of the focused element. -1 means no element is focused.
     * @type {number}
     */
    get focusedIndex() {
        return this.#focus.selectedIndex;
    }

    /**
     * Sets the index of the focused element. -1 means no element is focused.
     * @param {number} index - The index of the focused element in the menu.
     * @fires blur
     * @fires focus
     */
    set focusedIndex(index) {
        this.#focus.selectedIndex = index;
    }

    /**
     * Gets the hovered element.
     * @type {*}
     */
    get hovered() {
        return this.#hover.selected;
    }

    /**
     * Sets the hovered element.
     * @param {*} - element - The hovered element.
     * @fires leave
     * @fires enter
     */
    set hovered(element) {
        this.#hover.selected = element;
    }

    /**
     * Gets the index of the hovered element. -1 means no element is hovered.
     * @type {number}
     */
    get hoveredIndex() {
        return this.#hover.selectedIndex;
    }

    /**
     * Sets the index of the hovered element. -1 means no element is hovered.
     * @param {number} index - The index of the hovered element in the menu.
     * @fires leave
     * @fires enter
     */
    set hoveredIndex(index) {
        this.#hover.selectedIndex = index;
    }

    /**
     * Hovers the focused element.
     * @returns {MenuNavigator} - Chains the instance.
     * @fires leave
     * @fires enter
     */
    hoverFocused() {
        this.#hover.selectedIndex = this.#focus.selectedIndex;

        return this;
    }

    /**
     * Focuses the hovered element.
     * @returns {MenuNavigator} - Chains the instance.
     * @fires blur
     * @fires focus
     */
    focusHovered() {
        this.#focus.selectedIndex = this.#hover.selectedIndex;

        return this;
    }

    /**
     * Focuses the default element.
     * @returns {MenuNavigator} - Chains the instance.
     * @fires focus
     */
    focus() {
        this.#focus.select();

        return this;
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
