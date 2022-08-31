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
import { STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT } from '../helpers/types.js';
import TileReferenceModel from './TileReferenceModel.js';
import Vector2D from './Vector2D.js';
import List from '../stores/List.js';

/**
 * @typedef {import('./TileModel')} TileModel
 */

/**
 * @typedef {import('svelte').SvelteComponent} SvelteComponent
 */

/**
 * @typedef {object} tileExport - Represents an exported tile reference.
 * @property {string} type - The type of tile.
 * @property {string} direction - The direction of the tile.
 * @property {number} ratio - The size ratio of the tile.
 */

/**
 * @typedef {object} tile - Represents a tile ready to be rendered.
 * @property {string} id - The identifier of the tile.
 * @property {string} type - The type of tile.
 * @property {number} x - The left coordinate of the tile.
 * @property {number} y - The top coordinate of the tile.
 * @property {string} direction - The direction of the tile.
 * @property {number} angle - The rotation angle of the tile.
 * @property {number} ratio - The size ratio of the tile.
 * @property {TileModel} model - The tile model with respect to its type.
 * @property {SvelteComponent} component - The constructor of the component.
 */

/**
 * @typedef {object} track - Represents a track ready to be rendered.
 * @property {number} x - The left coordinate of the track.
 * @property {number} y - The top coordinate of the track.
 * @property {number} width - The width of the track.
 * @property {number} height - The height of the track.
 * @property {tile[]} tiles - The list of tiles.
 * @property {object} stats - An object listing the stats for the track.
 */

/**
 * Update the number of identified types.
 * @param {object} stats - The receiver for the stats.
 * @param {string} type - The type to count.
 * @param {number} diff - The amount to add for the identified type.
 * @private
 */
function updateStats(stats, type, diff = 1) {
    stats[type] = Math.max(0, (stats[type] || 0) + diff);
}

/**
 * Represents a track.
 */
export default class TrackModel {
    /**
     * Represents a track with the given size constraints.
     * @param {number} laneWidth - The width of the track lane (the distance between the barriers).
     * @param {number} barrierWidth - The width of the barriers.
     * @param {number} barrierChunks - The number of barrier chunks per section.
     */
    constructor(laneWidth, barrierWidth, barrierChunks) {
        this.laneWidth = laneWidth;
        this.barrierWidth = barrierWidth;
        this.barrierChunks = barrierChunks;
        this.tiles = new List();
        this.stats = {};

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
     * Gets the position of a tile inside the track.
     * @param {string} id - The unique identifier of the tile.
     * @returns {number} - The position of the tile, or `-1` if it does not exist.
     */
    getTileIndex(id) {
        return this.tiles.find(tile => tile.id === id);
    }

    /**
     * Retrieves a tile by its identifier.
     * @param {string} id - The unique identifier of the tile.
     * @returns {TileReferenceModel} - The referenced tile, or `null` if it does not exist.
     */
    getTile(id) {
        return this.getTileAt(this.getTileIndex(id));
    }

    /**
     * Gets a tile from a particular position.
     * @param {number} index - The position of the tile.
     * @returns {TileReferenceModel} - The referenced tile, or `null` if it does not exist.
     */
    getTileAt(index) {
        return this.tiles.get(index) || null;
    }

    /**
     * Add a tile to the track, at the last position.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {string} - Returns the unique identifier of the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     */
    appendTile(type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const tile = new TileReferenceModel(type, direction, ratio);

        updateStats(this.stats, type);
        this.tiles.add(tile);

        return tile.id;
    }

    /**
     * Add a tile to the track, at the first position.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {string} - Returns the unique identifier of the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     */
    prependTile(type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const tile = new TileReferenceModel(type, direction, ratio);

        updateStats(this.stats, type);
        this.tiles.insert(0, tile);

        return tile.id;
    }

    /**
     * Removes a tile from the track.
     * @param {string} id - The unique identifier of the tile to remove.
     * @returns {boolean} - Returns `true` if the deletion succeeds. Otherwise, returns `false`.
     */
    removeTile(id) {
        const index = this.getTileIndex(id);

        if (index < 0) {
            return false;
        }

        updateStats(this.stats, this.tiles.get(index).type, -1);

        return this.tiles.delete(index) > 0;
    }

    /**
     * Replace a tile in the track.
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
            const tile = new TileReferenceModel(type, direction, ratio);

            updateStats(this.stats, this.tiles.get(index).type, -1);
            updateStats(this.stats, type);

            this.tiles.set(index, tile);

            return tile.id;
        }

        return null;
    }

    /**
     * Insert a tile in the track before a particular position.
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
            const tile = new TileReferenceModel(type, direction, ratio);

            updateStats(this.stats, type);
            this.tiles.insert(index, tile);

            return tile.id;
        }

        return null;
    }

    /**
     * Insert a tile in the track after a particular position.
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
            const tile = new TileReferenceModel(type, direction, ratio);

            updateStats(this.stats, type);
            this.tiles.insert(index + 1, tile);

            return tile.id;
        }

        return null;
    }

    /**
     * Builds the track for rendering, computing the coordinates of each tile.
     * @param {number} startX - The X-coordinate of the first tile.
     * @param {number} startY - The Y-coordinate of the first tile.
     * @param {number} startAngle - The rotation angle of the first tile.
     * @returns {track}
     */
    build(startX = 0, startY = 0, startAngle = 0) {
        const topLeft = new Vector2D();
        const bottomRight = new Vector2D();
        let position = new Vector2D(startX, startY);
        let angle = startAngle;

        const stats = {};
        const tiles = this.tiles.map(tile => {
            const component = tile.getComponent();
            const model = tile.getModel(this.laneWidth, this.barrierWidth, this.barrierChunks);
            const center = model.getCenterCoord(position.x, position.y, angle);
            const middle = model.getLength() / 2;
            const { id, type, direction, ratio } = tile;
            const { x, y } = position;

            const specs = { id, type, x, y, direction, angle, ratio, model, component };

            updateStats(stats, type);

            position = model.getOutputCoord(direction, x, y, angle);
            angle = model.getOutputAngle(direction, angle);

            topLeft.x = Math.min(topLeft.x, center.x - middle);
            topLeft.y = Math.min(topLeft.y, center.y - middle);

            bottomRight.x = Math.max(bottomRight.x, center.x + middle);
            bottomRight.y = Math.max(bottomRight.y, center.y + middle);

            return specs;
        });

        const { x, y } = topLeft;
        const { x: width, y: height } = bottomRight.sub(topLeft);

        return { x, y, width, height, tiles, stats };
    }

    /**
     * Exports the model to an object.
     * @returns {tileExport[]} - An object representation of the model.
     */
    export() {
        return this.tiles.map(tile => {
            const { type, direction, ratio } = tile;
            return { type, direction, ratio };
        });
    }

    /**
     * Imports the model from an object.
     * The track is emptied before importing, any existing tile will be deleted.
     * @param {tileExport[]} data - An iterable object containing a representation of the model.
     * @returns {TrackModel} - Chains the instance.
     */
    import(data) {
        if (!data || !data[Symbol.iterator]) {
            return this;
        }

        const dataIterator = data[Symbol.iterator]();
        const loadIterator = {
            next: () => {
                let { done, value } = dataIterator.next();

                if (!done) {
                    const { type, direction, ratio } = value || {};
                    value = new TileReferenceModel(type, direction, ratio);
                    updateStats(this.stats, type);
                }

                return { done, value };
            },

            [Symbol.iterator]() {
                return this;
            }
        };

        this.stats = {};
        this.tiles.load(loadIterator);

        return this;
    }

    /**
     * Removes all tiles.
     * @returns {TrackModel} - Chains the instance.
     */
    clear() {
        this.stats = {};
        this.tiles.clear();

        return this;
    }
}
