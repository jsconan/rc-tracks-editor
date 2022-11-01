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
 * The smallest value allowed to differ from a rounded value.
 * @type {number}
 * @private
 */
const EPSILON = 0.0000000000001;

/**
 * Adjusts a number so that it would not differ less than EPSILON from its rounded value.
 * @param {number} number - The number to adjust.
 * @returns {number} - The adjusted number.
 */
export const adjust = number => {
    const rounded = Math.round(number);
    if (Math.abs(rounded - number) <= EPSILON) {
        return rounded;
    }
    return number;
};

/**
 * Adjusts a value so that it will be comprised between the given boundaries.
 * @param {number} value - The value to adjust.
 * @param {number} min - The minimal possible value.
 * @param {number} max - The maximal possible value.
 * @returns {number} - The adjusted value.
 */
export const between = (value, min, max) => {
    return Math.min(Math.max(min, value), max);
};

/**
 * Increases a value by an amount, keeping it below a limit (say `[0, value, limit - 1]`).
 * If the increased value is above the limit, it will loop to the beginning of the range:
 * - 0 + 1 limit 3 = 1
 * - 1 + 1 limit 3 = 2
 * - 2 + 1 limit 3 = 0
 * If the limit is missing (limit <= 0), the value will increase without limit.
 * @param {number} value - The value to increase.
 * @param {number} amount - The increase amount to add to the value.
 * @param {number} limit - The limit below what keep the value.
 * @returns {number} - The increased value.
 */
export const increase = (value, amount = 1, limit = 0) => {
    if (limit > 0) {
        return (value + limit + amount) % limit;
    }

    return value + amount;
};
