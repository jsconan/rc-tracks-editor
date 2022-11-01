<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getTileStyleBarrier } from '../helpers';
    import StraightElement from './StraightElement.svelte';

    export let chunks;
    export let width;
    export let length;
    export let left = 0;
    export let top = 0;
    export let shift = 0;
    export let vertical = false;

    /**
     * Computes the coordinates of each segment.
     * @param {number} startX - The X-coordinate of the center of the curve.
     * @param {number} startY - The Y-coordinate of the center of the curve.
     * @param {number} chunkCount - The number of segments.
     * @param {number} chunkWidth - The width of a segment.
     * @param {number} chunkLength - The length of a segment.
     * @param {number} colorShift - A shift applied to the alternate colors.
     * @param {boolean} verticalSegment - Is the segment vertical or horizontal?
     * @private
     */
    function straightSegments(startX, startY, chunkCount, chunkWidth, chunkLength, colorShift, verticalSegment) {
        const segments = [];

        for (let i = 0; i < chunkCount; i++) {
            const color = getTileStyleBarrier(i + colorShift);
            const d = i * chunkLength;

            const x = verticalSegment ? startX : startX + d;
            const y = verticalSegment ? startY + d : startY;
            const w = verticalSegment ? chunkWidth : chunkLength;
            const h = verticalSegment ? chunkLength : chunkWidth;

            segments.push({ x, y, w, h, color, i });
        }

        return segments;
    }

    $: segments = straightSegments(left, top, chunks, width, length, shift, vertical);
</script>

<g class="barrier straight-barrier">
    {#each segments as { x, y, w, h, color, i } (i)}
        <StraightElement {x} {y} width={w} height={h} {...color} />
    {/each}
</g>
