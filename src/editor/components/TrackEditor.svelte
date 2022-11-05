<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { setContext } from 'svelte';
    import { Sketch } from '../../track/elements';
    import { TileElement } from '../../tile/elements';
    import TileSelector from './TileSelector.svelte';
    import { TrackEditorModel } from '../models';
    import { Track, TrackStats } from '../../track/components';
    import { extendTileWithStyle, TILE_STYLE_SELECTED } from '../../tile/helpers';

    export let editor;

    TrackEditorModel.validateInstance(editor);

    const { specs, tiles, track } = editor;
    const tilesStore = track.tilesStore;

    let selected = null;
    let selectedIndex = -1;

    const select = index => {
        const tile = track.get(index);
        if (tile) {
            const { type, direction, ratio } = tile;
            const { angle, x, y } = $tilesStore.tiles[index];
            selected = extendTileWithStyle(TILE_STYLE_SELECTED, { type, direction, ratio, angle, x, y });
        }
    };

    const flipTile = id => {
        const tile = track.getById(id);
        tile.flipDirection();
        track.update();
    };

    const addTile = event => {
        const { length } = $tilesStore.tiles;
        const { type, direction, ratio } = event.detail;

        if (selectedIndex < 0) {
            selectedIndex = length - 1;
        }

        track.insertAt(selectedIndex + 1, type, direction, ratio);
        selectedIndex = selectedIndex + 1;

        if (selected) {
            select(selectedIndex);
        }
    };

    const selectTile = event => {
        const { id, index } = event.detail;

        flipTile(id);
        select(index);
    };

    setContext(specs.contextId, specs);
</script>

<article class="editor">
    <aside class="tiles">
        <Sketch width="100%" height="100%">
            <TileSelector {tiles} on:select={addTile} />
        </Sketch>
    </aside>
    <article class="track">
        <aside class="stats">
            <Sketch width="100%" height="100%">
                <TrackStats {track} />
            </Sketch>
        </aside>
        <article class="canvas">
            <Sketch width="100%" height="100%">
                <Track {track} bind:selectedIndex on:select={selectTile}>
                    {#if selected}
                        <TileElement {...selected} />
                    {/if}
                </Track>
            </Sketch>
        </article>
    </article>
</article>

<style>
    .editor {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    .track {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .tiles {
        flex: 0 0 auto;
        width: 10vw;
    }

    .stats {
        flex: 0 0 auto;
        height: 10vh;
    }

    .canvas {
        flex: 1 1 auto;
        background-color: var(--color-canvas);
    }
</style>
