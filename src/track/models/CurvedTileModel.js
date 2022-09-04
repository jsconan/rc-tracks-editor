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

import { CURVED_TILE_TYPE } from '../helpers';
import { TileModel } from './TileModel.js';
import { Vector2D } from '../../core/models';

/**
 * Represents a track tile for a curve.
 */
export class CurvedTileModel extends TileModel {
    /**
     * The actual length of the tile with respect to the ratio.
     * @type {number}
     */
    get length() {
        return this.specs.length;
    }

    /**
     * The actual width of the tile with respect to the ratio.
     * @type {number}
     */
    get width() {
        return this.specs.width;
    }

    /**
     * Computes the angle for rotating the tile to the left.
     * @returns {number}
     */
    getDirectionAngleLeft() {
        return 90 + (90 / this.ratio) * (Math.max(1, this.ratio) - 1);
    }

    /**
     * Computes the angle of the curve with respect to the ratio.
     * @returns {number}
     */
    getCurveAngle() {
        if (this.ratio < 1) {
            return 90 * this.ratio;
        }

        return 90 / this.ratio;
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

        const curveAngle = this.getCurveAngle();
        const curveCenter = this.getCurveCenter().add(start);
        const radius = this.getInnerRadius() + this.specs.width / 2;

        const p1 = Vector2D.polar(radius, 0, curveCenter);
        const p2 = p1.addScalarY(10);
        const p3 = Vector2D.polar(radius, curveAngle, curveCenter);
        const p4 = p3.add(Vector2D.polar(10, curveAngle + 90));

        const center = Vector2D.intersect(p1, p2, p3, p4);

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

        const radius = this.getInnerRadius() + this.specs.width / 2;
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

        const radius = this.getInnerRadius() + this.specs.width / 2;
        const curveAngle = 180 - this.getCurveAngle();
        const center = start.addScalarX(radius);

        return Vector2D.polar(radius, curveAngle, center).rotateAround(angle, start);
    }

    /**
     * Computes the angle of the output point when the tile is oriented to the right.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {number}
     */
    getOutputAngleRight(angle = 0) {
        return angle + this.getCurveAngle();
    }

    /**
     * Computes the angle of the output point when the tile is oriented to the left.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {number}
     */
    getOutputAngleLeft(angle = 0) {
        return angle - this.getCurveAngle();
    }
}

/**
 * The type of tile.
 * @constant {string} CurvedTileModel.TYPE
 */
Object.defineProperty(CurvedTileModel, 'TYPE', {
    value: CURVED_TILE_TYPE,
    writable: false,
    enumerable: true,
    configurable: true
});
