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
} from '../../tile/helpers';
import { CurvedTileEnlargedModel, CurvedTileModel, StraightTileModel } from '../../tile/models';

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
export default (specs, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) => {
    validateType(type);
    return new modelsMap[type](specs, direction, ratio);
};
