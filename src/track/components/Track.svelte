<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { buildTrack } from '../helpers';
    import { Sketch } from '../elements';
    import { TileList } from '../../tile/models';
    import { Tile } from '../../tile/components';

    export let model;
    export let angle = 0;
    export let x = 0;
    export let y = 0;
    export let width = void 0;
    export let height = void 0;
    export let hPadding = void 0;
    export let vPadding = void 0;

    TileList.validateInstance(model);

    $: track = buildTrack($model, { startAngle: angle, hPadding, vPadding });
</script>

<Sketch {x} {y} {width} {height} viewX={track.x} viewY={track.y} viewWidth={track.width} viewHeight={track.height}>
    {#each track.tiles as { id, type, direction, ratio, x, y, angle } (id)}
        <Tile {type} {direction} {ratio} {angle} {x} {y} {id} />
    {/each}
</Sketch>
