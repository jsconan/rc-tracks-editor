<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getTileStyleBarrier } from '../helpers';
    import CurvedElement from './CurvedElement.svelte';

    export let chunks;
    export let width;
    export let angle;
    export let radius;
    export let left = 0;
    export let top = 0;
    export let shift = 0;

    /**
     * Computes the coordinates of each curve segment.
     * @param {number} centerX - The X-coordinate of the center of the curve.
     * @param {number} centerY - The Y-coordinate of the center of the curve.
     * @param {number} curveChunks - The number of curve segments.
     * @param {number} curveAngle - The angle of the curve.
     * @param {number} curveRadius - The radius of the curve.
     * @param {number} colorShift - A shift applied to the alternate colors.
     * @private
     */
    function curvedSegments(centerX, centerY, curveChunks, curveAngle, curveRadius, colorShift) {
        const chunkAngle = curveAngle / curveChunks;
        const cx = centerX - curveRadius;
        const cy = centerY;
        const segments = [];

        for (let i = 0; i < curveChunks; i++) {
            const color = getTileStyleBarrier(i + colorShift);
            const start = chunkAngle * i;

            segments.push({ cx, cy, chunkAngle, start, color, i });
        }

        return segments;
    }

    $: segments = curvedSegments(left, top, chunks, angle, radius, shift);
</script>

<g class="barrier curved-barrier">
    {#each segments as { cx, cy, chunkAngle, start, color, i } (i)}
        <CurvedElement {cx} {cy} {width} {radius} angle={chunkAngle} {start} {...color} />
    {/each}
</g>
