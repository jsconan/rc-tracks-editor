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

import { eventEmitterMixin } from '../../mixins';
import { ListNavigator } from '../ListNavigator.js';

const source = [{ name: 'Bob' }, { name: 'Alice' }, { name: 'Foo' }, { name: 'Bar' }];

describe('ListNavigator', () => {
    it('is a class', () => {
        expect(ListNavigator).toEqual(expect.any(Function));
    });

    it('is an event emitter', () => {
        expect(eventEmitterMixin.isEventEmitter(new ListNavigator())).toBeTruthy();
    });

    it('can be initialized with a source', () => {
        expect(new ListNavigator().elements).toEqual([]);
        expect(new ListNavigator(source).elements).toStrictEqual(source);
    });

    it('has a length', () => {
        expect(new ListNavigator().length).toBe(0);
        expect(new ListNavigator(source).length).toBe(source.length);
    });

    it('has a default selected index', () => {
        expect(new ListNavigator().defaultSelectedIndex).toBe(-1);

        const navigator = new ListNavigator(source);

        expect(navigator.defaultSelectedIndex).toBe(-1);

        navigator.defaultSelectedIndex = 2;
        expect(navigator.defaultSelectedIndex).toBe(2);

        navigator.defaultSelectedIndex = -2;
        expect(navigator.defaultSelectedIndex).toBe(-1);

        navigator.defaultSelectedIndex = 4;
        expect(navigator.defaultSelectedIndex).toBe(3);
    });

    it('has a default selected element', () => {
        expect(new ListNavigator().defaultSelected).toBeNull();

        const navigator = new ListNavigator(source);

        expect(navigator.defaultSelected).toBeNull();

        navigator.defaultSelected = source[2];
        expect(navigator.defaultSelected).toBe(source[2]);

        navigator.defaultSelected = null;
        expect(navigator.defaultSelected).toBeNull();

        navigator.defaultSelected = { name: '' };
        expect(navigator.defaultSelected).toBeNull();
    });

    it('has a selected index', () => {
        expect(new ListNavigator().selectedIndex).toBe(-1);

        const navigator = new ListNavigator(source);

        expect(navigator.selectedIndex).toBe(-1);

        navigator.selectedIndex = 1;
        expect(navigator.selectedIndex).toBe(1);

        navigator.selectedIndex = -2;
        expect(navigator.selectedIndex).toBe(-1);

        navigator.selectedIndex = 4;
        expect(navigator.selectedIndex).toBe(3);
    });

    it('has a selected element', () => {
        expect(new ListNavigator().selected).toBeNull();

        const navigator = new ListNavigator(source);

        expect(navigator.selected).toBeNull();

        navigator.selectedIndex = 1;
        expect(navigator.selected).toBe(source[1]);

        navigator.selectedIndex = -2;
        expect(navigator.selected).toBeNull();

        navigator.selectedIndex = 4;
        expect(navigator.selected).toBe(source[3]);
    });

    it('has a list of elements', () => {
        const navigator = new ListNavigator();

        expect(navigator.elements).toStrictEqual([]);

        navigator.elements = source;
        expect(navigator.elements).toStrictEqual(source);
        expect(navigator.elements).not.toBe(source);
    });

    it('emits an event when setting the list of elements', () => {
        const navigator = new ListNavigator();
        const callback = jest.fn();

        navigator.on('setelements', callback);
        navigator.elements = source;

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

        navigator.elements = source; // no selection

        navigator.selectedIndex = 1; // enter

        navigator.elements = source; // leave + enter

        navigator.elements = []; // leave

        expect(enter).toHaveBeenCalledTimes(2);
        expect(leave).toHaveBeenCalledTimes(2);
    });

    it('adjusts the selection when setting the list of elements', () => {
        const navigator = new ListNavigator(source);

        navigator.selectedIndex = 2;

        expect(navigator.selectedIndex).toBe(2);

        navigator.elements = source.slice(0, 2);

        expect(navigator.selectedIndex).toBe(1);
        expect(navigator.selected).toBe(source[1]);

        navigator.elements = [];

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();
    });

    it('searches for the index of an element', () => {
        const navigator = new ListNavigator(source);

        expect(navigator.indexOf({})).toBe(-1);
        expect(navigator.indexOf(source[1])).toBe(1);
    });

    it('searches for the index of an element using a predicate', () => {
        const navigator = new ListNavigator(source);

        expect(navigator.findIndex(() => false)).toBe(-1);
        expect(navigator.findIndex(element => element.name === 'Alice')).toBe(1);
        expect(() => navigator.findIndex()).toThrow();
    });

    it('selects an element by its value', () => {
        const navigator = new ListNavigator(source);

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();

        navigator.selected = source[1];

        expect(navigator.selectedIndex).toBe(1);
        expect(navigator.selected).toBe(source[1]);
    });

    it('deselects an element by setting null', () => {
        const navigator = new ListNavigator(source);

        navigator.selected = source[1];
        navigator.selected = null;

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();
    });

    it('emits events when selecting an element by its value', () => {
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

        navigator.selected = source[selectedIndex]; // enter

        selectedIndex = 2;
        navigator.selected = source[selectedIndex]; // leave + enter

        deselectedIndex = 2;
        navigator.selected = null; // leave

        expect(enter).toHaveBeenCalledTimes(2);
        expect(leave).toHaveBeenCalledTimes(2);
    });

    it('selects an element by its index', () => {
        const navigator = new ListNavigator(source);

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();

        navigator.selectedIndex = 1;

        expect(navigator.selectedIndex).toBe(1);
        expect(navigator.selected).toBe(source[1]);

        navigator.selectedIndex = 3;

        expect(navigator.selectedIndex).toBe(3);
        expect(navigator.selected).toBe(source[3]);
    });

    it('deselects an element by setting the index to -1', () => {
        const navigator = new ListNavigator(source);

        navigator.selectedIndex = 1;
        navigator.selectedIndex = -1;

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();
    });

    it('cannot select an element by an index outside of the boundaries', () => {
        const navigator = new ListNavigator(source);

        navigator.selectedIndex = 10;

        expect(navigator.selectedIndex).toBe(3);
        expect(navigator.selected).toBe(source[3]);

        navigator.selectedIndex = -10;

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();
    });

    it('emits events when selecting an element by its index', () => {
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

        navigator.selectedIndex = selectedIndex; // enter

        selectedIndex = 2;
        navigator.selectedIndex = selectedIndex; // leave + enter

        deselectedIndex = 2;
        navigator.selectedIndex = -1; // leave

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

        navigator.selectedIndex = selectedIndex;
        navigator.selectedIndex = selectedIndex;
        navigator.selected = source[selectedIndex];

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('selects the default element', () => {
        const navigator = new ListNavigator(source);

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();

        expect(navigator.select()).toBe(navigator);

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();

        navigator.defaultSelectedIndex = 1;

        navigator.select();

        expect(navigator.selectedIndex).toBe(1);
        expect(navigator.selected).toBe(source[1]);
    });

    it('selects the next element', () => {
        const navigator = new ListNavigator(source);

        expect(navigator.next()).toBe(navigator);

        expect(navigator.selectedIndex).toBe(0);
        expect(navigator.selected).toBe(source[0]);

        navigator.next();

        expect(navigator.selectedIndex).toBe(1);
        expect(navigator.selected).toBe(source[1]);

        navigator.selectedIndex = 3;
        navigator.next();

        expect(navigator.selectedIndex).toBe(0);
        expect(navigator.selected).toBe(source[0]);
    });

    it('selects the previous element', () => {
        const navigator = new ListNavigator(source);

        expect(navigator.previous()).toBe(navigator);

        expect(navigator.selectedIndex).toBe(3);
        expect(navigator.selected).toBe(source[3]);

        navigator.previous();

        expect(navigator.selectedIndex).toBe(2);
        expect(navigator.selected).toBe(source[2]);

        navigator.selectedIndex = 0;
        navigator.previous();

        expect(navigator.selectedIndex).toBe(3);
        expect(navigator.selected).toBe(source[3]);
    });

    it('selects the first element if none is selected when moving forward and no default is set', () => {
        const navigator = new ListNavigator(source);

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();

        navigator.next();

        expect(navigator.selectedIndex).toBe(0);
        expect(navigator.selected).toBe(source[0]);
    });

    it('selects the default element if none is selected when moving forward', () => {
        const navigator = new ListNavigator(source);

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();

        navigator.defaultSelectedIndex = 1;

        navigator.next();

        expect(navigator.selectedIndex).toBe(1);
        expect(navigator.selected).toBe(source[1]);
    });

    it('selects the last element if none is selected when moving back and no default is set', () => {
        const navigator = new ListNavigator(source);

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();

        navigator.previous();

        expect(navigator.selectedIndex).toBe(3);
        expect(navigator.selected).toBe(source[3]);
    });

    it('selects the default element if none is selected when moving back', () => {
        const navigator = new ListNavigator(source);

        expect(navigator.selectedIndex).toBe(-1);
        expect(navigator.selected).toBeNull();

        navigator.defaultSelectedIndex = 1;

        navigator.previous();

        expect(navigator.selectedIndex).toBe(1);
        expect(navigator.selected).toBe(source[1]);
    });
});
