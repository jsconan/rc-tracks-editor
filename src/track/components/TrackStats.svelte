<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { Sketch } from '../elements';
    import { Tile } from '../../tile/components';
    import { TrackModel } from '../models';
    import { buildList } from '../helpers';

    export let track;
    export let x = 0;
    export let y = 0;
    export let width = void 0;
    export let height = void 0;

    TrackModel.validateInstance(track);

    const counterStore = track.counterStore;
    const modelsStore = track.modelsStore;

    const getTextX = (x, rect) => x + rect.x + rect.width / 2;
    const getTextY = (y, rect) => y + rect.y + rect.height / 2;

    function sortModels(a, b) {
        const typeCompare = -a.type.localeCompare(b.type);
        if (!typeCompare) {
            return a.ratio - b.ratio;
        }
        return typeCompare;
    }

    $: models = buildList($modelsStore, {
        tileAngle: -0,
        centered: true,
        aligned: true,
        vertical: false,
        hPadding: 30,
        vPadding: 50
    });
</script>

<Sketch {x} {y} {width} {height} viewX={models.x} viewY={models.y} viewWidth={models.width} viewHeight={models.height}>
    {#each models.tiles as { id, type, direction, ratio, x, y, angle, rect }, i (id)}
        <Tile {type} {direction} {ratio} {angle} {x} {y} />
        <text x={getTextX(x, rect)} y={getTextY(y, rect)} dominant-baseline="middle">{$counterStore[i].count}</text>
    {/each}
</Sketch>

<style>
    text {
        font: bold 40px sans-serif;
        fill: var(--color-fg);
    }
</style>
