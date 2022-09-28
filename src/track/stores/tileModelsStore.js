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
import { eventStore } from '../../core/stores';
import { TileModelCounter } from '../models';

/**
 * The default updater assigned to the EventStore.
 * @param {TileModelCounter} counter - The tiles counter bound with the store.
 * @returns {TileModel[]} - An array of TileModel.
 * @private
 */
const defaultUpdater = counter => counter.getTileModels();

/**
 * Creates a store bound to a tiles counter. The store will be updated each time a tile model is added or removed.
 * It will push the list of tile models on each update.
 * @param {TileList} [boundTo] - The tiles counter to bind with the store.
 * @param {eventStoreUpdater} update - A callback that will be called for setting the store each time a listened event is emitted.
 * If it is omitted, the bound tiles counter will be set on each update.
 * @return {EventStore}
 */
export default (boundTo = null, update = defaultUpdater) => {
    const store = eventStore(['addmodel', 'deletemodel', 'clear'], null, update);
    const bind = store.bind;

    assign(store, {
        /**
         * Binds a tiles counter with the store.
         * @param {TileList} list - The tiles counter to bind with the store.
         * @throws {TypeError} - If the given object is not a TileModelCounter.
         */
        bind(list) {
            TileModelCounter.validateInstance(list);
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
