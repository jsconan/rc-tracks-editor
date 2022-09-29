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
import TrackRef from '../TrackRef.svelte';
import TrackWithSlot from './TrackWithSlot.svelte';
import { buildTrack } from '../../builders';
import { TileCoordList, TileList } from '../../models';
import { TileSpecifications } from '../../config';
import { CURVED_TILE_ENLARGED_TYPE, CURVED_TILE_TYPE, STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT } from '../../helpers';
import { tick } from 'svelte';

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

describe('TrackRef', () => {
    it('renders with default values', () => {
        const props = { list: listCoord };
        const { container } = render(Context, {
            props: {
                component: TrackRef,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        expect(container).toMatchSnapshot();
    });

    it('renders with the given parameters', () => {
        const props = {
            list: listCoord,
            x: 100,
            y: 200,
            width: 400,
            height: 400
        };
        const { container } = render(Context, {
            props: {
                component: TrackRef,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        expect(container).toMatchSnapshot();
    });

    it('updates when the model is modified', async () => {
        const props = {
            list: listCoord,
            x: 100,
            y: 200,
            width: 400,
            height: 400
        };
        const rendered = render(Context, {
            props: {
                component: TrackRef,
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

    it('needs a valid model', () => {
        expect(() =>
            render(TrackRef, {
                props: {
                    list: {}
                }
            })
        ).toThrow("'list' is not a store with a 'subscribe' method");

        expect(() =>
            render(TrackRef, {
                props: {
                    list: {
                        subscribe() {
                            return () => {};
                        }
                    }
                }
            })
        ).toThrow('The object must be an instance of TileCoordList!');
    });

    it('fires click', () => {
        const onClick = jest.fn();
        const props = { list: listCoord };
        const { container, component } = render(Context, {
            props: {
                component: TrackRef,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        component.$on('click', onClick);
        fireEvent.click(container.querySelector(`[data-id=id-0]`));
        fireEvent.click(container.querySelector(`[data-id=id-1]`));
        fireEvent.click(container.querySelector(`[data-id=id-2]`));
        expect(onClick).toHaveBeenCalledTimes(3);
    });

    it('renders with the given element in slots', () => {
        const props = { list: listCoord, component: TrackRef };
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
