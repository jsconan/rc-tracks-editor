<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getStraightBarrierChunks } from '../helpers/track.js';
    import StraightBarrier from './StraightBarrier.svelte';
    import StraightElement from './StraightElement.svelte';

    export let barrierChunks;
    export let barrierWidth;
    export let tileLength;
    export let tileWidth;
    export let tileRatio = 1;
    export let tileAngle = 0;
    export let tileX = 0;
    export let tileY = 0;

    const width = tileWidth;
    const height = tileLength * tileRatio;
    const barrierLength = tileLength / barrierChunks;
    const tilePadding = (tileLength - tileWidth) / 2;
    const laneWidth = tileWidth - barrierWidth;
    const sideChunks = getStraightBarrierChunks(barrierChunks, tileRatio);

    const x = tileX + tilePadding;
    const y = tileY;
    const x1 = x;
    const y1 = y;
    const x2 = x + laneWidth;
    const y2 = y;
    const cx = x + width / 2;
    const cy = y + height / 2;
    const vertical = true;
</script>

<g class="tile straight-tile" transform="rotate({tileAngle} {cx} {cy})">
    <StraightElement class="ground" {x} {y} {width} {height} />
    <StraightBarrier
        chunks={sideChunks}
        width={barrierWidth}
        length={barrierLength}
        left={x1}
        top={y1}
        shift={0}
        {vertical}
    />
    <StraightBarrier
        chunks={sideChunks}
        width={barrierWidth}
        length={barrierLength}
        left={x2}
        top={y2}
        shift={1}
        {vertical}
    />
</g>
