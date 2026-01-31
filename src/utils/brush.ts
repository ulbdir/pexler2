import type { Point, BrushShape } from '@/types'

/**
 * Get pixel offsets for a square brush centered at (0,0)
 */
export function getSquareBrushOffsets(size: number): Point[] {
  const offsets: Point[] = []
  const half = Math.floor(size / 2)
  const start = -half
  const end = size - half - 1

  for (let dy = start; dy <= end; dy++) {
    for (let dx = start; dx <= end; dx++) {
      // Use (x | 0) to convert -0 to 0
      offsets.push({ x: dx | 0, y: dy | 0 })
    }
  }
  return offsets
}

/**
 * Get pixel offsets for a circle brush centered at (0,0)
 * Uses standard algorithm - even sizes have slight asymmetry
 */
export function getCircleBrushOffsets(size: number): Point[] {
  const offsets: Point[] = []
  const half = Math.floor(size / 2)
  const start = -half
  const end = size - half - 1
  const radius = size / 2

  for (let dy = start; dy <= end; dy++) {
    for (let dx = start; dx <= end; dx++) {
      // Distance from pixel center to brush center
      const dist = Math.sqrt(dx * dx + dy * dy)
      // Use <= to include edge pixels for better circle appearance
      if (dist <= radius) {
        // Use (x | 0) to convert -0 to 0
        offsets.push({ x: dx | 0, y: dy | 0 })
      }
    }
  }
  return offsets
}

/**
 * Get brush offsets based on shape and size
 */
export function getBrushOffsets(shape: BrushShape, size: number): Point[] {
  return shape === 'square'
    ? getSquareBrushOffsets(size)
    : getCircleBrushOffsets(size)
}
