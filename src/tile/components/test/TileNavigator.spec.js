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
    { type: STRAIGHT_TILE_TYPE, direction: TILE_DIRECTION_LEFT, ratio: 1, angle: 0, x: 0, y: 0, id: 'id-0' },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_LEFT, ratio: 1, angle: 0, x: 0, y: 0, id: 'id-1' },
    { type: CURVED_TILE_ENLARGED_TYPE, direction: TILE_DIRECTION_LEFT, ratio: 1, angle: 0, x: 0, y: 0, id: 'id-2' }
];

function mockTarget(id) {
    return {
        target: {
            closest() {
                return {
                    dataset: { id }
                };
            }
        }
    };
}

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

    it.each([['elements', { elements: elements.slice(0, 2) }]])(
        'updates when the parameter %s is modified',
        async (title, update) => {
            const props = { elements };
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
        }
    );

    it('renders with the given element in slots', async () => {
        const props = {
            component: TileNavigator,
            elements
        };
        const { container } = render(Context, {
            props: {
                component: TileNavigatorWithSlot,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        await fireEvent.mouseOver(container.querySelector('[role=menu]'), mockTarget('id-1'));
        expect(container).toMatchSnapshot();
    });

    it('fires select', async () => {
        const onEvent = jest.fn().mockImplementation(event => {
            expect(event.detail).toMatchSnapshot();
        });
        let container;
        const component = await new Promise(resolve => {
            const props = { elements };
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
        await fireEvent.mouseOver(container.querySelector('[role=menu]'), mockTarget('id-0'));
        await fireEvent.click(container.querySelector('.hover'));
        await fireEvent.keyDown(container.querySelector('.hover'), { key: 'ArrowDown' });
        await fireEvent.keyUp(container.querySelector('.hover'), { key: ' ' });
        await fireEvent.keyUp(container.querySelector('.hover'), { key: 'Spacebar' });
        await fireEvent.keyUp(container.querySelector('.hover'), { key: 'Enter' });
        expect(onEvent).toHaveBeenCalledTimes(4);
    });

    it('fires select, keeping selection', async () => {
        const onEvent = jest.fn().mockImplementation(event => {
            expect(event.detail).toMatchSnapshot();
        });
        let container;
        const component = await new Promise(resolve => {
            const props = { elements };
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
        await fireEvent.mouseOver(container.querySelector('[role=menu]'), mockTarget('id-1'));
        await fireEvent.click(container.querySelector('.hover'));
        await fireEvent.keyUp(container.querySelector('[role=menu]'), { key: 'Escape' });
        await fireEvent.keyDown(container.querySelector('.hover'), { key: 'ArrowDown' });
        await fireEvent.keyUp(container.querySelector('.hover'), { key: 'Enter' });
        expect(onEvent).toHaveBeenCalledTimes(2);
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

        await fireEvent.keyDown(container.querySelector('[role=menu]'), { key: 'Right' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyDown(container.querySelector('[role=menu]'), { key: 'Down' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyDown(container.querySelector('[role=menu]'), { key: 'ArrowRight' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyDown(container.querySelector('[role=menu]'), { key: 'ArrowDown' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyUp(container.querySelector('[role=menu]'), { key: 'Esc' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyDown(container.querySelector('[role=menu]'), { key: 'Left' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyDown(container.querySelector('[role=menu]'), { key: 'Up' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyDown(container.querySelector('[role=menu]'), { key: 'ArrowLeft' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyDown(container.querySelector('[role=menu]'), { key: 'ArrowUp' });
        expect(container).toMatchSnapshot();

        await fireEvent.keyUp(container.querySelector('[role=menu]'), { key: 'Escape' });
        expect(container).toMatchSnapshot();
    });

    it('can focus the container and blur it', async () => {
        const props = { elements, x: -10, y: -20, width: 200, height: 100 };
        const { container } = render(Context, {
            props: {
                component: TileNavigator,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        await fireEvent.focus(container.querySelector('[role=menu]'));
        expect(container).toMatchSnapshot();

        await fireEvent.blur(container.querySelector('[role=menu]'));
        expect(container).toMatchSnapshot();
    });

    it('can focus the container and change its size', async () => {
        const props = { elements, x: -10, y: -20, width: 200, height: 100 };
        const { container, component } = render(Context, {
            props: {
                component: TileNavigator,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        await fireEvent.focus(container.querySelector('[role=menu]'));
        expect(container).toMatchSnapshot();

        component.$set({ props: Object.assign({}, props, { x: -30, y: -10, width: 300, height: 200 }) });
        await tick();
        await fireEvent.focus(container.querySelector('[role=menu]'));
        expect(container).toMatchSnapshot();
    });

    it('can focus an element and blur it', async () => {
        const onFocus = jest.fn().mockImplementation(event => {
            expect(event.detail).toMatchSnapshot();
        });
        const onBlur = jest.fn().mockImplementation(event => {
            expect(event.detail).toMatchSnapshot();
        });
        let container;
        const component = await new Promise(resolve => {
            const props = { elements };
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

        component.$on('focus', onFocus);
        component.$on('blur', onBlur);

        await fireEvent.keyDown(container.querySelector('[role=menu]'), { key: 'ArrowDown' });
        expect(container).toMatchSnapshot();

        await fireEvent.blur(container.querySelector('[role=menu]'));
        expect(container).toMatchSnapshot();

        expect(onFocus).toHaveBeenCalledTimes(1);
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('can hover an element and leave it', async () => {
        const onEnter = jest.fn().mockImplementation(event => {
            expect(event.detail).toMatchSnapshot();
        });
        const onLeave = jest.fn().mockImplementation(event => {
            expect(event.detail).toMatchSnapshot();
        });
        let container;
        const component = await new Promise(resolve => {
            const props = { elements };
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

        component.$on('enter', onEnter);
        component.$on('leave', onLeave);

        await fireEvent.mouseOver(container.querySelector('[role=menu]'), mockTarget('id-1'));
        expect(container).toMatchSnapshot();

        await fireEvent.mouseLeave(container.querySelector('.hover'));
        expect(container).toMatchSnapshot();

        expect(onEnter).toHaveBeenCalledTimes(1);
        expect(onLeave).toHaveBeenCalledTimes(1);
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

        await fireEvent.keyDown(container.querySelector('[role=menu]'), { key: 'ArrowDown' });
        await fireEvent.mouseEnter(container.querySelector('.focus'));
        expect(container).toMatchSnapshot();
    });

    it('can hover the focused element then leave it', async () => {
        const props = { elements };
        const { container } = render(Context, {
            props: {
                component: TileNavigator,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        await fireEvent.keyDown(container.querySelector('[role=menu]'), { key: 'ArrowDown' });
        await fireEvent.mouseEnter(container.querySelector('.focus'));
        await fireEvent.mouseLeave(container.querySelector('.focus'));
        expect(container).toMatchSnapshot();
    });

    it('can hover an element then focus it', async () => {
        const props = { elements };
        const { container } = render(Context, {
            props: {
                component: TileNavigator,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        await fireEvent.mouseOver(container.querySelector('[role=menu]'), mockTarget('id-0'));
        await fireEvent.keyDown(container.querySelector('[role=menu]'), { key: 'ArrowDown' });
        await fireEvent.mouseEnter(container.querySelector('.focus'));
        expect(container).toMatchSnapshot();
    });

    it('can focus the default element', async () => {
        const props = { elements, selectedIndex: 1 };
        const { container } = render(Context, {
            props: {
                component: TileNavigator,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        await fireEvent.keyDown(container.querySelector('[role=menu]'), { key: 'ArrowDown' });
        expect(container).toMatchSnapshot();
    });
});
