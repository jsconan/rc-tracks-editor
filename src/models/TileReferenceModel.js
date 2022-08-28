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

import getTileComponent from '../helpers/getTileComponent.js';
import getTileModel from '../helpers/getTileModel.js';
import { isDirectionValid, isTypeValid, STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT } from '../helpers/types.js';
import uid from '../helpers/uid.js';

/**
 * @typedef {import('./TileModel')} TileModel
 */

/**
 * @typedef {import('svelte').SvelteComponent} SvelteComponent
 */

/**
 * Represents a reference to a tile model.
 */
export default class TileReferenceModel {
    /**
     * Represents a reference to a tile model with the given specifications.
     * @param {string} type - The type of referenced tile.
     * @param {string} direction - The direction of the tile, it can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     */
    constructor(type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        this.id = uid();
        this.setType(type);
        this.setDirection(direction);
        this.setRatio(ratio);
    }

    /**
     * Sets the type of referenced tile.
     * @param {string} type - The type of referenced tile.
     * @returns {TileReferenceModel} - Chains the instance.
     * @throws {TypeError} - If the given type is not valid.
     */
    setType(type) {
        if (!isTypeValid(type)) {
            throw new TypeError('A valid type of tile is needed!');
        }

        this.type = type;
        return this;
    }

    /**
     * Sets the direction of the tile.
     * It can be either TileModel.DIRECTION_RIGHT or TileModel.DIRECTION_LEFT.
     * @param {string} direction - The direction of the tile.
     * @returns {TileReferenceModel} - Chains the instance.
     * @throws {TypeError} - If the given direction is not valid.
     */
    setDirection(direction) {
        if (!isDirectionValid(direction)) {
            throw new TypeError('A valid direction is needed!');
        }

        this.direction = direction;
        return this;
    }

    /**
     * Sets the size factor of the tile.
     * 1 means the tile fits 1 tile section in each direction.
     * @param {number} ratio - The size factor of the tile.
     * @returns {TileReferenceModel} - Chains the instance.
     */
    setRatio(ratio) {
        this.ratio = Math.abs(ratio || 1);
        return this;
    }

    /**
     * Creates the model of the tile with the given size constraints with respect to the stored reference.
     * @param {number} laneWidth - The width of the track lane (the distance between the barriers).
     * @param {number} barrierWidth - The width of the barriers.
     * @param {number} barrierChunks - The number of barrier chunks per section.
     * @returns {TileModel} - Returns a tile model of the expected type.
     */
    getModel(laneWidth, barrierWidth, barrierChunks) {
        const Model = getTileModel(this.type);
        // @ts-expect-error
        return new Model(laneWidth, barrierWidth, barrierChunks, this.ratio);
    }

    /**
     * Gets the component constructor of the tile with respect to the stored reference.
     * @returns {SvelteComponent} - Returns the constructor of the component.
     */
    getComponent() {
        return getTileComponent(this.type);
    }
}
