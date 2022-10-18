<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getContext } from 'svelte';
    import { groundColor } from '../helpers';
    import { TileSpecifications } from '../config';
    import { CurvedElementEnlarged, CurvedBarrier, StraightBarrier } from '../elements';
    import { CurvedTileEnlargedModel } from '../models';

    export let direction = CurvedTileEnlargedModel.DIRECTION_RIGHT;
    export let ratio = 1;
    export let angle = 0;
    export let x = 0;
    export let y = 0;
    export let filter = void 0;
    export let id = void 0;

    const specs = getContext(TileSpecifications.CONTEXT_ID);
    const barrierLength = specs.barrierLength;
    const barrierWidth = specs.barrierWidth;
    const width = specs.width;

    /**
     * Computes the parameters for rendering the tile at the expected position.
     * @param {CurvedTileEnlargedModel} model
     * @param {number} tileX
     * @param {number} tileY
     * @returns {object}
     * @private
     */
    function getTileParameters(model, tileX, tileY) {
        const side = model.getCurveSide();
        const innerRadius = model.getInnerRadius();
        const outerRadius = model.getOuterRadius() - barrierWidth;
        const sideChunks = model.getSideBarrierChunks();
        const innerChunks = model.getInnerBarrierChunks();
        const outerChunks = model.getOuterBarrierChunks();
        const curveAngle = model.getCurveAngle();
        const curveCenter = model.getCurveCenter(tileX, tileY);
        const outerBarrier = width - barrierWidth;

        const { x: innerX, y: innerY } = curveCenter.addScalarX(innerRadius);
        const { x: outerX, y: outerY } = curveCenter.addCoord(
            side + outerRadius,
            innerRadius + outerBarrier - outerRadius
        );
        const { x: horizontalX, y: horizontalY } = curveCenter.addScalarY(innerRadius + outerBarrier);
        const { x: verticalX, y: verticalY } = curveCenter.addScalarX(innerRadius + outerBarrier);

        return {
            side,
            innerRadius,
            outerRadius,
            curveAngle,
            curveCenter,
            sideChunks,
            innerChunks,
            outerChunks,
            innerX,
            innerY,
            outerX,
            outerY,
            horizontalX,
            horizontalY,
            verticalX,
            verticalY
        };
    }

    $: model = new CurvedTileEnlargedModel(specs, direction, ratio);
    $: tile = getTileParameters(model, x, y);
    $: transform = model.getRotateTransform(x, y, angle);
</script>

<g class="tile curved-tile-enlarged" {transform} {filter} {id}>
    <CurvedElementEnlarged
        cx={tile.curveCenter.x}
        cy={tile.curveCenter.y}
        {width}
        side={tile.side}
        radius={tile.innerRadius}
        {...groundColor()}
    />
    <CurvedBarrier
        chunks={tile.innerChunks}
        width={barrierWidth}
        radius={tile.innerRadius}
        angle={tile.curveAngle}
        left={tile.innerX}
        top={tile.innerY}
        shift={0}
    />
    <CurvedBarrier
        chunks={tile.outerChunks}
        width={barrierWidth}
        radius={tile.outerRadius}
        angle={tile.curveAngle}
        left={tile.outerX}
        top={tile.outerY}
        shift={1}
    />
    <StraightBarrier
        chunks={tile.sideChunks}
        width={barrierWidth}
        length={barrierLength}
        left={tile.horizontalX}
        top={tile.horizontalY}
        shift={0}
        vertical={false}
    />
    <StraightBarrier
        chunks={tile.sideChunks}
        width={barrierWidth}
        length={barrierLength}
        left={tile.verticalX}
        top={tile.verticalY}
        shift={1}
        vertical={true}
    />
</g>
