<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import CurvedBarrier from '../elements/CurvedBarrier.svelte';
    import StraightBarrier from '../elements/StraightBarrier.svelte';
    import CurvedTileEnlargedModel from '../models/CurvedTileEnlargedModel.js';
    import ControlPoints from './ControlPoints.svelte';

    export let barrierChunks;
    export let barrierWidth;
    export let laneWidth;
    export let ratio = 1;
    export let direction = CurvedTileEnlargedModel.DIRECTION_RIGHT;
    export let angle = 0;
    export let x = 0;
    export let y = 0;
    export let filter;
    export let id = void 0;

    const model = new CurvedTileEnlargedModel(laneWidth, barrierWidth, barrierChunks, ratio);
    const barrierLength = model.length / barrierChunks;
    const side = model.getCurveSide();
    const innerRadius = model.getInnerRadius();
    const outerRadius = model.getOuterRadius();
    const sideChunks = model.getSideBarrierChunks();
    const innerChunks = model.getInnerBarrierChunks();
    const outerChunks = model.getOuterBarrierChunks();
    const tileAngle = model.getDirectionAngle(direction);
    const curveAngle = model.getCurveAngle();
    const curveCenter = model.getCurveCenter(x, y);
    const center = model.getCenterCoord(x, y);

    const innerCurveStartX = curveCenter.x + innerRadius;
    const innerCurveStartY = curveCenter.y;
    const innerCurveEndX = innerCurveStartX - innerRadius;
    const innerCurveEndY = innerCurveStartY + innerRadius;
    const leftSideEndX = innerCurveEndX;
    const leftSideEndY = innerCurveEndY + model.width;
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

<g
    class="tile curved-tile-enlarged"
    transform="rotate({angle} {x} {y}) rotate({tileAngle} {center.x} {center.y})"
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

<ControlPoints {model} {direction} {angle} {x} {y} />
