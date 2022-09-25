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
import { assign, validateCallback } from '../helpers';

/**
 * Takes an event emitter and links it to a store with respect to a list of events to listen to.
 * Each time one of the listed events is emitted, the store is updated with the result of the callback.
 * @param {EventEmitter} eventEmitter - The event emitter to observe.
 * @param {string[]} events - A list of events to listen to.
 * @param {updater} update - A callback that will be called in order to set the store each time a listened event is emitted. It it is omitted, the event emitter will be set on each update.
 * @return {EventStore}
 * @throws {TypeError} - If the given object is not an event emitter.
 * @throws {TypeError} - If the list of events is missing or empty.
 */
export default (eventEmitter, events, update = null) => {
    eventEmitterMixin.validateListener(eventEmitter);

    if (!Array.isArray(events) || !events.length) {
        throw new TypeError('A list of events is required!');
    }

    if (update) {
        validateCallback(update);
    } else {
        update = () => eventEmitter;
    }

    const { subscribe, set } = writable(update(eventEmitter));
    const wrapper = assign({}, eventEmitter);

    events.forEach(event => {
        wrapper.on(event, () => set(update(eventEmitter)));
    });

    /**
     * @lends EventStore
     */
    return {
        /**
         * Adds a subscriber that will be notified each time a listened event is emitted.
         * @function subscribe
         * @param {function} subscriber - A callback that will receive notifications when a listened event is emitted.
         * @returns {function} - Returns a callback for removing the subscription.
         */
        subscribe,

        /**
         * Releases the event listeners.
         */
        destroy() {
            wrapper.off();
        }
    };
};

/**
 * A callback that will be called in order to set the store each time a listened event is emitted.
 * @param {EventEmitter} eventEmitter - The event emitter linked with the store.
 * @callback updater
 */
