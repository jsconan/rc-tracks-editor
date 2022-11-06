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
import { KeyNavigator } from '../KeyNavigator.js';

describe('KeyNavigator', () => {
    it('is a class', () => {
        expect(KeyNavigator).toEqual(expect.any(Function));
    });

    it('is an event emitter', () => {
        expect(eventEmitterMixin.isEventEmitter(new KeyNavigator())).toBeTruthy();
    });

    it('has a mode', () => {
        expect(new KeyNavigator().mode).toBe(KeyNavigator.MODE_BOTH);
        expect(new KeyNavigator(KeyNavigator.MODE_HORIZONTAL).mode).toBe(KeyNavigator.MODE_HORIZONTAL);
    });

    it('sets the mode', () => {
        const navigator = new KeyNavigator();
        expect(navigator.mode).toBe(KeyNavigator.MODE_BOTH);

        navigator.mode = 'foo';
        expect(navigator.mode).toBe(KeyNavigator.MODE_BOTH);

        navigator.mode = KeyNavigator.MODE_HORIZONTAL;
        expect(navigator.mode).toBe(KeyNavigator.MODE_HORIZONTAL);
    });

    it.each([
        ['Up', KeyNavigator.MODE_HORIZONTAL],
        ['ArrowUp', KeyNavigator.MODE_HORIZONTAL],
        ['Down', KeyNavigator.MODE_HORIZONTAL],
        ['ArrowDown', KeyNavigator.MODE_HORIZONTAL],
        ['Left', KeyNavigator.MODE_HORIZONTAL],
        ['ArrowLeft', KeyNavigator.MODE_HORIZONTAL],
        ['Right', KeyNavigator.MODE_HORIZONTAL],
        ['ArrowRight', KeyNavigator.MODE_HORIZONTAL],
        [' ', KeyNavigator.MODE_HORIZONTAL],
        ['Spacebar', KeyNavigator.MODE_HORIZONTAL],
        ['Enter', KeyNavigator.MODE_HORIZONTAL],
        ['Esc', KeyNavigator.MODE_HORIZONTAL],
        ['Escape', KeyNavigator.MODE_HORIZONTAL],
        ['Del', KeyNavigator.MODE_HORIZONTAL],
        ['Delete', KeyNavigator.MODE_HORIZONTAL],
        ['Backspace', KeyNavigator.MODE_HORIZONTAL],
        ['Insert', KeyNavigator.MODE_HORIZONTAL],
        ['A', KeyNavigator.MODE_HORIZONTAL],

        ['Up', KeyNavigator.MODE_VERTICAL],
        ['ArrowUp', KeyNavigator.MODE_VERTICAL],
        ['Down', KeyNavigator.MODE_VERTICAL],
        ['ArrowDown', KeyNavigator.MODE_VERTICAL],
        ['Left', KeyNavigator.MODE_VERTICAL],
        ['ArrowLeft', KeyNavigator.MODE_VERTICAL],
        ['Right', KeyNavigator.MODE_VERTICAL],
        ['ArrowRight', KeyNavigator.MODE_VERTICAL],
        [' ', KeyNavigator.MODE_VERTICAL],
        ['Spacebar', KeyNavigator.MODE_VERTICAL],
        ['Enter', KeyNavigator.MODE_VERTICAL],
        ['Esc', KeyNavigator.MODE_VERTICAL],
        ['Escape', KeyNavigator.MODE_VERTICAL],
        ['Del', KeyNavigator.MODE_VERTICAL],
        ['Delete', KeyNavigator.MODE_VERTICAL],
        ['Backspace', KeyNavigator.MODE_VERTICAL],
        ['Insert', KeyNavigator.MODE_VERTICAL],
        ['A', KeyNavigator.MODE_VERTICAL],

        ['Up', KeyNavigator.MODE_BOTH],
        ['ArrowUp', KeyNavigator.MODE_BOTH],
        ['Down', KeyNavigator.MODE_BOTH],
        ['ArrowDown', KeyNavigator.MODE_BOTH],
        ['Left', KeyNavigator.MODE_BOTH],
        ['ArrowLeft', KeyNavigator.MODE_BOTH],
        ['Right', KeyNavigator.MODE_BOTH],
        ['ArrowRight', KeyNavigator.MODE_BOTH],
        [' ', KeyNavigator.MODE_BOTH],
        ['Spacebar', KeyNavigator.MODE_BOTH],
        ['Enter', KeyNavigator.MODE_BOTH],
        ['Esc', KeyNavigator.MODE_BOTH],
        ['Escape', KeyNavigator.MODE_BOTH],
        ['Del', KeyNavigator.MODE_BOTH],
        ['Delete', KeyNavigator.MODE_BOTH],
        ['Backspace', KeyNavigator.MODE_BOTH],
        ['Insert', KeyNavigator.MODE_BOTH],
        ['A', KeyNavigator.MODE_BOTH]
    ])('identifies the keystroke from the key "%s" when being in mode "%s"', (key, mode) => {
        const navigator = new KeyNavigator(mode);
        expect(navigator.identify(key)).toMatchSnapshot();
    });

    it.each([
        ['Left', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_LEFT],
        ['ArrowLeft', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_LEFT],
        ['Right', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_RIGHT],
        ['ArrowRight', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_RIGHT],
        [' ', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Spacebar', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Enter', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_ENTER],
        ['Esc', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Escape', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Del', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Delete', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Backspace', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_BACKSPACE],

        ['Up', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_UP],
        ['ArrowUp', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_UP],
        ['Down', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_DOWN],
        ['ArrowDown', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_DOWN],
        [' ', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Spacebar', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Enter', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_ENTER],
        ['Esc', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Escape', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Del', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Delete', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Backspace', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_BACKSPACE],

        ['Up', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_UP],
        ['ArrowUp', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_UP],
        ['Down', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_DOWN],
        ['ArrowDown', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_DOWN],
        ['Left', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_LEFT],
        ['ArrowLeft', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_LEFT],
        ['Right', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_RIGHT],
        ['ArrowRight', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_RIGHT],
        [' ', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Spacebar', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Enter', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_ENTER],
        ['Esc', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Escape', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Del', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Delete', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Backspace', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_BACKSPACE]
    ])('processes the keystroke from the key "%s" when being in mode "%s"', (key, mode, action, keystroke) => {
        const navigator = new KeyNavigator(mode);
        const actionEvent = jest.fn().mockImplementation((eventAction, eventKeystroke, eventKey) => {
            expect(eventAction).toBe(action);
            expect(eventKeystroke).toBe(keystroke);
            expect(eventKey).toBe(key);
        });
        const contextEvent = jest.fn().mockImplementation((eventKeystroke, eventKey) => {
            expect(eventKeystroke).toBe(keystroke);
            expect(eventKey).toBe(key);
        });

        navigator.on('action', actionEvent);
        navigator.on(action, contextEvent);

        expect(navigator.process(key)).toBeTruthy();

        expect(actionEvent).toHaveBeenCalledTimes(1);
        expect(contextEvent).toHaveBeenCalledTimes(1);
    });

    it.each([
        ['Up', KeyNavigator.MODE_HORIZONTAL],
        ['ArrowUp', KeyNavigator.MODE_HORIZONTAL],
        ['Down', KeyNavigator.MODE_HORIZONTAL],
        ['ArrowDown', KeyNavigator.MODE_HORIZONTAL],
        ['Insert', KeyNavigator.MODE_HORIZONTAL],
        ['A', KeyNavigator.MODE_HORIZONTAL],

        ['Left', KeyNavigator.MODE_VERTICAL],
        ['ArrowLeft', KeyNavigator.MODE_VERTICAL],
        ['Right', KeyNavigator.MODE_VERTICAL],
        ['ArrowRight', KeyNavigator.MODE_VERTICAL],
        ['Insert', KeyNavigator.MODE_VERTICAL],
        ['A', KeyNavigator.MODE_VERTICAL],

        ['Insert', KeyNavigator.MODE_BOTH],
        ['A', KeyNavigator.MODE_BOTH]
    ])('does not processes the keystroke from the key "%s" when being in mode "%s"', (key, mode) => {
        const navigator = new KeyNavigator(mode);
        const actionEvent = jest.fn();
        const contextEvent = jest.fn();

        navigator.on('action', actionEvent);

        expect(navigator.process(key)).toBeFalsy();

        expect(actionEvent).not.toHaveBeenCalled();
        expect(contextEvent).not.toHaveBeenCalled();
    });

    it.each([
        ['Left', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_LEFT],
        ['ArrowLeft', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_LEFT],
        ['Right', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_RIGHT],
        ['ArrowRight', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_RIGHT],
        [' ', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Spacebar', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Enter', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_ENTER],
        ['Esc', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Escape', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Del', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Delete', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Backspace', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_BACKSPACE],

        ['Up', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_UP],
        ['ArrowUp', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_UP],
        ['Down', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_DOWN],
        ['ArrowDown', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_DOWN],
        [' ', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Spacebar', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Enter', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_ENTER],
        ['Esc', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Escape', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Del', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Delete', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Backspace', KeyNavigator.MODE_VERTICAL, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_BACKSPACE],

        ['Up', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_UP],
        ['ArrowUp', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_UP],
        ['Down', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_DOWN],
        ['ArrowDown', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_DOWN],
        ['Left', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_LEFT],
        ['ArrowLeft', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_LEFT],
        ['Right', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_RIGHT],
        ['ArrowRight', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_RIGHT],
        [' ', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Spacebar', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Enter', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_ENTER],
        ['Esc', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Escape', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Del', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Delete', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Backspace', KeyNavigator.MODE_BOTH, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_BACKSPACE]
    ])('processes the keyboard event from the key "%s" when being in mode "%s"', (key, mode, action, keystroke) => {
        const navigator = new KeyNavigator(mode);
        const actionEvent = jest.fn().mockImplementation((eventAction, eventKeystroke, eventKey) => {
            expect(eventAction).toBe(action);
            expect(eventKeystroke).toBe(keystroke);
            expect(eventKey).toBe(key);
        });
        const contextEvent = jest.fn().mockImplementation((eventKeystroke, eventKey) => {
            expect(eventKeystroke).toBe(keystroke);
            expect(eventKey).toBe(key);
        });
        const preventDefault = jest.fn();

        navigator.on('action', actionEvent);
        navigator.on(action, contextEvent);

        const event = { key, preventDefault };
        expect(navigator.processEvent(event)).toBeTruthy();

        expect(actionEvent).toHaveBeenCalledTimes(1);
        expect(contextEvent).toHaveBeenCalledTimes(1);
        expect(preventDefault).toHaveBeenCalledTimes(1);
    });

    it.each([
        ['Up', KeyNavigator.MODE_HORIZONTAL],
        ['ArrowUp', KeyNavigator.MODE_HORIZONTAL],
        ['Down', KeyNavigator.MODE_HORIZONTAL],
        ['ArrowDown', KeyNavigator.MODE_HORIZONTAL],
        ['Insert', KeyNavigator.MODE_HORIZONTAL],
        ['A', KeyNavigator.MODE_HORIZONTAL],

        ['Left', KeyNavigator.MODE_VERTICAL],
        ['ArrowLeft', KeyNavigator.MODE_VERTICAL],
        ['Right', KeyNavigator.MODE_VERTICAL],
        ['ArrowRight', KeyNavigator.MODE_VERTICAL],
        ['Insert', KeyNavigator.MODE_VERTICAL],
        ['A', KeyNavigator.MODE_VERTICAL],

        ['Insert', KeyNavigator.MODE_BOTH],
        ['A', KeyNavigator.MODE_BOTH]
    ])('does not processes the keyboard event from the key "%s" when being in mode "%s"', (key, mode) => {
        const navigator = new KeyNavigator(mode);
        const actionEvent = jest.fn();
        const contextEvent = jest.fn();

        navigator.on('action', actionEvent);

        expect(navigator.processEvent({ key })).toBeFalsy();

        expect(actionEvent).not.toHaveBeenCalled();
        expect(contextEvent).not.toHaveBeenCalled();
    });

    describe('has a static method which', () => {
        it.each([
            'Up',
            'ArrowUp',
            'Down',
            'ArrowDown',
            'Left',
            'ArrowLeft',
            'Right',
            'ArrowRight',
            ' ',
            'Spacebar',
            'Enter',
            'Esc',
            'Escape',
            'Del',
            'Delete',
            'Backspace',
            'Insert',
            'A'
        ])('identifies the keystroke from the key "%s"', key => {
            expect(KeyNavigator.identify(key)).toMatchSnapshot();
        });

        it.each([
            ['Up', KeyNavigator.KEYSTROKE_UP],
            ['ArrowUp', KeyNavigator.KEYSTROKE_UP],
            ['Down', KeyNavigator.KEYSTROKE_DOWN],
            ['ArrowDown', KeyNavigator.KEYSTROKE_DOWN],
            ['Left', KeyNavigator.KEYSTROKE_LEFT],
            ['ArrowLeft', KeyNavigator.KEYSTROKE_LEFT],
            ['Right', KeyNavigator.KEYSTROKE_RIGHT],
            ['ArrowRight', KeyNavigator.KEYSTROKE_RIGHT],
            [' ', KeyNavigator.KEYSTROKE_SPACEBAR],
            ['Spacebar', KeyNavigator.KEYSTROKE_SPACEBAR],
            ['Enter', KeyNavigator.KEYSTROKE_ENTER],
            ['Esc', KeyNavigator.KEYSTROKE_ESCAPE],
            ['Escape', KeyNavigator.KEYSTROKE_ESCAPE],
            ['Del', KeyNavigator.KEYSTROKE_DELETE],
            ['Delete', KeyNavigator.KEYSTROKE_DELETE],
            ['Backspace', KeyNavigator.KEYSTROKE_BACKSPACE],
            ['Insert', void 0],
            ['A', void 0]
        ])('gets the keystroke for the key "%s"', (key, keystroke) => {
            expect(KeyNavigator.key(key)).toBe(keystroke);
        });

        it('tells if a key is the "up" keystroke', () => {
            expect(KeyNavigator.keyUp('Down')).toBeFalsy();
            expect(KeyNavigator.keyUp('Up')).toBeTruthy();
            expect(KeyNavigator.keyUp('ArrowUp')).toBeTruthy();
        });

        it('tells if a key is the "down" keystroke', () => {
            expect(KeyNavigator.keyDown('Up')).toBeFalsy();
            expect(KeyNavigator.keyDown('Down')).toBeTruthy();
            expect(KeyNavigator.keyDown('ArrowDown')).toBeTruthy();
        });

        it('tells if a key is the "left" keystroke', () => {
            expect(KeyNavigator.keyLeft('Right')).toBeFalsy();
            expect(KeyNavigator.keyLeft('Left')).toBeTruthy();
            expect(KeyNavigator.keyLeft('ArrowLeft')).toBeTruthy();
        });

        it('tells if a key is the "right" keystroke', () => {
            expect(KeyNavigator.keyRight('Left')).toBeFalsy();
            expect(KeyNavigator.keyRight('Right')).toBeTruthy();
            expect(KeyNavigator.keyRight('ArrowRight')).toBeTruthy();
        });

        it('tells if a key is the "spacebar" keystroke', () => {
            expect(KeyNavigator.keySpacebar('Enter')).toBeFalsy();
            expect(KeyNavigator.keySpacebar(' ')).toBeTruthy();
            expect(KeyNavigator.keySpacebar('Spacebar')).toBeTruthy();
        });

        it('tells if a key is the "enter" keystroke', () => {
            expect(KeyNavigator.keyEnter('Spacebar')).toBeFalsy();
            expect(KeyNavigator.keyEnter('Enter')).toBeTruthy();
        });

        it('tells if a key is the "escape" keystroke', () => {
            expect(KeyNavigator.keyEscape('Enter')).toBeFalsy();
            expect(KeyNavigator.keyEscape('Esc')).toBeTruthy();
            expect(KeyNavigator.keyEscape('Escape')).toBeTruthy();
        });

        it('tells if a key is the "delete" keystroke', () => {
            expect(KeyNavigator.keyDelete('Backspace')).toBeFalsy();
            expect(KeyNavigator.keyDelete('Del')).toBeTruthy();
            expect(KeyNavigator.keyDelete('Delete')).toBeTruthy();
        });

        it('tells if a key is the "backspace" keystroke', () => {
            expect(KeyNavigator.keyBackspace('Delete')).toBeFalsy();
            expect(KeyNavigator.keyBackspace('Backspace')).toBeTruthy();
        });
    });
});
