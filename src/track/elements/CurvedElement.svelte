<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { Vector2D } from '../../core/models';

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
    const center = new Vector2D(cx, cy);

    const p1 = Vector2D.polar(innerRadius, start, center);
    const p2 = Vector2D.polar(innerRadius, end, center);
    const p3 = Vector2D.polar(outerRadius, end, center);
    const p4 = Vector2D.polar(outerRadius, start, center);
</script>

<path
    class={cls}
    {style}
    d="M {p1.x} {p1.y}
       A {innerRadius} {innerRadius} 0 0 1 {p2.x} {p2.y}
       L {p3.x} {p3.y}
       A {outerRadius} {outerRadius} 0 0 0 {p4.x} {p4.y}
       Z"
/>
