<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { Shape } from '../../core/elements';
    import { SVGPath, Vector2D } from '../../core/models';

    export let cx = 0;
    export let cy = 0;
    export let width = 1;
    export let side = 1;
    export let radius = 1;
    export let d = 0;
    export let fill = void 0;
    export let stroke = void 0;
    export let transform = void 0;

    /**
     * Builds the SVG path for rendering a curve.
     * @param {number} innerRadius - The radius of the inner curve.
     * @param {number} curveWidth - The width between the inner and the outer curve.
     * @param {number} curveSide - Tha length of the curve side.
     * @param {number} centerX - The X-coordinate of the center of the curve.
     * @param {number} centerY - The Y-coordinate of the center of the curve.
     * @param {number} addition - An additional distance added to the outline.
     * @returns {SVGPath} - Returns the path for the curve.
     * @private
     */
    function curvedElementPath(innerRadius, curveWidth, curveSide, centerX, centerY, addition) {
        addition = Math.min(addition, innerRadius);

        const outerRadius = innerRadius + curveWidth - curveSide + addition;
        const center = new Vector2D(centerX, centerY).subScalar(addition);

        return new SVGPath()
            .moveTo(center.addScalarX(innerRadius))
            .ellipticalArcCurveTo(innerRadius, 0, 0, 1, center.addScalarY(innerRadius))
            .verticalLineBy(curveWidth + addition * 2)
            .horizontalLineBy(curveSide + addition)
            .ellipticalArcCurveBy(outerRadius, 0, 0, 0, new Vector2D(outerRadius, -outerRadius))
            .verticalLineBy(-curveSide - addition)
            .close();
    }
</script>

<Shape path={curvedElementPath(radius, width, side, cx, cy, d)} {fill} {stroke} {transform} />
