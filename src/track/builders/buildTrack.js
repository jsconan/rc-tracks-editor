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

import { Counter, Vector2D } from '../../core/models';
import { TilesList } from '../models';

/**
 * Process a list of tiles for rendering a track, computing the coordinates of each tile.
 * @param {TilesList} list - The list of tiles from which build the track.
 * @param {object} config - A set of config options.
 * @param {number} [config.startX] - The X-coordinate of the first tile.
 * @param {number} [config.startY] - The Y-coordinate of the first tile.
 * @param {number} [config.startAngle] - The rotation angle of the first tile.
 * @returns {trackCoord}
 */
export default (list, { startX = 0, startY = 0, startAngle = 0 } = {}) => {
    if (!list || !(list instanceof TilesList)) {
        throw new TypeError('A valid list of tiles is needed!');
    }

    const topLeft = new Vector2D();
    const bottomRight = new Vector2D();
    let inputX = startX;
    let inputY = startY;
    let inputAngle = startAngle;

    const stats = new Counter();
    const tiles = list.tiles.map(model => {
        const coord = model.getBoundingRect(inputX, inputY, inputAngle);
        const { x, y, angle } = coord.input;
        const { id } = model;

        stats.increment(model.modelId);

        inputX = coord.output.x;
        inputY = coord.output.y;
        inputAngle = coord.output.angle;

        topLeft.x = Math.min(topLeft.x, coord.x);
        topLeft.y = Math.min(topLeft.y, coord.y);

        bottomRight.x = Math.max(bottomRight.x, coord.x + coord.width);
        bottomRight.y = Math.max(bottomRight.y, coord.y + coord.height);

        return { id, x, y, angle, model };
    });

    const { x, y } = topLeft;
    const { x: width, y: height } = bottomRight.sub(topLeft);

    return { x, y, width, height, tiles, stats };
};

/**
 * @typedef {object} trackCoord - Represents a track ready to be rendered.
 * @property {number} x - The left coordinate of the track.
 * @property {number} y - The top coordinate of the track.
 * @property {number} width - The width of the track.
 * @property {number} height - The height of the track.
 * @property {tileCoord[]} tiles - The list of tiles.
 * @property {Counter} stats - An object listing the stats for the track.
 */

/**
 * @typedef {object} tileCoord - Represents a positioned tile.
 * @property {string} id - The unique identifier of the tile.
 * @property {number} x - The left coordinate of the tile.
 * @property {number} y - The top coordinate of the tile.
 * @property {number} angle - The rotation angle of the tile.
 * @property {TileModel} model - A reference to the tile model.
 */

/**
 * @typedef {import('../models').TileModel} TileModel
 */