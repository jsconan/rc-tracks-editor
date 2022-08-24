<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import CurvedBarrier from '../elements/CurvedBarrier.svelte';
    import CurvedElement from '../elements/CurvedElement.svelte';
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

    const tile = new Tile(tileLength, tileWidth, tileRatio, Tile.TYPE_CURVED, direction);

    const padding = tile.getPadding();
    const innerRadius = tile.getInnerRadius();
    const outerRadius = tile.getOuterRadius();
    const innerChunks = tile.getInnerBarrierChunks(barrierChunks);
    const outerChunks = tile.getOuterBarrierChunks(barrierChunks);
    const tileAngle = tile.getDirectionAngle();
    const curveAngle = tile.getCurveAngle();
    const center = tile.getCenterCoord(tileX, tileY);

    const x = tileX - tileLength / 2 + padding;
    const y = tileY;

    const curveX = x - innerRadius;
    const curveY = y;
    const innerBarrierRadius = innerRadius;
    const innerBarrierX = x;
    const innerBarrierY = y;
    const outerBarrierRadius = outerRadius - barrierWidth;
    const outerBarrierX = x + tileWidth - barrierWidth;
    const outerBarrierY = y;

    const input = tile.getInputCoord(tileX, tileY);
    const output = tile.getOutputCoord(tileX, tileY, rotation);
    const centerR = tile.getCenterCoord(tileX, tileY, rotation);
</script>

<g
    class="tile curved-tile"
    transform="rotate({rotation} {tileX} {tileY}) rotate({tileAngle} {center.x} {center.y})"
    {filter}
>
    <CurvedElement
        class="ground"
        cx={curveX}
        cy={curveY}
        width={tileWidth}
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
