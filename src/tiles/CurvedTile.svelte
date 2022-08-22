<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import {
        getCurveAngle,
        getCurveInnerBarrierChunks,
        getCurveInnerRadius,
        getCurveOuterBarrierChunks,
        getCurveOuterRadius
    } from '../helpers/track.js';
    import CurvedBarrier from '../elements/CurvedBarrier.svelte';
    import CurvedElement from '../elements/CurvedElement.svelte';
    import { Vector2D } from '../types/vector-2d.js';

    export let barrierChunks;
    export let barrierWidth;
    export let tileLength;
    export let tileWidth;
    export let tileRatio = 1;
    export let tileAngle = 0;
    export let tileX = 0;
    export let tileY = 0;
    export let filter;

    const tilePadding = (tileLength - tileWidth) / 2;
    const innerRadius = getCurveInnerRadius(tileLength, tileWidth, tileRatio);
    const outerRadius = getCurveOuterRadius(tileLength, tileWidth, tileRatio);
    const innerChunks = getCurveInnerBarrierChunks(barrierChunks, tileRatio);
    const outerChunks = getCurveOuterBarrierChunks(barrierChunks, tileRatio);
    const curveAngle = getCurveAngle(tileRatio);

    const x = tileX + tilePadding;
    const y = tileY;

    const curveX = x - innerRadius;
    const curveY = y;
    const innerBarrierRadius = innerRadius;
    const innerBarrierX = x;
    const innerBarrierY = y;
    const outerBarrierRadius = outerRadius - barrierWidth;
    const outerBarrierX = x + tileWidth - barrierWidth;
    const outerBarrierY = y;

    const curveCenter = new Vector2D(curveX, curveY);
    const middle = innerRadius + tileWidth / 2;

    const p1 = Vector2D.polar(middle, 0, curveCenter);
    const p2 = p1.addScalarY(10);
    const p3 = Vector2D.polar(middle, curveAngle, curveCenter);
    const p4 = p3.add(Vector2D.polar(10, curveAngle + 90));
    const c = Vector2D.intersect(p1, p2, p3, p4);

    const cx = c.x;
    const cy = c.y;
</script>

<g class="tile curved-tile" transform="rotate({tileAngle} {cx} {cy})" {filter}>
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
