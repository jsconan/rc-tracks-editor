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

import { ListNavigator } from '../ListNavigator.js';

const source = [{ name: 'Bob' }, { name: 'Alice' }, { name: 'Foo' }, { name: 'Bar' }];

describe('ListNavigator', () => {
    it('is a class', () => {
        expect(ListNavigator).toEqual(expect.any(Function));
    });

    it('can be initialized with a source', () => {
        expect(new ListNavigator().elements).toEqual([]);
        expect(new ListNavigator(source).elements).toStrictEqual(source);
    });

    it('has a length', () => {
        expect(new ListNavigator().length).toBe(0);
        expect(new ListNavigator(source).length).toBe(source.length);
    });

    it('can set the list of elements', () => {
        const navigator = new ListNavigator();

        expect(navigator.setElements(source)).toBe(navigator);
        expect(navigator.elements).toStrictEqual(source);
        expect(navigator.elements).not.toBe(source);
    });

    it('emits an event when setting the list of elements', () => {
        const navigator = new ListNavigator();
        const callback = jest.fn();

        navigator.on('setelements', callback);
        navigator.setElements(source);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('emits selection events when setting the list of elements', () => {
        const navigator = new ListNavigator();
        let selectedIndex = 1;
        let deselectedIndex = 1;
        const enter = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(selectedIndex);
        });
        const leave = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(deselectedIndex);
        });

        navigator.on('enter', enter);
        navigator.on('leave', leave);

        navigator.setElements(source); // no selection

        navigator.select(1); // enter

        navigator.setElements(source); // leave + enter

        navigator.setElements([]); // leave

        expect(enter).toHaveBeenCalledTimes(2);
        expect(leave).toHaveBeenCalledTimes(2);
    });

    it('adjusts the selection when setting the list of elements', () => {
        const navigator = new ListNavigator(source);

        navigator.select(2);

        expect(navigator.selectedIndex).toBe(2);

        navigator.setElements(source.slice(0, 2));

        expect(navigator.selectedIndex).toBe(1);
        expect(navigator.selected).toBe(source[1]);

        navigator.setElements([]);

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();
    });

    it('can select an element', () => {
        const navigator = new ListNavigator(source);

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();

        expect(navigator.select(1)).toBe(navigator);

        expect(navigator.selectedIndex).toBe(1);
        expect(navigator.selected).toBe(source[1]);
    });

    it('can selected another element', () => {
        const navigator = new ListNavigator(source);

        navigator.select(1);
        navigator.select(3);

        expect(navigator.selectedIndex).toBe(3);
        expect(navigator.selected).toBe(source[3]);
    });

    it('can deselect an element', () => {
        const navigator = new ListNavigator(source);

        navigator.select(1);
        navigator.select(-1);

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();
    });

    it('cannot select an element outside of the boundaries', () => {
        const navigator = new ListNavigator(source);

        navigator.select(10);

        expect(navigator.selectedIndex).toBe(3);
        expect(navigator.selected).toBe(source[3]);

        navigator.select(-10);

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();
    });

    it('emits events when selecting an element', () => {
        const navigator = new ListNavigator(source);
        let selectedIndex = 1;
        let deselectedIndex = 1;
        const enter = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(selectedIndex);
        });
        const leave = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(deselectedIndex);
        });

        navigator.on('enter', enter);
        navigator.on('leave', leave);

        navigator.select(selectedIndex); // enter

        selectedIndex = 2;
        navigator.select(selectedIndex); // leave + enter

        deselectedIndex = 2;
        navigator.select(-1); // leave

        expect(enter).toHaveBeenCalledTimes(2);
        expect(leave).toHaveBeenCalledTimes(2);
    });

    it('does not select again a selected element', () => {
        const navigator = new ListNavigator(source);
        const selectedIndex = 1;
        const callback = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(selectedIndex);
        });

        navigator.on('enter', callback);

        navigator.select(selectedIndex);
        navigator.select(selectedIndex);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can select the next element', () => {
        const navigator = new ListNavigator(source);

        navigator.selectNext();

        expect(navigator.selectedIndex).toBe(0);
        expect(navigator.selected).toBe(source[0]);

        navigator.selectNext();

        expect(navigator.selectedIndex).toBe(1);
        expect(navigator.selected).toBe(source[1]);

        navigator.select(3);
        navigator.selectNext();

        expect(navigator.selectedIndex).toBe(0);
        expect(navigator.selected).toBe(source[0]);
    });

    it('can focus the previous element', () => {
        const navigator = new ListNavigator(source);

        navigator.selectPrevious();

        expect(navigator.selectedIndex).toBe(3);
        expect(navigator.selected).toBe(source[3]);

        navigator.selectPrevious();

        expect(navigator.selectedIndex).toBe(2);
        expect(navigator.selected).toBe(source[2]);

        navigator.select(0);
        navigator.selectPrevious();

        expect(navigator.selectedIndex).toBe(3);
        expect(navigator.selected).toBe(source[3]);
    });
});
