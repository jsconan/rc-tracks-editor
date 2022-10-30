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

import { barrierColor, focusedColor, groundColor, hoveredColor, selectedColor } from '../colors.js';

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

describe('barrierColor', () => {
    it('is a function', () => {
        expect(barrierColor).toEqual(expect.any(Function));
    });

    it('alternates the colors with respect to the given index', () => {
        expect(barrierColor(0)).toStrictEqual(colorEven);
        expect(barrierColor(1)).toStrictEqual(colorOdd);
    });

    it('loop back to the beginning when the given index exceeds the length', () => {
        expect(barrierColor(2)).toStrictEqual(colorEven);
        expect(barrierColor(3)).toStrictEqual(colorOdd);
    });
});

describe('groundColor', () => {
    it('is a function', () => {
        expect(groundColor).toEqual(expect.any(Function));
    });

    it('returns with the color attributes for a tile ground', () => {
        expect(groundColor()).toStrictEqual(colorGround);
    });
});

describe('selectedColor', () => {
    it('is a function', () => {
        expect(selectedColor).toEqual(expect.any(Function));
    });

    it('returns with the color attributes of a tile overlay for an selected state', () => {
        expect(selectedColor()).toStrictEqual(colorSelected);
    });
});

describe('hoveredColor', () => {
    it('is a function', () => {
        expect(hoveredColor).toEqual(expect.any(Function));
    });

    it('returns with the color attributes of a tile overlay for an hovered state', () => {
        expect(hoveredColor()).toStrictEqual(colorHovered);
    });
});

describe('focusedColor', () => {
    it('is a function', () => {
        expect(focusedColor).toEqual(expect.any(Function));
    });

    it('returns with the color attributes of a tile overlay for a focused state', () => {
        expect(focusedColor()).toStrictEqual(colorFocused);
    });
});
