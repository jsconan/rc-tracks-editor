<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getContext } from 'svelte';
    import { tileParameters, groundColor } from '../helpers';
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

    const specs = getContext(TileSpecifications.CONTEXT_ID);
    const barrierWidth = specs.barrierWidth;
    const width = specs.width;

    $: model = new CurvedTileModel(specs, direction, ratio);
    $: tile = tileParameters.curve(model, x, y);
    $: transform = model.getRotateTransform(x, y, angle);
</script>

<g class="tile curved-tile" {transform} {filter} {id}>
    <CurvedElement
        cx={tile.curveCenter.x}
        cy={tile.curveCenter.y}
        {width}
        radius={tile.innerRadius}
        angle={tile.curveAngle}
        start={0}
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
</g>
