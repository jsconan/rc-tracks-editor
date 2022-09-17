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

import { derived } from 'svelte/store';
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
import { Counter, List, Vector2D } from '../../core/models';

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
export class TilesList {
    /**
     * Represents a list of tiles with the given size constraints.
     * @param {TileSpecifications} specs - The specifications for the tiles.
     * @throws {TypeError} - If the given specifications object is not valid.
     */
    constructor(specs) {
        this.tiles = new List();
        this.stats = new Counter();
        this.setSpecs(specs);

        const { subscribe } = derived(this.tiles, () => this);

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
     * @returns {TilesList} - Chains the instance.
     * @throws {TypeError} - If the given specifications object is not valid.
     */
    setSpecs(specs) {
        TileSpecifications.validateInstance(specs);

        this.specs = specs;

        if (this.tiles.length) {
            this.tiles.forEach(tile => tile.setSpecs(specs));
            this.tiles.notify();
        }

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
     */
    appendTile(type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const tile = createModel(this.specs, type, direction, ratio);

        this.stats.increment(tile.modelId);
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
     */
    prependTile(type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const tile = createModel(this.specs, type, direction, ratio);

        this.stats.increment(tile.modelId);
        this.tiles.insert(0, tile);

        return tile.id;
    }

    /**
     * Removes a tile from the list.
     * @param {string} id - The unique identifier of the tile to remove.
     * @returns {boolean} - Returns `true` if the deletion succeeds. Otherwise, returns `false`.
     */
    removeTile(id) {
        const index = this.getTileIndex(id);

        if (index < 0) {
            return false;
        }

        this.stats.decrement(this.tiles.get(index).modelId);

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
     */
    replaceTile(id, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const index = this.getTileIndex(id);

        if (index >= 0) {
            const tile = createModel(this.specs, type, direction, ratio);

            this.stats.decrement(this.tiles.get(index).modelId);
            this.stats.increment(tile.modelId);

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
     */
    insertTileBefore(id, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const index = this.getTileIndex(id);

        if (index >= 0) {
            const tile = createModel(this.specs, type, direction, ratio);

            this.stats.increment(tile.modelId);
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
     */
    insertTileAfter(id, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const index = this.getTileIndex(id);

        if (index >= 0) {
            const tile = createModel(this.specs, type, direction, ratio);

            this.stats.increment(tile.modelId);
            this.tiles.insert(index + 1, tile);

            return tile.id;
        }

        return null;
    }

    /**
     * Rebuilds the stats regarding the number of identified types.
     * @returns {TilesList} - Chains the instance.
     */
    rebuildStats() {
        const dataIterator = this.tiles.values();
        const loadIterator = {
            next: () => {
                const next = dataIterator.next();

                if (next.done) {
                    return next;
                }

                const { modelId } = next.value;
                return { done: false, value: modelId };
            },

            [Symbol.iterator]() {
                return this;
            }
        };

        this.stats.reset(loadIterator);

        return this;
    }

    /**
     * Builds the track for rendering, computing the coordinates of each tile.
     * @param {number} startX - The X-coordinate of the first tile.
     * @param {number} startY - The Y-coordinate of the first tile.
     * @param {number} startAngle - The rotation angle of the first tile.
     * @returns {trackCoord}
     */
    build(startX = 0, startY = 0, startAngle = 0) {
        const topLeft = new Vector2D();
        const bottomRight = new Vector2D();
        let inputX = startX;
        let inputY = startY;
        let inputAngle = startAngle;

        const stats = new Counter();
        const tiles = this.tiles.map(model => {
            const coord = model.getBoundingRect(inputX, inputY, inputAngle);
            const { x, y, angle } = coord.input;
            const { id } = model;

            stats.increment(model.modelId);

            inputX = coord.output.x;
            inputY = coord.output.y;
            inputAngle = coord.output.angle;

            topLeft.x = Math.min(topLeft.x, coord.x);
            topLeft.y = Math.min(topLeft.y, coord.y);

            bottomRight.x = Math.max(bottomRight.x, coord.x + coord.width);
            bottomRight.y = Math.max(bottomRight.y, coord.y + coord.height);

            return { id, x, y, angle, model };
        });

        const { x, y } = topLeft;
        const { x: width, y: height } = bottomRight.sub(topLeft);

        return { x, y, width, height, tiles, stats };
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
     * @returns {TilesList} - Chains the instance.
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
        this.rebuildStats();

        return this;
    }

    /**
     * Removes all tiles from the list.
     * @returns {TilesList} - Chains the instance.
     */
    clear() {
        this.stats.clear();
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
 * @typedef {object} trackCoord - Represents a track ready to be rendered.
 * @property {number} x - The left coordinate of the track.
 * @property {number} y - The top coordinate of the track.
 * @property {number} width - The width of the track.
 * @property {number} height - The height of the track.
 * @property {tileCoord[]} tiles - The list of tiles.
 * @property {object} stats - An object listing the stats for the track.
 */

/**
 * @typedef {object} tileCoord - Represents a positioned tile.
 * @property {string} id - The unique identifier of the tile.
 * @property {number} x - The left coordinate of the tile.
 * @property {number} y - The top coordinate of the tile.
 * @property {number} angle - The rotation angle of the tile.
 * @property {TileModel} model - A reference to the tile model.
 */

/**
 * @typedef {import('./TileModel').tileExport} tileExport
 */

/**
 * @typedef {import('./TileModel').TileModel} TileModel
 */
