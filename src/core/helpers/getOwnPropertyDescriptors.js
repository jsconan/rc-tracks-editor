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
 * Gets a list of descriptors to copy from a source object to a target object.
 * If the target object is given, the properties that already exist in the target,
 * or in the listed descriptors, will not be copied.
 * @param {object} source - The source object where to extract the property descriptors.
 * @param {object} descriptors - A descriptors map to build.
 * @param {Array} keys - A list of property names to get the descriptor for.
 * @param {object} target - The target object that is expected to receive the properties.
 * @returns {number} - The number of property descriptors that have been added to the descriptors map.
 */
export default (source, descriptors, keys, target = null) => {
    const hasOwn = Object.prototype.hasOwnProperty;
    const len = keys.length;
    let count = 0;
    let i = 0;

    while (i < len) {
        const key = keys[i++];
        if (!target || (!descriptors[key] && !hasOwn.call(target, key))) {
            const descriptor = Object.getOwnPropertyDescriptor(source, key);
            if ('undefined' !== typeof descriptor) {
                descriptors[key] = descriptor;
                count++;
            }
        }
    }

    return count;
};
