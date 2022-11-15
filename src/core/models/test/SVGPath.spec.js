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

import { Polygon2D } from '../Polygon2D.js';
import { SVGPath } from '../SVGPath.js';
import { Vector2D } from '../Vector2D.js';

describe('SVGPath', () => {
    it('is a class', () => {
        expect(SVGPath).toEqual(expect.any(Function));
    });

    describe('by default', () => {
        const path = new SVGPath();

        it('is empty', () => {
            expect(path.length).toBe(0);
            expect(path.commands).toStrictEqual([]);
            expect(path.toString()).toBe('');
        });

        it('starts at the origin', () => {
            expect(path.current).toBeInstanceOf(Vector2D);
            expect(path.current.x).toBe(0);
            expect(path.current.y).toBe(0);
        });

        it('starts open', () => {
            expect(path.closed).toBeFalsy();
        });
    });

    describe('closes the path', () => {
        it('after the last command', () => {
            const path = new SVGPath();
            path.moveTo(4, 2).lineTo(9, 1);

            expect(path.close()).toBe(path);
            expect(path.length).toBe(3);
            expect(path.toString()).toBe('M 4,2 L 9,1 Z');
        });

        it('even if it is empty', () => {
            const path = new SVGPath();

            expect(path.close()).toBe(path);
            expect(path.length).toBe(1);
            expect(path.toString()).toBe('Z');
        });

        it('only once', () => {
            const path = new SVGPath();
            path.lineTo(4, 2).close();

            expect(() => path.close()).toThrow('The path is closed and cannot accept more commands!');
            expect(path.length).toBe(2);
            expect(path.toString()).toBe('L 4,2 Z');
        });
    });

    describe('moves the current point', () => {
        describe('using cartesian coordinates', () => {
            it('if coordinates are given', () => {
                const path = new SVGPath();

                expect(path.toString()).toBe('');

                expect(path.moveTo()).toBe(path);
                expect(path.toString()).toBe('');

                expect(path.moveBy()).toBe(path);
                expect(path.toString()).toBe('');

                expect(() => path.moveTo({})).toThrow('The object must be an instance of Vector2D!');
                expect(() => path.moveBy({})).toThrow('The object must be an instance of Vector2D!');

                expect(path.length).toBe(0);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(0);
            });

            it('when coordinates are given separately', () => {
                const path = new SVGPath();

                expect(path.moveTo(1, 2)).toBe(path);
                expect(path.toString()).toBe('M 1,2');

                expect(path.moveBy(3, 4)).toBe(path);
                expect(path.toString()).toBe('M 4,6');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(4);
                expect(path.current.y).toBe(6);
            });

            it('when coordinates are given from a 2D vector', () => {
                const path = new SVGPath();

                expect(path.moveTo(new Vector2D(1, 2))).toBe(path);
                expect(path.toString()).toBe('M 1,2');

                expect(path.moveBy(new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('M 4,6');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(4);
                expect(path.current.y).toBe(6);
            });

            it('keeping only the last when a multiple coordinates are given', () => {
                const path = new SVGPath();

                expect(path.moveTo(new Vector2D(1, 2), new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('M 3,4');

                expect(path.moveBy(new Vector2D(1, 2), new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('M 7,10');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(7);
                expect(path.current.y).toBe(10);
            });

            it('replacing the previous command if similar', () => {
                const path = new SVGPath();
                path.moveTo(5, 8);

                expect(path.moveTo(3, 2)).toBe(path);
                expect(path.toString()).toBe('M 3,2');

                expect(path.moveBy(5, 7)).toBe(path);
                expect(path.toString()).toBe('M 8,9');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(8);
                expect(path.current.y).toBe(9);
            });

            it('if the path is not closed', () => {
                const path = new SVGPath();
                path.moveTo(5, 8).close();

                expect(path.toString()).toBe('M 5,8 Z');

                expect(() => path.moveTo(3, 2)).toThrow('The path is closed and cannot accept more commands!');
                expect(() => path.moveBy(3, 2)).toThrow('The path is closed and cannot accept more commands!');

                expect(path.toString()).toBe('M 5,8 Z');
                expect(path.length).toBe(2);
                expect(path.current.x).toBe(5);
                expect(path.current.y).toBe(8);
            });
        });

        describe('using polar coordinates', () => {
            it('if no coordinates are given', () => {
                const path = new SVGPath();

                expect(path.toString()).toBe('');

                expect(path.polarMoveTo()).toBe(path);
                expect(path.toString()).toBe('M 0,0');

                expect(path.polarMoveBy()).toBe(path);
                expect(path.toString()).toBe('M 0,0');

                expect(() => path.moveTo({})).toThrow('The object must be an instance of Vector2D!');
                expect(() => path.moveBy({})).toThrow('The object must be an instance of Vector2D!');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(0);
            });

            it('when coordinates are given separately', () => {
                const path = new SVGPath();

                expect(path.polarMoveTo(4, 30)).toBe(path);
                expect(path.toString()).toBe('M 3.464101615137755,1.9999999999999998');

                expect(path.polarMoveBy(4, 60)).toBe(path);
                expect(path.toString()).toBe('M 5.464101615137755,5.464101615137754');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(5.464101615137755);
                expect(path.current.y).toBe(5.464101615137754);
            });

            it('when coordinates are given with a center', () => {
                const path = new SVGPath();

                expect(path.polarMoveTo(new Vector2D(3, 4), 30, new Vector2D(5, 8))).toBe(path);
                expect(path.toString()).toBe('M 7.598076211353316,10');

                expect(path.polarMoveBy(new Vector2D(3, 4), 60, new Vector2D(5, 8))).toBe(path);
                expect(path.toString()).toBe('M 14.098076211353316,21.464101615137753');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(14.098076211353316);
                expect(path.current.y).toBe(21.464101615137753);
            });

            it('when coordinates are given from a 2D vector', () => {
                const path = new SVGPath();

                expect(path.polarMoveTo(new Vector2D(3, 4), 30)).toBe(path);
                expect(path.toString()).toBe('M 2.598076211353316,1.9999999999999998');

                expect(path.polarMoveBy(new Vector2D(3, 4), 60)).toBe(path);
                expect(path.toString()).toBe('M 4.098076211353316,5.464101615137754');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(4.098076211353316);
                expect(path.current.y).toBe(5.464101615137754);
            });

            it('replacing the previous command if similar', () => {
                const path = new SVGPath();
                path.moveTo(5, 8);

                expect(path.polarMoveTo(new Vector2D(3, 4), 30)).toBe(path);
                expect(path.toString()).toBe('M 2.598076211353316,1.9999999999999998');

                expect(path.polarMoveBy(new Vector2D(3, 4), 60)).toBe(path);
                expect(path.toString()).toBe('M 4.098076211353316,5.464101615137754');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(4.098076211353316);
                expect(path.current.y).toBe(5.464101615137754);
            });

            it('if the path is not closed', () => {
                const path = new SVGPath();
                path.moveTo(5, 8).close();

                expect(path.toString()).toBe('M 5,8 Z');

                expect(() => path.polarMoveTo(3, 2)).toThrow('The path is closed and cannot accept more commands!');
                expect(() => path.polarMoveBy(3, 2)).toThrow('The path is closed and cannot accept more commands!');

                expect(path.toString()).toBe('M 5,8 Z');
                expect(path.length).toBe(2);
                expect(path.current.x).toBe(5);
                expect(path.current.y).toBe(8);
            });
        });
    });

    describe('adds a line', () => {
        describe('using cartesian coordinates', () => {
            it('if coordinates are given', () => {
                const path = new SVGPath();

                expect(path.toString()).toBe('');

                expect(path.lineTo()).toBe(path);
                expect(path.toString()).toBe('');

                expect(path.lineBy()).toBe(path);
                expect(path.toString()).toBe('');

                expect(() => path.lineTo({})).toThrow('The object must be an instance of Vector2D!');
                expect(() => path.lineBy({})).toThrow('The object must be an instance of Vector2D!');

                expect(path.length).toBe(0);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(0);
            });

            it('when coordinates are given separately', () => {
                const path = new SVGPath();

                expect(path.lineTo(1, 2)).toBe(path);
                expect(path.toString()).toBe('L 1,2');

                expect(path.lineBy(3, 4)).toBe(path);
                expect(path.toString()).toBe('L 1,2 L 4,6');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(4);
                expect(path.current.y).toBe(6);
            });

            it('when coordinates are given from a 2D vector', () => {
                const path = new SVGPath();

                expect(path.lineTo(new Vector2D(1, 2))).toBe(path);
                expect(path.toString()).toBe('L 1,2');

                expect(path.lineBy(new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('L 1,2 L 4,6');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(4);
                expect(path.current.y).toBe(6);
            });

            it('grouping the command when a multiple coordinates are given', () => {
                const path = new SVGPath();

                expect(path.lineTo(new Vector2D(1, 2), new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('L 1,2 3,4');

                expect(path.lineBy(new Vector2D(1, 2), new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('L 1,2 3,4 L 4,6 7,10');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(7);
                expect(path.current.y).toBe(10);
            });

            it('ignoring the command if the current point is not changed', () => {
                const path = new SVGPath();
                path.moveTo(5, 8);

                expect(path.lineTo(5, 8)).toBe(path);
                expect(path.toString()).toBe('M 5,8');

                expect(path.lineBy(0, 0)).toBe(path);
                expect(path.toString()).toBe('M 5,8');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(5);
                expect(path.current.y).toBe(8);
            });

            it('if the path is not closed', () => {
                const path = new SVGPath();
                path.moveTo(1, 2).lineTo(5, 3).close();

                expect(path.toString()).toBe('M 1,2 L 5,3 Z');

                expect(() => path.lineTo(3, 2)).toThrow('The path is closed and cannot accept more commands!');
                expect(() => path.lineBy(3, 2)).toThrow('The path is closed and cannot accept more commands!');

                expect(path.length).toBe(3);
                expect(path.current.x).toBe(5);
                expect(path.current.y).toBe(3);
            });
        });

        describe('using polar coordinates', () => {
            it('if no coordinates are given', () => {
                const path = new SVGPath();
                path.moveTo(5, 8);

                expect(path.toString()).toBe('M 5,8');

                expect(path.polarLineTo()).toBe(path);
                expect(path.toString()).toBe('M 5,8 L 0,0');

                expect(path.polarLineBy()).toBe(path);
                expect(path.toString()).toBe('M 5,8 L 0,0');

                expect(() => path.lineTo({})).toThrow('The object must be an instance of Vector2D!');
                expect(() => path.lineBy({})).toThrow('The object must be an instance of Vector2D!');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(0);
            });

            it('when coordinates are given separately', () => {
                const path = new SVGPath();

                expect(path.polarLineTo(4, 30)).toBe(path);
                expect(path.toString()).toBe('L 3.464101615137755,1.9999999999999998');

                expect(path.polarLineBy(4, 60)).toBe(path);
                expect(path.toString()).toBe(
                    'L 3.464101615137755,1.9999999999999998 L 5.464101615137755,5.464101615137754'
                );

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(5.464101615137755);
                expect(path.current.y).toBe(5.464101615137754);
            });

            it('when coordinates are given from a 2D vector', () => {
                const path = new SVGPath();

                expect(path.polarLineTo(new Vector2D(3, 4), 30)).toBe(path);
                expect(path.toString()).toBe('L 2.598076211353316,1.9999999999999998');

                expect(path.polarLineBy(new Vector2D(3, 4), 60)).toBe(path);
                expect(path.toString()).toBe(
                    'L 2.598076211353316,1.9999999999999998 L 4.098076211353316,5.464101615137754'
                );

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(4.098076211353316);
                expect(path.current.y).toBe(5.464101615137754);
            });

            it('when coordinates are given with a center', () => {
                const path = new SVGPath();

                expect(path.polarLineTo(new Vector2D(3, 4), 30, new Vector2D(5, 8))).toBe(path);
                expect(path.toString()).toBe('L 7.598076211353316,10');

                expect(path.polarLineBy(new Vector2D(3, 4), 60, new Vector2D(5, 8))).toBe(path);
                expect(path.toString()).toBe('L 7.598076211353316,10 L 14.098076211353316,21.464101615137753');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(14.098076211353316);
                expect(path.current.y).toBe(21.464101615137753);
            });

            it('ignoring the command if the current point is not changed', () => {
                const path = new SVGPath();
                path.polarMoveTo(4, 30);

                expect(path.polarLineTo(4, 30)).toBe(path);
                expect(path.toString()).toBe('M 3.464101615137755,1.9999999999999998');

                expect(path.polarLineBy(0, 0)).toBe(path);
                expect(path.toString()).toBe('M 3.464101615137755,1.9999999999999998');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(3.464101615137755);
                expect(path.current.y).toBe(1.9999999999999998);
            });

            it('if the path is not closed', () => {
                const path = new SVGPath();
                path.moveTo(1, 2).lineTo(5, 3).close();

                expect(path.toString()).toBe('M 1,2 L 5,3 Z');

                expect(() => path.polarLineTo(3, 2)).toThrow('The path is closed and cannot accept more commands!');
                expect(() => path.polarLineBy(3, 2)).toThrow('The path is closed and cannot accept more commands!');

                expect(path.length).toBe(3);
                expect(path.current.x).toBe(5);
                expect(path.current.y).toBe(3);
            });
        });

        describe('horizontal', () => {
            it('if a coordinate is given', () => {
                const path = new SVGPath();

                expect(path.toString()).toBe('');

                expect(path.horizontalLineTo()).toBe(path);
                expect(path.toString()).toBe('');

                expect(path.horizontalLineBy()).toBe(path);
                expect(path.toString()).toBe('');

                expect(path.length).toBe(0);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(0);
            });

            it('when the coordinate is given as a number', () => {
                const path = new SVGPath();

                expect(path.horizontalLineTo(1)).toBe(path);
                expect(path.toString()).toBe('H 1');

                expect(path.horizontalLineBy(3)).toBe(path);
                expect(path.toString()).toBe('H 4');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(4);
                expect(path.current.y).toBe(0);
            });

            it('when the coordinate is given as a 2D vector', () => {
                const path = new SVGPath();

                expect(path.horizontalLineTo(new Vector2D(1, 2))).toBe(path);
                expect(path.toString()).toBe('H 1');

                expect(path.horizontalLineBy(new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('H 4');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(4);
                expect(path.current.y).toBe(0);
            });

            it('replacing the previous command if similar', () => {
                const path = new SVGPath();
                path.horizontalLineTo(5);

                expect(path.horizontalLineTo(3)).toBe(path);
                expect(path.toString()).toBe('H 3');

                expect(path.horizontalLineBy(5)).toBe(path);
                expect(path.toString()).toBe('H 8');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(8);
                expect(path.current.y).toBe(0);
            });

            it('if the path is not closed', () => {
                const path = new SVGPath();
                path.horizontalLineTo(5).close();

                expect(path.toString()).toBe('H 5 Z');

                expect(() => path.horizontalLineTo(3)).toThrow('The path is closed and cannot accept more commands!');
                expect(() => path.horizontalLineBy(3)).toThrow('The path is closed and cannot accept more commands!');

                expect(path.toString()).toBe('H 5 Z');
                expect(path.length).toBe(2);
                expect(path.current.x).toBe(5);
                expect(path.current.y).toBe(0);
            });
        });

        describe('vertical', () => {
            it('if a coordinate is given', () => {
                const path = new SVGPath();

                expect(path.toString()).toBe('');

                expect(path.verticalLineTo()).toBe(path);
                expect(path.toString()).toBe('');

                expect(path.verticalLineBy()).toBe(path);
                expect(path.toString()).toBe('');

                expect(path.length).toBe(0);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(0);
            });

            it('when the coordinate is given as a number', () => {
                const path = new SVGPath();

                expect(path.verticalLineTo(1)).toBe(path);
                expect(path.toString()).toBe('V 1');

                expect(path.verticalLineBy(3)).toBe(path);
                expect(path.toString()).toBe('V 4');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(4);
            });

            it('when the coordinate is given as a 2D vector', () => {
                const path = new SVGPath();

                expect(path.verticalLineTo(new Vector2D(1, 2))).toBe(path);
                expect(path.toString()).toBe('V 2');

                expect(path.verticalLineBy(new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('V 6');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(6);
            });

            it('replacing the previous command if similar', () => {
                const path = new SVGPath();
                path.verticalLineTo(5);

                expect(path.verticalLineTo(3)).toBe(path);
                expect(path.toString()).toBe('V 3');

                expect(path.verticalLineBy(5)).toBe(path);
                expect(path.toString()).toBe('V 8');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(8);
            });

            it('if the path is not closed', () => {
                const path = new SVGPath();
                path.verticalLineTo(5).close();

                expect(path.toString()).toBe('V 5 Z');

                expect(() => path.verticalLineTo(3)).toThrow('The path is closed and cannot accept more commands!');
                expect(() => path.verticalLineBy(3)).toThrow('The path is closed and cannot accept more commands!');

                expect(path.toString()).toBe('V 5 Z');
                expect(path.length).toBe(2);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(5);
            });

            it.each([
                [[], 2, 0, 2, 'M 2,3 V 0'],
                [[3], 2, 3, 1, 'M 2,3'],
                [[8], 2, 8, 2, 'M 2,3 V 8'],
                [[new Vector2D(3, 2)], 2, 2, 2, 'M 2,3 V 2']
            ])('to absolute coordinates using the parameters %s', (parameters, x, y, count, expected) => {
                const path = new SVGPath();
                path.moveTo(2, 3);

                expect(path.verticalLineTo(...parameters)).toBe(path);
                expect(path.current.x).toBe(x);
                expect(path.current.y).toBe(y);

                expect(path.length).toBe(count);
                expect(path.toString()).toBe(expected);
            });
        });
    });

    describe('adds a bezier curve', () => {
        describe('cubic', () => {
            it('if coordinates are given', () => {
                const path = new SVGPath();

                expect(path.toString()).toBe('');

                expect(path.cubicBezierCurveTo()).toBe(path);
                expect(path.toString()).toBe('');

                expect(path.cubicBezierCurveBy()).toBe(path);
                expect(path.toString()).toBe('');

                expect(() => path.cubicBezierCurveTo({})).toThrow('The object must be an instance of Vector2D!');
                expect(() => path.cubicBezierCurveBy({})).toThrow('The object must be an instance of Vector2D!');

                expect(path.length).toBe(0);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(0);
            });

            it('when coordinates are given from 2D vectors', () => {
                const path = new SVGPath();

                expect(path.cubicBezierCurveTo(new Vector2D(1, 2), new Vector2D(3, 4), new Vector2D(5, 6))).toBe(path);
                expect(path.toString()).toBe('C 1,2 3,4 5,6');

                expect(path.cubicBezierCurveBy(new Vector2D(1, 2), new Vector2D(3, 4), new Vector2D(5, 6))).toBe(path);
                expect(path.toString()).toBe('C 1,2 3,4 5,6 C 6,8 8,10 10,12');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(10);
                expect(path.current.y).toBe(12);
            });

            it('grouping the command when a multiple coordinates are given', () => {
                const path = new SVGPath();

                expect(
                    path.cubicBezierCurveTo(
                        new Vector2D(1, 2),
                        new Vector2D(3, 4),
                        new Vector2D(5, 6),
                        new Vector2D(11, 12),
                        new Vector2D(13, 14),
                        new Vector2D(15, 16)
                    )
                ).toBe(path);
                expect(path.toString()).toBe('C 1,2 3,4 5,6 11,12 13,14 15,16');

                expect(
                    path.cubicBezierCurveBy(
                        new Vector2D(1, 2),
                        new Vector2D(3, 4),
                        new Vector2D(5, 6),
                        new Vector2D(11, 12),
                        new Vector2D(13, 14),
                        new Vector2D(15, 16)
                    )
                ).toBe(path);
                expect(path.toString()).toBe('C 1,2 3,4 5,6 11,12 13,14 15,16 C 16,18 18,20 20,22 31,34 33,36 35,38');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(35);
                expect(path.current.y).toBe(38);
            });

            it('if the path is not closed', () => {
                const path = new SVGPath();
                path.moveTo(1, 2).lineTo(5, 3).close();

                expect(path.toString()).toBe('M 1,2 L 5,3 Z');

                expect(() =>
                    path.cubicBezierCurveTo(new Vector2D(1, 2), new Vector2D(3, 4), new Vector2D(5, 6))
                ).toThrow('The path is closed and cannot accept more commands!');
                expect(() =>
                    path.cubicBezierCurveBy(new Vector2D(1, 2), new Vector2D(3, 4), new Vector2D(5, 6))
                ).toThrow('The path is closed and cannot accept more commands!');

                expect(path.length).toBe(3);
                expect(path.current.x).toBe(5);
                expect(path.current.y).toBe(3);
            });
        });

        describe('smooth cubic', () => {
            it('if coordinates are given', () => {
                const path = new SVGPath();

                expect(path.toString()).toBe('');

                expect(path.smoothBezierCurveTo()).toBe(path);
                expect(path.toString()).toBe('');

                expect(path.smoothBezierCurveBy()).toBe(path);
                expect(path.toString()).toBe('');

                expect(() => path.smoothBezierCurveTo({})).toThrow('The object must be an instance of Vector2D!');
                expect(() => path.smoothBezierCurveBy({})).toThrow('The object must be an instance of Vector2D!');

                expect(path.length).toBe(0);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(0);
            });

            it('when coordinates are given from 2D vectors', () => {
                const path = new SVGPath();

                expect(path.smoothBezierCurveTo(new Vector2D(1, 2), new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('S 1,2 3,4');

                expect(path.smoothBezierCurveBy(new Vector2D(1, 2), new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('S 1,2 3,4 S 4,6 6,8');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(6);
                expect(path.current.y).toBe(8);
            });

            it('grouping the command when a multiple coordinates are given', () => {
                const path = new SVGPath();

                expect(
                    path.smoothBezierCurveTo(
                        new Vector2D(1, 2),
                        new Vector2D(3, 4),
                        new Vector2D(11, 12),
                        new Vector2D(13, 14)
                    )
                ).toBe(path);
                expect(path.toString()).toBe('S 1,2 3,4 11,12 13,14');

                expect(
                    path.smoothBezierCurveBy(
                        new Vector2D(1, 2),
                        new Vector2D(3, 4),
                        new Vector2D(11, 12),
                        new Vector2D(13, 14)
                    )
                ).toBe(path);
                expect(path.toString()).toBe('S 1,2 3,4 11,12 13,14 S 14,16 16,18 27,30 29,32');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(29);
                expect(path.current.y).toBe(32);
            });

            it('if the path is not closed', () => {
                const path = new SVGPath();
                path.moveTo(1, 2).lineTo(5, 3).close();

                expect(path.toString()).toBe('M 1,2 L 5,3 Z');

                expect(() => path.smoothBezierCurveTo(new Vector2D(1, 2), new Vector2D(3, 4))).toThrow(
                    'The path is closed and cannot accept more commands!'
                );
                expect(() => path.smoothBezierCurveBy(new Vector2D(1, 2), new Vector2D(3, 4))).toThrow(
                    'The path is closed and cannot accept more commands!'
                );

                expect(path.length).toBe(3);
                expect(path.current.x).toBe(5);
                expect(path.current.y).toBe(3);
            });
        });

        describe('quadratic', () => {
            it('if coordinates are given', () => {
                const path = new SVGPath();

                expect(path.toString()).toBe('');

                expect(path.quadraticBezierCurveTo()).toBe(path);
                expect(path.toString()).toBe('');

                expect(path.quadraticBezierCurveBy()).toBe(path);
                expect(path.toString()).toBe('');

                expect(() => path.quadraticBezierCurveTo({})).toThrow('The object must be an instance of Vector2D!');
                expect(() => path.quadraticBezierCurveBy({})).toThrow('The object must be an instance of Vector2D!');

                expect(path.length).toBe(0);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(0);
            });

            it('when coordinates are given from 2D vectors', () => {
                const path = new SVGPath();

                expect(path.quadraticBezierCurveTo(new Vector2D(1, 2), new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('Q 1,2 3,4');

                expect(path.quadraticBezierCurveBy(new Vector2D(1, 2), new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('Q 1,2 3,4 Q 4,6 6,8');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(6);
                expect(path.current.y).toBe(8);
            });

            it('grouping the command when a multiple coordinates are given', () => {
                const path = new SVGPath();

                expect(
                    path.quadraticBezierCurveTo(
                        new Vector2D(1, 2),
                        new Vector2D(3, 4),
                        new Vector2D(11, 12),
                        new Vector2D(13, 14)
                    )
                ).toBe(path);
                expect(path.toString()).toBe('Q 1,2 3,4 11,12 13,14');

                expect(
                    path.quadraticBezierCurveBy(
                        new Vector2D(1, 2),
                        new Vector2D(3, 4),
                        new Vector2D(11, 12),
                        new Vector2D(13, 14)
                    )
                ).toBe(path);
                expect(path.toString()).toBe('Q 1,2 3,4 11,12 13,14 Q 14,16 16,18 27,30 29,32');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(29);
                expect(path.current.y).toBe(32);
            });

            it('if the path is not closed', () => {
                const path = new SVGPath();
                path.moveTo(1, 2).lineTo(5, 3).close();

                expect(path.toString()).toBe('M 1,2 L 5,3 Z');

                expect(() => path.quadraticBezierCurveTo(new Vector2D(1, 2), new Vector2D(3, 4))).toThrow(
                    'The path is closed and cannot accept more commands!'
                );
                expect(() => path.quadraticBezierCurveBy(new Vector2D(1, 2), new Vector2D(3, 4))).toThrow(
                    'The path is closed and cannot accept more commands!'
                );

                expect(path.length).toBe(3);
                expect(path.current.x).toBe(5);
                expect(path.current.y).toBe(3);
            });
        });

        describe('smooth quadratic', () => {
            it('if coordinates are given', () => {
                const path = new SVGPath();

                expect(path.toString()).toBe('');

                expect(path.smoothQuadraticBezierCurveTo()).toBe(path);
                expect(path.toString()).toBe('');

                expect(path.smoothQuadraticBezierCurveBy()).toBe(path);
                expect(path.toString()).toBe('');

                expect(() => path.smoothQuadraticBezierCurveTo({})).toThrow(
                    'The object must be an instance of Vector2D!'
                );
                expect(() => path.smoothQuadraticBezierCurveBy({})).toThrow(
                    'The object must be an instance of Vector2D!'
                );

                expect(path.length).toBe(0);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(0);
            });

            it('when coordinates are given separately', () => {
                const path = new SVGPath();

                expect(path.smoothQuadraticBezierCurveTo(1, 2)).toBe(path);
                expect(path.toString()).toBe('T 1,2');

                expect(path.smoothQuadraticBezierCurveBy(3, 4)).toBe(path);
                expect(path.toString()).toBe('T 1,2 T 4,6');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(4);
                expect(path.current.y).toBe(6);
            });

            it('when coordinates are given from a 2D vector', () => {
                const path = new SVGPath();

                expect(path.smoothQuadraticBezierCurveTo(new Vector2D(1, 2))).toBe(path);
                expect(path.toString()).toBe('T 1,2');

                expect(path.smoothQuadraticBezierCurveBy(new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('T 1,2 T 4,6');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(4);
                expect(path.current.y).toBe(6);
            });

            it('grouping the command when a multiple coordinates are given', () => {
                const path = new SVGPath();

                expect(path.smoothQuadraticBezierCurveTo(new Vector2D(1, 2), new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('T 1,2 3,4');

                expect(path.smoothQuadraticBezierCurveBy(new Vector2D(1, 2), new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('T 1,2 3,4 T 4,6 7,10');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(7);
                expect(path.current.y).toBe(10);
            });

            it('ignoring the command if the current point is not changed', () => {
                const path = new SVGPath();
                path.moveTo(5, 8);

                expect(path.smoothQuadraticBezierCurveTo(5, 8)).toBe(path);
                expect(path.toString()).toBe('M 5,8');

                expect(path.smoothQuadraticBezierCurveBy(0, 0)).toBe(path);
                expect(path.toString()).toBe('M 5,8');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(5);
                expect(path.current.y).toBe(8);
            });

            it('if the path is not closed', () => {
                const path = new SVGPath();
                path.moveTo(1, 2).lineTo(5, 3).close();

                expect(path.toString()).toBe('M 1,2 L 5,3 Z');

                expect(() => path.smoothQuadraticBezierCurveTo(3, 2)).toThrow(
                    'The path is closed and cannot accept more commands!'
                );
                expect(() => path.smoothQuadraticBezierCurveBy(3, 2)).toThrow(
                    'The path is closed and cannot accept more commands!'
                );

                expect(path.length).toBe(3);
                expect(path.current.x).toBe(5);
                expect(path.current.y).toBe(3);
            });
        });
    });

    describe('adds an elliptical arc curve', () => {
        describe('using coordinates', () => {
            it('when the coordinate is given as a number', () => {
                const path = new SVGPath();

                expect(path.ellipticalArcCurveTo(5, 30, 1, 1, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,5 30 1 1 3,4');

                expect(path.ellipticalArcCurveBy(5, 30, 1, 1, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,5 30 1 1 3,4 A 5,5 30 1 1 6,8');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(6);
                expect(path.current.y).toBe(8);
            });

            it('when the coordinate is given as a 2D vector', () => {
                const path = new SVGPath();

                expect(path.ellipticalArcCurveTo(new Vector2D(5, 6), 0, 1, 1, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,6 0 1 1 3,4');

                expect(path.ellipticalArcCurveBy(new Vector2D(5, 6), 0, 1, 1, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,6 0 1 1 3,4 A 5,6 0 1 1 6,8');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(6);
                expect(path.current.y).toBe(8);
            });

            it('it needs 2D vectors', () => {
                const path = new SVGPath();

                expect(() => path.ellipticalArcCurveTo({}, 0, 1, 1, new Vector2D(3, 4))).toThrow(
                    'The object must be an instance of Vector2D!'
                );
                expect(() => path.ellipticalArcCurveTo(5, 0, 1, 1, {})).toThrow(
                    'The object must be an instance of Vector2D!'
                );
                expect(() => path.ellipticalArcCurveBy({}, 0, 1, 1, new Vector2D(3, 4))).toThrow(
                    'The object must be an instance of Vector2D!'
                );
                expect(() => path.ellipticalArcCurveBy(5, 0, 1, 1, {})).toThrow(
                    'The object must be an instance of Vector2D!'
                );
            });

            it('if the path is not closed', () => {
                const path = new SVGPath();
                path.close();

                expect(path.toString()).toBe('Z');

                expect(() => path.ellipticalArcCurveTo(5, 0, 1, 1, new Vector2D(3, 4))).toThrow(
                    'The path is closed and cannot accept more commands!'
                );
                expect(() => path.ellipticalArcCurveBy(5, 0, 1, 1, new Vector2D(3, 4))).toThrow(
                    'The path is closed and cannot accept more commands!'
                );

                expect(path.toString()).toBe('Z');
                expect(path.length).toBe(1);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(0);
            });
        });

        describe('using angles', () => {
            it('when the radius is given as a number', () => {
                const path = new SVGPath();

                expect(path.arcCurve(5, 30, 60)).toBe(path);
                expect(path.toString()).toBe('A 5,5 0 0 0 6.8301270189221945,6.830127018922193');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(6.8301270189221945);
                expect(path.current.y).toBe(6.830127018922193);
            });

            it('when the radius is given as a 2D vector', () => {
                const path = new SVGPath();

                expect(path.arcCurve(new Vector2D(5, 6), 30, 60)).toBe(path);
                expect(path.toString()).toBe('A 5,6 0 0 0 6.8301270189221945,8.196152422706632');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(6.8301270189221945);
                expect(path.current.y).toBe(8.196152422706632);
            });

            it('when the angle is positive and lower than 180', () => {
                const path = new SVGPath();

                expect(path.arcCurve(5, 30, 60)).toBe(path);
                expect(path.toString()).toBe('A 5,5 0 0 0 6.8301270189221945,6.830127018922193');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(6.8301270189221945);
                expect(path.current.y).toBe(6.830127018922193);
            });

            it('when the angle is positive and greater than 180', () => {
                const path = new SVGPath();

                expect(path.arcCurve(5, 30, 230)).toBe(path);
                expect(path.toString()).toBe('A 5,5 0 1 0 1.116188970489496,-1.33022221559489');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(1.116188970489496);
                expect(path.current.y).toBe(-1.33022221559489);
            });

            it('when the angle is negative and lower than 180', () => {
                const path = new SVGPath();

                expect(path.arcCurve(5, 60, 30)).toBe(path);
                expect(path.toString()).toBe('A 5,5 0 0 1 6.8301270189221945,6.830127018922193');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(6.8301270189221945);
                expect(path.current.y).toBe(6.830127018922193);
            });

            it('when the angle is negative and greater than 180', () => {
                const path = new SVGPath();

                expect(path.arcCurve(5, 230, 30)).toBe(path);
                expect(path.toString()).toBe('A 5,5 0 1 1 1.116188970489496,-1.33022221559489');

                expect(path.length).toBe(1);
                expect(path.current.x).toBe(1.116188970489496);
                expect(path.current.y).toBe(-1.33022221559489);
            });

            it('it needs 2D vectors', () => {
                const path = new SVGPath();

                expect(() => path.arcCurve({}, 0, 1)).toThrow('The object must be an instance of Vector2D!');
            });

            it('if the path is not closed', () => {
                const path = new SVGPath();
                path.close();

                expect(path.toString()).toBe('Z');

                expect(() => path.arcCurve(5, 30, 50)).toThrow('The path is closed and cannot accept more commands!');

                expect(path.toString()).toBe('Z');
                expect(path.length).toBe(1);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(0);
            });
        });

        describe('using angle and point', () => {
            it('when the coordinate is given as a number', () => {
                const path = new SVGPath();

                expect(path.arcCurveTo(5, 60, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,5 0 0 0 3,4');

                expect(path.arcCurveBy(5, 60, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,5 0 0 0 3,4 A 5,5 0 0 0 6,8');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(6);
                expect(path.current.y).toBe(8);
            });

            it('when the coordinate is given as a 2D vector', () => {
                const path = new SVGPath();

                expect(path.arcCurveTo(new Vector2D(5, 6), 60, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,6 0 0 0 3,4');

                expect(path.arcCurveBy(new Vector2D(5, 6), 60, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,6 0 0 0 3,4 A 5,6 0 0 0 6,8');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(6);
                expect(path.current.y).toBe(8);
            });

            it('when the angle is positive and lower than 180', () => {
                const path = new SVGPath();

                expect(path.arcCurveTo(new Vector2D(5, 6), 60, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,6 0 0 0 3,4');

                expect(path.arcCurveBy(new Vector2D(5, 6), 60, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,6 0 0 0 3,4 A 5,6 0 0 0 6,8');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(6);
                expect(path.current.y).toBe(8);
            });

            it('when the angle is positive and greater than 180', () => {
                const path = new SVGPath();

                expect(path.arcCurveTo(new Vector2D(5, 6), 260, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,6 0 1 0 3,4');

                expect(path.arcCurveBy(new Vector2D(5, 6), 260, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,6 0 1 0 3,4 A 5,6 0 1 0 6,8');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(6);
                expect(path.current.y).toBe(8);
            });

            it('when the angle is negative and lower than 180', () => {
                const path = new SVGPath();

                expect(path.arcCurveTo(new Vector2D(5, 6), -60, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,6 0 0 1 3,4');

                expect(path.arcCurveBy(new Vector2D(5, 6), -60, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,6 0 0 1 3,4 A 5,6 0 0 1 6,8');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(6);
                expect(path.current.y).toBe(8);
            });

            it('when the angle is negative and greater than 180', () => {
                const path = new SVGPath();

                expect(path.arcCurveTo(new Vector2D(5, 6), -260, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,6 0 1 1 3,4');

                expect(path.arcCurveBy(new Vector2D(5, 6), -260, new Vector2D(3, 4))).toBe(path);
                expect(path.toString()).toBe('A 5,6 0 1 1 3,4 A 5,6 0 1 1 6,8');

                expect(path.length).toBe(2);
                expect(path.current.x).toBe(6);
                expect(path.current.y).toBe(8);
            });

            it('it needs 2D vectors', () => {
                const path = new SVGPath();

                expect(() => path.arcCurveTo({}, 90, new Vector2D(3, 4))).toThrow(
                    'The object must be an instance of Vector2D!'
                );
                expect(() => path.arcCurveTo(5, 90, {})).toThrow('The object must be an instance of Vector2D!');
                expect(() => path.arcCurveBy({}, 90, new Vector2D(3, 4))).toThrow(
                    'The object must be an instance of Vector2D!'
                );
                expect(() => path.arcCurveBy(5, 90, {})).toThrow('The object must be an instance of Vector2D!');
            });

            it('if the path is not closed', () => {
                const path = new SVGPath();
                path.close();

                expect(path.toString()).toBe('Z');

                expect(() => path.arcCurveTo(5, 90, new Vector2D(3, 4))).toThrow(
                    'The path is closed and cannot accept more commands!'
                );
                expect(() => path.arcCurveBy(5, 90, new Vector2D(3, 4))).toThrow(
                    'The path is closed and cannot accept more commands!'
                );

                expect(path.toString()).toBe('Z');
                expect(path.length).toBe(1);
                expect(path.current.x).toBe(0);
                expect(path.current.y).toBe(0);
            });
        });
    });

    describe('add points from a polygon', () => {
        it('to an empty path', () => {
            const path = new SVGPath();
            const polygon = new Polygon2D();
            polygon.load([
                [1, 2],
                [3, 4],
                [5, 6],
                [7, 8]
            ]);

            expect(path.addPolygon(polygon)).toBe(path);
            expect(path.toString()).toBe('M 1,2 L 3,4 5,6 7,8');
            expect(path.closed).toBeFalsy();
            expect(path.length).toBe(2);
            expect(path.current.x).toBe(7);
            expect(path.current.y).toBe(8);
        });

        it('to an existing path', () => {
            const path = new SVGPath();
            path.moveTo(10, 8).lineTo(15, 6);

            const polygon = new Polygon2D();
            polygon.load([
                [1, 2],
                [3, 4],
                [5, 6],
                [7, 8]
            ]);

            expect(path.addPolygon(polygon)).toBe(path);
            expect(path.toString()).toBe('M 10,8 L 15,6 L 1,2 3,4 5,6 7,8');
            expect(path.closed).toBeFalsy();
            expect(path.length).toBe(3);
            expect(path.current.x).toBe(7);
            expect(path.current.y).toBe(8);
        });

        it('using an empty polygon', () => {
            const path = new SVGPath();
            const polygon = new Polygon2D();

            expect(path.addPolygon(polygon)).toBe(path);
            expect(path.toString()).toBe('');
            expect(path.closed).toBeFalsy();
            expect(path.length).toBe(0);
            expect(path.current.x).toBe(0);
            expect(path.current.y).toBe(0);

            path.moveTo(10, 8).lineTo(15, 6);
            expect(path.addPolygon(polygon)).toBe(path);
            expect(path.toString()).toBe('M 10,8 L 15,6');
            expect(path.closed).toBeFalsy();
            expect(path.length).toBe(2);
            expect(path.current.x).toBe(15);
            expect(path.current.y).toBe(6);
        });

        it('throws error if a wrong polygon is given', () => {
            const path = new SVGPath();
            const polygon = new Polygon2D();
            path.moveTo(10, 8).lineTo(15, 6).close();

            expect(() => path.addPolygon(polygon)).toThrow('The path is closed and cannot accept more commands!');
        });

        it('throws error if the path is already closed', () => {
            const path = new SVGPath();

            expect(() => path.addPolygon()).toThrow('The object must be an instance of Polygon2D!');
            expect(() => path.addPolygon({})).toThrow('The object must be an instance of Polygon2D!');
        });
    });

    describe('creates a path from a polygon', () => {
        it('using a filled polygon', () => {
            const polygon = new Polygon2D();
            polygon.load([
                [1, 2],
                [3, 4],
                [5, 6],
                [7, 8]
            ]);

            const path = SVGPath.fromPolygon(polygon);

            expect(path.toString()).toBe('M 1,2 L 3,4 5,6 7,8 Z');
            expect(path.closed).toBeTruthy();
            expect(path.length).toBe(3);
            expect(path.current.x).toBe(7);
            expect(path.current.y).toBe(8);
        });

        it('using an empty polygon', () => {
            const polygon = new Polygon2D();
            const path = SVGPath.fromPolygon(polygon);

            expect(path.toString()).toBe('Z');
            expect(path.closed).toBeTruthy();
            expect(path.length).toBe(1);
            expect(path.current.x).toBe(0);
            expect(path.current.y).toBe(0);
        });

        it('throws error if a wrong polygon is given', () => {
            expect(() => SVGPath.fromPolygon()).toThrow('The object must be an instance of Polygon2D!');
            expect(() => SVGPath.fromPolygon({})).toThrow('The object must be an instance of Polygon2D!');
        });
    });
});
