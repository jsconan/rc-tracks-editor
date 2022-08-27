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

import Vector2D from './vector-2d.js';
import TileModel from './tile-model.js';

/**
 * Represents a track tile for an enlarged curve.
 */
export default class CurvedTileEnlargedModel extends TileModel {
    /**
     * Sets the size factor relative to a track section.
     * 1 means the tile fits 1 tile section in each direction.
     * @param {number} ratio - The size factor relative to a track section.
     * @returns {CurvedTileEnlargedModel} - Chains the instance.
     */
    setRatio(ratio) {
        this.ratio = Math.max(1, Math.floor(Math.abs(ratio)));
        return this;
    }

    /**
     * Gets the type of tile.
     * @returns {string}
     */
    getType() {
        return CurvedTileEnlargedModel.TYPE;
    }

    /**
     * Computes the angle for rotating the tile to the left.
     * @returns {number}
     */
    getDirectionAngleLeft() {
        return 90;
    }

    /**
     * Computes the angle of the curve with respect to the ratio.
     * @returns {number}
     */
    getCurveAngle() {
        return 90;
    }

    /**
     * Computes the length of the curve side if any.
     * @returns {number}
     */
    getCurveSide() {
        return this.getLength() / 2;
    }

    /**
     * Computes the number of barrier chunks on each side with respect to the ratio.
     * @returns {number}
     */
    getSideBarrierChunks() {
        return (this.barrierChunks * this.ratio) / 2;
    }

    /**
     * Computes the number of barrier chunks for the inner curve with respect to the ratio.
     * @returns {number}
     */
    getInnerBarrierChunks() {
        if (this.ratio <= 1) {
            return this.barrierChunks / 2;
        }
        return this.barrierChunks * this.ratio;
    }

    /**
     * Computes the number of barrier chunks for an outer curve with respect to the ratio.
     * @returns {number}
     */
    getOuterBarrierChunks() {
        return (this.barrierChunks / 2) * this.ratio;
    }

    /**
     * Computes the coordinates of the center point.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {Vector2D}
     */
    getCenterCoord(x = 0, y = 0, angle = 0) {
        const start = new Vector2D(x, y);
        const center = start.addScalarY(this.length * (this.ratio - 0.5));

        return center.rotateAround(angle, start);
    }

    /**
     * Computes the coordinates of the output point when the tile is oriented to the right.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {Vector2D}
     */
    getOutputCoordRight(x = 0, y = 0, angle = 0) {
        const start = new Vector2D(x, y);

        const radius = this.getInnerRadius() + this.width / 2;
        const curveAngle = this.getCurveAngle();
        const center = start.subScalarX(radius);

        return Vector2D.polar(radius, curveAngle, center).rotateAround(angle, start);
    }

    /**
     * Computes the coordinates of the output point when the tile is oriented to the left.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {Vector2D}
     */
    getOutputCoordLeft(x = 0, y = 0, angle = 0) {
        const start = new Vector2D(x, y);

        const radius = this.getInnerRadius() + this.width / 2;
        const curveAngle = this.getCurveAngle();
        const center = start.addScalarX(radius);

        return Vector2D.polar(radius, curveAngle, center).rotateAround(angle, start);
    }

    /**
     * Computes the angle of the output point when the tile is oriented to the right.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {number}
     */
    getOutputAngleRight(angle = 0) {
        return angle + 90;
    }

    /**
     * Computes the angle of the output point when the tile is oriented to the left.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {number}
     */
    getOutputAngleLeft(angle = 0) {
        return angle - 90;
    }
}

/**
 * The type of tile.
 * @constant {string} CurvedTileEnlargedModel.TYPE
 */
Object.defineProperty(CurvedTileEnlargedModel, 'TYPE', {
    value: 'curved-tile-enlarged',
    writable: false,
    enumerable: true,
    configurable: true
});
