<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import Outline from './filters/Outline.svelte';

    import config from './config.js';
    import StraightTile from './tiles/StraightTile.svelte';
    import CurvedTile from './tiles/CurvedTile.svelte';
    import CurvedTileEnlarged from './tiles/CurvedTileEnlarged.svelte';
    import Tileset from './tiles/Tileset.svelte';
    import { Tile } from './models/tile';

    const tileset = [
        {
            tile: StraightTile,
            ratio: 1,
            direction: Tile.DIRECTION_RIGHT,
            rotation: 0,
            selected: false
        },
        {
            tile: CurvedTileEnlarged,
            ratio: 1,
            direction: Tile.DIRECTION_RIGHT,
            rotation: 0,
            selected: false
        },
        {
            tile: CurvedTile,
            ratio: 1,
            direction: Tile.DIRECTION_RIGHT,
            rotation: 0,
            selected: false
        },
        {
            tile: CurvedTile,
            ratio: 2,
            direction: Tile.DIRECTION_RIGHT,
            rotation: 0,
            selected: false
        },
        {
            tile: CurvedTile,
            ratio: 3,
            direction: Tile.DIRECTION_RIGHT,
            rotation: 0,
            selected: false
        },
        {
            tile: CurvedTile,
            ratio: 4,
            direction: Tile.DIRECTION_RIGHT,
            rotation: 0,
            selected: false
        }
    ];

    const barrierChunks = config.barrierChunks;
    const barrierWidth = config.barrierWidth;
    const tileLength = config.trackSectionLength;
    const tileWidth = config.trackSectionWidth;

    function* tiles() {
        let tileX = 0;
        let tileY = 0;

        for (const item of tileset) {
            const { tile, ratio, direction, rotation, selected } = item;
            const filter = selected ? 'url(#outline)' : void 0;
            yield { tile, tileRatio: ratio, direction, rotation, tileX, tileY, filter };
            tileX += tileLength;
        }
    }
</script>

<Tileset x={-300} y={-300} viewWidth={window.innerWidth} viewHeight={window.innerHeight} width="100%" height="100%">
    <Outline R={0.1} G={1} B={0.1} A={0.9} slot="defs" />
    {#each [...tiles()] as { tile, tileRatio, direction, rotation, tileX, tileY, filter }}
        <svelte:component
            this={tile}
            {barrierChunks}
            {barrierWidth}
            {tileLength}
            {tileWidth}
            {tileRatio}
            {direction}
            {rotation}
            {tileX}
            {tileY}
            {filter}
        />
        <!-- <g style="opacity: .5">
            <svelte:component
                this={tile}
                {barrierChunks}
                {barrierWidth}
                {tileLength}
                {tileWidth}
                {tileRatio}
                direction={direction == Tile.DIRECTION_RIGHT ? Tile.DIRECTION_LEFT : Tile.DIRECTION_RIGHT}
                {rotation}
                {tileX}
                {tileY}
                {filter}
            />
        </g> -->
    {/each}
</Tileset>
