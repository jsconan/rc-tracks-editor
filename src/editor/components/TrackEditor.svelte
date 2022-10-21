<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { setContext } from 'svelte';
    import { Sketch } from '../../track/elements';
    import { TileOverlay } from '../../tile/components';
    import TileSelector from './TileSelector.svelte';
    import { TrackEditorModel } from '../models';
    import { Track, TrackStats } from '../../track/components';

    export let editor;

    TrackEditorModel.validateInstance(editor);

    const { specs, tiles, track } = editor;

    let selection = null;
    const addTile = event => track.append(event.detail.type, event.detail.direction, event.detail.ratio);
    const flipTile = event => {
        const { id, angle, x, y } = event.detail;
        const tile = track.getById(id);
        selection = { tile, angle, x, y };
        tile.flipDirection();
        track.update();
    };

    setContext(specs.contextId, specs);
</script>

<article class="editor">
    <aside class="tiles">
        <Sketch width="100%" height="100%">
            <TileSelector {tiles} on:click={addTile} />
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
                <Track {track} on:click={flipTile}>
                    {#if selection}
                        <TileOverlay {...selection} />
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
