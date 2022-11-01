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
    extendTileWithStyle,
    getTileStyle,
    getTileStyleBarrier,
    getTileStyleFocused,
    getTileStyleGround,
    getTileStyleHovered,
    getTileStyleSelected,
    TILE_STYLE_BARRIER,
    TILE_STYLE_FOCUSED,
    TILE_STYLE_GROUND,
    TILE_STYLE_HOVERED,
    TILE_STYLE_SELECTED
} from '../style.js';

const colorEven = {
    fill: 'var(--color-even)'
};
const colorOdd = {
    fill: 'var(--color-odd)'
};
const colorGround = {
    fill: 'var(--color-ground)',
    stroke: {
        stroke: 'var(--color-separator)',
        'stroke-width': 'var(--stroke-width-tile)'
    }
};
const colorSelected = {
    fill: 'var(--color-bg-selected)',
    stroke: {
        stroke: 'var(--color-fg-selected)',
        'stroke-width': 'var(--stroke-width-selected)'
    }
};
const colorHovered = {
    fill: 'var(--color-bg-hovered)',
    stroke: {
        stroke: 'var(--color-fg-hovered)',
        'stroke-width': 'var(--stroke-width-hovered)'
    }
};
const colorFocused = {
    fill: 'var(--color-bg-focused)',
    stroke: {
        stroke: 'var(--color-fg-focused)',
        'stroke-width': 'var(--stroke-width-focused)',
        'stroke-dasharray': 'var(--stroke-dasharray-focused)'
    }
};

describe('getTileStyleBarrier', () => {
    it('is a function', () => {
        expect(getTileStyleBarrier).toEqual(expect.any(Function));
    });

    it('alternates the colors with respect to the given index', () => {
        expect(getTileStyleBarrier(0)).toStrictEqual(colorEven);
        expect(getTileStyleBarrier(1)).toStrictEqual(colorOdd);
    });

    it('loop back to the beginning when the given index exceeds the length', () => {
        expect(getTileStyleBarrier(2)).toStrictEqual(colorEven);
        expect(getTileStyleBarrier(3)).toStrictEqual(colorOdd);
    });
});

describe('getTileStyleGround', () => {
    it('is a function', () => {
        expect(getTileStyleGround).toEqual(expect.any(Function));
    });

    it('returns with the color attributes for a tile ground', () => {
        expect(getTileStyleGround()).toStrictEqual(colorGround);
    });
});

describe('getTileStyleSelected', () => {
    it('is a function', () => {
        expect(getTileStyleSelected).toEqual(expect.any(Function));
    });

    it('returns with the color attributes of a tile overlay for an selected state', () => {
        expect(getTileStyleSelected()).toStrictEqual(colorSelected);
    });
});

describe('getTileStyleHovered', () => {
    it('is a function', () => {
        expect(getTileStyleHovered).toEqual(expect.any(Function));
    });

    it('returns with the color attributes of a tile overlay for an hovered state', () => {
        expect(getTileStyleHovered()).toStrictEqual(colorHovered);
    });
});

describe('getTileStyleFocused', () => {
    it('is a function', () => {
        expect(getTileStyleFocused).toEqual(expect.any(Function));
    });

    it('returns with the color attributes of a tile overlay for a focused state', () => {
        expect(getTileStyleFocused()).toStrictEqual(colorFocused);
    });
});

describe('getTileStyle', () => {
    it('is a function', () => {
        expect(getTileStyle).toEqual(expect.any(Function));
    });

    it.each([
        [TILE_STYLE_BARRIER, [0], colorEven],
        [TILE_STYLE_BARRIER, [1], colorOdd],
        [TILE_STYLE_GROUND, [], colorGround],
        [TILE_STYLE_SELECTED, [], colorSelected],
        [TILE_STYLE_HOVERED, [], colorHovered],
        [TILE_STYLE_FOCUSED, [], colorFocused],
        ['foo', [], {}]
    ])('returns with the style attributes for %s', (name, args, expected) => {
        expect(getTileStyle(name, ...args)).toStrictEqual(expected);
    });
});

describe('extendTileWithStyle', () => {
    it('is a function', () => {
        expect(extendTileWithStyle).toEqual(expect.any(Function));
    });

    it.each([
        [TILE_STYLE_BARRIER, [0], { type: 'foo' }, { ...colorEven, type: 'foo' }],
        [TILE_STYLE_BARRIER, [1], { type: 'foo' }, { ...colorOdd, type: 'foo' }],
        [TILE_STYLE_GROUND, [], { type: 'foo' }, { ...colorGround, type: 'foo' }],
        [TILE_STYLE_SELECTED, [], { type: 'foo' }, { ...colorSelected, type: 'foo' }],
        [TILE_STYLE_HOVERED, [], { type: 'foo' }, { ...colorHovered, type: 'foo' }],
        [TILE_STYLE_FOCUSED, [], { type: 'foo' }, { ...colorFocused, type: 'foo' }],
        [TILE_STYLE_FOCUSED, [], null, colorFocused]
    ])('returns with the style attributes for %s', (name, args, tile, expected) => {
        expect(extendTileWithStyle(name, tile, ...args)).toStrictEqual(expected);
    });
});
