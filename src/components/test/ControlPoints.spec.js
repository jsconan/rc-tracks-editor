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
import ControlPoints from '../ControlPoints.svelte';
import CurvedTileModel from '../../models/CurvedTileModel';
import CurvedTileEnlargedModel from '../../models/CurvedTileEnlargedModel';
import StraightTileModel from '../../models/StraightTileModel';
import {
    CURVED_TILE_ENLARGED_TYPE,
    CURVED_TILE_TYPE,
    STRAIGHT_TILE_TYPE,
    TILE_DIRECTION_LEFT,
    TILE_DIRECTION_RIGHT
} from '../../helpers/types';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;

const straightTileModel = new StraightTileModel(laneWidth, barrierWidth, barrierChunks);
const curvedTileModel = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks);
const enlargedTileModel = new CurvedTileEnlargedModel(laneWidth, barrierWidth, barrierChunks);

describe('ControlPoints', () => {
    it('renders with default values', () => {
        const props = {
            model: straightTileModel
        };
        const { container } = render(ControlPoints, { props });

        expect(container).toMatchSnapshot();
    });

    it.each([
        [STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT, straightTileModel],
        [STRAIGHT_TILE_TYPE, TILE_DIRECTION_LEFT, straightTileModel],
        [CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, curvedTileModel],
        [CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, curvedTileModel],
        [CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_RIGHT, enlargedTileModel],
        [CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT, enlargedTileModel]
    ])('renders with the given parameters for a %s oriented to the %s', (type, direction, model) => {
        const props = {
            model,
            direction,
            angle: 45,
            x: 100,
            y: 150,
            r: 8
        };
        const { container } = render(ControlPoints, { props });

        expect(container).toMatchSnapshot();
    });
});
