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

import { TileSpecifications } from '../TileSpecifications.js';

const laneWidth = 80;
const tileLength = 110;
const tileWidth = 90;
const tilePadding = 10;
const barrierLength = 27.5;
const barrierWidth = 5;
const barrierChunks = 4;
const maxRatio = 4;
const unlockRatio = true;
const contextId = 'tileSpecifications';
const config = { laneWidth, barrierWidth, barrierChunks, maxRatio, unlockRatio };

describe('TileSpecifications', () => {
    it('is a class', () => {
        expect(TileSpecifications).toEqual(expect.any(Function));
    });

    it('defines default specifications for the tiles', () => {
        const specs = new TileSpecifications();

        expect(specs.laneWidth).toBe(20);
        expect(specs.barrierWidth).toBe(1);
        expect(specs.barrierChunks).toBe(4);
        expect(specs.height).toBe(27);
        expect(specs.width).toBe(22);
        expect(specs.padding).toBe(2.5);
        expect(specs.barrierHeight).toBe(6.75);
        expect(specs.maxRatio).toBe(4);
        expect(specs.unlockRatio).toBeFalsy();
        expect(specs.contextId).toBe(contextId);
    });

    it('defines the specifications for the tiles', () => {
        const specs = new TileSpecifications(config);

        expect(specs.laneWidth).toBe(laneWidth);
        expect(specs.barrierWidth).toBe(barrierWidth);
        expect(specs.barrierChunks).toBe(barrierChunks);
        expect(specs.height).toBe(tileLength);
        expect(specs.width).toBe(tileWidth);
        expect(specs.padding).toBe(tilePadding);
        expect(specs.barrierHeight).toBe(barrierLength);
        expect(specs.maxRatio).toBe(maxRatio);
        expect(specs.unlockRatio).toBeTruthy();
        expect(specs.contextId).toBe(contextId);
    });

    it('imports the specifications for the tiles', () => {
        const specs = new TileSpecifications();

        expect(specs.import(config)).toBe(specs);
        expect(specs.laneWidth).toBe(laneWidth);
        expect(specs.barrierWidth).toBe(barrierWidth);
        expect(specs.barrierChunks).toBe(barrierChunks);
        expect(specs.height).toBe(tileLength);
        expect(specs.width).toBe(tileWidth);
        expect(specs.padding).toBe(tilePadding);
        expect(specs.barrierHeight).toBe(barrierLength);
        expect(specs.maxRatio).toBe(maxRatio);
        expect(specs.unlockRatio).toBeTruthy();
        expect(specs.contextId).toBe(contextId);
    });

    it('exports the specifications for the tiles', () => {
        const specs = new TileSpecifications(config);

        expect(specs.export()).toStrictEqual(config);
    });

    it('adjusts the specifications for the tiles', () => {
        const input = {
            laneWidth: -60,
            barrierWidth: -5,
            barrierChunks: 0.2,
            maxRatio: 0.2,
            unlockRatio: 0
        };
        const output = {
            laneWidth: 60,
            barrierWidth: 5,
            barrierChunks: 1,
            maxRatio: 1,
            unlockRatio: false
        };
        const specs = new TileSpecifications(input);

        expect(specs.export()).toStrictEqual(output);
    });

    it('can validate an object is an instance of the class', () => {
        const specs = new TileSpecifications({ laneWidth, barrierWidth, barrierChunks });
        expect(() => TileSpecifications.validateInstance(specs)).not.toThrow();
        expect(() => TileSpecifications.validateInstance({})).toThrow(
            'The specifications object must be an instance of TileSpecifications!'
        );
    });
});
