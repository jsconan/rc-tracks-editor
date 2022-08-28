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

import CurvedTileModel from '../CurvedTileModel.js';

const tileX = 100;
const tileY = 100;
const tileRatios = [0.5, 1, 2, 3, 4];
const tileLength = 110;
const tileWidth = 90;
const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;

describe('CurvedTileModel', () => {
    it('is a class', () => {
        expect(CurvedTileModel).toEqual(expect.any(Function));
    });

    describe('can build a tile', () => {
        it('with the given size', () => {
            const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks);

            expect(tile).toBeInstanceOf(CurvedTileModel);
            expect(tile).toMatchSnapshot();
        });

        it('with the given size and ratio', () => {
            const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, 3);

            expect(tile).toBeInstanceOf(CurvedTileModel);
            expect(tile).toMatchSnapshot();
        });

        it('of the expected type', () => {
            const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks);

            expect(tile.getType()).toBe(CurvedTileModel.TYPE);
        });
    });

    describe('can set', () => {
        it('the width of the track lane', () => {
            const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks);
            expect(tile.setLaneWidth(1)).toBe(tile);
            expect(tile.laneWidth).toBe(1);
            expect(tile.setLaneWidth(-1).laneWidth).toBe(1);
        });

        it('the width of a barrier', () => {
            const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks);
            expect(tile.setBarrierWidth(1)).toBe(tile);
            expect(tile.barrierWidth).toBe(1);
            expect(tile.setBarrierWidth(-1).barrierWidth).toBe(1);
        });

        it('the number of a barrier chunks', () => {
            const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks);
            expect(tile.setBarrierChunks(1)).toBe(tile);
            expect(tile.barrierChunks).toBe(1);
            expect(tile.setBarrierChunks(-1).barrierChunks).toBe(1);
            expect(tile.setBarrierChunks(0).barrierChunks).toBe(1);
            expect(tile.setBarrierChunks(0.1).barrierChunks).toBe(1);
            expect(tile.setBarrierChunks(1.8).barrierChunks).toBe(2);
            expect(tile.setBarrierChunks(2.1).barrierChunks).toBe(2);
        });

        it('the size ratio', () => {
            const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks);
            expect(tile.setRatio(1)).toBe(tile);
            expect(tile.ratio).toBe(1);
            expect(tile.setRatio(-1).ratio).toBe(1);
            expect(tile.setRatio(0).ratio).toBe(1);
            expect(tile.setRatio(0.5).ratio).toBe(0.5);
            expect(tile.setRatio(2.5).ratio).toBe(2.5);
        });
    });

    describe('can compute', () => {
        describe('the actual length of the tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getLength()).toMatchSnapshot();
            });
        });

        describe('the actual width of the tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getWidth()).toMatchSnapshot();
            });
        });

        describe('the rotation angle for a tile', () => {
            it.each(tileRatios)('not oriented with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(() => tile.getDirectionAngle(void 0)).toThrow('A valid direction is needed!');
            });

            it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getDirectionAngle(CurvedTileModel.DIRECTION_RIGHT)).toMatchSnapshot();
                expect(tile.getDirectionAngleRight()).toMatchSnapshot();
            });

            it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getDirectionAngle(CurvedTileModel.DIRECTION_LEFT)).toMatchSnapshot();
                expect(tile.getDirectionAngleLeft()).toMatchSnapshot();
            });
        });

        describe('the angle of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getCurveAngle()).toMatchSnapshot();
            });
        });

        describe('the side of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getCurveSide()).toMatchSnapshot();
            });
        });

        describe('the center of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getCurveCenter()).toMatchSnapshot();
                expect(tile.getCurveCenter(tileX, tileY)).toMatchSnapshot();
            });
        });

        describe('the inner radius of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getInnerRadius()).toMatchSnapshot();
            });
        });

        describe('the outer radius of the curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getOuterRadius()).toMatchSnapshot();
            });
        });

        describe('the number of chunks by side for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getSideBarrierChunks()).toMatchSnapshot();
            });
        });

        describe('the number of chunks for the inner curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getInnerBarrierChunks()).toMatchSnapshot();
            });
        });

        describe('the number of chunks for the outer curve for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(tile.getOuterBarrierChunks()).toMatchSnapshot();
            });
        });

        describe('the position of the center point for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);

                expect(tile.getCenterCoord()).toMatchSnapshot();
                expect(tile.getCenterCoord(tileX, tileY)).toMatchSnapshot();
                expect(tile.getCenterCoord(tileX, tileY, 90)).toMatchSnapshot();
            });
        });

        describe('the position of the input point for a tile', () => {
            it.each(tileRatios)('with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);

                expect(tile.getInputCoord(tileX, tileY)).toMatchSnapshot();
                expect(tile.getInputCoord()).toMatchSnapshot();
            });
        });

        describe('the position of the output point for a tile', () => {
            it.each(tileRatios)('not oriented with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(() => tile.getOutputCoord(void 0)).toThrow('A valid direction is needed!');
                expect(() => tile.getOutputCoord(void 0, tileX, tileY)).toThrow('A valid direction is needed!');
                expect(() => tile.getOutputCoord(void 0, tileX, tileY, 90)).toThrow('A valid direction is needed!');
            });

            it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);

                expect(tile.getOutputCoord(CurvedTileModel.DIRECTION_RIGHT)).toMatchSnapshot();
                expect(tile.getOutputCoord(CurvedTileModel.DIRECTION_RIGHT, tileX, tileY)).toMatchSnapshot();
                expect(tile.getOutputCoord(CurvedTileModel.DIRECTION_RIGHT, tileX, tileY, 90)).toMatchSnapshot();

                expect(tile.getOutputCoordRight()).toMatchSnapshot();
                expect(tile.getOutputCoordRight(tileX, tileY)).toMatchSnapshot();
                expect(tile.getOutputCoordRight(tileX, tileY, 90)).toMatchSnapshot();
            });

            it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);

                expect(tile.getOutputCoord(CurvedTileModel.DIRECTION_LEFT)).toMatchSnapshot();
                expect(tile.getOutputCoord(CurvedTileModel.DIRECTION_LEFT, tileX, tileY)).toMatchSnapshot();
                expect(tile.getOutputCoord(CurvedTileModel.DIRECTION_LEFT, tileX, tileY, 90)).toMatchSnapshot();

                expect(tile.getOutputCoordLeft()).toMatchSnapshot();
                expect(tile.getOutputCoordLeft(tileX, tileY)).toMatchSnapshot();
                expect(tile.getOutputCoordLeft(tileX, tileY, 90)).toMatchSnapshot();
            });
        });

        describe('the angle of the output point for a tile', () => {
            it.each(tileRatios)('not oriented with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
                expect(() => tile.getOutputAngle(void 0)).toThrow('A valid direction is needed!');
                expect(() => tile.getOutputAngle(void 0, 90)).toThrow('A valid direction is needed!');
            });

            it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);

                expect(tile.getOutputAngle(CurvedTileModel.DIRECTION_RIGHT)).toMatchSnapshot();
                expect(tile.getOutputAngle(CurvedTileModel.DIRECTION_RIGHT, 90)).toMatchSnapshot();

                expect(tile.getOutputAngleRight()).toMatchSnapshot();
                expect(tile.getOutputAngleRight(90)).toMatchSnapshot();
            });

            it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);

                expect(tile.getOutputAngle(CurvedTileModel.DIRECTION_LEFT)).toMatchSnapshot();
                expect(tile.getOutputAngle(CurvedTileModel.DIRECTION_LEFT, 90)).toMatchSnapshot();

                expect(tile.getOutputAngleLeft()).toMatchSnapshot();
                expect(tile.getOutputAngleLeft(90)).toMatchSnapshot();
            });
        });
    });

    describe('has a static property', () => {
        describe('getCurvedTileModelWidth', () => {
            it('which computes the width of a tile knowing the width of its lane and its barrier', () => {
                expect(CurvedTileModel.getTileWidth(laneWidth, barrierWidth)).toBe(tileWidth);
            });
        });

        describe('getCurvedTileModelLength', () => {
            it('which computes the length of a tile knowing the width of its lane and its barrier', () => {
                expect(CurvedTileModel.getTileLength(laneWidth, barrierWidth)).toBe(tileLength);
            });
        });

        describe('getLaneWidth', () => {
            it('which computes the width of a lane knowing the width of a tile and its barrier', () => {
                expect(CurvedTileModel.getLaneWidth(tileWidth, barrierWidth)).toBe(laneWidth);
            });
        });

        describe('getCurveAngle', () => {
            it('which computes the angle of the curve with respect of the size ratio', () => {
                expect(CurvedTileModel.getCurveAngle()).toBe(90);
                expect(CurvedTileModel.getCurveAngle(0.5)).toBe(45);
                expect(CurvedTileModel.getCurveAngle(1)).toBe(90);
                expect(CurvedTileModel.getCurveAngle(2)).toBe(45);
                expect(CurvedTileModel.getCurveAngle(3)).toBe(30);
                expect(CurvedTileModel.getCurveAngle(4)).toBe(22.5);
            });
        });
    });
});
