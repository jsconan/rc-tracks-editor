<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { TileModel } from '../models/TileModel';

    export let model;
    export let angle = 0;
    export let x = 0;
    export let y = 0;
    export let r = 5;

    if (!(model instanceof TileModel)) {
        throw new TypeError('The model must be an instance of TileModel!');
    }

    const output = model.getOutputCoord(x, y, angle);
    const center = model.getCenterCoord(x, y, angle);
</script>

<g class="control">
    <circle class="point" cx={x} cy={y} {r} />
    <circle class="point" cx={center.x} cy={center.y} {r} />
    <circle class="point" cx={output.x} cy={output.y} {r} />
</g>
