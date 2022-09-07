<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { Sketch } from '../elements';
    import { TrackModel } from '../models';
    import Tile from './Tile.svelte';

    export let model;
    export let angle = 0;
    export let x = 0;
    export let y = 0;

    if (!(model instanceof TrackModel)) {
        throw new TypeError('The model must be an instance of TrackModel!');
    }

    $: track = $model.build(0, 0, angle);
</script>

<Sketch {x} {y} viewX={track.x} viewY={track.y} viewWidth={track.width} viewHeight={track.height}>
    {#each track.tiles as { id, x, y, angle, model } (id)}
        <Tile {model} {angle} {x} {y} {id} />
    {/each}
</Sketch>
