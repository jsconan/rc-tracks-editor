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

import { STRAIGHT_TILE_TYPE } from '../helpers/types.js';
import TileModel from './TileModel.js';

/**
 * Represents a straight track tile.
 */
export default class StraightTileModel extends TileModel {
    /**
     * Computes the actual width of the tile with respect to the ratio.
     * @returns {number}
     */
    getWidth() {
        return this.width;
    }

    /**
     * Computes the angle for rotating the tile to the left.
     * @returns {number}
     */
    getDirectionAngleLeft() {
        return 180;
    }
}

/**
 * The type of tile.
 * @constant {string} StraightTileModel.TYPE
 */
Object.defineProperty(StraightTileModel, 'TYPE', {
    value: STRAIGHT_TILE_TYPE,
    writable: false,
    enumerable: true,
    configurable: true
});
