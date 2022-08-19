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

import { RIGHT_ANGLE } from './maths';

/**
 * Computes the overall width of a track section.
 * @param {number} laneWidth - The width of a track lane.
 * @param {number} barrierWidth - The width of the barriers.
 * @returns {number}
 */
export const getTrackSectionWidth = (laneWidth, barrierWidth) => laneWidth + barrierWidth * 2;

/**
 * Computes the overall length of a track section.
 * @param {number} laneWidth - The width of a track lane.
 * @param {number} barrierWidth - The width of the barriers.
 * @returns {number}
 */
export const getTrackSectionLength = (laneWidth, barrierWidth) =>
    getTrackSectionWidth(laneWidth, barrierWidth) + laneWidth / 4;

/**
 * Computes the width of the track lane from the given track section length and width.
 * @param {number} width - The width of a track section.
 * @param {number} barrierWidth - The width of the barriers.
 * @returns {number}
 */
export const getTrackLaneWidth = (width, barrierWidth) => width - barrierWidth * 2;

/**
 * Computes the angle of a curve with respect to the ratio.
 * @param {number} ratio - The ratio of the curve.
 * @returns {number}
 */
export const getCurveAngle = ratio => RIGHT_ANGLE / (ratio < 1 ? 1 / ratio : ratio);

/**
 * Computes the inner radius of a curve given the ratio.
 * @param {number} length - The length of a track section.
 * @param {number} width - The width of a track section.
 * @param {number} [ratio] - The size factor.
 * @returns {number}
 */
export const getCurveInnerRadius = (length, width, ratio = 1) => length * (ratio - 1) + (length - width) / 2;

/**
 * Computes the outer radius of a curve given the ratio.
 * @param {number} length - The length of a track section.
 * @param {number} width - The width of a track section.
 * @param {number} [ratio] - The size factor.
 * @returns {number}
 */
export const getCurveOuterRadius = (length, width, ratio = 1) => width + getCurveInnerRadius(length, width, ratio);

/**
 * Computes the length of the outer side of an enlarged curved track.
 * @param {number} length - The length of a track section.
 * @param {number} width - The width of a track section.
 * @param {number} [ratio] - The size factor.
 * @returns {number}
 */
export const getEnlargedCurveSide = (length, width, ratio = 1) => (length * ratio) / 2;

/**
 * Computes the inner radius of a curve given the ratio.
 * @param {number} length - The length of a track section.
 * @param {number} width - The width of a track section.
 * @param {number} [ratio] - The size factor.
 * @returns {number}
 */
export const getEnlargedCurveInnerRadius = (length, width, ratio = 1) => getCurveInnerRadius(length, width, ratio);

/**
 * Computes the outer radius of an enlarged curved track.
 * @param {number} length - The length of a track section.
 * @param {number} width - The width of a track section.
 * @param {number} [ratio] - The size factor.
 * @returns {number}
 */
export const getEnlargedCurveOuterRadius = (length, width, ratio = 1) =>
    getCurveOuterRadius(length, width, ratio) - getEnlargedCurveSide(length, width, ratio);

/**
 * Computes the number of barrier chunks for a straight section given the ratio.
 * @param {number} barrierChunks - The number of barrier chunks per section.
 * @param {number} [ratio] - The size factor.
 * @returns {number}
 */
export const getStraightBarrierChunks = (barrierChunks, ratio = 1) => barrierChunks * ratio;

/**
 * Computes the number of barrier chunks for an inner curved section given the ratio.
 * @param {number} barrierChunks - The number of barrier chunks per section.
 * @param {number} [ratio] - The size factor.
 * @returns {number}
 */
export const getCurveInnerBarrierChunks = (barrierChunks, ratio = 1) =>
    ratio < 1 ? 1 : barrierChunks / (ratio < 2 ? 2 : 1);

/**
 * Computes the number of barrier chunks for an outer curved section given the ratio.
 * @param {number} barrierChunks - The number of barrier chunks per section.
 * @param {number} [ratio] - The size factor.
 * @returns {number}
 */
export const getCurveOuterBarrierChunks = (barrierChunks, ratio = 1) => barrierChunks / (ratio < 1 ? 2 : 1);

/**
 * Computes the number of barrier chunks for the straight sides of large curve track.
 * @param {number} barrierChunks - The number of barrier chunks per section.
 * @param {number} [ratio] - The size factor.
 * @returns {number}
 */
export const getEnlargedCurveSideBarrierChunks = (barrierChunks, ratio = 1) =>
    getStraightBarrierChunks(barrierChunks, ratio) / 2;

/**
 * Computes the number of barrier chunks for the inner curve of large curve track.
 * @param {number} barrierChunks - The number of barrier chunks per section.
 * @param {number} [ratio] - The size factor.
 * @returns {number}
 */
export const getEnlargedCurveInnerBarrierChunks = (barrierChunks, ratio = 1) =>
    ratio === 1 ? barrierChunks / 2 : barrierChunks * ratio;

/**
 * Computes the number of barrier chunks for the outer curve of large curve track.
 * @param {number} barrierChunks - The number of barrier chunks per section.
 * @param {number} [ratio] - The size factor.
 * @returns {number}
 */
export const getEnlargedCurveOuterBarrierChunks = (barrierChunks, ratio = 1) => (barrierChunks / 2) * ratio;
