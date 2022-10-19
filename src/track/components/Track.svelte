<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { createEventDispatcher } from 'svelte';
    import { Sketch } from '../elements';
    import { Tile } from '../../tile/components';
    import { TrackModel } from '../models';
    import { uid } from '../../core/helpers';

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

    const dispatch = createEventDispatcher();

    function dispatchEvent(event) {
        const index = track.getIndex(event.target.dataset.id);
        if (index > -1) {
            const { id, type, direction, ratio, x, y, angle } = $tilesStore.tiles[index];
            dispatch(event.type, { id, type, direction, ratio, x, y, angle, event });
        }
    }
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
    on:click={dispatchEvent}
    on:keypress={dispatchEvent}
>
    {#each $tilesStore.tiles as { id, x, y, angle, model } (id)}
        <use
            data-id={id}
            {x}
            {y}
            href="#{getId(model.modelId)}"
            transform={model.getRotateTransform(x, y, angle)}
            on:mouseenter={dispatchEvent}
            on:mouseleave={dispatchEvent}
        />
    {/each}
    <svelte:fragment slot="defs">
        {#each $modelsStore as { id, type, ratio, modelId } (id)}
            <Tile id={getId(modelId)} {type} {ratio} />
        {/each}
        <slot name="defs" />
    </svelte:fragment>
    <slot />
</Sketch>
