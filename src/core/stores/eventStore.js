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
import { hasAPI, validateAPI, validateCallback } from '../helpers';

export default eventStore;

/**
 * Takes an event emitter and binds it with a store with respect to a list of events to listen to.
 * Each time one of the listed events is emitted, the store is updated with the result of the given callback,
 * or with the event emitter itself if no callback was given.
 * @param {string[]} events - A list of events to listen to.
 * @param {EventEmitter} boundTo - The event emitter to bind with the store.
 * @param {eventStoreUpdater} update - A callback that will be called for setting the store each time a listened event is emitted.
 * If it is omitted, the bound event emitter will be set on each update.
 * @return {EventStore}
 * @throws {TypeError} - If the given object is not an event emitter.
 * @throws {TypeError} - If the list of events is missing or empty.
 */
function eventStore(events, boundTo = null, update = null) {
    if (update) {
        validateCallback(update);
    }

    if (!Array.isArray(events) || !events.length) {
        throw new TypeError('A list of events is required!');
    }

    const { subscribe, set } = writable();
    const updater = update || (() => boundTo);
    let wrapper = null;

    /**
     * @lends EventStore
     */
    const EventStore = {
        /**
         * Adds a subscriber that will be notified each time a listened event is emitted.
         * @function subscribe
         * @param {function} subscriber - A callback that will receive notifications when a listened event is emitted.
         * @returns {function} - Returns a callback for removing the subscription.
         */
        subscribe,

        /**
         * The event emitter bound with the store.
         * @type {EventEmitter}
         */
        get boundTo() {
            return boundTo;
        },

        /**
         * Notifies the subscribers.
         * @param {string} event - The event name that originated the notification.
         * @returns {EventStore} - Chains the instance.
         */
        notify(event) {
            set(updater(boundTo, event));

            return this;
        },

        /**
         * Captures an event emitter.
         * @param {EventEmitter} emitter - The event emitter to bind with the store.
         * @returns {EventStore} - Chains the instance.
         * @throws {TypeError} - If the given object is not an event emitter.
         */
        bind(emitter) {
            eventEmitterMixin.validateListener(emitter);

            this.unbind();

            boundTo = emitter;
            wrapper = eventEmitterMixin.delegateListener(emitter);
            events.forEach(event => {
                wrapper.on(event, () => this.notify(event));
            });

            return this.notify(null);
        },

        /**
         * Releases the event emitter.
         * @returns {EventStore} - Chains the instance.
         */
        unbind() {
            if (wrapper) {
                wrapper.off();
            }

            wrapper = null;
            boundTo = null;

            return this;
        }
    };

    if (boundTo) {
        EventStore.bind(boundTo);
    }

    return EventStore;
}

/**
 * A list of functions an EventStore must implement.
 */
const eventStoreAPI = ['subscribe', 'notify', 'bind', 'unbind'];

/**
 * Checks if an object implements the functions required to be an event store.
 * @param {*} store - The object to check.
 * @returns {boolean} - Return `true` if the object is a fully featured event store.
 */
eventStore.isEventStore = store => hasAPI(store, eventStoreAPI);

/**
 * Validates that a given object implement the EventStore API.
 * Otherwise, an error is thrown.
 * @param {*} store - The object to check.
 * @throws {TypeError} - If the given object does not implement the required API.
 */
eventStore.validateInstance = store => validateAPI(store, eventStoreAPI);

/**
 * A callback that will be called in order to set the store each time a listened event is emitted.
 * @param {EventEmitter} eventEmitter - The event emitter linked with the store.
 * @param {string} eventName - The name of the captured event.
 * @return {*} - Returns the value that will be stored.
 * @callback eventStoreUpdater
 */
