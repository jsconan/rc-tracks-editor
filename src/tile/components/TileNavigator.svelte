<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { createEventDispatcher, getContext } from 'svelte';
    import { attributeList } from '../../core/helpers';
    import { extendTileWithStyle, getTileStyle, TILE_STYLE_FOCUSED, TILE_STYLE_HOVERED } from '../helpers';
    import { MenuNavigator } from '../../core/navigators';
    import { TileElement } from '../elements';
    import { TileSpecifications } from '../config';
    import Tile from './Tile.svelte';

    export let elements;
    export let selectedIndex = -1;
    export let keepSelection = false;
    export let x = void 0;
    export let y = void 0;
    export let width = void 0;
    export let height = void 0;

    const specs = getContext(TileSpecifications.CONTEXT_ID);

    let focusedOverlay = null;
    let hoveredOverlay = null;
    let containerFocused = null;

    const dispatch = createEventDispatcher();
    const select = (element, index) => {
        if (!element) {
            return;
        }

        if (keepSelection) {
            selectedIndex = index;
        }

        dispatch('select', element);
    };

    const getTile = tile => {
        const { type, direction, ratio, angle, x, y } = tile;
        return { type, direction, ratio, angle, x, y };
    };

    const navigator = new MenuNavigator();
    const hoverFocused = () => navigator.hoverFocused();
    const enter = event => {
        const target = event.target.closest('[data-id]');
        const targetId = target && target.dataset.id;

        if (targetId) {
            navigator.hoveredIndex = navigator.findIndex(element => element.id === targetId);
        }
    };
    const leave = () => (navigator.hoveredIndex = -1);
    const blur = () => {
        navigator.focused = null;
        containerFocused = null;
    };
    const focus = () => {
        const focusedStyle = getTileStyle(TILE_STYLE_FOCUSED);
        containerFocused = {
            x,
            y,
            width,
            height,
            ...attributeList(focusedStyle.fill, 'fill'),
            ...attributeList(focusedStyle.stroke, 'stroke')
        };
    };

    const click = () => {
        if (navigator.focused) {
            navigator.focusHovered();
        }
        select(navigator.hovered, navigator.hoveredIndex);
    };

    const keyDown = event => {
        if (event.defaultPrevented) {
            return;
        }

        switch (event.key) {
            case 'Right':
            case 'Down':
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                navigator.focusNext();
                break;

            case 'Left':
            case 'Up':
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                navigator.focusPrevious();
                break;
        }
    };

    const keyUp = event => {
        if (event.defaultPrevented) {
            return;
        }

        switch (event.key) {
            case ' ':
            case 'Spacebar':
            case 'Enter':
                event.preventDefault();
                select(navigator.focused, navigator.focusedIndex);
                break;

            case 'Esc':
            case 'Escape':
                event.preventDefault();
                blur();
                focus();
                return;
        }
    };

    navigator
        .on('focus', focused => {
            focusedOverlay = extendTileWithStyle(TILE_STYLE_FOCUSED, getTile(focused));
            focusedOverlay.d = specs.barrierWidth;
            containerFocused = null;
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
    $: selected = focusedOverlay || hoveredOverlay;
</script>

<g
    on:click={click}
    on:mouseover={enter}
    on:keydown={keyDown}
    on:keyup={keyUp}
    on:blur={blur}
    on:focus={focus}
    class="navigator"
    role="menu"
    tabindex="0"
>
    <slot />
    {#if containerFocused}
        <rect {...containerFocused} />
    {/if}
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
    .navigator:focus-visible {
        outline: none;
    }
    .hover {
        cursor: pointer;
    }
</style>
