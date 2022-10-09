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

import { Counter, SortedSet } from '../../core/models';
import { TileSpecifications } from '../config';
import { getTypes, TILE_DIRECTION_RIGHT } from '../helpers';
import { TileList } from './TileList.js';

/**
 * Extracts the tile model from a tile.
 * @param {TileModel} tile - The tile from which get the model.
 * @returns {TileModel} - The base model of the given tile.
 * @private
 */
const extractModel = tile => tile.clone().setDirection(TILE_DIRECTION_RIGHT);

/**
 * Represents an observable counter for tile models.
 */
export class TileCounter extends Counter {
    /**
     * Creates an observable counter for tile models.
     * @param {TileModel[]|TileList} source - A list of tile model to initialize the counters.
     */
    constructor(source = null) {
        super();

        this.models = new Map();
        this.sortedModels = new SortedSet();

        if (source) {
            this.load(source);
            source = void 0;
        }
    }

    /**
     * Sets the specifications for the counted tile models.
     * @param {TileSpecifications} specs - The specifications for the tiles.
     * @returns {TileCounter} - Chains the instance.
     * @throws {TypeError} - If the given specifications object is not valid.
     * @fires specs
     */
    setSpecs(specs) {
        TileSpecifications.validateInstance(specs);

        if (this.models.size) {
            this.models.forEach(model => model.setSpecs(specs));

            this.emit('specs', specs);
        }

        return this;
    }

    /**
     * Exports the counters to an array.
     * @returns {tileCounter[]} - A list of tile counters.
     */
    getCounterList() {
        const counters = [];

        for (const model of this.sortedModels) {
            const { modelId } = model;
            const count = this.get(modelId);
            counters.push({ modelId, model, count });
        }

        return counters;
    }

    /**
     * Gets the list of counted tile models for which the count if greater than 0.
     * @returns {TileModel[]} - Returns the list of counted tile models.
     */
    getModelList() {
        return [...this.sortedModels];
    }

    /**
     * Gets the tile model registered under the given key.
     * @param {string} key - The key of the counter to get the tile model for.
     * @returns {TileModel} - The tile model registered under the given key.
     */
    getModel(key) {
        return this.models.get(key) || null;
    }

    /**
     * Increments the counter for the given tile model.
     * If the tile model was not yet listed, it will be added.
     * @param {TileModel} tile - The tile to count.
     * @param {number} amount - The amount to add to the counter, say the number of similar tiles.
     * @returns {TileCounter} - Chains the instance.
     * @fires set
     * @fires addmodel
     * @fires addtile
     */
    add(tile, amount = 1) {
        const { modelId } = tile;

        this.increment(modelId, amount);

        if (!this.models.has(modelId)) {
            const model = extractModel(tile);
            this.models.set(modelId, model);
            this.sortedModels.add(model);

            this.emit('addmodel', modelId, model);
        }

        this.emit('addtile', tile, amount);

        return this;
    }

    /**
     * Decrements the counter for the given tile model.
     * If the counter reaches 0, it will be removed together with the related tile model.
     * @param {TileModel} tile - The tile to count.
     * @param {number} amount - The amount to subtract from the counter, say the number of similar tiles.
     * @returns {TileCounter} - Chains the instance.
     * @fires set
     * @fires removemodel
     * @fires delete
     * @fires removetile
     */
    remove(tile, amount = 1) {
        const { modelId } = tile;
        const count = this.get(modelId);

        if (count > 0) {
            if (count > amount) {
                this.decrement(modelId, amount);
            } else {
                amount = count;
                this.delete(modelId);
            }

            this.emit('removetile', tile, amount);
        }

        return this;
    }

    /**
     * Removes a counter together with its related tile model.
     * @param {string} key - The key of the counter to delete.
     * @returns {boolean} - Returns `true` if a counter was deleted.
     * @fires removemodel
     * @fires delete
     */
    delete(key) {
        const model = this.models.get(key);
        if (model) {
            this.models.delete(key);
            this.sortedModels.delete(model);

            this.emit('removemodel', key, model);
        }

        return super.delete(key);
    }

    /**
     * Removes all counters, including the related tile models.
     * @returns {TileCounter} - Chains the instance.
     * @fires clear
     */
    clear() {
        this.models.clear();
        this.sortedModels.clear();

        return super.clear();
    }

    /**
     * Loads counters from the list of all available tile models.
     * The counters are cleared before, including the related tile models.
     * @param {TileSpecifications} specs - The specifications for the tiles.
     * @param {number} count - The initial count given to each counter.
     * @returns {TileCounter} - Chains the instance.
     * @fires load
     */
    loadAllModels(specs, count = Number.POSITIVE_INFINITY) {
        TileSpecifications.validateInstance(specs);

        this.models.clear();
        this.sortedModels.clear();

        /**
         * @param {TileCounter} counter
         * @yields {Array}
         * @generator
         * @private
         */
        function* loadAll(counter) {
            for (const type of getTypes()) {
                let ratio = 1;
                let maxRatio = 1;
                do {
                    const model = TileList.createTile(specs, type, TILE_DIRECTION_RIGHT, ratio);
                    counter.models.set(model.modelId, model);
                    counter.sortedModels.add(model);

                    yield [model.modelId, count];

                    maxRatio = model.maxRatio;
                } while (ratio++ < maxRatio);
            }
        }

        return super.load(loadAll(this));
    }

    /**
     * Loads counters from a list of tiles.
     * The counters are cleared before, including the related tile models.
     * @param {*} iterator - An iterable object that can be used to set the counters.
     * @returns {TileCounter} - Chains the instance.
     * @fires load
     */
    load(iterator) {
        if (!iterator || !iterator[Symbol.iterator]) {
            return this;
        }

        this.models.clear();
        this.sortedModels.clear();

        /**
         * @param {TileCounter} counter
         * @yields {Array}
         * @generator
         * @private
         */
        function* loadTiles(counter) {
            for (const value of iterator) {
                let tile, count;
                if (Array.isArray(value)) {
                    tile = value[0];
                    count = value[1];
                } else {
                    tile = value;
                    count = counter.get(tile.modelId) + 1;
                }

                const { modelId } = tile;

                if (!counter.models.has(modelId)) {
                    const model = extractModel(tile);
                    counter.models.set(modelId, model);
                    counter.sortedModels.add(model);
                }

                yield [modelId, count];
            }
        }

        return super.load(loadTiles(this));
    }
}

/**
 * @typedef {object} tileCounter - Represent a tile counter.
 * @property {string} modelId - The identifier of the model.
 * @property {TileModel} model - A reference to the tile model.
 * @property {number} count - The number of tiles referenced for this model.
 */

/**
 * @typedef {import('./TileList.js').TileList} TileList
 */

/**
 * @typedef {import('./TileModel.js').TileModel} TileModel
 */

/**
 * Notifies the tile specification have changed.
 * @event specs
 * @param {TileSpecifications} specs - The specifications for the tiles.
 */

/**
 * Notifies a tile model has been added.
 * @event addmodel
 * @param {string} key - The key of the tile model that was added.
 * @param {TileModel} model - The tile model that was added.
 */

/**
 * Notifies a tile model has been removed.
 * @event removemodel
 * @param {string} key - The key of the tile model that was removed.
 * @param {TileModel} model - The tile model that was removed.
 */

/**
 * Notifies a tile has been added.
 * @event addtile
 * @param {TileModel} tile - The tile that was added.
 * @param {number} amount - The number of similar tiles that was added.
 */

/**
 * Notifies a tile has been removed.
 * @event removetile
 * @param {TileModel} tile - The tile that was removed.
 * @param {number} amount - The number of similar tiles that was removed.
 */

/**
 * Notifies a value has been set to a counter.
 * @event set
 * @param {string} key - The key of the counter that was set.
 * @param {number} newValue - The new value.
 * @param {number} oldValue - The previous value.
 */

/**
 * Notifies a counter has been removed.
 * @event delete
 * @param {string} key - The key of the counter that was removed.
 * @param {number} value - The last value of the removed counter.
 */

/**
 * Notifies all counters has been removed.
 * @event clear
 */

/**
 * Notifies the counters has been loaded.
 * @event load
 */
