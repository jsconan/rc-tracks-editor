<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { Sketch } from '../elements';
    import { Tile } from '../../tile/components';
    import { buildList } from '../helpers';
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

    const getTextX = (x, rect) => x + rect.x + rect.width / 2;
    const getTextY = (y, rect) => y + rect.y + rect.height / 2;

    $: models = buildList($modelsStore, {
        tileAngle: -90,
        centered: true,
        aligned: true,
        vertical: true,
        vPadding: specs.padding
    });
</script>

<Sketch {x} {y} {width} {height} viewX={models.x} viewY={models.y} viewWidth={models.width} viewHeight={models.height}>
    {#each models.tiles as { id, type, direction, ratio, x, y, angle, rect }, i (id)}
        <Tile {type} {direction} {ratio} {angle} {x} {y} on:click />
        {#if $counterStore[i].count !== Number.POSITIVE_INFINITY}
            <text
                x={getTextX(x, rect)}
                y={getTextY(y, rect)}
                text-anchor="middle"
                dominant-baseline="middle"
                style="--font-size: {specs.width / 3}px"
            >
                {$counterStore[i].count}
            </text>
        {/if}
    {/each}
</Sketch>

<style>
    text {
        font: var(--font-size) sans-serif;
        fill: var(--color-fg);
    }
</style>
