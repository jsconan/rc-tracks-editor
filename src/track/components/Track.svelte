<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { buildTrack } from '../builders';
    import { Sketch } from '../elements';
    import { TilesList } from '../models';
    import Tile from './Tile.svelte';

    export let model;
    export let angle = 0;
    export let x = 0;
    export let y = 0;
    export let width = void 0;
    export let height = void 0;

    if (!(model instanceof TilesList)) {
        throw new TypeError('The model must be an instance of TilesList!');
    }

    $: track = buildTrack($model, { startAngle: angle });
</script>

<Sketch {x} {y} {width} {height} viewX={track.x} viewY={track.y} viewWidth={track.width} viewHeight={track.height}>
    {#each track.tiles as { id, x, y, angle, model } (id)}
        <Tile {model} {angle} {x} {y} {id} />
    {/each}
</Sketch>
