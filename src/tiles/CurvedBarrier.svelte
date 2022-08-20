<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import CurvedElement from './CurvedElement.svelte';

    export let chunks;
    export let width;
    export let angle;
    export let radius;
    export let left = 0;
    export let top = 0;
    export let shift = 0;

    const colors = ['even', 'odd'];
    const chunkAngle = angle / chunks;
    const curveX = left - radius;
    const curveY = top;

    function* segments() {
        for (let i = 0; i < chunks; i++) {
            const color = colors[(i + shift) % 2];
            const start = chunkAngle * i;

            yield { color, start };
        }
    }
</script>

<g class="barrier curved-barrier">
    {#each [...segments()] as { color, start }}
        <CurvedElement
            class="barrier-chunk {color}"
            cx={curveX}
            cy={curveY}
            {width}
            {radius}
            angle={chunkAngle}
            {start}
        />
    {/each}
</g>
