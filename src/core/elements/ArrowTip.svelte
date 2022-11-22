<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { Polygon2D, SVGPath, Vector2D } from '../models';
    import Shape from './Shape.svelte';

    export let cx = 0;
    export let cy = 0;
    export let rotation = 0;
    export let width = 1;
    export let height = 1;
    export let fill = void 0;
    export let stroke = void 0;
    export let transform = void 0;

    /**
     * Builds the SVG path for rendering an arrow tip.
     * @param {number} centerX - The X-coordinate of the center of the arrow.
     * @param {number} centerY - The Y-coordinate of the center of the arrow.
     * @param {number} arrowWidth - The width of the arrow.
     * @param {number} arrowHeight - The height of the arrow.
     * @param {number} rotationAngle - The rotation angle.
     * @returns {SVGPath} - Returns the path for the shape.
     */
    function arrowElementPath(centerX, centerY, arrowWidth, arrowHeight, rotationAngle) {
        const sideH = arrowWidth / 2;
        const sideV = arrowHeight / 2;
        const center = new Vector2D(centerX, centerY);

        const polygon = new Polygon2D([
            new Vector2D(-sideH / 2, 0),
            new Vector2D(-sideH, -sideV),
            new Vector2D(sideH, 0),
            new Vector2D(-sideH, sideV)
        ]);
        polygon.rotate(rotationAngle).move(center);
        return SVGPath.fromPolygon(polygon);
    }
</script>

<Shape path={arrowElementPath(cx, cy, width, height, rotation)} {fill} {stroke} {transform} />
