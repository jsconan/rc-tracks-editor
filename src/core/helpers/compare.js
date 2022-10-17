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

/**
 * Compares two strings and returns a number indicating whether the first
 * comes before, or after, or is the same as the second.
 * @param {string} a - The first string to compare.
 * @param {string} b - The second string to compare.
 * @returns {number} - Returns -1 if a < b, or 1 if a > b, or 0 is a = b.
 */
export const compareStrings = (a, b) => String(a).localeCompare(b);

/**
 * Compares two numbers and returns a number indicating whether the first
 * comes before, or after, or is the same as the second.
 * @param {number} a - The first number to compare.
 * @param {number} b - The second number to compare.
 * @returns {number} - Returns a negative number if a < b,
 *                     or a positive number if a > b,
 *                     or 0 is a = b.
 */
export const compareNumbers = (a, b) => Number(a) - Number(b);

/**
 * Compares two values implementing the compare function, and returns a
 * number indicating whether the first comes before, or after, or is the
 * same as the second.
 * @param {compareInterface} a - The first value to compare.
 * @param {compareInterface} b - The second value to compare.
 * @returns {number} - Returns a negative number if a < b,
 *                     or a positive number if a > b,
 *                     or 0 is a = b.
 */
export const compareObjects = (a, b) => a.compare(b);

/**
 * Compares two values and returns a number indicating whether the first
 * comes before, or after, or is the same as the second.
 * @param {*} a - The first value to compare.
 * @param {*} b - The second value to compare.
 * @returns {number} - Returns -1 if a < b, or 1 if a > b, or 0 is a = b.
 */
export const compareGeneric = (a, b) => {
    if (a < b) {
        return -1;
    }

    if (a > b) {
        return 1;
    }

    return 0;
};

/**
 * Compares two values and returns a number indicating whether the first
 * comes before, or after, or is the same as the second.
 * If the first value implements a compare function, it will be called.
 * @param {*} a - The first value to compare.
 * @param {*} b - The second value to compare.
 * @returns {number} - Returns a negative number if a < b,
 *                     or a positive number if a > b,
 *                     or 0 is a = b.
 */
export const compare = (a, b) => {
    const type = typeof a;

    if ('string' === type) {
        return compareStrings(a, b);
    }

    if ('number' === type) {
        return compareNumbers(a, b);
    }

    if (a && 'function' === typeof a.compare) {
        return a.compare(b);
    }

    return compareGeneric(a, b);
};

/**
 * Gets a comparison function with respect to the type of the given value.
 * @param {*} value - A sample value for determining the type and issuing the correct callback.
 * @returns {compareCallback} - Returns a comparison callback for comparing values of the same type.
 */
export const getCompare = value => {
    const type = typeof value;

    if ('string' === type) {
        return compareStrings;
    }

    if ('number' === type) {
        return compareNumbers;
    }

    if (value && 'function' === typeof value.compare) {
        return compareObjects;
    }

    return compareGeneric;
};

/**
 * Callback called for comparing two values. It must return a number
 * indicating whether the first value comes before, or after, or is
 * the same as the second value.
 * @param {*} a - The first value to compare.
 * @param {*} b - The second value to compare.
 * @returns {number} - Returns a negative number if a < b,
 *                     or a positive number if a > b,
 *                     or 0 is a = b.
 * @callback compareCallback
 */

/**
 * @typedef {object} compareInterface
 * @property {compareCallback} compare - Compares two values and returns a
 * number indicating whether the first comes before, or after, or is the
 * same as the second.
 */
