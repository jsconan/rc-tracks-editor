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
import { tick } from 'svelte';
import { Context } from '../../../core/components';
import Track from '../Track.svelte';
import TrackWithSlot from './TrackWithSlot.svelte';
import { TrackModel } from '../../models';
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
const track = new TrackModel(specs);
track.import([
    { type: STRAIGHT_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_ENLARGED_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 }
]);
track.setBuilderOptions({ hPadding: 10, vPadding: 20, startAngle: 90 });

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

    it('updates when the model is modified', async () => {
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
        const tile = track.append();
        await tick();
        track.replace(tile.id, CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, 2);
        await tick();
        expect(rendered.container).toMatchSnapshot();
    });

    it('needs a valid model', () => {
        expect(() =>
            render(Track, {
                props: {
                    track: {
                        subscribe() {
                            return () => {};
                        }
                    }
                }
            })
        ).toThrow('The object must be an instance of TrackModel!');
    });

    it('renders with the given element in slots', () => {
        const props = { track, component: Track };
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

    it('fires select', async () => {
        const onEvent = jest.fn().mockImplementation(event => {
            expect(event.detail).toMatchSnapshot();
        });
        let container;
        const component = await new Promise(resolve => {
            const props = { track };
            const rendered = render(Context, {
                props: {
                    component: Track,
                    contextKey: TileSpecifications.CONTEXT_ID,
                    context: specs,
                    resolve,
                    props
                }
            });
            container = rendered.container;
        });

        component.$on('select', onEvent);
        await fireEvent.mouseEnter(container.querySelector(`[data-id=id-1]`));
        await fireEvent.click(container.querySelector('.hover'));
        await fireEvent.keyUp(container.querySelector('.hover'), { key: 'ArrowDown' });
        await fireEvent.keyUp(container.querySelector('.hover'), { key: ' ' });
        await fireEvent.keyUp(container.querySelector('.hover'), { key: 'Spacebar' });
        await fireEvent.keyUp(container.querySelector('.hover'), { key: 'Enter' });
        expect(onEvent).toHaveBeenCalledTimes(4);
    });

    it('can navigate', async () => {
        const props = { track };
        const { container } = render(Context, {
            props: {
                component: Track,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        await fireEvent.keyUp(container.querySelector('[role=menu]'), { key: 'Right' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyUp(container.querySelector('[role=menu]'), { key: 'Down' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyUp(container.querySelector('[role=menu]'), { key: 'ArrowRight' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyUp(container.querySelector('[role=menu]'), { key: 'ArrowDown' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyUp(container.querySelector('[role=menu]'), { key: 'Esc' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyUp(container.querySelector('[role=menu]'), { key: 'Left' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyUp(container.querySelector('[role=menu]'), { key: 'Up' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyUp(container.querySelector('[role=menu]'), { key: 'ArrowLeft' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyUp(container.querySelector('[role=menu]'), { key: 'ArrowUp' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyUp(container.querySelector('[role=menu]'), { key: 'Escape' });
        expect(container).toMatchSnapshot();
    });

    it('can focus and blur', async () => {
        const props = { track };
        const { container } = render(Context, {
            props: {
                component: Track,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        await fireEvent.keyUp(container.querySelector('[role=menu]'), { key: 'ArrowDown' });
        expect(container).toMatchSnapshot();

        await fireEvent.blur(container.querySelector('[role=menu]'));
        expect(container).toMatchSnapshot();
    });

    it('can hover and leave', async () => {
        const props = { track };
        const { container } = render(Context, {
            props: {
                component: Track,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        await fireEvent.mouseEnter(container.querySelector(`[data-id=id-1]`));
        expect(container).toMatchSnapshot();

        await fireEvent.mouseLeave(container.querySelector('.hover'));
        expect(container).toMatchSnapshot();
    });

    it('can hover the focused element', async () => {
        const props = { track };
        const { container } = render(Context, {
            props: {
                component: Track,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        await fireEvent.keyUp(container.querySelector('[role=menu]'), { key: 'ArrowDown' });
        await fireEvent.mouseEnter(container.querySelector('.focus'));
        expect(container).toMatchSnapshot();
    });
});
