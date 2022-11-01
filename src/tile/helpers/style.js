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
 * The name of the style for the tile barriers.
 * @type {string}
 */
export const TILE_STYLE_BARRIER = 'barrier';

/**
 * The name of the style for the tile ground.
 * @type {string}
 */
export const TILE_STYLE_GROUND = 'ground';

/**
 * The name of the style for the selected tile.
 * @type {string}
 */
export const TILE_STYLE_SELECTED = 'selected';

/**
 * The name of the style for the hovered tile.
 * @type {string}
 */
export const TILE_STYLE_HOVERED = 'hovered';

/**
 * The name of the style for the focused tile.
 * @type {string}
 */
export const TILE_STYLE_FOCUSED = 'focused';

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
export const getTileStyleBarrier = i => ({
    fill: `var(--color-${alternate(i, barrierColors)})`
});

/**
 * Returns the presentation attributes for a tile ground.
 * @returns {object}
 */
export const getTileStyleGround = () => ({
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
export const getTileStyleSelected = () => ({
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
export const getTileStyleHovered = () => ({
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
export const getTileStyleFocused = () => ({
    fill: 'var(--color-bg-focused)',
    stroke: {
        stroke: 'var(--color-fg-focused)',
        'stroke-width': 'var(--stroke-width-focused)',
        'stroke-dasharray': 'var(--stroke-dasharray-focused)'
    }
});

/**
 * Maps the styles to the helpers.
 * @type {object}
 * @private
 */
const styles = {
    [TILE_STYLE_BARRIER]: getTileStyleBarrier,
    [TILE_STYLE_GROUND]: getTileStyleGround,
    [TILE_STYLE_SELECTED]: getTileStyleSelected,
    [TILE_STYLE_HOVERED]: getTileStyleHovered,
    [TILE_STYLE_FOCUSED]: getTileStyleFocused
};

/**
 * Returns the presentation attributes by name.
 * @param {string} name - The name of the style to get.
 * @param  {...*} args - Additional parameters.
 * @returns {object}
 */
export const getTileStyle = (name, ...args) => {
    const style = styles[name];
    if ('function' === typeof style) {
        return style(...args);
    }

    return {};
};

/**
 * Extends a tile with the identified presentation attributes.
 * @param {string} name - The name of the style to set.
 * @param {object} tile - The tile to extend with the attributes.
 * @param  {...*} args - Additional parameters.
 * @returns {object}
 */
export const extendTileWithStyle = (name, tile, ...args) => {
    return { ...(tile || {}), ...getTileStyle(name, ...args) };
};
