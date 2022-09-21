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

import { writable } from 'svelte/store';
import { validateCallback } from '../../core/helpers';
import { TileList } from './TileList.js';

/**
 * Represents a list of tile coordinates.
 * It binds a list of tiles with a builder.
 */
export class TileCoordList {
    /**
     * Binds a list of tiles and a builder in order to produce a list of tile coordinates.
     * @param {TileList} list - The list of tiles to bind with the builder.
     * @param {function} builder - The reference to the builder.
     * @param {object} [options] - Some options for the builder.
     * @throws {TypeError} - If the given list is not a valid instance of TileList.
     * @throws {TypeError} - If the given builder is not a function.
     */
    constructor(list, builder, options = {}) {
        const { subscribe, set } = writable();
        let unsubscribe;

        /**
         * Adds a subscriber that will be notified each time the coordinates are modified.
         * @function subscribe
         * @param {function} subscriber - A callback that will receive notifications when the coordinates change.
         * @returns {function} - Returns a callback for removing the subscription.
         */
        this.subscribe = subscribe;

        /**
         * Computes the coordinates of each tile in the list.
         * Notifies all subscribers.
         * @returns {TileCoordList} - Chains the instance.
         */
        this.build = () => {
            if (this.list && this.builder) {
                this.listCoord = this.builder(this.list, this.options);
                set(this.listCoord);
            }

            return this;
        };

        /**
         * Binds the list of tiles with the builder.
         * @param {TileList} newList - The list of tiles to bind with the builder.
         * @returns {TileCoordList} - Chains the instance.
         * @throws {TypeError} - If the given list is not a valid instance of TileList.
         */
        this.setList = newList => {
            TileList.validateInstance(newList);

            if (unsubscribe) {
                unsubscribe();
            }

            this.list = newList;

            unsubscribe = newList.subscribe(this.build);

            return this;
        };

        this.setOptions(options);
        this.setList(list);
        this.setBuilder(builder);
    }

    /**
     * Binds the builder.
     * @param {function} builder - The reference to the builder.
     * @returns {TileCoordList} - Chains the instance.
     * @throws {TypeError} - If the given builder is not a function.
     */
    setBuilder(builder) {
        validateCallback(builder, 'builder');

        /**
         * Process a list of tiles for rendering, computing the coordinates of each tile.
         * @function builder
         * @param {TileList} list - The list of tiles from which compute the coordinates of each tile.
         * @param {object} [config] - A set of config options.
         * @returns {listCoord} - Returns the list of coordinates.
         */
        this.builder = builder;

        return this.build();
    }

    /**
     * Sets the options that will be given to the builder on the next call.
     * @param {object} options - Some options for the builder.
     * @returns {TileCoordList} - Chains the instance.
     */
    setOptions(options) {
        this.options = Object.assign({}, options);

        return this.build();
    }

    /**
     * Sets an option that will be given to the builder on the next call.
     * @param {string} name - The name of the option to set.
     * @param {*} value - The value for the option.
     * @returns {TileCoordList} - Chains the instance.
     */
    setOption(name, value) {
        this.options[name] = value;

        return this.build();
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
     * Gets the position of a tile inside the list.
     * @param {string} id - The unique identifier of the tile.
     * @returns {number} - The position of the tile, or `-1` if it does not exist.
     */
    getTileIndex(id) {
        return this.list.getTileIndex(id);
    }

    /**
     * Retrieves the coordinates of a tile by its identifier.
     * @param {string} id - The unique identifier of the tile.
     * @returns {tileCoord} - The coordinates of the tile, or `null` if it does not exist.
     */
    getTile(id) {
        return this.getTileAt(this.getTileIndex(id));
    }

    /**
     * Gets the coordinates of a tile from a particular position in the list.
     * @param {number} index - The position of the tile.
     * @returns {tileCoord} - The coordinates of the tile, or `null` if it does not exist.
     */
    getTileAt(index) {
        if (!this.listCoord) {
            return null;
        }

        return this.listCoord.tiles[index] || null;
    }

    /**
     * Validates that the given model is an instance of the class.
     * Otherwise, an error is thrown.
     * @param {object} model - The instance to validate.
     * @throws {TypeError} - If the given model is not a valid instance.
     */
    static validateInstance(model) {
        if (!(model instanceof this)) {
            throw new TypeError(`The model must be an instance of ${this.name}!`);
        }
    }
}

/**
 * @typedef {object} listCoord - Represents a list of tiles ready to be rendered.
 * @property {number} x - The left coordinate of the list of tiles.
 * @property {number} y - The top coordinate of the list of tiles.
 * @property {number} width - The width of the list of tiles.
 * @property {number} height - The height of the list of tiles.
 * @property {tileCoord[]} tiles - The list of tiles.
 * @property {Counter} [stats] - An object listing the stats for the list of tiles.
 */

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
 * @typedef {import('../models/TileModel.js').tileRect} tileRect
 */

/**
 * @typedef {import('../models').TileModel} TileModel
 */

/**
 * @typedef {import('../../core/models').Counter} Counter
 */
