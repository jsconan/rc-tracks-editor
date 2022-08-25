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

import { TileModel } from './tile-model.js';

const tileX = 100;
const tileY = 100;
const tileRatios = [-1, 0, 0.5, 1, 2, 3, 4];
const tileLength = 110;
const tileWidth = 90;
const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;

describe('TileModel', () => {
    it('is a class', () => {
        expect(TileModel).toEqual(expect.any(Function));
    });

    describe('can build a tile', () => {
        it('with the given size', () => {
            const tile = new TileModel(laneWidth, barrierWidth, barrierChunks);

            expect(tile).toBeInstanceOf(TileModel);
            expect(tile).toMatchSnapshot();
        });

        it('with the given size and ratio', () => {
            const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, 3);

            expect(tile).toBeInstanceOf(TileModel);
            expect(tile).toMatchSnapshot();
        });

        it('of the expected type', () => {
            const tile = new TileModel(laneWidth, barrierWidth, barrierChunks);

            expect(tile.getType()).toBe(TileModel.TYPE);
        });
    });

    describe('can compute', () => {
        describe('the actual length of the tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getLength()).toMatchSnapshot();
            });
        });

        describe('the actual width of the tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getWidth()).toMatchSnapshot();
            });
        });

        describe('the rotation angle for a tile', () => {
            it.each(tileRatios)('not oriented with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(() => tile.getDirectionAngle(void 0)).toThrow('A valid direction is needed!');
            });

            it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getDirectionAngle(TileModel.DIRECTION_RIGHT)).toMatchSnapshot();
                expect(tile.getDirectionAngleRight()).toMatchSnapshot();
            });

            it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getDirectionAngle(TileModel.DIRECTION_LEFT)).toMatchSnapshot();
                expect(tile.getDirectionAngleLeft()).toMatchSnapshot();
            });
        });

        describe('the angle of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getCurveAngle()).toMatchSnapshot();
            });
        });

        describe('the side of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getCurveSide()).toMatchSnapshot();
            });
        });

        describe('the center of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getCurveCenter()).toMatchSnapshot();
                expect(tile.getCurveCenter(tileX, tileY)).toMatchSnapshot();
            });
        });

        describe('the inner radius of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getInnerRadius()).toMatchSnapshot();
            });
        });

        describe('the outer radius of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getOuterRadius()).toMatchSnapshot();
            });
        });

        describe('the number of chunks by side for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getSideBarrierChunks()).toMatchSnapshot();
            });
        });

        describe('the number of chunks for the inner curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getInnerBarrierChunks()).toMatchSnapshot();
            });
        });

        describe('the number of chunks for the outer curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getOuterBarrierChunks()).toMatchSnapshot();
            });
        });

        describe('the position of the input point for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);

                expect(tile.getInputCoord(tileX, tileY)).toMatchSnapshot();
                expect(tile.getInputCoord()).toMatchSnapshot();
            });
        });

        describe('the position of the output point for a tile', () => {
            it.each(tileRatios)('not oriented with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(() => tile.getOutputCoord(void 0)).toThrow('A valid direction is needed!');
                expect(() => tile.getOutputCoord(void 0, tileX, tileY)).toThrow('A valid direction is needed!');
                expect(() => tile.getOutputCoord(void 0, tileX, tileY, 90)).toThrow('A valid direction is needed!');
            });

            it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);

                expect(tile.getOutputCoord(TileModel.DIRECTION_RIGHT)).toMatchSnapshot();
                expect(tile.getOutputCoord(TileModel.DIRECTION_RIGHT, tileX, tileY)).toMatchSnapshot();
                expect(tile.getOutputCoord(TileModel.DIRECTION_RIGHT, tileX, tileY, 90)).toMatchSnapshot();

                expect(tile.getOutputCoordRight()).toMatchSnapshot();
                expect(tile.getOutputCoordRight(tileX, tileY)).toMatchSnapshot();
                expect(tile.getOutputCoordRight(tileX, tileY, 90)).toMatchSnapshot();
            });

            it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);

                expect(tile.getOutputCoord(TileModel.DIRECTION_LEFT)).toMatchSnapshot();

                expect(tile.getOutputCoord(TileModel.DIRECTION_LEFT)).toMatchSnapshot();
                expect(tile.getOutputCoord(TileModel.DIRECTION_LEFT, tileX, tileY)).toMatchSnapshot();
                expect(tile.getOutputCoord(TileModel.DIRECTION_LEFT, tileX, tileY, 90)).toMatchSnapshot();

                expect(tile.getOutputCoordLeft()).toMatchSnapshot();
                expect(tile.getOutputCoordLeft(tileX, tileY)).toMatchSnapshot();
                expect(tile.getOutputCoordLeft(tileX, tileY, 90)).toMatchSnapshot();
            });
        });

        describe('the position of the center point for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new TileModel(laneWidth, barrierWidth, barrierChunks, ratio);

                expect(tile.getCenterCoord()).toMatchSnapshot();
                expect(tile.getCenterCoord(tileX, tileY)).toMatchSnapshot();
                expect(tile.getCenterCoord(tileX, tileY, 90)).toMatchSnapshot();
            });
        });
    });

    describe('has a static property', () => {
        describe('getTileModelWidth', () => {
            it('which computes the width of a tile knowing the width of its lane and its barrier', () => {
                expect(TileModel.getTileWidth(laneWidth, barrierWidth)).toBe(tileWidth);
            });
        });

        describe('getTileModelLength', () => {
            it('which computes the length of a tile knowing the width of its lane and its barrier', () => {
                expect(TileModel.getTileLength(laneWidth, barrierWidth)).toBe(tileLength);
            });
        });

        describe('getLaneWidth', () => {
            it('which computes the width of a lane knowing the width of a tile and its barrier', () => {
                expect(TileModel.getLaneWidth(tileWidth, barrierWidth)).toBe(laneWidth);
            });
        });

        describe('getCurveAngle', () => {
            it('which computes the angle of the curve with respect of the size ratio', () => {
                expect(TileModel.getCurveAngle()).toBe(90);
                expect(TileModel.getCurveAngle(0.5)).toBe(45);
                expect(TileModel.getCurveAngle(1)).toBe(90);
                expect(TileModel.getCurveAngle(2)).toBe(45);
                expect(TileModel.getCurveAngle(3)).toBe(30);
                expect(TileModel.getCurveAngle(4)).toBe(22.5);
            });
        });
    });
});
