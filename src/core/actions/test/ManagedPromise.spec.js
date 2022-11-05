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

import { ManagedPromise } from '../ManagedPromise.js';

describe('ManagedPromise', () => {
    it('is a class', () => {
        expect(ManagedPromise).toEqual(expect.any(Function));
    });

    it('is a promise', () => {
        expect(new ManagedPromise()).toBeInstanceOf(Promise);
    });

    it.each(['resolve', 'reject'])('exposes a "%s" method', name => {
        const promise = new ManagedPromise();
        expect(promise[name]).toEqual(expect.any(Function));
    });

    it('resolves externally', async () => {
        const message = 'foo';
        const promise = new ManagedPromise();

        promise.resolve(message);
        await expect(promise).resolves.toBe(message);
    });

    it('rejects externally', async () => {
        const error = new Error('foo');
        const promise = new ManagedPromise();

        promise.reject(error);
        await expect(promise).rejects.toBe(error);
    });

    it('resolves internally', async () => {
        const message = 'foo';
        const promise = new ManagedPromise(resolve => {
            resolve(message);
        });

        await expect(promise).resolves.toBe(message);
    });

    it('rejects internally', async () => {
        const error = new Error('foo');
        const promise = new ManagedPromise((resolve, reject) => {
            reject(error);
        });

        await expect(promise).rejects.toBe(error);
    });
});
