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
import { TileModel } from '../../models/TileModel.js';
import { TileSpecifications } from '../../config/TileSpecifications.js';
import { getTileParameters } from '../parameters.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications({ laneWidth, barrierWidth, barrierChunks });

describe('getTileParameters', () => {
    it('is a function', () => {
        expect(getTileParameters).toEqual(expect.any(Function));
    });

    it('computes the parameters for rendering a curved tile at the expected position', () => {
        expect(getTileParameters(new CurvedTileModel(specs), 10, 20)).toMatchSnapshot();
    });

    it('computes the parameters for rendering a curved tile enlarged at the expected position', () => {
        expect(getTileParameters(new CurvedTileEnlargedModel(specs), 10, 20)).toMatchSnapshot();
    });

    it('computes the parameters for rendering a straight tile at the expected position', () => {
        expect(getTileParameters(new StraightTileModel(specs), 10, 20)).toMatchSnapshot();
    });

    it('throws an error if the given tile is not valid', () => {
        expect(() => getTileParameters({}, 10, 20)).toThrow('A valid type of tile is needed!');
        expect(() => getTileParameters(new TileModel(specs), 10, 20)).toThrow('A valid type of tile is needed!');
    });
});
