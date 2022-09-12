<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { createEventDispatcher } from 'svelte';
    import { CurvedBarrier, CurvedElement } from '../elements';
    import { CurvedTileModel } from '../models';

    export let model;
    export let angle = 0;
    export let x = 0;
    export let y = 0;
    export let filter = void 0;
    export let id = void 0;

    if (!(model instanceof CurvedTileModel)) {
        throw new TypeError('The model must be an instance of CurvedTileModel!');
    }

    const innerRadius = model.getInnerRadius();
    const outerRadius = model.getOuterRadius();
    const innerChunks = model.getInnerBarrierChunks();
    const outerChunks = model.getOuterBarrierChunks();
    const tileAngle = model.getDirectionAngle();
    const curveAngle = model.getCurveAngle();
    const curveCenter = model.getCurveCenter(x, y);
    const center = model.getCenterCoord(x, y);
    const barrierWidth = model.specs.barrierWidth;
    const width = model.specs.width;

    const innerBarrierRadius = innerRadius;
    const innerBarrierX = curveCenter.x + innerBarrierRadius;
    const innerBarrierY = curveCenter.y;
    const outerBarrierRadius = outerRadius - barrierWidth;
    const outerBarrierX = curveCenter.x + outerBarrierRadius;
    const outerBarrierY = curveCenter.y;

    const dispatch = createEventDispatcher();

    function click() {
        dispatch('click', { id, x, y, angle, model });
    }

    $: rotation = angle ? `rotate(${angle} ${x} ${y})` : '';
    $: orientation = tileAngle ? `rotate(${tileAngle} ${center.x} ${center.y})` : '';
    $: transform = rotation || orientation ? `${rotation}${orientation}` : '';
</script>

<g class="tile curved-tile" {transform} {filter} {id} on:click={click}>
    <CurvedElement
        class="ground"
        cx={curveCenter.x}
        cy={curveCenter.y}
        {width}
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
