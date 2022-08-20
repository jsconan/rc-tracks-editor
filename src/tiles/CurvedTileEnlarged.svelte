<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import {
        getCurveAngle,
        getEnlargedCurveInnerBarrierChunks,
        getEnlargedCurveInnerRadius,
        getEnlargedCurveOuterBarrierChunks,
        getEnlargedCurveOuterRadius,
        getEnlargedCurveSide,
        getEnlargedCurveSideBarrierChunks
    } from '../helpers/track.js';
    import CurvedBarrier from '../elements/CurvedBarrier.svelte';
    import StraightBarrier from '../elements/StraightBarrier.svelte';

    export let barrierChunks;
    export let barrierWidth;
    export let tileLength;
    export let tileWidth;
    export let tileRatio = 1;
    export let tileAngle = 0;
    export let tileX = 0;
    export let tileY = 0;
    export let filter;

    const barrierLength = tileLength / barrierChunks;
    const tilePadding = (tileLength - tileWidth) / 2;
    const side = getEnlargedCurveSide(tileLength, tileWidth, tileRatio);
    const innerRadius = getEnlargedCurveInnerRadius(tileLength, tileWidth, tileRatio);
    const outerRadius = getEnlargedCurveOuterRadius(tileLength, tileWidth, tileRatio);
    const sideChunks = getEnlargedCurveSideBarrierChunks(barrierChunks, tileRatio);
    const innerChunks = getEnlargedCurveInnerBarrierChunks(barrierChunks, tileRatio);
    const outerChunks = getEnlargedCurveOuterBarrierChunks(barrierChunks, tileRatio);
    const curveAngle = getCurveAngle(1);

    const x = tileX + tilePadding;
    const y = tileY;
    const cx = tileX + tileLength / 2;
    const cy = tileY + tileLength / 2;

    const innerCurveStartX = x;
    const innerCurveStartY = y;
    const innerCurveEndX = innerCurveStartX - innerRadius;
    const innerCurveEndY = innerCurveStartY + innerRadius;
    const leftSideEndX = innerCurveEndX;
    const leftSideEndY = innerCurveEndY + tileWidth;
    const outerCurveStartX = leftSideEndX + side;
    const outerCurveStartY = leftSideEndY;
    const outerCurveEndX = outerCurveStartX + outerRadius;
    const outerCurveEndY = outerCurveStartY - outerRadius;
    const rightSideEndX = outerCurveEndX;
    const rightSideEndY = outerCurveEndY - side;

    const innerBarrierRadius = innerRadius;
    const innerBarrierX = innerCurveStartX;
    const innerBarrierY = innerCurveStartY;
    const outerBarrierRadius = outerRadius - barrierWidth;
    const outerBarrierX = outerCurveEndX - barrierWidth;
    const outerBarrierY = outerCurveEndY;
    const horizontalBarrierX = leftSideEndX;
    const horizontalBarrierY = leftSideEndY - barrierWidth;
    const verticalBarrierX = rightSideEndX - barrierWidth;
    const verticalBarrierY = rightSideEndY;
</script>

<g class="tile curved-tile-enlarged" transform="rotate({tileAngle} {cx} {cy})" {filter}>
    <path
        class="ground"
        d="M {innerCurveStartX} {innerCurveStartY}
           A {innerRadius} {innerRadius} 0 0 1 {innerCurveEndX} {innerCurveEndY}
           L {leftSideEndX} {leftSideEndY}
           L {outerCurveStartX} {outerCurveStartY}
           A {outerRadius} {outerRadius} 0 0 0 {outerCurveEndX} {outerCurveEndY}
           L {rightSideEndX} {rightSideEndY}"
    />
    <CurvedBarrier
        chunks={innerChunks}
        width={barrierWidth}
        radius={innerBarrierRadius}
        angle={curveAngle}
        left={innerBarrierX}
        top={innerBarrierY}
        shift={0}
    />
    <CurvedBarrier
        chunks={outerChunks}
        width={barrierWidth}
        radius={outerBarrierRadius}
        angle={curveAngle}
        left={outerBarrierX}
        top={outerBarrierY}
        shift={1}
    />
    <StraightBarrier
        chunks={sideChunks}
        width={barrierWidth}
        length={barrierLength}
        left={horizontalBarrierX}
        top={horizontalBarrierY}
        shift={0}
        vertical={false}
    />
    <StraightBarrier
        chunks={sideChunks}
        width={barrierWidth}
        length={barrierLength}
        left={verticalBarrierX}
        top={verticalBarrierY}
        shift={1}
        vertical={true}
    />
</g>
