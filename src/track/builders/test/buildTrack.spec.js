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

import { CURVED_TILE_TYPE } from '../../helpers';
import { TileSpecifications, TilesList } from '../../models';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

describe('buildTrack', () => {
    it('is a function', () => {
        expect(buildTrack).toEqual(expect.any(Function));
    });

    it('throws error when trying to use a wrong list of tiles', () => {
        // @ts-expect-error
        expect(() => buildTrack([])).toThrow('A valid list of tiles is needed!');
    });

    describe('builds a list of tiles for rendering a track', () => {
        it('using default position', () => {
            const list = new TilesList(specs);

            list.appendTile();
            list.appendTile(CURVED_TILE_TYPE);
            list.appendTile();
            list.appendTile(CURVED_TILE_TYPE);
            list.appendTile();
            list.appendTile(CURVED_TILE_TYPE);
            list.appendTile();
            list.appendTile(CURVED_TILE_TYPE);

            expect(buildTrack(list)).toMatchSnapshot();
        });

        it('using a start position and angle', () => {
            const list = new TilesList(specs);

            list.appendTile();
            list.appendTile(CURVED_TILE_TYPE);
            list.appendTile();
            list.appendTile(CURVED_TILE_TYPE);
            list.appendTile();
            list.appendTile(CURVED_TILE_TYPE);
            list.appendTile();
            list.appendTile(CURVED_TILE_TYPE);

            expect(buildTrack(list, 100, 100, 45)).toMatchSnapshot();
        });
    });
});
