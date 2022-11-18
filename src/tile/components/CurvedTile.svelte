<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getContext } from 'svelte';
    import { extendTileWithStyle, TILE_STYLE_GROUND } from '../helpers';
    import { TileSpecifications } from '../config';
    import { CurvedBarrier, CurvedElement } from '../elements';
    import { CurvedTileModel } from '../models';

    export let direction = CurvedTileModel.DIRECTION_RIGHT;
    export let ratio = 1;
    export let rotation = 0;
    export let x = 0;
    export let y = 0;
    export let id = void 0;

    const specs = getContext(TileSpecifications.CONTEXT_ID);

    $: model = new CurvedTileModel(specs, direction, ratio);
    $: parameters = model.getShapeParameters(x, y);
    $: transform = model.getRotateTransform(x, y, rotation);
</script>

<g class="tile curved-tile" {transform} {id}>
    <CurvedElement {...extendTileWithStyle(TILE_STYLE_GROUND, parameters.ground)} />
    <CurvedBarrier {...parameters.innerBarrier} />
    <CurvedBarrier {...parameters.outerBarrier} />
</g>
