<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { Sketch } from '../elements';
    import { Tile, TileNavigator } from '../../tile/components';
    import { TrackModel } from '../models';
    import { getRect, uid } from '../../core/helpers';

    export let track;
    export let x = 0;
    export let y = 0;
    export let width = void 0;
    export let height = void 0;

    TrackModel.validateInstance(track);

    const tilesStore = track.tilesStore;
    const modelsStore = track.modelsStore;

    const trackId = uid();
    const getId = id => `${trackId}-${id}`;

    let hoveredIndex = -1;
    const enter = event => {
        hoveredIndex = track.getIndex(event.target.dataset.id);
    };
    const leave = () => {
        hoveredIndex = -1;
    };

    $: rect = getRect($tilesStore);
</script>

<Sketch
    {x}
    {y}
    {width}
    {height}
    viewX={$tilesStore.x}
    viewY={$tilesStore.y}
    viewWidth={$tilesStore.width}
    viewHeight={$tilesStore.height}
>
    <TileNavigator elements={$tilesStore.tiles} {hoveredIndex} {...rect} on:select>
        {#each $tilesStore.tiles as { id, x, y, angle, model } (id)}
            <use
                data-id={id}
                {x}
                {y}
                href="#{getId(model.modelId)}"
                transform={model.getRotateTransform(x, y, angle)}
                role="menuitem"
                tabindex="-1"
                on:mouseenter={enter}
                on:mouseleave={leave}
            />
        {/each}
    </TileNavigator>
    <svelte:fragment slot="defs">
        {#each $modelsStore as { id, type, ratio, modelId } (id)}
            <Tile id={getId(modelId)} {type} {ratio} />
        {/each}
        <slot name="defs" />
    </svelte:fragment>
    <slot />
</Sketch>
