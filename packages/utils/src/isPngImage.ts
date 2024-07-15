/**
 * {@link} https://en.wikipedia.org/wiki/Portable_Network_Graphics
 *
 * @param {Buffer | Uint8Array} buffer Input is a buffer
 * @returns {boolean} return true if the input is a PNG Image
 */
export function isPngImage(buffer: Buffer | Uint8Array): boolean {
  if (!buffer || buffer.length < 8) {
    return false;
  }

  return (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  );
}
