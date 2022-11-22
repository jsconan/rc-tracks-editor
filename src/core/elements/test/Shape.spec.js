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
import Shape from '../Shape.svelte';

describe('Shape', () => {
    it('renders with default values', () => {
        const props = { path: 'M 10,10 L 5,0, L 0,5 L 0,0 Z' };
        const { container } = render(Shape, { props });

        expect(container).toMatchSnapshot();
    });

    it('renders with the given parameters', () => {
        const props = {
            path: 'M 10,10 L 5,0, L 0,5 L 0,0 Z',
            fill: 'red',
            stroke: {
                stroke: 'green',
                'stroke-width': 2
            },
            transform: 'rotate(90)'
        };
        const { container } = render(Shape, { props });

        expect(container).toMatchSnapshot();
    });

    it.each([
        ['path', { path: 'M 6,10 A 6 4 10 1 0 14,10' }],
        ['fill', { fill: 'blue' }],
        ['stroke', { stroke: 'blue' }],
        ['stroke-width', { stroke: { 'stroke-width': 3 } }],
        ['transform', { transform: 'rotate(180)' }]
    ])('updates when the parameter %s is modified', async (title, update) => {
        const props = {
            cx: 100,
            path: 'M 10,10 L 5,0, L 0,5 L 0,0 Z',
            fill: 'red',
            stroke: {
                stroke: 'green',
                'stroke-width': 2
            },
            transform: 'rotate(90)'
        };
        const rendered = render(Shape, { props });

        await tick();
        rendered.component.$set(update);
        await tick();
        expect(rendered.container).toMatchSnapshot();
    });
});
