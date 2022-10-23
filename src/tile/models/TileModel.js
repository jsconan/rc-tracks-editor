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
    validateDirection,
    DEFAULT_TILE_TYPE,
    TILE_DIRECTION_LEFT,
    TILE_DIRECTION_RIGHT,
    getTypeRank,
    getDirectionRank
} from '../helpers';
import { degrees, rotate, STRAIGHT_ANGLE } from '../../core/helpers';
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
     * Creates a copy of the instance.
     * @returns {TileModel} - Another instance of the same type with the same properties.
     */
    clone() {
        return this.constructor.clone(this);
    }

    /**
     * The type of tile.
     * @type {string}
     */
    get type() {
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
        TileSpecifications.validateInstance(specs);

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
        validateDirection(direction);

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
            return STRAIGHT_ANGLE;
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
        return degrees(angle);
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
                angle: degrees(angle)
            },
            output: {
                x: outputCoord.x,
                y: outputCoord.y,
                angle: outputAngle
            }
        };
    }

    /**
     * Builds the transform command for rotating the tile with respect to both its direction and its angle.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {string} - The transform command for rotating the tile.
     */
    getRotateTransform(x = 0, y = 0, angle = 0) {
        const center = this.getCenterCoord(x, y);
        const directionAngle = this.getDirectionAngle();
        const rotationAngle = degrees(angle);
        const orientation = directionAngle ? rotate(directionAngle, center.x, center.y) : '';
        const rotation = rotationAngle ? rotate(rotationAngle, x, y) : '';

        return rotation || orientation ? `${rotation}${orientation}` : '';
    }

    /**
     * Computes the parameters for rendering tile shapes at the expected position.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @returns {object} - Returns a set of parameters for rendering the tile shapes.
     */
    getShapeParameters(x = 0, y = 0) {
        const barrierLength = this.specs.barrierLength;
        const barrierWidth = this.specs.barrierWidth;

        const chunks = this.getSideBarrierChunks();
        const innerRadius = this.getInnerRadius();
        const outerRadius = this.getOuterRadius();
        const curveCenter = this.getCurveCenter(x, y);

        const leftX = curveCenter.x + innerRadius;
        const leftY = curveCenter.y;
        const rightX = curveCenter.x + outerRadius - barrierWidth;
        const rightY = curveCenter.y;
        const vertical = true;

        const ground = {
            x: leftX,
            y: leftY,
            width: this.width,
            height: this.length
        };
        const leftBarrier = {
            chunks,
            width: barrierWidth,
            length: barrierLength,
            left: leftX,
            top: leftY,
            shift: 0,
            vertical
        };
        const rightBarrier = {
            chunks,
            width: barrierWidth,
            length: barrierLength,
            left: rightX,
            top: rightY,
            shift: 1,
            vertical
        };

        return { ground, leftBarrier, rightBarrier };
    }

    /**
     * Exports the model to an object.
     * @returns {tileExport} - An object representation of the model.
     */
    export() {
        const { type, direction, ratio } = this;
        return { type, direction, ratio };
    }

    /**
     * Compares the model with another tile model and returns a number indicating whether the first
     * comes before, or after, or is the same as the second.
     * @param {TileModel} tile - The tile model to compare with.
     * @returns {number} - Returns -1 if the model comes before, or 1 if it comes after, or 0 if it is similar.
     */
    compare(tile) {
        if (!(tile instanceof TileModel)) {
            return 1;
        }

        let comparison = getTypeRank(this.type) - getTypeRank(tile.type);
        if (comparison) {
            return comparison;
        }

        comparison = this.ratio - tile.ratio;
        if (comparison) {
            return comparison;
        }

        return getDirectionRank(this.direction) - getDirectionRank(tile.direction);
    }

    /**
     * Creates a copy of the given instance.
     * @param {TileModel} tile - The instance to copy.
     * @returns {TileModel} - Another instance of the same type with the same properties.
     */
    static clone(tile) {
        return new this(tile.specs, tile.direction, tile.ratio);
    }

    /**
     * Validates that the given model is an instance of the class.
     * Otherwise, an error is thrown.
     * @param {object} model - The instance to validate.
     * @throws {TypeError} - If the given model is not a valid instance.
     */
    static validateInstance(model) {
        if (!(model instanceof this)) {
            throw new TypeError(`The object must be an instance of ${this.name}!`);
        }
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
