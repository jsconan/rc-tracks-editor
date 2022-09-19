<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { buildTrack } from '../builders';
    import { Sketch } from '../elements';
    import { TileCoordList, TilesList } from '../models';
    import Tile from './Tile.svelte';

    export let list;
    export let x = 0;
    export let y = 0;
    export let width = void 0;
    export let height = void 0;

    if (!(list instanceof TilesList) && !(list instanceof TileCoordList)) {
        throw 'The list must be either an instance of TilesList or TileCoordList!';
    }

    $: track = list instanceof TilesList ? buildTrack($list) : $list;
</script>

<Sketch {x} {y} {width} {height} viewX={track.x} viewY={track.y} viewWidth={track.width} viewHeight={track.height}>
    {#each track.tiles as { id, type, direction, ratio, x, y, angle } (id)}
        <Tile {type} {direction} {ratio} {angle} {x} {y} {id} on:click />
    {/each}
</Sketch>
