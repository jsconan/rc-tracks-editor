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

import { TileSpecifications } from '../config';
import { getTypes } from '../helpers';
import { TileCounter } from './TileCounter.js';
import { TileList } from './TileList.js';

/**
 * Represents a set of tile models with counters.
 */
export class TileSet extends TileCounter {
    /**
     * Creates a set of tile models with counters.
     * @param {TileSpecifications} specs - The specifications for the tiles.
     * @param {TileModel[]|TileList} source - A list of tile model to initialize the counters.
     * @throws {TypeError} - If the given specifications object is not valid.
     * @throws {TypeError} - If one of the tiles in the source is not a TileModel.
     */
    constructor(specs, source = null) {
        super();

        this.setSpecs(specs);

        if (!source) {
            source = [];
            getTypes().forEach(type => {
                const model = TileList.createTile(specs, type);

                for (let ratio = 1; ratio <= model.maxRatio; ratio++) {
                    source.push([model.clone().setRatio(ratio), Number.POSITIVE_INFINITY]);
                }
            });
        }

        this.load(source);
        source = void 0;
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

        if (this.models.size) {
            this.models.forEach(model => model.setSpecs(specs));

            this.emit('specs', specs);
        }

        return this;
    }
}

/**
 * @typedef {import('./TileModel.js').TileModel} TileModel
 */

/**
 * Notifies the tile specification have changed.
 * @event specs
 * @param {TileSpecifications} specs - The specifications for the tiles.
 */
