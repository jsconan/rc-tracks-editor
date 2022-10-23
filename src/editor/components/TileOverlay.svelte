<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { CurvedElement, CurvedElementEnlarged, StraightElement } from '../../tile/elements';
    import { overlayColor, CURVED_TILE_ENLARGED_TYPE, CURVED_TILE_TYPE, STRAIGHT_TILE_TYPE } from '../../tile/helpers';
    import { TileModel } from '../../tile/models';

    export let tile;
    export let angle = 0;
    export let x = 0;
    export let y = 0;

    TileModel.validateInstance(tile);

    const componentsMap = {
        [STRAIGHT_TILE_TYPE]: StraightElement,
        [CURVED_TILE_TYPE]: CurvedElement,
        [CURVED_TILE_ENLARGED_TYPE]: CurvedElementEnlarged
    };

    $: parameters = tile.getShapeParameters(x, y);
    $: transform = tile.getRotateTransform(x, y, angle);
    $: component = componentsMap[tile.type];
</script>

<g class="tile-overlay" {transform}>
    <svelte:component this={component} {...parameters.ground} {...overlayColor()} />
</g>
