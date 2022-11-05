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

import { ManagedPromise } from './ManagedPromise';

/**
 * Represents a promise that resolves after a particular number of milliseconds.
 */
export class DelayedPromise extends ManagedPromise {
    /**
     * Creates a promise that will resolve after a particular number of milliseconds.
     * @param {number|function} delay - The number of milliseconds to wait before resolving.
     * It also support receiving a function to be executed by the constructor.
     * It receives two functions as parameters: `resolve` and `reject`.
     * In this case, there will be obviously no auto resolve after a delay.
     */
    constructor(delay = 0) {
        super(delay);

        if ('number' === typeof delay) {
            let timeout = setTimeout(() => {
                timeout = null;
                this.resolve();
            }, delay);

            const clear = () => {
                if (timeout !== null) {
                    clearTimeout(timeout);
                }
                timeout = null;
            };

            this.then(clear, clear);
        }
    }
}
