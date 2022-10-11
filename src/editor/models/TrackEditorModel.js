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

import eventEmitterMixin from '../../core/mixins/eventEmitter.js';
import { TileSet } from './TileSet.js';
import { TileSpecifications } from '../../tile/config';
import { TrackModel } from '../../track/models';

/**
 * Represent a track editor
 */
export class TrackEditorModel {
    /**
     * Creates a track editor model.
     * @param {TileSpecifications} specs - The specifications for the track tiles.
     * @param {number} angle - A rotation angle for the track.
     */
    constructor(specs, angle = 0) {
        eventEmitterMixin(this);

        this.tiles = new TileSet(specs);
        this.track = new TrackModel(specs);
        this.specs = specs;

        this.track.setBuilderOptions({
            startAngle: angle,
            hPadding: specs.padding,
            vPadding: specs.padding
        });

        this.track.on('add', (...tiles) => tiles.forEach(tile => this.tiles.remove(tile)));
        this.track.on('remove', (...tiles) => tiles.forEach(tile => this.tiles.add(tile)));
        this.track.on('clear', () => this.tiles.reset());
        this.track.on('load', () => {
            this.tiles.reset();
            this.tiles.consume(this.track);
        });
    }

    /**
     * Sets the specifications for the track tiles.
     * @param {TileSpecifications} specs - The specifications for the track tiles.
     * @returns {TrackEditorModel} - Chains the instance.
     * @throws {TypeError} - If the given specifications object is not valid.
     * @fires specs
     */
    setSpecs(specs) {
        TileSpecifications.validateInstance(specs);

        this.specs = specs;
        this.tiles.setSpecs(specs);
        this.track.setSpecs(specs);

        this.emit('specs', specs);

        return this;
    }

    /**
     * Sets the rotation angle for the track.
     * @param {number} angle - A rotation angle for the track.
     * @returns {TrackEditorModel} - Chains the instance.
     */
    setAngle(angle) {
        this.track.setBuilderOption('startAngle', angle);
        return this;
    }

    /**
     * Limits the set of available tiles for building a track.
     * @param {*} tiles - An iterable object that can be used to set the tiles.
     * @returns {TrackEditorModel} - Chains the instance.
     * @fires limit
     */
    limit(tiles = null) {
        if (tiles) {
            this.tiles.load(tiles);
        } else {
            this.tiles.loadAllModels();
        }

        if (this.track.length) {
            this.tiles.consume(this.track);
        }

        this.emit('limit');

        return this;
    }

    /**
     * Loads a track.
     * @param {tileExport[]} data - An iterable object containing a representation of the track.
     * @returns {TrackEditorModel} - Chains the instance.
     * @fires load
     */
    load(track) {
        this.track.import(track);

        this.emit('load');

        return this;
    }

    /**
     * Saves the track.
     * @returns {tileExport[]} - An object representation of the track.
     * @fires save
     */
    save() {
        const track = this.track.export();

        this.emit('save', track);

        return track;
    }

    /**
     * Removes all tiles from the track, and reset the set of tiles.
     * @returns {TrackEditorModel} - Chains the instance.
     * @fires clear
     */
    clear() {
        this.track.clear();

        this.emit('clear');

        return this;
    }
}

/**
 * @typedef {import('../../tile/models/TileModel.js').tileExport} tileExport
 */

/**
 * Notifies the tile specification have changed.
 * @event specs
 * @param {TileSpecifications} specs - The specifications for the tiles.
 */

/**
 * Notifies the set of available tiles has been limited
 * @event limit
 */

/**
 * Notifies a track has been loaded.
 * @event load
 */

/**
 * Notifies the track has been saved.
 * @event save
 * @param {tileExport[]} track - An iterable object containing a representation of the track.
 */

/**
 * Notifies the editor has been cleared.
 * @event clear
 */
