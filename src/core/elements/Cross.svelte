<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { crossPath } from '../fragments';
    import Shape from './Shape.svelte';

    export let cx = 0;
    export let cy = 0;
    export let rotation = 0;
    export let width = 1;
    export let height = 1;
    export let thickness = void 0;
    export let fill = void 0;
    export let stroke = void 0;
    export let transform = void 0;
</script>

<Shape path={crossPath(cx, cy, width, height, thickness, rotation)} {fill} {stroke} {transform} />
