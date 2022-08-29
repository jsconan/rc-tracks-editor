<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import StraightBarrier from '../elements/StraightBarrier.svelte';
    import StraightElement from '../elements/StraightElement.svelte';
    import { TILE_DIRECTION_RIGHT } from '../helpers/types';

    export let model;
    export let direction = TILE_DIRECTION_RIGHT;
    export let angle = 0;
    export let x = 0;
    export let y = 0;
    export let filter = void 0;
    export let id = void 0;

    const width = model.getWidth();
    const height = model.getLength();
    const chunks = model.getSideBarrierChunks();
    const innerRadius = model.getInnerRadius();
    const outerRadius = model.getOuterRadius();
    const tileAngle = model.getDirectionAngle(direction);
    const curveCenter = model.getCurveCenter(x, y);
    const center = model.getCenterCoord(x, y);
    const barrierLength = model.length / model.barrierChunks;
    const barrierWidth = model.barrierWidth;
    const vertical = true;

    const leftBarrierX = curveCenter.x + innerRadius;
    const leftBarrierY = curveCenter.y;
    const rightBarrierX = curveCenter.x + outerRadius - barrierWidth;
    const rightBarrierY = curveCenter.y;

    $: rotation = angle ? `rotate(${angle} ${x} ${y})` : '';
    $: orientation = tileAngle ? `rotate(${tileAngle} ${center.x} ${center.y})` : '';
    $: transform = rotation || orientation ? `${rotation}${orientation}` : '';
</script>

<g class="tile straight-tile" {transform} {filter} {id}>
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
