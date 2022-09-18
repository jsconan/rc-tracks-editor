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
import { wait } from '../../../core/helpers';
import Sketch from '../Sketch.svelte';
import SketchWithSlot from './SketchWithSlot.svelte';

const x = 40;
const y = 50;
const viewX = 100;
const viewY = 150;
const viewWidth = 200;
const viewHeight = 300;
const width = 100;
const height = 150;

describe('Sketch', () => {
    it('renders with default values', () => {
        const { container } = render(Sketch);

        expect(container).toMatchSnapshot();
    });

    it.each([
        ['class', { class: 'tile' }],
        ['style', { style: 'fill: #444;' }],
        ['width and height', { width, height }],
        ['x, y, width and height', { x, y, width, height }],
        ['viewX, viewY, width, and height', { viewX, viewY, width, height }],
        ['x, y, viewX, viewY, width, and height', { x, y, viewX, viewY, width, height }],
        ['viewX, viewY, viewWidth, and viewHeight', { viewX, viewY, viewWidth, viewHeight }],
        ['x, y, viewX, viewY, viewWidth, and viewHeight', { x, y, viewX, viewY, viewWidth, viewHeight }],
        [
            'viewX, viewY, viewWidth, viewHeight, width, and height',
            { viewX, viewY, viewWidth, viewHeight, width, height }
        ],
        [
            'x, y, viewX, viewY, viewWidth, viewHeight, width, and height',
            { x, y, viewX, viewY, viewWidth, viewHeight, width, height }
        ]
    ])('renders with the parameters %s', (title, props) => {
        const { container } = render(Sketch, { props });

        expect(container).toMatchSnapshot();
    });

    it.each([
        ['class', { class: 'tile' }],
        ['style', { style: 'fill: #444;' }],
        ['width and height', { width, height }],
        ['x, y, width and height', { x, y, width, height }],
        ['viewX, viewY, width, and height', { viewX, viewY, width, height }],
        ['x, y, viewX, viewY, width, and height', { x, y, viewX, viewY, width, height }],
        ['viewX, viewY, viewWidth, and viewHeight', { viewX, viewY, viewWidth, viewHeight }],
        ['x, y, viewX, viewY, viewWidth, and viewHeight', { x, y, viewX, viewY, viewWidth, viewHeight }],
        [
            'viewX, viewY, viewWidth, viewHeight, width, and height',
            { viewX, viewY, viewWidth, viewHeight, width, height }
        ],
        [
            'x, y, viewX, viewY, viewWidth, viewHeight, width, and height',
            { x, y, viewX, viewY, viewWidth, viewHeight, width, height }
        ]
    ])('updates with the parameters %s', async (title, props) => {
        const unset = {
            class: void 0,
            style: void 0,
            x: void 0,
            y: void 0,
            viewX: void 0,
            viewY: void 0,
            viewWidth: void 0,
            viewHeight: void 0,
            width: void 0,
            height: void 0
        };
        const rendered = render(Sketch);

        return wait(10)
            .then(() => rendered.component.$set(props))
            .then(() => expect(rendered.container).toMatchSnapshot())
            .then(() => wait(10))
            .then(() => rendered.component.$set(unset))
            .then(() => expect(rendered.container).toMatchSnapshot());
    });

    it('renders with the given element in slots', () => {
        const { container } = render(SketchWithSlot);

        expect(container).toMatchSnapshot();
    });
});
