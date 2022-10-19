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
import { TileSpecifications } from '../../config/TileSpecifications.js';
import tileParameters from '../parameters.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications({ laneWidth, barrierWidth, barrierChunks });

describe('tileParameters', () => {
    it('is an object', () => {
        expect(tileParameters).toEqual(expect.any(Object));
    });

    it.each(['curve', 'enlargedCurve', 'straight'])('has a %s method', methodName => {
        expect(tileParameters[methodName]).toEqual(expect.any(Function));
    });

    it('computes the parameters for rendering a curved tile at the expected position', () => {
        expect(tileParameters.curve(new CurvedTileModel(specs), 10, 20)).toMatchSnapshot();
    });

    it('computes the parameters for rendering a curved tile enlarged at the expected position', () => {
        expect(tileParameters.enlargedCurve(new CurvedTileEnlargedModel(specs), 10, 20)).toMatchSnapshot();
    });

    it('computes the parameters for rendering a straight tile at the expected position', () => {
        expect(tileParameters.straight(new StraightTileModel(specs), 10, 20)).toMatchSnapshot();
    });
});
