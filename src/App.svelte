<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import OutlineFilter from './filters/OutlineFilter.svelte';

    import config from './config.js';
    import ControlPoints from './components/ControlPoints.svelte';
    import Sketch from './elements/Sketch.svelte';
    import { TileSpecifications } from './models/TileSpecifications.js';
    import { TrackModel } from './models/TrackModel.js';
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

    const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);

    const trackModel = new TrackModel(specs);

    trackModel.appendTile(STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT);
    trackModel.appendTile(STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT);
    trackModel.appendTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    trackModel.appendTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    trackModel.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    trackModel.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    trackModel.appendTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    trackModel.appendTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    trackModel.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);
    trackModel.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);
    trackModel.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    trackModel.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    trackModel.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, 3);
    trackModel.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, 3);
    trackModel.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, 3);
    trackModel.appendTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    trackModel.appendTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    trackModel.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    trackModel.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    trackModel.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    trackModel.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    trackModel.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);
    trackModel.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

    // trackModel.import(data.square);

    const track = trackModel.build(0, 0, -90);
    console.log(JSON.stringify(trackModel.export()));
</script>

<Sketch x={track.x} y={track.y} viewWidth={track.width} viewHeight={track.height} width="100%" height="100%">
    <OutlineFilter R={0.2} G={0.9} B={0.4} A={0.9} width={6} slot="defs" />
    {#each track.tiles as { id, x, y, angle, model, component }}
        <svelte:component this={component} {model} {angle} {x} {y} {id} />
        <!-- <ControlPoints {model} {angle} {x} {y} /> -->
    {/each}
</Sketch>
