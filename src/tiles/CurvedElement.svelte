<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { cos, sin } from '../helpers/maths.js';

    let cls = void 0;
    export { cls as class };
    export let style = void 0;
    export let cx = 0;
    export let cy = 0;
    export let width = 1;
    export let radius = 1;
    export let angle = 1;
    export let start = 0;

    const r1 = radius;
    const r2 = r1 + width;
    const a1 = start;
    const a2 = start + angle;

    const x1 = cx + cos(a1) * r1;
    const y1 = cy + sin(a1) * r1;
    const x2 = cx + cos(a2) * r1;
    const y2 = cy + sin(a2) * r1;

    const x3 = cx + cos(a2) * r2;
    const y3 = cy + sin(a2) * r2;
    const x4 = cx + cos(a1) * r2;
    const y4 = cy + sin(a1) * r2;
</script>

<path
    class={cls}
    {style}
    d="M {x1} {y1}
       A {r1} {r1} 0 0 1 {x2} {y2}
       L {x3} {y3}
       A {r2} {r2} 0 0 0 {x4} {y4}"
/>
