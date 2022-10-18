<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { Sketch } from '../elements';
    import { Tile } from '../../tile/components';
    import { buildList } from '../helpers';
    import { TrackModel } from '../models';

    export let track;
    export let x = 0;
    export let y = 0;
    export let width = void 0;
    export let height = void 0;

    TrackModel.validateInstance(track);

    const counterStore = track.counterStore;
    const modelsStore = track.modelsStore;
    const specs = track.specs;
    const modelClass = 'model';

    const getTextX = (x, rect) => x + rect.x + rect.width / 2;
    const getTextY = (y, rect) => y + rect.y + rect.height / 2;

    $: models = buildList($modelsStore, {
        tileAngle: -0,
        centered: true,
        aligned: true,
        vertical: false,
        hPadding: specs.padding,
        vPadding: specs.padding
    });
</script>

<Sketch {x} {y} {width} {height} viewX={models.x} viewY={models.y} viewWidth={models.width} viewHeight={models.height}>
    {#each models.tiles as { id, type, direction, ratio, x, y, angle, rect }, i (id)}
        <g class={modelClass} data-id={id}>
            <Tile {type} {direction} {ratio} {angle} {x} {y} />
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
        </g>
    {/each}
</Sketch>

<style>
    .model {
        cursor: default;
    }

    text {
        user-select: none;
    }
</style>
