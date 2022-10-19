<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { setContext } from 'svelte';

    export let contextKey = '';
    export let context = null;
    export let props = {};
    export let component;

    if (contextKey) {
        setContext(contextKey, context);
    }
</script>

<svelte:component this={component} on:click on:keypress on:mouseenter on:mouseleave {...props} />
