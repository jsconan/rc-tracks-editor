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
import Context from '../Context.svelte';
import Mock from './Mock.svelte';

describe('Context', () => {
    it('renders with default values', () => {
        const props = {
            component: Mock
        };
        const { container } = render(Context, { props });

        expect(container).toMatchSnapshot();
    });

    it('renders with the given context', () => {
        const props = {
            component: Mock,
            context: { foo: 'bar' }
        };
        const { container } = render(Context, { props });

        expect(container).toMatchSnapshot();
    });

    it('renders with the given props', () => {
        const props = {
            component: Mock,
            props: { param: 'defined' }
        };
        const { container } = render(Context, { props });

        expect(container).toMatchSnapshot();
    });

    it('renders with the given parameters', () => {
        const props = {
            component: Mock,
            context: { foo: 'bar' },
            props: { param: 'defined' }
        };
        const { container } = render(Context, { props });

        expect(container).toMatchSnapshot();
    });

    it('updates with the given parameters', async () => {
        const props = {
            component: Mock,
            context: { foo: 'bar' },
            props: { param: 'origin' }
        };
        const rendered = render(Context, { props });

        expect(rendered.container).toMatchSnapshot();
        rendered.component.$set({ props: { param: 'updated' } });
        await tick();
        expect(rendered.container).toMatchSnapshot();
    });

    it('resolves with the nested component', async () => {
        let container;
        const component = await new Promise(resolve => {
            const rendered = render(Context, {
                props: {
                    component: Mock,
                    resolve
                }
            });
            container = rendered.container;
        });

        expect(component).toBeInstanceOf(Mock);
        expect(container).toMatchSnapshot();
    });
});
