<script context="module">
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    export const FOCUS_DELAY_CONTEXT_ID = 'focusDelay';
    export const FOCUS_DELAY_DEFAULT = 100;
</script>

<script>
    import { createEventDispatcher, getContext, hasContext } from 'svelte';
    import { flattenAttributeList } from '../../core/helpers';
    import { DeferredAction } from '../../core/actions';
    import { extendTileWithStyle, getTileStyle, TILE_STYLE_FOCUSED, TILE_STYLE_HOVERED } from '../helpers';
    import { KeyNavigator, MenuNavigator } from '../../core/navigators';
    import { TileElement } from '../elements';
    import { TileSpecifications } from '../config';
    import Tile from './Tile.svelte';

    export let elements;
    export let direction = KeyNavigator.MODE_BOTH;
    export let selectedIndex = -1;
    export let x = void 0;
    export let y = void 0;
    export let width = void 0;
    export let height = void 0;

    const specs = getContext(TileSpecifications.CONTEXT_ID);
    const focusDelay = hasContext(FOCUS_DELAY_CONTEXT_ID) ? getContext(FOCUS_DELAY_CONTEXT_ID) : FOCUS_DELAY_DEFAULT;

    let focusedOverlay = null;
    let hoveredOverlay = null;
    let containerFocused = null;

    const dispatch = createEventDispatcher();
    const dispatchEvent = (name, element, index) => dispatch(name, { index, ...element });

    const select = (element, index) => {
        if (!element) {
            return;
        }

        selectedIndex = index;
        dispatchEvent('select', element, index);
    };

    const getTile = tile => {
        const { type, direction, ratio, angle, x, y } = tile;
        return { type, direction, ratio, angle, x, y };
    };

    const menuNavigator = new MenuNavigator();
    const hoverFocused = () => menuNavigator.hoverFocused();
    const enterElement = event => {
        const target = event.target.closest('[data-id]');
        const targetId = target && target.dataset.id;

        if (targetId) {
            menuNavigator.hoveredIndex = menuNavigator.findIndex(element => element.id === targetId);
        }
    };
    const leaveElement = () => (menuNavigator.hoveredIndex = -1);
    const blurElement = () => {
        menuNavigator.focused = null;
    };

    const focusContainer = () => {
        const focusedStyle = getTileStyle(TILE_STYLE_FOCUSED);
        containerFocused = { x, y, width, height, ...flattenAttributeList(focusedStyle) };
    };
    const focusDeferrer = new DeferredAction(focusDelay);
    focusDeferrer.register(focusContainer);
    const blurContainer = () => {
        focusDeferrer.cancel();
        containerFocused = null;
    };

    const focus = () => {
        focusDeferrer.defer();
    };
    const blur = () => {
        blurElement();
        blurContainer();
    };

    const click = () => {
        blurContainer();
        if (menuNavigator.focused) {
            menuNavigator.focusHovered();
        }
        select(menuNavigator.hovered, menuNavigator.hoveredIndex);
    };

    const keyNavigator = new KeyNavigator(direction);
    const keyDown = event => keyNavigator.processEvent(event, KeyNavigator.TYPE_MOVE);
    const keyUp = event => keyNavigator.processEvent(event, KeyNavigator.TYPE_CONTROL);

    keyNavigator
        .on('next', () => {
            menuNavigator.focusNext();
        })
        .on('previous', () => {
            menuNavigator.focusPrevious();
        })
        .on('validate', () => {
            select(menuNavigator.focused, menuNavigator.focusedIndex);
        })
        .on('cancel', () => {
            blurElement();
            focusContainer();
        });

    menuNavigator
        .on('focus', (focused, index) => {
            focusedOverlay = extendTileWithStyle(TILE_STYLE_FOCUSED, getTile(focused));
            focusedOverlay.d = specs.barrierWidth;
            containerFocused = null;
            dispatchEvent('focus', focused, index);
        })
        .on('blur', (focused, index) => {
            focusedOverlay = null;
            dispatchEvent('blur', focused, index);
        })
        .on('enter', (hovered, index) => {
            hoveredOverlay = extendTileWithStyle(TILE_STYLE_HOVERED, getTile(hovered));
            dispatchEvent('enter', hovered, index);
        })
        .on('leave', (hovered, index) => {
            hoveredOverlay = null;
            dispatchEvent('leave', hovered, index);
        });

    $: menuNavigator.elements = elements;
    $: menuNavigator.defaultFocusedIndex = selectedIndex;
    $: selected = focusedOverlay || hoveredOverlay;
</script>

<g
    on:click={click}
    on:mouseover={enterElement}
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
        <g on:mouseleave={leaveElement} class="hover" pointer-events="all">
            <TileElement {...hoveredOverlay} />
        </g>
    {/if}
    {#if focusedOverlay}
        <g on:mouseenter={hoverFocused} on:mouseleave={leaveElement} class="focus" pointer-events="all">
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
