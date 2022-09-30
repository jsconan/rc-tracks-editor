<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { createEventDispatcher } from 'svelte';
    import { Sketch } from '../elements';
    import { TILE_DIRECTION_RIGHT } from '../../tile/helpers';
    import { TileCoordList } from '../../tile/models';
    import { Tile } from '../../tile/components';

    export let list;
    export let x = 0;
    export let y = 0;
    export let width = void 0;
    export let height = void 0;

    TileCoordList.validateInstance(list);

    const dispatch = createEventDispatcher();

    /**
     * Handles the click event.
     * @param event
     * @private
     */
    function click(event) {
        const index = list.getIndex(event.target.dataset.id);
        if (index > -1) {
            const { id, type, direction, ratio, x, y, angle } = track.tiles[index];
            dispatch('click', { id, type, direction, ratio, x, y, angle });
        }
    }

    /**
     * Registers the tile models from the list.
     * @param {import('../../tile/models/TileCoordList.js').listCoord} list
     * @private
     */
    function registerModels(list) {
        const models = [];
        const registry = new Set();

        list.tiles.forEach(tile => {
            const { modelId } = tile.model;
            if (registry.has(modelId)) {
                return;
            }
            registry.add(modelId);

            const { model } = tile;
            models.push(model.clone().setDirection(TILE_DIRECTION_RIGHT));
        });

        return models;
    }

    $: track = $list;
    $: models = registerModels(track);
</script>

<Sketch
    {x}
    {y}
    {width}
    {height}
    viewX={track.x}
    viewY={track.y}
    viewWidth={track.width}
    viewHeight={track.height}
    on:click={click}
>
    {#each track.tiles as { id, x, y, angle, model } (id)}
        <use data-id={id} {x} {y} href="#{model.modelId}" transform={model.getRotateTransform(x, y, angle)} />
    {/each}
    <svelte:fragment slot="defs">
        {#each models as { id, type, ratio } (id)}
            <Tile {type} {ratio} {id} />
        {/each}
        <slot name="defs" />
    </svelte:fragment>
    <slot />
</Sketch>
