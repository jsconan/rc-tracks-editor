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
     * @throws {TypeError} - If the given tile is not a TileModel.
     * @fires set
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
     * @throws {ReferenceError} - If the given index is out of bounds.
     * @throws {TypeError} - If the given tile is not a TileModel.
     * @fires set
     */
    set(index, tile) {
        TileModel.validateInstance(tile);
        return super.set(index, TileList.identify(tile));
    }

    /**
     * Inserts a tile at a particular index.
     * @param {number} index - The index where to insert the tile.
     * @param {...TileModel} tiles - The tiles to insert at the index.
     * @returns {TileList} - Chains the instance.
     * @throws {TypeError} - If one of the given tiles is not a TileModel.
     * @fires add
     */
    insert(index, ...tiles) {
        tiles.forEach(tile => {
            TileModel.validateInstance(tile);
            TileList.identify(tile);
        });
        return super.insert(index, ...tiles);
    }

    /**
     * Adds a tile at the end of the list.
     * @param {...TileModel} tiles - The tiles to add.
     * @returns {TileList} - Chains the instance.
     * @throws {TypeError} - If one of the given tiles is not a TileModel.
     * @fires add
     */
    add(...tiles) {
        tiles.forEach(tile => {
            TileModel.validateInstance(tile);
            TileList.identify(tile);
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
     * @returns {TileList} - Chains the instance.
     * @throws {TypeError} - If one of the given tiles is not a TileModel.
     * @fires load
     */
    load(iterator) {
        if (!iterator || !iterator[Symbol.iterator]) {
            return this;
        }

        const list = [];
        for (const tile of iterator) {
            TileModel.validateInstance(tile);
            list.push(TileList.identify(tile));
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
        const tile = TileList.createTile(this.specs, type, direction, ratio);

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
        return this.insertAt(0, type, direction, ratio);
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
            const tile = TileList.createTile(this.specs, type, direction, ratio);

            this.set(index, tile);

            return tile;
        }

        return null;
    }

    /**
     * Inserts a tile at a particular index.
     * If the index is below 0, it does nothing.
     * @param {number} index - The index where to insert the tile.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {TileModel} - Returns the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires add
     */
    insertAt(index, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        if (index >= 0) {
            const tile = TileList.createTile(this.specs, type, direction, ratio);

            this.insert(index, tile);

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
            return this.insertAt(index, type, direction, ratio);
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
            return this.insertAt(index + 1, type, direction, ratio);
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
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires load
     */
    import(data) {
        if (!data || !data[Symbol.iterator]) {
            return this;
        }

        /**
         * @param {TileSpecifications} specs
         * @yields {TileModel}
         * @generator
         * @private
         */
        function* loadData(specs) {
            for (const value of data) {
                const { type, direction, ratio } = value || {};
                yield TileList.createTile(specs, type, direction, ratio);
            }
        }

        this.load(loadData(this.specs));

        return this;
    }

    /**
     * Creates a tile model with respect to the given type.
     * @param {TileSpecifications} specs - The specifications for the tiles.
     * @param {string} type - The type of tile.
     * @param {string} direction - The direction of the tile.
     * @param {number} ratio - The size ratio of the tile.
     * @returns {TileModel} - Returns a tile model of the expected type.
     * @throws {TypeError} - If the given specifications object is not valid.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     */
    static createTile(specs, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        validateType(type);
        return new modelsMap[type](specs, direction, ratio);
    }

    /**
     * Makes sure a tile has a unique identifier.
     * @param {TileModel} tile - The tile for which set the identifier.
     * @returns {TileModel} - Returns the given tile model.
     * @private
     */
    static identify(tile) {
        if (tile && tile.id === tile.modelId) {
            tile.id = uid();
        }
        return tile;
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
