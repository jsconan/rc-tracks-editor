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

import { DeferredAction } from '../DeferredAction.js';

const delay = ms => new Promise(elapsed => setTimeout(elapsed, ms));
const getActionPromise = action =>
    new Promise(resolve => {
        action.mockImplementation(() => {
            resolve();
        });
    });

describe('DeferredAction', () => {
    it('is a class', () => {
        expect(DeferredAction).toEqual(expect.any(Function));
    });

    it('does not defer action by default', async () => {
        const deferred = new DeferredAction();
        const action = jest.fn();

        deferred.register(action);

        await delay(1);

        expect(action).not.toHaveBeenCalled();
    });

    it('defers action when allowed', async () => {
        const deferred = new DeferredAction(0, true);
        const action = jest.fn();
        const actionCalled = getActionPromise(action);

        deferred.register(action);

        await actionCalled;

        expect(action).toHaveBeenCalledTimes(1);
    });

    it('defers action after a delay', async () => {
        const deferred = new DeferredAction(10, true);
        const action = jest.fn();
        const actionCalled = getActionPromise(action);

        deferred.register(action);

        await delay(5);
        expect(action).not.toHaveBeenCalled();

        await actionCalled;
        expect(action).toHaveBeenCalledTimes(1);
    });

    it('defers action later', async () => {
        const deferred = new DeferredAction();
        const action = jest.fn();
        const actionCalled = getActionPromise(action);

        deferred.register(action);

        await delay(1);

        expect(action).not.toHaveBeenCalled();

        expect(deferred.defer()).toBe(deferred);

        await actionCalled;
        expect(action).toHaveBeenCalledTimes(1);
    });

    it('defers action later with a delay', async () => {
        const deferred = new DeferredAction();
        const action = jest.fn();
        const actionCalled = getActionPromise(action);

        deferred.register(action);

        await delay(1);

        expect(action).not.toHaveBeenCalled();

        expect(deferred.defer(10)).toBe(deferred);

        await delay(5);
        expect(action).not.toHaveBeenCalled();

        await actionCalled;
        expect(action).toHaveBeenCalledTimes(1);
    });

    it('defers action again', async () => {
        const deferred = new DeferredAction(0, true);
        const action = jest.fn();

        deferred.register(action);

        await delay(1);

        deferred.defer();

        await delay(1);
        expect(action).toHaveBeenCalledTimes(2);

        await delay(1);
        expect(action).toHaveBeenCalledTimes(2);
    });

    it('defers action several times', async () => {
        const deferred = new DeferredAction();
        const action = jest.fn();
        const count = 3;

        deferred.register(action);

        for (let i = 0; i < count; i++) {
            deferred.defer();

            await delay(1);
            expect(action).toHaveBeenCalledTimes(i + 1);
        }

        await delay(1);
        expect(action).toHaveBeenCalledTimes(count);
    });

    it('defers action with additional parameters', async () => {
        const deferred = new DeferredAction();
        const action = jest.fn().mockImplementation((...args) => {
            expect(args).toStrictEqual(['foo', 'bar']);
        });

        deferred.register(action);

        deferred.defer(0, 'foo', 'bar');

        await delay(1);
        expect(action).toHaveBeenCalledTimes(1);
    });

    it('tells if actions are pending', async () => {
        const deferred = new DeferredAction();

        expect(deferred.pending).toBeFalsy();

        deferred.defer();

        expect(deferred.pending).toBeTruthy();

        await delay(1);

        expect(deferred.pending).toBeFalsy();
    });

    it('process action immediately', async () => {
        const deferred = new DeferredAction(10, true);
        const action = jest.fn();

        deferred.register(action);

        expect(deferred.process()).toBe(deferred);
        expect(deferred.process()).toBe(deferred);
        expect(action).toHaveBeenCalledTimes(1);

        await delay(11);
        expect(action).toHaveBeenCalledTimes(1);
    });

    it('process action with additional parameters', async () => {
        const deferred = new DeferredAction(10, true);
        const action = jest.fn().mockImplementation((...args) => {
            expect(args).toStrictEqual(['foo', 'bar']);
        });

        deferred.register(action);

        deferred.process('foo', 'bar');
        expect(action).toHaveBeenCalledTimes(1);

        await delay(11);
        expect(action).toHaveBeenCalledTimes(1);
    });

    it('cancel action', async () => {
        const deferred = new DeferredAction();
        const action = jest.fn();

        deferred.register(action);
        deferred.defer();

        expect(deferred.cancel()).toBe(deferred);

        await delay(1);
        expect(action).not.toHaveBeenCalled();
    });

    it('registers actions', async () => {
        const deferred = new DeferredAction();
        const action1 = jest.fn();
        const action2 = jest.fn();

        expect(deferred.register(action1)).toEqual(expect.any(Function));
        expect(deferred.register(action2)).toEqual(expect.any(Function));

        deferred.defer();
        await delay(1);

        expect(action1).toHaveBeenCalledTimes(1);
        expect(action2).toHaveBeenCalledTimes(1);
    });

    it('throws error if the action is not a function', async () => {
        const deferred = new DeferredAction();

        expect(() => deferred.register(true)).toThrow('A function is required to register an action!');
    });

    it('tells if an action is registered', async () => {
        const deferred = new DeferredAction();
        const action1 = jest.fn();
        const action2 = jest.fn();

        deferred.register(action1);

        expect(deferred.isRegistered(action1)).toBeTruthy();
        expect(deferred.isRegistered(action2)).toBeFalsy();
    });

    it('un-registers actions', async () => {
        const deferred = new DeferredAction();
        const action1 = jest.fn();
        const action2 = jest.fn();

        deferred.register(action1);
        deferred.register(action2);
        deferred.defer();

        expect(deferred.unregister(action2)).toBeTruthy();
        expect(deferred.unregister(action2)).toBeFalsy();

        await delay(1);

        expect(action1).toHaveBeenCalledTimes(1);
        expect(action2).not.toHaveBeenCalled();
    });

    it('un-registers actions using the returned callback', async () => {
        const deferred = new DeferredAction();
        const action1 = jest.fn();
        const action2 = jest.fn();

        deferred.register(action1);
        const unregister = deferred.register(action2);
        deferred.defer();

        expect(unregister(action2)).toBeTruthy();
        expect(unregister(action2)).toBeFalsy();

        await delay(1);

        expect(action1).toHaveBeenCalledTimes(1);
        expect(action2).not.toHaveBeenCalled();
    });

    it('un-registers all actions', async () => {
        const deferred = new DeferredAction();
        const action1 = jest.fn();
        const action2 = jest.fn();

        deferred.register(action1);
        deferred.register(action2);
        deferred.defer();

        expect(deferred.clear()).toBe(deferred);

        await delay(1);

        expect(action1).not.toHaveBeenCalled();
        expect(action2).not.toHaveBeenCalled();
    });
});
