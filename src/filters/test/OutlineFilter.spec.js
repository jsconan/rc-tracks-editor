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
import OutlineFilter from '../OutlineFilter.svelte';

describe('OutlineFilter', () => {
    it('renders with default values', () => {
        const { container } = render(OutlineFilter);

        expect(container).toMatchSnapshot();
    });

    it('renders with the given parameters', () => {
        const props = {
            id: 'select',
            R: 0.1,
            G: 0.2,
            B: 0.3,
            A: 0.4,
            width: 10
        };
        const { container } = render(OutlineFilter, { props });

        expect(container).toMatchSnapshot();
    });
});
