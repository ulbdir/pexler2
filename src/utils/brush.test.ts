import { describe, it, expect } from 'vitest'
import { getSquareBrushOffsets, getCircleBrushOffsets, getBrushOffsets } from './brush'

describe('getSquareBrushOffsets', () => {
  it('returns single pixel at origin for size 1', () => {
    const offsets = getSquareBrushOffsets(1)
    expect(offsets).toEqual([{ x: 0, y: 0 }])
  })

  it('returns 4 pixels for size 2', () => {
    const offsets = getSquareBrushOffsets(2)
    expect(offsets).toHaveLength(4)
    // Size 2: half=1, start=-1, end=0
    expect(offsets).toContainEqual({ x: -1, y: -1 })
    expect(offsets).toContainEqual({ x: 0, y: -1 })
    expect(offsets).toContainEqual({ x: -1, y: 0 })
    expect(offsets).toContainEqual({ x: 0, y: 0 })
  })

  it('returns 9 pixels for size 3', () => {
    const offsets = getSquareBrushOffsets(3)
    expect(offsets).toHaveLength(9)
    // Should be centered: -1 to 1 in both axes
    expect(offsets).toContainEqual({ x: -1, y: -1 })
    expect(offsets).toContainEqual({ x: 0, y: 0 })
    expect(offsets).toContainEqual({ x: 1, y: 1 })
  })

  it('returns 16 pixels for size 4', () => {
    const offsets = getSquareBrushOffsets(4)
    expect(offsets).toHaveLength(16)
  })

  it('returns 64 pixels for size 8', () => {
    const offsets = getSquareBrushOffsets(8)
    expect(offsets).toHaveLength(64)
  })

  it('returns 256 pixels for size 16', () => {
    const offsets = getSquareBrushOffsets(16)
    expect(offsets).toHaveLength(256)
  })
})

describe('getCircleBrushOffsets', () => {
  it('returns single pixel at origin for size 1', () => {
    const offsets = getCircleBrushOffsets(1)
    expect(offsets).toEqual([{ x: 0, y: 0 }])
  })

  it('returns cross pattern for size 2', () => {
    const offsets = getCircleBrushOffsets(2)
    // Size 2: half=1, radius=1, pixels at corners like (-1,-1) have dist=sqrt(2)>1
    // Only axis-aligned pixels are within radius 1
    expect(offsets.length).toBeLessThanOrEqual(4)
    expect(offsets.length).toBeGreaterThanOrEqual(1)
  })

  it('returns 9 pixels for size 3 (small circles are nearly square)', () => {
    const circleOffsets = getCircleBrushOffsets(3)
    // Size 3: radius=1.5, corners at (-1,-1) have dist=sqrt(2)~=1.41 < 1.5
    // So all 9 pixels are included
    expect(circleOffsets).toHaveLength(9)
    // Center should be included
    expect(circleOffsets).toContainEqual({ x: 0, y: 0 })
  })

  it('returns fewer pixels than square for larger sizes', () => {
    for (const size of [5, 8, 16]) {
      const squareOffsets = getSquareBrushOffsets(size)
      const circleOffsets = getCircleBrushOffsets(size)
      expect(circleOffsets.length).toBeLessThan(squareOffsets.length)
    }
  })

  it('always includes the center pixel', () => {
    for (const size of [1, 2, 3, 4, 5, 8, 16]) {
      const offsets = getCircleBrushOffsets(size)
      expect(offsets).toContainEqual({ x: 0, y: 0 })
    }
  })

  it('includes corner pixels for size 3 since dist <= radius', () => {
    const offsets = getCircleBrushOffsets(3)
    // Corners at (-1,-1) have dist = sqrt(2) = 1.41, radius = 1.5
    // 1.41 <= 1.5, so corners are included
    const hasCorner = offsets.some(p => p.x === -1 && p.y === -1)
    expect(hasCorner).toBe(true)
  })
})

describe('getBrushOffsets', () => {
  it('returns square offsets for square shape', () => {
    const offsets = getBrushOffsets('square', 3)
    const squareOffsets = getSquareBrushOffsets(3)
    expect(offsets).toEqual(squareOffsets)
  })

  it('returns circle offsets for circle shape', () => {
    const offsets = getBrushOffsets('circle', 3)
    const circleOffsets = getCircleBrushOffsets(3)
    expect(offsets).toEqual(circleOffsets)
  })
})
