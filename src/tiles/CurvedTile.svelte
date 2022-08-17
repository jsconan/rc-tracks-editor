<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import {
        getCurveAngle,
        getCurveInnerBarrierChunks,
        getCurveInnerRadius,
        getCurveOuterBarrierChunks,
        getCurveOuterRadius
    } from '../helpers/track.js';
    import { RIGHT_ANGLE, cos, sin } from '../helpers/maths.js';

    export let barrierChunks;
    export let barrierWidth;
    export let tileLength;
    export let tileWidth;
    export let tileRatio = 1;
    export let tileX = 0;
    export let tileY = 0;

    const tilePadding = (tileLength - tileWidth) / 2;
    const halfBarrier = barrierWidth / 2;
    const innerRadius = getCurveInnerRadius(tileLength, tileWidth, tileRatio);
    const outerRadius = getCurveOuterRadius(tileLength, tileWidth, tileRatio);
    const curveAngle = getCurveAngle(tileRatio);
    const startAngle = RIGHT_ANGLE - curveAngle;
    const colors = ['even', 'odd'];

    const outerStartX = tileX;
    const outerStartY = tileY + tilePadding;
    const bottomLine = outerStartY + outerRadius;
    const outerEndX = outerStartX + cos(startAngle) * outerRadius;
    const outerEndY = bottomLine - sin(startAngle) * outerRadius;
    const innerStartX = outerStartX + cos(startAngle) * innerRadius;
    const innerStartY = bottomLine - sin(startAngle) * innerRadius;
    const innerEndX = outerStartX;
    const innerEndY = bottomLine - innerRadius;

    function chunkPosition(i, j, radius, angle) {
        const a1 = startAngle + angle * i;
        const a2 = a1 + angle;
        const x1 = outerStartX + cos(a1) * radius;
        const y1 = bottomLine - sin(a1) * radius;
        const x2 = outerStartX + cos(a2) * radius;
        const y2 = bottomLine - sin(a2) * radius;
        const color = colors[(i + j) % 2];

        return { color, radius, angle, x1, y1, x2, y2 };
    }

    function* innerChunks() {
        const lineChunks = getCurveInnerBarrierChunks(barrierChunks, tileRatio);
        const radius = innerRadius + halfBarrier;
        const angle = curveAngle / lineChunks;

        for (let nextIndex = 0; nextIndex < lineChunks; nextIndex++) {
            yield chunkPosition(nextIndex, 0, radius, angle);
        }
    }
    function* outerChunks() {
        const lineChunks = getCurveOuterBarrierChunks(barrierChunks, tileRatio);
        const radius = outerRadius - halfBarrier;
        const angle = curveAngle / lineChunks;

        for (let nextIndex = 0; nextIndex < lineChunks; nextIndex++) {
            yield chunkPosition(nextIndex, 1, radius, angle);
        }
    }
</script>

<g class="tile curved-tile">
    <path
        class="ground"
        d="M {outerStartX} {outerStartY}
               A {outerRadius} {outerRadius} 0 0 1 {outerEndX} {outerEndY}
               L {innerStartX} {innerStartY}
               A {innerRadius} {innerRadius} 0 0 0 {innerEndX} {innerEndY}"
    />
    {#each [...outerChunks()] as { color, radius, x1, y1, x2, y2 }}
        <path class="barrier {color}" stroke-width={barrierWidth} d="M {x1} {y1} A {radius} {radius} 0 0 0 {x2} {y2}" />
    {/each}
    {#each [...innerChunks()] as { color, radius, x1, y1, x2, y2 }}
        <path class="barrier {color}" stroke-width={barrierWidth} d="M {x1} {y1} A {radius} {radius} 0 0 0 {x2} {y2}" />
    {/each}
</g>

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
