<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import StraightBarrier from '../elements/StraightBarrier.svelte';
    import StraightElement from '../elements/StraightElement.svelte';
    import StraightTileModel from '../models/StraightTileModel.js';

    export let barrierChunks;
    export let barrierWidth;
    export let laneWidth;
    export let ratio = 1;
    export let direction = StraightTileModel.DIRECTION_RIGHT;
    export let rotation = 0;
    export let x = 0;
    export let y = 0;
    export let filter;
    export let id = void 0;

    const tile = new StraightTileModel(laneWidth, barrierWidth, barrierChunks, ratio);
    const width = tile.getWidth();
    const height = tile.getLength();
    const chunks = tile.getSideBarrierChunks();
    const innerRadius = tile.getInnerRadius();
    const outerRadius = tile.getOuterRadius();
    const tileAngle = tile.getDirectionAngle(direction);
    const curveCenter = tile.getCurveCenter(x, y);
    const center = tile.getCenterCoord(x, y);
    const barrierLength = tile.length / barrierChunks;
    const vertical = true;

    const leftBarrierX = curveCenter.x + innerRadius;
    const leftBarrierY = curveCenter.y;
    const rightBarrierX = curveCenter.x + outerRadius - barrierWidth;
    const rightBarrierY = curveCenter.y;

    const input = tile.getInputCoord(x, y);
    const output = tile.getOutputCoord(direction, x, y, rotation);
    const centerR = tile.getCenterCoord(x, y, rotation);
</script>

<g
    class="tile straight-tile"
    transform="rotate({rotation} {x} {y}) rotate({tileAngle} {center.x} {center.y})"
    {filter}
    {id}
>
    <StraightElement class="ground" x={leftBarrierX} y={leftBarrierY} {width} {height} />
    <StraightBarrier
        {chunks}
        width={barrierWidth}
        length={barrierLength}
        left={leftBarrierX}
        top={leftBarrierY}
        shift={0}
        {vertical}
    />
    <StraightBarrier
        {chunks}
        width={barrierWidth}
        length={barrierLength}
        left={rightBarrierX}
        top={rightBarrierY}
        shift={1}
        {vertical}
    />
</g>

<circle class="control" cx={centerR.x} cy={centerR.y} r="4" />
<circle class="control" cx={input.x} cy={input.y} r="4" />
<circle class="control" cx={output.x} cy={output.y} r="4" />
