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

import { FocusManager } from '../FocusManager.js';

const delay = ms => new Promise(elapsed => setTimeout(elapsed, ms));

describe('DeferredAction', () => {
    it('is a class', () => {
        expect(FocusManager).toEqual(expect.any(Function));
    });

    it('detects focus action', async () => {
        const focusManager = new FocusManager(0);
        const focus = jest.fn();

        focusManager.on('focus', focus);

        expect(focusManager.focus()).toBe(focusManager);

        await delay(1);

        expect(focus).toHaveBeenCalledTimes(1);
    });

    it('cancels pending focus on blur', async () => {
        const focusManager = new FocusManager(0);
        const focus = jest.fn();
        const blur = jest.fn();

        focusManager.on('focus', focus);
        focusManager.on('blur', blur);

        focusManager.focus();
        expect(focusManager.blur()).toBe(focusManager);

        await delay(1);

        expect(focus).not.toHaveBeenCalled();
        expect(blur).toHaveBeenCalledTimes(1);
    });

    it('cancels pending focus on click', async () => {
        const focusManager = new FocusManager(0);
        const focus = jest.fn();
        const click = jest.fn();

        focusManager.on('focus', focus);
        focusManager.on('click', click);

        focusManager.focus();
        expect(focusManager.click()).toBe(focusManager);

        await delay(1);

        expect(focus).not.toHaveBeenCalled();
        expect(click).toHaveBeenCalledTimes(1);
    });

    it('forwards parameters to the focus action', async () => {
        const parameters = ['foo', 42];
        const focusManager = new FocusManager(0);
        const focus = jest.fn().mockImplementation((...args) => {
            expect(args).toStrictEqual(parameters);
        });

        focusManager.on('focus', focus);
        focusManager.focus(...parameters);

        await delay(1);

        expect(focus).toHaveBeenCalledTimes(1);
    });

    it('forwards parameters to the blur action', async () => {
        const parameters = ['foo', 42];
        const focusManager = new FocusManager(0);
        const focus = jest.fn();
        const blur = jest.fn().mockImplementation((...args) => {
            expect(args).toStrictEqual(parameters);
        });

        focusManager.on('focus', focus);
        focusManager.on('blur', blur);

        focusManager.focus();
        focusManager.blur(...parameters);

        await delay(1);

        expect(focus).not.toHaveBeenCalled();
        expect(blur).toHaveBeenCalledTimes(1);
    });

    it('forwards parameters to the click action', async () => {
        const parameters = ['foo', 42];
        const focusManager = new FocusManager(0);
        const focus = jest.fn();
        const click = jest.fn().mockImplementation((...args) => {
            expect(args).toStrictEqual(parameters);
        });

        focusManager.on('focus', focus);
        focusManager.on('click', click);

        focusManager.focus();
        focusManager.click(...parameters);

        await delay(1);

        expect(focus).not.toHaveBeenCalled();
        expect(click).toHaveBeenCalledTimes(1);
    });
});
