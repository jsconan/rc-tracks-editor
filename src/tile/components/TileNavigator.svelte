<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { createEventDispatcher, getContext } from 'svelte';
    import { extendTileWithStyle, TILE_STYLE_FOCUSED, TILE_STYLE_HOVERED } from '../helpers';
    import { MenuNavigator } from '../../core/navigators';
    import { TileElement } from '../elements';
    import { TileSpecifications } from '../config';
    import Tile from './Tile.svelte';

    export let elements;
    export let hoveredIndex = -1;
    export let selectedIndex = -1;

    const specs = getContext(TileSpecifications.CONTEXT_ID);

    let focusedOverlay = null;
    let hoveredOverlay = null;

    const dispatch = createEventDispatcher();
    const select = element => {
        if (element) {
            dispatch('select', element);
        }
    };

    const getTile = tile => {
        const { type, direction, ratio, angle, x, y } = tile;
        return { type, direction, ratio, angle, x, y };
    };

    const navigator = new MenuNavigator();
    const hoverFocused = () => navigator.hoverFocused();
    const leave = () => (navigator.hovered = null);
    const blur = () => (navigator.focused = null);

    const click = () => {
        if (navigator.focused) {
            navigator.focusHovered();
        }
        select(navigator.hovered);
    };

    const keyPress = event => {
        if (event.defaultPrevented) {
            return;
        }
        event.preventDefault();

        switch (event.key) {
            case 'Right':
            case 'Down':
            case 'ArrowRight':
            case 'ArrowDown':
                navigator.focusNext();
                break;

            case 'Left':
            case 'Up':
            case 'ArrowLeft':
            case 'ArrowUp':
                navigator.focusPrevious();
                break;

            case ' ':
            case 'Spacebar':
            case 'Enter':
                select(navigator.focused);
                break;

            case 'Esc':
            case 'Escape':
                blur();
                return;
        }
    };

    navigator
        .on('focus', focused => {
            focusedOverlay = extendTileWithStyle(TILE_STYLE_FOCUSED, getTile(focused));
            focusedOverlay.d = specs.barrierWidth;
        })
        .on('blur', () => {
            focusedOverlay = null;
        })
        .on('enter', hovered => {
            hoveredOverlay = extendTileWithStyle(TILE_STYLE_HOVERED, getTile(hovered));
        })
        .on('leave', () => {
            hoveredOverlay = null;
        });

    $: navigator.elements = elements;
    $: navigator.defaultFocusedIndex = selectedIndex;
    $: if (hoveredIndex > -1) {
        navigator.hoveredIndex = hoveredIndex;
    }
    $: selected = focusedOverlay || hoveredOverlay;
</script>

<g on:click={click} on:keyup={keyPress} on:blur={blur} role="menu" tabindex="0">
    <slot />
    {#if selected}
        <Tile {...getTile(selected)} />
    {/if}
    {#if hoveredOverlay}
        <g on:mouseleave={leave} class="hover" pointer-events="all">
            <TileElement {...hoveredOverlay} />
        </g>
    {/if}
    {#if focusedOverlay}
        <g on:mouseenter={hoverFocused} on:mouseleave={leave} class="focus" pointer-events="all">
            <TileElement {...focusedOverlay} />
        </g>
    {/if}
</g>

<style>
    .hover {
        cursor: pointer;
    }
</style>
