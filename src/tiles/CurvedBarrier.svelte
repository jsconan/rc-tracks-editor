<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { cos, sin } from '../helpers/maths.js';

    export let barrierChunks;
    export let barrierWidth;
    export let curveAngle;
    export let curveRadius;
    export let x = 0;
    export let y = 0;
    export let shift = 0;
    export let inner = false;

    const colors = ['even', 'odd'];
    const halfBarrier = (barrierWidth / 2) * (inner ? 1 : -1);
    const chunkAngle = curveAngle / barrierChunks;
    const radius = curveRadius + halfBarrier;

    function* chunks() {
        for (let i = 0; i < barrierChunks; i++) {
            const color = colors[(i + shift) % 2];
            const a1 = chunkAngle * i;
            const a2 = a1 + chunkAngle;

            const x1 = x + cos(a1) * radius;
            const y1 = y + sin(a1) * radius;
            const x2 = x + cos(a2) * radius;
            const y2 = y + sin(a2) * radius;

            yield { color, x1, y1, x2, y2 };
        }
    }
</script>

<g class="barrier curved-barrier">
    {#each [...chunks()] as { color, x1, y1, x2, y2 }}
        <path
            class="barrier-chunk {color}"
            stroke-width={barrierWidth}
            d="M {x1} {y1} A {radius} {radius} 0 0 1 {x2} {y2}"
        />
    {/each}
</g>
