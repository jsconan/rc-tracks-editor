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
    isDirectionValid,
    isTypeValid,
    CURVED_TILE_ENLARGED_TYPE,
    CURVED_TILE_TYPE,
    STRAIGHT_TILE_TYPE,
    TILE_DIRECTION_RIGHT
} from '../helpers';
import { uid } from '../../core/helpers';
import { CurvedTileEnlargedModel } from './CurvedTileEnlargedModel.js';
import { CurvedTileModel } from './CurvedTileModel.js';
import { StraightTileModel } from './StraightTileModel.js';
import { TileSpecifications } from './TileSpecifications';

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
 * Creates the tile model with respect to the given reference.
 * @param {TileReferenceModel} ref - The reference object.
 * @returns {TileModel} - Returns a tile model of the expected type.
 * @throws {TypeError} - If the given specifications object is not valid.
 * @throws {TypeError} - If the given direction is not valid.
 * @private
 */
function getModel(ref) {
    const Model = modelsMap[ref.type];
    return new Model(ref.specs, ref.direction, ref.ratio);
}

/**
 * Represents a reference to a tile model.
 */
export class TileReferenceModel {
    /**
     * Represents a reference to a tile model with the given specifications.
     * @param {TileSpecifications} specs - The specifications for the tiles.
     * @param {string} type - The type of referenced tile.
     * @param {string} direction - The direction of the tile, it can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @throws {TypeError} - If the given specifications object is not valid.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     */
    constructor(specs, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        this.setSpecs(specs);
        this.setType(type);
        this.setDirection(direction);
        this.setRatio(ratio);
        this.id = uid();
        this.model = getModel(this);
    }

    /**
     * The identifier for the model.
     * @type {string}
     */
    get modelId() {
        return this.model.id;
    }

    /**
     * Sets the specifications for the tiles.
     * @param {TileSpecifications} specs - The specifications for the tiles.
     * @returns {TileReferenceModel} - Chains the instance.
     * @throws {TypeError} - If the given specifications object is not valid.
     */
    setSpecs(specs) {
        if (!specs || !(specs instanceof TileSpecifications)) {
            throw new TypeError('A valid specifications object is needed!');
        }

        this.specs = specs;

        if (this.model) {
            this.model.setSpecs(specs);
        }

        return this;
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

        if (this.model) {
            this.model = getModel(this);
        }

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

        if (this.model) {
            this.model.setDirection(direction);
        }

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

        if (this.model) {
            this.model.setRatio(ratio);
        }

        return this;
    }

    /**
     * Exports the model to an object.
     * @returns {tileExport} - An object representation of the model.
     */
    export() {
        const { type, direction, ratio } = this;
        return { type, direction, ratio };
    }

    /**
     * Computes the coordinates of the tile.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {tileCoord} - The computed coordinates for rendering the tile.
     * @throws {TypeError} - If the given specifications object is not valid.
     */
    build(x = 0, y = 0, angle = 0) {
        const { id, type, model } = this;
        const outputAngle = model.getOutputAngle(angle);
        const outputCoord = model.getOutputCoord(x, y, angle);
        const centerCoord = model.getCenterCoord(x, y, angle);

        return { id, type, x, y, angle, centerCoord, outputCoord, outputAngle, model };
    }
}

/**
 * @typedef {object} tileCoord - Represents a tile ready to be rendered.
 * @property {string} id - The identifier of the tile.
 * @property {string} type - The type of tile.
 * @property {number} x - The left coordinate of the tile.
 * @property {number} y - The top coordinate of the tile.
 * @property {number} angle - The rotation angle of the tile.
 * @property {Vector2D} centerCoord - The coordinates of the center of the tile.
 * @property {Vector2D} outputCoord - The coordinates of the output of the tile.
 * @property {number} outputAngle - The rotation angle at the output of the tile.
 * @property {TileModel} model - The tile model with respect to its type.
 */

/**
 * @typedef {object} tileExport - Represents an exported tile reference.
 * @property {string} type - The type of tile.
 * @property {string} direction - The direction of the tile.
 * @property {number} ratio - The size ratio of the tile.
 */

/**
 * @typedef {import('./TileModel').TileModel} TileModel
 */

/**
 * @typedef {import('../../core/models/Vector2D').Vector2D} Vector2D
 */
