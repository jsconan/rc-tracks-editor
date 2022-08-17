<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getStraightBarrierChunks } from '../helpers/track.js';

    export let barrierChunks;
    export let barrierWidth;
    export let tileLength;
    export let tileWidth;
    export let tileRatio = 1;
    export let tileX = 0;
    export let tileY = 0;

    const width = tileLength * tileRatio;
    const height = tileWidth;
    const tilePadding = (tileLength - tileWidth) / 2;
    const laneWidth = tileWidth - barrierWidth;
    const halfBarrier = barrierWidth / 2;
    const colors = ['even', 'odd'];

    const viewportWidth = width;
    const viewportHeight = width;
    const viewportX = 0;
    const viewportY = 0;

    const x = viewportX + tileX;
    const y = viewportY + tileY + tilePadding;

    function* chunks() {
        const barrierLength = tileLength / barrierChunks;
        const lineChunks = getStraightBarrierChunks(barrierChunks, tileRatio);
        const allChunks = lineChunks * 2;

        for (let nextIndex = 0; nextIndex < allChunks; nextIndex++) {
            const i = nextIndex % lineChunks;
            const j = Math.floor(nextIndex / lineChunks);

            const color = colors[(i + j) % 2];
            const x1 = x + i * barrierLength;
            const y1 = y + halfBarrier + j * laneWidth;
            const x2 = x1 + barrierLength;
            const y2 = y1;

            yield { color, x1, y1, x2, y2 };
        }
    }
</script>

<svg viewBox="{viewportX} {viewportY} {viewportWidth} {viewportHeight}" width={viewportWidth} height={viewportHeight}>
    <g class="tile straight-tile">
        <rect class="ground" {x} {y} {width} {height} />
        {#each [...chunks()] as { color, x1, y1, x2, y2 }}
            <line class="barrier {color}" {x1} {y1} {x2} {y2} stroke-width={barrierWidth} />
        {/each}
    </g>
</svg>

<style>
    .ground {
        fill: #444;
    }
    .even {
        stroke: #eec;
    }
    .odd {
        stroke: #c24;
    }
</style>
