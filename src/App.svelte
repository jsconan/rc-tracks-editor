<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import Outline from './filters/Outline.svelte';

    import config from './config.js';
    import StraightTile from './tiles/StraightTile.svelte';
    import CurvedTile from './tiles/CurvedTile.svelte';
    import CurvedTileEnlarged from './tiles/CurvedTileEnlarged.svelte';
    import Tileset from './tiles/Tileset.svelte';

    const tileset = [
        {
            tile: StraightTile,
            ratio: 1,
            angle: 0,
            selected: false
        },
        {
            tile: CurvedTileEnlarged,
            ratio: 1,
            angle: 0,
            selected: false
        },
        {
            tile: CurvedTile,
            ratio: 1,
            angle: 0,
            selected: false
        },
        {
            tile: CurvedTile,
            ratio: 2,
            angle: 0,
            selected: false
        },
        {
            tile: CurvedTile,
            ratio: 3,
            angle: 0,
            selected: false
        },
        {
            tile: CurvedTile,
            ratio: 4,
            angle: 0,
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
            const { tile, ratio, angle, selected } = item;
            const filter = selected ? 'url(#outline)' : void 0;
            yield { tile, tileRatio: ratio, tileAngle: angle, tileX, tileY, filter };
            tileX += tileLength;
        }
    }
</script>

<Tileset x={0} y={-50} viewWidth={1000} viewHeight={300} width="100%" height="100%">
    <Outline R={0.1} G={1} B={0.1} A={0.9} slot="defs" />
    {#each [...tiles()] as { tile, tileRatio, tileAngle, tileX, tileY, filter }}
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
            {filter}
        />
        <g style="opacity: .5">
            {#if tileRatio == 1}
                <svelte:component
                    this={tile}
                    {barrierChunks}
                    {barrierWidth}
                    {tileLength}
                    {tileWidth}
                    {tileRatio}
                    tileAngle={tileAngle + 90}
                    {tileX}
                    {tileY}
                    {filter}
                />
            {/if}
            {#if tileRatio > 1}
                <svelte:component
                    this={tile}
                    {barrierChunks}
                    {barrierWidth}
                    {tileLength}
                    {tileWidth}
                    {tileRatio}
                    tileAngle={tileAngle + 90 + (90 / tileRatio) * (tileRatio - 1)}
                    {tileX}
                    {tileY}
                    {filter}
                />
            {/if}
        </g>
    {/each}
</Tileset>
