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

import { CURVED_TILE_TYPE, STRAIGHT_TILE_TYPE, TILE_DIRECTION_LEFT, TILE_DIRECTION_RIGHT } from '../../../tile/helpers';
import { CurvedTileEnlargedModel, CurvedTileModel, StraightTileModel } from '../../../tile/models';
import { TileSpecifications } from '../../../tile/config';
import { TileSet } from '../TileSet';
import { TrackEditorModel } from '../TrackEditorModel.js';
import { TrackModel } from '../../../track/models';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const maxRatio = 4;
const specs = new TileSpecifications({ laneWidth, barrierWidth, barrierChunks, maxRatio });
const models = [
    new StraightTileModel(specs),
    new CurvedTileModel(specs, CurvedTileModel.DIRECTION_RIGHT, 1),
    new CurvedTileModel(specs, CurvedTileModel.DIRECTION_RIGHT, 2),
    new CurvedTileModel(specs, CurvedTileModel.DIRECTION_RIGHT, 3),
    new CurvedTileModel(specs, CurvedTileModel.DIRECTION_RIGHT, 4),
    new CurvedTileEnlargedModel(specs)
];
const unlimitedTiles = [
    [models[0].modelId, Number.POSITIVE_INFINITY],
    [models[1].modelId, Number.POSITIVE_INFINITY],
    [models[2].modelId, Number.POSITIVE_INFINITY],
    [models[3].modelId, Number.POSITIVE_INFINITY],
    [models[4].modelId, Number.POSITIVE_INFINITY],
    [models[5].modelId, Number.POSITIVE_INFINITY]
];
const limitedTiles = [
    [new StraightTileModel(specs), 2],
    [new CurvedTileEnlargedModel(specs), 2],
    [new CurvedTileModel(specs), 2]
];
const track = [
    {
        type: CURVED_TILE_TYPE,
        direction: TILE_DIRECTION_LEFT,
        ratio: 1
    },
    {
        type: STRAIGHT_TILE_TYPE,
        direction: TILE_DIRECTION_RIGHT,
        ratio: 1
    },
    {
        type: CURVED_TILE_TYPE,
        direction: TILE_DIRECTION_RIGHT,
        ratio: 1
    }
];

describe('TrackEditorModel', () => {
    it('is a class', () => {
        expect(TrackEditorModel).toEqual(expect.any(Function));
    });

    it('needs a specifications object', () => {
        const editor = new TrackEditorModel(specs);

        expect(editor.specs).toBe(specs);

        expect(() => new TrackEditorModel()).toThrow(
            'The specifications object must be an instance of TileSpecifications!'
        );
        expect(() => new TrackEditorModel({})).toThrow(
            'The specifications object must be an instance of TileSpecifications!'
        );
    });

    it('has a tiles property', () => {
        const editor = new TrackEditorModel(specs);

        expect(editor.tiles).toBeInstanceOf(TileSet);
    });

    it('has a track property', () => {
        const editor = new TrackEditorModel(specs);

        expect(editor.track).toBeInstanceOf(TrackModel);
    });

    it('is created with a default set of tiles', () => {
        const editor = new TrackEditorModel(specs);

        expect([...editor.tiles]).toEqual(unlimitedTiles);
    });

    it('is created with an empty track', () => {
        const editor = new TrackEditorModel(specs);

        expect([...editor.track]).toStrictEqual([]);
    });

    it('can set the specifications of the tile models', () => {
        const editor = new TrackEditorModel(specs);
        const newSpecs = new TileSpecifications({ laneWidth: 10, barrierWidth: 1, barrierChunks: 2 });
        const callback = jest.fn().mockImplementation(s => {
            expect(s).toBe(newSpecs);
        });

        const tiles = [new StraightTileModel(specs), new CurvedTileEnlargedModel(specs), new CurvedTileModel(specs)];

        editor.on('specs', callback);

        expect(editor.setSpecs(newSpecs)).toBe(editor);
        editor.load(tiles);

        expect(editor.setSpecs(newSpecs)).toBe(editor);
        expect(editor.track).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('can set the rotation angle', () => {
        const editor = new TrackEditorModel(specs);

        expect(editor.track.getBuilderOption('startAngle')).toBe(0);
        expect(editor.setAngle(90)).toBe(editor);
        expect(editor.track.getBuilderOption('startAngle')).toBe(90);
    });

    it('can limit the available set of tiles', () => {
        const editor = new TrackEditorModel(specs);

        const callback = jest.fn();
        editor.on('limit', callback);

        expect(editor.limit(limitedTiles)).toBe(editor);
        expect([...editor.tiles]).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can remove the limit for the available set of tiles', () => {
        const editor = new TrackEditorModel(specs);
        editor.limit([new StraightTileModel(specs)]);

        const callback = jest.fn();
        editor.on('limit', callback);

        expect(editor.limit()).toBe(editor);
        expect([...editor.tiles]).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('takes the existing track into account when limiting the available set of tiles', () => {
        const editor = new TrackEditorModel(specs);
        editor.load(track);

        const callback = jest.fn();
        editor.on('limit', callback);

        expect(editor.limit(limitedTiles)).toBe(editor);
        expect([...editor.tiles]).toMatchSnapshot();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can load a track', () => {
        const editor = new TrackEditorModel(specs);

        const callback = jest.fn();
        editor.on('load', callback);

        expect(editor.load(track)).toBe(editor);
        expect([...editor.track]).toMatchSnapshot();

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('updates the set of tiles when loading a track', () => {
        const editor = new TrackEditorModel(specs);
        editor.limit(limitedTiles);

        expect(editor.load(track)).toBe(editor);
        expect([...editor.tiles]).toMatchSnapshot();
    });

    it('resets the set of tiles when loading a track', () => {
        const editor = new TrackEditorModel(specs);
        editor.load(track);
        editor.limit(limitedTiles);

        expect(editor.load(track.slice(0, 1))).toBe(editor);
        expect([...editor.tiles]).toMatchSnapshot();
    });

    it('can save a track', () => {
        const editor = new TrackEditorModel(specs);
        editor.load(track);

        const callback = jest.fn().mockImplementation(data => {
            expect(data).toStrictEqual(track);
        });
        editor.on('save', callback);

        expect(editor.save()).toStrictEqual(track);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('can clear the editor', () => {
        const editor = new TrackEditorModel(specs);
        editor.load(track);

        const callback = jest.fn();
        editor.on('clear', callback);

        expect(editor.clear()).toBe(editor);
        expect([...editor.track]).toStrictEqual([]);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('resets the set of tiles when clearing the editor', () => {
        const editor = new TrackEditorModel(specs);
        editor.limit(limitedTiles);
        editor.load(track);

        expect(editor.clear()).toBe(editor);
        expect([...editor.track]).toStrictEqual([]);
        expect([...editor.tiles]).toMatchSnapshot();
    });

    it('updates the set of tiles when adding a tile to the track', () => {
        const editor = new TrackEditorModel(specs);
        editor.limit(limitedTiles);

        editor.track.append();
        expect([...editor.tiles]).toMatchSnapshot();
    });

    it('updates the set of tiles when removing a tile from the track', () => {
        const editor = new TrackEditorModel(specs);
        editor.limit(limitedTiles);
        editor.load(track);

        editor.track.remove(editor.track.last().id);
        expect([...editor.tiles]).toMatchSnapshot();
    });

    it('can validate an object is an instance of the class', () => {
        const counter = new TrackEditorModel(specs);
        expect(() => TrackEditorModel.validateInstance(counter)).not.toThrow();
        expect(() => TrackEditorModel.validateInstance({})).toThrow(
            'The object must be an instance of TrackEditorModel!'
        );
    });
});
