import { describe, it, expect } from 'vitest'
import { bresenhamLine } from './bresenham'

function collectPoints(from: { x: number; y: number }, to: { x: number; y: number }) {
  const points: { x: number; y: number }[] = []
  bresenhamLine(from, to, (x, y) => points.push({ x, y }))
  return points
}

describe('bresenhamLine', () => {
  it('draws a single point when from equals to', () => {
    const points = collectPoints({ x: 3, y: 3 }, { x: 3, y: 3 })
    expect(points).toEqual([{ x: 3, y: 3 }])
  })

  it('draws a horizontal line left to right', () => {
    const points = collectPoints({ x: 0, y: 0 }, { x: 4, y: 0 })
    expect(points).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
    ])
  })

  it('draws a horizontal line right to left', () => {
    const points = collectPoints({ x: 4, y: 0 }, { x: 0, y: 0 })
    expect(points).toEqual([
      { x: 4, y: 0 },
      { x: 3, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
    ])
  })

  it('draws a vertical line top to bottom', () => {
    const points = collectPoints({ x: 0, y: 0 }, { x: 0, y: 4 })
    expect(points).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
      { x: 0, y: 4 },
    ])
  })

  it('draws a vertical line bottom to top', () => {
    const points = collectPoints({ x: 0, y: 4 }, { x: 0, y: 0 })
    expect(points).toEqual([
      { x: 0, y: 4 },
      { x: 0, y: 3 },
      { x: 0, y: 2 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
    ])
  })

  it('draws a 45-degree diagonal', () => {
    const points = collectPoints({ x: 0, y: 0 }, { x: 3, y: 3 })
    expect(points).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ])
  })

  it('draws a reverse diagonal', () => {
    const points = collectPoints({ x: 3, y: 3 }, { x: 0, y: 0 })
    expect(points).toEqual([
      { x: 3, y: 3 },
      { x: 2, y: 2 },
      { x: 1, y: 1 },
      { x: 0, y: 0 },
    ])
  })

  it('draws a shallow slope (dx > dy)', () => {
    const points = collectPoints({ x: 0, y: 0 }, { x: 5, y: 2 })
    // Should have 6 points (max of dx+1, dy+1)
    expect(points.length).toBe(6)
    // First and last points are correct
    expect(points[0]).toEqual({ x: 0, y: 0 })
    expect(points[points.length - 1]).toEqual({ x: 5, y: 2 })
    // X always increments
    for (let i = 1; i < points.length; i++) {
      expect(points[i]!.x).toBe(points[i - 1]!.x + 1)
    }
  })

  it('draws a steep slope (dy > dx)', () => {
    const points = collectPoints({ x: 0, y: 0 }, { x: 2, y: 5 })
    // Should have 6 points
    expect(points.length).toBe(6)
    expect(points[0]).toEqual({ x: 0, y: 0 })
    expect(points[points.length - 1]).toEqual({ x: 2, y: 5 })
    // Y always increments
    for (let i = 1; i < points.length; i++) {
      expect(points[i]!.y).toBe(points[i - 1]!.y + 1)
    }
  })

  it('includes both endpoints', () => {
    const points = collectPoints({ x: 1, y: 2 }, { x: 7, y: 5 })
    expect(points[0]).toEqual({ x: 1, y: 2 })
    expect(points[points.length - 1]).toEqual({ x: 7, y: 5 })
  })
})
