<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { Vector2D } from '../../core/models';
    import { arcTo, lineTo, moveTo } from '../../core/helpers';

    export let cx = 0;
    export let cy = 0;
    export let width = 1;
    export let side = 1;
    export let radius = 1;
    export let d = 0;
    export let fill = void 0;
    export let stroke = void 0;
    export let strokeWidth = void 0;
    export let transform = void 0;

    /**
     * Builds the SVG path for rendering a curve.
     * @param {number} innerRadius - The radius of the inner curve.
     * @param {number} curveWidth - The width between the inner and the outer curve.
     * @param {number} curveSide - Tha length of the curve side.
     * @param {number} centerX - The X-coordinate of the center of the curve.
     * @param {number} centerY - The Y-coordinate of the center of the curve.
     * @param {number} addition - An additional distance added to the outline.
     * @private
     */
    function curvedElementPath(innerRadius, curveWidth, curveSide, centerX, centerY, addition) {
        addition = Math.min(addition, innerRadius);

        const outerRadius = innerRadius + curveWidth - curveSide + addition;
        const center = new Vector2D(centerX, centerY).subScalar(addition);

        const p1 = center.addScalarX(innerRadius);
        const p2 = center.addScalarY(innerRadius);
        const p3 = p2.addScalarY(curveWidth + addition * 2);
        const p4 = p3.addScalarX(curveSide + addition);
        const p5 = p4.addCoord(outerRadius, -outerRadius);
        const p6 = p5.subScalarY(curveSide + addition);

        const innerCurve = arcTo(innerRadius, p2, 0, 1, 0);
        const outerCurve = arcTo(outerRadius, p5, 0, 0, 0);

        return `${moveTo(p1)} ${innerCurve} ${lineTo(p3)} ${lineTo(p4)} ${outerCurve} ${lineTo(p6)} Z`;
    }

    $: path = curvedElementPath(radius, width, side, cx, cy, d);
</script>

<path d={path} {fill} {stroke} stroke-width={strokeWidth} {transform} />
