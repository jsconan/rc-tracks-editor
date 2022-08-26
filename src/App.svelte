<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import Outline from './filters/Outline.svelte';

    import config from './config.js';
    import StraightTile from './tiles/StraightTile.svelte';
    import CurvedTile from './tiles/CurvedTile.svelte';
    import CurvedTileEnlarged from './tiles/CurvedTileEnlarged.svelte';
    import Tileset from './tiles/Tileset.svelte';
    import { TileModel } from './models/tile-model.js';

    const tileset = [
        {
            tile: StraightTile,
            ratio: 1,
            direction: TileModel.DIRECTION_RIGHT,
            rotation: 0,
            selected: false
        },
        {
            tile: StraightTile,
            ratio: 2,
            direction: TileModel.DIRECTION_RIGHT,
            rotation: 0,
            selected: false
        },
        {
            tile: StraightTile,
            ratio: 3,
            direction: TileModel.DIRECTION_RIGHT,
            rotation: 0,
            selected: false
        },
        {
            tile: CurvedTileEnlarged,
            ratio: 1,
            direction: TileModel.DIRECTION_RIGHT,
            rotation: 0,
            selected: false
        },
        {
            tile: CurvedTile,
            ratio: 1,
            direction: TileModel.DIRECTION_RIGHT,
            rotation: 0,
            selected: false
        },
        {
            tile: CurvedTile,
            ratio: 2,
            direction: TileModel.DIRECTION_RIGHT,
            rotation: 0,
            selected: false
        },
        {
            tile: CurvedTile,
            ratio: 3,
            direction: TileModel.DIRECTION_RIGHT,
            rotation: 0,
            selected: false
        },
        {
            tile: CurvedTile,
            ratio: 4,
            direction: TileModel.DIRECTION_RIGHT,
            rotation: 0,
            selected: false
        }
    ];

    const barrierChunks = config.barrierChunks;
    const barrierWidth = config.barrierWidth;
    const laneWidth = config.trackLaneWidth;

    function* tiles() {
        let x = 0;
        let y = 0;

        for (const item of tileset) {
            const { tile, ratio, direction, rotation, selected } = item;
            const filter = selected ? 'url(#outline)' : void 0;
            yield { tile, ratio, direction, rotation, x, y, filter };
            x += config.trackSectionLength;
        }
    }
</script>

<Tileset x={-300} y={-300} viewWidth={window.innerWidth} viewHeight={window.innerHeight} width="100%" height="100%">
    <Outline R={0.1} G={1} B={0.1} A={0.9} slot="defs" />
    {#each [...tiles()] as { tile, ratio, direction, rotation, x, y, filter }}
        <svelte:component
            this={tile}
            {barrierChunks}
            {barrierWidth}
            {laneWidth}
            {ratio}
            {direction}
            {rotation}
            {x}
            {y}
            {filter}
        />
    {/each}
</Tileset>
