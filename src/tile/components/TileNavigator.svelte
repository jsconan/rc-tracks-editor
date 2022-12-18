<script context="module">
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    export const FOCUS_DELAY_CONTEXT_ID = 'focusDelay';
    export const FOCUS_DELAY_DEFAULT = 100;

    const instances = new Set();

    const findElementIndex = (navigator, id) => navigator.findIndex(element => element.id === id);

    export const focusElement = id => {
        instances.forEach(instance => {
            const { navigator, container } = instance;
            const index = findElementIndex(navigator, id);
            if (index > -1) {
                container.focus();
                navigator.defaultFocusedIndex = index;
                navigator.focus();
            }
        });
    };
</script>

<script>
    import { createEventDispatcher, getContext, hasContext, onDestroy, onMount } from 'svelte';
    import { flattenAttributeList } from '../../core/helpers';
    import { FocusManager } from '../../core/actions';
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
        const { type, direction, ratio, rotation, x, y } = tile;
        return { type, direction, ratio, rotation, x, y };
    };

    const navigator = new MenuNavigator();
    const hoverFocused = () => navigator.hoverFocused();
    const enterElement = event => {
        const target = event.target.closest('[data-id]');
        const targetId = target && target.dataset.id;

        if (targetId) {
            navigator.hoveredIndex = findElementIndex(navigator, targetId);
        }
    };
    const leaveElement = () => (navigator.hoveredIndex = -1);
    const blurElement = () => {
        navigator.focused = null;
    };
    const clickElement = () => {
        if (navigator.focused) {
            navigator.focusHovered();
        }
        select(navigator.hovered, navigator.hoveredIndex);
    };

    const focusContainer = () => {
        const focusedStyle = getTileStyle(TILE_STYLE_FOCUSED);
        containerFocused = { x, y, width, height, ...flattenAttributeList(focusedStyle) };
    };
    const blurContainer = () => {
        containerFocused = null;
    };

    const focusManager = new FocusManager(focusDelay)
        .on('focus', focusContainer)
        .on('blur click', blurContainer)
        .on('click', clickElement);

    const focus = () => focusManager.focus();
    const blur = () => {
        blurElement();
        focusManager.blur();
    };
    const click = () => focusManager.click();

    const keyNavigator = new KeyNavigator(direction);
    const keyDown = event => keyNavigator.processEvent(event, KeyNavigator.TYPE_MOVE);
    const keyUp = event => keyNavigator.processEvent(event, KeyNavigator.TYPE_CONTROL);

    keyNavigator
        .on('next', () => {
            navigator.focusNext();
        })
        .on('previous', () => {
            navigator.focusPrevious();
        })
        .on('validate', () => {
            select(navigator.focused, navigator.focusedIndex);
        })
        .on('cancel', () => {
            blurElement();
            focusContainer();
        });

    navigator
        .on('focus', (focused, index) => {
            focusedOverlay = extendTileWithStyle(TILE_STYLE_FOCUSED, getTile(focused));
            focusedOverlay.d = specs.barrierWidth;
            focusManager.blur();
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

    let container = null;
    const instance = { navigator, container };
    onMount(() => {
        instance.container = container;
        instances.add(instance);
    });
    onDestroy(() => {
        instances.delete(instance);
        instance.container = null;
    });

    $: navigator.elements = elements;
    $: navigator.defaultFocusedIndex = selectedIndex;
    $: selected = focusedOverlay || hoveredOverlay;
</script>

<g
    bind:this={container}
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
