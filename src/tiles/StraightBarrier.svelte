<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    export let chunks;
    export let width;
    export let length;
    export let x = 0;
    export let y = 0;
    export let shift = 0;
    export let vertical = false;

    const colors = ['even', 'odd'];
    const halfBarrier = width / 2;

    function* segments() {
        for (let i = 0; i < chunks; i++) {
            const color = colors[(i + shift) % 2];
            const a = i * length;
            const b = a + length;

            const x1 = vertical ? x + halfBarrier : x + a;
            const y1 = vertical ? y + a : y + halfBarrier;
            const x2 = vertical ? x + halfBarrier : x + b;
            const y2 = vertical ? y + b : y + halfBarrier;

            yield { color, x1, y1, x2, y2 };
        }
    }
</script>

<g class="barrier straight-barrier">
    {#each [...segments()] as { color, x1, y1, x2, y2 }}
        <line class="barrier-chunk {color}" {x1} {y1} {x2} {y2} stroke-width={width} />
    {/each}
</g>
