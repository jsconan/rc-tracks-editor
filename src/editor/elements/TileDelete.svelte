<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getContext } from 'svelte';
    import { crossPath, roundElementPath } from '../../core/fragments';
    import { RIGHT_ANGLE } from '../../core/helpers';
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
        const width = model.height / 4;
        const radius = width / 2;
        const crossWidth = (width * 70) / 100;
        const crossThickness = (width * 20) / 100;
        const crossAngle = tileAngle + RIGHT_ANGLE / 2;

        const roundElement = roundElementPath(tileX, tileY, radius);
        const crossElement = crossPath(tileX, tileY, crossWidth, crossWidth, crossThickness, crossAngle);

        return `${roundElement} ${crossElement}`;
    }

    $: path = getPath(x, y, type, direction, ratio, rotation);
</script>

<Shape {path} {fill} {stroke} />
