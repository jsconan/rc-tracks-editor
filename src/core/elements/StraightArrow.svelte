<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { attributeList } from '../helpers';
    import { Polygon2D, SVGPath, Vector2D } from '../models';

    export let x = 0;
    export let y = 0;
    export let width = 1;
    export let height = 1;
    export let thickness = void 0;
    export let angle = 0;
    export let fill = void 0;
    export let stroke = void 0;
    export let transform = void 0;

    /**
     * Builds the SVG path for rendering a straight arrow.
     * @param {number} centerX - The X-coordinate of the center of the arrow.
     * @param {number} centerY - The Y-coordinate of the center of the arrow.
     * @param {number} arrowWidth - The width of the arrow.
     * @param {number} arrowHeight - The height of the arrow.
     * @param {number} arrowThickness - The thickness of the arrow.
     * @param {number} rotation - The rotation angle.
     */
    function straightArrowPath(centerX, centerY, arrowWidth, arrowHeight, arrowThickness, rotation) {
        const halfH = arrowWidth / 2;
        const halfV = arrowHeight / 2;
        const halfB = arrowThickness / 2;
        const arrowStart = halfH - arrowHeight;
        const center = new Vector2D(centerX, centerY);

        const polygon = new Polygon2D([
            new Vector2D(-halfH, halfB),
            new Vector2D(arrowStart, halfB),
            new Vector2D(arrowStart, halfV),
            new Vector2D(halfH, 0),
            new Vector2D(arrowStart, -halfV),
            new Vector2D(arrowStart, -halfB),
            new Vector2D(-halfH, -halfB)
        ]);
        polygon.rotate(rotation).move(center);
        return SVGPath.fromPolygon(polygon).toString();
    }

    $: if ('undefined' === typeof thickness) {
        thickness = height / 3;
    }
</script>

<path
    d={straightArrowPath(x, y, width, height, thickness, angle)}
    {...attributeList(fill, 'fill')}
    {...attributeList(stroke, 'stroke')}
    {transform}
/>
