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

import getOwnPropertyDescriptors from './getOwnPropertyDescriptors.js';

/**
 * Picks up a list of properties from several source objects into a target object. It copies all properties and functions,
 * including accessors, symbols, and non enumerable properties. If the property or the function already exists in the target,
 * it will be overwritten.
 * @param {object} target - The target object to augment from the properties and methods supplied by the source objects.
 * @param {string[]} properties - A list of properties to pick up from the source objects.
 * @param  {...object} sources - A list of source objects that defines properties and methods that will be added to the target.
 * @returns {object} - Returns the target object.
 */
export default (target, properties, ...sources) => {
    const descriptors = {};
    const len = sources.length;
    let count = 0;
    let i = 0;

    while (i < len) {
        const source = sources[i++];
        count += getOwnPropertyDescriptors(source, descriptors, properties);
    }

    if (count) {
        Object.defineProperties(target, descriptors);
    }

    return target;
};
