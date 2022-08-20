<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { alternateBarrierColor } from '../helpers/colors';
    import StraightElement from './StraightElement.svelte';

    export let chunks;
    export let width;
    export let length;
    export let left = 0;
    export let top = 0;
    export let shift = 0;
    export let vertical = false;

    function* segments() {
        for (let i = 0; i < chunks; i++) {
            const color = alternateBarrierColor(i + shift);
            const d = i * length;

            const x = vertical ? left : left + d;
            const y = vertical ? top + d : top;
            const w = vertical ? width : length;
            const h = vertical ? length : width;

            yield { color, x, y, w, h };
        }
    }
</script>

<g class="barrier straight-barrier">
    {#each [...segments()] as { color, x, y, w, h }}
        <StraightElement class="barrier-chunk {color}" {x} {y} width={w} height={h} />
    {/each}
</g>
