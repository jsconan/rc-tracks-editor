<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getContext } from 'svelte';
    import { tileParameters, groundColor } from '../helpers';
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

    $: model = new StraightTileModel(specs, direction, ratio);
    $: tile = tileParameters.straight(model, x, y);
    $: transform = model.getRotateTransform(x, y, angle);
</script>

<g class="tile straight-tile" {transform} {filter} {id}>
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
