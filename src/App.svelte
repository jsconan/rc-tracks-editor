<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import config from './config.js';
    import StraightTile from './tiles/StraightTile.svelte';
    import CurvedTile from './tiles/CurvedTile.svelte';

    const tiles = {
        straight: StraightTile,
        curved: CurvedTile
    };

    const tileset = ['straight', 'curved'];

    const barrierChunks = config.barrierChunks;
    const barrierWidth = config.barrierWidth;
    const tileLength = config.trackSectionLength;
    const tileWidth = config.trackSectionWidth;
    const tileRatio = 1;
</script>

<svg>
    {#each tileset as tile, i}
        <svelte:component
            this={tiles[tile]}
            {barrierChunks}
            {barrierWidth}
            {tileLength}
            {tileWidth}
            {tileRatio}
            tileX={i * tileLength * tileRatio}
            tileY={0}
        />
    {/each}
</svg>

<style>
    svg {
        width: 100%;
        height: 100%;
    }
    :global(html, body, #app) {
        position: relative;
        padding: 0;
        margin: 0;
        height: 100%;
        overflow: hidden;
    }
</style>
