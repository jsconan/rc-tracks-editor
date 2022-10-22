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

const points = [new Vector2D(10, 4), new Vector2D(10, 10), new Vector2D(4, 10), new Vector2D(0, 0)];

describe('Polygon2D', () => {
    it('is a class', () => {
        expect(Polygon2D).toEqual(expect.any(Function));
    });

    describe('can build a polygon', () => {
        it('from an empty list of points', () => {
            const p = new Polygon2D();

            expect(p).toBeInstanceOf(Polygon2D);
            expect(p.points).toStrictEqual([]);
        });

        it('from a list of points given in an array', () => {
            const p = new Polygon2D(points);

            expect(p).toBeInstanceOf(Polygon2D);
            expect(p.points).toStrictEqual(points);
        });

        it('from a list of points given as separated parameters', () => {
            const p = new Polygon2D(...points);

            expect(p).toBeInstanceOf(Polygon2D);
            expect(p.points).toStrictEqual(points);
        });

        it('from a list of points given as separated arrays', () => {
            const p = new Polygon2D(points.slice(0, 2), points.slice(2));

            expect(p).toBeInstanceOf(Polygon2D);
            expect(p.points).toStrictEqual(points);
        });

        it('from a list of points given as arrays and separated parameters', () => {
            const p = new Polygon2D(points.slice(0, 2), ...points.slice(2));

            expect(p).toBeInstanceOf(Polygon2D);
            expect(p.points).toStrictEqual(points);
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
            expect(() => polygon.set(4, new Vector2D())).toThrow('The list index is out of bounds!');
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
        expect(new Polygon2D(points).length).toBe(4);
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
        expect(polygon.get(4)).toBeUndefined();
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

            expect(polygon.insert(4, new Vector2D(1, 2), new Vector2D(3, 4))).toBe(polygon);
            expect([...polygon]).toMatchSnapshot();
        });
    });

    it('can add points to the polygon', () => {
        const polygon = new Polygon2D(points);

        expect(polygon.add).toEqual(expect.any(Function));

        expect(polygon.add(new Vector2D(1, 2), new Vector2D(3, 4))).toBe(polygon);
        expect([...polygon]).toMatchSnapshot();
    });

    it('can remove points from a particular index', () => {
        const polygon = new Polygon2D(points);

        expect(polygon.delete).toEqual(expect.any(Function));

        expect(polygon.delete(2, 2)).toBe(2);
        expect(polygon.delete(2)).toBe(0);
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

        expect(polygon.load(points)).toBe(polygon);
        expect([...polygon]).toEqual(points);
    });

    it('can export the points to an array', () => {
        const polygon = new Polygon2D(points);

        expect(polygon.toArray).toEqual(expect.any(Function));
        expect(polygon.toArray()).toEqual(points);
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
