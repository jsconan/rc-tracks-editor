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
            expect(() => eventStore({})).toThrow(
                'The object must implement the functions: on, once, off, listens, delegate'
            );
        });

        it('if the list of events is missing', () => {
            expect(() => eventStore(eventEmitterMixin())).toThrow('A list of events is required!');
        });

        it('if the list of events is empty', () => {
            expect(() => eventStore(eventEmitterMixin(), [])).toThrow('A list of events is required!');
        });

        it('if the callback is not a function', () => {
            expect(() => eventStore(eventEmitterMixin(), ['set'], true)).toThrow('A callback function is expected!');
        });
    });

    it('creates a store', () => {
        const eventEmitter = eventEmitterMixin();
        const store = eventStore(eventEmitter, ['set']);

        expect(store).toEqual(expect.any(Object));
        expect(store.subscribe).toEqual(expect.any(Function));
        expect(store.destroy).toEqual(expect.any(Function));
    });

    it('updates the store each time a listed event is emitted', () => {
        const eventEmitter = eventEmitterMixin();
        const store = eventStore(eventEmitter, ['set', 'add']);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(eventEmitter);
        });

        store.subscribe(callback);

        eventEmitter.emit('set');
        eventEmitter.emit('add');

        expect(callback).toHaveBeenCalledTimes(3);
    });

    it('accepts a callback to set the store each time a listed event is emitted', () => {
        const eventEmitter = eventEmitterMixin();
        const data = {};

        const update = jest.fn().mockImplementation(value => {
            expect(value).toBe(eventEmitter);
            return data;
        });

        const store = eventStore(eventEmitter, ['set'], update);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(data);
        });

        store.subscribe(callback);

        eventEmitter.emit('set');

        expect(update).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('releases the listeners when destroying', () => {
        const eventEmitter = eventEmitterMixin();
        const store = eventStore(eventEmitter, ['set']);

        const callback = jest.fn().mockImplementation(value => {
            expect(value).toBe(eventEmitter);
        });

        store.subscribe(callback);

        eventEmitter.emit('set');

        store.destroy();

        eventEmitter.emit('set');

        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('does not impact the other listeners when destroying', () => {
        const eventEmitter = eventEmitterMixin();
        const store = eventStore(eventEmitter, ['set']);

        const listener = jest.fn();

        eventEmitter.on('set', listener);

        eventEmitter.emit('set');

        store.destroy();

        eventEmitter.emit('set');

        expect(listener).toHaveBeenCalledTimes(2);
    });
});
