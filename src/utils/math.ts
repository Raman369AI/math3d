/**
 * Calculates the loss value for the gradient descent visualization.
 * Formula: f(x, y) = (x^2 + y^2) * 0.12 + sin(x) * cos(y) * 0.3
 *
 * @param x - The x coordinate
 * @param y - The y coordinate (or z coordinate in 3D space depending on orientation)
 * @returns The calculated loss value (height)
 */
export const calculateLoss = (x: number, y: number): number => {
    return (x * x + y * y) * 0.12 + Math.sin(x) * Math.cos(y) * 0.3;
};
