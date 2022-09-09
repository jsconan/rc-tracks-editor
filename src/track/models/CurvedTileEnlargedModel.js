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

import { CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT } from '../helpers';
import { TileModel } from './TileModel.js';
import { Vector2D } from '../../core/models';

/**
 * Represents a track tile for an enlarged curve.
 */
export class CurvedTileEnlargedModel extends TileModel {
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
     * Computes the angle for rotating the tile to the expected direction.
     * @returns {number}
     */
    getDirectionAngle() {
        if (this.direction === TILE_DIRECTION_LEFT) {
            return Vector2D.RIGHT_ANGLE;
        }

        return 0;
    }

    /**
     * Computes the angle of the curve with respect to the ratio.
     * @returns {number}
     */
    getCurveAngle() {
        return Vector2D.RIGHT_ANGLE;
    }

    /**
     * Computes the length of the curve side if any.
     * @returns {number}
     */
    getCurveSide() {
        return this.length / 2;
    }

    /**
     * Computes the number of barrier chunks on each side with respect to the ratio.
     * @returns {number}
     */
    getSideBarrierChunks() {
        return (this.specs.barrierChunks * this.ratio) / 2;
    }

    /**
     * Computes the number of barrier chunks for the inner curve with respect to the ratio.
     * @returns {number}
     */
    getInnerBarrierChunks() {
        if (this.ratio <= 1) {
            return this.specs.barrierChunks / 2;
        }
        return this.specs.barrierChunks * this.ratio;
    }

    /**
     * Computes the number of barrier chunks for an outer curve with respect to the ratio.
     * @returns {number}
     */
    getOuterBarrierChunks() {
        return (this.specs.barrierChunks / 2) * this.ratio;
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
        const center = start.addScalarY(this.specs.length * (this.ratio - 0.5));

        return center.rotateAround(angle, start);
    }

    /**
     * Computes the coordinates of the output point with respect to the tile direction.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {Vector2D}
     */
    getOutputCoord(x = 0, y = 0, angle = 0) {
        const start = new Vector2D(x, y);

        const radius = this.getInnerRadius() + this.specs.width / 2;
        const curveAngle = this.getCurveAngle();

        let center;
        if (this.direction === TILE_DIRECTION_LEFT) {
            center = start.addScalarX(radius);
        } else {
            center = start.subScalarX(radius);
        }

        return Vector2D.polar(radius, curveAngle, center).rotateAround(angle, start);
    }

    /**
     * Computes the angle of the output point with respect to the tile direction.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {number}
     */
    getOutputAngle(angle = 0) {
        if (this.direction === TILE_DIRECTION_LEFT) {
            return Vector2D.degrees(angle - Vector2D.RIGHT_ANGLE);
        }

        return Vector2D.degrees(angle + Vector2D.RIGHT_ANGLE);
    }

    /**
     * Computes the coordinates of the edge point with respect to the tile direction.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {Vector2D}
     */
    getEdgeCoord(x = 0, y = 0, angle = 0) {
        const start = new Vector2D(x, y);

        const center = start.addScalarY(this.specs.length * (this.ratio - 0.5));
        const radius = this.getOuterRadius();
        let curveAngle;

        if (this.direction === TILE_DIRECTION_LEFT) {
            curveAngle = Vector2D.RIGHT_ANGLE + this.getCurveAngle() / 2;
        } else {
            curveAngle = Vector2D.RIGHT_ANGLE - this.getCurveAngle() / 2;
        }

        return Vector2D.polar(radius, curveAngle, center).rotateAround(angle, start);
    }
}

/**
 * The type of tile.
 * @constant {string} CurvedTileEnlargedModel.TYPE
 */
Object.defineProperty(CurvedTileEnlargedModel, 'TYPE', {
    value: CURVED_TILE_ENLARGED_TYPE,
    writable: false,
    enumerable: true,
    configurable: true
});
