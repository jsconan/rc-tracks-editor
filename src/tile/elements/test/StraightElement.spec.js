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
import StraightElement from '../StraightElement.svelte';

describe('StraightElement', () => {
    it('renders with default values', () => {
        const { container } = render(StraightElement);

        expect(container).toMatchSnapshot();
    });

    it('renders with the given parameters', () => {
        const props = {
            x: 100,
            y: 150,
            width: 80,
            height: 100,
            fill: 'red',
            stroke: 'green',
            strokeWidth: 2,
            transform: 'rotate(90)'
        };
        const { container } = render(StraightElement, { props });

        expect(container).toMatchSnapshot();
    });

    it.each([
        ['x', { x: 40 }],
        ['y', { y: 40 }],
        ['width', { width: 40 }],
        ['height', { height: 40 }],
        ['d', { d: 10 }],
        ['fill', { fill: 'blue' }],
        ['stroke', { stroke: 'blue' }],
        ['strokeWidth', { strokeWidth: 3 }],
        ['transform', { transform: 'rotate(180)' }]
    ])('updates when the parameter %s is modified', async (title, update) => {
        const props = {
            x: 100,
            y: 150,
            width: 80,
            height: 100,
            fill: 'red',
            stroke: 'green',
            strokeWidth: 2,
            transform: 'rotate(90)'
        };
        const rendered = render(StraightElement, { props });

        await tick();
        rendered.component.$set(update);
        await tick();
        expect(rendered.container).toMatchSnapshot();
    });
});
