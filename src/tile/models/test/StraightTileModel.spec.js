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

import { StraightTileModel } from '../StraightTileModel.js';
import { TileSpecifications } from '../../config';

const tileX = 100;
const tileY = 100;
const tileRatios = [0.5, 1, 2, 3, 4];
const laneWidth = 80;
const tileLength = 110;
const tileWidth = 90;
const barrierWidth = 5;
const barrierChunks = 4;
const minRatio = 1 / barrierChunks;
const maxRatio = 4;
const specs = new TileSpecifications({ laneWidth, barrierWidth, barrierChunks, maxRatio });

describe('StraightTileModel', () => {
    it('is a class', () => {
        expect(StraightTileModel).toEqual(expect.any(Function));
    });

    describe('throws error', () => {
        it('when trying to create an instance with an invalid specifications object', () => {
            expect(() => new StraightTileModel({})).toThrow(
                'The specifications object must be an instance of TileSpecifications!'
            );
        });

        it('when trying to create an instance with an invalid direction', () => {
            expect(() => new StraightTileModel(specs, '')).toThrow('A valid direction is needed!');
        });

        it('when trying to set an invalid specifications object', () => {
            const tile = new StraightTileModel(specs);
            expect(() => tile.setSpecs({})).toThrow(
                'The specifications object must be an instance of TileSpecifications!'
            );
        });

        it('when trying to set an invalid direction', () => {
            const tile = new StraightTileModel(specs);
            expect(() => tile.setDirection('')).toThrow('A valid direction is needed!');
        });
    });

    describe('can build a tile', () => {
        it('with the given size', () => {
            const tile = new StraightTileModel(specs);
            const modelId = `${StraightTileModel.TYPE}-1`;

            expect(tile).toBeInstanceOf(StraightTileModel);
            expect(tile).toMatchSnapshot();
            expect(tile.type).toBe(StraightTileModel.TYPE);
            expect(tile.modelId).toBe(modelId);
            expect(tile.id).toBe(modelId);
            expect(tile.length).toBe(tileLength);
            expect(tile.width).toBe(tileWidth);
            expect(tile.minRatio).toBe(minRatio);
            expect(tile.maxRatio).toBe(1);
        });

        it('with the given size and direction', () => {
            const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_LEFT);
            const modelId = `${StraightTileModel.TYPE}-1`;

            expect(tile).toBeInstanceOf(StraightTileModel);
            expect(tile).toMatchSnapshot();
            expect(tile.type).toBe(StraightTileModel.TYPE);
            expect(tile.modelId).toBe(modelId);
            expect(tile.id).toBe(modelId);
            expect(tile.length).toBe(tileLength);
            expect(tile.width).toBe(tileWidth);
            expect(tile.minRatio).toBe(minRatio);
            expect(tile.maxRatio).toBe(1);
        });

        it.each(tileRatios)('with the given size and a ratio of %s', ratio => {
            const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_LEFT, ratio);
            const sizeRatio = Math.min(ratio, 1);
            const modelId = `${StraightTileModel.TYPE}-${sizeRatio}`;

            expect(tile).toBeInstanceOf(StraightTileModel);
            expect(tile).toMatchSnapshot();
            expect(tile.type).toBe(StraightTileModel.TYPE);
            expect(tile.modelId).toBe(modelId);
            expect(tile.id).toBe(modelId);
            expect(tile.length).toBe(tileLength * sizeRatio);
            expect(tile.width).toBe(tileWidth);
            expect(tile.minRatio).toBe(minRatio);
            expect(tile.maxRatio).toBe(1);
        });

        it.each(tileRatios)('with the given size and an unlocked ratio of %s', ratio => {
            const unlockedSpecs = new TileSpecifications({
                laneWidth,
                barrierWidth,
                barrierChunks,
                maxRatio,
                unlockRatio: true
            });
            const tile = new StraightTileModel(unlockedSpecs, StraightTileModel.DIRECTION_LEFT, ratio);
            const modelId = `${StraightTileModel.TYPE}-${ratio}`;

            expect(tile).toBeInstanceOf(StraightTileModel);
            expect(tile).toMatchSnapshot();
            expect(tile.type).toBe(StraightTileModel.TYPE);
            expect(tile.modelId).toBe(modelId);
            expect(tile.id).toBe(modelId);
            expect(tile.length).toBe(tileLength * ratio);
            expect(tile.width).toBe(tileWidth);
            expect(tile.minRatio).toBe(minRatio);
            expect(tile.maxRatio).toBe(maxRatio);
        });
    });

    describe('can set', () => {
        it('the specifications of the tile', () => {
            const tile = new StraightTileModel(specs);
            const newSpecs = new TileSpecifications({ laneWidth: 10, barrierWidth: 1, barrierChunks: 2 });

            expect(tile.specs).toBeInstanceOf(TileSpecifications);
            expect(tile.specs).not.toBe(newSpecs);
            expect(tile.setSpecs(newSpecs)).toBe(tile);
            expect(tile.specs).toBe(newSpecs);
        });

        it('the direction of the tile', () => {
            const tile = new StraightTileModel(specs);

            expect(tile.direction).toBe(StraightTileModel.DIRECTION_RIGHT);
            expect(tile.setDirection(StraightTileModel.DIRECTION_LEFT)).toBe(tile);
            expect(tile.direction).toBe(StraightTileModel.DIRECTION_LEFT);
        });

        it('the size ratio', () => {
            const tile = new StraightTileModel(specs);
            expect(tile.setRatio(1)).toBe(tile);
            expect(tile.ratio).toBe(1);
            expect(tile.setRatio(-1).ratio).toBe(1);
            expect(tile.setRatio(0).ratio).toBe(1);
            expect(tile.setRatio(0.15).ratio).toBe(0.25);
            expect(tile.setRatio(0.33).ratio).toBe(0.25);
            expect(tile.setRatio(0.5).ratio).toBe(0.5);
            expect(tile.setRatio(2.5).ratio).toBe(1);
            expect(tile.setRatio(5).ratio).toBe(1);
        });

        it('the unlocked size ratio', () => {
            const unlockedSpecs = new TileSpecifications({
                laneWidth,
                barrierWidth,
                barrierChunks,
                maxRatio,
                unlockRatio: true
            });
            const tile = new StraightTileModel(unlockedSpecs);
            expect(tile.setRatio(1)).toBe(tile);
            expect(tile.ratio).toBe(1);
            expect(tile.setRatio(-1).ratio).toBe(1);
            expect(tile.setRatio(0).ratio).toBe(1);
            expect(tile.setRatio(0.15).ratio).toBe(0.25);
            expect(tile.setRatio(0.33).ratio).toBe(0.25);
            expect(tile.setRatio(0.5).ratio).toBe(0.5);
            expect(tile.setRatio(2.5).ratio).toBe(3);
            expect(tile.setRatio(5).ratio).toBe(maxRatio);
        });
    });

    it.each([
        [StraightTileModel.DIRECTION_RIGHT, StraightTileModel.DIRECTION_LEFT],
        [StraightTileModel.DIRECTION_LEFT, StraightTileModel.DIRECTION_RIGHT]
    ])('can flip the direction of the tile from %s to %s', (direction, flippedDirection) => {
        const tile = new StraightTileModel(specs, direction);

        expect(tile.direction).toBe(direction);
        expect(tile.flipDirection()).toBe(tile);
        expect(tile.direction).toBe(flippedDirection);
    });

    describe('can compute', () => {
        describe('the rotation angle for a tile', () => {
            it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_RIGHT, ratio);
                expect(tile.getDirectionAngle()).toMatchSnapshot();
            });

            it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_LEFT, ratio);
                expect(tile.getDirectionAngle()).toMatchSnapshot();
            });
        });

        describe('the angle of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_RIGHT, ratio);
                expect(tile.getCurveAngle()).toMatchSnapshot();
            });
        });

        describe('the side of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_RIGHT, ratio);
                expect(tile.getCurveSide()).toMatchSnapshot();
            });
        });

        describe('the center of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_RIGHT, ratio);
                expect(tile.getCurveCenter()).toMatchSnapshot();
                expect(tile.getCurveCenter(tileX, tileY)).toMatchSnapshot();
            });
        });

        describe('the inner radius of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_RIGHT, ratio);
                expect(tile.getInnerRadius()).toMatchSnapshot();
            });
        });

        describe('the outer radius of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_RIGHT, ratio);
                expect(tile.getOuterRadius()).toMatchSnapshot();
            });
        });

        describe('the number of chunks by side for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_RIGHT, ratio);
                expect(tile.getSideBarrierChunks()).toMatchSnapshot();
            });
        });

        describe('the number of chunks for the inner curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_RIGHT, ratio);
                expect(tile.getInnerBarrierChunks()).toMatchSnapshot();
            });
        });

        describe('the number of chunks for the outer curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_RIGHT, ratio);
                expect(tile.getOuterBarrierChunks()).toMatchSnapshot();
            });
        });

        describe('the position of the center point for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_RIGHT, ratio);

                expect(tile.getCenterCoord()).toMatchSnapshot();
                expect(tile.getCenterCoord(tileX, tileY)).toMatchSnapshot();
                expect(tile.getCenterCoord(tileX, tileY, 90)).toMatchSnapshot();
            });
        });

        describe('the position of the output point for a tile', () => {
            it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_RIGHT, ratio);

                expect(tile.getOutputCoord()).toMatchSnapshot();
                expect(tile.getOutputCoord(tileX, tileY)).toMatchSnapshot();
                expect(tile.getOutputCoord(tileX, tileY, 90)).toMatchSnapshot();
            });

            it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_LEFT, ratio);

                expect(tile.getOutputCoord()).toMatchSnapshot();
                expect(tile.getOutputCoord(tileX, tileY)).toMatchSnapshot();
                expect(tile.getOutputCoord(tileX, tileY, 90)).toMatchSnapshot();
            });
        });

        describe('the angle of the output point for a tile', () => {
            it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_RIGHT, ratio);

                expect(tile.getOutputAngle()).toMatchSnapshot();
                expect(tile.getOutputAngle(450)).toMatchSnapshot();
            });

            it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_RIGHT, ratio);

                expect(tile.getOutputAngle()).toMatchSnapshot();
                expect(tile.getOutputAngle(450)).toMatchSnapshot();
            });
        });

        describe('the position of the edge points for a tile', () => {
            it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_RIGHT, ratio);

                expect(tile.getEdgesCoord()).toMatchSnapshot();
                expect(tile.getEdgesCoord(tileX, tileY)).toMatchSnapshot();
                expect(tile.getEdgesCoord(tileX, tileY, 90)).toMatchSnapshot();
            });

            it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                const tile = new StraightTileModel(specs, StraightTileModel.DIRECTION_LEFT, ratio);

                expect(tile.getEdgesCoord()).toMatchSnapshot();
                expect(tile.getEdgesCoord(tileX, tileY)).toMatchSnapshot();
                expect(tile.getEdgesCoord(tileX, tileY, 90)).toMatchSnapshot();
            });
        });

        describe('the bounding rectangle of the tile', () => {
            it.each([
                [StraightTileModel.DIRECTION_RIGHT, 1, void 0, void 0, void 0],
                [StraightTileModel.DIRECTION_RIGHT, 1, 100, 100, 0],
                [StraightTileModel.DIRECTION_RIGHT, 1, 100, 100, 45],
                [StraightTileModel.DIRECTION_RIGHT, 2, 100, 100, 405],
                [StraightTileModel.DIRECTION_RIGHT, 2, 0, 0, 90],
                [StraightTileModel.DIRECTION_LEFT, 1, void 0, void 0, void 0],
                [StraightTileModel.DIRECTION_LEFT, 1, 100, 100, 0],
                [StraightTileModel.DIRECTION_LEFT, 1, 100, 100, 45],
                [StraightTileModel.DIRECTION_LEFT, 2, 100, 100, 405],
                [StraightTileModel.DIRECTION_LEFT, 2, 0, 0, 90]
            ])(
                'oriented to the %s with a ratio of %s and positioned at [%s, %s] rotated by %s degrees',
                (direction, ratio, x, y, angle) => {
                    const tile = new StraightTileModel(specs, direction, ratio);
                    expect(tile.getBoundingRect(x, y, angle)).toMatchSnapshot();
                }
            );
        });

        describe('the transform command to rotate the tile', () => {
            it.each([
                [StraightTileModel.DIRECTION_RIGHT, 1, void 0, void 0, void 0],
                [StraightTileModel.DIRECTION_RIGHT, 1, 100, 100, 0],
                [StraightTileModel.DIRECTION_RIGHT, 1, 100, 100, 45],
                [StraightTileModel.DIRECTION_RIGHT, 2, 100, 100, 405],
                [StraightTileModel.DIRECTION_RIGHT, 2, 0, 0, 90],
                [StraightTileModel.DIRECTION_LEFT, 1, void 0, void 0, void 0],
                [StraightTileModel.DIRECTION_LEFT, 1, 100, 100, 0],
                [StraightTileModel.DIRECTION_LEFT, 1, 100, 100, 45],
                [StraightTileModel.DIRECTION_LEFT, 2, 100, 100, 405],
                [StraightTileModel.DIRECTION_LEFT, 2, 0, 0, 90]
            ])(
                'oriented to the %s with a ratio of %s and positioned at [%s, %s] rotated by %s degrees',
                (direction, ratio, x, y, angle) => {
                    const tile = new StraightTileModel(specs, direction, ratio);
                    expect(tile.getRotateTransform(x, y, angle)).toMatchSnapshot();
                }
            );
        });
    });

    it.each([
        [StraightTileModel.DIRECTION_RIGHT, 1],
        [StraightTileModel.DIRECTION_RIGHT, 2],
        [StraightTileModel.DIRECTION_LEFT, 1],
        [StraightTileModel.DIRECTION_LEFT, 2]
    ])('can export to an object a tile oriented to the %s having a ratio of %s', (direction, ratio) => {
        const tile = new StraightTileModel(specs, direction, ratio);

        expect(tile.export()).toMatchSnapshot();
    });

    it('compares tiles together', () => {
        const unlockedSpecs = new TileSpecifications({
            laneWidth,
            barrierWidth,
            barrierChunks,
            maxRatio,
            unlockRatio: true
        });
        const left1 = new StraightTileModel(specs, StraightTileModel.DIRECTION_LEFT, 1);
        const left2 = new StraightTileModel(unlockedSpecs, StraightTileModel.DIRECTION_LEFT, 2);
        const right = new StraightTileModel(specs, StraightTileModel.DIRECTION_RIGHT, 1);

        class T extends StraightTileModel {}
        Object.defineProperty(T, 'TYPE', { value: 'T' });
        const t = new T(specs);

        expect(left1.compare()).toBe(1);
        expect(left1.compare(t)).toBe(1);

        expect(left1.compare(left2)).toBe(-1);
        expect(left2.compare(left1)).toBe(1);
        expect(left1.compare(left1)).toBe(0);

        expect(left1.compare(right)).toBe(1);
        expect(right.compare(left1)).toBe(-1);
    });

    it('can validate an object is an instance of the class', () => {
        const tile = new StraightTileModel(specs);
        expect(() => StraightTileModel.validateInstance(tile)).not.toThrow();
        expect(() => StraightTileModel.validateInstance({})).toThrow(
            'The model must be an instance of StraightTileModel!'
        );
    });
});
