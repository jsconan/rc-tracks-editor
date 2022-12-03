<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { setContext } from 'svelte';
    import { Sketch } from '../../core/elements';
    import { TileElement } from '../../tile/elements';
    import TileSelector from './TileSelector.svelte';
    import { TrackEditorModel } from '../models';
    import { Track, TrackStats } from '../../track/components';
    import { extendTileWithStyle, TILE_STYLE_SELECTED } from '../../tile/helpers';
    import { KeyNavigator } from '../../core/navigators';
    import { focusElement } from '../../tile/components';

    export let editor;

    TrackEditorModel.validateInstance(editor);

    const { specs, tiles, track } = editor;
    const tilesStore = track.tilesStore;

    let overlay = null;
    let selected = null;
    let selectedIndex = -1;

    const select = index => {
        if (index < 0) {
            selected = null;
            return;
        }

        const tile = track.get(index);
        if (tile) {
            const { type, direction, ratio } = tile;
            const { rotation, x, y } = $tilesStore.tiles[index];
            selected = extendTileWithStyle(TILE_STYLE_SELECTED, { type, direction, ratio, rotation, x, y });
        }
    };

    const flipTile = index => {
        const tile = track.get(index);
        tile.flipDirection();
        track.update();
    };

    const deleteTile = index => {
        if (!track.delete(index)) {
            return;
        }

        const { length } = $tilesStore.tiles;
        if (selectedIndex >= length) {
            selectedIndex = length - 1;
        }

        if (selected) {
            select(selectedIndex);
        }
    };

    const addTile = event => {
        const { length } = $tilesStore.tiles;
        const { type, direction, ratio } = event.detail;

        if (selectedIndex < 0) {
            selectedIndex = length - 1;
        }

        track.insertTile(selectedIndex + 1, type, direction, ratio);
        selectedIndex = selectedIndex + 1;

        if (selected) {
            select(selectedIndex);
        }
    };

    const selectTile = event => {
        const { index } = event.detail;

        select(index);
    };

    const blur = () => (selected = null);
    const click = () => {
        flipTile(selectedIndex);
        select(selectedIndex);
    };

    const keyNavigator = new KeyNavigator();
    const keyUp = event => keyNavigator.processEvent(event);

    keyNavigator
        .on('validate', () => {
            click();
        })
        .on('cancel', () => {
            blur();
            const tile = track.get(selectedIndex);
            if (tile) {
                focusElement(tile.id);
            }
        })
        .on('delete', () => {
            deleteTile(selectedIndex);
        });

    setContext(specs.contextId, specs);

    $: overlay && overlay.focus();
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
                        <g
                            role="menu"
                            tabindex="0"
                            pointer-events="all"
                            class="overlay"
                            bind:this={overlay}
                            on:click={click}
                            on:keyup={keyUp}
                            on:blur={blur}
                        >
                            <TileElement {...selected} />
                        </g>
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

    .overlay:focus-visible {
        outline: none;
    }
    .overlay {
        cursor: pointer;
    }
</style>
