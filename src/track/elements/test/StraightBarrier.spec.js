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
import StraightBarrier from '../StraightBarrier.svelte';

describe('StraightBarrier', () => {
    it('renders with default values', () => {
        const props = {
            chunks: 4,
            width: 6,
            length: 25
        };
        const { container } = render(StraightBarrier, { props });

        expect(container).toMatchSnapshot();
    });

    it.each([
        [0, false],
        [1, false],
        [0, true],
        [1, true]
    ])('renders with the given parameters and shift=%s and vertical=%s', (shift, vertical) => {
        const props = {
            chunks: 4,
            width: 6,
            length: 25,
            left: 100,
            top: 100,
            shift,
            vertical
        };
        const { container } = render(StraightBarrier, { props });

        expect(container).toMatchSnapshot();
    });
});
