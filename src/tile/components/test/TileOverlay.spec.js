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
import { tick } from 'svelte';
import { TileSpecifications } from '../../config';
import { CurvedTileModel, CurvedTileEnlargedModel, StraightTileModel } from '../../models';
import TileOverlay from '../TileOverlay.svelte';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications({ laneWidth, barrierWidth, barrierChunks });
const straightTile = new StraightTileModel(specs);
const curvedTile = new CurvedTileModel(specs);
const curvedTileEnlarged = new CurvedTileEnlargedModel(specs);

describe('TileOverlay', () => {
    it.each([
        [straightTile.type, straightTile],
        [curvedTile.type, curvedTile],
        [curvedTileEnlarged.type, curvedTileEnlarged]
    ])('renders an overlay for a % tile with default values', (type, tile) => {
        const props = {
            tile
        };
        const { container } = render(TileOverlay, { props });

        expect(container).toMatchSnapshot();
    });

    it.each([
        [straightTile.type, straightTile],
        [curvedTile.type, curvedTile],
        [curvedTileEnlarged.type, curvedTileEnlarged]
    ])('renders an overlay for a % tile with the given parameters', (type, tile) => {
        const props = {
            tile,
            x: 10,
            y: 20,
            angle: 30
        };
        const { container } = render(TileOverlay, { props });

        expect(container).toMatchSnapshot();
    });

    it.each([
        ['tile', { tile: curvedTile }],
        ['angle', { angle: 90 }],
        ['x', { x: 40 }],
        ['y', { y: 40 }]
    ])('updates when the parameter %s is modified', async (title, update) => {
        const props = {
            tile: straightTile,
            x: 10,
            y: 20,
            angle: 30
        };
        const rendered = render(TileOverlay, { props });

        await tick();
        rendered.component.$set(update);
        await tick();
        expect(rendered.container).toMatchSnapshot();
    });
});
