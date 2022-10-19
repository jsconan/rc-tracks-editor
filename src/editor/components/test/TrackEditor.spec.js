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

import { fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { CURVED_TILE_TYPE, STRAIGHT_TILE_TYPE, TILE_DIRECTION_LEFT, TILE_DIRECTION_RIGHT } from '../../../tile/helpers';
import { CurvedTileEnlargedModel, CurvedTileModel, StraightTileModel } from '../../../tile/models';
import { TrackEditorModel } from '../../models';
import { TileSpecifications } from '../../../tile/config';
import TrackEditor from '../TrackEditor.svelte';

const laneWidth = 80;
const barrierWidth = 5;
const barrierChunks = 4;
const specs = new TileSpecifications({ laneWidth, barrierWidth, barrierChunks });
const tiles = [
    [new StraightTileModel(specs), 2],
    [new CurvedTileModel(specs), 2],
    [new CurvedTileEnlargedModel(specs), 2]
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

describe('TrackEditor', () => {
    it('renders with default values', () => {
        const editor = new TrackEditorModel(specs);
        const props = { editor };
        const { container } = render(TrackEditor, { props });

        expect(container).toMatchSnapshot();
    });

    it('renders with the given parameters', () => {
        const editor = new TrackEditorModel(specs);
        editor.limit(tiles);
        editor.load(track);
        const props = { editor };
        const { container } = render(TrackEditor, { props });

        expect(container).toMatchSnapshot();
    });

    it('updates when the model is modified', async () => {
        const editor = new TrackEditorModel(specs);
        editor.limit(tiles);
        editor.load(track);
        const props = { editor };
        const rendered = render(TrackEditor, { props });

        await tick();
        editor.track.append();
        await tick();
        expect(rendered.container).toMatchSnapshot();
    });

    it('needs a valid model', () => {
        expect(() =>
            render(TrackEditor, {
                props: {
                    tiles: {
                        subscribe() {
                            return () => {};
                        }
                    }
                }
            })
        ).toThrow('The object must be an instance of TrackEditorModel!');
    });

    it('add tile to the track', async () => {
        const editor = new TrackEditorModel(specs);
        editor.limit(tiles);
        editor.load(track);
        const props = { editor };
        const { container } = render(TrackEditor, { props });

        await fireEvent.click(container.querySelector('.tiles .straight-tile'));
        expect(container).toMatchSnapshot();
    });

    it('flip tile in the track', async () => {
        const editor = new TrackEditorModel(specs);
        editor.limit(tiles);
        editor.load(track);
        const props = { editor };
        const { container } = render(TrackEditor, { props });

        await fireEvent.click(container.querySelector('.track [data-id=id-15]'));
        expect(container).toMatchSnapshot();
    });
});
