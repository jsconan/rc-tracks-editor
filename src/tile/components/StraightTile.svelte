<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getContext } from 'svelte';
    import { groundColor } from '../helpers';
    import { TileSpecifications } from '../config';
    import { StraightBarrier, StraightElement } from '../elements';
    import { StraightTileModel } from '../models';

    export let direction = StraightTileModel.DIRECTION_RIGHT;
    export let ratio = 1;
    export let angle = 0;
    export let x = 0;
    export let y = 0;
    export let filter = void 0;
    export let id = void 0;

    const specs = getContext(TileSpecifications.CONTEXT_ID);
    const barrierLength = specs.barrierLength;
    const barrierWidth = specs.barrierWidth;
    const vertical = true;

    /**
     * Computes the parameters for rendering the tile at the expected position.
     * @param {StraightTileModel} model
     * @param {number} tileX
     * @param {number} tileY
     * @returns {object}
     * @private
     */
    function getTileParameters(model, tileX, tileY) {
        const width = model.width;
        const height = model.length;
        const chunks = model.getSideBarrierChunks();
        const innerRadius = model.getInnerRadius();
        const outerRadius = model.getOuterRadius();
        const curveCenter = model.getCurveCenter(tileX, tileY);

        const leftX = curveCenter.x + innerRadius;
        const leftY = curveCenter.y;
        const rightX = curveCenter.x + outerRadius - barrierWidth;
        const rightY = curveCenter.y;

        return { width, height, chunks, leftX, leftY, rightX, rightY };
    }

    $: model = new StraightTileModel(specs, direction, ratio);
    $: tile = getTileParameters(model, x, y);
    $: transform = model.getRotateTransform(x, y, angle);
</script>

<g class="tile straight-tile" {transform} {filter} {id} on:click on:keypress>
    <StraightElement x={tile.leftX} y={tile.leftY} width={tile.width} height={tile.height} {...groundColor()} />
    <StraightBarrier
        chunks={tile.chunks}
        width={barrierWidth}
        length={barrierLength}
        left={tile.leftX}
        top={tile.leftY}
        shift={0}
        {vertical}
    />
    <StraightBarrier
        chunks={tile.chunks}
        width={barrierWidth}
        length={barrierLength}
        left={tile.rightX}
        top={tile.rightY}
        shift={1}
        {vertical}
    />
</g>
