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

import eachWord from '../eachWord.js';

describe('eachWord', () => {
    it('is a function', () => {
        expect(eachWord).toEqual(expect.any(Function));
    });

    it('needs a valid callback', () => {
        expect(() => eachWord([])).not.toThrow();
        expect(() => eachWord([], {})).toThrow('A callback function is expected!');
    });

    it.each([
        ['', []],
        ['foo', ['foo']],
        ['foo bar', ['foo', 'bar']],
        ['foo  bar', ['foo', 'bar']],
        [' foo bar ', ['foo', 'bar']],
        [['foo'], ['foo']],
        [
            ['foo', 'bar'],
            ['foo', 'bar']
        ]
    ])('returns the list of words from "%s"', (list, words) => {
        expect(eachWord(list)).toEqual(words);
    });

    it.each([
        ['', []],
        ['foo', ['foo']],
        ['foo bar', ['foo', 'bar']],
        ['foo  bar', ['foo', 'bar']],
        [' foo bar ', ['foo', 'bar']],
        [['foo'], ['foo']],
        [
            ['foo', 'bar'],
            ['foo', 'bar']
        ]
    ])('walk over each word from the list "%s"', (list, words) => {
        const callback = jest.fn().mockImplementation((word, index) => {
            expect(word).toBe(words[index]);
        });
        eachWord(list, callback);
        expect(callback).toHaveBeenCalledTimes(words.length);
    });
});
