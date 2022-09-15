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
import { TilesList } from '../../models';
import { TileSpecifications } from '../../config';
import { wait } from '../../../core/helpers';
import { CURVED_TILE_ENLARGED_TYPE, CURVED_TILE_TYPE, STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT } from '../../helpers';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);
const model = new TilesList(specs);
model.import([
    { type: STRAIGHT_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
    { type: CURVED_TILE_ENLARGED_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 }
]);

describe('Track', () => {
    it('renders with default values', () => {
        const props = { model };
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
            model,
            x: 100,
            y: 200,
            width: 400,
            height: 400,
            angle: 90
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

    it('update when the model is modified', async () => {
        const props = {
            model,
            x: 100,
            y: 200,
            width: 400,
            height: 400,
            angle: 90
        };
        const rendered = render(Context, {
            props: {
                component: Track,
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
                props
            }
        });

        return wait(10)
            .then(() => model.appendTile())
            .then(() => wait(10))
            .then(() => expect(rendered.container).toMatchSnapshot());
    });

    it('needs a valid model', () => {
        expect(() =>
            render(Track, {
                props: {
                    model: {}
                }
            })
        ).toThrow("'model' is not a store with a 'subscribe' method");

        expect(() =>
            render(Track, {
                props: {
                    model: {
                        subscribe() {
                            return () => {};
                        }
                    }
                }
            })
        ).toThrow('The model must be an instance of TilesList!');
    });

    it('fires click', () => {
        const onClick = jest.fn();
        const props = { model };
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
});
