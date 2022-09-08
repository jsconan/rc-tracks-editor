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

import { isDirectionValid, DEFAULT_TILE_TYPE, TILE_DIRECTION_LEFT, TILE_DIRECTION_RIGHT } from '../helpers';
import { TileSpecifications } from './TileSpecifications.js';
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
     * Sets the size factor relative to a track section.
     * 1 means the tile fits 1 tile section in each direction.
     * @param {number} ratio - The size factor relative to a track section.
     * @returns {TileModel} - Chains the instance.
     */
    setRatio(ratio) {
        this.ratio = Math.abs(ratio || 1);

        return this;
    }

    /**
     * Computes the angle for rotating the tile to the expected direction.
     * @returns {number}
     */
    getDirectionAngle() {
        switch (this.direction) {
            case TILE_DIRECTION_RIGHT:
                return this.getDirectionAngleRight();

            case TILE_DIRECTION_LEFT:
                return this.getDirectionAngleLeft();
        }
    }

    /**
     * Computes the angle for rotating the tile to the right.
     * @returns {number}
     */
    getDirectionAngleRight() {
        return 0;
    }

    /**
     * Computes the angle for rotating the tile to the left.
     * @returns {number}
     */
    getDirectionAngleLeft() {
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
        switch (this.direction) {
            case TILE_DIRECTION_RIGHT:
                return this.getOutputCoordRight(x, y, angle);

            case TILE_DIRECTION_LEFT:
                return this.getOutputCoordLeft(x, y, angle);
        }
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

        return start.addScalarY(this.length).rotateAround(angle, start);
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

        return start.addScalarY(this.length).rotateAround(angle, start);
    }

    /**
     * Computes the angle of the output point with respect to the tile direction.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {number}
     */
    getOutputAngle(angle = 0) {
        switch (this.direction) {
            case TILE_DIRECTION_RIGHT:
                return this.getOutputAngleRight(angle);

            case TILE_DIRECTION_LEFT:
                return this.getOutputAngleLeft(angle);
        }
    }

    /**
     * Computes the angle of the output point when the tile is oriented to the right.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {number}
     */
    getOutputAngleRight(angle = 0) {
        return Vector2D.degrees(angle);
    }

    /**
     * Computes the angle of the output point when the tile is oriented to the left.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {number}
     */
    getOutputAngleLeft(angle = 0) {
        return Vector2D.degrees(angle);
    }

    /**
     * Computes the coordinates of the edge point with respect to the tile direction.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {Vector2D}
     */
    getEdgeCoord(x = 0, y = 0, angle = 0) {
        switch (this.direction) {
            case TILE_DIRECTION_RIGHT:
                return this.getEdgeCoordRight(x, y, angle);

            case TILE_DIRECTION_LEFT:
                return this.getEdgeCoordLeft(x, y, angle);
        }
    }

    /**
     * Computes the coordinates of the edge point when the tile is oriented to the right.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {Vector2D}
     */
    getEdgeCoordRight(x = 0, y = 0, angle = 0) {
        const start = new Vector2D(x, y);
        const edge = new Vector2D(this.width / 2, this.width / 2);
        return start.add(edge).rotateAround(angle, start);
    }

    /**
     * Computes the coordinates of the edge point when the tile is oriented to the left.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {Vector2D}
     */
    getEdgeCoordLeft(x = 0, y = 0, angle = 0) {
        const start = new Vector2D(x, y);
        const edge = new Vector2D(-this.width / 2, this.width / 2);
        return start.add(edge).rotateAround(angle, start);
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
        const radius = this.specs.width / 2;
        const inputCoord = new Vector2D(x, y);
        const outputCoord = this.getOutputCoord(x, y, angle);
        const outputAngle = this.getOutputAngle(angle);

        const topLeft = new Vector2D(x, y);
        const bottomRight = new Vector2D(x, y);
        const coords = [
            Vector2D.polar(radius, angle, inputCoord),
            Vector2D.polar(radius, angle + Vector2D.STRAIGHT_ANGLE, inputCoord),
            Vector2D.polar(radius, outputAngle, outputCoord),
            Vector2D.polar(radius, outputAngle + Vector2D.STRAIGHT_ANGLE, outputCoord),
            this.getEdgeCoord(x, y, angle)
        ];

        coords.forEach(point => {
            topLeft.x = Math.min(topLeft.x, point.x);
            topLeft.y = Math.min(topLeft.y, point.y);

            bottomRight.x = Math.max(bottomRight.x, point.x);
            bottomRight.y = Math.max(bottomRight.y, point.y);
        });

        return {
            x: topLeft.x,
            y: topLeft.y,
            width: bottomRight.x - topLeft.x,
            height: bottomRight.y - topLeft.y
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

    /**
     * Computes the coordinates of the tile.
     * @param {number} x - The X-coordinate of the tile.
     * @param {number} y - The Y-coordinate of the tile.
     * @param {number} angle - The rotation angle of the tile.
     * @returns {tileCoord} - The computed coordinates for rendering the tile.
     * @throws {TypeError} - If the given specifications object is not valid.
     */
    build(x = 0, y = 0, angle = 0) {
        angle = Vector2D.degrees(angle);
        const id = this.id;
        const outputAngle = this.getOutputAngle(angle);
        const outputCoord = this.getOutputCoord(x, y, angle);
        const centerCoord = this.getCenterCoord(x, y, angle);

        return { id, x, y, angle, outputAngle, outputCoord, centerCoord, model: this };
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
 * @typedef {object} tileRect - Represents the smallest rectangle which contains a tile.
 * @property {number} x - The left coordinate of the rectangle.
 * @property {number} y - The top coordinate of the rectangle.
 * @property {number} width - The width of the rectangle.
 * @property {number} height - The height of the rectangle.
 */

/**
 * @typedef {object} tileCoord - Represents a positioned tile.
 * @property {string} id - The unique identifier of the tile.
 * @property {number} x - The left coordinate of the tile.
 * @property {number} y - The top coordinate of the tile.
 * @property {number} angle - The rotation angle of the tile.
 * @property {number} outputAngle - The rotation angle at the output of the tile.
 * @property {Vector2D} outputCoord - The coordinates of the output of the tile.
 * @property {Vector2D} centerCoord - The coordinates of the center of the tile.
 * @property {TileModel} model - A reference to the tile model.
 */
