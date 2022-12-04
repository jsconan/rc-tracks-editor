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

import { SVGPath } from '../models';

/**
 * Builds the SVG path for rendering a straight element.
 * @param {number} x - The X-coordinate of the top left of the element.
 * @param {number} y - The Y-coordinate of the top left of the element.
 * @param {number} width - The width of the element.
 * @param {number} height - The height of the element.
 * @param {number} addition - An additional distance added to the outline.
 * @returns {SVGPath} - Returns the path for the shape.
 */
export function straightElementPath(x, y, width, height, addition = 0) {
    const w = width + 2 * addition;
    const h = height + 2 * addition;

    return new SVGPath()
        .moveTo(x - addition, y - addition)
        .horizontalLineBy(w)
        .verticalLineBy(h)
        .horizontalLineBy(-w)
        .close();
}
