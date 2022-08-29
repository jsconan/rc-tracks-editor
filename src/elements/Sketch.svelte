<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import defined from '../helpers/defined.js';

    export let x = 0;
    export let y = 0;
    export let viewWidth = void 0;
    export let viewHeight = void 0;
    export let width = void 0;
    export let height = void 0;

    const hasViewBox = () =>
        (defined(viewWidth) || Number.isFinite(width)) && (defined(viewHeight) || Number.isFinite(height));

    $: viewBox = hasViewBox() ? `${x} ${y} ${viewWidth || width} ${viewHeight || height}` : void 0;
</script>

<svg {viewBox} {width} {height}>
    <defs>
        <slot name="defs" />
    </defs>
    <slot />
</svg>
