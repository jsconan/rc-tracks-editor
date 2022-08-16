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

    const tileset = ['straight', 'straight', 'curved'];
</script>

<main>
    {#each tileset as tile}
        <svelte:component
            this={tiles[tile]}
            length={config.trackSectionLength}
            width={config.trackSectionWidth}
            barrierWidth={config.barrierWidth}
            barrierChunks={config.barrierChunks}
            ratio={1}
        />
    {/each}
</main>

<style>
</style>
