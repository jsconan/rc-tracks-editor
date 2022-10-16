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

import { DoubleMap } from '../models/DoubleMap.js';
import { eachWord, hasAPI, mixin, pick, validateAPI } from '../helpers';

export default eventEmitterMixin;

/**
 * Takes any object and mixes in the `EventEmitter` API.
 * @param {object} [target] - The object to augment with the `EventEmitter` API. If none is supplied, an empty object is created.
 * @param  {...object} mixins - A list of additional mixins to add to the target.
 * @returns {EventEmitter} - Returns the supplied object, augmented with the `EventEmitter` API.
 */
function eventEmitterMixin(target, ...mixins) {
    const events = new DoubleMap();
    target = target || {};

    /**
     * Defines the event emitter API. It adds methods to add and remove event listeners, and to emit events.
     * It can be installed to any object thanks to the helper `eventEmitterMixin`.
     * @lends EventEmitter
     * @mixin EventEmitter
     */
    const EventEmitter = {
        /**
         * Adds a listener for a particular event. It will be invoked each time an event is emitted for the given name.
         *
         * It can be removed later thanks to the `EventEmitter.off` API. The reference to the listener will be
         * needed to perform an exclusive removal. Otherwise, all registered events will need to be removed together.
         *
         * The installed listener will receive all the parameters that have been supplied with the event upon emitting
         * it, in the same order. Its lexical `this` is bound to the object on which the listener was attached. If the
         * event is emitted from another context, if won't have impact on it.
         * @param {string} name - The event to listen to.
         * @param {function} listener - The event listener that will be called when the event will be emitted.
         * @returns {EventEmitter} - Chains the `EventEmitter` instance.
         */
        on(name, listener) {
            if ('undefined' !== typeof name && 'function' === typeof listener) {
                eachWord(name, event => {
                    events.set(event, listener, {
                        bind: this
                    });
                });
            }
            return this;
        },

        /**
         * Registers an event listener that will be called only once.
         *
         * It can be removed later thanks to the `EventEmitter.off` API. The reference to the listener will be
         * needed to perform an exclusive removal. Otherwise, all registered events will need to be removed together.
         *
         * The installed listener will receive all the parameters that have been supplied with the event upon emitting
         * it, in the same order. Its lexical `this` is bound to the object on which the listener was attached. If the
         * event is emitted from another context, if won't have impact on it.
         * @param {string} name - The event to listen to.
         * @param {function} listener - The event listener that will be called when the event will be emitted.
         * @returns {EventEmitter} - Chains the `EventEmitter` instance.
         */
        once(name, listener) {
            if ('undefined' !== typeof name && 'function' === typeof listener) {
                eachWord(name, event => {
                    events.set(event, listener, {
                        once: true,
                        bind: this
                    });
                });
            }
            return this;
        },

        /**
         * Removes a listener for a particular event. When only the name is supplied, all listeners bound to this
         * name will be removed. If the listener is also supplied, only this particular one will be removed.
         *
         * As the `EventEmitter` can be delegated to other objects than the target, a scope protection is
         * implemented to prevent removal of listeners that don't belong to the same from delegated objects. Here is
         * an example:
         *
         * ```javascript
         * // The main scope for the event emitter
         * const object = eventEmitterMixin();
         *
         * // Delegate the event emitter to another object
         * const delegate = Object.assign({}, object);
         *
         * // Register a listener to the main scope
         * object.on('event', listener1);
         *
         * // Register another listener to the delegated scope
         * delegate.on('event', listener2);
         *
         * // The event will be captured by all listeners from the main and the delegated scopes
         * object.emit('event');
         *
         * // Remove all listener from the delegated scope, but leave the main scope intact
         * delegate.off();
         *
         * // The event will be captured by all listeners but those from the delegated scope
         * object.emit('event');
         *
         * // This will not have any effect since the delegate scope cannot remove listener from the main scope
         * delegate.off('event', listener1);
         * ```
         * @param {string} name - The listened to event to unregister.
         * @param {function} listener - The event listener to remove.
         * @returns {EventEmitter} - Chains the `EventEmitter` instance.
         */
        off(name, listener) {
            if ('undefined' === typeof name) {
                if (this === target) {
                    // This is the main scope, we can remove all listeners
                    events.clear();
                } else {
                    // This is a delegated scope, we can only remove the listeners bound to it
                    for (const [eventName, eventListener, options] of events) {
                        if (this === options.bind) {
                            events.delete(eventName, eventListener);
                        }
                    }
                }
            } else {
                eachWord(name, event => {
                    if (events.has(event)) {
                        if (this === target) {
                            // This is the main scope, we can remove any listeners
                            events.delete(event, listener);
                        } else {
                            // This is a delegated scope, we can only remove the listeners bound to it
                            const eventsQueue = events.get(event);
                            if (listener) {
                                const options = eventsQueue.get(listener);
                                if (options && this === options.bind) {
                                    events.delete(event, listener);
                                }
                            } else {
                                for (const [eventListener, options] of eventsQueue) {
                                    if (this === options.bind) {
                                        events.delete(event, eventListener);
                                    }
                                }
                            }
                        }
                    }
                });
            }
            return this;
        },

        /**
         * Tells whether or not an event has listeners. If the listener is supplied, it will returns truthy
         * only if the listener is bound to the given event.
         * @param {string} name - The event to check.
         * @param {function} [listener] - An optional event listener to check.
         * @returns {boolean} - Returns `true` if the event listener exists.
         */
        listens(name, listener) {
            return events.has(name, listener);
        },

        /**
         * Emits an event. Calls all listeners that are bound to this event if any. The listeners are called
         * synchronously and in order. All supplied parameters will also be added to the listeners calls, in
         * the same order. The lexical `this` of each listener has been bound upon install. This means that
         * if the event is emitted from a delegated object, it won't have impact on this context.
         * @param {string} name - The event to emit.
         * @param {...any} args - A list of arguments to pass to every event listeners.
         * @returns {EventEmitter} - Chains the `EventEmitter` instance.
         */
        emit(name, ...args) {
            const eventsQueue = events.get(name);
            if (eventsQueue && eventsQueue.size) {
                // Freeze the list of listeners to avoid any add/remove in between to change the flow
                const eventList = [...eventsQueue];

                // Call all listeners in order
                const len = eventList.length;
                let i = 0;
                while (i < len) {
                    const [listener, options] = eventList[i++];
                    if (options.once) {
                        events.delete(name, listener);
                    }
                    listener.apply(options.bind, args);
                }
            }
            return this;
        },

        /**
         * Delegates an event to another `EventEmitter`.
         *
         * When the event is emitted, it is also emitted by the other `EventEmitter`.
         *
         * The installed listener is returned so that it is possible to remove the event delegation using `EventEmitter.off`.
         * @param {string} name - The event to delegate.
         * @param {EventEmitter} delegate - Another `EventEmitter` that will receive the event.
         * @param  {...any} params - A list of additional parameters to send to the listeners. They will be added to the parameters sent by the original emitter.
         * @returns {function} - Returns the event listener created to catch the events. It can be used to remove the event delegation.
         */
        delegate(name, delegate, ...params) {
            if ('undefined' !== typeof name && delegate && 'function' === typeof delegate.emit) {
                const listener = (...args) => delegate.emit(name, ...args, ...params);
                this.on(name, listener);
                return listener;
            }
        }
    };

    return mixin(target, EventEmitter, ...mixins);
}

/**
 * A list of functions an object must implement to be an event emitter.
 */
const emitterAPI = ['emit'];

/**
 * A list of functions an object must implement to allow events listening.
 */
const listenerAPI = ['on', 'once', 'off', 'listens', 'delegate'];

/**
 * A list of functions an object must implement to be a fully featured event emitter.
 */
const fullAPI = [...emitterAPI, ...listenerAPI];

/**
 * Checks if an object implements the functions required to emit events.
 * @param {*} eventEmitter - The object to check.
 * @returns {boolean} - Return `true` if the object can emit events.
 */
eventEmitterMixin.canEmit = eventEmitter => hasAPI(eventEmitter, emitterAPI);

/**
 * Checks if an object implements the functions required to listen to events.
 * @param {*} eventEmitter - The object to check.
 * @returns {boolean} - Return `true` if the object offers to listen to events.
 */
eventEmitterMixin.canListen = eventEmitter => hasAPI(eventEmitter, listenerAPI);

/**
 * Checks if an object implements the functions required to be a fully featured event emitter.
 * @param {*} eventEmitter - The object to check.
 * @returns {boolean} - Return `true` if the object is a fully featured event emitter.
 */
eventEmitterMixin.isEventEmitter = eventEmitter => hasAPI(eventEmitter, fullAPI);

/**
 * Validates that a given object implement the API to emit events.
 * Otherwise, an error is thrown.
 * @param {*} eventEmitter - The object to check.
 * @throws {TypeError} - If the given object does not implement the required API.
 */
eventEmitterMixin.validateEmitter = eventEmitter => validateAPI(eventEmitter, emitterAPI);

/**
 * Validates that a given object implement the API to listen to events.
 * Otherwise, an error is thrown.
 * @param {*} eventEmitter - The object to check.
 * @throws {TypeError} - If the given object does not implement the required API.
 */
eventEmitterMixin.validateListener = eventEmitter => validateAPI(eventEmitter, listenerAPI);

/**
 * Validates that a given object implement the EventEmitter API.
 * Otherwise, an error is thrown.
 * @param {*} eventEmitter - The object to check.
 * @throws {TypeError} - If the given object does not implement the required API.
 */
eventEmitterMixin.validateInstance = eventEmitter => validateAPI(eventEmitter, fullAPI);

/**
 * Delegates the emitter API from an event emitter to a target object.
 * If the target is omitted, an empty object is created to receive the API.
 * @param {EventEmitter} eventEmitter - The source event emitter to delegate.
 * @param {*} [target] - A target that will receive the emitter API bound to the source event emitter.
 * @returns {EventEmitter} - The target augmented with the emitter API.
 */
eventEmitterMixin.delegateEmitter = (eventEmitter, target = null) => pick(target || {}, emitterAPI, eventEmitter);

/**
 * Delegates the listener API from an event emitter to a target object.
 * If the target is omitted, an empty object is created to receive the API.
 * @param {EventEmitter} eventEmitter - The source event emitter to delegate.
 * @param {*} [target] - A target that will receive the listener API bound to the source event emitter.
 * @returns {EventEmitter} - The target augmented with the listener API.
 */
eventEmitterMixin.delegateListener = (eventEmitter, target = null) => pick(target || {}, listenerAPI, eventEmitter);

/**
 * Delegates the event emitter API from an event emitter to a target object.
 * If the target is omitted, an empty object is created to receive the API.
 * @param {EventEmitter} eventEmitter - The source event emitter to delegate.
 * @param {*} [target] - A target that will receive the event emitter API bound to the source event emitter.
 * @returns {EventEmitter} - The target augmented with the event emitter API.
 */
eventEmitterMixin.delegate = (eventEmitter, target) => pick(target || {}, fullAPI, eventEmitter);
