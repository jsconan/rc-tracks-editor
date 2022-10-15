<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getContext } from 'svelte';

    export let param = 'default';

    const context = getContext('foo') || 'none';
</script>

<div on:click on:keypress>
    <dl>
        <dt>param</dt>
        <dd>{param}</dd>

        <dt>context</dt>
        <dd>{context}</dd>
    </dl>
</div>
