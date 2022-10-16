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

import { eventEmitterMixin } from '../../core/mixins';
import { validateCallback } from '../../core/helpers';
import { TileList } from '../../tile/models/TileList.js';

/**
 * Binds a track builder with a set of options.
 */
export class TrackBuilder {
    /**
     * Binds a track builder with a set of options.
     * @param {trackCoordBuilder} builder - The reference to the builder.
     * @param {object} [options] - Some options for the builder.
     * @throws {TypeError} - If the given builder is not a function.
     */
    constructor(builder, options = {}) {
        eventEmitterMixin(this);

        this.setBuilder(builder);
        this.setOptions(options);
    }

    /**
     * Computes the coordinates of each tile in the list.
     * @param {TileList} list - The list of tiles for which compute the coordinates.
     * @returns {trackCoord} - Returns the list of coordinates.
     * @throws {TypeError} - If the given list is not a valid instance of TileList.
     */
    build(list) {
        TileList.validateInstance(list);

        return this.builder(list, this.options);
    }

    /**
     * Binds the builder.
     * @param {trackCoordBuilder} builder - The reference to the builder.
     * @returns {TrackBuilder} - Chains the instance.
     * @throws {TypeError} - If the given builder is not a function.
     * @fires builder
     */
    setBuilder(builder) {
        validateCallback(builder, 'builder');

        const previous = this.builder;

        /**
         * Process a list of tiles for rendering, computing the coordinates of each tile.
         * @function builder
         * @param {TileList} list - The list of tiles from which compute the coordinates of each tile.
         * @param {object} [config] - A set of config options.
         * @returns {trackCoord} - Returns the list of coordinates.
         */
        this.builder = builder;

        this.emit('builder', builder, previous);

        return this;
    }

    /**
     * Sets the options that will be given to the builder on the next call.
     * @param {object} options - Some options for the builder.
     * @returns {TrackBuilder} - Chains the instance.
     * @fires options
     */
    setOptions(options) {
        const previous = Object.assign({}, this.options);
        this.options = Object.assign({}, options);

        this.emit('options', options, previous);

        return this;
    }

    /**
     * Sets an option that will be given to the builder on the next call.
     * @param {string} name - The name of the option to set.
     * @param {*} value - The value for the option.
     * @returns {TrackBuilder} - Chains the instance.
     * @fires option
     */
    setOption(name, value) {
        const previous = this.options[name];
        this.options[name] = value;

        this.emit('option', name, value, previous);

        return this;
    }

    /**
     * Gets the value of a particular option for the builder.
     * @param {string} name - The name of the option to read.
     * @returns {*} - The value of the option.
     */
    getOption(name) {
        return this.options[name];
    }

    /**
     * Tells if an option for the builder has a value assigned.
     * @param {string} name - The name of the option to test.
     * @returns {boolean} - Returns `true` if the option has a value.
     */
    hasOption(name) {
        return Object.prototype.hasOwnProperty.call(this.options, name);
    }

    /**
     * Validates that the given model is an instance of the class.
     * Otherwise, an error is thrown.
     * @param {object} model - The instance to validate.
     * @throws {TypeError} - If the given model is not a valid instance.
     */
    static validateInstance(model) {
        if (!(model instanceof this)) {
            throw new TypeError(`The object must be an instance of ${this.name}!`);
        }
    }
}

/**
 * @typedef {object} tileCoord - Represents a positioned tile.
 * @property {string} id - The unique identifier of the tile.
 * @property {string} type - The type of tile.
 * @property {string} direction - The direction of the tile.
 * @property {number} ratio - The size ratio of the tile.
 * @property {number} x - The left coordinate of the tile.
 * @property {number} y - The top coordinate of the tile.
 * @property {number} angle - The rotation angle of the tile.
 * @property {tileRect} rect - The bounding rectangle of the tile.
 * @property {TileModel} model - A reference to the tile model.
 */

/**
 * @typedef {object} trackCoord - Represents a list of tiles ready to be rendered.
 * @property {number} x - The left coordinate of the list of tiles.
 * @property {number} y - The top coordinate of the list of tiles.
 * @property {number} width - The width of the list of tiles.
 * @property {number} height - The height of the list of tiles.
 * @property {tileCoord[]} tiles - The list of tiles.
 */

/**
 * Process a list of tiles for rendering, computing the coordinates of each tile.
 * @param {TileList} list - The list of tiles from which compute the coordinates of each tile.
 * @param {object} [config] - A set of config options.
 * @returns {trackCoord} - Returns the list of coordinates.
 * @callback trackCoordBuilder
 */

/**
 * @typedef {import('../../tile/models/TileModel.js').tileRect} tileRect
 */

/**
 * @typedef {import('../../tile/models/TileModel.js').TileModel} TileModel
 */

/**
 * Notifies the builder has been replaced.
 * @event builder
 * @param {trackCoordBuilder} newBuilder - The new builder.
 * @param {trackCoordBuilder} oldBuilder - The previous builder.
 */

/**
 * Notifies an option has changed.
 * @event option
 * @param {string} name - The name of the changed option.
 * @param {*} newValue - The new value.
 * @param {*} oldValue - The previous value.
 */

/**
 * Notifies the options have been replaced.
 * @event options
 * @param {object} newOptions - The new options.
 * @param {object} oldOptions - The previous options.
 */
