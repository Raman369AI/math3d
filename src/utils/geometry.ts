/**
 * Generates points for a 2D ellipse centered at (0,0) on the XY plane (z=0).
 * Useful for rendering lines or shapes in 3D scenes.
 *
 * @param radiusX - The semi-major axis length (radius along X-axis).
 * @param radiusY - The semi-minor axis length (radius along Y-axis).
 * @param segments - The number of line segments to approximate the ellipse. Result will have segments + 1 points to close the loop.
 * @returns An array of [x, y, z] points.
 */
export const generateEllipsePoints = (radiusX: number, radiusY: number, segments: number): [number, number, number][] => {
    const points: [number, number, number][] = [];
    if (segments <= 0) {
        points.push([radiusX, 0, 0]);
        return points;
    }
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push([Math.cos(theta) * radiusX, Math.sin(theta) * radiusY, 0]);
    }
    return points;
};
