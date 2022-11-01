<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getContext } from 'svelte';
    import { extendTileWithStyle, TILE_STYLE_GROUND } from '../helpers';
    import { TileSpecifications } from '../config';
    import { CurvedElementEnlarged, CurvedBarrier, StraightBarrier } from '../elements';
    import { CurvedTileEnlargedModel } from '../models';

    export let direction = CurvedTileEnlargedModel.DIRECTION_RIGHT;
    export let ratio = 1;
    export let angle = 0;
    export let x = 0;
    export let y = 0;
    export let id = void 0;

    const specs = getContext(TileSpecifications.CONTEXT_ID);

    $: model = new CurvedTileEnlargedModel(specs, direction, ratio);
    $: parameters = model.getShapeParameters(x, y);
    $: transform = model.getRotateTransform(x, y, angle);
</script>

<g class="tile curved-tile-enlarged" {transform} {id}>
    <CurvedElementEnlarged {...extendTileWithStyle(TILE_STYLE_GROUND, parameters.ground)} />
    <CurvedBarrier {...parameters.innerBarrier} />
    <CurvedBarrier {...parameters.outerBarrier} />
    <StraightBarrier {...parameters.horizontalBarrier} />
    <StraightBarrier {...parameters.verticalBarrier} />
</g>
