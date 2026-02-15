
/**
 * Generates a cryptographically secure random number in the range [0, 1).
 * This function is designed to be a drop-in replacement for Math.random().
 * It uses the Web Crypto API (crypto.getRandomValues) which provides
 * higher quality randomness suitable for security-sensitive applications.
 *
 * @returns A number between 0 (inclusive) and 1 (exclusive).
 */
export function secureRandom(): number {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    // Divide by 2^32 to get a value in [0, 1)
    return array[0] / 4294967296;
}
