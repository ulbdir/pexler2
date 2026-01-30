import type { Point } from '@/types'

export function bresenhamLine(
  from: Point,
  to: Point,
  callback: (x: number, y: number) => void,
  skipFirst: boolean = false
): void {
  let x0 = from.x
  let y0 = from.y
  const x1 = to.x
  const y1 = to.y

  const dx = Math.abs(x1 - x0)
  const dy = Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1
  const sy = y0 < y1 ? 1 : -1
  let err = dx - dy
  let isFirst = true

  while (true) {
    if (!skipFirst || !isFirst) {
      callback(x0, y0)
    }
    isFirst = false
    if (x0 === x1 && y0 === y1) break
    const e2 = 2 * err
    if (e2 > -dy) {
      err -= dy
      x0 += sx
    }
    if (e2 < dx) {
      err += dx
      y0 += sy
    }
  }
}
