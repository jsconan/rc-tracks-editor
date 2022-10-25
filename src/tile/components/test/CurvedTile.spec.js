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
import { Context } from '../../../core/components';
import CurvedTile from '../CurvedTile.svelte';
import { TileSpecifications } from '../../config';
import { TILE_DIRECTION_LEFT, TILE_DIRECTION_RIGHT } from '../../helpers';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications({ laneWidth, barrierWidth, barrierChunks });

describe('CurvedTile', () => {
    it('renders with default values', () => {
        const { container } = render(Context, {
            props: {
                component: CurvedTile,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs
            }
        });

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
                direction,
                ratio,
                angle,
                x: 100,
                y: 150,
                id: 'tile'
            };
            const { container } = render(Context, {
                props: {
                    component: CurvedTile,
                    contextKey: TileSpecifications.CONTEXT_ID,
                    context: specs,
                    props
                }
            });

            expect(container).toMatchSnapshot();
        }
    );

    it.each([
        ['direction', { direction: TILE_DIRECTION_LEFT }],
        ['ratio', { ratio: 2 }],
        ['angle', { angle: 45 }],
        ['x', { x: 40 }],
        ['y', { y: 40 }]
    ])('updates when the parameter %s is modified', async (title, update) => {
        const props = {
            direction: TILE_DIRECTION_RIGHT,
            ratio: 1,
            angle: 0,
            x: 100,
            y: 150,
            id: 'tile'
        };
        const rendered = render(Context, {
            props: {
                component: CurvedTile,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        await tick();
        rendered.component.$set({ props: Object.assign({}, props, update) });
        await tick();
        expect(rendered.container).toMatchSnapshot();
    });
});
