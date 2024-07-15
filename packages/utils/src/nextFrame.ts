export function nextFrame() {
  return new Promise(requestAnimationFrame);
}
