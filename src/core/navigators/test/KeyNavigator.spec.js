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

    describe.each([
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
        describe.each([KeyNavigator.MODE_HORIZONTAL, KeyNavigator.MODE_VERTICAL, KeyNavigator.MODE_BOTH])(
            'when being in mode "%s"',
            mode => {
                it.each([KeyNavigator.TYPE_CONTROL, KeyNavigator.TYPE_MOVE, void 0])(
                    'and when the allowed type is "%s"',
                    type => {
                        const navigator = new KeyNavigator(mode);
                        expect(navigator.identify(key, type)).toMatchSnapshot();
                    }
                );
            }
        );
    });

    it.each([
        [
            'Left',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_PREVIOUS,
            KeyNavigator.KEYSTROKE_LEFT
        ],
        [
            'ArrowLeft',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_PREVIOUS,
            KeyNavigator.KEYSTROKE_LEFT
        ],
        [
            'Right',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_NEXT,
            KeyNavigator.KEYSTROKE_RIGHT
        ],
        [
            'ArrowRight',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_NEXT,
            KeyNavigator.KEYSTROKE_RIGHT
        ],
        [
            ' ',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_VALIDATE,
            KeyNavigator.KEYSTROKE_SPACEBAR
        ],
        [
            'Spacebar',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_VALIDATE,
            KeyNavigator.KEYSTROKE_SPACEBAR
        ],
        [
            'Enter',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_VALIDATE,
            KeyNavigator.KEYSTROKE_ENTER
        ],
        [
            'Esc',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_CANCEL,
            KeyNavigator.KEYSTROKE_ESCAPE
        ],
        [
            'Escape',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_CANCEL,
            KeyNavigator.KEYSTROKE_ESCAPE
        ],
        [
            'Del',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_DELETE,
            KeyNavigator.KEYSTROKE_DELETE
        ],
        [
            'Delete',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_DELETE,
            KeyNavigator.KEYSTROKE_DELETE
        ],
        [
            'Backspace',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_DELETE,
            KeyNavigator.KEYSTROKE_BACKSPACE
        ],

        [
            'Up',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_PREVIOUS,
            KeyNavigator.KEYSTROKE_UP
        ],
        [
            'ArrowUp',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_PREVIOUS,
            KeyNavigator.KEYSTROKE_UP
        ],
        [
            'Down',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_NEXT,
            KeyNavigator.KEYSTROKE_DOWN
        ],
        [
            'ArrowDown',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_NEXT,
            KeyNavigator.KEYSTROKE_DOWN
        ],
        [
            ' ',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_VALIDATE,
            KeyNavigator.KEYSTROKE_SPACEBAR
        ],
        [
            'Spacebar',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_VALIDATE,
            KeyNavigator.KEYSTROKE_SPACEBAR
        ],
        [
            'Enter',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_VALIDATE,
            KeyNavigator.KEYSTROKE_ENTER
        ],
        [
            'Esc',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_CANCEL,
            KeyNavigator.KEYSTROKE_ESCAPE
        ],
        [
            'Escape',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_CANCEL,
            KeyNavigator.KEYSTROKE_ESCAPE
        ],
        [
            'Del',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_DELETE,
            KeyNavigator.KEYSTROKE_DELETE
        ],
        [
            'Delete',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_DELETE,
            KeyNavigator.KEYSTROKE_DELETE
        ],
        [
            'Backspace',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_DELETE,
            KeyNavigator.KEYSTROKE_BACKSPACE
        ],

        ['Up', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_UP],
        ['ArrowUp', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_UP],
        ['Down', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_DOWN],
        ['ArrowDown', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_DOWN],
        ['Left', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_LEFT],
        ['ArrowLeft', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_LEFT],
        ['Right', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_RIGHT],
        ['ArrowRight', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_RIGHT],
        [' ', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Spacebar', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Enter', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_ENTER],
        ['Esc', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Escape', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Del', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Delete', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Backspace', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_BACKSPACE]
    ])(
        'processes the keystroke from the key "%s" when being in mode "%s" and when the allowed type is "%s"',
        (key, mode, type, action, keystroke) => {
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

            expect(navigator.process(key, type)).toBeTruthy();

            expect(actionEvent).toHaveBeenCalledTimes(1);
            expect(contextEvent).toHaveBeenCalledTimes(1);
        }
    );

    it.each([
        ['Up', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_MOVE],
        ['ArrowUp', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_MOVE],
        ['Down', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_MOVE],
        ['ArrowDown', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_MOVE],

        ['Left', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_MOVE],
        ['ArrowLeft', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_MOVE],
        ['Right', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_MOVE],
        ['ArrowRight', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_MOVE],

        ['Up', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_CONTROL],
        ['ArrowUp', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_CONTROL],
        ['Down', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_CONTROL],
        ['ArrowDown', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_CONTROL],

        ['Left', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_CONTROL],
        ['ArrowLeft', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_CONTROL],
        ['Right', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_CONTROL],
        ['ArrowRight', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_CONTROL],

        ['Insert', KeyNavigator.MODE_HORIZONTAL, void 0],
        ['A', KeyNavigator.MODE_HORIZONTAL, void 0],

        ['Insert', KeyNavigator.MODE_VERTICAL, void 0],
        ['A', KeyNavigator.MODE_VERTICAL, void 0],

        ['Insert', KeyNavigator.MODE_BOTH, void 0],
        ['A', KeyNavigator.MODE_BOTH, void 0]
    ])(
        'does not processes the keystroke from the key "%s" when being in mode "%s" and when the allowed type is "%s"',
        (key, mode, type) => {
            const navigator = new KeyNavigator(mode);
            const actionEvent = jest.fn();
            const contextEvent = jest.fn();

            navigator.on('action', actionEvent);

            expect(navigator.process(key, type)).toBeFalsy();

            expect(actionEvent).not.toHaveBeenCalled();
            expect(contextEvent).not.toHaveBeenCalled();
        }
    );

    it.each([
        [
            'Left',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_PREVIOUS,
            KeyNavigator.KEYSTROKE_LEFT
        ],
        [
            'ArrowLeft',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_PREVIOUS,
            KeyNavigator.KEYSTROKE_LEFT
        ],
        [
            'Right',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_NEXT,
            KeyNavigator.KEYSTROKE_RIGHT
        ],
        [
            'ArrowRight',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_NEXT,
            KeyNavigator.KEYSTROKE_RIGHT
        ],
        [
            ' ',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_VALIDATE,
            KeyNavigator.KEYSTROKE_SPACEBAR
        ],
        [
            'Spacebar',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_VALIDATE,
            KeyNavigator.KEYSTROKE_SPACEBAR
        ],
        [
            'Enter',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_VALIDATE,
            KeyNavigator.KEYSTROKE_ENTER
        ],
        [
            'Esc',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_CANCEL,
            KeyNavigator.KEYSTROKE_ESCAPE
        ],
        [
            'Escape',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_CANCEL,
            KeyNavigator.KEYSTROKE_ESCAPE
        ],
        [
            'Del',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_DELETE,
            KeyNavigator.KEYSTROKE_DELETE
        ],
        [
            'Delete',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_DELETE,
            KeyNavigator.KEYSTROKE_DELETE
        ],
        [
            'Backspace',
            KeyNavigator.MODE_HORIZONTAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_DELETE,
            KeyNavigator.KEYSTROKE_BACKSPACE
        ],

        [
            'Up',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_PREVIOUS,
            KeyNavigator.KEYSTROKE_UP
        ],
        [
            'ArrowUp',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_PREVIOUS,
            KeyNavigator.KEYSTROKE_UP
        ],
        [
            'Down',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_NEXT,
            KeyNavigator.KEYSTROKE_DOWN
        ],
        [
            'ArrowDown',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_MOVE,
            KeyNavigator.ACTION_NEXT,
            KeyNavigator.KEYSTROKE_DOWN
        ],
        [
            ' ',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_VALIDATE,
            KeyNavigator.KEYSTROKE_SPACEBAR
        ],
        [
            'Spacebar',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_VALIDATE,
            KeyNavigator.KEYSTROKE_SPACEBAR
        ],
        [
            'Enter',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_VALIDATE,
            KeyNavigator.KEYSTROKE_ENTER
        ],
        [
            'Esc',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_CANCEL,
            KeyNavigator.KEYSTROKE_ESCAPE
        ],
        [
            'Escape',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_CANCEL,
            KeyNavigator.KEYSTROKE_ESCAPE
        ],
        [
            'Del',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_DELETE,
            KeyNavigator.KEYSTROKE_DELETE
        ],
        [
            'Delete',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_DELETE,
            KeyNavigator.KEYSTROKE_DELETE
        ],
        [
            'Backspace',
            KeyNavigator.MODE_VERTICAL,
            KeyNavigator.TYPE_CONTROL,
            KeyNavigator.ACTION_DELETE,
            KeyNavigator.KEYSTROKE_BACKSPACE
        ],

        ['Up', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_UP],
        ['ArrowUp', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_UP],
        ['Down', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_DOWN],
        ['ArrowDown', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_DOWN],
        ['Left', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_LEFT],
        ['ArrowLeft', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_PREVIOUS, KeyNavigator.KEYSTROKE_LEFT],
        ['Right', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_RIGHT],
        ['ArrowRight', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_NEXT, KeyNavigator.KEYSTROKE_RIGHT],
        [' ', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Spacebar', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_SPACEBAR],
        ['Enter', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_VALIDATE, KeyNavigator.KEYSTROKE_ENTER],
        ['Esc', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Escape', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_CANCEL, KeyNavigator.KEYSTROKE_ESCAPE],
        ['Del', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Delete', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_DELETE],
        ['Backspace', KeyNavigator.MODE_BOTH, void 0, KeyNavigator.ACTION_DELETE, KeyNavigator.KEYSTROKE_BACKSPACE]
    ])(
        'processes the keyboard event from the key "%s" when being in mode "%s" and when the allowed type is "%s"',
        (key, mode, type, action, keystroke) => {
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
            expect(navigator.processEvent(event, type)).toBeTruthy();

            expect(actionEvent).toHaveBeenCalledTimes(1);
            expect(contextEvent).toHaveBeenCalledTimes(1);
            expect(preventDefault).toHaveBeenCalledTimes(1);
        }
    );

    it.each([
        ['Up', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_MOVE],
        ['ArrowUp', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_MOVE],
        ['Down', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_MOVE],
        ['ArrowDown', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_MOVE],

        ['Left', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_MOVE],
        ['ArrowLeft', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_MOVE],
        ['Right', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_MOVE],
        ['ArrowRight', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_MOVE],

        ['Up', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_CONTROL],
        ['ArrowUp', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_CONTROL],
        ['Down', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_CONTROL],
        ['ArrowDown', KeyNavigator.MODE_VERTICAL, KeyNavigator.TYPE_CONTROL],

        ['Left', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_CONTROL],
        ['ArrowLeft', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_CONTROL],
        ['Right', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_CONTROL],
        ['ArrowRight', KeyNavigator.MODE_HORIZONTAL, KeyNavigator.TYPE_CONTROL],

        ['Insert', KeyNavigator.MODE_HORIZONTAL, void 0],
        ['A', KeyNavigator.MODE_HORIZONTAL, void 0],

        ['Insert', KeyNavigator.MODE_VERTICAL, void 0],
        ['A', KeyNavigator.MODE_VERTICAL, void 0],

        ['Insert', KeyNavigator.MODE_BOTH, void 0],
        ['A', KeyNavigator.MODE_BOTH, void 0]
    ])(
        'does not processes the keyboard event from the key "%s" when being in mode "%s" and when the allowed type is "%s"',
        (key, mode, type) => {
            const navigator = new KeyNavigator(mode);
            const actionEvent = jest.fn();
            const contextEvent = jest.fn();

            navigator.on('action', actionEvent);

            expect(navigator.processEvent({ key }, type)).toBeFalsy();

            expect(actionEvent).not.toHaveBeenCalled();
            expect(contextEvent).not.toHaveBeenCalled();
        }
    );

    describe('has a static method which', () => {
        describe.each([
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
            it.each([KeyNavigator.TYPE_CONTROL, KeyNavigator.TYPE_MOVE, void 0])(
                'when the allowed type is "%s"',
                type => {
                    expect(KeyNavigator.identify(key, type)).toMatchSnapshot();
                }
            );
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
            expect(KeyNavigator.keystroke(key)).toBe(keystroke);
        });
    });
});
