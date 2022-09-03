<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import config from './config.js';
    import Sketch from './elements/Sketch.svelte';
    import Track from './components/Track.svelte';
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

    const angle = -90;
    const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks);
    const model = new TrackModel(specs);

    model.appendTile(STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT);
    model.appendTile(STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT);
    model.appendTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    model.appendTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    model.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    model.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    model.appendTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    model.appendTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    model.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);
    model.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);
    model.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    model.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT);
    model.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, 3);
    model.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, 3);
    model.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_RIGHT, 3);
    model.appendTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    model.appendTile(CURVED_TILE_ENLARGED_TYPE, TILE_DIRECTION_LEFT);
    model.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    model.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    model.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    model.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 4);
    model.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);
    model.appendTile(CURVED_TILE_TYPE, TILE_DIRECTION_LEFT, 2);

    console.log(JSON.stringify(model.export()));
    // model.import(data.square)
</script>

<Sketch width="100%" height="100%">
    <Track {model} {angle} />
</Sketch>
