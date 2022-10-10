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
import { CurvedTileEnlargedModel, CurvedTileModel, StraightTileModel } from '../../../tile/models';
import { TileSet } from '../../models';
import { TileSpecifications } from '../../../tile/config';
import TileSelector from '../TileSelector.svelte';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);
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
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
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
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
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
                contextKey: TileSpecifications.CONTEXT_ID,
                context: specs,
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
});
