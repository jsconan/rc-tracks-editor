<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { createEventDispatcher, getContext } from 'svelte';
    import { focusedColor, hoveredColor } from '../helpers';
    import { MenuNavigator } from '../../core/navigators';
    import { TileElement } from '../elements';
    import { TileSpecifications } from '../config';
    import Tile from './Tile.svelte';

    export let elements;
    export let hoveredIndex = -1;

    const specs = getContext(TileSpecifications.CONTEXT_ID);

    let focusedOverlay = null;
    let hoveredOverlay = null;
    let selected = null;

    const dispatch = createEventDispatcher();
    const select = element => {
        if (element) {
            dispatch('select', element);
        }
    };

    const getCoord = tile => {
        const { type, direction, ratio, angle, x, y } = tile;
        return { type, direction, ratio, angle, x, y };
    };

    const navigator = new MenuNavigator();
    const hoverFocused = () => navigator.hoverFocused();
    const leave = () => navigator.setHovered(-1);
    const blur = () => navigator.setFocused(-1);

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
            focusedOverlay = getCoord(focused);
        })
        .on('blur', () => {
            focusedOverlay = null;
        })
        .on('enter', hovered => {
            hoveredOverlay = getCoord(hovered);
        })
        .on('leave', () => {
            hoveredOverlay = null;
        })
        .on('focus blur enter leave', () => {
            selected = focusedOverlay || hoveredOverlay;
        });

    $: navigator.setElements(elements);
    $: if (hoveredIndex > -1) {
        navigator.setHovered(hoveredIndex);
    }
</script>

<g on:click={click} on:keyup={keyPress} on:blur={blur} role="menu" tabindex="0">
    <slot />
    {#if selected}
        <Tile {...selected} />
    {/if}
    {#if focusedOverlay}
        <g on:mouseenter={hoverFocused} class="focus">
            <TileElement {...focusedOverlay} d={specs.padding} {...focusedColor()} />
        </g>
    {/if}
    {#if hoveredOverlay}
        <g on:mouseleave={leave} class="hover">
            <TileElement {...hoveredOverlay} d={specs.padding} {...hoveredColor()} />
        </g>
    {/if}
</g>

<style>
    .hover {
        cursor: pointer;
    }
</style>
