import type { RGBA } from '@/types'

export function floodFill(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  fillColor: RGBA
): void {
  const startIdx = (startY * width + startX) * 4
  const targetR = pixels[startIdx]!
  const targetG = pixels[startIdx + 1]!
  const targetB = pixels[startIdx + 2]!
  const targetA = pixels[startIdx + 3]!

  if (
    targetR === fillColor.r &&
    targetG === fillColor.g &&
    targetB === fillColor.b &&
    targetA === fillColor.a
  ) {
    return
  }

  const stack: [number, number][] = [[startX, startY]]
  const visited = new Uint8Array(width * height)

  function tryPush(x: number, y: number) {
    if (x < 0 || x >= width || y < 0 || y >= height) return
    const vi = y * width + x
    if (visited[vi]) return
    const idx = vi * 4
    if (
      pixels[idx] !== targetR ||
      pixels[idx + 1] !== targetG ||
      pixels[idx + 2] !== targetB ||
      pixels[idx + 3] !== targetA
    ) return
    stack.push([x, y])
  }

  while (stack.length > 0) {
    const [x, y] = stack.pop()!
    const visitIdx = y * width + x

    if (visited[visitIdx]) continue
    visited[visitIdx] = 1

    const idx = visitIdx * 4
    pixels[idx] = fillColor.r
    pixels[idx + 1] = fillColor.g
    pixels[idx + 2] = fillColor.b
    pixels[idx + 3] = fillColor.a

    tryPush(x + 1, y)
    tryPush(x - 1, y)
    tryPush(x, y + 1)
    tryPush(x, y - 1)
  }
}
