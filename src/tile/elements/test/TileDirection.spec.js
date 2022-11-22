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
import TileDirection from '../TileDirection.svelte';
import { TileSpecifications } from '../../../tile/config';
import {
    CURVED_TILE_ENLARGED_TYPE,
    CURVED_TILE_TYPE,
    STRAIGHT_TILE_TYPE,
    TILE_DIRECTION_LEFT,
    TILE_DIRECTION_RIGHT
} from '../../helpers';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications({ laneWidth, barrierWidth, barrierChunks });

describe('TileDirection', () => {
    it.each([void 0, STRAIGHT_TILE_TYPE, CURVED_TILE_TYPE, CURVED_TILE_ENLARGED_TYPE])(
        'renders a %s element with default values',
        type => {
            const props = { type };
            const { container } = render(Context, {
                props: {
                    component: TileDirection,
                    context: { [TileSpecifications.CONTEXT_ID]: specs },
                    props
                }
            });

            expect(container).toMatchSnapshot();
        }
    );

    it.each([STRAIGHT_TILE_TYPE, CURVED_TILE_TYPE, CURVED_TILE_ENLARGED_TYPE])(
        'renders a %s element with the given parameters',
        type => {
            const props = {
                type,
                direction: TILE_DIRECTION_RIGHT,
                ratio: 1,
                x: 100,
                y: 200,
                rotation: 90,
                fill: 'red',
                stroke: {
                    stroke: 'green',
                    'stroke-width': 2
                }
            };
            const { container } = render(Context, {
                props: {
                    component: TileDirection,
                    context: { [TileSpecifications.CONTEXT_ID]: specs },
                    props
                }
            });

            expect(container).toMatchSnapshot();
        }
    );

    it.each([
        ['type', { type: CURVED_TILE_TYPE }],
        ['direction', { direction: TILE_DIRECTION_LEFT }],
        ['ratio', { ratio: 2 }],
        ['rotation', { rotation: 45 }],
        ['x', { x: 40 }],
        ['y', { y: 40 }],
        ['fill', { fill: 'blue' }],
        ['stroke', { stroke: 'blue' }],
        ['stroke-width', { stroke: { 'stroke-width': 3 } }]
    ])('updates when the parameter %s is modified', async (title, update) => {
        const props = {
            type: STRAIGHT_TILE_TYPE,
            direction: TILE_DIRECTION_RIGHT,
            ratio: 1,
            x: 100,
            y: 200,
            rotation: 90,
            fill: 'red',
            stroke: {
                stroke: 'green',
                'stroke-width': 2
            }
        };
        const rendered = render(Context, {
            props: {
                component: TileDirection,
                context: { [TileSpecifications.CONTEXT_ID]: specs },
                props
            }
        });

        await tick();
        rendered.component.$set({ props: Object.assign({}, props, update) });
        await tick();
        expect(rendered.container).toMatchSnapshot();
    });

    it('needs a valid type', () => {
        const props = { type: 'tile' };
        expect(() => render(TileDirection, { props })).toThrow('A valid type of tile is needed!');
    });
});