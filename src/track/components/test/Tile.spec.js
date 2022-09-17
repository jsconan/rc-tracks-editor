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
import Tile from '../Tile.svelte';
import { CurvedTileEnlargedModel, CurvedTileModel, StraightTileModel } from '../../models';
import { TileSpecifications } from '../../config';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);
const straightTile = new StraightTileModel(specs);
const curvedTile = new CurvedTileModel(specs);
const curvedTileEnlarged = new CurvedTileEnlargedModel(specs);

describe('Tile', () => {
    it.each([
        [straightTile.type, straightTile],
        [curvedTile.type, curvedTile],
        [curvedTileEnlarged.type, curvedTileEnlarged]
    ])('renders a %s tile with default values', (type, model) => {
        const props = { model };
        const { container } = render(Tile, { props });

        expect(container).toMatchSnapshot();
    });

    it.each([
        [straightTile.type, straightTile],
        [curvedTile.type, curvedTile],
        [curvedTileEnlarged.type, curvedTileEnlarged]
    ])('renders a %s tile with the given parameters', (type, model) => {
        const props = {
            model,
            x: 100,
            y: 200,
            angle: 90,
            filter: 'select',
            id: 'tile'
        };
        const { container } = render(Tile, { props });

        expect(container).toMatchSnapshot();
    });

    it('needs a valid model', () => {
        expect(() => render(Tile)).toThrow('The model must be an instance of TileModel!');
    });
});
