/**
 * Generates positions for neurons in a neural network layer.
 *
 * @param count - The number of neurons in the layer.
 * @param x - The x-coordinate for all neurons in this layer.
 * @param spacing - The vertical spacing between neurons (defaults to 1.2).
 * @returns An array of [x, y, z] coordinates.
 */
export const getNeuronPositions = (count: number, x: number, spacing: number = 1.2): [number, number, number][] => {
    if (count <= 0) {
        return [];
    }
    const offset = ((count - 1) * spacing) / 2;
    return Array.from({ length: count }, (_, i) => [x, i * spacing - offset, 0] as [number, number, number]);
};
