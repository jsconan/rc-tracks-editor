<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import CurvedBarrier from '../elements/CurvedBarrier.svelte';
    import CurvedElement from '../elements/CurvedElement.svelte';
    import { CurvedTileModel } from '../models/curved-tile-model.js';

    export let barrierChunks;
    export let barrierWidth;
    export let laneWidth;
    export let ratio = 1;
    export let direction = CurvedTileModel.DIRECTION_RIGHT;
    export let rotation = 0;
    export let x = 0;
    export let y = 0;
    export let filter;

    const tile = new CurvedTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
    const innerRadius = tile.getInnerRadius();
    const outerRadius = tile.getOuterRadius();
    const innerChunks = tile.getInnerBarrierChunks();
    const outerChunks = tile.getOuterBarrierChunks();
    const tileAngle = tile.getDirectionAngle(direction);
    const curveAngle = tile.getCurveAngle();
    const curveCenter = tile.getCurveCenter(x, y);
    const center = tile.getCenterCoord(x, y);

    const innerBarrierRadius = innerRadius;
    const innerBarrierX = curveCenter.x + innerBarrierRadius;
    const innerBarrierY = curveCenter.y;
    const outerBarrierRadius = outerRadius - barrierWidth;
    const outerBarrierX = curveCenter.x + outerBarrierRadius;
    const outerBarrierY = curveCenter.y;

    const input = tile.getInputCoord(x, y);
    const output = tile.getOutputCoord(direction, x, y, rotation);
    const centerR = tile.getCenterCoord(x, y, rotation);
</script>

<g class="tile curved-tile" transform="rotate({rotation} {x} {y}) rotate({tileAngle} {center.x} {center.y})" {filter}>
    <CurvedElement
        class="ground"
        cx={curveCenter.x}
        cy={curveCenter.y}
        width={tile.width}
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

<circle class="control" cx={centerR.x} cy={centerR.y} r="4" />
<circle class="control" cx={input.x} cy={input.y} r="4" />
<circle class="control" cx={output.x} cy={output.y} r="4" />
