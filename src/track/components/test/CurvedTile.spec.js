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

import { render } from '@testing-library/svelte';
import CurvedTile from '../CurvedTile.svelte';
import { CurvedTileModel, TileSpecifications } from '../../models';
import { TILE_DIRECTION_LEFT, TILE_DIRECTION_RIGHT } from '../../helpers';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

describe('CurvedTile', () => {
    it('renders with default values', () => {
        const props = {
            model: new CurvedTileModel(specs)
        };
        const { container } = render(CurvedTile, { props });

        expect(container).toMatchSnapshot();
    });

    it.each([
        [TILE_DIRECTION_LEFT, 0, 1],
        [TILE_DIRECTION_LEFT, 45, 1],
        [TILE_DIRECTION_RIGHT, 45, 1],
        [TILE_DIRECTION_RIGHT, 0, 0.5],
        [TILE_DIRECTION_RIGHT, 0, 1],
        [TILE_DIRECTION_RIGHT, 0, 2],
        [TILE_DIRECTION_RIGHT, 0, 3],
        [TILE_DIRECTION_RIGHT, 0, 4]
    ])(
        'renders with the given parameters for a tile oriented to the %s with an angle of %s˚ and a ratio of %s',
        (direction, angle, ratio) => {
            const props = {
                model: new CurvedTileModel(specs, direction, ratio),
                angle,
                x: 100,
                y: 150,
                filter: 'select',
                id: 'tile'
            };
            const { container } = render(CurvedTile, { props });

            expect(container).toMatchSnapshot();
        }
    );

    it('needs a valid model', () => {
        const props = {
            model: {}
        };
        expect(() => render(CurvedTile, { props })).toThrow('The model must be an instance of CurvedTileModel!');
    });
});