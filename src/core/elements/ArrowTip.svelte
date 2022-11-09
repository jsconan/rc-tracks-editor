<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { attributeList, pathLine } from '../helpers';
    import { Vector2D } from '../models';

    export let x = 0;
    export let y = 0;
    export let width = 1;
    export let height = 1;
    export let angle = 0;
    export let fill = void 0;
    export let stroke = void 0;
    export let transform = void 0;

    /**
     * Builds the SVG path for rendering an arrow tip.
     * @param {number} centerX - The X-coordinate of the center of the arrow.
     * @param {number} centerY - The Y-coordinate of the center of the arrow.
     * @param {number} arrowWidth - The width of the arrow.
     * @param {number} arrowHeight - The height of the arrow.
     * @param {number} rotation - The rotation angle.
     */
    function arrowElementPath(centerX, centerY, arrowWidth, arrowHeight, rotation) {
        const sideH = arrowWidth / 2;
        const sideV = arrowHeight / 2;
        const center = new Vector2D(centerX, centerY);

        const points = [
            new Vector2D(-sideH / 2, 0).rotate(rotation).add(center),
            new Vector2D(-sideH, -sideV).rotate(rotation).add(center),
            new Vector2D(sideH, 0).rotate(rotation).add(center),
            new Vector2D(-sideH, sideV).rotate(rotation).add(center)
        ];

        return pathLine(points);
    }
</script>

<path
    d={arrowElementPath(x, y, width, height, angle)}
    {...attributeList(fill, 'fill')}
    {...attributeList(stroke, 'stroke')}
    {transform}
/>
