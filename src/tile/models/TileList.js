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
import { TileModel } from './TileModel';

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
 * Makes sure a tile has a unique identifier.
 * @param {TileModel} tile - The tile for which set the identifier.
 * @returns {TileModel} - Returns the given tile model.
 * @private
 */
function identify(tile) {
    if (tile.id === tile.modelId) {
        tile.id = uid();
    }
    return tile;
}

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
function createTile(specs, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
    validateType(type);
    return new modelsMap[type](specs, direction, ratio);
}

/**
 * Represents a list of tiles.
 */
export class TileList extends List {
    /**
     * Represents a list of tiles with the given size constraints.
     * @param {TileSpecifications} specs - The specifications for the tiles.
     * @param {TileModel[]} source - A list of tiles to initialize the list.
     * @throws {TypeError} - If the given specifications object is not valid.
     * @throws {TypeError} - If one of the tiles in the source is not a TileModel.
     */
    constructor(specs, source = null) {
        super();

        this.setSpecs(specs);

        if (source) {
            this.load(source);
            source = void 0;
        }

        // Produces a store linked to the list events and returning the TileList
        const { subscribe } = eventStore(
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
            this
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
     * Sets the specifications for the tiles.
     * @param {TileSpecifications} specs - The specifications for the tiles.
     * @returns {TileList} - Chains the instance.
     * @throws {TypeError} - If the given specifications object is not valid.
     * @fires specs
     */
    setSpecs(specs) {
        TileSpecifications.validateInstance(specs);

        this.specs = specs;

        if (this.length) {
            this.forEach(tile => tile.setSpecs(specs));

            this.emit('specs', specs);
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
        this.emit('update');

        return this;
    }

    /**
     * Gets the position of a tile inside the list.
     * @param {string} id - The unique identifier of the tile.
     * @returns {number} - The position of the tile, or `-1` if it does not exist.
     */
    getIndex(id) {
        return this.find(tile => tile.id === id);
    }

    /**
     * Retrieves a tile by its identifier.
     * @param {string} id - The unique identifier of the tile.
     * @returns {TileModel} - The referenced tile, or `null` if it does not exist.
     */
    getById(id) {
        return super.get(this.getIndex(id)) || null;
    }

    /**
     * Gets a tile from a particular position.
     * @param {number} index - The position of the tile.
     * @returns {TileModel} - The referenced tile, or `null` if it does not exist.
     */
    get(index) {
        return super.get(index) || null;
    }

    /**
     * Replace a tile in the list.
     * If the tile does not exist, it does nothing.
     * @param {string} id - The unique identifier of the tile to replace.
     * @param {TileModel} tile - The tile to set in place.
     * @returns {TileList} - Chains the instance.
     * @fires set
     * @throws {TypeError} - If the given tile is not a TileModel.
     */
    setById(id, tile) {
        const index = this.getIndex(id);

        if (index >= 0) {
            this.set(index, tile);
        }

        return this;
    }

    /**
     * Sets a tile at a particular index.
     * @param {number} index - The index where to set the tile.
     * @param {TileModel} tile - The tile to set at the index.
     * @returns {TileList} - Chains the instance.
     * @fires set
     * @throws {ReferenceError} - If the given index is out of bounds.
     * @throws {TypeError} - If the given tile is not a TileModel.
     */
    set(index, tile) {
        TileModel.validateInstance(tile);
        return super.set(index, identify(tile));
    }

    /**
     * Inserts a tile at a particular index.
     * @param {number} index - The index where to insert the tile.
     * @param {...TileModel} tiles - The tiles to insert at the index.
     * @returns {TileList} - Chains the instance.
     * @fires add
     * @throws {TypeError} - If one of the given tiles is not a TileModel.
     */
    insert(index, ...tiles) {
        tiles.forEach(tile => {
            TileModel.validateInstance(tile);
            identify(tile);
        });
        return super.insert(index, ...tiles);
    }

    /**
     * Adds a tile at the end of the list.
     * @param {...TileModel} tiles - The tiles to add.
     * @returns {TileList} - Chains the instance.
     * @fires add
     * @throws {TypeError} - If one of the given tiles is not a TileModel.
     */
    add(...tiles) {
        tiles.forEach(tile => {
            TileModel.validateInstance(tile);
            identify(tile);
        });
        return super.add(...tiles);
    }

    /**
     * Removes a tile from the list.
     * @param {string} id - The unique identifier of the tile to remove.
     * @returns {boolean} - Returns `true` if the deletion succeeds. Otherwise, returns `false`.
     * @fires delete
     */
    remove(id) {
        const index = this.getIndex(id);

        if (index < 0) {
            return false;
        }

        return this.delete(index) > 0;
    }

    /**
     * Loads tiles from another source. The list is cleared before.
     * @param {*} iterator - An iterable object that can be used to fill the list.
     * @returns {List} - Chains the instance.
     * @fires load
     * @throws {TypeError} - If one of the given tiles is not a TileModel.
     */
    load(iterator) {
        if (!iterator || !iterator[Symbol.iterator]) {
            return this;
        }

        const list = [];
        for (const tile of iterator) {
            TileModel.validateInstance(tile);
            list.push(identify(tile));
        }
        this.list = list;

        this.emit('load');

        return this;
    }

    /**
     * Add a tile to the list, at the last position.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {TileModel} - Returns the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires add
     */
    append(type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const tile = createTile(this.specs, type, direction, ratio);

        this.add(tile);

        return tile;
    }

    /**
     * Add a tile to the list, at the first position.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {TileModel} - Returns the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires add
     */
    prepend(type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const tile = createTile(this.specs, type, direction, ratio);

        this.insert(0, tile);

        return tile;
    }

    /**
     * Replace a tile in the list.
     * If the tile does not exist, it does nothing.
     * @param {string} id - The unique identifier of the tile to replace.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {TileModel} - Returns the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires set
     */
    replace(id, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const index = this.getIndex(id);

        if (index >= 0) {
            const tile = createTile(this.specs, type, direction, ratio);

            this.set(index, tile);

            return tile;
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
     * @returns {TileModel} - Returns the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires add
     */
    insertBefore(id, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const index = this.getIndex(id);

        if (index >= 0) {
            const tile = createTile(this.specs, type, direction, ratio);

            this.insert(index, tile);

            return tile;
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
     * @returns {TileModel} - Returns the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires add
     */
    insertAfter(id, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const index = this.getIndex(id);

        if (index >= 0) {
            const tile = createTile(this.specs, type, direction, ratio);

            this.insert(index + 1, tile);

            return tile;
        }

        return null;
    }

    /**
     * Exports the list to an object.
     * @returns {tileExport[]} - An object representation of the list.
     */
    export() {
        return this.map(tile => tile.export());
    }

    /**
     * Imports the list from a source.
     * The list is emptied before importing, any existing tile will be deleted.
     * @param {tileExport[]} data - An iterable object containing a representation of the list.
     * @returns {TileList} - Chains the instance.
     * @fires load
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
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
                const tile = createTile(this.specs, type, direction, ratio);

                return { done: false, value: tile };
            },

            [Symbol.iterator]() {
                return this;
            }
        };

        this.load(loadIterator);

        return this;
    }
}

/**
 * @typedef {import('./TileModel.js').tileExport} tileExport
 */

/**
 * Notifies the tile specification have changed.
 * @event specs
 * @param {TileSpecifications} specs - The specifications for the tiles.
 */

/**
 * Notifies a change applied to the tiles.
 * @event update
 */

/**
 * Notifies a tile has been set to the list.
 * @event set
 * @param {number} index - The index where the tile was set.
 * @param {TileModel} newTile - The new tile.
 * @param {TileModel} oldTile - The previous tile.
 */

/**
 * Notifies tiles have been added to the list.
 * @event add
 * @param {number} index - The index from where the tiles have been added.
 * @param {...TileModel} tiles - The added tiles.
 */

/**
 * Notifies tiles have been removed from the list.
 * @event delete
 * @param {number} index - The index from where the tiles were removed.
 * @param {...TileModel} tiles - The removed tiles.
 */

/**
 * Notifies the list has been cleared.
 * @event clear
 */

/**
 * Notifies the list has been loaded.
 * @event load
 */
