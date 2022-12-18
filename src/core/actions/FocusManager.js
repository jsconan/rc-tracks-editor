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
import { DeferredAction } from './DeferredAction.js';

/**
 * Represents a focus manager.
 * It helps distinguish focus triggered by keyboard navigation from one triggered by a mouse click.
 */
export class FocusManager {
    /**
     * The object responsible for delaying the detection.
     * @type {DeferredAction}
     * @private
     */
    #deferredAction = null;

    /**
     * Creates a focus manager.
     * It helps distinguish focus triggered by keyboard navigation from one triggered by a mouse click.
     * @param {number} delay - The detection delay.
     */
    constructor(delay = 100) {
        eventEmitterMixin(this);

        this.#deferredAction = new DeferredAction(delay);

        this.#deferredAction.register((...args) => this.emit('focus', ...args));
    }

    /**
     * Starts focus detection. The focus will only occur if the action is not canceled.
     * If will be canceled if a click occurs, or if the blur action is called.
     * @param {...*} args - A list of arguments to pass to every event listeners.
     * @returns {FocusManager} - Chains the instance.
     * @fires focus
     */
    focus(...args) {
        this.#deferredAction.defer(null, ...args);

        return this;
    }

    /**
     * Blur action. It also cancels the focus is was still pending.
     * @param {...*} args - A list of arguments to pass to every event listeners.
     * @returns {FocusManager} - Chains the instance.
     * @fires blur
     */
    blur(...args) {
        this.#deferredAction.cancel();

        this.emit('blur', ...args);

        return this;
    }

    /**
     * Click action. It also cancels the focus is was still pending.
     * @param {...*} args - A list of arguments to pass to every event listeners.
     * @returns {FocusManager} - Chains the instance.
     * @fires click
     */
    click(...args) {
        this.#deferredAction.cancel();

        this.emit('click', ...args);

        return this;
    }
}
