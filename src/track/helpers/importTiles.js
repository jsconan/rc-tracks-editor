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

import { TileList } from '../../tile/models';
import createTile from './createTile.js';

/**
 * Imports a list of tiles from exported data.
 * @param {TileList} list - The list in which import the tiles.
 * @param {tileExport[]} data - An iterable object containing exported tiles.
 * @returns {TileList} - Returns the list.
 */
export default (list, data) => {
    TileList.validateInstance(list);

    if (!data || !data[Symbol.iterator]) {
        return list;
    }

    const dataIterator = data[Symbol.iterator]();
    const loadIterator = {
        next() {
            const next = dataIterator.next();

            if (next.done) {
                return next;
            }

            const { type, direction, ratio } = next.value || {};
            const tile = createTile(list.specs, type, direction, ratio);

            return { done: false, value: tile };
        },

        [Symbol.iterator]() {
            return this;
        }
    };

    list.load(loadIterator);

    return list;
};

/**
 * @typedef {import('../../tile/models/TileModel.js').tileExport} tileExport
 */
