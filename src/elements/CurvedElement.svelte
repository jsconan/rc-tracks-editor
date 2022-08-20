<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getPoint } from '../helpers/point';
    import { polar } from '../helpers/polar';

    let cls = void 0;
    export { cls as class };
    export let style = void 0;
    export let cx = 0;
    export let cy = 0;
    export let width = 1;
    export let radius = 1;
    export let angle = 1;
    export let start = 0;

    const innerRadius = radius;
    const outerRadius = radius + width;
    const end = start + angle;
    const center = getPoint(cx, cy);

    const p1 = polar(innerRadius, start, center);
    const p2 = polar(innerRadius, end, center);
    const p3 = polar(outerRadius, end, center);
    const p4 = polar(outerRadius, start, center);
</script>

<path
    class={cls}
    {style}
    d="M {p1.x} {p1.y}
       A {innerRadius} {innerRadius} 0 0 1 {p2.x} {p2.y}
       L {p3.x} {p3.y}
       A {outerRadius} {outerRadius} 0 0 0 {p4.x} {p4.y}"
/>
