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

import { getTypes, TILE_DIRECTION_RIGHT } from '../../tile/helpers';
import { TileCounter, TileList } from '../../tile/models';
import { TileSpecifications } from '../../tile/config';
import { TileCounterStore, TileModelsStore } from '../../tile/stores';

/**
 * Represents a set of tile models that can be consumed.
 */
export class TileSet extends TileCounter {
    /**
     * Represents a set of tile models that can be consumed.
     * @param {TileSpecifications} specs - The specifications for the track tiles.
     * @param {TileModel[]} source - A list of tiles to initialize the set.
     * @throws {TypeError} - If the given specifications object is not valid.
     * @throws {TypeError} - If one of the tiles in the source is not a TileModel.
     */
    constructor(specs, source = null) {
        super(source);

        this.counter = new TileCounter();
        this.setSpecs(specs);

        if (!source) {
            this.loadAllModels();
        }
        source = void 0;

        this.modelsStore = new TileModelsStore(this);
        this.counterStore = new TileCounterStore(this);

        this.on('removetile', (tile, amount) => this.counter.add(tile, amount));
        this.on('addtile', (tile, amount) => this.counter.remove(tile, amount));
    }

    /**
     * Sets the specifications for the track tiles.
     * @param {TileSpecifications} specs - The specifications for the track tiles.
     * @returns {TileSet} - Chains the instance.
     * @throws {TypeError} - If the given specifications object is not valid.
     * @fires specs
     */
    setSpecs(specs) {
        TileSpecifications.validateInstance(specs);

        this.specs = specs;
        this.counter.setSpecs(specs);

        return super.setSpecs(specs);
    }

    /**
     * Restores the tiles removed from the set.
     * @returns {TileSet} - Chains the instance.
     * @fires set
     * @fires addmodel
     * @fires addtile
     * @fires reset
     */
    reset() {
        this.modelsStore.unbind();
        this.counterStore.unbind();

        for (const { model, count } of this.counter.getCounterList()) {
            this.add(model, count);
        }
        this.counter.clear();

        this.modelsStore.bind(this);
        this.counterStore.bind(this);

        this.emit('reset');

        return this;
    }

    /**
     * Consumes tiles from the set.
     * @param {TileModel[]} tiles - A list of tiles that is using the set.
     * @returns {TileSet} - Chains the instance.
     * @fires set
     * @fires removemodel
     * @fires delete
     * @fires removetile
     * @fires consume
     */
    consume(tiles) {
        this.modelsStore.unbind();
        this.counterStore.unbind();

        for (const tile of tiles) {
            this.remove(tile);
        }

        this.modelsStore.bind(this);
        this.counterStore.bind(this);

        this.emit('consume');

        return this;
    }

    /**
     * Loads counters from the list of all available tile models.
     * The counters are cleared before, including the related tile models.
     * @param {number} count - The initial count given to each counter.
     * @returns {TileSet} - Chains the instance.
     * @fires load
     */
    loadAllModels(count = Number.POSITIVE_INFINITY) {
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
                    const model = TileList.createTile(counter.specs, type, TILE_DIRECTION_RIGHT, ratio);

                    yield [model, count];

                    maxRatio = model.maxRatio;
                } while (ratio++ < maxRatio);
            }
        }

        return this.load(loadAll(this));
    }

    /**
     * Loads counters from a list of tiles.
     * The counters are cleared before, including the related tile models.
     * @param {*} iterator - An iterable object that can be used to set the counters.
     * @returns {TileSet} - Chains the instance.
     * @fires load
     */
    load(iterator) {
        if (!iterator || !iterator[Symbol.iterator]) {
            return this;
        }

        if (this.counter) {
            this.counter.clear();
        }
        return super.load(iterator);
    }

    /**
     * Removes all counters, including the related tile models.
     * @returns {TileSet} - Chains the instance.
     * @fires clear
     */
    clear() {
        this.counter.clear();

        return super.clear();
    }
}

/**
 * @typedef {import('../../tile/models').TileModel} TileModel
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
 * Notifies the removed tiles have been restored to the set.
 * @event reset
 */

/**
 * Notifies a list of tiles have been consumed from the set.
 * @event consume
 */

/**
 * Notifies all counters has been removed.
 * @event clear
 */

/**
 * Notifies the counters has been loaded.
 * @event load
 */
