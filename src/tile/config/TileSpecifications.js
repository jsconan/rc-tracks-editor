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
 * Gives the specifications for the track tiles with respect to the initial constraints.
 */
export class TileSpecifications {
    /**
     * Defines the specifications for the track tiles from the given constraints.
     * @param {object} config - A set of config options.
     * @param {number} laneWidth - The width of the track lane (the distance between the barriers).
     * @param {number} barrierWidth - The width of the barriers.
     * @param {number} barrierChunks - The number of barrier chunks per tile.
     * @param {number} maxRatio - The maximum value for size ratios.
     * @param {boolean} unlockRatio - Unlock the maximum size ratio some tiles are applying.
     */

    constructor({ laneWidth = 20, barrierWidth = 1, barrierChunks = 4, maxRatio = 4, unlockRatio = false } = {}) {
        this.setLaneWidth(laneWidth);
        this.setBarrierWidth(barrierWidth);
        this.setBarrierChunks(barrierChunks);
        this.setMaxRatio(maxRatio);
        this.setUnlockRatio(unlockRatio);
    }

    /**
     * The context identifier to retrieve the config from the context.
     * @type {string}
     */
    get contextId() {
        return this.constructor.CONTEXT_ID;
    }

    /**
     * The length of a tile with respect to the initial constraints.
     * @type {number}
     */
    get length() {
        return this.laneWidth * 1.25 + this.barrierWidth * 2;
    }

    /**
     * The width of a tile with respect to the initial constraints.
     * @type {number}
     */
    get width() {
        return this.laneWidth + this.barrierWidth * 2;
    }

    /**
     * The length of a barrier chunk with respect to the initial constraints.
     * @type {number}
     */
    get barrierLength() {
        return this.length / this.barrierChunks;
    }

    /**
     * The padding around the width of the tile to align with its length.
     * Note: tiles must fit in a square so that they can be flipped and rotated indifferently.
     * @type {number}
     */
    get padding() {
        return this.laneWidth / 8;
    }

    /**
     * Sets the width of the track lane (the distance between the barriers).
     * @param {number} laneWidth - The width of the track lane.
     * @returns {TileSpecifications} - Chains the instance.
     */
    setLaneWidth(laneWidth) {
        this.laneWidth = Math.abs(laneWidth);

        return this;
    }

    /**
     * Sets the width of the barriers.
     * @param {number} barrierWidth - The width of the barriers.
     * @returns {TileSpecifications} - Chains the instance.
     */
    setBarrierWidth(barrierWidth) {
        this.barrierWidth = Math.abs(barrierWidth);

        return this;
    }

    /**
     * Sets the number of barrier chunks per tile.
     * @param {number} barrierChunks - The number of barrier chunks per tile.
     * @returns {TileSpecifications} - Chains the instance.
     */
    setBarrierChunks(barrierChunks) {
        this.barrierChunks = Math.abs(Math.round(barrierChunks) || 1);

        return this;
    }

    /**
     * Sets the maximum value for size ratios.
     * @param {number} maxRatio - The maximum value for size ratios.
     * @returns {TileSpecifications} - Chains the instance.
     */
    setMaxRatio(maxRatio) {
        this.maxRatio = Math.abs(Math.round(maxRatio) || 1);

        return this;
    }

    /**
     * Locks or unlocks the maximum size ratio some tiles are applying.
     * @param {boolean} unlockRatio - Whether or not unlock the size ratio.
     * @returns {TileSpecifications} - Chains the instance.
     */
    setUnlockRatio(unlockRatio) {
        this.unlockRatio = !!unlockRatio;

        return this;
    }

    /**
     * Validates that the given object is an instance of the class.
     * Otherwise, an error is thrown.
     * @param {object} object - The instance to validate.
     * @throws {TypeError} - If the given object is not a valid instance.
     */
    static validateInstance(object) {
        if (!(object instanceof this)) {
            throw new TypeError(`The specifications object must be an instance of ${this.name}!`);
        }
    }
}

/**
 * The context identifier to retrieve the config from the context.
 * @constant {string} TileSpecifications.CONTEXT_ID
 */
Object.defineProperty(TileSpecifications, 'CONTEXT_ID', {
    value: 'tileSpecifications',
    writable: false,
    enumerable: true,
    configurable: true
});
