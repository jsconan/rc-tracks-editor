<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { straightElementPath } from '../fragments';
    import Shape from './Shape.svelte';

    export let x = 0;
    export let y = 0;
    export let width = 1;
    export let height = 1;
    export let d = 0;
    export let fill = void 0;
    export let stroke = void 0;
    export let transform = void 0;
</script>

<Shape path={straightElementPath(x, y, width, height, d)} {fill} {stroke} {transform} />
