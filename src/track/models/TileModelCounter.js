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

import { Counter } from '../../core/models';
import { TILE_DIRECTION_RIGHT } from '../helpers';

/**
 * Represents an observable counter for tile models.
 */
export class TileModelCounter extends Counter {
    /**
     * Creates an observable counter for tile models.
     * @param {TileModel[]|TileList} source - A list of tile model to initialize the counters.
     */
    constructor(source = []) {
        super();

        this.tileModels = new Map();

        for (const tile of source) {
            this.add(tile);
        }
        source = void 0;
    }

    /**
     * Gets the list of counted tile models for which the count if greater than 0.
     * @returns {TileModel[]} - Returns the list of counted tile models.
     */
    getTileModels() {
        return [...this.tileModels.values()];
    }

    /**
     * Gets the tile model registered under the given key.
     * @param {string} key - The key of the counter to get the tile model for.
     * @returns {TileModel} - The tile model registered under the given key.
     */
    getTileModel(key) {
        return this.tileModels.get(key) || null;
    }

    /**
     * Removes a counter together with its related tile model.
     * @param {string} key - The key of the counter to delete.
     * @returns {boolean} - Returns `true` if a counter was deleted.
     * @fires deletemodel
     * @fires delete
     */
    delete(key) {
        const model = this.tileModels.get(key);
        const deleted = this.tileModels.delete(key);

        if (deleted) {
            /**
             * Notifies a tile model has been removed.
             * @event deletemodel
             * @param {string} key - The key of the tile model that was removed.
             * @param {TileModel} model - The tile model that was removed.
             */
            this.emit('deletemodel', key, model);
        }

        return super.delete(key);
    }

    /**
     * Increments the counter for the given tile model.
     * If the tile model was not yet listed, it will be added.
     * @param {TileModel} tile - The tile to count.
     * @returns {TileModelCounter} - Chains the counter.
     * @fires set
     * @fires addmodel
     * @fires addtile
     */
    add(tile) {
        const { modelId } = tile;

        this.increment(modelId, 1);

        if (!this.tileModels.has(modelId)) {
            const model = tile.clone().setDirection(TILE_DIRECTION_RIGHT);
            this.tileModels.set(modelId, model);

            /**
             * Notifies a tile model has been added.
             * @event addmodel
             * @param {string} key - The key of the tile model that was added.
             * @param {TileModel} model - The tile model that was added.
             */
            this.emit('addmodel', modelId, model);
        }

        /**
         * Notifies a tile has been added.
         * @event addtile
         * @param {TileModel} tile - The tile that was added.
         */
        this.emit('addtile', tile);

        return this;
    }

    /**
     * Decrements the counter for the given tile model.
     * If the counter reaches 0, it will be removed together with the related tile model.
     * @param {TileModel} tile - The tile to count.
     * @returns {TileModelCounter} - Chains the counter.
     * @fires set
     * @fires deletemodel
     * @fires delete
     * @fires removetile
     */
    remove(tile) {
        const { modelId } = tile;
        const count = this.get(modelId);

        if (count > 0) {
            if (count > 1) {
                this.decrement(modelId, 1);
            } else {
                this.delete(modelId);
            }

            /**
             * Notifies a tile has been removed.
             * @event removetile
             * @param {TileModel} tile - The tile that was removed.
             */
            this.emit('removetile', tile);
        }

        return this;
    }

    /**
     * Removes all counters, including the related tile models.
     * @returns {TileModelCounter} - Chains the counter.
     * @fires clear
     */
    clear() {
        this.tileModels.clear();

        return super.clear();
    }
}

/**
 * @typedef {import('./TileList.js').TileList} TileList
 */

/**
 * @typedef {import('./TileModel.js').TileModel} TileModel
 */
