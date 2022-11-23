<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getContext } from 'svelte';
    import { extendTileWithStyle, TILE_STYLE_GROUND } from '../helpers';
    import { TileSpecifications } from '../config';
    import { StraightBarrier } from '../elements';
    import { StraightElement } from '../../core/elements';
    import { StraightTileModel } from '../models';

    export let direction = StraightTileModel.DIRECTION_RIGHT;
    export let ratio = 1;
    export let rotation = 0;
    export let x = 0;
    export let y = 0;
    export let id = void 0;

    const specs = getContext(TileSpecifications.CONTEXT_ID);

    $: model = new StraightTileModel(specs, direction, ratio);
    $: parameters = model.getShapeParameters(x, y);
    $: transform = model.getRotateTransform(x, y, rotation);
</script>

<g class="tile straight-tile" {transform} {id}>
    <StraightElement {...extendTileWithStyle(TILE_STYLE_GROUND, parameters.ground)} />
    <StraightBarrier {...parameters.leftBarrier} />
    <StraightBarrier {...parameters.rightBarrier} />
</g>
