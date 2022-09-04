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
import Track from '../Track.svelte';
import { TrackModel, TileSpecifications } from '../../models';
import { wait } from '../../../core/helpers';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

describe('Track', () => {
    it('renders with default values', () => {
        const model = new TrackModel(specs);
        model.appendTile();
        const props = { model };
        const { container } = render(Track, { props });

        expect(container).toMatchSnapshot();
    });

    it('renders with the given parameters', () => {
        const model = new TrackModel(specs);
        model.appendTile();
        const props = {
            model,
            x: 100,
            y: 200,
            angle: 90
        };
        const { container } = render(Track, { props });

        expect(container).toMatchSnapshot();
    });

    it('update when the model is modified', async () => {
        const model = new TrackModel(specs);
        model.appendTile();
        const props = {
            model,
            x: 100,
            y: 200,
            angle: 90
        };
        const rendered = render(Track, { props });

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
        ).toThrow('The model must be an instance of TrackModel!');
    });
});
