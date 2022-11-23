<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { curvedElementEnlargedPath } from '../../core/fragments';
    import { Shape } from '../../core/elements';

    export let cx = 0;
    export let cy = 0;
    export let width = 1;
    export let side = 1;
    export let radius = 1;
    export let d = 0;
    export let fill = void 0;
    export let stroke = void 0;
    export let transform = void 0;
</script>

<Shape path={curvedElementEnlargedPath(cx, cy, width, radius, side, d)} {fill} {stroke} {transform} />
