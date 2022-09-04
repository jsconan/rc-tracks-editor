<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { CURVED_TILE_ENLARGED_TYPE, CURVED_TILE_TYPE, STRAIGHT_TILE_TYPE } from '../helpers';
    import { Sketch } from '../elements';
    import { TrackModel } from '../models';
    import CurvedTile from './CurvedTile.svelte';
    import CurvedTileEnlarged from './CurvedTileEnlarged.svelte';
    import StraightTile from './StraightTile.svelte';

    export let model;
    export let angle = 0;
    export let x = 0;
    export let y = 0;

    if (!(model instanceof TrackModel)) {
        throw new TypeError('The model must be an instance of TrackModel!');
    }

    /**
     * @type {object} - Maps the types of tile to their respective component.
     * @private
     */
    const componentsMap = {
        [STRAIGHT_TILE_TYPE]: StraightTile,
        [CURVED_TILE_TYPE]: CurvedTile,
        [CURVED_TILE_ENLARGED_TYPE]: CurvedTileEnlarged
    };

    $: track = $model.build(0, 0, angle);
</script>

<Sketch {x} {y} viewX={track.x} viewY={track.y} viewWidth={track.width} viewHeight={track.height}>
    {#each track.tiles as { id, type, x, y, angle, model } (id)}
        <svelte:component this={componentsMap[type]} {model} {angle} {x} {y} {id} />
    {/each}
</Sketch>
