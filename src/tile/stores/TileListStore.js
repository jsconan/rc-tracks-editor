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
import { TileList } from '../models';

/**
  Implements a store bound to a list of tiles.
  The store will be updated each time the list is modified.
 */
export class TileListStore extends EventStore {
    /**
     * Creates a store bound to a list of tiles. The store will be updated each time the list is modified.
     * @param {TileList} [boundTo] - The list of tiles to bind with the store.
     * @param {eventStoreUpdater} update - A callback that will be called for setting the store each time a listened event is emitted.
     * If it is omitted, the bound list of tiles will be set on each update.
     * @throws {TypeError} - If the given object is not a TileList.
     */
    constructor(boundTo = null, update = null) {
        super(
            [
                // List events
                'set',
                'add',
                'delete',
                'clear',
                'load',
                // TileList events
                'specs',
                'update'
            ],
            boundTo,
            update
        );
    }

    /**
     * Validates that the given object is a TileList and can be bound to store.
     * @param {TileList} list - The list of tiles to bind with the store.
     * @returns {TileListStore} - Chains the instance.
     * @throws {TypeError} - If the given object is not a TileList.
     */
    validate(list) {
        TileList.validateInstance(list);
        return super.validate(list);
    }
}

/**
 * @typedef {import('../../core/stores').eventStoreUpdater} eventStoreUpdater
 */
