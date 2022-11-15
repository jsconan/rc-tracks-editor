<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { SVGPath, Vector2D } from '../../core/models';
    import { attributeList, enlargeArc, RIGHT_ANGLE } from '../../core/helpers';

    export let cx = 0;
    export let cy = 0;
    export let width = 1;
    export let radius = 1;
    export let angle = 1;
    export let start = 0;
    export let d = 0;
    export let fill = void 0;
    export let stroke = void 0;
    export let transform = void 0;

    /**
     * Builds the SVG path for rendering a curve.
     * @param {number} curveRadius - The radius of the inner curve.
     * @param {number} curveWidth - The width between the inner and the outer curve.
     * @param {number} curveAngle - Tha angle of the curve.
     * @param {number} startAngle - The start angle of the curve.
     * @param {number} centerX - The X-coordinate of the center of the curve.
     * @param {number} centerY - The Y-coordinate of the center of the curve.
     * @param {number} addition - An additional distance added to the outline.
     * @returns {SVGPath} - Returns the path for the curve.
     * @private
     */
    function curvedElementPath(curveRadius, curveWidth, curveAngle, startAngle, centerX, centerY, addition) {
        addition = Math.min(addition, curveRadius);

        const center = new Vector2D(centerX, centerY);

        let innerRadius, innerAngle, innerCenter;

        if (curveAngle === RIGHT_ANGLE) {
            innerRadius = curveRadius;
            innerAngle = curveAngle;
            innerCenter = center.subScalar(addition);
        } else {
            innerRadius = curveRadius - addition;
            innerAngle = enlargeArc(curveAngle, innerRadius, addition * 2);
            innerCenter = center;
        }

        const innerStart = startAngle + (curveAngle - innerAngle) / 2;
        const innerEnd = innerStart + innerAngle;

        const outerRadius = curveRadius + curveWidth + addition;
        const outerAngle = enlargeArc(curveAngle, outerRadius, addition * 2);
        const outerStart = startAngle + (curveAngle - outerAngle) / 2;
        const outerEnd = outerStart + outerAngle;
        const outerCenter = center;

        return new SVGPath()
            .polarMoveTo(innerRadius, innerStart, innerCenter)
            .arcCurveTo(innerRadius, -innerAngle, Vector2D.polar(innerRadius, innerEnd, innerCenter))
            .polarLineTo(outerRadius, outerEnd, outerCenter)
            .arcCurveTo(outerRadius, outerAngle, Vector2D.polar(outerRadius, outerStart, outerCenter))
            .close();
    }
</script>

<path
    d={curvedElementPath(radius, width, angle, start, cx, cy, d)}
    {...attributeList(fill, 'fill')}
    {...attributeList(stroke, 'stroke')}
    {transform}
/>
