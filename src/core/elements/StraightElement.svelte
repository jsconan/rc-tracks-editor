<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { attributeList } from '../helpers';

    export let x = 0;
    export let y = 0;
    export let width = 1;
    export let height = 1;
    export let d = 0;
    export let fill = void 0;
    export let stroke = void 0;
    export let transform = void 0;
</script>

<rect
    x={x - d}
    y={y - d}
    width={width + d * 2}
    height={height + d * 2}
    {...attributeList(fill, 'fill')}
    {...attributeList(stroke, 'stroke')}
    {transform}
/>
