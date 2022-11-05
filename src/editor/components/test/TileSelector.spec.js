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
import { CurvedTileEnlargedModel, CurvedTileModel, StraightTileModel } from '../../../tile/models';
import { TileSet } from '../../models';
import { TileSpecifications } from '../../../tile/config';
import TileSelector from '../TileSelector.svelte';
import { wait } from '../../../core/helpers';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications({ laneWidth, barrierWidth, barrierChunks });
const models = [
    [new StraightTileModel(specs), 2],
    [new CurvedTileModel(specs), 2],
    [new CurvedTileEnlargedModel(specs), 2]
];
const allTiles = new TileSet(specs);
const fewTiles = new TileSet(specs, models);

describe('TileSelector', () => {
    it('renders with default values', () => {
        const props = { tiles: allTiles };
        const { container } = render(Context, {
            props: {
                component: TileSelector,
                context: { [TileSpecifications.CONTEXT_ID]: specs },
                props
            }
        });

        expect(container).toMatchSnapshot();
    });

    it('renders with the given parameters', () => {
        const props = {
            tiles: fewTiles,
            x: 100,
            y: 200,
            width: 400,
            height: 400
        };
        const { container } = render(Context, {
            props: {
                component: TileSelector,
                context: { [TileSpecifications.CONTEXT_ID]: specs },
                props
            }
        });

        expect(container).toMatchSnapshot();
    });

    it('updates when the model is modified', async () => {
        const props = {
            tiles: fewTiles,
            x: 100,
            y: 200,
            width: 400,
            height: 400
        };
        const rendered = render(Context, {
            props: {
                component: TileSelector,
                context: { [TileSpecifications.CONTEXT_ID]: specs },
                props
            }
        });

        await tick();
        fewTiles.add(new StraightTileModel(specs));
        fewTiles.remove(new CurvedTileEnlargedModel(specs));
        fewTiles.add(new CurvedTileModel(specs, CurvedTileModel.DIRECTION_RIGHT, 2));
        await tick();
        expect(rendered.container).toMatchSnapshot();
    });

    it('needs a valid model', () => {
        expect(() =>
            render(TileSelector, {
                props: {
                    tiles: {
                        subscribe() {
                            return () => {};
                        }
                    }
                }
            })
        ).toThrow('The object must be an instance of TileSet!');
    });

    it('fires select', async () => {
        const onEvent = jest.fn().mockImplementation(event => {
            expect(event.detail).toMatchSnapshot();
        });
        let container;
        const component = await new Promise(resolve => {
            const props = { tiles: allTiles };
            const rendered = render(Context, {
                props: {
                    component: TileSelector,
                    context: { [TileSpecifications.CONTEXT_ID]: specs },
                    resolve,
                    props
                }
            });
            container = rendered.container;
        });

        component.$on('select', onEvent);
        await fireEvent.mouseOver(container.querySelector(`[data-id=curved-tile-1]`));
        await fireEvent.click(container.querySelector('.hover'));
        await fireEvent.keyDown(container.querySelector('.hover'), { key: 'ArrowDown' });
        await fireEvent.keyUp(container.querySelector('.hover'), { key: ' ' });
        await fireEvent.keyUp(container.querySelector('.hover'), { key: 'Spacebar' });
        await fireEvent.keyUp(container.querySelector('.hover'), { key: 'Enter' });
        expect(onEvent).toHaveBeenCalledTimes(4);
    });

    it('can navigate', async () => {
        const props = { tiles: allTiles };
        const { container } = render(Context, {
            props: {
                component: TileSelector,
                context: { [TileSpecifications.CONTEXT_ID]: specs },
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
        const props = { tiles: allTiles };
        const { container } = render(Context, {
            props: {
                component: TileSelector,
                context: { [TileSpecifications.CONTEXT_ID]: specs },
                props
            }
        });

        await fireEvent.focus(container.querySelector('[role=menu]'));
        await wait(100);
        expect(container).toMatchSnapshot();

        await fireEvent.blur(container.querySelector('[role=menu]'));
        expect(container).toMatchSnapshot();
    });

    it('can focus a tile and blur it', async () => {
        const props = { tiles: allTiles };
        const { container } = render(Context, {
            props: {
                component: TileSelector,
                context: { [TileSpecifications.CONTEXT_ID]: specs },
                props
            }
        });

        await fireEvent.keyDown(container.querySelector('[role=menu]'), { key: 'ArrowDown' });
        expect(container).toMatchSnapshot();

        await fireEvent.blur(container.querySelector('[role=menu]'));
        expect(container).toMatchSnapshot();
    });

    it('can hover a tile and leave it', async () => {
        const props = { tiles: allTiles };
        const { container } = render(Context, {
            props: {
                component: TileSelector,
                context: { [TileSpecifications.CONTEXT_ID]: specs },
                props
            }
        });

        await fireEvent.mouseOver(container.querySelector(`[data-id=curved-tile-1]`));
        expect(container).toMatchSnapshot();

        await fireEvent.mouseLeave(container.querySelector('.hover'));
        expect(container).toMatchSnapshot();
    });

    it('can hover the focused element', async () => {
        const props = { tiles: allTiles };
        const { container } = render(Context, {
            props: {
                component: TileSelector,
                context: { [TileSpecifications.CONTEXT_ID]: specs },
                props
            }
        });

        await fireEvent.keyDown(container.querySelector('[role=menu]'), { key: 'ArrowDown' });
        await fireEvent.mouseEnter(container.querySelector('.focus'));
        expect(container).toMatchSnapshot();
    });
});
