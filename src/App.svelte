<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import config from './config.js';
    import StraightTile from './tiles/StraightTile.svelte';
    import CurvedTile from './tiles/CurvedTile.svelte';
    import Tileset from './tiles/Tileset.svelte';

    const tileset = [
        {
            tile: StraightTile,
            ratio: 1,
            angle: 0
        },
        {
            tile: StraightTile,
            ratio: 1,
            angle: 90
        },
        {
            tile: CurvedTile,
            ratio: 1,
            angle: 0
        },
        {
            tile: CurvedTile,
            ratio: 1,
            angle: 90
        },
        {
            tile: CurvedTile,
            ratio: 1,
            angle: 180
        },
        {
            tile: CurvedTile,
            ratio: 1,
            angle: 270
        },
        {
            tile: CurvedTile,
            ratio: 2,
            angle: 0
        },
        {
            tile: CurvedTile,
            ratio: 2,
            angle: 45
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
            tileX += tileLength * ratio;
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
