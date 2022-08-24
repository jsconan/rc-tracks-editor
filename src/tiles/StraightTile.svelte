<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import StraightBarrier from '../elements/StraightBarrier.svelte';
    import StraightElement from '../elements/StraightElement.svelte';
    import { Tile } from '../models/tile.js';

    export let barrierChunks;
    export let barrierWidth;
    export let tileLength;
    export let tileWidth;
    export let tileRatio = 1;
    export let rotation = 0;
    export let tileX = 0;
    export let tileY = 0;
    export let filter;

    const tile = new Tile(tileLength, tileWidth, tileRatio, Tile.TYPE_STRAIGHT);
    const width = tile.getWidth();
    const height = tile.getLength();
    const padding = tile.getPadding();
    const chunks = tile.getSideBarrierChunks(barrierChunks);
    const barrierLength = tileLength / barrierChunks;
    const laneWidth = tileWidth - barrierWidth;

    const x = tileX - tileLength / 2 + padding;
    const y = tileY;
    const x1 = x;
    const y1 = y;
    const x2 = x + laneWidth;
    const y2 = y;
    const vertical = true;

    const input = tile.getInputCoord(tileX, tileY);
    const output = tile.getOutputCoord(tileX, tileY, rotation);
    const centerR = tile.getCenterCoord(tileX, tileY, rotation);
</script>

<g class="tile straight-tile" transform="rotate({rotation} {tileX} {tileY})" {filter}>
    <StraightElement class="ground" {x} {y} {width} {height} />
    <StraightBarrier {chunks} width={barrierWidth} length={barrierLength} left={x1} top={y1} shift={0} {vertical} />
    <StraightBarrier {chunks} width={barrierWidth} length={barrierLength} left={x2} top={y2} shift={1} {vertical} />
</g>

<circle class="control" cx={centerR.x} cy={centerR.y} r="4" />
<circle class="control" cx={input.x} cy={input.y} r="4" />
<circle class="control" cx={output.x} cy={output.y} r="4" />
