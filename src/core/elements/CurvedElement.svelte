<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { curvedElementPath } from '../fragments';
    import Shape from './Shape.svelte';

    export let cx = 0;
    export let cy = 0;
    export let width = 1;
    export let radius = 1;
    export let angle = 1;
    export let start = 0;
    export let d = 0;
    export let fill = void 0;
    export let stroke = void 0;
    export let transform = void 0;
</script>

<Shape path={curvedElementPath(cx, cy, width, radius, angle, start, d)} {fill} {stroke} {transform} />
