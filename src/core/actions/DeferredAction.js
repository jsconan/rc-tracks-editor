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

/**
 * Represents a deferred actions manager.
 */
export class DeferredAction {
    /**
     * The delay for the deferred action.
     * @type {number}
     * @private
     */
    #delay = null;

    /**
     * The list of actions to call once the delay has elapsed.
     * @type {Set}
     * @private
     */
    #actions = null;

    /**
     * A timeout identifier
     * @type {number}
     * @private
     */
    #timeout = null;

    /**
     * Creates a deferred actions manager.
     * Once the given delay has elapsed, all registered actions will be called.
     * @param {number} delay - The delay before calling the deferred actions.
     * @param {boolean} startImmediately - Whether or not start the defer immediately.
     * By default, it will wait for an explicit call to `defer()`.
     */
    constructor(delay = 0, startImmediately = false) {
        this.#actions = new Set();
        this.#delay = delay;

        if (startImmediately) {
            this.defer();
        }
    }

    /**
     * Tells if actions are pending to be processed.
     * @type {boolean}
     */
    get pending() {
        return this.#timeout !== null;
    }

    /**
     * Defers the registered actions.
     * Once the given delay has elapsed, all registered actions will be called.
     * @param {number} delay - The delay before calling the deferred actions.
     * @param  {...any} args - A set of additional parameters forwarded to each deferred action.
     * @returns {DeferredAction} - Chains the instance.
     */
    defer(delay = null, ...args) {
        if ('number' === typeof delay) {
            this.#delay = delay;
        }

        this.cancel();
        this.#timeout = setTimeout(() => this.process(...args), this.#delay);

        return this;
    }

    /**
     * Calls registered actions before the delay and cancel the defer.
     * If the delay already elapsed, noting will be called.
     * @param  {...any} args - A set of additional parameters forwarded to each deferred action.
     * @returns {DeferredAction} - Chains the instance.
     */
    process(...args) {
        if (this.#timeout === null) {
            return this;
        }

        this.cancel();

        this.#actions.forEach(action => action(...args));

        return this;
    }

    /**
     * Cancels the defer. The actions stay registered, but a new defer is required to call them.
     * @returns {DeferredAction} - Chains the instance.
     */
    cancel() {
        if (this.#timeout !== null) {
            clearTimeout(this.#timeout);
        }

        this.#timeout = null;

        return this;
    }

    /**
     * Registers a deferred action.
     * @param {function} action - The action to defer.
     * @returns {function} - Returns a callback for un-registering the action.
     * @throws {TypeError} - If the action is not a function.
     */
    register(action) {
        if ('function' !== typeof action) {
            throw new TypeError('A function is required to register an action!');
        }

        this.#actions.add(action);
        return () => this.unregister(action);
    }

    /**
     * Un-registers a deferred action.
     * @param {function} action - The action to unregister.
     * @returns {boolean} - Returns `true` if the action has been un-registered; otherwise `false`.
     */
    unregister(action) {
        return this.#actions.delete(action);
    }

    /**
     * Tells if a particular action is registered.
     * @param {function} action - The action to check.
     * @returns {boolean} - Returns `true` if the action is registered; otherwise `false`.
     */
    isRegistered(action) {
        return this.#actions.has(action);
    }

    /**
     * Un-registers all deferred actions.
     * @returns {DeferredAction} - Chains the instance.
     */
    clear() {
        this.#actions.clear();
        return this;
    }
}
