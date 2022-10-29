<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { onMount, setContext } from 'svelte';

    export let contextKey = '';
    export let context = null;
    export let props = {};
    export let component;
    export let resolve = null;

    let instance;

    onMount(() => {
        if ('function' === typeof resolve) {
            resolve(instance);
        }
    });

    if (contextKey) {
        setContext(contextKey, context);
    }
</script>

<svelte:component this={component} bind:this={instance} on:click on:keypress on:mouseenter on:mouseleave {...props} />
