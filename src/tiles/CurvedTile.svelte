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

    const width = tileLength * tileRatio;
    const innerRadius = getCurveInnerRadius(tileLength, tileWidth, tileRatio);
    const outerRadius = getCurveOuterRadius(tileLength, tileWidth, tileRatio);
    const innerChunks = getCurveInnerBarrierChunks(barrierChunks, tileRatio);
    const outerChunks = getCurveOuterBarrierChunks(barrierChunks, tileRatio);
    const curveAngle = getCurveAngle(tileRatio);

    const x = tileX;
    const y = tileY;
    const cx = x + width / 2;
    const cy = y + width / 2;

    const innerStartX = x + innerRadius;
    const innerStartY = y;
    const innerEndX = x + cos(curveAngle) * innerRadius;
    const innerEndY = y + sin(curveAngle) * innerRadius;
    const outerStartX = x + cos(curveAngle) * outerRadius;
    const outerStartY = y + sin(curveAngle) * outerRadius;
    const outerEndX = x + outerRadius;
    const outerEndY = y;
</script>

<g class="tile curved-tile" transform="rotate({tileAngle} {cx} {cy})">
    <path
        class="ground"
        d="M {innerStartX} {innerStartY}
           A {innerRadius} {innerRadius} 0 0 1 {innerEndX} {innerEndY}
           L {outerStartX} {outerStartY}
           A {outerRadius} {outerRadius} 0 0 0 {outerEndX} {outerEndY}"
    />
    <CurvedBarrier
        barrierChunks={outerChunks}
        {barrierWidth}
        curveRadius={outerRadius}
        {curveAngle}
        {x}
        {y}
        shift={0}
        inner={false}
    />
    <CurvedBarrier
        barrierChunks={innerChunks}
        {barrierWidth}
        curveRadius={innerRadius}
        {curveAngle}
        {x}
        {y}
        shift={1}
        inner={true}
    />
</g>
