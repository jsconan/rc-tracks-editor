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
import Track from '../Track.svelte';
import { buildTrack } from '../../helpers';
import { TileList } from '../../../tile/models';
import { TileListStore } from '../../../tile/stores';
import { TileSpecifications } from '../../../tile/config';
import {
    CURVED_TILE_ENLARGED_TYPE,
    CURVED_TILE_TYPE,
    STRAIGHT_TILE_TYPE,
    TILE_DIRECTION_RIGHT
} from '../../../tile/helpers';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications({ laneWidth, barrierWidth, barrierChunks });
const tileList = new TileList(specs);
const track = new TileListStore(tileList, list => buildTrack(list, { hPadding: 10, vPadding: 20, startAngle: 90 }));
tileList.import([
    { type: STRAIGHT_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_ENLARGED_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 }
]);

describe('Track', () => {
    it('renders with default values', () => {
        const props = { track };
        const { container } = render(Context, {
            props: {
                component: Track,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        expect(container).toMatchSnapshot();
    });

    it('renders with the given parameters', () => {
        const props = {
            track,
            x: 100,
            y: 200,
            width: 400,
            height: 400
        };
        const { container } = render(Context, {
            props: {
                component: Track,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        expect(container).toMatchSnapshot();
    });

    it('updates when the store is modified', async () => {
        const props = {
            track,
            x: 100,
            y: 200,
            width: 400,
            height: 400
        };
        const rendered = render(Context, {
            props: {
                component: Track,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        await tick();
        tileList.append();
        await tick();
        expect(rendered.container).toMatchSnapshot();
    });

    it('needs a valid store', () => {
        expect(() =>
            render(Track, {
                props: {
                    track: {}
                }
            })
        ).toThrow("'track' is not a store with a 'subscribe' method");
    });
});
