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
import Track from '../Track.svelte';
import TrackWithSlot from './TrackWithSlot.svelte';
import { buildTrack } from '../../builders';
import { TileCoordList, TileList } from '../../models';
import { TileSpecifications } from '../../config';
import { wait } from '../../../core/helpers';
import { CURVED_TILE_ENLARGED_TYPE, CURVED_TILE_TYPE, STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT } from '../../helpers';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);
const tileList = new TileList(specs);
tileList.import([
    { type: STRAIGHT_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_ENLARGED_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 }
]);
const listCoord = new TileCoordList(tileList, buildTrack, { hPadding: 10, vPadding: 20, startAngle: 90 });

describe('Track', () => {
    it.each([
        ['TileList', tileList],
        ['TileCoordList', listCoord]
    ])('renders with default values using a %s', (type, list) => {
        const props = { list };
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

    it.each([
        ['TileList', tileList],
        ['TileCoordList', listCoord]
    ])('renders with the given parameters using a %s', (type, list) => {
        const props = {
            list,
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

    it.each([
        ['TileList', tileList],
        ['TileCoordList', listCoord]
    ])('updates when the %s model is modified', async (type, list) => {
        const props = {
            list,
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

        await wait(1);
        tileList.appendTile();
        await wait(1);
        expect(rendered.container).toMatchSnapshot();
    });

    it('needs a valid model', () => {
        expect(() =>
            render(Track, {
                props: {
                    list: {}
                }
            })
        ).toThrow("'list' is not a store with a 'subscribe' method");

        expect(() =>
            render(Track, {
                props: {
                    list: {
                        subscribe() {
                            return () => {};
                        }
                    }
                }
            })
        ).toThrow('The list must be either an instance of TileList or TileCoordList!');
    });

    it.each([
        ['TileList', tileList],
        ['TileCoordList', listCoord]
    ])('fires click from a track built with a %s', (type, list) => {
        const onClick = jest.fn();
        const props = { list };
        const { container, component } = render(Context, {
            props: {
                component: Track,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        component.$on('click', onClick);
        fireEvent.click(container.querySelector(`#id-0`));
        fireEvent.click(container.querySelector(`#id-1`));
        fireEvent.click(container.querySelector(`#id-2`));
        expect(onClick).toHaveBeenCalledTimes(3);
    });

    it.each([
        ['TileList', tileList],
        ['TileCoordList', listCoord]
    ])('renders with the given element in slots using a %s', (type, list) => {
        const props = { list, component: Track };
        const { container } = render(Context, {
            props: {
                component: TrackWithSlot,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        expect(container).toMatchSnapshot();
    });
});
