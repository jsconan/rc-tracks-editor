<script>
    import { createEventDispatcher } from 'svelte';
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import {
        validateType,
        CURVED_TILE_ENLARGED_TYPE,
        CURVED_TILE_TYPE,
        STRAIGHT_TILE_TYPE,
        TILE_DIRECTION_RIGHT
    } from '../helpers';
    import CurvedTile from './CurvedTile.svelte';
    import CurvedTileEnlarged from './CurvedTileEnlarged.svelte';
    import StraightTile from './StraightTile.svelte';

    export let type = STRAIGHT_TILE_TYPE;
    export let direction = TILE_DIRECTION_RIGHT;
    export let ratio = 1;
    export let angle = 0;
    export let x = 0;
    export let y = 0;
    export let filter = void 0;
    export let id = void 0;

    validateType(type);

    const dispatch = createEventDispatcher();
    const click = () => dispatch('click', { id, type, direction, ratio, x, y, angle });

    const componentsMap = {
        [STRAIGHT_TILE_TYPE]: StraightTile,
        [CURVED_TILE_TYPE]: CurvedTile,
        [CURVED_TILE_ENLARGED_TYPE]: CurvedTileEnlarged
    };

    $: component = componentsMap[type];
</script>

<svelte:component this={component} {direction} {ratio} {angle} {x} {y} {filter} {id} on:click={click} />
