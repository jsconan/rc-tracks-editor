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

import { eventEmitterMixin } from '../../core/mixins';
import { buildTrack } from '../../tile/builders';
import { STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT } from '../../tile/helpers';
import { TileList, TileListBuilder, TileModelCounter } from '../../tile/models';
import { TileSpecifications } from '../../tile/config';
import { tileCounterStore, tileListStore } from '../../tile/stores';
import { createTile, importTiles } from '../helpers';

/**
 * Represents a race track.
 */
export class TrackModel {
    /**
     * Represents a race track with the given size constraints.
     * @param {TileSpecifications} specs - The specifications for the track tiles.
     * @param {TileModel[]} source - A list of tiles to initialize the track.
     * @throws {TypeError} - If the given specifications object is not valid.
     * @throws {TypeError} - If one of the tiles in the source is not a TileModel.
     */
    constructor(specs, source = null) {
        this.specs = specs;
        this.tiles = new TileList(specs);
        this.counter = new TileModelCounter();
        this.builder = new TileListBuilder(buildTrack);

        this.tilesStore = tileListStore(this.tiles, list => this.builder.build(list));
        this.modelsStore = tileCounterStore(this.counter);

        eventEmitterMixin(this);

        // Monitor the list of tiles
        this.tiles.on('add', (index, ...tiles) => this.emit('add', ...tiles));
        this.tiles.on('delete', (index, ...tiles) => this.emit('remove', ...tiles));
        this.tiles.on('set', (index, tile, previous) => {
            this.emit('remove', previous);
            this.emit('add', tile);
        });
        this.tiles.delegate('update', this);
        this.tiles.delegate('clear', this);
        this.tiles.delegate('load', this);
        this.tiles.delegate('specs', this);

        // Monitor the builder
        this.builder.on('builder option options', () => this.tilesStore.notify());

        // Pipe to the counters
        this.on('add', (...tiles) => tiles.forEach(tile => this.counter.add(tile)));
        this.on('remove', (...tiles) => tiles.forEach(tile => this.counter.remove(tile)));
        this.on('clear load', () => {
            this.modelsStore.unbind();
            this.counter.clear();
            this.tiles.forEach(tile => this.counter.add(tile));
            this.modelsStore.bind(this.counter);
        });

        if (source) {
            this.tiles.load(source);
            source = void 0;
        }
    }

    /**
     * The number of tiles in the track.
     * @type {number}
     */
    get length() {
        return this.tiles.length;
    }

    /**
     * Iterates over the tiles from the track.
     * @yields {TileModel} - The next tile in the track.
     * @generator
     */
    *[Symbol.iterator]() {
        yield* this.tiles.values();
    }

    /**
     * Returns an iterator for the tiles from the track.
     * @yields {TileModel} - The next tile in the track.
     * @generator
     */
    *values() {
        yield* this.tiles.values();
    }

    /**
     * Sets the specifications for the track tiles.
     * @param {TileSpecifications} specs - The specifications for the track tiles.
     * @returns {TrackModel} - Chains the instance.
     * @throws {TypeError} - If the given specifications object is not valid.
     * @fires specs
     */
    setSpecs(specs) {
        TileSpecifications.validateInstance(specs);

        this.specs = specs;
        this.tiles.setSpecs(specs);

        return this;
    }

    /**
     * Notifies an update of the tiles.
     * This is useful when one or several tiles have been modified internally without calling the exposed API.
     * @returns {TrackModel} - Chains the instance.
     * @fires update
     */
    update() {
        this.tiles.update();

        return this;
    }

    /**
     * Gets the position of a tile inside the track.
     * @param {string} id - The unique identifier of the tile.
     * @returns {number} - The position of the tile, or `-1` if it does not exist.
     */
    getIndex(id) {
        return this.tiles.getIndex(id);
    }

    /**
     * Retrieves a tile by its identifier.
     * @param {string} id - The unique identifier of the tile.
     * @returns {TileModel} - The referenced tile, or `null` if it does not exist.
     */
    getById(id) {
        return this.tiles.getById(id);
    }

    /**
     * Gets a tile from a particular position.
     * @param {number} index - The position of the tile.
     * @returns {TileModel} - The referenced tile, or `null` if it does not exist.
     */
    get(index) {
        return this.tiles.get(index);
    }

    /**
     * Gets the first tile of the track.
     * @returns {TileModel} - The tile at the first index. It may be null.
     */
    first() {
        return this.tiles.first();
    }

    /**
     * Gets the last tile of the track.
     * @returns {*} - The tile at the last index. It may be null.
     */
    last() {
        return this.tiles.last();
    }

    /**
     * Removes a tile from the track.
     * @param {string} id - The unique identifier of the tile to remove.
     * @returns {boolean} - Returns `true` if the deletion succeeds. Otherwise, returns `false`.
     * @fires remove
     */
    remove(id) {
        return this.tiles.remove(id);
    }

    /**
     * Add a tile to the track, at the last position.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {TileModel} - Returns the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires add
     */
    append(type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const tile = createTile(this.specs, type, direction, ratio);

        this.tiles.add(tile);

        return tile;
    }

    /**
     * Add a tile to the track, at the first position.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {TileModel} - Returns the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires add
     */
    prepend(type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const tile = createTile(this.specs, type, direction, ratio);

        this.tiles.insert(0, tile);

        return tile;
    }

    /**
     * Replace a tile in the track.
     * If the tile does not exist, it does nothing.
     * @param {string} id - The unique identifier of the tile to replace.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {TileModel} - Returns the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires remove
     * @fires add
     */
    replace(id, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const index = this.tiles.getIndex(id);

        if (index >= 0) {
            const tile = createTile(this.specs, type, direction, ratio);

            this.tiles.set(index, tile);

            return tile;
        }

        return null;
    }

    /**
     * Insert a tile in the track before a particular position.
     * If the position does not exist, it does nothing.
     * @param {string} id - The unique identifier of the tile before which add another tile.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {TileModel} - Returns the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires add
     */
    insertBefore(id, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const index = this.tiles.getIndex(id);

        if (index >= 0) {
            const tile = createTile(this.specs, type, direction, ratio);

            this.tiles.insert(index, tile);

            return tile;
        }

        return null;
    }

    /**
     * Insert a tile in the track after a particular position.
     * If the position does not exist, it does nothing.
     * @param {string} id - The unique identifier of the tile after which add another tile.
     * @param {string} type - The type of tile to add.
     * @param {string} direction - The direction of the tile, can be either TILE_DIRECTION_RIGHT or TILE_DIRECTION_LEFT.
     * @param {number} ratio - The size ratio. Usually, it is included in the range [1-4].
     * @returns {TileModel} - Returns the added tile.
     * @throws {TypeError} - If the given type is not valid.
     * @throws {TypeError} - If the given direction is not valid.
     * @fires add
     */
    insertAfter(id, type = STRAIGHT_TILE_TYPE, direction = TILE_DIRECTION_RIGHT, ratio = 1) {
        const index = this.tiles.getIndex(id);

        if (index >= 0) {
            const tile = createTile(this.specs, type, direction, ratio);

            this.tiles.insert(index + 1, tile);

            return tile;
        }

        return null;
    }

    /**
     * Exports the track to an object.
     * @returns {tileExport[]} - An object representation of the track.
     */
    export() {
        return this.tiles.map(tile => tile.export());
    }

    /**
     * Imports the track from a source.
     * The track is emptied before importing, any existing tile will be deleted.
     * @param {tileExport[]} data - An iterable object containing a representation of the track.
     * @returns {TrackModel} - Chains the instance.
     * @fires load
     */
    import(data) {
        importTiles(this.tiles, data);

        return this;
    }

    /**
     * Removes all tiles from the track.
     * @returns {TrackModel} - Chains the instance.
     * @fires clear
     */
    clear() {
        this.tiles.clear();

        return this;
    }

    /**
     * Loads tiles from another source. The track is cleared before.
     * @param {*} iterator - An iterable object that can be used to fill the track.
     * @returns {TrackModel} - Chains the instance.
     * @fires load
     * @throws {TypeError} - If one of the given tiles is not a TileModel.
     */
    load(iterator) {
        this.tiles.load(iterator);

        return this;
    }

    /**
     * Changes the builder.
     * @param {listCoordBuilder} builder - The reference to the builder.
     * @returns {TrackModel} - Chains the instance.
     * @throws {TypeError} - If the given builder is not a function.
     */
    setBuilder(builder) {
        this.builder.setBuilder(builder);

        return this;
    }

    /**
     * Sets the options that will be given to the builder on the next call.
     * @param {object} options - Some options for the builder.
     * @returns {TrackModel} - Chains the instance.
     */
    setBuilderOptions(options) {
        this.builder.setOptions(options);

        return this;
    }

    /**
     * Sets an option that will be given to the builder on the next call.
     * @param {string} name - The name of the option to set.
     * @param {*} value - The value for the option.
     * @returns {TrackModel} - Chains the instance.
     */
    setBuilderOption(name, value) {
        this.builder.setOption(name, value);

        return this;
    }

    /**
     * Gets the value of a particular option for the builder.
     * @param {string} name - The name of the option to read.
     * @returns {*} - The value of the option.
     */
    getBuilderOption(name) {
        return this.builder.getOption(name);
    }

    /**
     * Tells if an option for the builder has a value assigned.
     * @param {string} name - The name of the option to test.
     * @returns {boolean} - Returns `true` if the option has a value.
     */
    hasBuilderOption(name) {
        return this.builder.hasOption(name);
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
 * @typedef {import('../../tile/models/TileModel.js').tileExport} tileExport
 */

/**
 * @typedef {import('../../tile/models').TileModel} TileModel
 */

/**
 * @typedef {import('../../tile/model/TileListBuilder.js').listCoordBuilder} listCoordBuilder
 */

/**
 * Notifies the tile specification have changed.
 * @event specs
 * @param {TileSpecifications} specs - The specifications for the tiles.
 */

/**
 * Notifies a change applied the to track.
 * @event update
 */

/**
 * Notifies tiles have been added to the track.
 * @event add
 * @param {...TileModel} tiles - The added tiles.
 */

/**
 * Notifies tiles have been removed from the track.
 * @event remove
 * @param {...TileModel} tiles - The removed tiles.
 */

/**
 * Notifies the track has been cleared.
 * @event clear
 */

/**
 * Notifies the track has been loaded.
 * @event load
 */
