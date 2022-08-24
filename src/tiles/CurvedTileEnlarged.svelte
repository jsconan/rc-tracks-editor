<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import CurvedBarrier from '../elements/CurvedBarrier.svelte';
    import StraightBarrier from '../elements/StraightBarrier.svelte';
    import { Tile } from '../models/tile.js';

    export let barrierChunks;
    export let barrierWidth;
    export let tileLength;
    export let tileWidth;
    export let tileRatio = 1;
    export let direction = Tile.DIRECTION_RIGHT;
    export let rotation = 0;
    export let tileX = 0;
    export let tileY = 0;
    export let filter;

    const tile = new Tile(tileLength, tileWidth, tileRatio, Tile.TYPE_ENLARGED_CURVE, direction);
    const barrierLength = tileLength / barrierChunks;
    const padding = tile.getPadding();
    const side = tile.getCurveSide();
    const innerRadius = tile.getInnerRadius();
    const outerRadius = tile.getOuterRadius();
    const sideChunks = tile.getSideBarrierChunks(barrierChunks);
    const innerChunks = tile.getInnerBarrierChunks(barrierChunks);
    const outerChunks = tile.getOuterBarrierChunks(barrierChunks);
    const tileAngle = tile.getDirectionAngle();
    const curveAngle = tile.getCurveAngle();
    const center = tile.getCenterCoord(tileX, tileY);

    const x = tileX - tileLength / 2 + padding;
    const y = tileY;

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

    const input = tile.getInputCoord(tileX, tileY);
    const output = tile.getOutputCoord(tileX, tileY, rotation);
    const centerR = tile.getCenterCoord(tileX, tileY, rotation);
</script>

<g
    class="tile curved-tile-enlarged"
    transform="rotate({rotation} {tileX} {tileY}) rotate({tileAngle} {center.x} {center.y})"
    {filter}
>
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

<circle class="control" cx={centerR.x} cy={centerR.y} r="4" />
<circle class="control" cx={input.x} cy={input.y} r="4" />
<circle class="control" cx={output.x} cy={output.y} r="4" />
