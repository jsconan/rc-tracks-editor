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
import { TILE_DIRECTION_LEFT } from '../../tile/helpers';

/**
 * Process a list of tiles for rendering, computing the coordinates of each tile.
 * @param {*} list - The list of tiles from which build the track. It must implement a map method.
 * @param {object} config - A set of config options.
 * @param {number} [config.startX] - The X-coordinate of the first tile.
 * @param {number} [config.startY] - The Y-coordinate of the first tile.
 * @param {number} [config.tileAngle] - The rotation angle of each tile.
 * @param {number} [config.tileWidth] - The reserved width for each tile.
 * @param {number} [config.tileHeight] - The reserved height for each tile.
 * @param {number} [config.hPadding] - An horizontal padding added around the tiles.
 * @param {number} [config.vPadding] - A vertical padding added around the tiles.
 * @param {boolean} [config.centered] - Whether or not center the tiles.
 * @param {boolean} [config.aligned] - Whether or not align the tiles.
 * @param {boolean} [config.vertical] - Position the tiles vertically.
 * @returns {trackCoord} - Returns the list of coordinates.
 * @throws {TypeError} - If the given list does not implement the map method.
 */
export default (
    list,
    {
        startX = 0,
        startY = 0,
        tileAngle = 0,
        tileWidth = 0,
        tileHeight = 0,
        hPadding = 0,
        vPadding = 0,
        centered = false,
        aligned = false,
        vertical = false
    } = {}
) => {
    validateAPI(list, ['map']);

    const topLeft = new Vector2D();
    const bottomRight = new Vector2D();
    let tileX = startX;
    let tileY = startY;

    const tiles = list.map(model => {
        const curveAngle = model.getCurveAngle();
        const { id, type, direction, ratio } = model;
        const alignedAngle = curveAngle / 2;
        const directionAngle =
            direction === TILE_DIRECTION_LEFT ? Vector2D.STRAIGHT_ANGLE * 2 - alignedAngle : alignedAngle;
        const angle = tileAngle - (aligned && curveAngle < Vector2D.RIGHT_ANGLE ? directionAngle : 0);
        const rect = model.getBoundingRect(0, 0, angle);
        const width = Math.max(tileWidth, rect.width) + hPadding * 2;
        const height = Math.max(tileHeight, rect.height) + vPadding * 2;
        const dx = centered ? Math.max(0, tileWidth - rect.width) / 2 : 0;
        const dy = centered ? Math.max(0, tileHeight - rect.height) / 2 : 0;
        const topX = tileX - (centered && vertical ? width / 2 : 0) - hPadding;
        const topY = tileY - (!centered || vertical ? 0 : height / 2) - vPadding;
        const x = topX - rect.x + hPadding + dx;
        const y = topY - rect.y + vPadding + dy;

        topLeft.x = Math.min(topLeft.x, topX);
        topLeft.y = Math.min(topLeft.y, topY);

        bottomRight.x = Math.max(bottomRight.x, topX + width);
        bottomRight.y = Math.max(bottomRight.y, topY + height);

        if (vertical) {
            tileY += height;
        } else {
            tileX += width;
        }

        return { id, type, direction, ratio, x, y, angle, rect, model };
    });

    const { x, y } = topLeft;
    const { x: width, y: height } = bottomRight.sub(topLeft);

    return { x, y, width, height, tiles };
};

/**
 * @typedef {import('../models/TrackBuilder.js').trackCoord} trackCoord
 */
