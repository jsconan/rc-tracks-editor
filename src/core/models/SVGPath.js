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

import { STRAIGHT_ANGLE } from '../helpers';
import { Polygon2D } from './Polygon2D.js';
import { SVGPathCommand } from './SVGPathCommand.js';
import { Vector2D } from './Vector2D.js';

/**
 * A list of commands that can be replaced when a similar command is pushed.
 * @type {string[]}
 * @private
 */
const replaceableCommands = ['M', 'Z'];

/**
 * Represents a SVG path.
 */
export class SVGPath {
    /**
     * The list of path commands.
     * @type {SVGPathCommand[]}
     * @private
     */
    #commands = [];

    /**
     * The start coordinates.
     * @type {Vector2D}
     * @private
     */
    #start = null;

    /**
     * The current coordinates.
     * @type {Vector2D}
     * @private
     */
    #current = null;

    /**
     * Extracts a list of points.
     * It supports either a single point given by separate coordinates X and Y, or a list of Vector2D.
     * @param {*} points - The list of points.
     * @param {boolean} filterDuplicate - Whether the points equal to the previous one should be discarded not not.
     * @param {boolean|number} relative - Whether the points are relative to the current position or not.
     * When a number is given it allows grouping points related to the same origin
     * (ex: 3 means the current point is updated after each group of 3 points).
     * @returns {Vector2D[]} - Returns the list of extracted points.
     * @throws {TypeError} - If a point is not a Vector2D.
     * @private
     */
    #extractPoints(points, filterDuplicate = false, relative = false) {
        let list = [];
        let previous = this.#current;
        const group = 'number' === typeof relative;
        let remaining = relative;

        if (points.length === 2 && 'number' === typeof points[0]) {
            points = [Vector2D.fromArray(points)];
        }

        for (let point of points) {
            Vector2D.validateInstance(point);

            if (relative) {
                point = point.add(previous);
            }

            if (filterDuplicate && point.equals(previous)) {
                continue;
            }

            if (!group || --remaining === 0) {
                previous = point;
                remaining = relative;
            }

            list.push(point);
        }

        return list;
    }

    /**
     * Adds a command or replaces the last one if similar.
     * @param {SVGPathCommand} command
     * @private
     */
    #addOrReplaceCommand(command) {
        const last = this.#commands.length - 1;
        if (last > -1 && this.#commands[last].name === command.name) {
            this.#commands[last] = command;
        } else {
            this.#commands.push(command);
        }
    }

    /**
     * Creates a SVG path.
     */
    constructor() {
        this.#start = new Vector2D(0, 0);
        this.#current = this.#start;
    }

    /**
     * The number of commands in the path.
     * @type {number}
     */
    get length() {
        return this.#commands.length;
    }

    /**
     * The list of path commands.
     * @type {SVGPathCommand[]}
     */
    get commands() {
        return [...this.#commands];
    }

    /**
     * The start coordinates.
     * @type {Vector2D}
     */
    get start() {
        return this.#start;
    }

    /**
     * The current coordinates.
     * @type {Vector2D}
     */
    get current() {
        return this.#current;
    }

    /**
     * Closes the path. No more commands will be accepted.
     * @returns {SVGPath} - Chains the instance.
     */
    close() {
        this.#addOrReplaceCommand(new SVGPathCommand('Z'));
        this.#current = this.#start;

        return this;
    }

    /**
     * Adds a MoveTo command using absolute coordinates.
     * @param {...number|...Vector2D} points - The absolute coordinates for each point.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    moveTo(...points) {
        points = this.#extractPoints(points);
        if (!points.length) {
            return this;
        }

        const initial = this.#start === this.#current;

        this.#current = points[points.length - 1];
        this.#addOrReplaceCommand(new SVGPathCommand('M', this.#current));

        if (initial) {
            this.#start = this.#current;
        }

        return this;
    }

    /**
     * Adds a MoveTo command using relative coordinates.
     * @param {...number|...Vector2D} points - The relative coordinates for each point.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    moveBy(...points) {
        points = this.#extractPoints(points, false, true);
        if (!points.length) {
            return this;
        }

        const initial = this.#start === this.#current;

        this.#current = points[points.length - 1];
        this.#addOrReplaceCommand(new SVGPathCommand('M', this.#current));

        if (initial) {
            this.#start = this.#current;
        }

        return this;
    }

    /**
     * Adds a LineTo command using absolute coordinates.
     * @param {...number|...Vector2D} points - The absolute coordinates for each point.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    lineTo(...points) {
        points = this.#extractPoints(points, true);
        if (!points.length) {
            return this;
        }

        this.#current = points[points.length - 1];
        this.#commands.push(new SVGPathCommand('L', ...points));

        return this;
    }

    /**
     * Adds a LineTo command using relative coordinates.
     * @param {...number|...Vector2D} points - The relative coordinates for each point.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    lineBy(...points) {
        points = this.#extractPoints(points, true, true);
        if (!points.length) {
            return this;
        }

        this.#current = points[points.length - 1];
        this.#commands.push(new SVGPathCommand('L', ...points));

        return this;
    }

    /**
     * Adds an horizontal LineTo command using absolute coordinates.
     * @param {number|Vector2D} x - The X-coordinate, or a vector containing the coordinate.
     * @returns {SVGPath} - Chains the instance.
     */
    horizontalLineTo(x = 0) {
        const [point] = this.#extractPoints([x, x]);
        if (point.x === this.#current.x) {
            return this;
        }

        this.#current = this.#current.copyX(point);
        this.#addOrReplaceCommand(new SVGPathCommand('H', this.#current.x));

        return this;
    }

    /**
     * Adds an horizontal LineTo command using relative coordinates.
     * @param {number|Vector2D} x - The X-coordinate, or a vector containing the coordinate.
     * @returns {SVGPath} - Chains the instance.
     */
    horizontalLineBy(x = 0) {
        const [point] = this.#extractPoints([x, x]);
        if (!point.x) {
            return this;
        }

        this.#current = this.#current.addX(point);
        this.#addOrReplaceCommand(new SVGPathCommand('H', this.#current.x));

        return this;
    }

    /**
     * Adds a vertical LineTo command using absolute coordinates.
     * @param {number|Vector2D} y - The Y-coordinate, or a vector containing the coordinate.
     * @returns {SVGPath} - Chains the instance.
     */
    verticalLineTo(y = 0) {
        const [point] = this.#extractPoints([y, y]);
        if (point.y === this.#current.y) {
            return this;
        }

        this.#current = this.#current.copyY(point);
        this.#addOrReplaceCommand(new SVGPathCommand('V', this.#current.y));

        return this;
    }

    /**
     * Adds a vertical LineTo command using relative coordinates.
     * @param {number|Vector2D} y - The Y-coordinate, or a vector containing the coordinate.
     * @returns {SVGPath} - Chains the instance.
     */
    verticalLineBy(y = 0) {
        const [point] = this.#extractPoints([y, y]);
        if (!point.y) {
            return this;
        }

        this.#current = this.#current.addY(point);
        this.#addOrReplaceCommand(new SVGPathCommand('V', this.#current.y));

        return this;
    }

    /**
     * Adds a Cubic Bezier Curve command using absolute coordinates.
     * @param {...Vector2D} points - The absolute coordinates for each control point.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    cubicBezierCurveTo(...points) {
        points = this.#extractPoints(points);
        if (!points.length) {
            return this;
        }

        this.#current = points[points.length - 1];
        this.#commands.push(new SVGPathCommand('C', ...points));

        return this;
    }

    /**
     * Adds a Cubic Bezier Curve command using relative coordinates.
     * @param {...Vector2D} points - The relative coordinates for each control point.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    cubicBezierCurveBy(...points) {
        points = this.#extractPoints(points, false, 3);
        if (!points.length) {
            return this;
        }

        this.#current = points[points.length - 1];
        this.#commands.push(new SVGPathCommand('C', ...points));

        return this;
    }

    /**
     * Adds a Smooth Bezier Curve command using absolute coordinates.
     * @param {...Vector2D} points - The absolute coordinates for each control point.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    smoothBezierCurveTo(...points) {
        points = this.#extractPoints(points);
        if (!points.length) {
            return this;
        }

        this.#current = points[points.length - 1];
        this.#commands.push(new SVGPathCommand('S', ...points));

        return this;
    }

    /**
     * Adds a Smooth Bezier Curve command using relative coordinates.
     * @param {...Vector2D} points - The relative coordinates for each control point.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    smoothBezierCurveBy(...points) {
        points = this.#extractPoints(points, false, 2);
        if (!points.length) {
            return this;
        }

        this.#current = points[points.length - 1];
        this.#commands.push(new SVGPathCommand('S', ...points));

        return this;
    }

    /**
     * Adds a Quadratic Bezier Curve command using absolute coordinates.
     * @param {...Vector2D} points - The absolute coordinates for each control point.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    quadraticBezierCurveTo(...points) {
        points = this.#extractPoints(points);
        if (!points.length) {
            return this;
        }

        this.#current = points[points.length - 1];
        this.#commands.push(new SVGPathCommand('Q', ...points));

        return this;
    }

    /**
     * Adds a Quadratic Bezier Curve command using relative coordinates.
     * @param {...Vector2D} points - The relative coordinates for each control point.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    quadraticBezierCurveBy(...points) {
        points = this.#extractPoints(points, false, 2);
        if (!points.length) {
            return this;
        }

        this.#current = points[points.length - 1];
        this.#commands.push(new SVGPathCommand('Q', ...points));

        return this;
    }

    /**
     * Adds a Smooth Quadratic Bezier Curve command using absolute coordinates.
     * @param {...Vector2D} points - The absolute coordinates for each control point.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    smoothQuadraticBezierCurveTo(...points) {
        points = this.#extractPoints(points, true);
        if (!points.length) {
            return this;
        }

        this.#current = points[points.length - 1];
        this.#commands.push(new SVGPathCommand('T', ...points));

        return this;
    }

    /**
     * Adds a Smooth Quadratic Bezier Curve command using relative coordinates.
     * @param {...Vector2D} points - The relative coordinates for each control point.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    smoothQuadraticBezierCurveBy(...points) {
        points = this.#extractPoints(points, true, true);
        if (!points.length) {
            return this;
        }

        this.#current = points[points.length - 1];
        this.#commands.push(new SVGPathCommand('T', ...points));

        return this;
    }

    /**
     * Adds an Elliptical Arc Curve command using absolute coordinates.
     * @param {number|Vector2D} radius - The radii of the ellipse.
     * @param {number} angle - A rotation (in degrees) of the ellipse relative to the x-axis.
     * @param {number} largeArc - Allows to chose one of the large arc (1) or small arc (0).
     * @param {number} sweep - Allows to chose one of the clockwise turning arc (1) or counterclockwise turning arc (0).
     * @param {Vector2D} point - The end coordinates for the arc.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    ellipticalArcCurveTo(radius, angle, largeArc, sweep, point) {
        if ('number' === typeof radius) {
            radius = new Vector2D(radius, radius);
        }

        Vector2D.validateInstance(radius);
        Vector2D.validateInstance(point);

        this.#current = point;
        this.#commands.push(new SVGPathCommand('A', radius, angle, largeArc, sweep, this.#current));

        return this;
    }

    /**
     * Adds an Elliptical Arc Curve command using relative coordinates.
     * @param {number|Vector2D} radius - The radii of the ellipse.
     * @param {number} angle - A rotation (in degrees) of the ellipse relative to the x-axis.
     * @param {number} largeArc - Allows to chose one of the large arc (1) or small arc (0).
     * @param {number} sweep - Allows to chose one of the clockwise turning arc (1) or counterclockwise turning arc (0).
     * @param {Vector2D} point - The end coordinates for the arc.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    ellipticalArcCurveBy(radius, angle, largeArc, sweep, point) {
        if ('number' === typeof radius) {
            radius = new Vector2D(radius, radius);
        }

        Vector2D.validateInstance(radius);
        Vector2D.validateInstance(point);

        this.#current = this.#current.add(point);
        this.#commands.push(new SVGPathCommand('A', radius, angle, largeArc, sweep, this.#current));

        return this;
    }

    /**
     * Adds an Elliptical Arc Curve command using the given radius and angles.
     * @param {number|Vector2D} radius - The radii of the ellipse.
     * @param {number} startAngle - The start angle of the arc.
     * @param {number} endAngle - The end angle of the arc.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    arcCurve(radius, startAngle, endAngle) {
        if ('number' === typeof radius) {
            radius = new Vector2D(radius, radius);
        }

        Vector2D.validateInstance(radius);

        const angle = endAngle - startAngle;
        const center = this.#current.add(Vector2D.polar(radius, startAngle + STRAIGHT_ANGLE));
        this.#current = center.add(Vector2D.polar(radius, endAngle));

        const largeArc = Math.abs(angle) > STRAIGHT_ANGLE ? 1 : 0;
        const sweep = angle < 0 ? 0 : 1;

        this.#commands.push(new SVGPathCommand('A', radius, 0, largeArc, sweep, this.#current));

        return this;
    }

    /**
     * Adds an Elliptical Arc Curve command using the given radius and angle and absolute coordinates.
     * @param {number|Vector2D} radius - The radii of the ellipse.
     * @param {number} angle - The angle of the arc.
     * @param {Vector2D} point - The end coordinates for the arc.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    arcCurveTo(radius, angle, point) {
        if ('number' === typeof radius) {
            radius = new Vector2D(radius, radius);
        }

        Vector2D.validateInstance(radius);
        Vector2D.validateInstance(point);

        const largeArc = Math.abs(angle) > STRAIGHT_ANGLE ? 1 : 0;
        const sweep = angle < 0 ? 1 : 0;

        this.#current = point;
        this.#commands.push(new SVGPathCommand('A', radius, 0, largeArc, sweep, this.#current));

        return this;
    }

    /**
     * Adds an Elliptical Arc Curve command using the given radius and angle and relative coordinates.
     * @param {number|Vector2D} radius - The radii of the ellipse.
     * @param {number} angle - The angle of the arc.
     * @param {Vector2D} point - The end coordinates for the arc.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If a point is not a Vector2D.
     */
    arcCurveBy(radius, angle, point) {
        if ('number' === typeof radius) {
            radius = new Vector2D(radius, radius);
        }

        Vector2D.validateInstance(radius);
        Vector2D.validateInstance(point);

        const largeArc = Math.abs(angle) > STRAIGHT_ANGLE ? 1 : 0;
        const sweep = angle < 0 ? 1 : 0;

        this.#current = this.#current.add(point);
        this.#commands.push(new SVGPathCommand('A', radius, 0, largeArc, sweep, this.#current));

        return this;
    }

    /**
     * Adds a MoveTo command using absolute polar coordinates.
     * @param {number|Vector2D} radius - The radius coordinate.
     * Elliptic polar coordinates can be given through a vector.
     * @param {number} angle - The angle coordinate, given in degrees.
     * @param {Vector2D} center - The coordinates of the center.
     * @returns {SVGPath} - Chains the instance.
     */
    polarMoveTo(radius, angle, center = Vector2D.ORIGIN) {
        return this.moveTo(Vector2D.polar(radius, angle, center));
    }

    /**
     * Adds a MoveTo command using relative polar coordinates.
     * @param {number|Vector2D} radius - The radius coordinate.
     * Elliptic polar coordinates can be given through a vector.
     * @param {number} angle - The angle coordinate, given in degrees.
     * @param {Vector2D} center - The coordinates of the center.
     * @returns {SVGPath} - Chains the instance.
     */
    polarMoveBy(radius, angle, center = Vector2D.ORIGIN) {
        return this.moveBy(Vector2D.polar(radius, angle, center));
    }

    /**
     * Adds a LineTo command using absolute polar coordinates.
     * @param {number|Vector2D} radius - The radius coordinate.
     * Elliptic polar coordinates can be given through a vector.
     * @param {number} angle - The angle coordinate, given in degrees.
     * @param {Vector2D} center - The coordinates of the center.
     * @returns {SVGPath} - Chains the instance.
     */
    polarLineTo(radius, angle, center = Vector2D.ORIGIN) {
        return this.lineTo(Vector2D.polar(radius, angle, center));
    }

    /**
     * Adds a LineTo command using relative polar coordinates.
     * @param {number|Vector2D} radius - The radius coordinate.
     * Elliptic polar coordinates can be given through a vector.
     * @param {number} angle - The angle coordinate, given in degrees.
     * @param {Vector2D} center - The coordinates of the center.
     * @returns {SVGPath} - Chains the instance.
     */
    polarLineBy(radius, angle, center = Vector2D.ORIGIN) {
        return this.lineBy(Vector2D.polar(radius, angle, center));
    }

    /**
     * Renders the SVG path.
     * @returns {string} - The rendered SVG path.
     */
    toString() {
        return this.#commands.join(' ').trim();
    }

    /**
     * Adds commands from another path.
     * @param {SVGPath} path - The path from which takes the commands.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If the path is not a SVGPath.
     */
    addPath(path) {
        SVGPath.validateInstance(path);

        if (!path.#commands.length) {
            return this;
        }

        let start = this.#start;
        let current = this.#current;
        let head = this.#commands.length - 1;
        let previous = this.#commands[head];

        for (const command of path.#commands) {
            const { name } = command;
            if (previous && previous.name === name && replaceableCommands.includes(name)) {
                this.#commands[head] = command;
            } else {
                this.#commands.push(command);
                head++;
            }

            previous = command;

            if (name === 'Z') {
                current = start;
            } else {
                const initial = start === current;
                const { parameters } = command;
                current = parameters[parameters.length - 1];

                if (initial && name === 'M') {
                    start = current;
                }
            }
        }

        this.#start = start;
        this.#current = current;

        return this;
    }

    /**
     * Adds a polygon to the path.
     * @param {Polygon2D} polygon - The polygon from which takes the points.
     * @returns {SVGPath} - Chains the instance.
     * @throws {TypeError} - If the polygon is not a Polygon2D.
     */
    addPolygon(polygon) {
        Polygon2D.validateInstance(polygon);

        const points = polygon.points;
        if (!points.length) {
            return this;
        }

        if (!this.#commands.length) {
            this.moveTo(points[0]);
        }

        return this.lineTo(...points);
    }

    /**
     * Creates a SVG path from a polygon.
     * @param {Polygon2D} polygon - The polygon from which create the path.
     * @returns {SVGPath} - The created path.
     * @throws {TypeError} - If the polygon is not a Polygon2D.
     */
    static fromPolygon(polygon) {
        const path = new this();
        return path.addPolygon(polygon).close();
    }

    /**
     * Validates that the given object is an instance of the class.
     * Otherwise, an error is thrown.
     * @param {object} object - The instance to validate.
     * @throws {TypeError} - If the given object is not a valid instance.
     */
    static validateInstance(object) {
        if (!(object instanceof this)) {
            throw new TypeError(`The object must be an instance of ${this.name}!`);
        }
    }
}
