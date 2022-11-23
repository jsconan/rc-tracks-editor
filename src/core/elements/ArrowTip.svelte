<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { arrowTipPath } from '../fragments';
    import Shape from './Shape.svelte';

    export let cx = 0;
    export let cy = 0;
    export let rotation = 0;
    export let width = 1;
    export let height = 1;
    export let fill = void 0;
    export let stroke = void 0;
    export let transform = void 0;
</script>

<Shape path={arrowTipPath(cx, cy, width, height, rotation)} {fill} {stroke} {transform} />
