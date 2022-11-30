<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { getContext } from 'svelte';
    import { getArcAngle, RIGHT_ANGLE } from '../../core/helpers';
    import {
        CURVED_TILE_ENLARGED_TYPE,
        CURVED_TILE_TYPE,
        STRAIGHT_TILE_TYPE,
        TILE_DIRECTION_LEFT,
        TILE_DIRECTION_RIGHT
    } from '../helpers';
    import { TileList } from '../models';
    import { TileSpecifications } from '../config';
    import { CurvedArrow, StraightArrow } from '../../core/elements';

    export let type = STRAIGHT_TILE_TYPE;
    export let direction = TILE_DIRECTION_RIGHT;
    export let ratio = 1;
    export let rotation = 0;
    export let x = 0;
    export let y = 0;
    export let fill = void 0;
    export let stroke = void 0;

    const specs = getContext(TileSpecifications.CONTEXT_ID);

    function straightTile(model, x, y) {
        const height = specs.height;
        const width = specs.width;

        const component = StraightArrow;
        const parameters = {
            cx: x,
            cy: y + height / 2,
            width: width / 2,
            height: width / 4,
            rotation: RIGHT_ANGLE + model.getDirectionAngle()
        };

        return { component, parameters };
    }

    function curvedTile(model, x, y) {
        const width = specs.width;

        const curveAngle = model.getCurveAngle();
        const curveCenter = model.getCurveCenter(x, y);
        const curveRadius = model.getInnerRadius() + width / 2;
        const angle = getArcAngle(width / 2, curveRadius);

        const component = CurvedArrow;
        const parameters = {
            cx: curveCenter.x,
            cy: curveCenter.y,
            width: width / 2,
            height: width / 4,
            radius: curveRadius,
            angle: angle,
            rotation: (curveAngle - angle) / 2,
            clockwise: model.direction !== TILE_DIRECTION_LEFT
        };
        return { component, parameters };
    }

    const componentsMap = {
        [STRAIGHT_TILE_TYPE]: straightTile,
        [CURVED_TILE_TYPE]: curvedTile,
        [CURVED_TILE_ENLARGED_TYPE]: curvedTile
    };

    $: model = TileList.createTile(specs, type, direction, ratio);
    $: transform = model.getRotateTransform(x, y, rotation);
    $: shape = componentsMap[type](model, x, y);
</script>

<svelte:component this={shape.component} {...shape.parameters} {fill} {stroke} {transform} />
