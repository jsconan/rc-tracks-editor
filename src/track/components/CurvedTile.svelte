<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { createEventDispatcher, getContext } from 'svelte';
    import { TileSpecifications } from '../config';
    import { CurvedBarrier, CurvedElement } from '../elements';
    import { CurvedTileModel } from '../models';

    export let direction = CurvedTileModel.DIRECTION_RIGHT;
    export let ratio = 1;
    export let angle = 0;
    export let x = 0;
    export let y = 0;
    export let filter = void 0;
    export let id = void 0;

    const dispatch = createEventDispatcher();
    const specs = getContext(TileSpecifications.CONTEXT_ID);
    const type = CurvedTileModel.TYPE;

    const barrierWidth = specs.barrierWidth;
    const width = specs.width;

    /**
     * Handles the click event.
     * @private
     */
    function click() {
        dispatch('click', { id, type, direction, ratio, x, y, angle });
    }

    /**
     * Computes the parameters for rendering the tile at the expected position.
     * @param {CurvedTileModel} model
     * @param {number} tileX
     * @param {number} tileY
     * @returns {object}
     * @private
     */
    function getTileParameters(model, tileX, tileY) {
        const innerRadius = model.getInnerRadius();
        const outerRadius = model.getOuterRadius() - barrierWidth;
        const innerChunks = model.getInnerBarrierChunks();
        const outerChunks = model.getOuterBarrierChunks();
        const curveAngle = model.getCurveAngle();
        const curveCenter = model.getCurveCenter(tileX, tileY);

        const innerX = curveCenter.x + innerRadius;
        const innerY = curveCenter.y;
        const outerX = curveCenter.x + outerRadius;
        const outerY = curveCenter.y;

        return {
            innerRadius,
            outerRadius,
            curveAngle,
            curveCenter,
            innerChunks,
            outerChunks,
            innerX,
            innerY,
            outerX,
            outerY
        };
    }

    $: model = new CurvedTileModel(specs, direction, ratio);
    $: tile = getTileParameters(model, x, y);
    $: transform = model.getRotateTransform(x, y, angle);
</script>

<g class="tile curved-tile" {transform} {filter} {id} on:click={click}>
    <CurvedElement
        class="ground"
        cx={tile.curveCenter.x}
        cy={tile.curveCenter.y}
        {width}
        radius={tile.innerRadius}
        angle={tile.curveAngle}
        start={0}
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
</g>
