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

/**
 * Represents a promise for which the `resolve` and `reject` callbacks are
 * externalized so that it can be managed.
 */
export class ManagedPromise extends Promise {
    /**
     * Creates a promise for which the `resolve` and `reject` callbacks are
     * externalized so that it can be managed.
     * @param {*} executor - A function to be executed by the constructor.
     * It receives two functions as parameters: `resolve` and `reject`.
     */
    constructor(executor) {
        let resolve, reject;
        super((resolutionFunc, rejectionFunc) => {
            resolve = resolutionFunc;
            reject = rejectionFunc;

            if ('function' === typeof executor) {
                return executor(resolutionFunc, rejectionFunc);
            }
        });

        /**
         * Resolves the promise.
         * @method resolve
         */
        this.resolve = resolve;

        /**
         * Rejects the promise.
         * @method reject
         */
        this.reject = reject;
    }
}
