<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { defined } from '../../core/helpers';

    export let x = void 0;
    export let y = void 0;
    export let width = void 0;
    export let height = void 0;
    export let viewX = 0;
    export let viewY = 0;
    export let viewWidth = void 0;
    export let viewHeight = void 0;

    const hasViewBox = () =>
        (defined(viewWidth) || Number.isFinite(width)) && (defined(viewHeight) || Number.isFinite(height));

    $: viewBox = hasViewBox() ? `${viewX} ${viewY} ${viewWidth || width} ${viewHeight || height}` : void 0;
</script>

<svg {x} {y} {viewBox} {width} {height}>
    <defs>
        <slot name="defs" />
    </defs>
    <slot />
</svg>
