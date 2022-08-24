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

import { Vector2D } from './vector-2d';

/**
 * Represents a track tile.
 */
export class Tile {
    /**
     * Represents a tile with the given size.
     * @param {number} length - The length of a track section.
     * @param {number} width - The width of a track section.
     * @param {number} ratio - The size factor relative to a track section. 1 means the tile fit 1 tile section in each direction.
     * @param {string} type - The type of tile.
     * @param {number} direction - The tile direction.
     */
    constructor(length, width, ratio = 1, type = Tile.TYPE_STRAIGHT, direction = Tile.DIRECTION_RIGHT) {
        this.length = length;
        this.width = width;
        this.ratio = ratio;
        this.type = type;
        this.direction = direction;
    }

    /**
     * Computes the actual length of the tile with respect to the tile ratio.
     * @returns {number}
     */
    getLength() {
        if (this.type === Tile.TYPE_STRAIGHT) {
            return this.length * this.ratio;
        }
        if (this.type === Tile.TYPE_ENLARGED_CURVE) {
            return this.length * Math.max(1, this.ratio);
        }

        return this.length;
    }

    /**
     * Computes the actual width of the tile with respect to the tile ratio.
     * @returns {number}
     */
    getWidth() {
        if (this.type === Tile.TYPE_ENLARGED_CURVE) {
            return this.width * Math.max(1, this.ratio);
        }

        return this.width;
    }

    /**
     * Computes the padding on the width of the tile to fit its length  (tiles are fitting a square)
     * @returns {number}
     */
    getPadding() {
        return (this.length - this.width) / 2;
    }

    /**
     * Computes the rotation angle to give the expected direction to the tile.
     * @returns {number}
     */
    getDirectionAngle() {
        if (this.direction === Tile.DIRECTION_RIGHT || this.type === Tile.TYPE_STRAIGHT) {
            return 0;
        }

        if (this.type === Tile.TYPE_ENLARGED_CURVE) {
            return 90;
        }

        return 90 + (90 / this.ratio) * (Math.max(1, this.ratio) - 1);
    }

    /**
     * Computes the angle of the curve with respect to the tile ratio.
     * @returns {number}
     */
    getCurveAngle() {
        if (this.type === Tile.TYPE_STRAIGHT) {
            return 180;
        }

        if (this.type === Tile.TYPE_ENLARGED_CURVE) {
            return 90;
        }

        if (this.ratio < 1) {
            return 90 * this.ratio;
        }

        return 90 / this.ratio;
    }

    /**
     * Computes the length of the outer side if any.
     * @returns {number}
     */
    getCurveSide() {
        if (this.type === Tile.TYPE_ENLARGED_CURVE) {
            return (this.length * Math.max(1, this.ratio)) / 2;
        }

        return 0;
    }

    /**
     * Computes the inner radius of the curve with respect to the tile ratio.
     * @returns {number}
     */
    getInnerRadius() {
        const padding = (this.length - this.width) / 2;
        const ratio = Math.max(1, this.ratio) - 1;
        return this.length * ratio + padding;
    }

    /**
     * Computes the outer radius of the curve with respect to the tile ratio.
     * @returns {number}
     */
    getOuterRadius() {
        return this.width + this.getInnerRadius() - this.getCurveSide();
    }

    /**
     * Computes the number of barrier chunks on each side with respect to the tile ratio.
     * @param {number} barrierChunks - The number of barrier chunks per section.
     * @returns {number}
     */
    getSideBarrierChunks(barrierChunks) {
        if (this.type === Tile.TYPE_ENLARGED_CURVE) {
            return (barrierChunks * Math.max(1, this.ratio)) / 2;
        }

        return barrierChunks * this.ratio;
    }

    /**
     * Computes the number of barrier chunks for the inner curve with respect to the tile ratio.
     * @param {number} barrierChunks - The number of barrier chunks per section.
     * @returns {number}
     */
    getInnerBarrierChunks(barrierChunks) {
        if (this.type === Tile.TYPE_ENLARGED_CURVE) {
            if (this.ratio <= 1) {
                return barrierChunks / 2;
            }
            return barrierChunks * this.ratio;
        }

        if (this.ratio < 1) {
            return 1;
        }

        if (this.ratio < 2) {
            return barrierChunks / 2;
        }

        return barrierChunks;
    }

    /**
     * Computes the number of barrier chunks for an outer curve with respect to the tile ratio.
     * @param {number} barrierChunks - The number of barrier chunks per section.
     * @returns {number}
     */
    getOuterBarrierChunks(barrierChunks) {
        if (this.type === Tile.TYPE_ENLARGED_CURVE) {
            return (barrierChunks / 2) * Math.max(1, this.ratio);
        }

        if (this.ratio < 1) {
            return barrierChunks / 2;
        }

        return barrierChunks;
    }

    /**
     * Computes the coordinates of the input point to the tile.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @returns {Vector2D}
     */
    getInputCoord(x = 0, y = 0) {
        return new Vector2D(x, y);
    }

    /**
     * Computes the coordinates of the output point to the tile with respect to its direction.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle.
     * @returns {Vector2D}
     */
    getOutputCoord(x = 0, y = 0, angle = 0) {
        const start = new Vector2D(x, y);

        if (this.type === Tile.TYPE_STRAIGHT) {
            return start.addScalarY(this.length * this.ratio).rotateAround(angle, start);
        }

        const radius = this.getInnerRadius() + this.width / 2;
        let curveAngle = this.getCurveAngle();
        let center;

        if (this.direction === Tile.DIRECTION_LEFT) {
            center = new Vector2D(x + radius, y);

            if (this.type === Tile.TYPE_CURVED) {
                curveAngle = 180 - curveAngle;
            }
        } else {
            center = new Vector2D(x - radius, y);
        }

        return Vector2D.polar(radius, curveAngle, center).rotateAround(angle, start);
    }

    /**
     * Computes the coordinates of the tile center point.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle.
     * @returns {Vector2D}
     */
    getCenterCoord(x = 0, y = 0, angle = 0) {
        const start = new Vector2D(x, y);
        let center;

        if (this.type === Tile.TYPE_STRAIGHT) {
            const cx = x;
            const cy = y + this.getLength() / 2;

            center = new Vector2D(cx, cy);
        } else if (this.type === Tile.TYPE_ENLARGED_CURVE) {
            const cx = x;
            const cy = y + this.length * (Math.max(1, this.ratio) - 1) + this.length / 2;

            center = new Vector2D(cx, cy);
        } else {
            const curveAngle = this.getCurveAngle();
            const innerRadius = this.getInnerRadius();
            const curveCenter = new Vector2D(x - this.length / 2 + this.getPadding() - innerRadius, y);
            const middle = innerRadius + this.width / 2;

            const p1 = Vector2D.polar(middle, 0, curveCenter);
            const p2 = p1.addScalarY(10);
            const p3 = Vector2D.polar(middle, curveAngle, curveCenter);
            const p4 = p3.add(Vector2D.polar(10, curveAngle + 90));

            center = Vector2D.intersect(p1, p2, p3, p4);
        }

        return center.rotateAround(angle, start);
    }

    /**
     * Computes the overall width of a tile knowing the width of its lane and its barrier.
     * @param {number} laneWidth - The width of a track lane.
     * @param {number} barrierWidth - The width of the barriers.
     * @returns {number}
     */
    static getTileWidth(laneWidth, barrierWidth) {
        return laneWidth + barrierWidth * 2;
    }

    /**
     * Computes the overall length of a tile knowing the width of its lane and its barrier.
     * @param {number} laneWidth - The width of a track lane.
     * @param {number} barrierWidth - The width of the barriers.
     * @returns {number}
     */
    static getTileLength(laneWidth, barrierWidth) {
        return Tile.getTileWidth(laneWidth, barrierWidth) + laneWidth / 4;
    }

    /**
     * Computes the width of the lane knowing the width of a tile and its barrier.
     * @param {number} width - The width of a track section.
     * @param {number} barrierWidth - The width of the barriers.
     * @returns {number}
     */
    static getLaneWidth(width, barrierWidth) {
        return width - barrierWidth * 2;
    }
}

/**
 * Type for a straight tile.
 * @constant {string} Tile.TYPE_STRAIGHT
 */
Object.defineProperty(Tile, 'TYPE_STRAIGHT', {
    value: 'straight',
    writable: false,
    enumerable: true,
    configurable: true
});

/**
 * Type for a curved tile.
 * @constant {string} Tile.TYPE_CURVED
 */
Object.defineProperty(Tile, 'TYPE_CURVED', {
    value: 'curved',
    writable: false,
    enumerable: true,
    configurable: true
});

/**
 * Type for a curved tile enlarged.
 * @constant {string} Tile.TYPE_ENLARGED_CURVE
 */
Object.defineProperty(Tile, 'TYPE_ENLARGED_CURVE', {
    value: 'enlarged',
    writable: false,
    enumerable: true,
    configurable: true
});

/**
 * Direction to the right.
 * @constant {number} Tile.DIRECTION_RIGHT
 */
Object.defineProperty(Tile, 'DIRECTION_RIGHT', {
    value: 0,
    writable: false,
    enumerable: true,
    configurable: true
});

/**
 * Direction to the left.
 * @constant {number} Tile.DIRECTION_LEFT
 */
Object.defineProperty(Tile, 'DIRECTION_LEFT', {
    value: 1,
    writable: false,
    enumerable: true,
    configurable: true
});
