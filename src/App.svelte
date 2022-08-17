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
</script>

<main>
    {#each tileset as tile}
        <svelte:component
            this={tiles[tile]}
            barrierChunks={config.barrierChunks}
            barrierWidth={config.barrierWidth}
            tileLength={config.trackSectionLength}
            tileWidth={config.trackSectionWidth}
            tileRatio={1}
            tileX={0}
            tileY={0}
        />
    {/each}
</main>

<style>
</style>
