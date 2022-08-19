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
    import { cos, sin } from '../helpers/maths.js';
    import CurvedBarrier from './CurvedBarrier.svelte';

    export let barrierChunks;
    export let barrierWidth;
    export let tileLength;
    export let tileWidth;
    export let tileRatio = 1;
    export let tileAngle = 0;
    export let tileX = 0;
    export let tileY = 0;

    const tilePadding = (tileLength - tileWidth) / 2;
    const innerRadius = getCurveInnerRadius(tileLength, tileWidth, tileRatio);
    const outerRadius = getCurveOuterRadius(tileLength, tileWidth, tileRatio);
    const innerChunks = getCurveInnerBarrierChunks(barrierChunks, tileRatio);
    const outerChunks = getCurveOuterBarrierChunks(barrierChunks, tileRatio);
    const curveAngle = getCurveAngle(tileRatio);

    const x = tileX + tilePadding;
    const y = tileY;
    const cx = tileX + tileLength / 2;
    const cy = tileY + tileLength / 2;

    const curveX = x - innerRadius;
    const curveY = y;
    const innerCurveStartX = x;
    const innerCurveStartY = y;
    const innerCurveEndX = curveX + cos(curveAngle) * innerRadius;
    const innerCurveEndY = curveY + sin(curveAngle) * innerRadius;
    const outerCurveStartX = curveX + cos(curveAngle) * outerRadius;
    const outerCurveStartY = curveY + sin(curveAngle) * outerRadius;
    const outerCurveEndX = x + tileWidth;
    const outerCurveEndY = y;

    const innerBarrierRadius = innerRadius;
    const innerBarrierX = innerCurveStartX;
    const innerBarrierY = innerCurveStartY;
    const outerBarrierRadius = outerRadius - barrierWidth;
    const outerBarrierX = outerCurveEndX - barrierWidth;
    const outerBarrierY = outerCurveEndY;
</script>

<g class="tile curved-tile" transform="rotate({tileAngle} {cx} {cy})">
    <path
        class="ground"
        d="M {innerCurveStartX} {innerCurveStartY}
           A {innerRadius} {innerRadius} 0 0 1 {innerCurveEndX} {innerCurveEndY}
           L {outerCurveStartX} {outerCurveStartY}
           A {outerRadius} {outerRadius} 0 0 0 {outerCurveEndX} {outerCurveEndY}"
    />
    <CurvedBarrier
        chunks={outerChunks}
        width={barrierWidth}
        radius={outerBarrierRadius}
        angle={curveAngle}
        x={outerBarrierX}
        y={outerBarrierY}
        shift={0}
    />
    <CurvedBarrier
        chunks={innerChunks}
        width={barrierWidth}
        radius={innerBarrierRadius}
        angle={curveAngle}
        x={innerBarrierX}
        y={innerBarrierY}
        shift={1}
    />
</g>
