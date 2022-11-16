<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { SVGPath, Vector2D } from '../models';
    import { attributeList, enlargeArc } from '../helpers';

    export let cx = 0;
    export let cy = 0;
    export let width = 1;
    export let thickness = void 0;
    export let clockwise = true;
    export let radius = 1;
    export let angle = 1;
    export let start = 0;
    export let fill = void 0;
    export let stroke = void 0;
    export let transform = void 0;

    /**
     * Builds the SVG path for rendering a curved arrow.
     * @param {number} arrowWidth - The width of the arrow.
     * @param {number} arrowThickness - The thickness of the arrow.
     * @param {boolean} arrowClockwise - Is the arrow clockwise or counter-clockwise?
     * @param {number} curveRadius - The radius of the curve.
     * @param {number} curveAngle - Tha angle of the curve.
     * @param {number} startAngle - The start angle of the curve.
     * @param {number} centerX - The X-coordinate of the center of the curve.
     * @param {number} centerY - The Y-coordinate of the center of the curve.
     * @private
     */
    function curvedArrowPath(
        arrowWidth,
        arrowThickness,
        arrowClockwise,
        curveRadius,
        curveAngle,
        startAngle,
        centerX,
        centerY
    ) {
        const center = new Vector2D(centerX, centerY);

        const tipEdgeRadius = curveRadius;
        const tipInnerRadius = tipEdgeRadius - arrowWidth / 2;
        const tipOuterRadius = tipInnerRadius + arrowWidth;
        const innerRadius = tipEdgeRadius - arrowThickness / 2;
        const outerRadius = innerRadius + arrowThickness;
        const bodyAngle = enlargeArc(curveAngle, tipOuterRadius, -arrowWidth);

        let bodyStart, bodyEnd, tipStart, tipEnd;

        if (arrowClockwise) {
            bodyStart = startAngle;
            bodyEnd = bodyStart + bodyAngle;
            tipStart = bodyEnd;
            tipEnd = bodyStart + curveAngle;
        } else {
            bodyEnd = startAngle + curveAngle;
            bodyStart = bodyEnd - bodyAngle;
            tipEnd = startAngle;
            tipStart = bodyStart;
        }

        const path = new SVGPath();

        if (arrowClockwise) {
            return path
                .polarMoveTo(innerRadius, bodyStart, center)
                .arcCurveTo(innerRadius, -bodyAngle, Vector2D.polar(innerRadius, bodyEnd, center))
                .polarLineTo(tipInnerRadius, tipStart, center)
                .polarLineTo(tipEdgeRadius, tipEnd, center)
                .polarLineTo(tipOuterRadius, tipStart, center)
                .polarLineTo(outerRadius, bodyEnd, center)
                .arcCurveTo(outerRadius, bodyAngle, Vector2D.polar(outerRadius, bodyStart, center))
                .close();
        } else {
            return path
                .polarMoveTo(tipEdgeRadius, tipEnd, center)
                .polarLineTo(tipOuterRadius, tipStart, center)
                .polarLineTo(outerRadius, bodyStart, center)
                .arcCurveTo(outerRadius, -bodyAngle, Vector2D.polar(outerRadius, bodyEnd, center))
                .polarLineTo(innerRadius, bodyEnd, center)
                .arcCurveTo(innerRadius, bodyAngle, Vector2D.polar(innerRadius, bodyStart, center))
                .polarLineTo(tipInnerRadius, tipStart, center)
                .close();
        }
    }

    $: if ('undefined' === typeof thickness) {
        thickness = width / 3;
    }
</script>

<path
    d={curvedArrowPath(width, thickness, clockwise, radius, angle, start, cx, cy)}
    {...attributeList(fill, 'fill')}
    {...attributeList(stroke, 'stroke')}
    {transform}
/>
