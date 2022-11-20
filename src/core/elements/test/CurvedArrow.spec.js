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
import CurvedArrow from '../CurvedArrow.svelte';

describe('CurvedArrow', () => {
    it('renders with default values', () => {
        const { container } = render(CurvedArrow);

        expect(container).toMatchSnapshot();
    });

    it('renders with the given parameters', () => {
        const props = {
            cx: 100,
            cy: 150,
            rotation: 60,
            height: 50,
            radius: 50,
            angle: 30,
            thickness: 25,
            clockwise: true,
            fill: 'red',
            stroke: {
                stroke: 'green',
                'stroke-width': 2
            },
            transform: 'rotate(90)'
        };
        const { container } = render(CurvedArrow, { props });

        expect(container).toMatchSnapshot();
    });

    it.each([
        ['cx', { cx: 40 }],
        ['cy', { cy: 40 }],
        ['rotation', { rotation: 90 }],
        ['width', { width: 60 }],
        ['height', { height: 60 }],
        ['radius', { radius: 60 }],
        ['angle', { angle: 90 }],
        ['thickness', { thickness: 50 }],
        ['clockwise', { clockwise: false }],
        ['fill', { fill: 'blue' }],
        ['stroke', { stroke: 'blue' }],
        ['stroke-width', { stroke: { 'stroke-width': 3 } }],
        ['transform', { transform: 'rotate(180)' }]
    ])('updates when the parameter %s is modified', async (title, update) => {
        const props = {
            cx: 100,
            cy: 150,
            rotation: 60,
            width: 50,
            height: 50,
            radius: 50,
            thickness: 25,
            clockwise: true,
            fill: 'red',
            stroke: {
                stroke: 'green',
                'stroke-width': 2
            },
            transform: 'rotate(90)'
        };
        const rendered = render(CurvedArrow, { props });

        await tick();
        rendered.component.$set(update);
        await tick();
        expect(rendered.container).toMatchSnapshot();
    });
});
