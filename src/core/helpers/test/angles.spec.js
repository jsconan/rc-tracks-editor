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

import {
    absDegrees,
    circumference,
    degrees,
    enlargeArc,
    enlargeChord,
    getArcAngle,
    getArcWidth,
    getChordAngle,
    getChordDistance,
    getChordHeight,
    getChordWidth,
    quadrant,
    quadrantAngle,
    quadrantRange,
    toDegrees,
    toRadians
} from '../angles.js';

describe('toRadians', () => {
    it('is a function', () => {
        expect(toRadians).toEqual(expect.any(Function));
    });

    it('converts degrees to radians', () => {
        expect(toRadians(90)).toBe(Math.PI / 2);
        expect(toRadians(180)).toBe(Math.PI);
        expect(toRadians(270)).toBe((Math.PI / 2) * 3);
        expect(toRadians(360)).toBe(Math.PI * 2);
    });
});

describe('toDegrees', () => {
    it('is a function', () => {
        expect(toDegrees).toEqual(expect.any(Function));
    });

    it('converts radians to degrees', () => {
        expect(toDegrees(Math.PI / 2)).toBe(90);
        expect(toDegrees(Math.PI)).toBe(180);
        expect(toDegrees((Math.PI / 2) * 3)).toBe(270);
        expect(toDegrees(Math.PI * 2)).toBe(360);
    });
});

describe('absDegrees', () => {
    it('is a function', () => {
        expect(absDegrees).toEqual(expect.any(Function));
    });

    it.each([
        [60, 60],
        [400, 40],
        [360, 0],
        [720, 0],
        [-60, 300],
        [-400, 320],
        [-360, 0],
        [-720, 0]
    ])('adjusts angles in degrees [%s => %s]', (angle, expected) => {
        expect(absDegrees(angle)).toBe(expected);
    });
});

describe('degrees', () => {
    it('is a function', () => {
        expect(absDegrees).toEqual(expect.any(Function));
    });

    it.each([
        [60, 60],
        [400, 40],
        [360, 360],
        [720, 0],
        [-60, -60],
        [-400, -40],
        [-360, -360],
        [-720, -0]
    ])('adjusts angles in degrees [%s => %s]', (angle, expected) => {
        expect(degrees(angle)).toBe(expected);
    });
});

describe('quadrant', () => {
    it('is a function', () => {
        expect(quadrant).toEqual(expect.any(Function));
    });

    it.each([
        [60, 0],
        [100, 1],
        [200, 2],
        [300, 3],
        [400, 0],
        [-300, 0],
        [-200, 1],
        [-100, 2],
        [-60, 3],
        [-400, 3]
    ])('tells in which quadrant is the angle %s', (angle, expected) => {
        expect(quadrant(angle)).toBe(expected);
    });
});

describe('quadrantAngle', () => {
    it('is a function', () => {
        expect(quadrantAngle).toEqual(expect.any(Function));
    });

    it.each([
        [0, 0],
        [40, 0],
        [44.99999999999994, 90],
        [45, 90],
        [50, 90],
        [90, 90],
        [130, 90],
        [134.99999999999994, 180],
        [135, 180],
        [140, 180],
        [180, 180],
        [220, 180],
        [240, 270],
        [270, 270],
        [310, 270],
        [320, 360],
        [360, 360]
    ])('returns the quadrant angle for %s', (angle, expected) => {
        expect(quadrantAngle(angle)).toBe(expected);
    });
});

describe('quadrantRange', () => {
    it('is a function', () => {
        expect(quadrantRange).toEqual(expect.any(Function));
    });

    it.each([
        [0, 90, null],
        [-45, 45, 0],
        [30, 120, 90],
        [10, 100, 90],
        [44.99999999999994, 134.99999999999994, 90],
        [100, 180, null],
        [100, 190, 180],
        [210, 300, 270],
        [210, 270, null],
        [280, 370, 360],
        [280, 360, null]
    ])('returns the quadrant angles for the range [%s : %s]', (start, end, expected) => {
        expect(quadrantRange(start, end)).toEqual(expected);
    });
});

describe('circumference', () => {
    it('is a function', () => {
        expect(circumference).toEqual(expect.any(Function));
    });

    it.each([
        [0, 0],
        [100, 628.3185307179587],
        [50, 314.1592653589793],
        [-100, -628.3185307179587],
        [-50, -314.1592653589793]
    ])('gets the circumference of the circle having a radius (%s)', (radius, expected) => {
        expect(circumference(radius)).toEqual(expected);
    });
});

describe('getArcWidth', () => {
    it('is a function', () => {
        expect(getArcWidth).toEqual(expect.any(Function));
    });

    it.each([
        [90, 100, 157.07963267948966],
        [450, 100, 157.07963267948966],
        [45, 100, 78.53981633974483],
        [60, 100, 104.71975511965977],
        [-60, 100, 104.71975511965977]
    ])('gets the width of the arc defined by an angle (%s) and a radius (%s)', (angle, radius, expected) => {
        expect(getArcWidth(angle, radius)).toEqual(expected);
    });
});

describe('getArcAngle', () => {
    it('is a function', () => {
        expect(getArcAngle).toEqual(expect.any(Function));
    });

    it.each([
        [0, 100, 0],
        [100, 0, 0],
        [157.07963267948966, 100, 90],
        [78.53981633974483, 100, 45],
        [-104.71975511965977, 100, -59.99999999999999],
        [700, 100, 360],
        [-700, 100, 360]
    ])('gets the angle of the arc defined by a width (%s) and a radius (%s)', (width, radius, expected) => {
        expect(getArcAngle(width, radius)).toEqual(expected);
    });
});

describe('getChordWidth', () => {
    it('is a function', () => {
        expect(getChordWidth).toEqual(expect.any(Function));
    });

    it.each([
        [90, 100, 141.42135623730948],
        [450, 100, 141.42135623730948],
        [45, 100, 76.53668647301795],
        [60, 100, 99.99999999999999],
        [-60, 100, 99.99999999999999]
    ])('gets the width of the chord defined by an angle (%s) and a radius (%s)', (angle, radius, expected) => {
        expect(getChordWidth(angle, radius)).toEqual(expected);
    });
});

describe('getChordDistance', () => {
    it('is a function', () => {
        expect(getChordWidth).toEqual(expect.any(Function));
    });

    it.each([
        [90, 100, 70.71067811865476],
        [450, 100, 70.71067811865476],
        [45, 100, 92.38795325112868],
        [-60, 100, 86.60254037844388]
    ])('gets the distance to the chord defined by an angle (%s) and a radius (%s)', (angle, radius, expected) => {
        expect(getChordDistance(angle, radius)).toEqual(expected);
    });
});

describe('getChordHeight', () => {
    it('is a function', () => {
        expect(getChordWidth).toEqual(expect.any(Function));
    });

    it.each([
        [90, 100, 29.289321881345245],
        [450, 100, 29.289321881345245],
        [45, 100, 7.612046748871322],
        [-60, 100, 13.397459621556123]
    ])('gets the height of the chord defined by an angle (%s) and a radius (%s)', (angle, radius, expected) => {
        expect(getChordHeight(angle, radius)).toEqual(expected);
    });
});

describe('getChordAngle', () => {
    it('is a function', () => {
        expect(getArcAngle).toEqual(expect.any(Function));
    });

    it.each([
        [0, 100, 0],
        [100, 0, 0],
        [141.42135623730948, 100, 89.99999999999999],
        [76.53668647301795, 100, 45],
        [-99.99999999999999, 100, -59.99999999999999],
        [100, 100, 60.00000000000001],
        [200, 100, 180],
        [-200, 100, 180],
        [350, 100, 180],
        [-350, 100, 180]
    ])('gets the angle of the chord defined by a width (%s) and a radius (%s)', (width, radius, expected) => {
        expect(getChordAngle(width, radius)).toEqual(expected);
    });
});

describe('enlargeArc', () => {
    it('is a function', () => {
        expect(enlargeArc).toEqual(expect.any(Function));
    });

    it.each([
        [90, 100, 0, 90],
        [90, 100, -10, 84.27042204869177],
        [90, 100, 10, 95.72957795130823],
        [450, 100, 10, 95.72957795130823],
        [45, 100, 0, 45],
        [45, 100, 10, 50.72957795130823],
        [-45, 100, 10, 50.72957795130823],
        [45, 10, 100, 360],
        [45, 10, -100, 0],
        [-45, 10, 100, 360]
    ])('enlarges an arc defined by an angle (%s) and a radius (%s) to %s', (angle, radius, addition, expected) => {
        expect(enlargeArc(angle, radius, addition)).toEqual(expected);
    });
});

describe('enlargeChord', () => {
    it('is a function', () => {
        expect(enlargeChord).toEqual(expect.any(Function));
    });

    it.each([
        [90, 100, 0, 90],
        [90, 100, -10, 82.15918193491969],
        [90, 100, 10, 98.41959545122378],
        [450, 100, 10, 98.41959545122378],
        [45, 100, 0, 45],
        [45, 100, 10, 51.27595686739886],
        [-45, 100, 10, 51.27595686739886],
        [45, 10, 100, 180],
        [45, 10, -100, 0],
        [-45, 10, 100, 180]
    ])('enlarges a chord defined by an angle (%s) and a radius (%s) to %s', (angle, radius, addition, expected) => {
        expect(enlargeChord(angle, radius, addition)).toEqual(expected);
    });
});
