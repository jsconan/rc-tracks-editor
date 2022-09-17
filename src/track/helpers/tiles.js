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

/**
 * Tile oriented to the right.
 * @type {string}
 */
export const TILE_DIRECTION_RIGHT = 'right';

/**
 * Tile oriented to the left.
 * @type {string}
 */
export const TILE_DIRECTION_LEFT = 'left';

/**
 * Type for a default tile.
 * @type {string}
 */
export const DEFAULT_TILE_TYPE = 'tile';

/**
 * Type for a straight tile.
 * @type {string}
 */
export const STRAIGHT_TILE_TYPE = 'straight-tile';

/**
 * Type for a curved tile.
 * @type {string}
 */
export const CURVED_TILE_TYPE = 'curved-tile';

/**
 * Type for an enlarged curve tile.
 * @type {string}
 */
export const CURVED_TILE_ENLARGED_TYPE = 'curved-tile-enlarged';

/**
 * @type {string[]} - The list of allowed tile directions.
 * @private
 */
const allowedDirection = [TILE_DIRECTION_RIGHT, TILE_DIRECTION_LEFT];

/**
 * Checks if a given direction is valid for a tile.
 * @param {*} direction - The direction to check.
 * @returns {boolean} - Returns `true` if the direction is valid.
 */
export const isDirectionValid = direction => allowedDirection.includes(direction);

/**
 * Validates that a given direction is valid for a tile.
 * Otherwise, an error is thrown.
 * @param {*} direction - The direction to validate.
 * @throws {TypeError} - If the given direction is not valid.
 */
export const validateDirection = direction => {
    if (!isDirectionValid(direction)) {
        throw new TypeError('A valid direction is needed!');
    }
};

/**
 * @type {string[]} - The list of allowed tile types.
 * @private
 */
const allowedTypes = [STRAIGHT_TILE_TYPE, CURVED_TILE_TYPE, CURVED_TILE_ENLARGED_TYPE];

/**
 * Checks if a given type is valid for a tile.
 * @param {*} type - The type to check.
 * @returns {boolean} - Returns `true` if the type is valid.
 */
export const isTypeValid = type => allowedTypes.includes(type);

/**
 * Validates that a given type is valid for a tile.
 * Otherwise, an error is thrown.
 * @param {*} type - The type to validate.
 * @throws {TypeError} - If the given type is not valid.
 */
export const validateType = type => {
    if (!isTypeValid(type)) {
        throw new TypeError('A valid type of tile is needed!');
    }
};
