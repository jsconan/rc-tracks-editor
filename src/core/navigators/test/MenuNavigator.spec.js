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

import { MenuNavigator } from '../MenuNavigator.js';

const source = [{ name: 'Bob' }, { name: 'Alice' }, { name: 'Foo' }, { name: 'Bar' }];

describe('MenuNavigator', () => {
    it('is a class', () => {
        expect(MenuNavigator).toEqual(expect.any(Function));
    });

    it('can be initialized with a source', () => {
        expect(new MenuNavigator().elements).toEqual([]);
        expect(new MenuNavigator(source).elements).toStrictEqual(source);
    });

    it('has a length', () => {
        expect(new MenuNavigator().length).toBe(0);
        expect(new MenuNavigator(source).length).toBe(source.length);
    });

    it('has a default focused index', () => {
        expect(new MenuNavigator().defaultFocusedIndex).toBe(-1);

        const navigator = new MenuNavigator(source);

        expect(navigator.defaultFocusedIndex).toBe(-1);

        navigator.defaultFocusedIndex = 2;
        expect(navigator.defaultFocusedIndex).toBe(2);

        navigator.defaultFocusedIndex = -2;
        expect(navigator.defaultFocusedIndex).toBe(-1);

        navigator.defaultFocusedIndex = 4;
        expect(navigator.defaultFocusedIndex).toBe(3);
    });

    it('has a default focused element', () => {
        expect(new MenuNavigator().defaultFocused).toBeNull();

        const navigator = new MenuNavigator(source);

        expect(navigator.defaultFocused).toBeNull();

        navigator.defaultFocused = source[2];
        expect(navigator.defaultFocused).toBe(source[2]);

        navigator.defaultFocused = null;
        expect(navigator.defaultFocused).toBeNull();

        navigator.defaultFocused = { name: '' };
        expect(navigator.defaultFocused).toBeNull();
    });

    it('has a focused index', () => {
        expect(new MenuNavigator().focusedIndex).toBe(-1);

        const navigator = new MenuNavigator(source);

        expect(navigator.focusedIndex).toBe(-1);

        navigator.focusedIndex = 1;
        expect(navigator.focusedIndex).toBe(1);

        navigator.focusedIndex = -2;
        expect(navigator.focusedIndex).toBe(-1);

        navigator.focusedIndex = 4;
        expect(navigator.focusedIndex).toBe(3);
    });

    it('has a focused element', () => {
        expect(new MenuNavigator().focused).toBeNull();

        const navigator = new MenuNavigator(source);

        expect(navigator.focused).toBeNull();

        navigator.focusedIndex = 1;
        expect(navigator.focused).toBe(source[1]);

        navigator.focusedIndex = -2;
        expect(navigator.focused).toBeNull();

        navigator.focusedIndex = 4;
        expect(navigator.focused).toBe(source[3]);
    });

    it('has an hovered index', () => {
        expect(new MenuNavigator().hoveredIndex).toBe(-1);

        const navigator = new MenuNavigator(source);

        expect(navigator.hoveredIndex).toBe(-1);

        navigator.hoveredIndex = 1;
        expect(navigator.hoveredIndex).toBe(1);

        navigator.hoveredIndex = -2;
        expect(navigator.hoveredIndex).toBe(-1);

        navigator.hoveredIndex = 4;
        expect(navigator.hoveredIndex).toBe(3);
    });

    it('has an hovered element', () => {
        expect(new MenuNavigator().hovered).toBeNull();

        const navigator = new MenuNavigator(source);

        expect(navigator.hovered).toBeNull();

        navigator.hoveredIndex = 1;
        expect(navigator.hovered).toBe(source[1]);

        navigator.hoveredIndex = -2;
        expect(navigator.hovered).toBeNull();

        navigator.hoveredIndex = 4;
        expect(navigator.hovered).toBe(source[3]);
    });

    it('has a list of elements', () => {
        const navigator = new MenuNavigator();

        expect(navigator.elements).toStrictEqual([]);

        navigator.elements = source;
        expect(navigator.elements).toStrictEqual(source);
        expect(navigator.elements).not.toBe(source);
    });

    it('emits an event when setting the list of elements', () => {
        const navigator = new MenuNavigator();
        const callback = jest.fn();

        navigator.on('setelements', callback);
        navigator.elements = source;

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('emits selection events when setting the list of elements', () => {
        const navigator = new MenuNavigator();
        let focusedIndex = 1;
        let blurredIndex = 1;
        let enteredIndex = 1;
        let leftIndex = 1;
        const focus = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(focusedIndex);
        });
        const blur = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(blurredIndex);
        });
        const enter = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(enteredIndex);
        });
        const leave = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(leftIndex);
        });

        navigator.on('focus', focus);
        navigator.on('blur', blur);
        navigator.on('enter', enter);
        navigator.on('leave', leave);

        navigator.elements = source; // no selection

        navigator.focusedIndex = 1; // focus
        navigator.hoveredIndex = 1; // enter

        navigator.elements = source; // blur + leave + focus + enter

        navigator.elements = []; // blur + leave

        expect(focus).toHaveBeenCalledTimes(2);
        expect(blur).toHaveBeenCalledTimes(2);
        expect(enter).toHaveBeenCalledTimes(2);
        expect(leave).toHaveBeenCalledTimes(2);
    });

    it('adjusts the selection when setting the list of elements', () => {
        const navigator = new MenuNavigator(source);

        navigator.focusedIndex = 1;
        navigator.hoveredIndex = 2;

        expect(navigator.focusedIndex).toBe(1);
        expect(navigator.hoveredIndex).toBe(2);

        navigator.elements = source.slice(0, 2);

        expect(navigator.focusedIndex).toBe(1);
        expect(navigator.hoveredIndex).toBe(1);

        expect(navigator.focused).toBe(source[1]);
        expect(navigator.hovered).toBe(source[1]);

        navigator.elements = [];

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.hoveredIndex).toBe(-1);

        expect(navigator.focused).toBeNull();
        expect(navigator.hovered).toBeNull();
    });

    it('selects the focused element by its value', () => {
        const navigator = new MenuNavigator(source);

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();

        navigator.focused = source[1];

        expect(navigator.focusedIndex).toBe(1);
        expect(navigator.focused).toBe(source[1]);
    });

    it('deselects the focused element by setting null', () => {
        const navigator = new MenuNavigator(source);

        navigator.focused = source[1];
        navigator.focused = null;

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();
    });

    it('emits events when focusing an element by its value', () => {
        const navigator = new MenuNavigator(source);
        let focusedIndex = 1;
        let blurredIndex = 1;
        const focus = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(focusedIndex);
        });
        const blur = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(blurredIndex);
        });

        navigator.on('focus', focus);
        navigator.on('blur', blur);

        navigator.focused = source[focusedIndex]; // focus

        focusedIndex = 2;
        navigator.focused = source[focusedIndex]; // blur + focus

        blurredIndex = 2;
        navigator.focused = null; // blur

        expect(focus).toHaveBeenCalledTimes(2);
        expect(blur).toHaveBeenCalledTimes(2);
    });

    it('selects the focused element by its index', () => {
        const navigator = new MenuNavigator(source);

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();

        navigator.focusedIndex = 1;

        expect(navigator.focusedIndex).toBe(1);
        expect(navigator.focused).toBe(source[1]);

        navigator.focusedIndex = 3;

        expect(navigator.focusedIndex).toBe(3);
        expect(navigator.focused).toBe(source[3]);
    });

    it('deselects the focused element by setting the index to -1', () => {
        const navigator = new MenuNavigator(source);

        navigator.focusedIndex = 1;
        navigator.focusedIndex = -1;

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();
    });

    it('cannot select a the focused element outside of the boundaries', () => {
        const navigator = new MenuNavigator(source);

        navigator.focusedIndex = 10;

        expect(navigator.focusedIndex).toBe(3);
        expect(navigator.focused).toBe(source[3]);

        navigator.focusedIndex = -10;

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();
    });

    it('emits events when focusing an element by its index', () => {
        const navigator = new MenuNavigator(source);
        let focusedIndex = 1;
        let blurredIndex = 1;
        const focus = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(focusedIndex);
        });
        const blur = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(blurredIndex);
        });

        navigator.on('focus', focus);
        navigator.on('blur', blur);

        navigator.focusedIndex = focusedIndex; // focus

        focusedIndex = 2;
        navigator.focusedIndex = focusedIndex; // blur + focus

        blurredIndex = 2;
        navigator.focusedIndex = -1; // blur

        expect(focus).toHaveBeenCalledTimes(2);
        expect(blur).toHaveBeenCalledTimes(2);
    });

    it('does not select again a focused element', () => {
        const navigator = new MenuNavigator(source);
        const focusedIndex = 1;
        const callback = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(focusedIndex);
        });

        navigator.on('focus', callback);

        navigator.focusedIndex = focusedIndex;
        navigator.focusedIndex = focusedIndex;
        navigator.focused = source[focusedIndex];

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('selects the hovered element by its value', () => {
        const navigator = new MenuNavigator(source);

        expect(navigator.hoveredIndex).toBe(-1);
        expect(navigator.hovered).toBeNull();

        navigator.hovered = source[1];

        expect(navigator.hoveredIndex).toBe(1);
        expect(navigator.hovered).toBe(source[1]);
    });

    it('deselects the hovered element by setting null', () => {
        const navigator = new MenuNavigator(source);

        navigator.hovered = source[1];
        navigator.hovered = null;

        expect(navigator.hoveredIndex).toBe(-1);
        expect(navigator.hovered).toBeNull();
    });

    it('emits events when hovering an element by its value', () => {
        const navigator = new MenuNavigator(source);
        let enteredIndex = 1;
        let leftIndex = 1;
        const enter = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(enteredIndex);
        });
        const leave = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(leftIndex);
        });

        navigator.on('enter', enter);
        navigator.on('leave', leave);

        navigator.hovered = source[enteredIndex]; // enter

        enteredIndex = 2;
        navigator.hovered = source[enteredIndex]; // leave + enter

        leftIndex = 2;
        navigator.hovered = null; // leave

        expect(enter).toHaveBeenCalledTimes(2);
        expect(leave).toHaveBeenCalledTimes(2);
    });

    it('selects the hovered element by its index', () => {
        const navigator = new MenuNavigator(source);

        expect(navigator.hoveredIndex).toBe(-1);
        expect(navigator.hovered).toBeNull();

        navigator.hoveredIndex = 1;

        expect(navigator.hoveredIndex).toBe(1);
        expect(navigator.hovered).toBe(source[1]);

        navigator.hoveredIndex = 3;

        expect(navigator.hoveredIndex).toBe(3);
        expect(navigator.hovered).toBe(source[3]);
    });

    it('deselects the hovered element by setting the index to -1', () => {
        const navigator = new MenuNavigator(source);

        navigator.hoveredIndex = 1;
        navigator.hoveredIndex = -1;

        expect(navigator.hoveredIndex).toBe(-1);
        expect(navigator.hovered).toBeNull();
    });

    it('cannot select a the hovered element outside of the boundaries', () => {
        const navigator = new MenuNavigator(source);

        navigator.hoveredIndex = 10;

        expect(navigator.hoveredIndex).toBe(3);
        expect(navigator.hovered).toBe(source[3]);

        navigator.hoveredIndex = -10;

        expect(navigator.hoveredIndex).toBe(-1);
        expect(navigator.hovered).toBeNull();
    });

    it('emits events when hovering an element by its index', () => {
        const navigator = new MenuNavigator(source);
        let enteredIndex = 1;
        let leftIndex = 1;
        const enter = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(enteredIndex);
        });
        const leave = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(leftIndex);
        });

        navigator.on('enter', enter);
        navigator.on('leave', leave);

        navigator.hoveredIndex = enteredIndex; // enter

        enteredIndex = 2;
        navigator.hoveredIndex = enteredIndex; // leave + enter

        leftIndex = 2;
        navigator.hoveredIndex = -1; // leave

        expect(enter).toHaveBeenCalledTimes(2);
        expect(leave).toHaveBeenCalledTimes(2);
    });

    it('does not select again an hovered element', () => {
        const navigator = new MenuNavigator(source);
        const enteredIndex = 1;
        const callback = jest.fn().mockImplementation((element, index) => {
            expect(element).toStrictEqual(source[index]);
            expect(index).toBe(enteredIndex);
        });

        navigator.on('enter', callback);

        navigator.hoveredIndex = enteredIndex;
        navigator.hoveredIndex = enteredIndex;
        navigator.hovered = source[enteredIndex];

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('hovers the focused element', () => {
        const navigator = new MenuNavigator(source);

        navigator.focusedIndex = 3;

        expect(navigator.hoverFocused()).toBe(navigator);

        expect(navigator.hoveredIndex).toBe(3);
        expect(navigator.hovered).toBe(source[3]);

        navigator.focusedIndex = -1;
        navigator.hoverFocused();

        expect(navigator.hoveredIndex).toBe(-1);
        expect(navigator.hovered).toBeNull();
    });

    it('focuses the hovered element', () => {
        const navigator = new MenuNavigator(source);

        navigator.hoveredIndex = 3;

        expect(navigator.focusHovered()).toBe(navigator);

        expect(navigator.focusedIndex).toBe(3);
        expect(navigator.focused).toBe(source[3]);

        navigator.hoveredIndex = -1;
        navigator.focusHovered();

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();
    });

    it('focuses the default element', () => {
        const navigator = new MenuNavigator(source);

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();

        expect(navigator.focus()).toBe(navigator);

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();

        navigator.defaultFocusedIndex = 1;

        navigator.focus();

        expect(navigator.focusedIndex).toBe(1);
        expect(navigator.focused).toBe(source[1]);
    });

    it('focuses the next element', () => {
        const navigator = new MenuNavigator(source);

        expect(navigator.focusNext()).toBe(navigator);

        expect(navigator.focusedIndex).toBe(0);
        expect(navigator.focused).toBe(source[0]);

        navigator.focusNext();

        expect(navigator.focusedIndex).toBe(1);
        expect(navigator.focused).toBe(source[1]);

        navigator.focusedIndex = 3;
        navigator.focusNext();

        expect(navigator.focusedIndex).toBe(0);
        expect(navigator.focused).toBe(source[0]);
    });

    it('focuses the previous element', () => {
        const navigator = new MenuNavigator(source);

        expect(navigator.focusPrevious()).toBe(navigator);

        expect(navigator.focusedIndex).toBe(3);
        expect(navigator.focused).toBe(source[3]);

        navigator.focusPrevious();

        expect(navigator.focusedIndex).toBe(2);
        expect(navigator.focused).toBe(source[2]);

        navigator.focusedIndex = 0;
        navigator.focusPrevious();

        expect(navigator.focusedIndex).toBe(3);
        expect(navigator.focused).toBe(source[3]);
    });

    it('focuses the first element if none is focused when moving forward and no default is set', () => {
        const navigator = new MenuNavigator(source);

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();

        navigator.focusNext();

        expect(navigator.focusedIndex).toBe(0);
        expect(navigator.focused).toBe(source[0]);
    });

    it('focuses the default element if none is focused when moving forward', () => {
        const navigator = new MenuNavigator(source);

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();

        navigator.defaultFocusedIndex = 1;

        navigator.focusNext();

        expect(navigator.focusedIndex).toBe(1);
        expect(navigator.focused).toBe(source[1]);
    });

    it('focuses the last element if none is focused when moving back and no default is set', () => {
        const navigator = new MenuNavigator(source);

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();

        navigator.focusPrevious();

        expect(navigator.focusedIndex).toBe(3);
        expect(navigator.focused).toBe(source[3]);
    });

    it('focuses the default element if none is focused when moving back', () => {
        const navigator = new MenuNavigator(source);

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();

        navigator.defaultFocusedIndex = 1;

        navigator.focusPrevious();

        expect(navigator.focusedIndex).toBe(1);
        expect(navigator.focused).toBe(source[1]);
    });
});
