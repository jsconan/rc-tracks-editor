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
    CURVED_TILE_ENLARGED_TYPE,
    CURVED_TILE_TYPE,
    STRAIGHT_TILE_TYPE,
    TILE_DIRECTION_LEFT,
    TILE_DIRECTION_RIGHT
} from '../../helpers/types';
import CurvedTile from '../../tiles/CurvedTile.svelte';
import CurvedTileEnlarged from '../../tiles/CurvedTileEnlarged.svelte';
import StraightTile from '../../tiles/StraightTile.svelte';
import CurvedTileModel from '../CurvedTileModel.js';
import CurvedTileEnlargedModel from '../CurvedTileEnlargedModel.js';
import StraightTileModel from '../StraightTileModel.js';
import TileReferenceModel from '../TileReferenceModel.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;

describe('TileReferenceModel', () => {
    it('is a class', () => {
        expect(TileReferenceModel).toEqual(expect.any(Function));
    });

    describe('can build a reference to a tile', () => {
        it('with the default specifications', () => {
            const ref = new TileReferenceModel();

            expect(ref).toBeInstanceOf(TileReferenceModel);
            expect(ref).toMatchSnapshot();
        });

        it('with the given type', () => {
            const ref = new TileReferenceModel(STRAIGHT_TILE_TYPE);

            expect(ref).toBeInstanceOf(TileReferenceModel);
            expect(ref).toMatchSnapshot();
        });

        it('with the given direction', () => {
            const ref = new TileReferenceModel(STRAIGHT_TILE_TYPE, TILE_DIRECTION_LEFT);

            expect(ref).toBeInstanceOf(TileReferenceModel);
            expect(ref).toMatchSnapshot();
        });

        it('with the given ratio', () => {
            const ref = new TileReferenceModel(STRAIGHT_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

            expect(ref).toBeInstanceOf(TileReferenceModel);
            expect(ref).toMatchSnapshot();
        });

        it('but throws error', () => {
            expect(() => new TileReferenceModel('')).toThrow('A valid type of tile is needed!');
            expect(() => new TileReferenceModel(STRAIGHT_TILE_TYPE, -1)).toThrow('A valid direction is needed!');
        });
    });

    describe('can set', () => {
        it('the type of tile', () => {
            const ref = new TileReferenceModel();

            expect(ref.type).toBe(STRAIGHT_TILE_TYPE);
            expect(ref.setType(CURVED_TILE_TYPE)).toBe(ref);
            expect(ref.type).toBe(CURVED_TILE_TYPE);
            expect(() => ref.setType('')).toThrow('A valid type of tile is needed!');
        });

        it('the direction of the tile', () => {
            const ref = new TileReferenceModel();

            expect(ref.direction).toBe(TILE_DIRECTION_RIGHT);
            expect(ref.setDirection(TILE_DIRECTION_LEFT)).toBe(ref);
            expect(ref.direction).toBe(TILE_DIRECTION_LEFT);
            expect(() => ref.setDirection(-1)).toThrow('A valid direction is needed!');
        });

        it('the ratio of the tile', () => {
            const ref = new TileReferenceModel();

            expect(ref.ratio).toBe(1);
            expect(ref.setRatio(2)).toBe(ref);
            expect(ref.ratio).toBe(2);
            expect(ref.setRatio(-1).ratio).toBe(1);
            expect(ref.setRatio(0).ratio).toBe(1);
            expect(ref.setRatio(0.5).ratio).toBe(0.5);
        });
    });

    describe('can build the model for', () => {
        it('a straight tile', () => {
            const ref = new TileReferenceModel(STRAIGHT_TILE_TYPE);
            const tile = ref.getModel(laneWidth, barrierWidth, barrierChunks);

            expect(tile).toBeInstanceOf(StraightTileModel);
            expect(tile).toMatchSnapshot();
        });

        it('a curved tile', () => {
            const ref = new TileReferenceModel(CURVED_TILE_TYPE);
            const tile = ref.getModel(laneWidth, barrierWidth, barrierChunks);

            expect(tile).toBeInstanceOf(CurvedTileModel);
            expect(tile).toMatchSnapshot();
        });

        it('a curved tile enlarged', () => {
            const ref = new TileReferenceModel(CURVED_TILE_ENLARGED_TYPE);
            const tile = ref.getModel(laneWidth, barrierWidth, barrierChunks);

            expect(tile).toBeInstanceOf(CurvedTileEnlargedModel);
            expect(tile).toMatchSnapshot();
        });
    });

    describe('can get the component for', () => {
        it('a straight tile', () => {
            const ref = new TileReferenceModel(STRAIGHT_TILE_TYPE);

            expect(ref.getComponent()).toBe(StraightTile);
        });

        it('a curved tile', () => {
            const ref = new TileReferenceModel(CURVED_TILE_TYPE);

            expect(ref.getComponent()).toBe(CurvedTile);
        });

        it('a curved tile enlarged', () => {
            const ref = new TileReferenceModel(CURVED_TILE_ENLARGED_TYPE);

            expect(ref.getComponent()).toBe(CurvedTileEnlarged);
        });
    });
});
