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

import buildTrack from '../buildTrack.js';

import { CURVED_TILE_TYPE, STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT } from '../../helpers';
import { TileSpecifications } from '../../config';
import { TileList } from '../../models';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);
const list = new TileList(specs);
list.import([
    { type: STRAIGHT_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: STRAIGHT_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: STRAIGHT_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: STRAIGHT_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 }
]);

describe('buildTrack', () => {
    it('is a function', () => {
        expect(buildTrack).toEqual(expect.any(Function));
    });

    it('throws error when trying to use a wrong list of tiles', () => {
        expect(() => buildTrack([])).toThrow('The object must be an instance of TileList!');
    });

    describe('process a list of tiles for rendering a track', () => {
        it('using default position', () => {
            expect(buildTrack(list)).toMatchSnapshot();
        });

        it.each([
            {},
            { startX: 100, startY: 100 },
            { startAngle: 45 },
            { startX: 100, startY: 100, startAngle: 45 },
            { hPadding: 10, vPadding: 20 },
            { startX: 100, startY: 100, startAngle: 45, hPadding: 10, vPadding: 20 }
        ])('using config options %s', config => {
            expect(buildTrack(list, config)).toMatchSnapshot();
        });
    });
});
