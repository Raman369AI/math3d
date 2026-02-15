export interface BoxData {
    position: [number, number, number];
    scale: [number, number, number];
}

/**
 * Calculates the Riemann sum boxes for a given function and domain.
 *
 * @param start - The start of the domain (x-axis)
 * @param end - The end of the domain (x-axis)
 * @param nPartitions - The number of boxes to create
 * @param func - The mathematical function f(x)
 * @returns An array of box data containing position and scale
 */
export const calculateRiemannBoxes = (
    start: number,
    end: number,
    nPartitions: number,
    func: (x: number) => number
): BoxData[] => {
    if (nPartitions <= 0) {
        return [];
    }

    const dx = (end - start) / nPartitions;
    const boxData: BoxData[] = [];

    for (let i = 0; i < nPartitions; i++) {
        const x = start + i * dx + dx / 2;
        const h = func(x);
        boxData.push({
            position: [x, h / 2, 0],
            scale: [dx * 0.9, h, 0.5],
        });
    }

    return boxData;
};
