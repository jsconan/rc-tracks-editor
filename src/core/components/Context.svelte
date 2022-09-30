<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { setContext } from 'svelte';

    export let contextKey;
    export let context;
    export let component;
    export let props = {};

    setContext(contextKey, context);
</script>

<svelte:component this={component} on:click {...props} />
