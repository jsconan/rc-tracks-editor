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

import { CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, TILE_DIRECTION_RIGHT } from '../../../tile/helpers';
import { TileSpecifications } from '../../../tile/config';
import { TileList } from '../../../tile/models';
import importTiles from '../importTiles.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

describe('importTiles', () => {
    it('is a function', () => {
        expect(importTiles).toEqual(expect.any(Function));
    });

    describe('throws error', () => {
        it('if the given list is not a TileList', () => {
            expect(() => importTiles({})).toThrow('The object must be an instance of TileList!');
        });

        it('when trying to import a tile with an invalid type', () => {
            const list = new TileList(specs);
            expect(() => importTiles(list, [{ type: '' }])).toThrow('A valid type of tile is needed!');
        });

        it('when trying to import a tile with an invalid direction', () => {
            const list = new TileList(specs);
            expect(() => importTiles(list, [{ type: CURVED_TILE_TYPE, direction: '' }])).toThrow(
                'A valid direction is needed!'
            );
        });
    });

    it('imports tiles from an object', () => {
        const list = new TileList(specs);
        const data = [
            {
                type: CURVED_TILE_TYPE,
                direction: TILE_DIRECTION_LEFT,
                ratio: 1
            },
            null,
            {
                type: CURVED_TILE_TYPE,
                direction: TILE_DIRECTION_RIGHT,
                ratio: 1
            }
        ];

        const callback = jest.fn();
        list.on('load', callback);

        expect(importTiles(list, {})).toBe(list);
        expect(list).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(0);

        expect(importTiles(list, data)).toBe(list);
        expect(list).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(1);
    });
});
