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
import { Vector2D } from '../Vector2D.js';

const p1 = new Vector2D(10, 4);
const p2 = new Vector2D(10, 10);
const p3 = new Vector2D(4, 10);
const p4 = new Vector2D(0, 0);
const p5 = new Vector2D(-5, -6);
const p6 = new Vector2D(-10, 7);
const points = [p1, p2, p3, p4, p5, p6];

describe('Polygon2D', () => {
    it('is a class', () => {
        expect(Polygon2D).toEqual(expect.any(Function));
    });

    describe('can build a polygon', () => {
        it('from an empty list of points', () => {
            const polygon = new Polygon2D();

            expect(polygon).toBeInstanceOf(Polygon2D);
            expect(polygon.points).toStrictEqual([]);
        });

        it('from a list of points given in an array', () => {
            const polygon = new Polygon2D(points);

            expect(polygon).toBeInstanceOf(Polygon2D);
            expect(polygon.points).toStrictEqual(points);
        });

        it('from a list of points given as separated parameters', () => {
            const polygon = new Polygon2D(...points);

            expect(polygon).toBeInstanceOf(Polygon2D);
            expect(polygon.points).toStrictEqual(points);
        });

        it('from a list of points given as a mix of Vector2D and Polygon2D', () => {
            const p = new Polygon2D(p3, p4, p5);
            const polygon = new Polygon2D(p1, p2, p, p6);

            expect(polygon).toBeInstanceOf(Polygon2D);
            expect(polygon.points).toStrictEqual(points);
        });

        it('from a list of points given as separated arrays', () => {
            const polygon = new Polygon2D(points.slice(0, 2), points.slice(2));

            expect(polygon).toBeInstanceOf(Polygon2D);
            expect(polygon.points).toStrictEqual(points);
        });

        it('from a list of points given as arrays and separated parameters', () => {
            const polygon = new Polygon2D(points.slice(0, 2), ...points.slice(2));

            expect(polygon).toBeInstanceOf(Polygon2D);
            expect(polygon.points).toStrictEqual(points);
        });
    });

    describe('throws an error', () => {
        it('if a point given at initialization is not a Vector2D', () => {
            expect(() => new Polygon2D(1)).toThrow('The object must be an instance of Vector2D!');
            expect(() => new Polygon2D({ x: 1, y: 2 })).toThrow('The object must be an instance of Vector2D!');
        });

        it('if a point to set is not a Vector2D', () => {
            const polygon = new Polygon2D(points);

            expect(() => polygon.set(0, 1, 2)).toThrow('The object must be an instance of Vector2D!');
            expect(() => polygon.set(0, { x: 1, y: 2 })).toThrow('The object must be an instance of Vector2D!');
        });

        it('if a point is attempted to be set at a wrong index', () => {
            const polygon = new Polygon2D(points);
            expect(() => polygon.set(-1, new Vector2D())).toThrow('The list index is out of bounds!');
            expect(() => polygon.set(6, new Vector2D())).toThrow('The list index is out of bounds!');
        });

        it('if a point to insert is not a Vector2D', () => {
            const polygon = new Polygon2D(points);

            expect(() => polygon.insert(0, 1, 2)).toThrow('The object must be an instance of Vector2D!');
            expect(() => polygon.insert(0, { x: 1, y: 2 })).toThrow('The object must be an instance of Vector2D!');
        });

        it('if a point to add is not a Vector2D', () => {
            const polygon = new Polygon2D(points);

            expect(() => polygon.add(1, 2)).toThrow('The object must be an instance of Vector2D!');
            expect(() => polygon.add({ x: 1, y: 2 })).toThrow('The object must be an instance of Vector2D!');
        });
    });

    it('has a length', () => {
        expect(new Polygon2D().length).toBe(0);
        expect(new Polygon2D(points).length).toBe(6);
    });

    it('implements the iteration protocol', () => {
        const polygon = new Polygon2D(points);

        expect(polygon[Symbol.iterator]).toEqual(expect.any(Function));
        expect(polygon[Symbol.iterator]()).not.toBe(polygon[Symbol.iterator]());
        expect([...polygon]).toStrictEqual(points);
    });

    it('can produce an iterator', () => {
        const polygon = new Polygon2D(points);

        expect(polygon.values).toEqual(expect.any(Function));
        expect(polygon.values()[Symbol.iterator]).toEqual(expect.any(Function));

        expect(polygon.values()).not.toBe(polygon.values());
        expect([...polygon.values()]).toStrictEqual(points);
    });

    it('can walk over its points', () => {
        const polygon = new Polygon2D(points);

        expect(polygon.forEach).toEqual(expect.any(Function));

        const iterator = points[Symbol.iterator]();
        let i = 0;
        const callback = jest.fn().mockImplementation(function (point, index, thisPolygon) {
            expect(this).toBe(polygon);
            expect(thisPolygon).toBe(polygon);
            expect(point).toBe(iterator.next().value);
            expect(index).toBe(i++);
        });

        expect(polygon.forEach(callback)).toBe(polygon);
        expect(callback).toHaveBeenCalledTimes(points.length);
    });

    it('needs a valid callback to walk over points', () => {
        expect(() => new Polygon2D().forEach()).toThrow('A callback function is expected!');
    });

    it('can map its points', () => {
        const polygon = new Polygon2D(points);

        expect(polygon.map).toEqual(expect.any(Function));

        const iterator = points[Symbol.iterator]();
        let i = 0;
        const callback = jest.fn().mockImplementation(function (point, index, thisPolygon) {
            expect(this).toBe(polygon);
            expect(thisPolygon).toBe(polygon);
            expect(point).toBe(iterator.next().value);
            expect(index).toBe(i++);
            return point.mulScalar(10);
        });

        const mapped = polygon.map(callback);
        expect(mapped).not.toBe(polygon);
        expect(mapped).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(points.length);
    });

    it('needs a valid callback to map points', () => {
        expect(() => new Polygon2D().map()).toThrow('A callback function is expected!');
    });

    it('can get a point from a particular index', () => {
        const polygon = new Polygon2D(points);

        expect(polygon.get).toEqual(expect.any(Function));

        expect(polygon.get(0)).toBe(points[0]);
        expect(polygon.get(1)).toBe(points[1]);
        expect(polygon.get(2)).toBe(points[2]);
        expect(polygon.get(3)).toBe(points[3]);
        expect(polygon.get(4)).toBe(points[4]);
        expect(polygon.get(5)).toBe(points[5]);
        expect(polygon.get(6)).toBeUndefined();
    });

    it('can set a point to a particular index', () => {
        const polygon = new Polygon2D(points);

        expect(polygon.set).toEqual(expect.any(Function));

        expect(polygon.set(0, new Vector2D(4, 5))).toBe(polygon);
        expect(polygon.set(1, new Vector2D(18, 15))).toBe(polygon);
        expect(polygon.set(2, new Vector2D(42, 5))).toBe(polygon);
        expect([...polygon]).toMatchSnapshot();
    });

    describe('can insert points', () => {
        describe('from existing vectors', () => {
            it('at a particular index', () => {
                const polygon = new Polygon2D(points);

                expect(polygon.insert).toEqual(expect.any(Function));

                expect(polygon.insert(1, new Vector2D(1, 2), new Vector2D(3, 4))).toBe(polygon);
                expect([...polygon]).toMatchSnapshot();
            });

            it('at the beginning', () => {
                const polygon = new Polygon2D(points);

                expect(polygon.insert).toEqual(expect.any(Function));

                expect(polygon.insert(0, new Vector2D(1, 2), new Vector2D(3, 4))).toBe(polygon);
                expect([...polygon]).toMatchSnapshot();
            });

            it('at the end', () => {
                const polygon = new Polygon2D(points);

                expect(polygon.insert).toEqual(expect.any(Function));

                expect(polygon.insert(6, new Vector2D(1, 2), new Vector2D(3, 4))).toBe(polygon);
                expect([...polygon]).toMatchSnapshot();
            });
        });

        describe('from polygons', () => {
            it('at a particular index', () => {
                const p = new Polygon2D(p4, p5);
                const polygon = new Polygon2D(p1, p2, p3);

                expect(polygon.insert).toEqual(expect.any(Function));

                expect(polygon.insert(1, p, p6)).toBe(polygon);
                expect([...polygon]).toMatchSnapshot();
            });

            it('at the beginning', () => {
                const p = new Polygon2D(p4, p5);
                const polygon = new Polygon2D(p1, p2, p3);

                expect(polygon.insert).toEqual(expect.any(Function));

                expect(polygon.insert(0, p, p6)).toBe(polygon);
                expect([...polygon]).toMatchSnapshot();
            });

            it('at the end', () => {
                const p = new Polygon2D(p4, p5);
                const polygon = new Polygon2D(p1, p2, p3);

                expect(polygon.insert).toEqual(expect.any(Function));

                expect(polygon.insert(3, p, p6)).toBe(polygon);
                expect([...polygon]).toMatchSnapshot();
            });
        });

        describe('from coordinates', () => {
            it('at a particular index', () => {
                const polygon = new Polygon2D(points);

                expect(polygon.insertPoint).toEqual(expect.any(Function));

                expect(polygon.insertPoint(1, 1, 2)).toBe(polygon);
                expect([...polygon]).toMatchSnapshot();
            });

            it('at the beginning', () => {
                const polygon = new Polygon2D(points);

                expect(polygon.insertPoint).toEqual(expect.any(Function));

                expect(polygon.insertPoint(0, 1, 2)).toBe(polygon);
                expect([...polygon]).toMatchSnapshot();
            });

            it('at the end', () => {
                const polygon = new Polygon2D(points);

                expect(polygon.insertPoint).toEqual(expect.any(Function));

                expect(polygon.insertPoint(4, 1, 2)).toBe(polygon);
                expect([...polygon]).toMatchSnapshot();
            });
        });
    });

    describe('can add points to the polygon', () => {
        it('from existing vectors', () => {
            const polygon = new Polygon2D(points);

            expect(polygon.add).toEqual(expect.any(Function));

            expect(polygon.add(new Vector2D(1, 2), new Vector2D(3, 4))).toBe(polygon);
            expect([...polygon]).toMatchSnapshot();
        });

        it('from polygon', () => {
            const p = new Polygon2D(p4, p5);
            const polygon = new Polygon2D(p1, p2, p3);

            expect(polygon.add).toEqual(expect.any(Function));

            expect(polygon.add(p, p6)).toBe(polygon);
            expect([...polygon]).toMatchSnapshot();
        });

        it('from coordinates', () => {
            const polygon = new Polygon2D(points);

            expect(polygon.addPoint).toEqual(expect.any(Function));

            expect(polygon.addPoint(1, 2)).toBe(polygon);
            expect([...polygon]).toMatchSnapshot();
        });
    });

    it('can remove points from a particular index', () => {
        const polygon = new Polygon2D(points);

        expect(polygon.delete).toEqual(expect.any(Function));

        expect(polygon.delete(4, 2)).toBe(2);
        expect(polygon.delete(4)).toBe(0);
        expect([...polygon]).toMatchSnapshot();
    });

    it('can clear the polygon', () => {
        const polygon = new Polygon2D(points);

        expect(polygon.clear).toEqual(expect.any(Function));

        expect([...polygon]).toEqual(points);
        expect(polygon.clear()).toBe(polygon);
        expect([...polygon]).toEqual([]);
    });

    it('can load points from another source', () => {
        const polygon = new Polygon2D();

        expect(polygon.load).toEqual(expect.any(Function));

        expect(polygon.load({})).toBe(polygon);
        expect([...polygon]).toEqual([]);

        expect(
            polygon.load([
                [1, 2],
                [3, 4]
            ])
        ).toBe(polygon);
        expect([...polygon]).toMatchSnapshot();

        expect(polygon.load(points)).toBe(polygon);
        expect([...polygon]).toEqual(points);

        const p = new Polygon2D();
        expect(p.load(polygon)).toBe(p);
        expect([...p]).toEqual(points);
    });

    it('can translate the points', () => {
        const polygon = new Polygon2D(points);

        expect(polygon.translate).toEqual(expect.any(Function));

        expect(polygon.translate(new Vector2D(5, 8))).toMatchSnapshot();
    });

    describe('can rotate the points', () => {
        it('around the origin', () => {
            const polygon = new Polygon2D(points);

            expect(polygon.rotate).toEqual(expect.any(Function));

            expect(polygon.rotate(30)).toMatchSnapshot();
        });

        it('around the given center', () => {
            const polygon = new Polygon2D(points);

            expect(polygon.rotateAround).toEqual(expect.any(Function));

            expect(polygon.rotateAround(30, new Vector2D(5, 8))).toMatchSnapshot();
        });
    });

    describe('can export the points', () => {
        it('to a string', () => {
            const polygon = new Polygon2D(points);

            expect(polygon.toString).toEqual(expect.any(Function));
            expect(polygon.toString()).toMatchSnapshot();
        });

        it('to an array', () => {
            const polygon = new Polygon2D(points);

            expect(polygon.toArray).toEqual(expect.any(Function));
            expect(polygon.toArray()).toEqual(points);
        });
    });

    it('extracts points from an iterator', () => {
        const polygon = new Polygon2D(p3, p4, p5);

        expect(Polygon2D.extractPoints([])).toStrictEqual([]);
        expect(Polygon2D.extractPoints([p1, p2, p3])).toStrictEqual([p1, p2, p3]);
        expect(Polygon2D.extractPoints([p1, p2, polygon, p6])).toStrictEqual([p1, p2, p3, p4, p5, p6]);

        expect(() => Polygon2D.extractPoints({})).toThrow('points is not iterable');
        expect(() => Polygon2D.extractPoints([{}])).toThrow('The object must be an instance of Vector2D!');
    });

    it('can validate a list contains valid points', () => {
        expect(() => Polygon2D.validatePoints(points)).not.toThrow();
        expect(() => Polygon2D.validatePoints([{}])).toThrow('The object must be an instance of Vector2D!');
    });

    it('can validate an object is an instance of the class', () => {
        const polygon = new Polygon2D();
        expect(() => Polygon2D.validateInstance(polygon)).not.toThrow();
        expect(() => Polygon2D.validateInstance({})).toThrow('The object must be an instance of Polygon2D!');
    });
});
