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

import TileModel from './tile-model.js';

/**
 * Represents a straight track tile.
 */
export default class StraightTileModel extends TileModel {
    /**
     * Gets the type of tile.
     * @returns {string}
     */
    getType() {
        return StraightTileModel.TYPE;
    }

    /**
     * Computes the actual width of the tile with respect to the ratio.
     * @returns {number}
     */
    getWidth() {
        return this.width;
    }
}

/**
 * The type of tile.
 * @constant {string} StraightTileModel.TYPE
 */
Object.defineProperty(StraightTileModel, 'TYPE', {
    value: 'straight-tile',
    writable: false,
    enumerable: true,
    configurable: true
});
