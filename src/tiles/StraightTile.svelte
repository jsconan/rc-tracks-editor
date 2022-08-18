<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import StraightBarrier from './StraightBarrier.svelte';

    export let barrierChunks;
    export let barrierWidth;
    export let tileLength;
    export let tileWidth;
    export let tileRatio = 1;
    export let tileAngle = 0;
    export let tileX = 0;
    export let tileY = 0;

    const width = tileLength * tileRatio;
    const height = tileWidth;
    const barrierLength = tileLength / barrierChunks;
    const tilePadding = (tileLength - tileWidth) / 2;
    const allChunks = barrierChunks * tileRatio;

    const x = tileX;
    const y = tileY + tilePadding;
    const y1 = y;
    const y2 = y + tileWidth - barrierWidth;
    const cx = x + width / 2;
    const cy = y + height / 2;
</script>

<g class="tile straight-tile" transform="rotate({tileAngle} {cx} {cy})">
    <rect class="ground" {x} {y} {width} {height} />
    <StraightBarrier barrierChunks={allChunks} {barrierWidth} {barrierLength} {x} y={y1} shift={0} />
    <StraightBarrier barrierChunks={allChunks} {barrierWidth} {barrierLength} {x} y={y2} shift={1} />
</g>
