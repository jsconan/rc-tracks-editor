<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import CurvedBarrier from '../elements/CurvedBarrier.svelte';
    import StraightBarrier from '../elements/StraightBarrier.svelte';
    import CurvedTileEnlargedModel from '../models/CurvedTileEnlargedModel.js';

    export let barrierChunks;
    export let barrierWidth;
    export let laneWidth;
    export let ratio = 1;
    export let direction = CurvedTileEnlargedModel.DIRECTION_RIGHT;
    export let rotation = 0;
    export let x = 0;
    export let y = 0;
    export let filter;
    export let id = void 0;

    const tile = new CurvedTileEnlargedModel(laneWidth, barrierWidth, barrierChunks, ratio);
    const barrierLength = tile.length / barrierChunks;
    const side = tile.getCurveSide();
    const innerRadius = tile.getInnerRadius();
    const outerRadius = tile.getOuterRadius();
    const sideChunks = tile.getSideBarrierChunks();
    const innerChunks = tile.getInnerBarrierChunks();
    const outerChunks = tile.getOuterBarrierChunks();
    const tileAngle = tile.getDirectionAngle(direction);
    const curveAngle = tile.getCurveAngle();
    const curveCenter = tile.getCurveCenter(x, y);
    const center = tile.getCenterCoord(x, y);

    const innerCurveStartX = curveCenter.x + innerRadius;
    const innerCurveStartY = curveCenter.y;
    const innerCurveEndX = innerCurveStartX - innerRadius;
    const innerCurveEndY = innerCurveStartY + innerRadius;
    const leftSideEndX = innerCurveEndX;
    const leftSideEndY = innerCurveEndY + tile.width;
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

    const input = tile.getInputCoord(x, y);
    const output = tile.getOutputCoord(direction, x, y, rotation);
    const centerR = tile.getCenterCoord(x, y, rotation);
</script>

<g
    class="tile curved-tile-enlarged"
    transform="rotate({rotation} {x} {y}) rotate({tileAngle} {center.x} {center.y})"
    {filter}
    {id}
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
