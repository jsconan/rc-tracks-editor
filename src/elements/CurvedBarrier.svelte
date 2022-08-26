<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { alternateBarrierColor } from '../helpers/colors.js';
    import CurvedElement from './CurvedElement.svelte';

    export let chunks;
    export let width;
    export let angle;
    export let radius;
    export let left = 0;
    export let top = 0;
    export let shift = 0;

    const chunkAngle = angle / chunks;
    const cx = left - radius;
    const cy = top;

    function* segments() {
        for (let i = 0; i < chunks; i++) {
            const color = alternateBarrierColor(i + shift);
            const start = chunkAngle * i;

            yield { color, start };
        }
    }
</script>

<g class="barrier curved-barrier">
    {#each [...segments()] as { color, start }}
        <CurvedElement class="barrier-chunk {color}" {cx} {cy} {width} {radius} angle={chunkAngle} {start} />
    {/each}
</g>
