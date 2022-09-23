<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    export let list;
    export let component;
</script>

<svelte:component this={component} {list}>
    <rect x={10} y={10} width={100} height={50} />
    <circle id="circle" cx={10} cy={10} r={10} slot="defs" />
</svelte:component>
