<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import config from './config.js';
    import StraightTile from './tiles/StraightTile.svelte';
    import CurvedTile from './tiles/CurvedTile.svelte';
    import CurvedTileEnlarged from './tiles/CurvedTileEnlarged.svelte';
    import Tileset from './tiles/Tileset.svelte';

    const tileset = [
        {
            tile: StraightTile,
            ratio: 1,
            angle: 0
        },
        {
            tile: CurvedTileEnlarged,
            ratio: 1,
            angle: 0
        },
        {
            tile: CurvedTile,
            ratio: 1,
            angle: 0
        },
        {
            tile: CurvedTile,
            ratio: 2,
            angle: 0
        },
        {
            tile: CurvedTile,
            ratio: 3,
            angle: 0
        },
        {
            tile: CurvedTile,
            ratio: 4,
            angle: 0
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
            const { tile, ratio, angle } = item;
            yield { tile, tileRatio: ratio, tileAngle: angle, tileX, tileY };
            tileX += tileLength;
        }
    }
</script>

<Tileset>
    {#each [...tiles()] as { tile, tileRatio, tileAngle, tileX, tileY }}
        <svelte:component
            this={tile}
            {barrierChunks}
            {barrierWidth}
            {tileLength}
            {tileWidth}
            {tileRatio}
            {tileAngle}
            {tileX}
            {tileY}
        />
    {/each}
</Tileset>
