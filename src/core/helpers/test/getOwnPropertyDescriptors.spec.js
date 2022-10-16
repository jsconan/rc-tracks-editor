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

import getOwnPropertyDescriptors from '../getOwnPropertyDescriptors.js';

describe('getOwnPropertyDescriptors', () => {
    it('is a function', () => {
        expect(getOwnPropertyDescriptors).toEqual(expect.any(Function));
    });

    describe('lists descriptors', () => {
        it('when the source contains the expected property', () => {
            const source = { foo: 'bar', bar: 'foo' };
            const descriptors = {};
            const keys = ['foo'];
            expect(getOwnPropertyDescriptors(source, descriptors, keys)).toBe(1);
            expect(descriptors).toStrictEqual({
                foo: {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: 'bar'
                }
            });
        });

        it.each([
            ['string', 'message', { message: 'hello' }],
            ['boolean', 'flag', { flag: true }],
            ['number', 'answer', { answer: 42 }],
            ['function', 'action', { action() {} }],
            ['symbol', Symbol.iterator, { [Symbol.iterator]() {} }]
        ])('for a %s property', (type, key, source) => {
            const descriptors = {};
            const keys = [key];
            expect(getOwnPropertyDescriptors(source, descriptors, keys)).toBe(1);
            expect(descriptors).toMatchSnapshot();
        });
    });

    describe('does not list descriptors', () => {
        it('when the source is an empty object', () => {
            const source = {};
            const descriptors = {};
            const keys = ['foo'];
            expect(getOwnPropertyDescriptors(source, descriptors, keys)).toBe(0);
            expect(descriptors).toStrictEqual({});
        });

        it('when the list of keys is empty', () => {
            const source = { foo: 'bar' };
            const descriptors = {};
            const keys = [];
            expect(getOwnPropertyDescriptors(source, descriptors, keys)).toBe(0);
            expect(descriptors).toStrictEqual({});
        });

        it('when the expected properties does not exist in the source', () => {
            const source = { foo: 'bar' };
            const descriptors = {};
            const keys = ['bar'];
            expect(getOwnPropertyDescriptors(source, descriptors, keys)).toBe(0);
            expect(descriptors).toStrictEqual({});
        });

        it('when the properties already exist in the target', () => {
            const source = { foo: 'bar' };
            const target = { foo: 'baz' };
            const descriptors = {};
            const keys = ['foo'];
            expect(getOwnPropertyDescriptors(source, descriptors, keys, target)).toBe(0);
            expect(descriptors).toStrictEqual({});
        });

        it('when the properties are already listed', () => {
            const source = {};
            const target = { foo: 'bar' };
            const descriptors = { foo: 'baz' };
            const keys = ['foo'];
            expect(getOwnPropertyDescriptors(source, descriptors, keys, target)).toBe(0);
            expect(descriptors).toStrictEqual({ foo: 'baz' });
        });
    });
});
