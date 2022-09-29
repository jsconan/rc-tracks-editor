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

import buildList from '../buildList.js';
import {
    CURVED_TILE_ENLARGED_TYPE,
    CURVED_TILE_TYPE,
    STRAIGHT_TILE_TYPE,
    TILE_DIRECTION_LEFT,
    TILE_DIRECTION_RIGHT
} from '../../helpers';
import { TileSpecifications } from '../../config';
import { TileList } from '../../models';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);
const list = new TileList(specs);
list.import([
    { type: STRAIGHT_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_ENLARGED_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 2 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 3 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 4 },
    { type: STRAIGHT_TILE_TYPE, direction: TILE_DIRECTION_LEFT, ratio: 1 },
    { type: CURVED_TILE_ENLARGED_TYPE, direction: TILE_DIRECTION_LEFT, ratio: 1 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_LEFT, ratio: 1 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_LEFT, ratio: 2 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_LEFT, ratio: 3 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_LEFT, ratio: 4 }
]);

describe('buildList', () => {
    it('is a function', () => {
        expect(buildList).toEqual(expect.any(Function));
    });

    it('throws error when trying to use a wrong list of tiles', () => {
        expect(() => buildList([])).toThrow('The object must be an instance of TileList!');
    });

    describe('process a list of tiles for rendering', () => {
        it('using default position', () => {
            expect(buildList(list)).toMatchSnapshot();
        });

        it.each([
            {},
            { startX: 100, startY: 100 },
            { tileAngle: 45 },
            { tileWidth: 200, tileHeight: 200, centered: false },
            { tileWidth: 200, tileHeight: 200, centered: true },
            { hPadding: 20, vPadding: 10, vertical: false },
            { hPadding: 20, vPadding: 10, vertical: true },
            { centered: false },
            { centered: true },
            { aligned: false },
            { aligned: true },
            { vertical: false },
            { vertical: true },
            { centered: true, vertical: true },
            { startX: 100, startY: 100, tileAngle: 45, vertical: false },
            { startX: 100, startY: 100, tileAngle: 45, vertical: true }
        ])('using config options %s', config => {
            expect(buildList(list, config)).toMatchSnapshot();
        });
    });
});
