<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { onMount, setContext } from 'svelte';

    export let component;
    export let context = null;
    export let props = {};
    export let resolve = null;

    let instance;

    onMount(() => {
        if ('function' === typeof resolve) {
            resolve(instance);
        }
    });

    if (context) {
        Object.keys(context).forEach(key => {
            setContext(key, context[key]);
        });
    }
</script>

<svelte:component this={component} bind:this={instance} {...props} />
