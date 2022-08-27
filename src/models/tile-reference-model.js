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

import CurvedTile from '../tiles/CurvedTile.svelte';
import CurvedTileEnlarged from '../tiles/CurvedTileEnlarged.svelte';
import StraightTile from '../tiles/StraightTile.svelte';
import { CurvedTileEnlargedModel } from './curved-tile-enlarged-model.js';
import { CurvedTileModel } from './curved-tile-model.js';
import { StraightTileModel } from './straight-tile-model.js';
import { TileModel } from './tile-model.js';

/**
 * @type {number} - The internal counter for generating unique identifiers.
 * @private
 */
let counter = 0;

/**
 * Generates a unique identifier for a tile.
 * @returns {string} - Returns a unique identifier for the tile.
 * @private
 */
const uid = () => `tile-${counter++}`;

/**
 * @type {string[]} - The list of allowed tile types.
 * @private
 */
const allowedTypes = [StraightTileModel.TYPE, CurvedTileModel.TYPE, CurvedTileEnlargedModel.TYPE];

/**
 * @type {number[]} - The list of allowed tile directions.
 * @private
 */
const allowedDirection = [TileModel.DIRECTION_RIGHT, TileModel.DIRECTION_LEFT];

/**
 * @type {object} - Maps the types of tile to their respective model.
 * @private
 */
const modelsMap = {
    [StraightTileModel.TYPE]: StraightTileModel,
    [CurvedTileModel.TYPE]: CurvedTileModel,
    [CurvedTileEnlargedModel.TYPE]: CurvedTileEnlargedModel
};

/**
 * @type {object} - Maps the types of tile to their respective component.
 * @private
 */
const componentsMap = {
    [StraightTileModel.TYPE]: StraightTile,
    [CurvedTileModel.TYPE]: CurvedTile,
    [CurvedTileEnlargedModel.TYPE]: CurvedTileEnlarged
};

/**
 * Represents a reference to a tile model.
 */
export class TileReferenceModel {
    /**
     * Represents a reference to a tile model with the given specifications.
     * @param {string} type - The type of referenced tile.
     * @param {number} direction - The direction of the tile, it can be either TileModel.DIRECTION_RIGHT or TileModel.DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     */
    constructor(type = StraightTileModel.TYPE, direction = TileModel.DIRECTION_RIGHT, ratio = 1) {
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
        if (!allowedTypes.includes(type)) {
            throw new TypeError('A valid type of tile is needed!');
        }

        this.type = type;
        return this;
    }

    /**
     * Sets the direction of the tile.
     * It can be either TileModel.DIRECTION_RIGHT or TileModel.DIRECTION_LEFT.
     * @param {number} direction - The direction of the tile.
     * @returns {TileReferenceModel} - Chains the instance.
     * @throws {TypeError} - If the given direction is not valid.
     */
    setDirection(direction) {
        if (!allowedDirection.includes(direction)) {
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
        const Model = modelsMap[this.type];
        return new Model(laneWidth, barrierWidth, barrierChunks, this.ratio);
    }

    /**
     * Gets the component constructor of the tile with respect to the stored reference.
     * @returns {function} - Returns the constructor of the component.
     */
    getComponent() {
        return componentsMap[this.type];
    }
}
