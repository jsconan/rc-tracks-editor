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

import { alternate } from '../../core/helpers';

/**
 * A list of colors for the barriers.
 * @type {string[]}
 */
const barrierColors = ['even', 'odd'];

/**
 * Returns the presentation attributes for a barrier element at the given position.
 * @param {number} i - The position of the barrier element.
 * @returns {object} - The color for the barrier element.
 */
export const barrierColor = i => ({
    fill: `var(--color-${alternate(i, barrierColors)})`
});

/**
 * Returns the presentation attributes for a tile ground.
 * @returns {object}
 */
export const groundColor = () => ({
    fill: 'var(--color-ground)',
    stroke: {
        stroke: 'var(--color-separator)',
        'stroke-width': 'var(--stroke-width-tile)'
    }
});

/**
 * Returns the presentation attributes of a tile overlay for a an selected state.
 * @returns {object}
 */
export const selectedColor = () => ({
    fill: 'var(--color-bg-selected)',
    stroke: {
        stroke: 'var(--color-fg-selected)',
        'stroke-width': 'var(--stroke-width-selected)'
    }
});

/**
 * Returns the presentation attributes of a tile overlay for a an hovered state.
 * @returns {object}
 */
export const hoveredColor = () => ({
    fill: 'var(--color-bg-hovered)',
    stroke: {
        stroke: 'var(--color-fg-hovered)',
        'stroke-width': 'var(--stroke-width-hovered)'
    }
});

/**
 * Returns the presentation attributes of a tile overlay for a a focused state.
 * @returns {object}
 */
export const focusedColor = () => ({
    fill: 'var(--color-bg-focused)',
    stroke: {
        stroke: 'var(--color-fg-focused)',
        'stroke-width': 'var(--stroke-width-focused)'
    }
});
