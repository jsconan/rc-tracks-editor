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
 * Represents a SVG Path command.
 */
export class SVGPathCommand {
    /**
     * The represented path command.
     * @type {string}
     * @private
     */
    #name;

    /**
     * A list of parameters for the command.
     * @type {Array}
     * @private
     */
    #parameters;

    /**
     * Creates a SVG Path command.
     * @param {string} command - The represented path command.
     * @param {...*} parameters - A list of parameters for the command.
     */
    constructor(command, ...parameters) {
        this.#name = `${command}`;
        this.#parameters = parameters;
    }

    /**
     * The represented path command.
     * @type {string}
     */
    get name() {
        return this.#name;
    }

    /**
     * The list of parameters for the command.
     * @type {Array}
     */
    get parameters() {
        return this.#parameters;
    }

    /**
     * Renders the path command.
     * @returns {string} - The rendered path command.
     */
    toString() {
        if (!this.#parameters.length) {
            return this.#name;
        }

        return `${this.#name} ${this.#parameters.join(' ')}`;
    }
}
