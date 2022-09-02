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

import { CurvedTileModel } from '../../models/CurvedTileModel.js';
import { CurvedTileEnlargedModel } from '../../models/CurvedTileEnlargedModel.js';
import { StraightTileModel } from '../../models/StraightTileModel.js';
import getTileModel from '../getTileModel.js';
import { CURVED_TILE_ENLARGED_TYPE, CURVED_TILE_TYPE, DEFAULT_TILE_TYPE, STRAIGHT_TILE_TYPE } from '../types.js';

describe('getTileModel', () => {
    it('is a function', () => {
        expect(getTileModel).toEqual(expect.any(Function));
    });

    it.each([
        [STRAIGHT_TILE_TYPE, StraightTileModel],
        [CURVED_TILE_TYPE, CurvedTileModel],
        [CURVED_TILE_ENLARGED_TYPE, CurvedTileEnlargedModel]
    ])('get the expected model for the type "%s"', (type, model) => {
        expect(getTileModel(type)).toBe(model);
    });

    it.each([
        [DEFAULT_TILE_TYPE, null],
        ['', null]
    ])('get null for an unknown type "%s"', (type, model) => {
        expect(getTileModel(type)).toBe(model);
    });
});
