export function toArrayBuffer(buffer: Buffer) {
  const { buffer: arrayBuffer, byteOffset, byteLength } = buffer;
  return arrayBuffer.slice(byteOffset, byteOffset + byteLength);
}
