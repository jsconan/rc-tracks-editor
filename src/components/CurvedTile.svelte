<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import CurvedBarrier from '../elements/CurvedBarrier.svelte';
    import CurvedElement from '../elements/CurvedElement.svelte';
    import CurvedTileModel from '../models/CurvedTileModel.js';
    import ControlPoints from './ControlPoints.svelte';

    export let barrierChunks;
    export let barrierWidth;
    export let laneWidth;
    export let ratio = 1;
    export let direction = CurvedTileModel.DIRECTION_RIGHT;
    export let angle = 0;
    export let x = 0;
    export let y = 0;
    export let filter;
    export let id = void 0;

    const model = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
    const innerRadius = model.getInnerRadius();
    const outerRadius = model.getOuterRadius();
    const innerChunks = model.getInnerBarrierChunks();
    const outerChunks = model.getOuterBarrierChunks();
    const tileAngle = model.getDirectionAngle(direction);
    const curveAngle = model.getCurveAngle();
    const curveCenter = model.getCurveCenter(x, y);
    const center = model.getCenterCoord(x, y);

    const innerBarrierRadius = innerRadius;
    const innerBarrierX = curveCenter.x + innerBarrierRadius;
    const innerBarrierY = curveCenter.y;
    const outerBarrierRadius = outerRadius - barrierWidth;
    const outerBarrierX = curveCenter.x + outerBarrierRadius;
    const outerBarrierY = curveCenter.y;
</script>

<g class="tile curved-tile" transform="rotate({angle} {x} {y}) rotate({tileAngle} {center.x} {center.y})" {filter} {id}>
    <CurvedElement
        class="ground"
        cx={curveCenter.x}
        cy={curveCenter.y}
        width={model.width}
        radius={innerRadius}
        angle={curveAngle}
        start={0}
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
</g>

<ControlPoints {model} {direction} {angle} {x} {y} />
