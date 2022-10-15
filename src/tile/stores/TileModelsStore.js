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

import { EventStore } from '../../core/stores';
import { TileCounter } from '../models';

/**
 * The default updater assigned to the EventStore.
 * @param {TileCounter} counter - The tiles counter bound with the store.
 * @returns {TileModel[]} - An array of TileModel.
 * @private
 */
const defaultUpdater = counter => counter.getModelList();

/**
 * Represents a store bound to a tiles counter. The store will be updated each time a tile model is added or removed.
 * It will push the list of tile models on each update.
 */
export class TileModelsStore extends EventStore {
    /**
     * Creates a store bound to a tiles counter. The store will be updated each time a tile model is added or removed.
     * It will push the list of tile models on each update.
     * @param {TileList} [boundTo] - The tiles counter to bind with the store.
     * @param {eventStoreUpdater} update - A callback that will be called for setting the store each time a listened event is emitted.
     * If it is omitted, the bound tiles counter will be set on each update.
     * @throws {TypeError} - If the given object is not a TileCounter.
     */
    constructor(boundTo = null, update = defaultUpdater) {
        super(['addmodel', 'removemodel', 'load', 'clear'], boundTo, update);
    }

    /**
     * Validates that the given object is a TileCounter and can be bound to store.
     * @param {TileCounter} counter - The tiles counter to bind with the store.
     * @returns {TileModelsStore} - Chains the instance.
     * @throws {TypeError} - If the given object is not a TileCounter.
     */
    validate(counter) {
        TileCounter.validateInstance(counter);
        return super.validate(counter);
    }
}

/**
 * @typedef {import('../../tiles/models').TileList} TileList
 */

/**
 * @typedef {import('../../tiles/models').TileModel} TileModel
 */

/**
 * @typedef {import('../../core/stores').eventStoreUpdater} eventStoreUpdater
 */
