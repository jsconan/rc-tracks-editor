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

describe('TileSpecifications', () => {
    it('is a class', () => {
        expect(TileSpecifications).toEqual(expect.any(Function));
    });

    it('defines the specifications for the tiles', () => {
        const tile = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

        expect(tile).toBeInstanceOf(TileSpecifications);
        expect(tile.laneWidth).toBe(laneWidth);
        expect(tile.barrierWidth).toBe(barrierWidth);
        expect(tile.barrierChunks).toBe(barrierChunks);
        expect(tile.length).toBe(tileLength);
        expect(tile.width).toBe(tileWidth);
        expect(tile.padding).toBe(tilePadding);
        expect(tile.barrierLength).toBe(barrierLength);
    });

    describe('can set', () => {
        it.each([
            [50, 50],
            [-60, 60]
        ])('the width of the track lane as %s, actually %s', (value, expected) => {
            const tile = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

            expect(tile.setLaneWidth(value)).toBe(tile);
            expect(tile.laneWidth).toBe(expected);
        });

        it.each([
            [3, 3],
            [-4, 4]
        ])('the width of a barrier as %s, actually %s', (value, expected) => {
            const tile = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);
            expect(tile.setBarrierWidth(value)).toBe(tile);
            expect(tile.barrierWidth).toBe(expected);
        });

        it.each([
            [1, 1],
            [-1, 1],
            [0, 1],
            [0.1, 1],
            [1.8, 2],
            [2.1, 2]
        ])('the number of a barrier chunks as %s, actually %s', (value, expected) => {
            const tile = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);
            expect(tile.setBarrierChunks(value)).toBe(tile);
            expect(tile.barrierChunks).toBe(expected);
        });
    });
});
