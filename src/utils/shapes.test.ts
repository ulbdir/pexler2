import { describe, it, expect } from 'vitest'
import { rectOutline, rectFilled, ellipseOutline, ellipseFilled } from './shapes'
import type { Point } from '@/types'

function collectPixels(fn: (a: Point, b: Point, cb: (x: number, y: number) => void) => void, a: Point, b: Point): Point[] {
  const pixels: Point[] = []
  fn(a, b, (x, y) => pixels.push({ x, y }))
  return pixels
}

describe('shapes', () => {
  describe('rectOutline', () => {
    it('draws a single pixel for same start and end', () => {
      const pixels = collectPixels(rectOutline, { x: 5, y: 5 }, { x: 5, y: 5 })
      expect(pixels).toHaveLength(1)
      expect(pixels).toContainEqual({ x: 5, y: 5 })
    })

    it('draws a horizontal line for 1px height', () => {
      const pixels = collectPixels(rectOutline, { x: 0, y: 0 }, { x: 4, y: 0 })
      expect(pixels).toHaveLength(5)
      for (let x = 0; x <= 4; x++) {
        expect(pixels).toContainEqual({ x, y: 0 })
      }
    })

    it('draws a vertical line for 1px width', () => {
      const pixels = collectPixels(rectOutline, { x: 0, y: 0 }, { x: 0, y: 4 })
      expect(pixels).toHaveLength(5)
      for (let y = 0; y <= 4; y++) {
        expect(pixels).toContainEqual({ x: 0, y })
      }
    })

    it('draws correct outline for a 3x3 rect', () => {
      const pixels = collectPixels(rectOutline, { x: 0, y: 0 }, { x: 2, y: 2 })
      // Perimeter of 3x3: top 3 + bottom 3 + left 1 + right 1 = 8
      expect(pixels).toHaveLength(8)
      // Top row
      expect(pixels).toContainEqual({ x: 0, y: 0 })
      expect(pixels).toContainEqual({ x: 1, y: 0 })
      expect(pixels).toContainEqual({ x: 2, y: 0 })
      // Bottom row
      expect(pixels).toContainEqual({ x: 0, y: 2 })
      expect(pixels).toContainEqual({ x: 1, y: 2 })
      expect(pixels).toContainEqual({ x: 2, y: 2 })
      // Sides (middle row)
      expect(pixels).toContainEqual({ x: 0, y: 1 })
      expect(pixels).toContainEqual({ x: 2, y: 1 })
      // Center should NOT be filled
      expect(pixels).not.toContainEqual({ x: 1, y: 1 })
    })

    it('normalizes coordinates regardless of corner order', () => {
      const pixels1 = collectPixels(rectOutline, { x: 0, y: 0 }, { x: 3, y: 3 })
      const pixels2 = collectPixels(rectOutline, { x: 3, y: 3 }, { x: 0, y: 0 })
      expect(pixels1.length).toBe(pixels2.length)
      for (const p of pixels1) {
        expect(pixels2).toContainEqual(p)
      }
    })
  })

  describe('rectFilled', () => {
    it('draws a single pixel for same start and end', () => {
      const pixels = collectPixels(rectFilled, { x: 5, y: 5 }, { x: 5, y: 5 })
      expect(pixels).toHaveLength(1)
      expect(pixels).toContainEqual({ x: 5, y: 5 })
    })

    it('fills all pixels in a 3x3 rect', () => {
      const pixels = collectPixels(rectFilled, { x: 0, y: 0 }, { x: 2, y: 2 })
      expect(pixels).toHaveLength(9)
      for (let y = 0; y <= 2; y++) {
        for (let x = 0; x <= 2; x++) {
          expect(pixels).toContainEqual({ x, y })
        }
      }
    })

    it('normalizes coordinates regardless of corner order', () => {
      const pixels1 = collectPixels(rectFilled, { x: 0, y: 0 }, { x: 3, y: 2 })
      const pixels2 = collectPixels(rectFilled, { x: 3, y: 2 }, { x: 0, y: 0 })
      expect(pixels1.length).toBe(pixels2.length)
      for (const p of pixels1) {
        expect(pixels2).toContainEqual(p)
      }
    })

    it('fills a horizontal line correctly', () => {
      const pixels = collectPixels(rectFilled, { x: 1, y: 3 }, { x: 5, y: 3 })
      expect(pixels).toHaveLength(5)
    })
  })

  describe('ellipseOutline', () => {
    it('draws a single pixel for same start and end', () => {
      const pixels = collectPixels(ellipseOutline, { x: 5, y: 5 }, { x: 5, y: 5 })
      expect(pixels.length).toBeGreaterThanOrEqual(1)
      expect(pixels).toContainEqual({ x: 5, y: 5 })
    })

    it('draws a horizontal line for 0 height', () => {
      const pixels = collectPixels(ellipseOutline, { x: 0, y: 0 }, { x: 4, y: 0 })
      expect(pixels).toHaveLength(5)
      for (let x = 0; x <= 4; x++) {
        expect(pixels).toContainEqual({ x, y: 0 })
      }
    })

    it('draws a vertical line for 0 width', () => {
      const pixels = collectPixels(ellipseOutline, { x: 0, y: 0 }, { x: 0, y: 4 })
      expect(pixels).toHaveLength(5)
      for (let y = 0; y <= 4; y++) {
        expect(pixels).toContainEqual({ x: 0, y })
      }
    })

    it('draws a symmetric ellipse', () => {
      const pixels = collectPixels(ellipseOutline, { x: 0, y: 0 }, { x: 6, y: 4 })
      // Should be symmetric around center
      const cx = 3
      const cy = 2
      for (const p of pixels) {
        const mirrorX = cx + (cx - p.x)
        const mirrorY = cy + (cy - p.y)
        expect(pixels).toContainEqual({ x: mirrorX, y: mirrorY })
      }
    })

    it('stays within bounding box', () => {
      const a = { x: 2, y: 3 }
      const b = { x: 10, y: 8 }
      const pixels = collectPixels(ellipseOutline, a, b)
      for (const p of pixels) {
        expect(p.x).toBeGreaterThanOrEqual(a.x)
        expect(p.x).toBeLessThanOrEqual(b.x)
        expect(p.y).toBeGreaterThanOrEqual(a.y)
        expect(p.y).toBeLessThanOrEqual(b.y)
      }
    })

    it('normalizes coordinates regardless of corner order', () => {
      const pixels1 = collectPixels(ellipseOutline, { x: 0, y: 0 }, { x: 6, y: 4 })
      const pixels2 = collectPixels(ellipseOutline, { x: 6, y: 4 }, { x: 0, y: 0 })
      expect(pixels1.length).toBe(pixels2.length)
      for (const p of pixels1) {
        expect(pixels2).toContainEqual(p)
      }
    })
  })

  describe('ellipseFilled', () => {
    it('draws a single pixel for same start and end', () => {
      const pixels = collectPixels(ellipseFilled, { x: 5, y: 5 }, { x: 5, y: 5 })
      expect(pixels.length).toBeGreaterThanOrEqual(1)
      expect(pixels).toContainEqual({ x: 5, y: 5 })
    })

    it('fills more pixels than outline for a large ellipse', () => {
      const outline = collectPixels(ellipseOutline, { x: 0, y: 0 }, { x: 8, y: 6 })
      const filled = collectPixels(ellipseFilled, { x: 0, y: 0 }, { x: 8, y: 6 })
      expect(filled.length).toBeGreaterThan(outline.length)
    })

    it('stays within bounding box', () => {
      const a = { x: 2, y: 3 }
      const b = { x: 10, y: 8 }
      const pixels = collectPixels(ellipseFilled, a, b)
      for (const p of pixels) {
        expect(p.x).toBeGreaterThanOrEqual(a.x)
        expect(p.x).toBeLessThanOrEqual(b.x)
        expect(p.y).toBeGreaterThanOrEqual(a.y)
        expect(p.y).toBeLessThanOrEqual(b.y)
      }
    })

    it('contains all outline pixels', () => {
      const a = { x: 0, y: 0 }
      const b = { x: 8, y: 6 }
      const outline = collectPixels(ellipseOutline, a, b)
      const filled = collectPixels(ellipseFilled, a, b)
      for (const p of outline) {
        expect(filled).toContainEqual(p)
      }
    })

    it('normalizes coordinates regardless of corner order', () => {
      const pixels1 = collectPixels(ellipseFilled, { x: 0, y: 0 }, { x: 6, y: 4 })
      const pixels2 = collectPixels(ellipseFilled, { x: 6, y: 4 }, { x: 0, y: 0 })
      expect(pixels1.length).toBe(pixels2.length)
      for (const p of pixels1) {
        expect(pixels2).toContainEqual(p)
      }
    })
  })
})
