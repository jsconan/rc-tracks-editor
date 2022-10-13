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

import { assign } from '../../core/helpers';
import { EventStore } from '../../core/stores';
import { TileList } from '../models';

/**
 * Creates a store bound to a list of tiles. The store will be updated each time the list is modified.
 * @param {TileList} [boundTo] - The list of tiles to bind with the store.
 * @param {eventStoreUpdater} update - A callback that will be called for setting the store each time a listened event is emitted.
 * If it is omitted, the bound list of tiles will be set on each update.
 * @return {EventStore}
 */
export default (boundTo = null, update = null) => {
    const store = new EventStore(
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
        null,
        update
    );
    const bind = store.bind;

    assign(store, {
        /**
         * Binds a list of tiles with the store.
         * @param {TileList} list - The list of tiles to bind with the store.
         * @throws {TypeError} - If the given object is not a TileList.
         */
        bind(list) {
            TileList.validateInstance(list);
            return bind.call(this, list);
        }
    });

    if (boundTo) {
        store.bind(boundTo);
    }

    return store;
};

/**
 * @typedef {import('../../core/stores').EventStore} EventStore
 */

/**
 * @typedef {import('../../core/stores').eventStoreUpdater} eventStoreUpdater
 */
