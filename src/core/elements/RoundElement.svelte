<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { roundElementPath } from '../fragments';
    import Shape from './Shape.svelte';

    export let cx = 0;
    export let cy = 0;
    export let radius = 1;
    export let d = 0;
    export let fill = void 0;
    export let stroke = void 0;
    export let transform = void 0;
</script>

<Shape path={roundElementPath(cx, cy, radius, d)} {fill} {stroke} {transform} />
