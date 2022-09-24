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

import eventEmitterMixin from '../eventEmitter.js';

describe('eventEmitter', () => {
    it('is a mixin helper', () => {
        expect(eventEmitterMixin).toEqual(expect.any(Function));
    });

    it('returns the target object', () => {
        const object = {
            action() {}
        };
        expect(eventEmitterMixin(object)).toBe(object);
    });

    it('returns a new object is none is supplied', () => {
        expect(eventEmitterMixin()).toBeDefined();
        expect(eventEmitterMixin().constructor).toBe(Object);
        expect(eventEmitterMixin()).not.toBe(eventEmitterMixin());
    });

    it.each(['on', 'once', 'off', 'listens', 'emit', 'delegate'])('add the API %s', api => {
        expect(eventEmitterMixin()[api]).toEqual(expect.any(Function));
    });

    it('can also mix in additional objects', () => {
        const object = {};
        const mixin1 = {
            action() {}
        };
        const mixin2 = {
            run() {}
        };
        expect(eventEmitterMixin(object, mixin1, mixin2)).toBe(object);
        expect(object.action).toBe(mixin1.action);
        expect(object.run).toBe(mixin2.run);
    });
});

describe('EventEmitter', () => {
    it('can register an event listener', () => {
        const object = eventEmitterMixin();
        const listener = jest.fn();
        const name = 'name';

        expect(object.on(name, listener)).toBe(object);
        expect(object.listens(name, listener)).toBeTruthy();

        object.emit(name);

        expect(listener).toHaveBeenCalled();
    });

    it('can register an event listener that runs only once', () => {
        const object = eventEmitterMixin();
        const listener = jest.fn();
        const name = 'name';

        expect(object.once(name, listener)).toBe(object);
        expect(object.listens(name, listener)).toBeTruthy();

        object.emit(name);
        object.emit(name);

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('cannot register the same event listener twice', () => {
        const object = eventEmitterMixin();
        const listener = jest.fn();
        const name = 'name';

        object.on(name, listener);
        object.on(name, listener);
        object.emit(name);

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('can check if an event is listened', () => {
        const object = eventEmitterMixin();
        const listener = jest.fn();
        const name = 'name';

        expect(object.listens(name)).toBeFalsy();
        expect(object.listens(name, listener)).toBeFalsy();

        object.on(name, listener);

        expect(object.listens(name)).toBeTruthy();
        expect(object.listens(name, listener)).toBeTruthy();
        expect(object.listens(name, () => {})).toBeFalsy();
    });

    it('can emit events', () => {
        const object = eventEmitterMixin();
        const listener = jest.fn();
        const name = 'name';

        object.on(name, listener);

        expect(() => object.emit()).not.toThrow();

        expect(object.emit(name)).toBe(object);
        expect(listener).toHaveBeenCalledTimes(1);

        object.emit(name);
        expect(listener).toHaveBeenCalledTimes(2);
    });

    it('can emit events with parameters', () => {
        const object = eventEmitterMixin();
        const name = 'name';
        const value1 = 'test';
        const value2 = 42;
        const listener = jest.fn().mockImplementation(function (param1, param2) {
            expect(this).toBe(object);
            expect(param1).toBe(value1);
            expect(param2).toBe(value2);
        });

        object.on(name, listener);
        object.emit(name, value1, value2);

        expect(listener).toHaveBeenCalled();
    });

    it('can delegate an event to another emitter', () => {
        const object = eventEmitterMixin();
        const other = eventEmitterMixin();
        const listener = jest.fn();
        const name = 'name';
        const delegateListener = object.delegate(name, other);

        expect(delegateListener).toEqual(expect.any(Function));
        expect(object.listens(name, delegateListener)).toBeTruthy();

        other.on(name, listener);
        object.emit(name);

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('can delegate an event to another emitter and add parameters', () => {
        const object = eventEmitterMixin();
        const other = eventEmitterMixin();
        const name = 'name';
        const value1 = 'test';
        const value2 = 42;

        const listener = jest.fn().mockImplementation(function (param1, param2) {
            expect(this).toBe(other);
            expect(param1).toBe(value1);
            expect(param2).toBe(value2);
        });

        const delegateListener = object.delegate(name, other, value2);
        expect(object.listens(name, delegateListener)).toBeTruthy();

        other.on(name, listener);
        object.emit(name, value1);

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it.each([void 0, '', 'listener', true, [], {}])(
        'needs valid callbacks for the listeners [listener = %s]',
        listener => {
            const object = eventEmitterMixin();
            const name = 'name';

            expect(() => object.on(name, listener)).not.toThrow();
            expect(() => object.once(name, listener)).not.toThrow();
            expect(() => object.delegate()).not.toThrow();
            expect(() => object.delegate(name)).not.toThrow();
            expect(() => object.delegate(name, {})).not.toThrow();
            expect(object.listens(name)).toBeFalsy();
        }
    );

    it('can unregister an event listener', () => {
        const object = eventEmitterMixin();
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        const name = 'name';

        object.on(name, listener1);
        object.on(name, listener2);
        expect(object.listens(name)).toBeTruthy();

        object.emit(name);
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(1);

        expect(object.off(name, listener1)).toBe(object);
        expect(object.listens(name)).toBeTruthy();

        object.emit(name);
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(2);

        expect(object.off(name)).toBe(object);
        expect(object.listens(name)).toBeFalsy();

        object.emit(name);
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(2);
    });

    it('can unregister a listener that should run only once', () => {
        const object = eventEmitterMixin();
        const listener = jest.fn();
        const name = 'name';

        object.once(name, listener);
        expect(object.listens(name, listener)).toBeTruthy();

        object.off(name, listener);
        expect(object.listens(name, listener)).toBeFalsy();

        object.emit(name);
        expect(listener).toHaveBeenCalledTimes(0);
    });

    it('can unregister a delegated event', () => {
        const object = eventEmitterMixin();
        const other = eventEmitterMixin();
        const listener = jest.fn();
        const name = 'name';

        const delegateListener = object.delegate(name, other);
        expect(object.listens(name, delegateListener)).toBeTruthy();

        other.on(name, listener);

        object.emit(name);
        expect(listener).toHaveBeenCalledTimes(1);

        object.off(name, delegateListener);
        expect(object.listens(name, delegateListener)).toBeFalsy();

        object.emit(name);
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('can remove all event listeners', () => {
        const object = eventEmitterMixin();
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        object.on('ev1', listener1);
        object.on('ev2', listener2);
        expect(object.listens('ev1')).toBeTruthy();
        expect(object.listens('ev2')).toBeTruthy();

        expect(object.off()).toBe(object);
        expect(object.listens('ev1')).toBeFalsy();
        expect(object.listens('ev2')).toBeFalsy();

        object.emit('ev1');
        object.emit('ev2');

        expect(listener1).not.toHaveBeenCalled();
        expect(listener2).not.toHaveBeenCalled();
    });

    it('can remove all event listeners from the main scope', () => {
        const object = eventEmitterMixin();
        const shared = Object.assign({}, object);
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        const name = 'name';

        object.on(name, listener1);
        shared.on(name, listener2);
        expect(object.listens(name)).toBeTruthy();
        expect(shared.listens(name)).toBeTruthy();

        object.off();
        expect(object.listens(name)).toBeFalsy();
        expect(shared.listens(name)).toBeFalsy();

        object.emit(name);

        expect(listener1).not.toHaveBeenCalled();
        expect(listener2).not.toHaveBeenCalled();
    });

    it('can remove any event listeners from the main scope', () => {
        const object = eventEmitterMixin();
        const shared = Object.assign({}, object);
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        const name = 'name';

        object.on(name, listener1);
        shared.on(name, listener2);
        expect(object.listens(name)).toBeTruthy();
        expect(shared.listens(name)).toBeTruthy();

        object.off(name, listener1);
        object.off(name, listener2);
        expect(object.listens(name)).toBeFalsy();
        expect(shared.listens(name)).toBeFalsy();

        object.emit(name);

        expect(listener1).not.toHaveBeenCalled();
        expect(listener2).not.toHaveBeenCalled();
    });

    it('protects from removing all listeners not belonging to the same scope', () => {
        const object = eventEmitterMixin();
        const shared = Object.assign({}, object);
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        const name = 'name';

        object.on(name, listener1);
        shared.on(name, listener2);
        expect(object.listens(name, listener1)).toBeTruthy();
        expect(object.listens(name, listener2)).toBeTruthy();

        shared.off();
        expect(object.listens(name, listener1)).toBeTruthy();
        expect(object.listens(name, listener2)).toBeFalsy();

        object.emit(name);

        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(0);
    });

    it('protects from removing any listeners not belonging to the same scope', () => {
        const object = eventEmitterMixin();
        const shared = Object.assign({}, object);
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        const name = 'name';

        object.on(name, listener1);
        shared.on(name, listener2);
        expect(object.listens(name, listener1)).toBeTruthy();
        expect(object.listens(name, listener2)).toBeTruthy();

        shared.off(name);
        shared.off('event');
        expect(object.listens(name, listener1)).toBeTruthy();
        expect(object.listens(name, listener2)).toBeFalsy();

        object.emit(name);

        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(0);
    });

    it('protects from removing particular listeners not belonging to the same scope', () => {
        const object = eventEmitterMixin();
        const shared = Object.assign({}, object);
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        const name = 'name';

        object.on(name, listener1);
        shared.on(name, listener2);
        shared.off(name, () => {});
        expect(object.listens(name, listener1)).toBeTruthy();
        expect(object.listens(name, listener2)).toBeTruthy();

        shared.off(name, listener1);
        shared.off(name, listener2);
        expect(object.listens(name, listener1)).toBeTruthy();
        expect(object.listens(name, listener2)).toBeFalsy();

        object.emit(name);

        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(0);
    });

    it('can add or remove listeners from emitted events', () => {
        const object = eventEmitterMixin();
        const name = 'name';
        const listener3 = jest.fn();
        const listener2 = jest.fn();
        const listener1 = jest.fn().mockImplementation(() => {
            object.off(name, listener1);
            object.off(name, listener2);
            object.on(name, listener3);
        });

        object.on(name, listener1);
        object.on(name, listener2);

        object.emit(name);
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(1);
        expect(listener3).toHaveBeenCalledTimes(0);

        object.emit(name);
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(1);
        expect(listener3).toHaveBeenCalledTimes(1);
    });

    it('binds the listener context upon install', () => {
        const object = eventEmitterMixin();
        const name = 'name';

        const context1 = Object.assign({}, object);
        const context2 = Object.assign({}, object);

        const listener1 = jest.fn().mockImplementation(function () {
            expect(this).toBe(context1);
        });

        const listener2 = jest.fn().mockImplementation(function () {
            expect(this).toBe(context2);
        });

        const listener3 = jest.fn().mockImplementation(function () {
            expect(this).toBe(context2);
        });

        const listener4 = jest.fn().mockImplementation(function () {
            expect(this).toBe(object);
        });

        const listener5 = jest.fn().mockImplementation(function () {
            expect(this).toBe(object);
        });

        context1.on(name, listener1);
        context2.on(name, listener2);
        context2.once(name, listener3);
        object.on(name, listener4);
        object.once(name, listener5);
        object.emit(name);
        context1.emit(name);
        context2.emit(name);

        expect(listener1).toHaveBeenCalledTimes(3);
        expect(listener2).toHaveBeenCalledTimes(3);
        expect(listener3).toHaveBeenCalledTimes(1);
        expect(listener4).toHaveBeenCalledTimes(3);
        expect(listener5).toHaveBeenCalledTimes(1);
    });
});
