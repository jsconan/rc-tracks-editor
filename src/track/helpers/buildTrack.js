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

import { validateAPI } from '../../core/helpers';
import { Vector2D } from '../../core/models';

/**
 * Process a list of tiles for rendering a track, computing the coordinates of each tile.
 * @param {*} list - The list of tiles from which build the track. It must implement a map method.
 * @param {object} config - A set of config options.
 * @param {number} [config.startX] - The X-coordinate of the first tile.
 * @param {number} [config.startY] - The Y-coordinate of the first tile.
 * @param {number} [config.startAngle] - The rotation angle of the first tile.
 * @param {number} [config.hPadding] - An horizontal padding added around the track.
 * @param {number} [config.vPadding] - A vertical padding added around the tracks.
 * @returns {trackCoord} - Returns the list of coordinates.
 * @throws {TypeError} - If the given list does not implement the map method.
 */
export default (list, { startX = 0, startY = 0, startAngle = 0, hPadding = 0, vPadding = 0 } = {}) => {
    validateAPI(list, ['map']);

    const topLeft = new Vector2D();
    const bottomRight = new Vector2D();
    let inputX = startX;
    let inputY = startY;
    let inputAngle = startAngle;

    const tiles = list.map(model => {
        const rect = model.getBoundingRect(inputX, inputY, inputAngle);
        const { x, y, angle } = rect.input;
        const { id, type, direction, ratio } = model;

        inputX = rect.output.x;
        inputY = rect.output.y;
        inputAngle = rect.output.angle;

        topLeft.x = Math.min(topLeft.x, rect.x);
        topLeft.y = Math.min(topLeft.y, rect.y);

        bottomRight.x = Math.max(bottomRight.x, rect.x + rect.width);
        bottomRight.y = Math.max(bottomRight.y, rect.y + rect.height);

        return { id, type, direction, ratio, x, y, angle, rect, model };
    });

    const { x, y } = topLeft.subCoord(hPadding, vPadding);
    const { x: width, y: height } = bottomRight.sub(topLeft).addCoord(hPadding * 2, vPadding * 2);

    return { x, y, width, height, tiles };
};

/**
 * @typedef {object} trackCoord - Represents a track ready to be rendered.
 * @property {number} x - The left coordinate of the track.
 * @property {number} y - The top coordinate of the track.
 * @property {number} width - The width of the track.
 * @property {number} height - The height of the track.
 * @property {tileCoord[]} tiles - The list of tiles.
 */

/**
 * @typedef {object} tileCoord - Represents a positioned tile.
 * @property {string} id - The unique identifier of the tile.
 * @property {string} type - The type of tile.
 * @property {string} direction - The direction of the tile.
 * @property {number} ratio - The size ratio of the tile.
 * @property {number} x - The left coordinate of the tile.
 * @property {number} y - The top coordinate of the tile.
 * @property {number} angle - The rotation angle of the tile.
 * @property {TileModel} model - A reference to the tile model.
 */

/**
 * @typedef {import('../../tile/models').TileModel} TileModel
 */
