<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { attributeList } from '../helpers';

    export let path;
    export let fill = void 0;
    export let stroke = void 0;
    export let transform = void 0;
</script>

<path d={path} {...attributeList(fill, 'fill')} {...attributeList(stroke, 'stroke')} {transform} />
