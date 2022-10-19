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

/**
 * Computes the parameters for rendering a tile at the expected position.
 * @type {object}
 */
export default {
    /**
     * Computes the parameters for rendering a curved tile at the expected position.
     * @param {CurvedTileModel} model - A reference to the tile model.
     * @param {number} tileX - The X-coordinate of the tile.
     * @param {number} tileY - The Y-coordinate of the tile.
     * @returns {object} - Returns a set parameters for rendering the tile at the expected position.
     */
    curve(model, tileX, tileY) {
        const specs = model.specs;
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

        return {
            innerRadius,
            outerRadius,
            curveAngle,
            curveCenter,
            innerChunks,
            outerChunks,
            innerX,
            innerY,
            outerX,
            outerY
        };
    },

    /**
     * Computes the parameters for rendering a curved tile enlarged at the expected position.
     * @param {CurvedTileEnlargedModel} model - A reference to the tile model.
     * @param {number} tileX - The X-coordinate of the tile.
     * @param {number} tileY - The Y-coordinate of the tile.
     * @returns {object} - Returns a set parameters for rendering the tile at the expected position.
     */
    enlargedCurve(model, tileX, tileY) {
        const specs = model.specs;
        const barrierWidth = specs.barrierWidth;
        const width = specs.width;
        const side = model.getCurveSide();
        const innerRadius = model.getInnerRadius();
        const outerRadius = model.getOuterRadius() - barrierWidth;
        const sideChunks = model.getSideBarrierChunks();
        const innerChunks = model.getInnerBarrierChunks();
        const outerChunks = model.getOuterBarrierChunks();
        const curveAngle = model.getCurveAngle();
        const curveCenter = model.getCurveCenter(tileX, tileY);
        const outerBarrier = width - barrierWidth;

        const { x: innerX, y: innerY } = curveCenter.addScalarX(innerRadius);
        const { x: outerX, y: outerY } = curveCenter.addCoord(
            side + outerRadius,
            innerRadius + outerBarrier - outerRadius
        );
        const { x: horizontalX, y: horizontalY } = curveCenter.addScalarY(innerRadius + outerBarrier);
        const { x: verticalX, y: verticalY } = curveCenter.addScalarX(innerRadius + outerBarrier);

        return {
            side,
            innerRadius,
            outerRadius,
            curveAngle,
            curveCenter,
            sideChunks,
            innerChunks,
            outerChunks,
            innerX,
            innerY,
            outerX,
            outerY,
            horizontalX,
            horizontalY,
            verticalX,
            verticalY
        };
    },

    /**
     * Computes the parameters for rendering a straight tile at the expected position.
     * @param {StraightTileModel} model - A reference to the tile model.
     * @param {number} tileX - The X-coordinate of the tile.
     * @param {number} tileY - The Y-coordinate of the tile.
     * @returns {object} - Returns a set parameters for rendering the tile at the expected position.
     */
    straight(model, tileX, tileY) {
        const specs = model.specs;
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

        return { width, height, chunks, leftX, leftY, rightX, rightY };
    }
};

/**
 * @typedef {import('../models').CurvedTileModel} CurvedTileModel
 */

/**
 * @typedef {import('../models').CurvedTileEnlargedModel} CurvedTileEnlargedModel
 */

/**
 * @typedef {import('../models').StraightTileModel} StraightTileModel
 */
