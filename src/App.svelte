<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import Outline from './filters/Outline.svelte';

    import config from './config.js';
    import Tileset from './tiles/Tileset.svelte';
    import TileModel from './models/tile-model.js';
    import StraightTileModel from './models/straight-tile-model.js';
    import CurvedTileModel from './models/curved-tile-model.js';
    import CurvedTileEnlargedModel from './models/curved-tile-enlarged-model.js';
    import TrackModel from './models/track-model.js';

    const barrierChunks = config.barrierChunks;
    const barrierWidth = config.barrierWidth;
    const laneWidth = config.laneWidth;

    const track = new TrackModel(laneWidth, barrierWidth, barrierChunks);

    track.addTile(StraightTileModel.TYPE, TileModel.DIRECTION_RIGHT);
    track.addTile(StraightTileModel.TYPE, TileModel.DIRECTION_RIGHT);
    track.addTile(StraightTileModel.TYPE, TileModel.DIRECTION_RIGHT);
    track.addTile(CurvedTileEnlargedModel.TYPE, TileModel.DIRECTION_LEFT);
    track.addTile(CurvedTileEnlargedModel.TYPE, TileModel.DIRECTION_LEFT);
    track.addTile(CurvedTileModel.TYPE, TileModel.DIRECTION_RIGHT);
    track.addTile(CurvedTileModel.TYPE, TileModel.DIRECTION_RIGHT);
    track.addTile(CurvedTileEnlargedModel.TYPE, TileModel.DIRECTION_LEFT);
    track.addTile(CurvedTileEnlargedModel.TYPE, TileModel.DIRECTION_LEFT);
    track.addTile(CurvedTileModel.TYPE, TileModel.DIRECTION_LEFT, 2);
    track.addTile(CurvedTileModel.TYPE, TileModel.DIRECTION_LEFT, 2);
    track.addTile(CurvedTileModel.TYPE, TileModel.DIRECTION_RIGHT);
    track.addTile(CurvedTileModel.TYPE, TileModel.DIRECTION_RIGHT);
    track.addTile(CurvedTileModel.TYPE, TileModel.DIRECTION_RIGHT, 3);
    track.addTile(CurvedTileModel.TYPE, TileModel.DIRECTION_RIGHT, 3);
    track.addTile(CurvedTileModel.TYPE, TileModel.DIRECTION_RIGHT, 3);
    track.addTile(CurvedTileEnlargedModel.TYPE, TileModel.DIRECTION_LEFT);
    track.addTile(CurvedTileEnlargedModel.TYPE, TileModel.DIRECTION_LEFT);
    track.addTile(CurvedTileModel.TYPE, TileModel.DIRECTION_LEFT, 4);
    track.addTile(CurvedTileModel.TYPE, TileModel.DIRECTION_LEFT, 4);
    track.addTile(CurvedTileModel.TYPE, TileModel.DIRECTION_LEFT, 4);
    track.addTile(CurvedTileModel.TYPE, TileModel.DIRECTION_LEFT, 4);
    track.addTile(StraightTileModel.TYPE, TileModel.DIRECTION_LEFT);
    track.addTile(CurvedTileEnlargedModel.TYPE, TileModel.DIRECTION_LEFT);

    const tileset = track.build(0, 0, -90);
</script>

<Tileset x={tileset.x} y={tileset.y} viewWidth={tileset.width} viewHeight={tileset.height} width="100%" height="100%">
    <Outline R={0.2} G={0.9} B={0.4} A={0.9} width={6} slot="defs" />
    {#each tileset.tiles as { id, x, y, direction, rotation, ratio, component }}
        <svelte:component
            this={component}
            {barrierChunks}
            {barrierWidth}
            {laneWidth}
            {ratio}
            {direction}
            {rotation}
            {x}
            {y}
            {id}
        />
    {/each}
</Tileset>
