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
import CurvedElement from '../CurvedElement.svelte';

describe('CurvedElement', () => {
    it('renders with default values', () => {
        const { container } = render(CurvedElement);

        expect(container).toMatchSnapshot();
    });

    it('renders with the given parameters', () => {
        const props = {
            class: 'tile',
            style: 'fill: #444;',
            cx: 100,
            cy: 150,
            width: 80,
            radius: 50,
            angle: 30,
            start: 60,
            fill: 'red',
            stroke: 'green',
            strokeWidth: 2
        };
        const { container } = render(CurvedElement, { props });

        expect(container).toMatchSnapshot();
    });

    it.each([
        ['class', { class: 'curve' }],
        ['style', { style: 'fill: #888' }],
        ['cx', { cx: 40 }],
        ['cy', { cy: 40 }],
        ['width', { width: 40 }],
        ['radius', { radius: 40 }],
        ['angle', { angle: 40 }],
        ['start', { start: 40 }],
        ['fill', { fill: 'blue' }],
        ['stroke', { stroke: 'blue' }],
        ['strokeWidth', { strokeWidth: 3 }]
    ])('updates when the parameter %s is modified', async (title, update) => {
        const props = {
            class: 'tile',
            style: 'fill: #444;',
            cx: 100,
            cy: 150,
            width: 80,
            radius: 50,
            angle: 30,
            start: 60,
            fill: 'red',
            stroke: 'green',
            strokeWidth: 2
        };
        const rendered = render(CurvedElement, { props });

        await tick();
        rendered.component.$set(update);
        await tick();
        expect(rendered.container).toMatchSnapshot();
    });
});
