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

import CurvedTileEnlargedModel from '../models/curved-tile-enlarged-model.js';
import CurvedTileModel from '../models/curved-tile-model.js';
import StraightTileModel from '../models/straight-tile-model.js';
import { CURVED_TILE_ENLARGED_TYPE, CURVED_TILE_TYPE, STRAIGHT_TILE_TYPE } from './types.js';

/**
 * @typedef {import('../models/tile-model')} TileModel
 */

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
 * Gets the constructor of the tile model with respect to the given type.
 * @function getTileModel
 * @param {string} type - The type of tile for which get the model.
 * @returns {TileModel} - Returns the constructor of the model or null if it does not exist.
 */
export default type => modelsMap[type] || null;
