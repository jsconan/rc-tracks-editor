<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import {
        getCurveInnerBarrierChunks,
        getCurveInnerRadius,
        getCurveOuterBarrierChunks,
        getCurveOuterRadius
    } from '../helpers/track.js';
    import { RIGHT_ANGLE, cos, sin } from '../helpers/maths.js';

    export let length;
    export let width;
    export let barrierChunks;
    export let barrierWidth;
    export let ratio = 1;

    const tileLength = length * ratio;
    const tileWidth = width;
    const tilePadding = (length - width) / 2;
    const halfBarrier = barrierWidth / 2;
    const innerRadius = getCurveInnerRadius(length, width, ratio);
    const outerRadius = getCurveOuterRadius(length, width, ratio);
    const curveAngle = RIGHT_ANGLE;
    const colors = ['even', 'odd'];

    const viewportWidth = tileLength;
    const viewportHeight = tileLength;
    const viewportX = 0;
    const viewportY = 0;

    const x = 0;
    const y = tilePadding;

    const outerX = tileLength - tilePadding;
    const outerY = tileLength - tilePadding;
    const innerX = -innerRadius;
    const innerY = -innerRadius;

    function chunkPosition(i, j, radius, angle) {
        const a1 = 270 + angle * i;
        const a2 = a1 + angle;
        const x1 = cos(a1) * radius;
        const y1 = sin(a1) * radius + tileLength;
        const x2 = cos(a2) * radius;
        const y2 = sin(a2) * radius + tileLength;
        const color = colors[(i + j) % 2];

        return { color, radius, angle, x1, y1, x2, y2 };
    }

    function* innerChunks() {
        const lineChunks = getCurveInnerBarrierChunks(barrierChunks, ratio);
        const radius = innerRadius + halfBarrier;
        const angle = curveAngle / lineChunks;

        for (let nextIndex = 0; nextIndex < lineChunks; nextIndex++) {
            yield chunkPosition(nextIndex, 1, radius, angle);
        }
    }
    function* outerChunks() {
        const lineChunks = getCurveOuterBarrierChunks(barrierChunks, ratio);
        const radius = outerRadius - halfBarrier;
        const angle = curveAngle / lineChunks;

        for (let nextIndex = 0; nextIndex < lineChunks; nextIndex++) {
            yield chunkPosition(nextIndex, 0, radius, angle);
        }
    }
</script>

<svg viewBox="{viewportX} {viewportY} {viewportWidth} {viewportHeight}" width={viewportWidth} height={viewportHeight}>
    <g class="tile curved-tile">
        <path
            class="ground"
            d="M {x} {y}
               a {outerRadius} {outerRadius} 0 0 1 {outerX} {outerY}
               h {-tileWidth}
               a {innerRadius} {innerRadius} 0 0 0 {innerX} {innerY}"
        />
    </g>
    {#each [...outerChunks()] as { color, radius, x1, y1, x2, y2 }}
        <path class="barrier {color}" stroke-width={barrierWidth} d="M {x1} {y1} A {radius} {radius} 0 0 1 {x2} {y2}" />
    {/each}
    {#each [...innerChunks()] as { color, radius, x1, y1, x2, y2 }}
        <path class="barrier {color}" stroke-width={barrierWidth} d="M {x1} {y1} A {radius} {radius} 0 0 1 {x2} {y2}" />
    {/each}
</svg>

<style>
    .ground {
        fill: #444;
    }
    .barrier {
        fill: none;
    }
    .even {
        stroke: #eec;
    }
    .odd {
        stroke: #c24;
    }
</style>
