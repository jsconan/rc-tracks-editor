<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import Sketch from '../Sketch.svelte';
</script>

<Sketch>
    <rect x={10} y={10} width={100} height={50} />
    <circle id="circle" slot="defs" cx={5} cy={5} r={10} />
</Sketch>
