<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import config from './config.js';
    import StraightTile from './tiles/StraightTile.svelte';

    const tiles = {
        straight: StraightTile
    };

    const tileset = ['straight', 'straight'];
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
