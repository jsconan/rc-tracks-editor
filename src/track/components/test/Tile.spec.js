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

import { render, fireEvent } from '@testing-library/svelte';
import Context from './Context.svelte';
import Tile from '../Tile.svelte';
import { CurvedTileEnlargedModel, CurvedTileModel, StraightTileModel } from '../../models';
import { TileSpecifications } from '../../config';
import { TILE_DIRECTION_RIGHT } from '../../helpers';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);
const straightTile = new StraightTileModel(specs);
const curvedTile = new CurvedTileModel(specs);
const curvedTileEnlarged = new CurvedTileEnlargedModel(specs);

describe('Tile', () => {
    it.each([void 0, straightTile.type, curvedTile.type, curvedTileEnlarged.type])(
        'renders a %s tile with default values',
        type => {
            const props = { type };
            const { container } = render(Context, {
                props: {
                    component: Tile,
                    contextKey: TileSpecifications.CONTEXT_ID,
                    context: specs,
                    props
                }
            });

            expect(container).toMatchSnapshot();
        }
    );

    it.each([straightTile.type, curvedTile.type, curvedTileEnlarged.type])(
        'renders a %s tile with the given parameters',
        type => {
            const props = {
                type,
                direction: TILE_DIRECTION_RIGHT,
                ratio: 1,
                x: 100,
                y: 200,
                angle: 90,
                filter: 'select',
                id: 'tile'
            };
            const { container } = render(Context, {
                props: {
                    component: Tile,
                    contextKey: TileSpecifications.CONTEXT_ID,
                    context: specs,
                    props
                }
            });

            expect(container).toMatchSnapshot();
        }
    );

    it('needs a valid type', () => {
        const props = { type: 'tile' };
        expect(() => render(Tile, { props })).toThrow('A valid type of tile is needed!');
    });

    it.each([straightTile.type, curvedTile.type, curvedTileEnlarged.type])('fires click from a %s tile', type => {
        const onClick = jest.fn();
        const props = { type };
        const { container, component } = render(Context, {
            props: {
                component: Tile,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });
        const element = container.querySelector('.ground');

        component.$on('click', onClick);
        fireEvent.click(element);
        expect(onClick).toHaveBeenCalled();
    });
});
