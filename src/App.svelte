<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import OutlineFilter from './filters/OutlineFilter.svelte';

    import config from './config.js';
    import ControlPoints from './components/ControlPoints.svelte';
    import Sketch from './elements/Sketch.svelte';
    import TrackModel from './models/TrackModel.js';
    import {
        CURVED_TILE_ENLARGED_TYPE,
        CURVED_TILE_TYPE,
        STRAIGHT_TILE_TYPE,
        TILE_DIRECTION_LEFT,
        TILE_DIRECTION_RIGHT
    } from './helpers/types';
    import data from './data/tracks.json';

    const barrierChunks = config.barrierChunks;
    const barrierWidth = config.barrierWidth;
    const laneWidth = config.laneWidth;

    const trackModel = new TrackModel(laneWidth, barrierWidth, barrierChunks);

    trackModel.addTile(STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT);
    trackModel.addTile(STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT);
    trackModel.addTile(STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT);
    trackModel.addTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    trackModel.addTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    trackModel.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    trackModel.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    trackModel.addTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    trackModel.addTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    trackModel.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);
    trackModel.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);
    trackModel.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    trackModel.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    trackModel.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, 3);
    trackModel.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, 3);
    trackModel.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, 3);
    trackModel.addTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    trackModel.addTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    trackModel.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    trackModel.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    trackModel.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    trackModel.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    trackModel.addTile(STRAIGHT_TILE_TYPE, TILE_DIRECTION_LEFT);
    trackModel.addTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);

    // trackModel.import(data.square);

    const track = trackModel.build(0, 0, -90);
    console.log(JSON.stringify(trackModel.export()));
</script>

<Sketch x={track.x} y={track.y} viewWidth={track.width} viewHeight={track.height} width="100%" height="100%">
    <OutlineFilter R={0.2} G={0.9} B={0.4} A={0.9} width={6} slot="defs" />
    {#each track.tiles as { id, x, y, direction, angle, model, component }}
        <svelte:component this={component} {model} {direction} {angle} {x} {y} {id} />
        <!-- <ControlPoints {model} {direction} {angle} {x} {y} /> -->
    {/each}
</Sketch>
