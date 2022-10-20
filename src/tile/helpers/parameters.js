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

import { CURVED_TILE_ENLARGED_TYPE, CURVED_TILE_TYPE, STRAIGHT_TILE_TYPE, validateType } from './tiles';

/**
 * Computes the parameters for rendering a tile at the expected position.
 * @type {object}
 * @private
 */
const tileParameters = {
    /**
     * Computes the parameters for rendering a curved tile at the expected position.
     * @param {CurvedTileModel} model - A reference to the tile model.
     * @param {number} tileX - The X-coordinate of the tile.
     * @param {number} tileY - The Y-coordinate of the tile.
     * @returns {object} - Returns a set parameters for rendering the tile at the expected position.
     */
    [CURVED_TILE_TYPE](model, tileX, tileY) {
        const specs = model.specs;
        const width = specs.width;
        const barrierWidth = specs.barrierWidth;
        const innerRadius = model.getInnerRadius();
        const outerRadius = model.getOuterRadius() - barrierWidth;
        const innerChunks = model.getInnerBarrierChunks();
        const outerChunks = model.getOuterBarrierChunks();
        const curveAngle = model.getCurveAngle();
        const curveCenter = model.getCurveCenter(tileX, tileY);

        const innerX = curveCenter.x + innerRadius;
        const innerY = curveCenter.y;
        const outerX = curveCenter.x + outerRadius;
        const outerY = curveCenter.y;

        const ground = {
            cx: curveCenter.x,
            cy: curveCenter.y,
            width,
            radius: innerRadius,
            angle: curveAngle,
            start: 0
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

        return {
            ground,
            innerBarrier,
            outerBarrier
        };
    },

    /**
     * Computes the parameters for rendering a curved tile enlarged at the expected position.
     * @param {CurvedTileEnlargedModel} model - A reference to the tile model.
     * @param {number} tileX - The X-coordinate of the tile.
     * @param {number} tileY - The Y-coordinate of the tile.
     * @returns {object} - Returns a set parameters for rendering the tile at the expected position.
     */
    [CURVED_TILE_ENLARGED_TYPE](model, tileX, tileY) {
        const specs = model.specs;
        const width = specs.width;
        const barrierLength = specs.barrierLength;
        const barrierWidth = specs.barrierWidth;
        const side = model.getCurveSide();
        const innerRadius = model.getInnerRadius();
        const outerRadius = model.getOuterRadius() - barrierWidth;
        const sideChunks = model.getSideBarrierChunks();
        const innerChunks = model.getInnerBarrierChunks();
        const outerChunks = model.getOuterBarrierChunks();
        const curveAngle = model.getCurveAngle();
        const curveCenter = model.getCurveCenter(tileX, tileY);
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
            length: barrierLength,
            left: horizontalX,
            top: horizontalY,
            shift: 0,
            vertical: false
        };
        const verticalBarrier = {
            chunks: sideChunks,
            width: barrierWidth,
            length: barrierLength,
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
    },

    /**
     * Computes the parameters for rendering a straight tile at the expected position.
     * @param {StraightTileModel} model - A reference to the tile model.
     * @param {number} tileX - The X-coordinate of the tile.
     * @param {number} tileY - The Y-coordinate of the tile.
     * @returns {object} - Returns a set parameters for rendering the tile at the expected position.
     */
    [STRAIGHT_TILE_TYPE](model, tileX, tileY) {
        const specs = model.specs;
        const barrierLength = specs.barrierLength;
        const barrierWidth = specs.barrierWidth;
        const width = model.width;
        const height = model.length;
        const chunks = model.getSideBarrierChunks();
        const innerRadius = model.getInnerRadius();
        const outerRadius = model.getOuterRadius();
        const curveCenter = model.getCurveCenter(tileX, tileY);

        const leftX = curveCenter.x + innerRadius;
        const leftY = curveCenter.y;
        const rightX = curveCenter.x + outerRadius - barrierWidth;
        const rightY = curveCenter.y;
        const vertical = true;

        const ground = {
            x: leftX,
            y: leftY,
            width,
            height
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
};

/**
 * Computes the parameters for rendering a tile at the expected position.
 * @param {TileModel} model - A reference to the tile model.
 * @param {number} tileX - The X-coordinate of the tile.
 * @param {number} tileY - The Y-coordinate of the tile.
 * @returns {object} - Returns a set parameters for rendering the tile at the expected position.
 * @throws {TypeError} - If the given type is not valid.
 */

export function getTileParameters(model, tileX, tileY) {
    const { type } = model;
    validateType(type);
    return tileParameters[type](model, tileX, tileY);
}

/**
 * @typedef {import('../models').TileModel} TileModel
 */

/**
 * @typedef {import('../models').CurvedTileModel} CurvedTileModel
 */

/**
 * @typedef {import('../models').CurvedTileEnlargedModel} CurvedTileEnlargedModel
 */

/**
 * @typedef {import('../models').StraightTileModel} StraightTileModel
 */
