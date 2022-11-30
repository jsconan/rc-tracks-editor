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
     * The width of a tile.
     * @type {number}
     * @private
     */
    #width;

    /**
     * The height of a tile.
     * @type {number}
     * @private
     */
    #height;

    /**
     * The width of a barrier.
     * @type {number}
     * @private
     */
    #barrierWidth;

    /**
     * The height of a barrier.
     * @type {number}
     * @private
     */
    #barrierHeight;

    /**
     * The number of barrier chunks per tile's side.
     * @type {number}
     * @private
     */
    #barrierChunks;

    /**
     * The padding around the width of the tile to align with its height.
     * @type {number}
     * @private
     */
    #padding;

    /**
     * The width of the track lane (the distance between the barriers).
     * @type {number}
     * @private
     */
    #laneWidth;

    /**
     * The maximum value for size ratios.
     * @type {number}
     * @private
     */
    #maxRatio;

    /**
     * Whether or not unlock the size ratio.
     * @type {number}
     * @private
     */
    #unlockRatio;

    /**
     * Defines the specifications for the track tiles from the given constraints.
     * @param {tileSpecificationsConfig} config - The set of constraints defining the specifications.
     */
    constructor(config) {
        this.import(config);
    }

    /**
     * The context identifier to retrieve the config from the context.
     * @type {string}
     */
    get contextId() {
        return this.constructor.CONTEXT_ID;
    }

    /**
     * The width of the track lane (the distance between the barriers).
     * @type {number}
     */
    get laneWidth() {
        return this.#laneWidth;
    }

    /**
     * The width of the barriers.
     * @type {number}
     */
    get barrierWidth() {
        return this.#barrierWidth;
    }

    /**
     * The height of a barrier chunk.
     * @type {number}
     */
    get barrierHeight() {
        return this.#barrierHeight;
    }

    /**
     * The number of barrier chunks per tile's side.
     * @type {number}
     */
    get barrierChunks() {
        return this.#barrierChunks;
    }

    /**
     * The width of a tile with respect to the initial constraints.
     * @type {number}
     */
    get width() {
        return this.#width;
    }

    /**
     * The height of a tile with respect to the initial constraints.
     * @type {number}
     */
    get height() {
        return this.#height;
    }

    /**
     * The padding around the width of the tile to align with its height.
     * Note: tiles must fit in a square so that they can be flipped and rotated indifferently.
     * @type {number}
     */
    get padding() {
        return this.#padding;
    }

    /**
     * The maximum value for size ratios.
     * @type {number}
     */
    get maxRatio() {
        return this.#maxRatio;
    }

    /**
     * Whether or not unlock the size ratio.
     * @type {boolean}
     */
    get unlockRatio() {
        return this.#unlockRatio;
    }

    /**
     * Imports the specifications for the track tiles from the given constraints.
     * @param {tileSpecificationsConfig} config - The set of constraints defining the specifications.
     * @returns {TileSpecifications} - Chains the instance.
     */
    import({ laneWidth = 20, barrierWidth = 1, barrierChunks = 4, maxRatio = 4, unlockRatio = false } = {}) {
        // capture the constraints
        this.#laneWidth = Math.abs(laneWidth);
        this.#barrierWidth = Math.abs(barrierWidth);
        this.#barrierChunks = Math.abs(Math.round(barrierChunks) || 1);
        this.#maxRatio = Math.abs(Math.round(maxRatio) || 1);
        this.#unlockRatio = !!unlockRatio;

        // compute the specs
        this.#height = this.#laneWidth * 1.25 + this.#barrierWidth * 2;
        this.#width = this.#laneWidth + this.#barrierWidth * 2;
        this.#barrierHeight = this.#height / this.#barrierChunks;
        this.#padding = this.#laneWidth / 8;

        return this;
    }

    /**
     * Exports the specifications constraints.
     * @returns {tileSpecificationsConfig}
     */
    export() {
        return {
            barrierChunks: this.#barrierChunks,
            barrierWidth: this.#barrierWidth,
            laneWidth: this.#laneWidth,
            maxRatio: this.#maxRatio,
            unlockRatio: this.#unlockRatio
        };
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

/**
 * Defines the constraints properties used to define the specifications for the track tiles.
 * @typedef {object} tileSpecificationsConfig
 * @property {number} laneWidth - The width of the track lane (the distance between the barriers).
 * @property {number} barrierWidth - The width of the barriers.
 * @property {number} barrierChunks - The number of barrier chunks per tile's side.
 * @property {number} maxRatio - The maximum value for size ratios.
 * @property {boolean} unlockRatio - Unlock the maximum size ratio some tiles are applying.
 */
