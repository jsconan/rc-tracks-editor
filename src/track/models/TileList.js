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

import {
    validateType,
    CURVED_TILE_ENLARGED_TYPE,
    CURVED_TILE_TYPE,
    STRAIGHT_TILE_TYPE,
    TILE_DIRECTION_RIGHT
} from '../helpers';
import { uid } from '../../core/helpers';
import { CurvedTileEnlargedModel } from './CurvedTileEnlargedModel.js';
import { CurvedTileModel } from './CurvedTileModel.js';
import { StraightTileModel } from './StraightTileModel.js';
import { TileSpecifications } from '../config';
import { List } from '../../core/models';
import { eventStore } from '../../core/stores';

/**
 * @type {object} - Maps the types of tile to their respective model.
 * @private
 */
const modelsMap = {
    [STRAIGHT_TILE_TYPE]: StraightTileModel,
    [CURVED_TILE_TYPE]: CurvedTileModel,
    [CURVED_TILE_ENLARGED_TYPE]: CurvedTileEnlargedModel
};

/**
 * Creates the tile model with respect to the given type.
 * @param {TileSpecifications} specs - The specifications for the tiles.
 * @param {string} type - The type of tile.
 * @param {string} direction - The direction of the tile.
 * @param {number} ratio - The size ratio of the tile.
 * @returns {TileModel} - Returns a tile model of the expected type.
 * @throws {TypeError} - If the given specifications object is not valid.
 * @throws {TypeError} - If the given type is not valid.
 * @throws {TypeError} - If the given direction is not valid.
 * @private
 */
function createModel(specs, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
    validateType(type);
    const model = new modelsMap[type](specs, direction, ratio);
    model.id = uid();
    return model;
}

/**
 * Represents a list of tiles.
 */
export class TileList {
    /**
     * Represents a list of tiles with the given size constraints.
     * @param {TileSpecifications} specs - The specifications for the tiles.
     * @throws {TypeError} - If the given specifications object is not valid.
     */
    constructor(specs) {
        this.tiles = new List();

        this.setSpecs(specs);

        // Produces a store linked to the list events and returning the TileList
        const { subscribe } = eventStore(
            this.tiles,
            [
                // List events
                'set',
                'insert',
                'add',
                'delete',
                'clear',
                'load',
                // TileList events
                'specs',
                'update'
            ],
            () => this
        );

        /**
         * Adds a subscriber that will be notified each time the list is modified.
         * @function subscribe
         * @param {function} subscriber - A callback that will receive notifications when the list is changed.
         * @returns {function} - Return a callback for removing the subscription.
         */
        this.subscribe = subscribe;
    }

    /**
     * The number of tiles in the list.
     * @type {number}
     */
    get length() {
        return this.tiles.length;
    }

    /**
     * Iterates over the tiles from the list.
     * @yields {TileModel} - The next tile in the list.
     * @generator
     */
    *[Symbol.iterator]() {
        yield* this.tiles.values();
    }

    /**
     * Returns an iterator for the tiles from the list.
     * @yields {TileModel} - The next tile in the list.
     * @generator
     */
    *values() {
        yield* this.tiles.values();
    }

    /**
     * Sets the specifications for the tiles.
     * @param {TileSpecifications} specs - The specifications for the tiles.
     * @returns {TileList} - Chains the instance.
     * @throws {TypeError} - If the given specifications object is not valid.
     * @fires specs
     */
    setSpecs(specs) {
        TileSpecifications.validateInstance(specs);

        this.specs = specs;

        if (this.tiles.length) {
            this.tiles.forEach(tile => tile.setSpecs(specs));

            /**
             * Notifies the tile specification have changed.
             * @event specs
             * @param {TileSpecifications} specs - The specifications for the tiles.
             */
            this.tiles.emit('specs', specs);
        }

        return this;
    }

    /**
     * Notifies an update of the tiles.
     * This is useful when one or several tiles have been modified internally without calling the list API.
     * @returns {TileList} - Chains the instance.
     * @fires update
     */
    update() {
        /**
         * Notifies a change in the tiles.
         * @event update
         */
        this.tiles.emit('update');

        return this;
    }

    /**
     * Gets the position of a tile inside the list.
     * @param {string} id - The unique identifier of the tile.
     * @returns {number} - The position of the tile, or `-1` if it does not exist.
     */
    getTileIndex(id) {
        return this.tiles.find(tile => tile.id === id);
    }

    /**
     * Retrieves a tile by its identifier.
     * @param {string} id - The unique identifier of the tile.
     * @returns {TileModel} - The referenced tile, or `null` if it does not exist.
     */
    getTile(id) {
        return this.getTileAt(this.getTileIndex(id));
    }

    /**
     * Gets a tile from a particular position.
     * @param {number} index - The position of the tile.
     * @returns {TileModel} - The referenced tile, or `null` if it does not exist.
     */
    getTileAt(index) {
        return this.tiles.get(index) || null;
    }

    /**
     * Add a tile to the list, at the last position.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {string} - Returns the unique identifier of the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires add
     */
    appendTile(type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const tile = createModel(this.specs, type, direction, ratio);

        this.tiles.add(tile);

        return tile.id;
    }

    /**
     * Add a tile to the list, at the first position.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {string} - Returns the unique identifier of the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires insert
     */
    prependTile(type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const tile = createModel(this.specs, type, direction, ratio);

        this.tiles.insert(0, tile);

        return tile.id;
    }

    /**
     * Removes a tile from the list.
     * @param {string} id - The unique identifier of the tile to remove.
     * @returns {boolean} - Returns `true` if the deletion succeeds. Otherwise, returns `false`.
     * @fires delete
     */
    removeTile(id) {
        const index = this.getTileIndex(id);

        if (index < 0) {
            return false;
        }

        return this.tiles.delete(index) > 0;
    }

    /**
     * Replace a tile in the list.
     * If the tile does not exist, it does nothing.
     * @param {string} id - The unique identifier of the tile to replace.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {string} - Returns the unique identifier of the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires set
     */
    replaceTile(id, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const index = this.getTileIndex(id);

        if (index >= 0) {
            const tile = createModel(this.specs, type, direction, ratio);

            this.tiles.set(index, tile);

            return tile.id;
        }

        return null;
    }

    /**
     * Insert a tile in the list before a particular position.
     * If the position does not exist, it does nothing.
     * @param {string} id - The unique identifier of the tile before which add another tile.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {string} - Returns the unique identifier of the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires insert
     */
    insertTileBefore(id, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const index = this.getTileIndex(id);

        if (index >= 0) {
            const tile = createModel(this.specs, type, direction, ratio);

            this.tiles.insert(index, tile);

            return tile.id;
        }

        return null;
    }

    /**
     * Insert a tile in the list after a particular position.
     * If the position does not exist, it does nothing.
     * @param {string} id - The unique identifier of the tile after which add another tile.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {string} - Returns the unique identifier of the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires insert
     */
    insertTileAfter(id, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const index = this.getTileIndex(id);

        if (index >= 0) {
            const tile = createModel(this.specs, type, direction, ratio);

            this.tiles.insert(index + 1, tile);

            return tile.id;
        }

        return null;
    }

    /**
     * Exports the list to an object.
     * @returns {tileExport[]} - An object representation of the list.
     */
    export() {
        return this.tiles.map(tile => tile.export());
    }

    /**
     * Imports the list from a source.
     * The list is emptied before importing, any existing tile will be deleted.
     * @param {tileExport[]} data - An iterable object containing a representation of the list.
     * @returns {TileList} - Chains the instance.
     * @fires load
     */
    import(data) {
        if (!data || !data[Symbol.iterator]) {
            return this;
        }

        const dataIterator = data[Symbol.iterator]();
        const loadIterator = {
            next: () => {
                const next = dataIterator.next();

                if (next.done) {
                    return next;
                }

                const { type, direction, ratio } = next.value || {};
                const tile = createModel(this.specs, type, direction, ratio);

                return { done: false, value: tile };
            },

            [Symbol.iterator]() {
                return this;
            }
        };

        this.tiles.load(loadIterator);

        return this;
    }

    /**
     * Removes all tiles from the list.
     * @returns {TileList} - Chains the instance.
     * @fires clear
     */
    clear() {
        this.tiles.clear();

        return this;
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
 * @typedef {import('./TileModel').tileExport} tileExport
 */

/**
 * @typedef {import('./TileModel').TileModel} TileModel
 */
