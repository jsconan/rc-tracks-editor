<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { cos, sin } from '../helpers/maths.js';

    export let chunks;
    export let width;
    export let angle;
    export let radius;
    export let x = 0;
    export let y = 0;
    export let shift = 0;

    const colors = ['even', 'odd'];
    const halfBarrier = width / 2;
    const chunkAngle = angle / chunks;
    const curveRadius = radius + halfBarrier;
    const curveX = x - radius;
    const curveY = y;

    function* segments() {
        for (let i = 0; i < chunks; i++) {
            const color = colors[(i + shift) % 2];
            const a1 = chunkAngle * i;
            const a2 = a1 + chunkAngle;

            const x1 = curveX + cos(a1) * curveRadius;
            const y1 = curveY + sin(a1) * curveRadius;
            const x2 = curveX + cos(a2) * curveRadius;
            const y2 = curveY + sin(a2) * curveRadius;

            yield { color, x1, y1, x2, y2 };
        }
    }
</script>

<g class="barrier curved-barrier">
    {#each [...segments()] as { color, x1, y1, x2, y2 }}
        <path
            class="barrier-chunk {color}"
            stroke-width={width}
            d="M {x1} {y1} A {curveRadius} {curveRadius} 0 0 1 {x2} {y2}"
        />
    {/each}
</g>
