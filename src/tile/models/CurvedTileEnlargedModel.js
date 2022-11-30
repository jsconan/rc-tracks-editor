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
import { absDegrees, quadrantRange, RIGHT_ANGLE } from '../../core/helpers';
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
     * The maximum allowed size ratio for the tile.
     * @type {number}
     */
    get maxRatio() {
        if (this.specs.unlockRatio) {
            return this.specs.maxRatio;
        }
        return 1;
    }

    /**
     * Computes the angle for rotating the tile to the expected direction.
     * @returns {number}
     */
    getDirectionAngle() {
        if (this.direction === TILE_DIRECTION_LEFT) {
            return RIGHT_ANGLE;
        }

        return 0;
    }

    /**
     * Computes the angle of the curve with respect to the ratio.
     * @returns {number}
     */
    getCurveAngle() {
        return RIGHT_ANGLE;
    }

    /**
     * Computes the length of the curve side if any.
     * @returns {number}
     */
    getCurveSide() {
        return this.height / 2;
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
        const center = start.addScalarY(this.specs.height * (this.ratio - 0.5));

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
            return absDegrees(angle - RIGHT_ANGLE);
        }

        return absDegrees(angle + RIGHT_ANGLE);
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
            startAngle = RIGHT_ANGLE;
        } else {
            center = start.subScalarX(centerRadius);
            curveCenter = center.addScalar(side);
            startAngle = 0;
        }
        const endAngle = startAngle + RIGHT_ANGLE;

        const p0 = Vector2D.polar(innerRadius, startAngle, center).rotateAround(angle, start);
        const p1 = Vector2D.polar(outerRadius, startAngle, center).rotateAround(angle, start);
        const p2 = Vector2D.polar(roundRadius, startAngle, curveCenter).rotateAround(angle, start);
        const p3 = Vector2D.polar(roundRadius, endAngle, curveCenter).rotateAround(angle, start);
        const p4 = Vector2D.polar(outerRadius, endAngle, center).rotateAround(angle, start);
        const p5 = Vector2D.polar(innerRadius, endAngle, center).rotateAround(angle, start);

        const edges = [p0, p1, p2];

        const rotatedCenter = curveCenter.rotateAround(angle, start);
        const rotatedStartAngle = absDegrees(p2.sub(rotatedCenter).angle());
        const rotatedEndAngle = rotatedStartAngle + RIGHT_ANGLE;

        const edgeAngle = quadrantRange(rotatedStartAngle, rotatedEndAngle);
        if (edgeAngle !== null) {
            edges.push(Vector2D.polar(roundRadius, edgeAngle, rotatedCenter));
        }

        edges.push(p3, p4, p5);

        return edges;
    }

    /**
     * Computes the parameters for rendering tile shapes at the expected position.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @returns {object} - Returns a set of parameters for rendering the tile shapes.
     */
    getShapeParameters(x = 0, y = 0) {
        const width = this.specs.width;
        const barrierHeight = this.specs.barrierHeight;
        const barrierWidth = this.specs.barrierWidth;

        const side = this.getCurveSide();
        const innerRadius = this.getInnerRadius();
        const outerRadius = this.getOuterRadius() - barrierWidth;
        const sideChunks = this.getSideBarrierChunks();
        const innerChunks = this.getInnerBarrierChunks();
        const outerChunks = this.getOuterBarrierChunks();
        const curveAngle = this.getCurveAngle();
        const curveCenter = this.getCurveCenter(x, y);
        const outerBarrierPosition = width - barrierWidth;

        const { x: innerX, y: innerY } = curveCenter.addScalarX(innerRadius);
        const { x: outerX, y: outerY } = curveCenter.addCoord(
            side + outerRadius,
            innerRadius + outerBarrierPosition - outerRadius
        );
        const { x: horizontalX, y: horizontalY } = curveCenter.addScalarY(innerRadius + outerBarrierPosition);
        const { x: verticalX, y: verticalY } = curveCenter.addScalarX(innerRadius + outerBarrierPosition);

        const ground = {
            cx: curveCenter.x,
            cy: curveCenter.y,
            width,
            side,
            radius: innerRadius
        };
        const innerBarrier = {
            chunks: innerChunks,
            width: barrierWidth,
            radius: innerRadius,
            angle: curveAngle,
            left: innerX,
            top: innerY,
            shift: 0
        };
        const outerBarrier = {
            chunks: outerChunks,
            width: barrierWidth,
            radius: outerRadius,
            angle: curveAngle,
            left: outerX,
            top: outerY,
            shift: 1
        };
        const horizontalBarrier = {
            chunks: sideChunks,
            width: barrierWidth,
            height: barrierHeight,
            left: horizontalX,
            top: horizontalY,
            shift: 0,
            vertical: false
        };
        const verticalBarrier = {
            chunks: sideChunks,
            width: barrierWidth,
            height: barrierHeight,
            left: verticalX,
            top: verticalY,
            shift: 1,
            vertical: true
        };

        return {
            ground,
            innerBarrier,
            outerBarrier,
            horizontalBarrier,
            verticalBarrier
        };
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
