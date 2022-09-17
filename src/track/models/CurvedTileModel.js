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

import { quadrantRange, CURVED_TILE_TYPE, TILE_DIRECTION_LEFT } from '../helpers';
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
     * The minimum allowed size ratio for the tile.
     * @type {number}
     */
    get minRatio() {
        return 2 / this.specs.barrierChunks;
    }

    /**
     * Computes the angle for rotating the tile to the expected direction.
     * @returns {number}
     */
    getDirectionAngle() {
        if (this.direction === TILE_DIRECTION_LEFT) {
            return Vector2D.RIGHT_ANGLE + (Vector2D.RIGHT_ANGLE / this.ratio) * (Math.max(1, this.ratio) - 1);
        }

        return 0;
    }

    /**
     * Computes the angle of the curve with respect to the ratio.
     * @returns {number}
     */
    getCurveAngle() {
        if (this.ratio < 1) {
            return Vector2D.RIGHT_ANGLE * this.ratio;
        }

        return Vector2D.RIGHT_ANGLE / this.ratio;
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
        const p4 = p3.add(Vector2D.polar(10, curveAngle + Vector2D.RIGHT_ANGLE));

        const center = Vector2D.intersect(p1, p2, p3, p4);

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

        let curveAngle, center;
        if (this.direction === TILE_DIRECTION_LEFT) {
            curveAngle = Vector2D.STRAIGHT_ANGLE - this.getCurveAngle();
            center = start.addScalarX(radius);
        } else {
            curveAngle = this.getCurveAngle();
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
            return Vector2D.degrees(angle - this.getCurveAngle());
        }

        return Vector2D.degrees(angle + this.getCurveAngle());
    }

    /**
     * Computes the coordinates of the edge points with respect to the tile direction.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {Vector2D[]} - Returns a list of edge points.
     */
    getEdgesCoord(x = 0, y = 0, angle = 0) {
        const start = new Vector2D(x, y);
        const width = this.specs.width;
        const innerRadius = this.getInnerRadius();
        const outerRadius = innerRadius + width;
        const centerRadius = innerRadius + width / 2;

        let startAngle, center;
        if (this.direction === TILE_DIRECTION_LEFT) {
            center = start.addScalarX(centerRadius);
            startAngle = Vector2D.STRAIGHT_ANGLE - this.getCurveAngle();
        } else {
            center = start.subScalarX(centerRadius);
            startAngle = 0;
        }
        const endAngle = startAngle + this.getCurveAngle();

        const p0 = Vector2D.polar(innerRadius, startAngle, center).rotateAround(angle, start);
        const p1 = Vector2D.polar(outerRadius, startAngle, center).rotateAround(angle, start);
        const p2 = Vector2D.polar(outerRadius, endAngle, center).rotateAround(angle, start);
        const p3 = Vector2D.polar(innerRadius, endAngle, center).rotateAround(angle, start);

        const edges = [p0, p1];

        const rotatedCenter = center.rotateAround(angle, start);
        const rotatedStartAngle = Vector2D.degrees(p1.sub(rotatedCenter).angle());
        const rotatedEndAngle = rotatedStartAngle + this.getCurveAngle();

        const edgeAngle = quadrantRange(rotatedStartAngle, rotatedEndAngle);
        if (edgeAngle !== null) {
            edges.push(Vector2D.polar(outerRadius, edgeAngle, rotatedCenter));
        }

        edges.push(p2, p3);

        return edges;
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
