<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    export let model;
    export let angle = 0;
    export let x = 0;
    export let y = 0;
    export let r = 5;

    const input = model.getInputCoord(x, y);
    const output = model.getOutputCoord(x, y, angle);
    const center = model.getCenterCoord(x, y, angle);
</script>

<g class="control">
    <circle class="point" cx={center.x} cy={center.y} {r} />
    <circle class="point" cx={input.x} cy={input.y} {r} />
    <circle class="point" cx={output.x} cy={output.y} {r} />
</g>
