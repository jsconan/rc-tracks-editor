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

import { Vector2D } from '../../core/models';
import { TilesList } from '../models';

/**
 * Process a list of tiles for rendering, computing the coordinates of each tile.
 * @param {TilesList} list - The list of tiles from which prepare the rendering.
 * @param {number} listX - The X-coordinate of the list.
 * @param {number} listY - The Y-coordinate of the list.
 * @param {number} tileAngle - The rotation angle of each tile.
 * @param {boolean} vertical - Position the tiles vertically.
 * @returns {listCoord}
 */
export default (list, listX = 0, listY = 0, tileAngle = 0, vertical = true) => {
    if (!list || !(list instanceof TilesList)) {
        throw new TypeError('A valid list of tiles is needed!');
    }

    const topLeft = new Vector2D();
    const bottomRight = new Vector2D();
    let tileX = listX;
    let tileY = listY;

    const tiles = list.tiles.map(model => {
        const curveAngle = model.getCurveAngle();
        const angle = tileAngle - (curveAngle < Vector2D.RIGHT_ANGLE ? curveAngle / 2 : 0);
        const coord = model.getBoundingRect(0, 0, angle);
        const topX = tileX - (vertical ? coord.width / 2 : 0);
        const topY = tileY - (vertical ? 0 : coord.height / 2);
        const x = topX - coord.x;
        const y = topY - coord.y;
        const { id } = model;

        topLeft.x = Math.min(topLeft.x, topX);
        topLeft.y = Math.min(topLeft.y, topY);

        bottomRight.x = Math.max(bottomRight.x, topX + coord.width);
        bottomRight.y = Math.max(bottomRight.y, topY + coord.height);

        if (vertical) {
            tileY += coord.height;
        } else {
            tileX += coord.width;
        }

        return { id, x, y, angle, model };
    });

    const { x, y } = topLeft;
    const { x: width, y: height } = bottomRight.sub(topLeft);

    return { x, y, width, height, tiles };
};

/**
 * @typedef {object} listCoord - Represents a track ready to be rendered.
 * @property {number} x - The left coordinate of the track.
 * @property {number} y - The top coordinate of the track.
 * @property {number} width - The width of the track.
 * @property {number} height - The height of the track.
 * @property {tileCoord[]} tiles - The list of tiles.
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
