<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getContext } from 'svelte';
    import { CURVED_TILE_ENLARGED_TYPE, CURVED_TILE_TYPE, STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT } from '../helpers';
    import { TileList } from '../models';
    import { TileSpecifications } from '../config';
    import CurvedElement from './CurvedElement.svelte';
    import CurvedElementEnlarged from './CurvedElementEnlarged.svelte';
    import StraightElement from './StraightElement.svelte';

    export let type = STRAIGHT_TILE_TYPE;
    export let direction = TILE_DIRECTION_RIGHT;
    export let ratio = 1;
    export let angle = 0;
    export let x = 0;
    export let y = 0;
    export let fill = void 0;
    export let stroke = void 0;
    export let strokeWidth = void 0;

    const specs = getContext(TileSpecifications.CONTEXT_ID);

    const componentsMap = {
        [STRAIGHT_TILE_TYPE]: StraightElement,
        [CURVED_TILE_TYPE]: CurvedElement,
        [CURVED_TILE_ENLARGED_TYPE]: CurvedElementEnlarged
    };

    $: model = TileList.createTile(specs, type, direction, ratio);
    $: parameters = model.getShapeParameters(x, y).ground;
    $: transform = model.getRotateTransform(x, y, angle);
    $: component = componentsMap[type];
</script>

<svelte:component this={component} {...parameters} {fill} {stroke} {strokeWidth} {transform} />
