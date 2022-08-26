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

import { Vector2D } from './vector-2d.js';

/**
 * Represents a track tile.
 */
export class TileModel {
    /**
     * Represents a tile with the given size.
     * @param {number} laneWidth - The width of the track lane (the distance between the barriers).
     * @param {number} barrierWidth - The width of the barriers.
     * @param {number} barrierChunks - The number of barrier chunks per section.
     * @param {number} ratio - The size factor relative to a track section. 1 means the tile fit 1 tile section in each direction.
     */
    constructor(laneWidth, barrierWidth, barrierChunks, ratio = 1) {
        this.laneWidth = laneWidth;
        this.barrierWidth = barrierWidth;
        this.barrierChunks = barrierChunks;
        this.ratio = Math.abs(ratio || 1);

        this.length = TileModel.getTileLength(laneWidth, barrierWidth);
        this.width = TileModel.getTileWidth(laneWidth, barrierWidth);
        this.padding = (this.length - this.width) / 2;
    }

    /**
     * Gets the type of tile.
     * @returns {string}
     */
    getType() {
        return TileModel.TYPE;
    }

    /**
     * Computes the actual length of the tile with respect to the tile ratio.
     * @returns {number}
     */
    getLength() {
        return this.length * this.ratio;
    }

    /**
     * Computes the actual width of the tile with respect to the tile ratio.
     * @returns {number}
     */
    getWidth() {
        return this.width * this.ratio;
    }

    /**
     * Computes the rotation angle to give the expected direction to the tile.
     * @param {number} direction - The tile direction.
     * @returns {number}
     * @throws {TypeError} - If the given direction is not valid.
     */
    getDirectionAngle(direction) {
        switch (direction) {
            case TileModel.DIRECTION_RIGHT:
                return this.getDirectionAngleRight();

            case TileModel.DIRECTION_LEFT:
                return this.getDirectionAngleLeft();
        }

        throw new TypeError('A valid direction is needed!');
    }

    /**
     * Computes the rotation angle to orient the tile to the right.
     * @returns {number}
     */
    getDirectionAngleRight() {
        return 0;
    }

    /**
     * Computes the rotation angle to orient the tile to the left.
     * @returns {number}
     */
    getDirectionAngleLeft() {
        return 0;
    }

    /**
     * Computes the angle of the curve with respect to the tile ratio.
     * @returns {number}
     */
    getCurveAngle() {
        return 0;
    }

    /**
     * Computes the length of the curve side if any.
     * @returns {number}
     */
    getCurveSide() {
        return 0;
    }

    /**
     * Computes the position of the curve center with respect to the tile position.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @returns {Vector2D}
     */
    getCurveCenter(x = 0, y = 0) {
        const offset = this.padding - this.getInnerRadius() - this.length / 2;

        return new Vector2D(x + offset, y);
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
     * @returns {number}
     */
    getSideBarrierChunks() {
        return this.barrierChunks * this.ratio;
    }

    /**
     * Computes the number of barrier chunks for the inner curve with respect to the tile ratio.
     * @returns {number}
     */
    getInnerBarrierChunks() {
        if (this.ratio < 1) {
            return 1;
        }

        if (this.ratio < 2) {
            return this.barrierChunks / 2;
        }

        return this.barrierChunks;
    }

    /**
     * Computes the number of barrier chunks for an outer curve with respect to the tile ratio.
     * @returns {number}
     */
    getOuterBarrierChunks() {
        if (this.ratio < 1) {
            return this.barrierChunks / 2;
        }

        return this.barrierChunks;
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
     * @param {number} direction - The tile direction.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle.
     * @returns {Vector2D}
     * @throws {TypeError} - If the given direction is not valid.
     */
    getOutputCoord(direction, x = 0, y = 0, angle = 0) {
        switch (direction) {
            case TileModel.DIRECTION_RIGHT:
                return this.getOutputCoordRight(x, y, angle);

            case TileModel.DIRECTION_LEFT:
                return this.getOutputCoordLeft(x, y, angle);
        }

        throw new TypeError('A valid direction is needed!');
    }

    /**
     * Computes the coordinates of the output point when the tile is oriented to the right.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle.
     * @returns {Vector2D}
     */
    getOutputCoordRight(x = 0, y = 0, angle = 0) {
        const start = new Vector2D(x, y);

        return start.addScalarY(this.getLength()).rotateAround(angle, start);
    }

    /**
     * Computes the coordinates of the output point when the tile is oriented to the left.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle.
     * @returns {Vector2D}
     */
    getOutputCoordLeft(x = 0, y = 0, angle = 0) {
        const start = new Vector2D(x, y);

        return start.addScalarY(this.getLength()).rotateAround(angle, start);
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

        return start.addScalarY(this.getLength() / 2).rotateAround(angle, start);
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
        return TileModel.getTileWidth(laneWidth, barrierWidth) + laneWidth / 4;
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

    /**
     * Computes the angle of the curve with respect to the tile ratio.
     * @param {number} ratio - The size factor relative to a track section. 1 means the tile fit 1 tile section in each direction.
     * @returns {number}
     */
    static getCurveAngle(ratio = 1) {
        if (ratio < 1) {
            return 90 * ratio;
        }

        return 90 / ratio;
    }
}

/**
 * The type of tile.
 * @constant {string} TileModel.TYPE
 */
Object.defineProperty(TileModel, 'TYPE', {
    value: 'tile',
    writable: false,
    enumerable: true,
    configurable: true
});

/**
 * Direction to the right.
 * @constant {number} TileModel.DIRECTION_RIGHT
 */
Object.defineProperty(TileModel, 'DIRECTION_RIGHT', {
    value: 0,
    writable: false,
    enumerable: true,
    configurable: true
});

/**
 * Direction to the left.
 * @constant {number} TileModel.DIRECTION_LEFT
 */
Object.defineProperty(TileModel, 'DIRECTION_LEFT', {
    value: 1,
    writable: false,
    enumerable: true,
    configurable: true
});
