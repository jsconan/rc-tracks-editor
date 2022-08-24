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

import { Tile } from './tile';
import { Vector2D } from './vector-2d';

const tileX = 100;
const tileY = 100;
const tileRatios = [0.5, 1, 2, 3, 4];
const tileLength = 110;
const tileWidth = 90;
const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;

describe('Tile', () => {
    it('is a class', () => {
        expect(Tile).toEqual(expect.any(Function));
    });

    describe('can build a tile', () => {
        it('with the given size', () => {
            const tile = new Tile(tileLength, tileWidth);

            expect(tile).toBeInstanceOf(Tile);
            expect(tile).toMatchSnapshot();
        });

        it('with the given ratio', () => {
            const tile = new Tile(tileLength, tileWidth, 3);

            expect(tile).toBeInstanceOf(Tile);
            expect(tile).toMatchSnapshot();
        });

        it('with the given type', () => {
            const tile = new Tile(tileLength, tileWidth, 3, Tile.TYPE_CURVED);

            expect(tile).toBeInstanceOf(Tile);
            expect(tile).toMatchSnapshot();
        });

        it('with the given direction', () => {
            const tile = new Tile(tileLength, tileWidth, 3, Tile.TYPE_CURVED, Tile.DIRECTION_LEFT);

            expect(tile).toBeInstanceOf(Tile);
            expect(tile).toMatchSnapshot();
        });
    });

    describe('can compute', () => {
        describe('the actual length', () => {
            describe('for a straight tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_STRAIGHT);
                    expect(tile.getLength()).toMatchSnapshot();
                });
            });

            describe('for a curved tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED);
                    expect(tile.getLength()).toMatchSnapshot();
                });
            });

            describe('for a curved tile enlarged', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE);
                    expect(tile.getLength()).toMatchSnapshot();
                });
            });
        });

        describe('the actual width', () => {
            describe('for a straight tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_STRAIGHT);
                    expect(tile.getWidth()).toMatchSnapshot();
                });
            });

            describe('for a curved tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED);
                    expect(tile.getWidth()).toMatchSnapshot();
                });
            });

            describe('for a curved tile enlarged', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE);
                    expect(tile.getWidth()).toMatchSnapshot();
                });
            });
        });

        describe('the width padding', () => {
            describe('for a straight tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_STRAIGHT);
                    expect(tile.getPadding()).toMatchSnapshot();
                });
            });

            describe('for a curved tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED);
                    expect(tile.getPadding()).toMatchSnapshot();
                });
            });

            describe('for a curved tile enlarged', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE);
                    expect(tile.getPadding()).toMatchSnapshot();
                });
            });
        });

        describe('the rotation angle of the direction', () => {
            describe('for a straight tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_STRAIGHT);
                    expect(tile.getDirectionAngle()).toMatchSnapshot();
                });
            });

            describe('for a curved tile', () => {
                it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED, Tile.DIRECTION_RIGHT);
                    expect(tile.getDirectionAngle()).toMatchSnapshot();
                });

                it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED, Tile.DIRECTION_LEFT);
                    expect(tile.getDirectionAngle()).toMatchSnapshot();
                });
            });

            describe('for a curved tile enlarged', () => {
                it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE, Tile.DIRECTION_RIGHT);
                    expect(tile.getDirectionAngle()).toMatchSnapshot();
                });

                it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE, Tile.DIRECTION_LEFT);
                    expect(tile.getDirectionAngle()).toMatchSnapshot();
                });
            });
        });

        describe('the angle of the curve', () => {
            describe('for a straight tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_STRAIGHT);
                    expect(tile.getCurveAngle()).toMatchSnapshot();
                });
            });

            describe('for a curved tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED);
                    expect(tile.getCurveAngle()).toMatchSnapshot();
                });
            });

            describe('for a curved tile enlarged', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE);
                    expect(tile.getCurveAngle()).toMatchSnapshot();
                });
            });
        });

        describe('the outer side of the curve', () => {
            describe('for a curved tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED);
                    expect(tile.getCurveSide()).toMatchSnapshot();
                });
            });

            describe('for a curved tile enlarged', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE);
                    expect(tile.getCurveSide()).toMatchSnapshot();
                });
            });
        });

        describe('the inner radius of the curve', () => {
            describe('for a curved tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED);
                    expect(tile.getInnerRadius()).toMatchSnapshot();
                });
            });

            describe('for a curved tile enlarged', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE);
                    expect(tile.getInnerRadius()).toMatchSnapshot();
                });
            });
        });

        describe('the outer radius of the curve', () => {
            describe('for a curved tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED);
                    expect(tile.getOuterRadius()).toMatchSnapshot();
                });
            });

            describe('for a curved tile enlarged', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE);
                    expect(tile.getOuterRadius()).toMatchSnapshot();
                });
            });
        });

        describe('the number of chunks by side', () => {
            describe('for a straight tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_STRAIGHT);
                    expect(tile.getSideBarrierChunks(barrierChunks)).toMatchSnapshot();
                });
            });

            describe('for a curved tile enlarged', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE);
                    expect(tile.getSideBarrierChunks(barrierChunks)).toMatchSnapshot();
                });
            });
        });

        describe('the number of chunks for the inner curve', () => {
            describe('for a curved tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED);
                    expect(tile.getInnerBarrierChunks(barrierChunks)).toMatchSnapshot();
                });
            });

            describe('for a curved tile enlarged', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE);
                    expect(tile.getInnerBarrierChunks(barrierChunks)).toMatchSnapshot();
                });
            });
        });

        describe('the number of chunks for the outer curve', () => {
            describe('for a curved tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED);
                    expect(tile.getOuterBarrierChunks(barrierChunks)).toMatchSnapshot();
                });
            });

            describe('for a curved tile enlarged', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE);
                    expect(tile.getOuterBarrierChunks(barrierChunks)).toMatchSnapshot();
                });
            });
        });

        describe('the position of the input point', () => {
            describe('for a straight tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_STRAIGHT);
                    const point = tile.getInputCoord(tileX, tileY);

                    expect(point).toBeInstanceOf(Vector2D);
                    expect(point).toMatchSnapshot();

                    expect(tile.getInputCoord()).toMatchSnapshot();
                });
            });

            describe('for a curved tile', () => {
                it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED, Tile.DIRECTION_RIGHT);
                    const point = tile.getInputCoord(tileX, tileY);

                    expect(point).toBeInstanceOf(Vector2D);
                    expect(point).toMatchSnapshot();

                    expect(tile.getInputCoord()).toMatchSnapshot();
                });

                it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED, Tile.DIRECTION_LEFT);
                    const point = tile.getInputCoord(tileX, tileY);

                    expect(point).toBeInstanceOf(Vector2D);
                    expect(point).toMatchSnapshot();

                    expect(tile.getInputCoord()).toMatchSnapshot();
                });
            });

            describe('for a curved tile enlarged', () => {
                it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE, Tile.DIRECTION_RIGHT);
                    const point = tile.getInputCoord(tileX, tileY);

                    expect(point).toBeInstanceOf(Vector2D);
                    expect(point).toMatchSnapshot();

                    expect(tile.getInputCoord()).toMatchSnapshot();
                });

                it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE, Tile.DIRECTION_LEFT);
                    const point = tile.getInputCoord(tileX, tileY);

                    expect(point).toBeInstanceOf(Vector2D);
                    expect(point).toMatchSnapshot();

                    expect(tile.getInputCoord()).toMatchSnapshot();
                });
            });
        });

        describe('the position of the output point', () => {
            describe('for a straight tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_STRAIGHT);

                    const point0 = tile.getOutputCoord(tileX, tileY, 0);
                    expect(point0).toBeInstanceOf(Vector2D);
                    expect(point0).toMatchSnapshot();

                    const point90 = tile.getOutputCoord(tileX, tileY, 90);
                    expect(point90).toBeInstanceOf(Vector2D);
                    expect(point90).toMatchSnapshot();

                    expect(tile.getOutputCoord()).toMatchSnapshot();
                });
            });

            describe('for a curved tile', () => {
                it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED, Tile.DIRECTION_RIGHT);

                    const point0 = tile.getOutputCoord(tileX, tileY, 0);
                    expect(point0).toBeInstanceOf(Vector2D);
                    expect(point0).toMatchSnapshot();

                    const point90 = tile.getOutputCoord(tileX, tileY, 90);
                    expect(point90).toBeInstanceOf(Vector2D);
                    expect(point90).toMatchSnapshot();

                    expect(tile.getOutputCoord()).toMatchSnapshot();
                });

                it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED, Tile.DIRECTION_LEFT);

                    const point0 = tile.getOutputCoord(tileX, tileY, 0);
                    expect(point0).toBeInstanceOf(Vector2D);
                    expect(point0).toMatchSnapshot();

                    const point90 = tile.getOutputCoord(tileX, tileY, 90);
                    expect(point90).toBeInstanceOf(Vector2D);
                    expect(point90).toMatchSnapshot();

                    expect(tile.getOutputCoord()).toMatchSnapshot();
                });
            });

            describe('for a curved tile enlarged', () => {
                it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE, Tile.DIRECTION_RIGHT);

                    const point0 = tile.getOutputCoord(tileX, tileY, 0);
                    expect(point0).toBeInstanceOf(Vector2D);
                    expect(point0).toMatchSnapshot();

                    const point90 = tile.getOutputCoord(tileX, tileY, 90);
                    expect(point90).toBeInstanceOf(Vector2D);
                    expect(point90).toMatchSnapshot();

                    expect(tile.getOutputCoord()).toMatchSnapshot();
                });

                it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE, Tile.DIRECTION_LEFT);

                    const point0 = tile.getOutputCoord(tileX, tileY, 0);
                    expect(point0).toBeInstanceOf(Vector2D);
                    expect(point0).toMatchSnapshot();

                    const point90 = tile.getOutputCoord(tileX, tileY, 90);
                    expect(point90).toBeInstanceOf(Vector2D);
                    expect(point90).toMatchSnapshot();

                    expect(tile.getOutputCoord()).toMatchSnapshot();
                });
            });
        });

        describe('the position of the center point', () => {
            describe('for a straight tile', () => {
                it.each(tileRatios)('with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_STRAIGHT);

                    const point0 = tile.getCenterCoord(tileX, tileY, 0);
                    expect(point0).toBeInstanceOf(Vector2D);
                    expect(point0).toMatchSnapshot();

                    const point90 = tile.getCenterCoord(tileX, tileY, 90);
                    expect(point90).toBeInstanceOf(Vector2D);
                    expect(point90).toMatchSnapshot();

                    expect(tile.getCenterCoord()).toMatchSnapshot();
                });
            });

            describe('for a curved tile', () => {
                it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED, Tile.DIRECTION_RIGHT);

                    const point0 = tile.getCenterCoord(tileX, tileY, 0);
                    expect(point0).toBeInstanceOf(Vector2D);
                    expect(point0).toMatchSnapshot();

                    const point90 = tile.getCenterCoord(tileX, tileY, 90);
                    expect(point90).toBeInstanceOf(Vector2D);
                    expect(point90).toMatchSnapshot();

                    expect(tile.getCenterCoord()).toMatchSnapshot();
                });

                it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_CURVED, Tile.DIRECTION_LEFT);

                    const point0 = tile.getCenterCoord(tileX, tileY, 0);
                    expect(point0).toBeInstanceOf(Vector2D);
                    expect(point0).toMatchSnapshot();

                    const point90 = tile.getCenterCoord(tileX, tileY, 90);
                    expect(point90).toBeInstanceOf(Vector2D);
                    expect(point90).toMatchSnapshot();

                    expect(tile.getCenterCoord()).toMatchSnapshot();
                });
            });

            describe('for a curved tile enlarged', () => {
                it.each(tileRatios)('oriented to the right with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE, Tile.DIRECTION_RIGHT);

                    const point0 = tile.getCenterCoord(tileX, tileY, 0);
                    expect(point0).toBeInstanceOf(Vector2D);
                    expect(point0).toMatchSnapshot();

                    const point90 = tile.getCenterCoord(tileX, tileY, 90);
                    expect(point90).toBeInstanceOf(Vector2D);
                    expect(point90).toMatchSnapshot();

                    expect(tile.getCenterCoord()).toMatchSnapshot();
                });

                it.each(tileRatios)('oriented to the left with a ratio of %s', ratio => {
                    const tile = new Tile(tileLength, tileWidth, ratio, Tile.TYPE_ENLARGED_CURVE, Tile.DIRECTION_LEFT);

                    const point0 = tile.getCenterCoord(tileX, tileY, 0);
                    expect(point0).toBeInstanceOf(Vector2D);
                    expect(point0).toMatchSnapshot();

                    const point90 = tile.getCenterCoord(tileX, tileY, 90);
                    expect(point90).toBeInstanceOf(Vector2D);
                    expect(point90).toMatchSnapshot();

                    expect(tile.getCenterCoord()).toMatchSnapshot();
                });
            });
        });
    });

    describe('has a static property', () => {
        describe('getTileWidth', () => {
            it('which computes the width of a tile knowing the width of its lane and its barrier', () => {
                expect(Tile.getTileWidth(laneWidth, barrierWidth)).toBe(tileWidth);
            });
        });

        describe('getTileLength', () => {
            it('which computes the length of a tile knowing the width of its lane and its barrier', () => {
                expect(Tile.getTileLength(laneWidth, barrierWidth)).toBe(tileLength);
            });
        });

        describe('getLaneWidth', () => {
            it('which computes the width of a lane knowing the width of a tile and its barrier', () => {
                expect(Tile.getLaneWidth(tileWidth, barrierWidth)).toBe(laneWidth);
            });
        });
    });
});
