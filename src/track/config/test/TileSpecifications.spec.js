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
const contextId = 'tileSpecifications';

describe('TileSpecifications', () => {
    it('is a class', () => {
        expect(TileSpecifications).toEqual(expect.any(Function));
    });

    it('defines default specifications for the tiles', () => {
        const specs = new TileSpecifications();

        expect(specs).toBeInstanceOf(TileSpecifications);
        expect(specs.laneWidth).toBe(20);
        expect(specs.barrierWidth).toBe(1);
        expect(specs.barrierChunks).toBe(4);
        expect(specs.length).toBe(27);
        expect(specs.width).toBe(22);
        expect(specs.padding).toBe(2.5);
        expect(specs.barrierLength).toBe(6.75);
        expect(specs.maxRatio).toBe(4);
        expect(specs.contextId).toBe(contextId);
    });

    it('defines the specifications for the tiles', () => {
        const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

        expect(specs).toBeInstanceOf(TileSpecifications);
        expect(specs.laneWidth).toBe(laneWidth);
        expect(specs.barrierWidth).toBe(barrierWidth);
        expect(specs.barrierChunks).toBe(barrierChunks);
        expect(specs.length).toBe(tileLength);
        expect(specs.width).toBe(tileWidth);
        expect(specs.padding).toBe(tilePadding);
        expect(specs.barrierLength).toBe(barrierLength);
        expect(specs.maxRatio).toBe(maxRatio);
        expect(specs.contextId).toBe(contextId);
    });

    describe('can set', () => {
        it.each([
            [50, 50],
            [-60, 60]
        ])('the width of the track lane as %s, actually %s', (value, expected) => {
            const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

            expect(specs.setLaneWidth(value)).toBe(specs);
            expect(specs.laneWidth).toBe(expected);
        });

        it.each([
            [3, 3],
            [-4, 4]
        ])('the width of a barrier as %s, actually %s', (value, expected) => {
            const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);
            expect(specs.setBarrierWidth(value)).toBe(specs);
            expect(specs.barrierWidth).toBe(expected);
        });

        it.each([
            [1, 1],
            [-1, 1],
            [0, 1],
            [0.1, 1],
            [1.8, 2],
            [2.1, 2]
        ])('the number of a barrier chunks as %s, actually %s', (value, expected) => {
            const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);
            expect(specs.setBarrierChunks(value)).toBe(specs);
            expect(specs.barrierChunks).toBe(expected);
        });

        it.each([
            [1, 1],
            [-1, 1],
            [0, 1],
            [0.1, 1],
            [1.8, 2],
            [2.1, 2]
        ])('the maximum value for size ratio as %s, actually %s', (value, expected) => {
            const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);
            expect(specs.setMaxRatio(value)).toBe(specs);
            expect(specs.maxRatio).toBe(expected);
        });
    });
});
