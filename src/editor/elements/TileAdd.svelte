<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getContext } from 'svelte';
    import { crossPath } from '../../core/fragments';
    import { Shape } from '../../core/elements/';
    import { STRAIGHT_TILE_TYPE, TILE_DIRECTION_RIGHT } from '../../tile/helpers';
    import { TileList } from '../../tile/models';
    import { TileSpecifications } from '../../tile/config';

    export let type = STRAIGHT_TILE_TYPE;
    export let direction = TILE_DIRECTION_RIGHT;
    export let ratio = 1;
    export let rotation = 0;
    export let x = 0;
    export let y = 0;
    export let fill = void 0;
    export let stroke = void 0;

    const specs = getContext(TileSpecifications.CONTEXT_ID);

    function getPath(tileX, tileY, tileType, tileDirection, tileRatio, tileAngle) {
        const model = TileList.createTile(specs, tileType, tileDirection, tileRatio);
        const crossWidth = model.height / 4;
        const crossThickness = crossWidth / 4;

        const { x: cx, y: cy } = model.getOutputCoord(tileX, tileY, tileAngle);
        const angle = model.getOutputAngle(tileAngle);

        return crossPath(cx, cy, crossWidth, crossWidth, crossThickness, angle);
    }

    $: path = getPath(x, y, type, direction, ratio, rotation);
</script>

<Shape {path} {fill} {stroke} />
