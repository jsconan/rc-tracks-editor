<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import Outline from './filters/Outline.svelte';

    import config from './config.js';
    import ControlPoints from './components/ControlPoints.svelte';
    import Tileset from './components/Tileset.svelte';
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

    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

    track.addTile(STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT);
    track.addTile(STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT);
    track.addTile(STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT);
    track.addTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    track.addTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    track.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    track.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    track.addTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    track.addTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    track.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);
    track.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);
    track.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    track.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    track.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, 3);
    track.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, 3);
    track.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, 3);
    track.addTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    track.addTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    track.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    track.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    track.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    track.addTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    track.addTile(STRAIGHT_TILE_TYPE, TILE_DIRECTION_LEFT);
    track.addTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);

    // track.import(data.square);

    const tileset = track.build(0, 0, -90);
    console.log(JSON.stringify(track.export()));
</script>

<Tileset x={tileset.x} y={tileset.y} viewWidth={tileset.width} viewHeight={tileset.height} width="100%" height="100%">
    <Outline R={0.2} G={0.9} B={0.4} A={0.9} width={6} slot="defs" />
    {#each tileset.tiles as { id, x, y, direction, angle, ratio, model, component }}
        <svelte:component this={component} {model} {direction} {angle} {x} {y} {id} />
        <!-- <ControlPoints {model} {direction} {angle} {x} {y} /> -->
    {/each}
</Tileset>
