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

import pick from '../pick.js';

describe('pick', () => {
    it('is a function', () => {
        expect(pick).toEqual(expect.any(Function));
    });

    it('returns the target object', () => {
        const target = {};
        expect(pick(target)).toBe(target);
    });

    it('mixes a selection from multiple sources to the target', () => {
        const value = 1;
        const action = () => {};
        const target = {};
        const result = pick(target, ['action'], { value }, { action });

        expect(result).toStrictEqual({ action });
        expect(result).toBe(target);
    });

    it('can copy the accessors to the target', () => {
        const list = [];
        const source = {
            get size() {
                return list.length;
            },
            set list(value) {
                list.push(value);
            },
            get list() {
                return list;
            }
        };
        const target = {};
        const result = pick(target, ['size', 'list'], source);

        expect(result).toStrictEqual(source);
        expect(result).toBe(target);
        expect(target.size).toBe(0);
        expect(target.list).toStrictEqual([]);

        target.list = 3;
        expect(target.size).toBe(1);
        expect(target.list).toStrictEqual([3]);

        target.list = 1;
        expect(target.size).toBe(2);
        expect(target.list).toStrictEqual([3, 1]);
    });

    it('can copy the symbols to the target', () => {
        const list = [1, 2, 3];
        const source = {
            *[Symbol.iterator]() {
                yield* list;
            }
        };
        const target = {};
        const result = pick(target, [Symbol.iterator], source);

        expect(result).toStrictEqual(source);
        expect(result).toBe(target);
        expect(target[Symbol.iterator]).toEqual(expect.any(Function));
        expect([...target]).toStrictEqual(list);
    });

    it('can copy non enumerable properties to the target', () => {
        const source = {};
        const target = {};
        const answer = 42;

        Object.defineProperties(source, {
            answer: {
                value: answer,
                writable: false,
                enumerable: false
            }
        });

        const result = pick(target, ['answer'], source);

        expect(result).toStrictEqual(source);
        expect(result).toBe(target);
        expect(target.answer).toBe(answer);
    });

    it('replace properties that exist in the target', () => {
        const list = [];
        const source = {
            get type() {
                return 'source';
            },
            *[Symbol.iterator]() {
                yield 0;
            },
            has() {
                return false;
            },
            add(value) {
                list.push(value);
                return this;
            }
        };
        const extra = {
            get type() {
                return 'extra';
            },
            *[Symbol.iterator]() {
                yield -1;
            },
            has() {
                return -1;
            },
            add() {
                return -1;
            }
        };
        const target = {
            get type() {
                return 'target';
            },
            *[Symbol.iterator]() {
                yield* list;
            },
            has(value) {
                return list.includes(value);
            }
        };
        const result = pick(target, ['type', Symbol.iterator, 'has', 'add'], source, extra);

        expect(result).toBe(target);
        expect(target.type).toBe('extra');
        expect(target.add(1)).toBe(-1);
        expect(target.add(2)).toBe(-1);
        expect(list).toStrictEqual([]);
        expect(target.has(1)).toBe(-1);
        expect(target.has(2)).toBe(-1);
        expect([...target]).toStrictEqual([-1]);
    });
});
