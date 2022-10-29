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

import { fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { Context } from '../../../core/components';
import { CURVED_TILE_ENLARGED_TYPE, CURVED_TILE_TYPE, STRAIGHT_TILE_TYPE, TILE_DIRECTION_LEFT } from '../../helpers';
import TileNavigator from '../TileNavigator.svelte';
import TileNavigatorWithSlot from './TileNavigatorWithSlot.svelte';
import { TileSpecifications } from '../../config';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications({ laneWidth, barrierWidth, barrierChunks });

const elements = [
    { type: STRAIGHT_TILE_TYPE, direction: TILE_DIRECTION_LEFT, ratio: 1, angle: 0, x: 0, y: 0 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_LEFT, ratio: 1, angle: 0, x: 0, y: 0 },
    { type: CURVED_TILE_ENLARGED_TYPE, direction: TILE_DIRECTION_LEFT, ratio: 1, angle: 0, x: 0, y: 0 }
];

describe('TileNavigator', () => {
    it('renders with default values', async () => {
        const props = { elements };
        const { container } = render(Context, {
            props: {
                component: TileNavigator,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        expect(container).toMatchSnapshot();
    });

    it('renders with the given parameters', async () => {
        const props = {
            elements,
            hoveredIndex: 1
        };
        const { container } = render(Context, {
            props: {
                component: TileNavigator,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        expect(container).toMatchSnapshot();
    });

    it.each([
        ['elements', { elements: elements.slice(0, 2) }],
        ['hoveredIndex', { hoveredIndex: 1 }]
    ])('updates when the parameter %s is modified', async (title, update) => {
        const props = {
            elements,
            hoveredIndex: 0
        };
        const { container, component } = render(Context, {
            props: {
                component: TileNavigator,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        await tick();
        component.$set({ props: Object.assign({}, props, update) });
        await tick();
        expect(container).toMatchSnapshot();
    });

    it('renders with the given element in slots', () => {
        const props = {
            component: TileNavigator,
            elements,
            hoveredIndex: 1
        };
        const { container } = render(Context, {
            props: {
                component: TileNavigatorWithSlot,
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
            const props = {
                elements,
                hoveredIndex: 0
            };
            const rendered = render(Context, {
                props: {
                    component: TileNavigator,
                    contextKey: TileSpecifications.CONTEXT_ID,
                    context: specs,
                    resolve,
                    props
                }
            });
            container = rendered.container;
        });

        component.$on('select', onEvent);
        await fireEvent.click(container.querySelector('.hover'));
        await fireEvent.keyUp(container.querySelector('.hover'), { key: 'ArrowDown' });
        await fireEvent.keyUp(container.querySelector('.hover'), { key: ' ' });
        await fireEvent.keyUp(container.querySelector('.hover'), { key: 'Spacebar' });
        await fireEvent.keyUp(container.querySelector('.hover'), { key: 'Enter' });
        expect(onEvent).toHaveBeenCalledTimes(4);
    });

    it('can navigate', async () => {
        const props = { elements };
        const { container } = render(Context, {
            props: {
                component: TileNavigator,
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
        const props = { elements };
        const { container } = render(Context, {
            props: {
                component: TileNavigator,
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
        const props = { elements };
        const { container, component } = render(Context, {
            props: {
                component: TileNavigator,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        component.$set({ props: Object.assign({ hoveredIndex: 1 }, props) });
        await tick();
        expect(container).toMatchSnapshot();

        await fireEvent.mouseLeave(container.querySelector('.hover'));
        expect(container).toMatchSnapshot();
    });

    it('can hover the focused element', async () => {
        const props = { elements };
        const { container } = render(Context, {
            props: {
                component: TileNavigator,
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
