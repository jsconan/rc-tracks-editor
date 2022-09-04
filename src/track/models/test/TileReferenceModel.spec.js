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
} from '../../helpers';
import { CurvedTileModel } from '../CurvedTileModel.js';
import { CurvedTileEnlargedModel } from '../CurvedTileEnlargedModel.js';
import { StraightTileModel } from '../StraightTileModel.js';
import { TileReferenceModel } from '../TileReferenceModel.js';
import { TileSpecifications } from '../TileSpecifications.js';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

describe('TileReferenceModel', () => {
    it('is a class', () => {
        expect(TileReferenceModel).toEqual(expect.any(Function));
    });

    describe('throws error', () => {
        it('when trying to create an instance with an invalid specifications object', () => {
            // @ts-expect-error
            expect(() => new TileReferenceModel({})).toThrow('A valid specifications object is needed!');
        });

        it('when trying to create an instance with an invalid type', () => {
            expect(() => new TileReferenceModel(specs, '')).toThrow('A valid type of tile is needed!');
        });

        it('when trying to create an instance with an invalid direction', () => {
            expect(() => new TileReferenceModel(specs, STRAIGHT_TILE_TYPE, '')).toThrow('A valid direction is needed!');
        });

        it('when trying to set an invalid specifications object', () => {
            const track = new TileReferenceModel(specs);
            // @ts-expect-error
            expect(() => track.setSpecs({})).toThrow('A valid specifications object is needed!');
        });

        it('when trying to set an invalid type', () => {
            const ref = new TileReferenceModel(specs, STRAIGHT_TILE_TYPE);
            expect(() => ref.setType('')).toThrow('A valid type of tile is needed!');
        });

        it('when trying to set an invalid direction', () => {
            const ref = new TileReferenceModel(specs, STRAIGHT_TILE_TYPE);
            expect(() => ref.setDirection('')).toThrow('A valid direction is needed!');
        });
    });

    describe('can build a reference to a tile', () => {
        it('with the given specifications', () => {
            const ref = new TileReferenceModel(specs);

            expect(ref).toBeInstanceOf(TileReferenceModel);
            expect(ref).toMatchSnapshot();
            expect(ref.modelId).toBe(`${STRAIGHT_TILE_TYPE}-1`);
        });

        it('with the given type', () => {
            const ref = new TileReferenceModel(specs, STRAIGHT_TILE_TYPE);

            expect(ref).toBeInstanceOf(TileReferenceModel);
            expect(ref).toMatchSnapshot();
            expect(ref.modelId).toBe(`${STRAIGHT_TILE_TYPE}-1`);
        });

        it('with the given direction', () => {
            const ref = new TileReferenceModel(specs, STRAIGHT_TILE_TYPE, TILE_DIRECTION_LEFT);

            expect(ref).toBeInstanceOf(TileReferenceModel);
            expect(ref).toMatchSnapshot();
            expect(ref.modelId).toBe(`${STRAIGHT_TILE_TYPE}-1`);
        });

        it('with the given ratio', () => {
            const ref = new TileReferenceModel(specs, STRAIGHT_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

            expect(ref).toBeInstanceOf(TileReferenceModel);
            expect(ref).toMatchSnapshot();
            expect(ref.modelId).toBe(`${STRAIGHT_TILE_TYPE}-2`);
        });
    });

    describe('can build the model for', () => {
        it('a straight tile', () => {
            const ref = new TileReferenceModel(specs, STRAIGHT_TILE_TYPE);

            expect(ref.model).toBeInstanceOf(StraightTileModel);
            expect(ref.model).toMatchSnapshot();
        });

        it('a curved tile', () => {
            const ref = new TileReferenceModel(specs, CURVED_TILE_TYPE);

            expect(ref.model).toBeInstanceOf(CurvedTileModel);
            expect(ref.model).toMatchSnapshot();
        });

        it('a curved tile enlarged', () => {
            const ref = new TileReferenceModel(specs, CURVED_TILE_ENLARGED_TYPE);

            expect(ref.model).toBeInstanceOf(CurvedTileEnlargedModel);
            expect(ref.model).toMatchSnapshot();
        });
    });

    describe('can set', () => {
        it('the specifications of the tile', () => {
            const ref = new TileReferenceModel(specs);
            const newSpecs = new TileSpecifications(10, 1, 2);

            expect(ref.specs).toBeInstanceOf(TileSpecifications);
            expect(ref.specs).not.toBe(newSpecs);
            expect(ref.model.specs).not.toBe(newSpecs);
            expect(ref.setSpecs(newSpecs)).toBe(ref);
            expect(ref.specs).toBe(newSpecs);
            expect(ref.model.specs).toBe(newSpecs);
        });

        it('the type of tile', () => {
            const ref = new TileReferenceModel(specs);

            expect(ref.type).toBe(STRAIGHT_TILE_TYPE);
            expect(ref.model).toBeInstanceOf(StraightTileModel);
            expect(ref.setType(CURVED_TILE_TYPE)).toBe(ref);
            expect(ref.type).toBe(CURVED_TILE_TYPE);
            expect(ref.model).toBeInstanceOf(CurvedTileModel);
            expect(ref.modelId).toBe(`${CURVED_TILE_TYPE}-1`);
        });

        it('the direction of the tile', () => {
            const ref = new TileReferenceModel(specs);

            expect(ref.direction).toBe(TILE_DIRECTION_RIGHT);
            expect(ref.model.direction).toBe(TILE_DIRECTION_RIGHT);
            expect(ref.setDirection(TILE_DIRECTION_LEFT)).toBe(ref);
            expect(ref.direction).toBe(TILE_DIRECTION_LEFT);
            expect(ref.model.direction).toBe(TILE_DIRECTION_LEFT);
            expect(ref.modelId).toBe(`${STRAIGHT_TILE_TYPE}-1`);
        });

        it('the ratio of the tile', () => {
            const ref = new TileReferenceModel(specs);

            expect(ref.ratio).toBe(1);
            expect(ref.model.ratio).toBe(1);
            expect(ref.setRatio(2)).toBe(ref);
            expect(ref.ratio).toBe(2);
            expect(ref.model.ratio).toBe(2);
            expect(ref.modelId).toBe(`${STRAIGHT_TILE_TYPE}-2`);
            expect(ref.setRatio(-1).ratio).toBe(1);
            expect(ref.setRatio(0).ratio).toBe(1);
            expect(ref.setRatio(0.5).ratio).toBe(0.5);
        });
    });

    it.each([STRAIGHT_TILE_TYPE, CURVED_TILE_TYPE, CURVED_TILE_ENLARGED_TYPE])(
        'can export to an object from a tile type %s',
        type => {
            const track = new TileReferenceModel(specs, type);

            expect(track.export()).toMatchSnapshot();
        }
    );

    describe('can compute the coordinates of the tile for', () => {
        it.each([
            [void 0, void 0, void 0],
            [100, 100, 45]
        ])('a straight tile at coordinates [%s, %s] and angle %s', (x, y, angle) => {
            const ref = new TileReferenceModel(specs, STRAIGHT_TILE_TYPE);
            expect(ref.build(x, y, angle)).toMatchSnapshot();
        });

        it.each([
            [void 0, void 0, void 0],
            [100, 100, 45]
        ])('a curved tile at coordinates [%s, %s] and angle %s', (x, y, angle) => {
            const ref = new TileReferenceModel(specs, CURVED_TILE_TYPE);
            expect(ref.build(x, y, angle)).toMatchSnapshot();
        });

        it.each([
            [void 0, void 0, void 0],
            [100, 100, 45]
        ])('a curved tile enlarged at coordinates [%s, %s] and angle %s', (x, y, angle) => {
            const ref = new TileReferenceModel(specs, CURVED_TILE_ENLARGED_TYPE);
            expect(ref.build(x, y, angle)).toMatchSnapshot();
        });
    });
});
