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

import { CurvedTileEnlargedModel } from '../CurvedTileEnlargedModel.js';
import { TileSpecifications } from '../../config';

const tileX = 100;
const tileY = 100;
const tileRatios = [0.5, 1, 2, 3, 4];
const laneWidth = 80;
const tileLength = 110;
const tileWidth = 90;
const barrierWidth = 5;
const barrierChunks = 4;
const minRatio = 1;
const maxRatio = 4;
const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks, maxRatio);

describe('CurvedTileEnlargedModel', () => {
    it('is a class', () => {
        expect(CurvedTileEnlargedModel).toEqual(expect.any(Function));
    });

    describe('can clone', () => {
        it('its instance', () => {
            const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_LEFT, 2);
            const clone = tile.clone();

            expect(clone).not.toBe(tile);
            expect(clone).toStrictEqual(tile);
            expect(clone).toBeInstanceOf(CurvedTileEnlargedModel);
        });

        it('a given instance', () => {
            const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_LEFT, 2);
            const clone = CurvedTileEnlargedModel.clone(tile);

            expect(clone).not.toBe(tile);
            expect(clone).toStrictEqual(tile);
            expect(clone).toBeInstanceOf(CurvedTileEnlargedModel);
        });
    });

    describe('throws error', () => {
        it('when trying to create an instance with an invalid specifications object', () => {
            expect(() => new CurvedTileEnlargedModel({})).toThrow(
                'The specifications object must be an instance of TileSpecifications!'
            );
        });

        it('when trying to create an instance with an invalid direction', () => {
            expect(() => new CurvedTileEnlargedModel(specs, '')).toThrow('A valid direction is needed!');
        });

        it('when trying to set an invalid specifications object', () => {
            const tile = new CurvedTileEnlargedModel(specs);
            expect(() => tile.setSpecs({})).toThrow(
                'The specifications object must be an instance of TileSpecifications!'
            );
        });

        it('when trying to set an invalid direction', () => {
            const tile = new CurvedTileEnlargedModel(specs);
            expect(() => tile.setDirection('')).toThrow('A valid direction is needed!');
        });
    });

    describe('can build a tile', () => {
        it('with the given size', () => {
            const tile = new CurvedTileEnlargedModel(specs);
            const modelId = `${CurvedTileEnlargedModel.TYPE}-1`;

            expect(tile).toBeInstanceOf(CurvedTileEnlargedModel);
            expect(tile).toMatchSnapshot();
            expect(tile.type).toBe(CurvedTileEnlargedModel.TYPE);
            expect(tile.modelId).toBe(modelId);
            expect(tile.id).toBe(modelId);
            expect(tile.length).toBe(tileLength);
            expect(tile.width).toBe(tileWidth);
            expect(tile.minRatio).toBe(minRatio);
            expect(tile.maxRatio).toBe(minRatio);
        });

        it('with the given size and direction', () => {
            const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_LEFT);
            const modelId = `${CurvedTileEnlargedModel.TYPE}-1`;

            expect(tile).toBeInstanceOf(CurvedTileEnlargedModel);
            expect(tile).toMatchSnapshot();
            expect(tile.type).toBe(CurvedTileEnlargedModel.TYPE);
            expect(tile.modelId).toBe(modelId);
            expect(tile.id).toBe(modelId);
            expect(tile.length).toBe(tileLength);
            expect(tile.width).toBe(tileWidth);
            expect(tile.minRatio).toBe(minRatio);
            expect(tile.maxRatio).toBe(minRatio);
        });

        it.each(tileRatios)('with the given size and a ratio of %s', ratio => {
            const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_LEFT, ratio);
            const sizeRatio = 1;
            const modelId = `${CurvedTileEnlargedModel.TYPE}-${sizeRatio}`;

            expect(tile).toBeInstanceOf(CurvedTileEnlargedModel);
            expect(tile).toMatchSnapshot();
            expect(tile.type).toBe(CurvedTileEnlargedModel.TYPE);
            expect(tile.modelId).toBe(modelId);
            expect(tile.id).toBe(modelId);
            expect(tile.length).toBe(tileLength * sizeRatio);
            expect(tile.width).toBe(tileWidth * sizeRatio);
            expect(tile.minRatio).toBe(minRatio);
            expect(tile.maxRatio).toBe(minRatio);
        });

        it.each(tileRatios)('with the given size and an unlocked ratio of %s', ratio => {
            const unlockedSpecs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks, maxRatio, true);
            const tile = new CurvedTileEnlargedModel(unlockedSpecs, CurvedTileEnlargedModel.DIRECTION_LEFT, ratio);
            const sizeRatio = Math.max(1, ratio);
            const modelId = `${CurvedTileEnlargedModel.TYPE}-${sizeRatio}`;

            expect(tile).toBeInstanceOf(CurvedTileEnlargedModel);
            expect(tile).toMatchSnapshot();
            expect(tile.type).toBe(CurvedTileEnlargedModel.TYPE);
            expect(tile.modelId).toBe(modelId);
            expect(tile.id).toBe(modelId);
            expect(tile.length).toBe(tileLength * sizeRatio);
            expect(tile.width).toBe(tileWidth * sizeRatio);
            expect(tile.minRatio).toBe(minRatio);
            expect(tile.maxRatio).toBe(maxRatio);
        });
    });

    describe('can set', () => {
        it('the specifications of the tile', () => {
            const tile = new CurvedTileEnlargedModel(specs);
            const newSpecs = new TileSpecifications(10, 1, 2);

            expect(tile.specs).toBeInstanceOf(TileSpecifications);
            expect(tile.specs).not.toBe(newSpecs);
            expect(tile.setSpecs(newSpecs)).toBe(tile);
            expect(tile.specs).toBe(newSpecs);
        });

        it('the direction of the tile', () => {
            const tile = new CurvedTileEnlargedModel(specs);

            expect(tile.direction).toBe(CurvedTileEnlargedModel.DIRECTION_RIGHT);
            expect(tile.setDirection(CurvedTileEnlargedModel.DIRECTION_LEFT)).toBe(tile);
            expect(tile.direction).toBe(CurvedTileEnlargedModel.DIRECTION_LEFT);
        });

        it('the size ratio', () => {
            const tile = new CurvedTileEnlargedModel(specs);
            expect(tile.setRatio(1)).toBe(tile);
            expect(tile.ratio).toBe(1);
            expect(tile.setRatio(-1).ratio).toBe(1);
            expect(tile.setRatio(0).ratio).toBe(1);
            expect(tile.setRatio(0.15).ratio).toBe(1);
            expect(tile.setRatio(0.33).ratio).toBe(1);
            expect(tile.setRatio(0.5).ratio).toBe(1);
            expect(tile.setRatio(2.5).ratio).toBe(1);
            expect(tile.setRatio(5).ratio).toBe(1);
        });

        it('the unlocked size ratio', () => {
            const unlockedSpecs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks, maxRatio, true);
            const tile = new CurvedTileEnlargedModel(unlockedSpecs);
            expect(tile.setRatio(1)).toBe(tile);
            expect(tile.ratio).toBe(1);
            expect(tile.setRatio(-1).ratio).toBe(1);
            expect(tile.setRatio(0).ratio).toBe(1);
            expect(tile.setRatio(0.15).ratio).toBe(1);
            expect(tile.setRatio(0.33).ratio).toBe(1);
            expect(tile.setRatio(0.5).ratio).toBe(1);
            expect(tile.setRatio(2.5).ratio).toBe(3);
            expect(tile.setRatio(5).ratio).toBe(maxRatio);
        });
    });

    it.each([
        [CurvedTileEnlargedModel.DIRECTION_RIGHT, CurvedTileEnlargedModel.DIRECTION_LEFT],
        [CurvedTileEnlargedModel.DIRECTION_LEFT, CurvedTileEnlargedModel.DIRECTION_RIGHT]
    ])('can flip the direction of the tile from %s to %s', (direction, flippedDirection) => {
        const tile = new CurvedTileEnlargedModel(specs, direction);

        expect(tile.direction).toBe(direction);
        expect(tile.flipDirection()).toBe(tile);
        expect(tile.direction).toBe(flippedDirection);
    });

    describe('can compute', () => {
        describe('the rotation angle for a tile', () => {
            it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_RIGHT, ratio);
                expect(tile.getDirectionAngle()).toMatchSnapshot();
            });

            it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_LEFT, ratio);
                expect(tile.getDirectionAngle()).toMatchSnapshot();
            });
        });

        describe('the angle of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_RIGHT, ratio);
                expect(tile.getCurveAngle()).toMatchSnapshot();
            });
        });

        describe('the side of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_RIGHT, ratio);
                expect(tile.getCurveSide()).toMatchSnapshot();
            });
        });

        describe('the center of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_RIGHT, ratio);
                expect(tile.getCurveCenter()).toMatchSnapshot();
                expect(tile.getCurveCenter(tileX, tileY)).toMatchSnapshot();
            });
        });

        describe('the inner radius of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_RIGHT, ratio);
                expect(tile.getInnerRadius()).toMatchSnapshot();
            });
        });

        describe('the outer radius of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_RIGHT, ratio);
                expect(tile.getOuterRadius()).toMatchSnapshot();
            });
        });

        describe('the number of chunks by side for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_RIGHT, ratio);
                expect(tile.getSideBarrierChunks()).toMatchSnapshot();
            });
        });

        describe('the number of chunks for the inner curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_RIGHT, ratio);
                expect(tile.getInnerBarrierChunks()).toMatchSnapshot();
            });

            it.each(tileRatios)('with an unlocked ratio of %s', ratio => {
                const unlockedSpecs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks, maxRatio, true);
                const tile = new CurvedTileEnlargedModel(unlockedSpecs, CurvedTileEnlargedModel.DIRECTION_RIGHT, ratio);
                expect(tile.getInnerBarrierChunks()).toMatchSnapshot();
            });
        });

        describe('the number of chunks for the outer curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_RIGHT, ratio);
                expect(tile.getOuterBarrierChunks()).toMatchSnapshot();
            });
        });

        describe('the position of the center point for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_RIGHT, ratio);

                expect(tile.getCenterCoord()).toMatchSnapshot();
                expect(tile.getCenterCoord(tileX, tileY)).toMatchSnapshot();
                expect(tile.getCenterCoord(tileX, tileY, 90)).toMatchSnapshot();
            });
        });

        describe('the position of the output point for a tile', () => {
            it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_RIGHT, ratio);

                expect(tile.getOutputCoord()).toMatchSnapshot();
                expect(tile.getOutputCoord(tileX, tileY)).toMatchSnapshot();
                expect(tile.getOutputCoord(tileX, tileY, 90)).toMatchSnapshot();
            });

            it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_LEFT, ratio);

                expect(tile.getOutputCoord()).toMatchSnapshot();
                expect(tile.getOutputCoord(tileX, tileY)).toMatchSnapshot();
                expect(tile.getOutputCoord(tileX, tileY, 90)).toMatchSnapshot();
            });
        });

        describe('the angle of the output point for a tile', () => {
            it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_RIGHT, ratio);

                expect(tile.getOutputAngle()).toMatchSnapshot();
                expect(tile.getOutputAngle(450)).toMatchSnapshot();
            });

            it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_LEFT, ratio);

                expect(tile.getOutputAngle()).toMatchSnapshot();
                expect(tile.getOutputAngle(450)).toMatchSnapshot();
            });
        });

        describe('the position of the edge points for a tile', () => {
            it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_RIGHT, ratio);

                expect(tile.getEdgesCoord()).toMatchSnapshot();
                expect(tile.getEdgesCoord(tileX, tileY)).toMatchSnapshot();
                expect(tile.getEdgesCoord(tileX, tileY, 90)).toMatchSnapshot();
            });

            it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                const tile = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_LEFT, ratio);

                expect(tile.getEdgesCoord()).toMatchSnapshot();
                expect(tile.getEdgesCoord(tileX, tileY)).toMatchSnapshot();
                expect(tile.getEdgesCoord(tileX, tileY, 90)).toMatchSnapshot();
            });
        });

        describe('the bounding rectangle of the tile', () => {
            it.each([
                [CurvedTileEnlargedModel.DIRECTION_RIGHT, 1, void 0, void 0, void 0],
                [CurvedTileEnlargedModel.DIRECTION_RIGHT, 1, 100, 100, 0],
                [CurvedTileEnlargedModel.DIRECTION_RIGHT, 1, 100, 100, 45],
                [CurvedTileEnlargedModel.DIRECTION_RIGHT, 2, 100, 100, 405],
                [CurvedTileEnlargedModel.DIRECTION_RIGHT, 2, 0, 0, 90],
                [CurvedTileEnlargedModel.DIRECTION_LEFT, 1, void 0, void 0, void 0],
                [CurvedTileEnlargedModel.DIRECTION_LEFT, 1, 100, 100, 0],
                [CurvedTileEnlargedModel.DIRECTION_LEFT, 1, 100, 100, 45],
                [CurvedTileEnlargedModel.DIRECTION_LEFT, 2, 100, 100, 405],
                [CurvedTileEnlargedModel.DIRECTION_LEFT, 2, 0, 0, 90]
            ])(
                'oriented to the %s with a ratio of %s and positioned at [%s, %s] rotated by %s degrees',
                (direction, ratio, x, y, angle) => {
                    const tile = new CurvedTileEnlargedModel(specs, direction, ratio);
                    expect(tile.getBoundingRect(x, y, angle)).toMatchSnapshot();
                }
            );
        });

        describe('the transform command to rotate the tile', () => {
            it.each([
                [CurvedTileEnlargedModel.DIRECTION_RIGHT, 1, void 0, void 0, void 0],
                [CurvedTileEnlargedModel.DIRECTION_RIGHT, 1, 100, 100, 0],
                [CurvedTileEnlargedModel.DIRECTION_RIGHT, 1, 100, 100, 45],
                [CurvedTileEnlargedModel.DIRECTION_RIGHT, 2, 100, 100, 405],
                [CurvedTileEnlargedModel.DIRECTION_RIGHT, 2, 0, 0, 90],
                [CurvedTileEnlargedModel.DIRECTION_LEFT, 1, void 0, void 0, void 0],
                [CurvedTileEnlargedModel.DIRECTION_LEFT, 1, 100, 100, 0],
                [CurvedTileEnlargedModel.DIRECTION_LEFT, 1, 100, 100, 45],
                [CurvedTileEnlargedModel.DIRECTION_LEFT, 2, 100, 100, 405],
                [CurvedTileEnlargedModel.DIRECTION_LEFT, 2, 0, 0, 90]
            ])(
                'oriented to the %s with a ratio of %s and positioned at [%s, %s] rotated by %s degrees',
                (direction, ratio, x, y, angle) => {
                    const tile = new CurvedTileEnlargedModel(specs, direction, ratio);
                    expect(tile.getRotateTransform(x, y, angle)).toMatchSnapshot();
                }
            );
        });
    });

    it.each([
        [CurvedTileEnlargedModel.DIRECTION_RIGHT, 1],
        [CurvedTileEnlargedModel.DIRECTION_RIGHT, 2],
        [CurvedTileEnlargedModel.DIRECTION_LEFT, 1],
        [CurvedTileEnlargedModel.DIRECTION_LEFT, 2]
    ])('can export to an object a tile oriented to the %s having a ratio of %s', (direction, ratio) => {
        const tile = new CurvedTileEnlargedModel(specs, direction, ratio);

        expect(tile.export()).toMatchSnapshot();
    });

    it('compares tiles together', () => {
        const unlockedSpecs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks, maxRatio, true);
        const left1 = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_LEFT, 1);
        const left2 = new CurvedTileEnlargedModel(unlockedSpecs, CurvedTileEnlargedModel.DIRECTION_LEFT, 2);
        const right = new CurvedTileEnlargedModel(specs, CurvedTileEnlargedModel.DIRECTION_RIGHT, 1);

        class T extends CurvedTileEnlargedModel {}
        Object.defineProperty(T, 'TYPE', { value: 'T' });
        const t = new T(specs);

        expect(left1.compare()).toBe(1);
        expect(left1.compare(t)).toBe(2);

        expect(left1.compare(left2)).toBe(-1);
        expect(left2.compare(left1)).toBe(1);
        expect(left1.compare(left1)).toBe(0);

        expect(left1.compare(right)).toBe(1);
        expect(right.compare(left1)).toBe(-1);
    });

    it('can validate an object is an instance of the class', () => {
        const tile = new CurvedTileEnlargedModel(specs);
        expect(() => CurvedTileEnlargedModel.validateInstance(tile)).not.toThrow();
        expect(() => CurvedTileEnlargedModel.validateInstance({})).toThrow(
            'The object must be an instance of CurvedTileEnlargedModel!'
        );
    });
});
