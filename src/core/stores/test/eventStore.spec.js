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

import { eventEmitterMixin } from '../../mixins';
import eventStore from '../eventStore.js';

describe('eventStore', () => {
    it('is a function', () => {
        expect(eventStore).toEqual(expect.any(Function));
    });

    describe('throws error', () => {
        it('if the given object cannot listen to events', () => {
            expect(() => eventStore(['set'], {})).toThrow(
                'The object must implement the functions: on, once, off, listens, delegate'
            );

            const store = eventStore(['set']);
            expect(() => store.bind({})).toThrow(
                'The object must implement the functions: on, once, off, listens, delegate'
            );
        });

        it('if the list of events is missing', () => {
            expect(() => eventStore()).toThrow('A list of events is required!');
        });

        it('if the list of events is empty', () => {
            expect(() => eventStore([])).toThrow('A list of events is required!');
        });

        it('if the callback is not a function', () => {
            expect(() => eventStore(['set'], eventEmitterMixin(), true)).toThrow('A callback function is expected!');
        });

        it('if the given object does not implement the EventStore API', () => {
            expect(() => eventStore.validateInstance({})).toThrow(
                'The object must implement the functions: subscribe, notify, bind, unbind'
            );
            expect(() => eventStore.validateInstance(eventStore(['set']))).not.toThrow();
        });
    });

    it('checks if an object is an event store', () => {
        expect(eventStore.isEventStore(eventStore(['set']))).toBeTruthy();
        expect(eventStore.isEventStore({})).toBeFalsy();
        expect(eventStore.isEventStore(void 0)).toBeFalsy();
    });

    it('creates a store', () => {
        const eventEmitter = eventEmitterMixin();
        const store = eventStore(['set'], eventEmitter);

        expect(store).toEqual(expect.any(Object));
        expect(store.subscribe).toEqual(expect.any(Function));
        expect(store.notify).toEqual(expect.any(Function));
        expect(store.pause).toEqual(expect.any(Function));
        expect(store.resume).toEqual(expect.any(Function));
        expect(store.bind).toEqual(expect.any(Function));
        expect(store.unbind).toEqual(expect.any(Function));
        expect(store.boundTo).toBe(eventEmitter);
        expect(store.paused).toBeFalsy();
    });

    it('updates the store each time a listed event is emitted', () => {
        const eventEmitter = eventEmitterMixin();
        const store = eventStore(['set', 'add'], eventEmitter);

        expect(store.boundTo).toBe(eventEmitter);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(eventEmitter);
        });

        store.subscribe(callback);

        eventEmitter.emit('set');
        eventEmitter.emit('add');

        expect(callback).toHaveBeenCalledTimes(3);
    });

    it('updates the store when calling the notify API', () => {
        const eventEmitter = eventEmitterMixin();
        let currentEvent = null;
        const updateCallback = jest.fn().mockImplementation((value, event) => {
            expect(event).toBe(currentEvent);
            expect(value).toBe(eventEmitter);
            return value;
        });
        const store = eventStore(['set', 'add'], eventEmitter, updateCallback);

        expect(store.boundTo).toBe(eventEmitter);

        const subscriberCallback = jest.fn().mockImplementation(value => {
            expect(value).toBe(eventEmitter);
        });

        store.subscribe(subscriberCallback);

        currentEvent = 'test';
        store.notify(currentEvent);

        expect(updateCallback).toHaveBeenCalledTimes(2);
        expect(subscriberCallback).toHaveBeenCalledTimes(2);
    });

    it('can bind the event emitter later', () => {
        const eventEmitter = eventEmitterMixin();
        const store = eventStore(['set', 'add']);

        const callback = jest.fn().mockImplementation(value => {
            if (value) {
                expect(value).toBe(eventEmitter);
            }
        });

        store.subscribe(callback);

        eventEmitter.emit('set');
        eventEmitter.emit('add');

        expect(store.boundTo).toBeNull();
        expect(store.bind(eventEmitter)).toBe(store);
        expect(store.boundTo).toBe(eventEmitter);

        eventEmitter.emit('set');
        eventEmitter.emit('add');

        expect(callback).toHaveBeenCalledTimes(4);
    });

    it('can replace the event emitter later', () => {
        const eventEmitter1 = eventEmitterMixin();
        const eventEmitter2 = eventEmitterMixin();
        const store = eventStore(['set', 'add'], eventEmitter1);

        const callback1 = jest.fn().mockImplementation(value => {
            expect(value).toBe(eventEmitter1);
        });

        const callback2 = jest.fn().mockImplementation(value => {
            expect(value).toBe(eventEmitter2);
        });

        const unsubscribe = store.subscribe(callback1);

        unsubscribe();

        expect(store.boundTo).toBe(eventEmitter1);

        store.bind(eventEmitter2);
        store.subscribe(callback2);

        expect(store.boundTo).toBe(eventEmitter2);

        eventEmitter2.emit('set');
        eventEmitter2.emit('add');

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(3);
    });

    it('accepts a callback to set the store each time a listed event is emitted', () => {
        const eventEmitter = eventEmitterMixin();
        const data = {};

        let currentEvent = null;
        const update = jest.fn().mockImplementation((value, event) => {
            expect(event).toBe(currentEvent);
            expect(value).toBe(eventEmitter);
            return data;
        });

        const store = eventStore(['set'], eventEmitter, update);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(data);
        });

        store.subscribe(callback);

        currentEvent = 'set';
        eventEmitter.emit(currentEvent);

        expect(update).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('can release the listeners', () => {
        const eventEmitter = eventEmitterMixin();
        const store = eventStore(['set'], eventEmitter);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(eventEmitter);
        });

        store.subscribe(callback);

        eventEmitter.emit('set');

        expect(store.boundTo).toBe(eventEmitter);

        expect(store.unbind()).toBe(store);

        expect(store.boundTo).toBeNull();

        eventEmitter.emit('set');

        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('does not impact the other listeners when releasing', () => {
        const eventEmitter = eventEmitterMixin();
        const store = eventStore(['set'], eventEmitter);

        const listener = jest.fn();

        eventEmitter.on('set', listener);

        eventEmitter.emit('set');

        store.unbind();

        eventEmitter.emit('set');

        expect(listener).toHaveBeenCalledTimes(2);
    });

    it('can pause the listening', () => {
        const eventEmitter = eventEmitterMixin();
        const store = eventStore(['set', 'add'], eventEmitter);

        expect(store.boundTo).toBe(eventEmitter);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(eventEmitter);
        });

        store.subscribe(callback);

        store.pause();

        expect(store.paused).toBeTruthy();

        eventEmitter.emit('set');
        eventEmitter.emit('add');

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can resume the listening', () => {
        const eventEmitter = eventEmitterMixin();
        const store = eventStore(['set', 'add'], eventEmitter);

        expect(store.boundTo).toBe(eventEmitter);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(eventEmitter);
        });

        store.subscribe(callback);

        store.pause();
        expect(store.paused).toBeTruthy();

        store.resume();
        expect(store.paused).toBeFalsy();

        eventEmitter.emit('set');
        eventEmitter.emit('add');

        expect(callback).toHaveBeenCalledTimes(4);
    });
});
