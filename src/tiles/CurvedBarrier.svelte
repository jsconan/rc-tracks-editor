<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { cos, sin } from '../helpers/maths.js';

    export let chunks;
    export let width;
    export let angle;
    export let radius;
    export let left = 0;
    export let top = 0;
    export let shift = 0;

    const colors = ['even', 'odd'];
    const chunkAngle = angle / chunks;
    const curveRadius = radius;
    const curveX = left - radius;
    const curveY = top;

    function* segments() {
        const r1 = curveRadius;
        const r2 = r1 + width;
        for (let i = 0; i < chunks; i++) {
            const color = colors[(i + shift) % 2];
            const a1 = chunkAngle * i;
            const a2 = a1 + chunkAngle;

            const x1 = curveX + cos(a1) * r1;
            const y1 = curveY + sin(a1) * r1;
            const x2 = curveX + cos(a2) * r1;
            const y2 = curveY + sin(a2) * r1;

            const x3 = curveX + cos(a2) * r2;
            const y3 = curveY + sin(a2) * r2;
            const x4 = curveX + cos(a1) * r2;
            const y4 = curveY + sin(a1) * r2;

            yield { color, r1, r2, x1, y1, x2, y2, x3, y3, x4, y4 };
        }
    }
</script>

<g class="barrier curved-barrier">
    {#each [...segments()] as { color, r1, r2, x1, y1, x2, y2, x3, y3, x4, y4 }}
        <path
            class="barrier-chunk {color}"
            d="M {x1} {y1}
               A {r1} {r1} 0 0 1 {x2} {y2}
               L {x3} {y3}
               A {r2} {r2} 0 0 0 {x4} {y4}"
        />
    {/each}
</g>
