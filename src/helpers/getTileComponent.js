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
import { CURVED_TILE_ENLARGED_TYPE, CURVED_TILE_TYPE, STRAIGHT_TILE_TYPE } from './types.js';

/**
 * @typedef {import('svelte').SvelteComponent} SvelteComponent
 */

/**
 * @type {object} - Maps the types of tile to their respective component.
 * @private
 */
const componentsMap = {
    [STRAIGHT_TILE_TYPE]: StraightTile,
    [CURVED_TILE_TYPE]: CurvedTile,
    [CURVED_TILE_ENLARGED_TYPE]: CurvedTileEnlarged
};

/**
 * Gets the constructor of the tile component with respect to the given type.
 * @function getTileComponent
 * @param {string} type - The type of tile for which get the component.
 * @returns {SvelteComponent} - Returns the constructor of the component or null if it does not exist.
 */
export default type => componentsMap[type] || null;
