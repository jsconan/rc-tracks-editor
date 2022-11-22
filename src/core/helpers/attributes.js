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
 * Makes sure to get a key/value map of attributes, even is only one is given.
 * @param {*} attributes - The value of the attribute or the list of attributes.
 * @param {string} name - The name of the main attribute.
 * @returns {object} - The key/value map of attributes.
 */
export const attributeList = (attributes, name) => {
    const type = typeof attributes;

    if ('undefined' === type) {
        return {};
    }

    if ('object' !== type) {
        return { [name]: attributes };
    }

    return attributes;
};

/**
 * Makes sure a list of attributes is a key/value map.
 * @param {object} attributes - The attributes as a key/value map.
 * @returns {object} - The list of attributes as a key/value map.
 */
export const flattenAttributeList = attributes => {
    if ('object' !== typeof attributes) {
        return {};
    }

    let list = {};
    Object.keys(attributes).forEach(name => {
        list = { ...list, ...attributeList(attributes[name], name) };
    });
    return list;
};
