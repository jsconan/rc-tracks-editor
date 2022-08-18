<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    export let barrierChunks;
    export let barrierWidth;
    export let barrierLength;
    export let x = 0;
    export let y = 0;
    export let shift = 0;
    export let vertical = false;

    const colors = ['even', 'odd'];
    const halfBarrier = barrierWidth / 2;

    function* chunks() {
        for (let i = 0; i < barrierChunks; i++) {
            const color = colors[(i + shift) % 2];
            const a = i * barrierLength;
            const b = a + barrierLength;

            const x1 = vertical ? x + halfBarrier : x + a;
            const y1 = vertical ? y + a : y + halfBarrier;
            const x2 = vertical ? x + halfBarrier : x + b;
            const y2 = vertical ? y + b : y + halfBarrier;

            yield { color, x1, y1, x2, y2 };
        }
    }
</script>

<g class="barrier straight-barrier">
    {#each [...chunks()] as { color, x1, y1, x2, y2 }}
        <line class="barrier-chunk {color}" {x1} {y1} {x2} {y2} stroke-width={barrierWidth} />
    {/each}
</g>
