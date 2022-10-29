<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { buildList } from '../../track/helpers';
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

    const getTextX = (x, rect) => x + rect.x + rect.width / 2;
    const getTextY = (y, rect) => y + rect.y + rect.height / 2;

    let hoveredIndex = -1;
    const enter = event => {
        const target = event.target.closest('[data-id]');
        const targetId = target && target.dataset.id;
        hoveredIndex = $modelsStore.findIndex(tile => tile.id === targetId);
    };
    const leave = () => {
        hoveredIndex = -1;
    };

    $: models = buildList($modelsStore, {
        tileAngle: -90,
        centered: true,
        aligned: true,
        vertical: true,
        hPadding: specs.padding,
        vPadding: specs.padding
    });
</script>

<Sketch {x} {y} {width} {height} viewX={models.x} viewY={models.y} viewWidth={models.width} viewHeight={models.height}>
    <TileNavigator elements={models.tiles} {hoveredIndex} on:select>
        {#each models.tiles as { id, type, direction, ratio, x, y, angle, rect }, i (id)}
            <g data-id={id} role="menuitem" tabindex="-1" on:mouseenter={enter} on:mouseleave={leave}>
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
