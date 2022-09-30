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

import { quadrantRange, CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT } from '../helpers';
import { TileModel } from './TileModel.js';
import { Vector2D } from '../../core/models';

/**
 * Represents a track tile for an enlarged curve.
 */
export class CurvedTileEnlargedModel extends TileModel {
    /**
     * The minimum allowed size ratio for the tile.
     * @type {number}
     */
    get minRatio() {
        return 1;
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
     * Computes the coordinates of the edge points with respect to the tile direction.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {Vector2D[]} - Returns a list of edge points.
     */
    getEdgesCoord(x = 0, y = 0, angle = 0) {
        const start = new Vector2D(x, y);
        const width = this.specs.width;
        const side = this.getCurveSide();
        const innerRadius = this.getInnerRadius();
        const roundRadius = this.getOuterRadius();
        const outerRadius = innerRadius + width;
        const centerRadius = innerRadius + width / 2;

        let startAngle, center, curveCenter;
        if (this.direction === TILE_DIRECTION_LEFT) {
            center = start.addScalarX(centerRadius);
            curveCenter = center.addCoord(-side, side);
            startAngle = Vector2D.RIGHT_ANGLE;
        } else {
            center = start.subScalarX(centerRadius);
            curveCenter = center.addScalar(side);
            startAngle = 0;
        }
        const endAngle = startAngle + Vector2D.RIGHT_ANGLE;

        const p0 = Vector2D.polar(innerRadius, startAngle, center).rotateAround(angle, start);
        const p1 = Vector2D.polar(outerRadius, startAngle, center).rotateAround(angle, start);
        const p2 = Vector2D.polar(roundRadius, startAngle, curveCenter).rotateAround(angle, start);
        const p3 = Vector2D.polar(roundRadius, endAngle, curveCenter).rotateAround(angle, start);
        const p4 = Vector2D.polar(outerRadius, endAngle, center).rotateAround(angle, start);
        const p5 = Vector2D.polar(innerRadius, endAngle, center).rotateAround(angle, start);

        const edges = [p0, p1, p2];

        const rotatedCenter = curveCenter.rotateAround(angle, start);
        const rotatedStartAngle = Vector2D.degrees(p2.sub(rotatedCenter).angle());
        const rotatedEndAngle = rotatedStartAngle + Vector2D.RIGHT_ANGLE;

        const edgeAngle = quadrantRange(rotatedStartAngle, rotatedEndAngle);
        if (edgeAngle !== null) {
            edges.push(Vector2D.polar(roundRadius, edgeAngle, rotatedCenter));
        }

        edges.push(p3, p4, p5);

        return edges;
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
