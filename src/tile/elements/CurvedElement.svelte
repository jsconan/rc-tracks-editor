<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { Vector2D } from '../../core/models';
    import { arcTo, lineTo, moveTo } from '../../core/helpers';

    export let cx = 0;
    export let cy = 0;
    export let width = 1;
    export let radius = 1;
    export let angle = 1;
    export let start = 0;
    export let fill = void 0;
    export let stroke = void 0;
    export let strokeWidth = void 0;
    export let transform = void 0;

    /**
     * Builds the SVG path for rendering a curve.
     * @param {number} innerRadius - The radius of the inner curve.
     * @param {number} curveWidth - The width between the inner and the outer curve.
     * @param {number} curveAngle - Tha angle of the curve.
     * @param {number} startAngle - The start angle of the curve.
     * @param {number} centerX - The X-coordinate of the center of the curve.
     * @param {number} centerY - The Y-coordinate of the center of the curve.
     * @private
     */
    function curvedElementPath(innerRadius, curveWidth, curveAngle, startAngle, centerX, centerY) {
        const outerRadius = innerRadius + curveWidth;
        const end = startAngle + curveAngle;
        const center = new Vector2D(centerX, centerY);

        const p1 = Vector2D.polar(innerRadius, start, center);
        const p2 = Vector2D.polar(innerRadius, end, center);
        const p3 = Vector2D.polar(outerRadius, end, center);
        const p4 = Vector2D.polar(outerRadius, start, center);

        return `${moveTo(p1)} ${arcTo(innerRadius, p2, 0, 1, 0)} ${lineTo(p3)} ${arcTo(outerRadius, p4, 0, 0, 0)} Z`;
    }

    $: path = curvedElementPath(radius, width, angle, start, cx, cy);
</script>

<path d={path} {fill} {stroke} stroke-width={strokeWidth} {transform} />
