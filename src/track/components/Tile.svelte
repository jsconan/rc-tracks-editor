<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { CURVED_TILE_ENLARGED_TYPE, CURVED_TILE_TYPE, STRAIGHT_TILE_TYPE } from '../helpers';
    import { TileModel } from '../models';
    import CurvedTile from './CurvedTile.svelte';
    import CurvedTileEnlarged from './CurvedTileEnlarged.svelte';
    import StraightTile from './StraightTile.svelte';

    export let model;
    export let angle = 0;
    export let x = 0;
    export let y = 0;
    export let filter = void 0;
    export let id = void 0;

    if (!(model instanceof TileModel)) {
        throw new TypeError('The model must be an instance of TileModel!');
    }

    const componentsMap = {
        [STRAIGHT_TILE_TYPE]: StraightTile,
        [CURVED_TILE_TYPE]: CurvedTile,
        [CURVED_TILE_ENLARGED_TYPE]: CurvedTileEnlarged
    };

    const type = model.type;
    const component = componentsMap[type];
</script>

<svelte:component this={component} {model} {angle} {x} {y} {filter} {id} on:click />
