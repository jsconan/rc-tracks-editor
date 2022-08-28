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

import Vector2D from '../Vector2D.js';

describe('vector', () => {
    it('is a class', () => {
        expect(Vector2D).toEqual(expect.any(Function));
    });

    describe('can build a vector', () => {
        it('at the origin', () => {
            const v = new Vector2D();

            expect(v).toBeInstanceOf(Vector2D);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
        });

        it('at the given cartesian coordinates', () => {
            const v = new Vector2D(1, 2);

            expect(v).toBeInstanceOf(Vector2D);
            expect(v.x).toBe(1);
            expect(v.y).toBe(2);
        });
    });

    describe('can set', () => {
        it('the coordinates of the vector', () => {
            const v = new Vector2D(1, 1);

            expect(v.x).toBe(1);
            expect(v.y).toBe(1);
            expect(v.set(3, 4)).toBe(v);
            expect(v.x).toBe(3);
            expect(v.y).toBe(4);
        });

        it('the X-coordinate of the vector', () => {
            const v = new Vector2D(1, 1);

            expect(v.x).toBe(1);
            expect(v.y).toBe(1);
            expect(v.setX(3)).toBe(v);
            expect(v.x).toBe(3);
            expect(v.y).toBe(1);
        });

        it('the Y-coordinate of the vector', () => {
            const v = new Vector2D(1, 1);

            expect(v.x).toBe(1);
            expect(v.y).toBe(1);
            expect(v.setY(4)).toBe(v);
            expect(v.x).toBe(1);
            expect(v.y).toBe(4);
        });
    });

    describe('can copy', () => {
        it('the coordinates of another vector', () => {
            const v1 = new Vector2D(1, 1);
            const v2 = new Vector2D(3, 4);

            expect(v1.x).toBe(1);
            expect(v1.y).toBe(1);
            expect(v1.copy(v2)).toBe(v1);
            expect(v1.x).toBe(3);
            expect(v1.y).toBe(4);
        });

        it('the X-coordinate of another vector', () => {
            const v1 = new Vector2D(1, 1);
            const v2 = new Vector2D(3, 4);

            expect(v1.x).toBe(1);
            expect(v1.y).toBe(1);
            expect(v1.copyX(v2)).toBe(v1);
            expect(v1.x).toBe(3);
            expect(v1.y).toBe(1);
        });

        it('the Y-coordinate of another vector', () => {
            const v1 = new Vector2D(1, 1);
            const v2 = new Vector2D(3, 4);

            expect(v1.x).toBe(1);
            expect(v1.y).toBe(1);
            expect(v1.copyY(v2)).toBe(v1);
            expect(v1.x).toBe(1);
            expect(v1.y).toBe(4);
        });
    });

    it('can create a copy of itself', () => {
        const v = new Vector2D(1, 2);
        const copy = v.clone();

        expect(copy).toBeInstanceOf(Vector2D);
        expect(copy.x).toBe(1);
        expect(copy.y).toBe(2);
    });

    describe('can add', () => {
        it('the coordinates of another vector', () => {
            const v1 = new Vector2D(1, 1);
            const v2 = new Vector2D(2, 2);
            const v3 = v1.add(v2);

            expect(v1.x).toBe(1);
            expect(v1.y).toBe(1);

            expect(v3).not.toBe(v1);
            expect(v3.x).toBe(3);
            expect(v3.y).toBe(3);
        });

        it('the X-coordinate of another vector', () => {
            const v1 = new Vector2D(1, 1);
            const v2 = new Vector2D(2, 2);
            const v3 = v1.addX(v2);

            expect(v1.x).toBe(1);
            expect(v1.y).toBe(1);

            expect(v3).not.toBe(v1);
            expect(v3.x).toBe(3);
            expect(v3.y).toBe(1);
        });

        it('the Y-coordinate of another vector', () => {
            const v1 = new Vector2D(1, 1);
            const v2 = new Vector2D(2, 2);
            const v3 = v1.addY(v2);

            expect(v1.x).toBe(1);
            expect(v1.y).toBe(1);

            expect(v3).not.toBe(v1);
            expect(v3.x).toBe(1);
            expect(v3.y).toBe(3);
        });

        it('a scalar value to the coordinates', () => {
            const v1 = new Vector2D(1, 1);
            const v2 = v1.addScalar(2);

            expect(v1.x).toBe(1);
            expect(v1.y).toBe(1);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBe(3);
            expect(v2.y).toBe(3);
        });

        it('a scalar value to the X-coordinate', () => {
            const v1 = new Vector2D(1, 1);
            const v2 = v1.addScalarX(2);

            expect(v1.x).toBe(1);
            expect(v1.y).toBe(1);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBe(3);
            expect(v2.y).toBe(1);
        });

        it('a scalar value to the Y-coordinate', () => {
            const v1 = new Vector2D(1, 1);
            const v2 = v1.addScalarY(2);

            expect(v1.x).toBe(1);
            expect(v1.y).toBe(1);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBe(1);
            expect(v2.y).toBe(3);
        });
    });

    describe('can subtract', () => {
        it('the coordinates of another vector', () => {
            const v1 = new Vector2D(1, 1);
            const v2 = new Vector2D(2, 2);
            const v3 = v1.sub(v2);

            expect(v1.x).toBe(1);
            expect(v1.y).toBe(1);

            expect(v3).not.toBe(v1);
            expect(v3.x).toBe(-1);
            expect(v3.y).toBe(-1);
        });

        it('the X-coordinate of another vector', () => {
            const v1 = new Vector2D(1, 1);
            const v2 = new Vector2D(2, 2);
            const v3 = v1.subX(v2);

            expect(v1.x).toBe(1);
            expect(v1.y).toBe(1);

            expect(v3).not.toBe(v1);
            expect(v3.x).toBe(-1);
            expect(v3.y).toBe(1);
        });

        it('the Y-coordinate of another vector', () => {
            const v1 = new Vector2D(1, 1);
            const v2 = new Vector2D(2, 2);
            const v3 = v1.subY(v2);

            expect(v1.x).toBe(1);
            expect(v1.y).toBe(1);

            expect(v3).not.toBe(v1);
            expect(v3.x).toBe(1);
            expect(v3.y).toBe(-1);
        });

        it('a scalar value from the coordinates', () => {
            const v1 = new Vector2D(1, 1);
            const v2 = v1.subScalar(2);

            expect(v1.x).toBe(1);
            expect(v1.y).toBe(1);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBe(-1);
            expect(v2.y).toBe(-1);
        });

        it('a scalar value from the X-coordinate', () => {
            const v1 = new Vector2D(1, 1);
            const v2 = v1.subScalarX(2);

            expect(v1.x).toBe(1);
            expect(v1.y).toBe(1);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBe(-1);
            expect(v2.y).toBe(1);
        });

        it('a scalar value from the Y-coordinate', () => {
            const v1 = new Vector2D(1, 1);
            const v2 = v1.subScalarY(2);

            expect(v1.x).toBe(1);
            expect(v1.y).toBe(1);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBe(1);
            expect(v2.y).toBe(-1);
        });
    });

    describe('can multiply', () => {
        it('by the coordinates of another vector', () => {
            const v1 = new Vector2D(3, 4);
            const v2 = new Vector2D(2, 2);
            const v3 = v1.mul(v2);

            expect(v1.x).toBe(3);
            expect(v1.y).toBe(4);

            expect(v3).not.toBe(v1);
            expect(v3.x).toBe(6);
            expect(v3.y).toBe(8);
        });

        it('by the X-coordinate of another vector', () => {
            const v1 = new Vector2D(3, 4);
            const v2 = new Vector2D(2, 2);
            const v3 = v1.mulX(v2);

            expect(v1.x).toBe(3);
            expect(v1.y).toBe(4);

            expect(v3).not.toBe(v1);
            expect(v3.x).toBe(6);
            expect(v3.y).toBe(4);
        });

        it('by the Y-coordinate of another vector', () => {
            const v1 = new Vector2D(3, 4);
            const v2 = new Vector2D(2, 2);
            const v3 = v1.mulY(v2);

            expect(v1.x).toBe(3);
            expect(v1.y).toBe(4);

            expect(v3).not.toBe(v1);
            expect(v3.x).toBe(3);
            expect(v3.y).toBe(8);
        });

        it('the coordinates by a scalar value', () => {
            const v1 = new Vector2D(3, 4);
            const v2 = v1.mulScalar(3);

            expect(v1.x).toBe(3);
            expect(v1.y).toBe(4);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBe(9);
            expect(v2.y).toBe(12);
        });

        it('the X-coordinate by a scalar value', () => {
            const v1 = new Vector2D(3, 4);
            const v2 = v1.mulScalarX(3);

            expect(v1.x).toBe(3);
            expect(v1.y).toBe(4);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBe(9);
            expect(v2.y).toBe(4);
        });

        it('the Y-coordinate by a scalar value', () => {
            const v1 = new Vector2D(3, 4);
            const v2 = v1.mulScalarY(3);

            expect(v1.x).toBe(3);
            expect(v1.y).toBe(4);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBe(3);
            expect(v2.y).toBe(12);
        });
    });

    describe('can divide', () => {
        it('by the coordinates of another vector', () => {
            const v1 = new Vector2D(6, 8);
            const v2 = new Vector2D(2, 2);
            const v3 = v1.div(v2);

            expect(v1.x).toBe(6);
            expect(v1.y).toBe(8);

            expect(v3).not.toBe(v1);
            expect(v3.x).toBe(3);
            expect(v3.y).toBe(4);
        });

        it('by the X-coordinate of another vector', () => {
            const v1 = new Vector2D(6, 8);
            const v2 = new Vector2D(2, 2);
            const v3 = v1.divX(v2);

            expect(v1.x).toBe(6);
            expect(v1.y).toBe(8);

            expect(v3).not.toBe(v1);
            expect(v3.x).toBe(3);
            expect(v3.y).toBe(8);
        });

        it('by the Y-coordinate of another vector', () => {
            const v1 = new Vector2D(6, 8);
            const v2 = new Vector2D(2, 2);
            const v3 = v1.divY(v2);

            expect(v1.x).toBe(6);
            expect(v1.y).toBe(8);

            expect(v3).not.toBe(v1);
            expect(v3.x).toBe(6);
            expect(v3.y).toBe(4);
        });

        it('the coordinates by a scalar value', () => {
            const v1 = new Vector2D(9, 12);
            const v2 = v1.divScalar(3);

            expect(v1.x).toBe(9);
            expect(v1.y).toBe(12);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBe(3);
            expect(v2.y).toBe(4);
        });

        it('the X-coordinate by a scalar value', () => {
            const v1 = new Vector2D(9, 12);
            const v2 = v1.divScalarX(3);

            expect(v1.x).toBe(9);
            expect(v1.y).toBe(12);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBe(3);
            expect(v2.y).toBe(12);
        });

        it('the Y-coordinate by a scalar value', () => {
            const v1 = new Vector2D(9, 12);
            const v2 = v1.divScalarY(3);

            expect(v1.x).toBe(9);
            expect(v1.y).toBe(12);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBe(9);
            expect(v2.y).toBe(4);
        });
    });

    it('can negates the coordinates', () => {
        const v1 = new Vector2D(3, 4);
        const v2 = v1.negate();

        expect(v1.x).toBe(3);
        expect(v1.y).toBe(4);

        expect(v2).not.toBe(v1);
        expect(v2.x).toBe(-3);
        expect(v2.y).toBe(-4);
    });

    it('can normalize the vector', () => {
        const v1 = new Vector2D(10, 20);
        const v2 = v1.normalize();

        expect(v1.x).toBe(10);
        expect(v1.y).toBe(20);

        expect(v2).not.toBe(v1);
        expect(v2.x).toBe(0.4472135954999579);
        expect(v2.y).toBe(0.8944271909999159);

        const v3 = Vector2D.vector();
        const v4 = v3.normalize();

        expect(v3.x).toBe(0);
        expect(v3.y).toBe(0);

        expect(v4).not.toBe(v2);
        expect(v4.x).toBe(1);
        expect(v4.y).toBe(0);
    });

    it('can extend the length of the vector', () => {
        const v1 = new Vector2D(10, 20);
        const v2 = v1.extend(10);

        expect(v1.x).toBe(10);
        expect(v1.y).toBe(20);

        expect(v2).not.toBe(v1);
        expect(v2.x).toBe(4.47213595499958);
        expect(v2.y).toBe(8.94427190999916);
    });

    it('can create a perpendicular vector', () => {
        const v1 = new Vector2D(10, 20);
        const v2 = v1.ortho();

        expect(v1.x).toBe(10);
        expect(v1.y).toBe(20);

        expect(v2).not.toBe(v1);
        expect(v2.x).toBe(20);
        expect(v2.y).toBe(-10);

        const v3 = Vector2D.vector();
        const v4 = v3.ortho();

        expect(v3.x).toBe(0);
        expect(v3.y).toBe(0);

        expect(v4).not.toBe(v3);
        expect(v4.x).toBe(0);
        expect(v4.y).toBe(-0);
    });

    it('can round the coordinates', () => {
        const v1 = new Vector2D(1.234, 2.567);
        const v2 = v1.round();

        expect(v1.x).toBe(1.234);
        expect(v1.y).toBe(2.567);

        expect(v2).not.toBe(v1);
        expect(v2.x).toBe(1);
        expect(v2.y).toBe(3);
    });

    describe('can compute', () => {
        it('the length of the vector', () => {
            expect(Vector2D.vector(10, 0).length()).toBe(10);
            expect(Vector2D.vector(0, 10).length()).toBe(10);
            expect(Vector2D.vector(10, 10).length()).toBe(14.142135623730951);
        });

        it('the dot product of with another vector', () => {
            const v1 = new Vector2D(3, 4);
            const v2 = new Vector2D(7, 8);

            expect(v1.dot(v2)).toBe(53);
        });

        it('the cross product with another vector', () => {
            const v1 = new Vector2D(3, 4);
            const v2 = new Vector2D(7, 8);

            expect(v1.cross(v2)).toBe(-4);
        });

        it('the euclidean distance to another vector', () => {
            const v1 = new Vector2D(3, 4);
            const v2 = new Vector2D(7, 8);

            expect(v1.distance(v2)).toBe(5.656854249492381);
        });

        it.each([
            [10, 10, 45],
            [10, 0, 0],
            [0, 10, 90]
        ])('the angle of the vector [%s, %s]', (x, y, angle) => {
            const v = new Vector2D(x, y);
            expect(v.angle()).toBe(angle);
        });

        it('the angle between 2 vectors', () => {
            const v1 = new Vector2D(0, 4);
            const v2 = new Vector2D(4, 4);
            expect(v1.angleWith(v2)).toBeCloseTo(45, 5);
        });
    });

    it('can project the coordinates on another vector', () => {
        const v1 = new Vector2D(4, 7);
        const v2 = new Vector2D(8, 4);
        const v3 = v1.projectOn(v2);

        expect(v1.x).toBe(4);
        expect(v1.y).toBe(7);

        expect(v3).not.toBe(v1);
        expect(v3.x).toBe(6);
        expect(v3.y).toBe(3);
    });

    describe('can rotate', () => {
        it('the coordinates around the origin', () => {
            const v1 = new Vector2D(10, 10);
            const v2 = v1.rotate(90);

            expect(v1.x).toBe(10);
            expect(v1.y).toBe(10);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBe(-10);
            expect(v2.y).toBe(10);
        });

        it('the coordinates around the origin to the target angle', () => {
            const v1 = new Vector2D(10, 0);
            const v2 = v1.rotateTo(90);

            expect(v1.x).toBe(10);
            expect(v1.y).toBe(0);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBeCloseTo(0, 5);
            expect(v2.y).toBe(10);
        });

        it('the coordinates around a given center', () => {
            const c = new Vector2D(5, 5);
            const v1 = new Vector2D(10, 10);
            const v2 = v1.rotateAround(90, c);

            expect(v1.x).toBe(10);
            expect(v1.y).toBe(10);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBe(0);
            expect(v2.y).toBe(10);
        });

        it('the coordinates around a given center to the target angle', () => {
            const c = new Vector2D(5, 5);
            const v1 = new Vector2D(10, 0);
            const v2 = v1.rotateAroundTo(90, c);

            expect(v1.x).toBe(10);
            expect(v1.y).toBe(0);

            expect(v2).not.toBe(v1);
            expect(v2.x).toBe(5);
            expect(v2.y).toBe(12.071067811865476);
        });
    });

    describe('can converts the vector', () => {
        it('to a string', () => {
            const v = new Vector2D(3, 4);

            expect(v.toString()).toBe('x: 3, y: 4');
        });

        it('to an array', () => {
            const v = new Vector2D(3, 4);

            expect(v.toArray()).toEqual([3, 4]);
        });

        it('to an object', () => {
            const v = new Vector2D(3, 4);

            expect(v.toObject()).toEqual({ x: 3, y: 4 });
        });
    });

    it('can verify if the vector equals another', () => {
        const v1 = new Vector2D(2, 3);
        const v2 = new Vector2D(2, 3);
        const v3 = new Vector2D(4, 5);

        expect(v1.equals(v2)).toBeTruthy();
        expect(v1.equals(v3)).toBeFalsy();
    });

    describe('has a static property', () => {
        describe('ORIGIN', () => {
            it('which is a vector', () => {
                expect(Vector2D.ORIGIN).toBeInstanceOf(Vector2D);
            });

            it('which represents the origin', () => {
                expect(Vector2D.ORIGIN.x).toBe(0);
                expect(Vector2D.ORIGIN.y).toBe(0);
            });

            it('which is a pure constant', () => {
                // trick to prevent VSCode from complaining about const re-assign
                expect(() => (Vector2D['ORI' + 'GIN'] = true)).toThrow();
                expect(() => (Vector2D.ORIGIN.x = 1)).toThrow();
                expect(() => (Vector2D.ORIGIN.y = 1)).toThrow();
                expect(Vector2D.ORIGIN.x).toBe(0);
                expect(Vector2D.ORIGIN.y).toBe(0);
            });
        });

        describe('vector', () => {
            describe('which creates a vector', () => {
                it('at the origin', () => {
                    const v = Vector2D.vector();

                    expect(v).toBeInstanceOf(Vector2D);
                    expect(v.x).toBe(0);
                    expect(v.y).toBe(0);
                });

                it('at the given cartesian coordinates', () => {
                    const v = Vector2D.vector(1, 2);

                    expect(v).toBeInstanceOf(Vector2D);
                    expect(v.x).toBe(1);
                    expect(v.y).toBe(2);
                });
            });

            it('which creates a different instance on each call', () => {
                const v1 = Vector2D.vector();
                const v2 = Vector2D.vector();

                expect(v1).not.toBe(v2);
            });
        });

        describe('polar', () => {
            describe('which creates a vector', () => {
                it('at the origin', () => {
                    const v = Vector2D.polar();

                    expect(v).toBeInstanceOf(Vector2D);
                    expect(v.x).toBe(0);
                    expect(v.y).toBe(0);
                });

                it('at the given polar coordinates', () => {
                    const v = Vector2D.polar(10, 180);

                    expect(v).toBeInstanceOf(Vector2D);
                    expect(v.x).toBe(-10);
                    expect(v.y).toBeCloseTo(0, 5);
                });

                it('at the given polar coordinates around the given center', () => {
                    const c = new Vector2D(10, 10);
                    const v = Vector2D.polar(10, 90, c);

                    expect(v).toBeInstanceOf(Vector2D);
                    expect(v.x).toBe(10);
                    expect(v.y).toBe(20);
                });
            });

            it('which creates a different instance on each call', () => {
                const v1 = Vector2D.polar();
                const v2 = Vector2D.polar();

                expect(v1).not.toBe(v2);
            });
        });

        describe('fromArray', () => {
            describe('which creates a vector from an array', () => {
                it('at the origin', () => {
                    const v = Vector2D.fromArray();

                    expect(v).toBeInstanceOf(Vector2D);
                    expect(v.x).toBe(0);
                    expect(v.y).toBe(0);
                });

                it('at the given cartesian coordinates', () => {
                    const v = Vector2D.fromArray([1, 2]);

                    expect(v).toBeInstanceOf(Vector2D);
                    expect(v.x).toBe(1);
                    expect(v.y).toBe(2);
                });
            });

            it('which creates a different instance on each call', () => {
                const v1 = Vector2D.fromArray();
                const v2 = Vector2D.fromArray();

                expect(v1).not.toBe(v2);
            });
        });

        describe('fromObject', () => {
            describe('which creates a vector from an array', () => {
                it('at the origin', () => {
                    const v = Vector2D.fromObject();

                    expect(v).toBeInstanceOf(Vector2D);
                    expect(v.x).toBe(0);
                    expect(v.y).toBe(0);
                });

                it('at the given cartesian coordinates', () => {
                    const v = Vector2D.fromObject({ x: 1, y: 2 });

                    expect(v).toBeInstanceOf(Vector2D);
                    expect(v.x).toBe(1);
                    expect(v.y).toBe(2);
                });
            });

            it('which creates a different instance on each call', () => {
                const v1 = Vector2D.fromObject();
                const v2 = Vector2D.fromObject();

                expect(v1).not.toBe(v2);
            });
        });

        describe('toRadians', () => {
            it('which is a function', () => {
                expect(Vector2D.toRadians).toEqual(expect.any(Function));
            });

            it('which converts degrees to radians', () => {
                expect(Vector2D.toRadians(90)).toBe(Math.PI / 2);
                expect(Vector2D.toRadians(180)).toBe(Math.PI);
                expect(Vector2D.toRadians(270)).toBe((Math.PI / 2) * 3);
                expect(Vector2D.toRadians(360)).toBe(Math.PI * 2);
            });
        });

        describe('toDegrees', () => {
            it('which is a function', () => {
                expect(Vector2D.toDegrees).toEqual(expect.any(Function));
            });

            it('which converts radians to degrees', () => {
                expect(Vector2D.toDegrees(Math.PI / 2)).toBe(90);
                expect(Vector2D.toDegrees(Math.PI)).toBe(180);
                expect(Vector2D.toDegrees((Math.PI / 2) * 3)).toBe(270);
                expect(Vector2D.toDegrees(Math.PI * 2)).toBe(360);
            });
        });

        describe('intersect', () => {
            describe('which compute the point at the intersection of 2 lines', () => {
                it('crossing lines', () => {
                    const p1 = new Vector2D(405, 0);
                    const p2 = new Vector2D(405, 10);
                    const p3 = new Vector2D(324, 81);
                    const p4 = new Vector2D(314, 81);
                    const v = Vector2D.intersect(p1, p2, p3, p4);

                    expect(v).toBeInstanceOf(Vector2D);
                    expect(v.x).toBe(405);
                    expect(v.y).toBe(81);
                });

                it('parallel lines', () => {
                    const p1 = new Vector2D(0, 0);
                    const p2 = new Vector2D(10, 10);
                    const p3 = new Vector2D(10, 0);
                    const p4 = new Vector2D(20, 10);
                    const v = Vector2D.intersect(p1, p2, p3, p4);

                    expect(v).toBeNull();
                });
            });
        });
    });
});