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

import {
    flipTileDirection,
    isDirectionValid,
    DEFAULT_TILE_TYPE,
    TILE_DIRECTION_LEFT,
    TILE_DIRECTION_RIGHT
} from '../helpers';
import { TileSpecifications } from '../config';
import { Vector2D } from '../../core/models';

/**
 * Represents a track tile.
 */
export class TileModel {
    /**
     * Represents a tile with the given size constraints.
     * @param {TileSpecifications} specs - The specifications for the tiles.
     * @param {string} direction - The direction of the tile.
     * @param {number} ratio - The size factor relative to a track section. 1 means the tile fits 1 tile section in each direction.
     * @throws {TypeError} - If the given specifications object is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     */
    constructor(specs, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        this.setSpecs(specs);
        this.setDirection(direction);
        this.setRatio(ratio);
        this.id = this.modelId;
    }

    /**
     * The type of tile.
     * @type {string}
     */
    get type() {
        // @ts-expect-error
        return this.constructor.TYPE;
    }

    /**
     * The identifier for the model.
     * @type {string}
     */
    get modelId() {
        return `${this.type}-${this.ratio}`;
    }

    /**
     * The actual length of the tile with respect to the ratio.
     * @type {number}
     */
    get length() {
        return this.specs.length * this.ratio;
    }

    /**
     * The actual width of the tile with respect to the ratio.
     * @type {number}
     */
    get width() {
        return this.specs.width * this.ratio;
    }

    /**
     * The minimum allowed size ratio for the tile.
     * @type {number}
     */
    get minRatio() {
        return 1 / this.specs.barrierChunks;
    }

    /**
     * The maximum allowed size ratio for the tile.
     * @type {number}
     */
    get maxRatio() {
        return this.specs.maxRatio;
    }

    /**
     * Sets the specifications for the tiles.
     * @param {TileSpecifications} specs - The specifications for the tiles.
     * @returns {TileModel} - Chains the instance.
     * @throws {TypeError} - If the given specifications object is not valid.
     */
    setSpecs(specs) {
        if (!specs || !(specs instanceof TileSpecifications)) {
            throw new TypeError('A valid specifications object is needed!');
        }

        this.specs = specs;

        return this;
    }

    /**
     * Sets the direction of the tile.
     * It can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {string} direction - The direction of the tile.
     * @returns {TileModel} - Chains the instance.
     * @throws {TypeError} - If the given direction is not valid.
     */
    setDirection(direction) {
        if (!isDirectionValid(direction)) {
            throw new TypeError('A valid direction is needed!');
        }

        this.direction = direction;

        return this;
    }

    /**
     * Flips the the direction of the tile.
     * @returns {TileModel} - Chains the instance.
     */
    flipDirection() {
        this.direction = flipTileDirection(this.direction);
        return this;
    }

    /**
     * Sets the size ratio relative to a track section.
     * 1 means the tile fits 1 tile section in each direction.
     * @param {number} ratio - The size ratio relative to a track section.
     * @returns {TileModel} - Chains the instance.
     */
    setRatio(ratio) {
        let sizeRatio = Math.abs(ratio) || 1;

        if (sizeRatio < 1) {
            sizeRatio = Math.round(sizeRatio * this.specs.barrierChunks) / this.specs.barrierChunks;
        } else {
            sizeRatio = Math.round(sizeRatio);
        }

        this.ratio = Math.abs(Math.min(Math.max(this.minRatio, sizeRatio), this.maxRatio));

        return this;
    }

    /**
     * Computes the angle for rotating the tile to the expected direction.
     * @returns {number}
     */
    getDirectionAngle() {
        if (this.direction === TILE_DIRECTION_LEFT) {
            return Vector2D.STRAIGHT_ANGLE;
        }

        return 0;
    }

    /**
     * Computes the angle of the curve with respect to the ratio.
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
     * Computes the coordinates of the curve center with respect to the tile position.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @returns {Vector2D}
     */
    getCurveCenter(x = 0, y = 0) {
        const offset = this.specs.padding - this.getInnerRadius() - this.specs.length / 2;

        return new Vector2D(x + offset, y);
    }

    /**
     * Computes the inner radius of the curve with respect to the ratio.
     * @returns {number}
     */
    getInnerRadius() {
        const ratio = Math.max(1, this.ratio) - 1;
        return this.specs.length * ratio + this.specs.padding;
    }

    /**
     * Computes the outer radius of the curve with respect to the ratio.
     * @returns {number}
     */
    getOuterRadius() {
        return this.specs.width + this.getInnerRadius() - this.getCurveSide();
    }

    /**
     * Computes the number of barrier chunks on each side with respect to the ratio.
     * @returns {number}
     */
    getSideBarrierChunks() {
        return this.specs.barrierChunks * this.ratio;
    }

    /**
     * Computes the number of barrier chunks for the inner curve with respect to the ratio.
     * @returns {number}
     */
    getInnerBarrierChunks() {
        if (this.ratio < 1) {
            return 1;
        }

        if (this.ratio < 2) {
            return this.specs.barrierChunks / 2;
        }

        return this.specs.barrierChunks;
    }

    /**
     * Computes the number of barrier chunks for the outer curve with respect to the ratio.
     * @returns {number}
     */
    getOuterBarrierChunks() {
        if (this.ratio < 1) {
            return this.specs.barrierChunks / 2;
        }

        return this.specs.barrierChunks;
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

        return start.addScalarY(this.length / 2).rotateAround(angle, start);
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

        return start.addScalarY(this.length).rotateAround(angle, start);
    }

    /**
     * Computes the angle of the output point with respect to the tile direction.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {number}
     */
    getOutputAngle(angle = 0) {
        return Vector2D.degrees(angle);
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

        const length = this.length;
        const width = this.width / 2;

        return [
            start.subScalarX(width).rotateAround(angle, start),
            start.addScalarX(width).rotateAround(angle, start),
            start.addCoord(width, length).rotateAround(angle, start),
            start.addCoord(-width, length).rotateAround(angle, start)
        ];
    }

    /**
     * Computes the smallest rectangle which contains the entire tile.
     * The coordinates are computed with respect to the entry point of the tile.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {tileRect} - The smallest rectangle which contains the entire tile.
     */
    getBoundingRect(x = 0, y = 0, angle = 0) {
        const inputCoord = new Vector2D(x, y);
        const outputCoord = this.getOutputCoord(x, y, angle);
        const outputAngle = this.getOutputAngle(angle);

        const topLeft = new Vector2D(x, y);
        const bottomRight = new Vector2D(x, y);

        this.getEdgesCoord(x, y, angle).forEach(point => {
            topLeft.x = Math.min(topLeft.x, point.x);
            topLeft.y = Math.min(topLeft.y, point.y);

            bottomRight.x = Math.max(bottomRight.x, point.x);
            bottomRight.y = Math.max(bottomRight.y, point.y);
        });

        return {
            x: topLeft.x,
            y: topLeft.y,
            width: bottomRight.x - topLeft.x,
            height: bottomRight.y - topLeft.y,
            input: {
                x: inputCoord.x,
                y: inputCoord.y,
                angle: Vector2D.degrees(angle)
            },
            output: {
                x: outputCoord.x,
                y: outputCoord.y,
                angle: outputAngle
            }
        };
    }

    /**
     * Exports the model to an object.
     * @returns {tileExport} - An object representation of the model.
     */
    export() {
        const { type, direction, ratio } = this;
        return { type, direction, ratio };
    }
}

/**
 * The type of tile.
 * @constant {string} TileModel.TYPE
 */
Object.defineProperty(TileModel, 'TYPE', {
    value: DEFAULT_TILE_TYPE,
    writable: false,
    enumerable: true,
    configurable: true
});

/**
 * Tile oriented to the right.
 * @constant {string} TileModel.DIRECTION_RIGHT
 */
Object.defineProperty(TileModel, 'DIRECTION_RIGHT', {
    value: TILE_DIRECTION_RIGHT,
    writable: false,
    enumerable: true,
    configurable: true
});

/**
 * Tile oriented to the left.
 * @constant {string} TileModel.DIRECTION_LEFT
 */
Object.defineProperty(TileModel, 'DIRECTION_LEFT', {
    value: TILE_DIRECTION_LEFT,
    writable: false,
    enumerable: true,
    configurable: true
});

/**
 * @typedef {object} tileExport - Represents an exported tile.
 * @property {string} type - The type of tile.
 * @property {string} direction - The direction of the tile.
 * @property {number} ratio - The size ratio of the tile.
 */

/**
 * @typedef {object} coordAngle - Represents coordinates with rotation angle.
 * @property {number} x - The left coordinate.
 * @property {number} y - The top coordinate.
 * @property {number} angle - The rotation angle.
 */

/**
 * @typedef {object} tileRect - Represents the smallest rectangle which contains a tile.
 * @property {number} x - The left coordinate of the rectangle.
 * @property {number} y - The top coordinate of the rectangle.
 * @property {number} width - The width of the rectangle.
 * @property {number} height - The height of the rectangle.
 * @property {coordAngle} input - The input point of the tile.
 * @property {coordAngle} output - The output point of the tile.
 */
