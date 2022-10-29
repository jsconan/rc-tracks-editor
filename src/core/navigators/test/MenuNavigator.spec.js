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

    it('can set the list of elements', () => {
        const navigator = new MenuNavigator();

        expect(navigator.setElements(source)).toBe(navigator);
        expect(navigator.elements).toStrictEqual(source);
        expect(navigator.elements).not.toBe(source);
    });

    it('emits an event when setting the list of elements', () => {
        const navigator = new MenuNavigator();
        const callback = jest.fn();

        navigator.on('setelements', callback);
        navigator.setElements(source);

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

        navigator.setElements(source); // no selection

        navigator.setFocused(1); // focus
        navigator.setHovered(1); // enter

        navigator.setElements(source); // blur + leave + focus + enter

        navigator.setElements([]); // blur + leave

        expect(focus).toHaveBeenCalledTimes(2);
        expect(blur).toHaveBeenCalledTimes(2);
        expect(enter).toHaveBeenCalledTimes(2);
        expect(leave).toHaveBeenCalledTimes(2);
    });

    it('adjusts the selection when setting the list of elements', () => {
        const navigator = new MenuNavigator(source);

        navigator.setFocused(1);
        navigator.setHovered(2);

        expect(navigator.focusedIndex).toBe(1);
        expect(navigator.hoveredIndex).toBe(2);

        navigator.setElements(source.slice(0, 2));

        expect(navigator.focusedIndex).toBe(1);
        expect(navigator.hoveredIndex).toBe(1);

        expect(navigator.focused).toBe(source[1]);
        expect(navigator.hovered).toBe(source[1]);

        navigator.setElements([]);

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.hoveredIndex).toBe(-1);

        expect(navigator.focused).toBeNull();
        expect(navigator.hovered).toBeNull();
    });

    it('can select the focused element', () => {
        const navigator = new MenuNavigator(source);

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();

        expect(navigator.setFocused(1)).toBe(navigator);

        expect(navigator.focusedIndex).toBe(1);
        expect(navigator.focused).toBe(source[1]);
    });

    it('can change the focused element', () => {
        const navigator = new MenuNavigator(source);

        navigator.setFocused(1);
        navigator.setFocused(3);

        expect(navigator.focusedIndex).toBe(3);
        expect(navigator.focused).toBe(source[3]);
    });

    it('can unselect the focused element', () => {
        const navigator = new MenuNavigator(source);

        navigator.setFocused(1);
        navigator.setFocused(-1);

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();
    });

    it('cannot select a the focused element outside of the boundaries', () => {
        const navigator = new MenuNavigator(source);

        navigator.setFocused(10);

        expect(navigator.focusedIndex).toBe(3);
        expect(navigator.focused).toBe(source[3]);

        navigator.setFocused(-10);

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();
    });

    it('emits events when focusing an element', () => {
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

        navigator.setFocused(focusedIndex); // focus

        focusedIndex = 2;
        navigator.setFocused(focusedIndex); // blur + focus

        blurredIndex = 2;
        navigator.setFocused(-1); // blur

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

        navigator.setFocused(focusedIndex);
        navigator.setFocused(focusedIndex);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can select the hovered element', () => {
        const navigator = new MenuNavigator(source);

        expect(navigator.hoveredIndex).toBe(-1);
        expect(navigator.hovered).toBeNull();

        expect(navigator.setHovered(1)).toBe(navigator);

        expect(navigator.hoveredIndex).toBe(1);
        expect(navigator.hovered).toBe(source[1]);
    });

    it('can change the hovered element', () => {
        const navigator = new MenuNavigator(source);

        navigator.setHovered(1);
        navigator.setHovered(3);

        expect(navigator.hoveredIndex).toBe(3);
        expect(navigator.hovered).toBe(source[3]);
    });

    it('can unselect the hovered element', () => {
        const navigator = new MenuNavigator(source);

        navigator.setHovered(1);
        navigator.setHovered(-1);

        expect(navigator.hoveredIndex).toBe(-1);
        expect(navigator.hovered).toBeNull();
    });

    it('cannot select a the hovered element outside of the boundaries', () => {
        const navigator = new MenuNavigator(source);

        navigator.setHovered(10);

        expect(navigator.hoveredIndex).toBe(3);
        expect(navigator.hovered).toBe(source[3]);

        navigator.setHovered(-10);

        expect(navigator.hoveredIndex).toBe(-1);
        expect(navigator.hovered).toBeNull();
    });

    it('emits events when hovering an element', () => {
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

        navigator.setHovered(enteredIndex); // enter

        enteredIndex = 2;
        navigator.setHovered(enteredIndex); // leave + enter

        leftIndex = 2;
        navigator.setHovered(-1); // leave

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

        navigator.setHovered(enteredIndex);
        navigator.setHovered(enteredIndex);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can hover the focused element', () => {
        const navigator = new MenuNavigator(source);

        navigator.setFocused(3);
        navigator.hoverFocused();

        expect(navigator.hoveredIndex).toBe(3);
        expect(navigator.hovered).toBe(source[3]);

        navigator.setFocused(-1);
        navigator.hoverFocused();

        expect(navigator.hoveredIndex).toBe(-1);
        expect(navigator.hovered).toBeNull();
    });

    it('can focus the hovered element', () => {
        const navigator = new MenuNavigator(source);

        navigator.setHovered(3);
        navigator.focusHovered();

        expect(navigator.focusedIndex).toBe(3);
        expect(navigator.focused).toBe(source[3]);

        navigator.setHovered(-1);
        navigator.focusHovered();

        expect(navigator.focusedIndex).toBe(-1);
        expect(navigator.focused).toBeNull();
    });

    it('can focus the next element', () => {
        const navigator = new MenuNavigator(source);

        navigator.focusNext();

        expect(navigator.focusedIndex).toBe(0);
        expect(navigator.focused).toBe(source[0]);

        navigator.focusNext();

        expect(navigator.focusedIndex).toBe(1);
        expect(navigator.focused).toBe(source[1]);

        navigator.setFocused(3);
        navigator.focusNext();

        expect(navigator.focusedIndex).toBe(0);
        expect(navigator.focused).toBe(source[0]);
    });

    it('can focus the previous element', () => {
        const navigator = new MenuNavigator(source);

        navigator.focusPrevious();

        expect(navigator.focusedIndex).toBe(3);
        expect(navigator.focused).toBe(source[3]);

        navigator.focusPrevious();

        expect(navigator.focusedIndex).toBe(2);
        expect(navigator.focused).toBe(source[2]);

        navigator.setFocused(0);
        navigator.focusPrevious();

        expect(navigator.focusedIndex).toBe(3);
        expect(navigator.focused).toBe(source[3]);
    });
});
