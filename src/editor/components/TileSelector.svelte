<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { createEventDispatcher } from 'svelte';
    import { buildList } from '../../track/helpers';
    import { getRect } from '../../core/helpers';
    import { KeyNavigator } from '../../core/navigators';
    import { Sketch } from '../../track/elements';
    import { Tile, TileNavigator } from '../../tile/components';
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
    const direction = KeyNavigator.MODE_VERTICAL;

    const getTextX = (x, rect) => x + rect.x + rect.width / 2;
    const getTextY = (y, rect) => y + rect.y + rect.height / 2;

    const dispatch = createEventDispatcher();
    let selectedIndex = -1;
    const select = event => {
        dispatch('select', event.detail);
        selectedIndex = -1;
    };

    $: models = buildList($modelsStore, {
        tileAngle: -90,
        centered: true,
        aligned: true,
        vertical: true,
        hPadding: specs.padding,
        vPadding: specs.padding
    });
    $: rect = getRect(models);
</script>

<Sketch {x} {y} {width} {height} viewX={models.x} viewY={models.y} viewWidth={models.width} viewHeight={models.height}>
    <TileNavigator elements={models.tiles} {direction} {...rect} bind:selectedIndex on:select={select}>
        {#each models.tiles as { id, type, direction, ratio, x, y, angle, rect }, i (id)}
            <g data-id={id} role="menuitem" tabindex="-1">
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
    </TileNavigator>
</Sketch>

<style>
    text {
        user-select: none;
    }
</style>
