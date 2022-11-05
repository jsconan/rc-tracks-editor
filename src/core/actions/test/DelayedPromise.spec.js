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

import { tick } from 'svelte';
import { DelayedPromise } from '../DelayedPromise.js';

describe('DelayedPromise', () => {
    it('is a class', () => {
        expect(DelayedPromise).toEqual(expect.any(Function));
    });

    it('is a promise', () => {
        expect(new DelayedPromise()).toBeInstanceOf(Promise);
    });

    it.each(['resolve', 'reject'])('exposes a "%s" method', name => {
        const promise = new DelayedPromise();
        expect(promise[name]).toEqual(expect.any(Function));
    });

    it('resolves externally', async () => {
        const message = 'foo';
        const promise = new DelayedPromise();

        promise.resolve(message);
        promise.resolve = jest.fn();
        await expect(promise).resolves.toBe(message);
        await tick();
        expect(promise.resolve).not.toHaveBeenCalled();
    });

    it('rejects externally', async () => {
        const error = new Error('foo');
        const promise = new DelayedPromise();

        promise.reject(error);
        promise.resolve = jest.fn();
        await expect(promise).rejects.toBe(error);
        await tick();
        expect(promise.resolve).not.toHaveBeenCalled();
    });

    it('resolves internally', async () => {
        const message = 'foo';
        const promise = new DelayedPromise(resolve => {
            resolve(message);
        });

        promise.resolve = jest.fn();
        await expect(promise).resolves.toBe(message);
        await tick();
        expect(promise.resolve).not.toHaveBeenCalled();
    });

    it('rejects internally', async () => {
        const error = new Error('foo');
        const promise = new DelayedPromise((resolve, reject) => {
            reject(error);
        });

        promise.resolve = jest.fn();
        await expect(promise).rejects.toBe(error);
        await tick();
        expect(promise.resolve).not.toHaveBeenCalled();
    });

    it('resolves after a delay', async () => {
        const promise = new DelayedPromise(10);

        const resolve = promise.resolve;
        promise.resolve = jest.fn().mockImplementation(resolve);
        await new Promise(elapsed => setTimeout(elapsed, 5));
        expect(promise.resolve).not.toHaveBeenCalled();

        await expect(promise).resolves.toBeUndefined();
        expect(promise.resolve).toHaveBeenCalled();
    });

    it('rejects before a delay', async () => {
        const error = new Error('foo');
        const promise = new DelayedPromise(10);

        promise.reject(error);
        promise.resolve = jest.fn();
        await expect(promise).rejects.toBe(error);

        await new Promise(elapsed => setTimeout(elapsed, 11));
        expect(promise.resolve).not.toHaveBeenCalled();
    });
});
