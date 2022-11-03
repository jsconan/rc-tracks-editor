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

import { attributeList, flattenAttributeList } from '../attributes.js';

describe('attributeList', () => {
    it('is a function', () => {
        expect(attributeList).toEqual(expect.any(Function));
    });

    it('returns a key/value map form a single attribute', () => {
        expect(attributeList(10, 'value')).toStrictEqual({ value: 10 });
    });

    it('returns a key/value map of attributes', () => {
        const attributes = {
            fill: '#123',
            stroke: '#456',
            'stroke-width': '1'
        };
        expect(attributeList(attributes)).toStrictEqual(attributes);
    });
});

describe('flattenAttributeList', () => {
    it('is a function', () => {
        expect(flattenAttributeList).toEqual(expect.any(Function));
    });

    it('returns a key/value map form a single attribute', () => {
        expect(flattenAttributeList({ value: 10 })).toStrictEqual({ value: 10 });
    });

    it('returns a key/value map of attributes', () => {
        const attributes = {
            fill: '#123',
            stroke: {
                stroke: '#456',
                'stroke-width': '1'
            }
        };
        expect(flattenAttributeList(attributes)).toStrictEqual({
            fill: '#123',
            stroke: '#456',
            'stroke-width': '1'
        });
    });
});
