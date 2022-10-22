<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { createEventDispatcher } from 'svelte';
    import { buildList } from '../../track/helpers';
    import { Sketch } from '../../track/elements';
    import { Tile } from '../../tile/components';
    import { TileSet } from '../models';

    export let tiles;
    export let x = 0;
    export let y = 0;
    export let width = void 0;
    export let height = void 0;

    TileSet.validateInstance(tiles);

    const counterStore = tiles.counterStore;
    const modelsStore = tiles.modelsStore;
    const specs = tiles.specs;
    const modelClass = 'model';

    const getTextX = (x, rect) => x + rect.x + rect.width / 2;
    const getTextY = (y, rect) => y + rect.y + rect.height / 2;

    const dispatch = createEventDispatcher();

    function dispatchEvent(event) {
        const target = event.target.closest(`.${modelClass}`);
        const targetId = target && target.dataset.id;
        const index = $modelsStore.findIndex(tile => tile.id === targetId);
        if (index > -1) {
            const tileCoord = models.tiles[index];
            dispatch(event.type, { ...tileCoord, event });
        }
    }

    $: models = buildList($modelsStore, {
        tileAngle: -90,
        centered: true,
        aligned: true,
        vertical: true,
        hPadding: specs.padding,
        vPadding: specs.padding
    });
</script>

<Sketch
    {x}
    {y}
    {width}
    {height}
    viewX={models.x}
    viewY={models.y}
    viewWidth={models.width}
    viewHeight={models.height}
    on:click={dispatchEvent}
    on:keypress={dispatchEvent}
>
    {#each models.tiles as { id, type, direction, ratio, x, y, angle, rect }, i (id)}
        <g class={modelClass} data-id={id} on:mouseenter={dispatchEvent} on:mouseleave={dispatchEvent}>
            <Tile {type} {direction} {ratio} {angle} {x} {y} />
            {#if $counterStore[i].count !== Number.POSITIVE_INFINITY}
                <text
                    x={getTextX(x, rect)}
                    y={getTextY(y, rect)}
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-size="{specs.width / 3}px"
                    fill="var(--color-fg)"
                >
                    {$counterStore[i].count}
                </text>
            {/if}
        </g>
    {/each}
</Sketch>

<style>
    .model {
        cursor: pointer;
    }

    text {
        user-select: none;
    }
</style>
