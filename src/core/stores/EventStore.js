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
import { eventEmitterMixin } from '../mixins';
import { validateCallback } from '../helpers';

/**
 * Takes an event emitter and binds it with a store with respect to a list of events to listen to.
 * Each time one of the listed events is emitted, the store is updated with the result of the given callback,
 * or with the event emitter itself if no callback was given.
 */
export class EventStore {
    /**
     * The update function called to refresh the store.
     * @type {eventStoreUpdater}
     * @private
     */
    #update;

    /**
     * A list of events to listen to.
     * @type {string[]}
     * @private
     */
    #events;

    /**
     * The internal store that is refreshed each time an event is captured.
     * @type {store}
     * @private
     */
    #store;

    /**
     * The event emitter bound with the store.
     * @type {EventEmitter}
     * @private
     */
    #boundTo = null;

    /**
     * A wrapper for scoping the events.
     * @type {EventEmitter}
     * @private
     */
    #wrapper = null;

    /**
     * Tells whether or not the store is listening to the bound emitter.
     * @type {boolean}
     * @private
     */
    #paused = false;

    /**
     * Takes an event emitter and binds it with a store with respect to a list of events to listen to.
     * Each time one of the listed events is emitted, the store is updated with the result of the given callback,
     * or with the event emitter itself if no callback was given.
     * @param {string[]} events - A list of events to listen to.
     * @param {EventEmitter} boundTo - The event emitter to bind with the store.
     * @param {eventStoreUpdater} update - A callback that will be called for setting the store each time a listened event is emitted.
     * If it is omitted, the bound event emitter will be set on each update.
     * @throws {TypeError} - If the given object is not an event emitter.
     * @throws {TypeError} - If the list of events is missing or empty.
     */
    constructor(events, boundTo = null, update = null) {
        if (!Array.isArray(events) || !events.length) {
            throw new TypeError('A list of events is required!');
        }

        if (update) {
            validateCallback(update);
        }

        this.#events = events;
        this.#store = writable();
        this.#update = update || (() => this.#boundTo);

        if (boundTo) {
            this.bind(boundTo);
        }
    }

    /**
     * Adds a subscriber that will be notified each time a listened event is emitted.
     * @function subscribe
     * @param {function} subscriber - A callback that will receive notifications when a listened event is emitted.
     * @returns {function} - Returns a callback for removing the subscription.
     */
    subscribe(subscriber) {
        return this.#store.subscribe(subscriber);
    }

    /**
     * The list of listened to events.
     * @type {string[]}
     */
    get events() {
        return [...this.#events];
    }

    /**
     * The event emitter bound with the store.
     * @type {EventEmitter}
     */
    get boundTo() {
        return this.#boundTo;
    }

    /**
     * Tells whether or not the store is listening to the bound emitter.
     * @returns {boolean} - Returns `true` if the store is not listening anymore.
     */
    get paused() {
        return this.#paused;
    }

    /**
     * Pauses the listening to the bound emitter.
     * @returns {EventStore} - Chains the instance.
     */
    pause() {
        this.#paused = true;

        return this;
    }

    /**
     * Resumes the listening to the bound emitter.
     * The store is refreshed and the subscribers are notified.
     * @returns {EventStore} - Chains the instance.
     */
    resume() {
        this.#paused = false;

        return this.notify(null);
    }

    /**
     * Refreshes the store and notifies the subscribers.
     * @param {string} event - The event name that originated the notification.
     * @returns {EventStore} - Chains the instance.
     */
    notify(event) {
        this.#store.set(this.#update(this.#boundTo, event));

        return this;
    }

    /**
     * Captures an event emitter.
     * The store is refreshed and the subscribers are notified.
     * @param {EventEmitter} emitter - The event emitter to bind with the store.
     * @returns {EventStore} - Chains the instance.
     * @throws {TypeError} - If the given object is not an event emitter.
     */
    bind(emitter) {
        eventEmitterMixin.validateListener(emitter);

        this.unbind();

        this.#boundTo = emitter;
        this.#wrapper = eventEmitterMixin.delegateListener(emitter);
        this.#events.forEach(event => {
            this.#wrapper.on(event, () => this.#paused || this.notify(event));
        });

        return this.resume();
    }

    /**
     * Releases the event emitter.
     * @returns {EventStore} - Chains the instance.
     */
    unbind() {
        if (this.#wrapper) {
            this.#wrapper.off();
        }

        this.#wrapper = null;
        this.#boundTo = null;

        return this;
    }

    /**
     * Validates that the given object is an instance of the class.
     * Otherwise, an error is thrown.
     * @param {object} obj - The instance to validate.
     * @throws {TypeError} - If the given object is not a valid instance.
     */
    static validateInstance(obj) {
        if (!(obj instanceof this)) {
            throw new TypeError(`The object must be an instance of ${this.name}!`);
        }
    }
}

/**
 * A callback that will be called in order to set the store each time a listened event is emitted.
 * @param {EventEmitter} eventEmitter - The event emitter linked with the store.
 * @param {string} eventName - The name of the captured event.
 * @return {*} - Returns the value that will be stored.
 * @callback eventStoreUpdater
 */
