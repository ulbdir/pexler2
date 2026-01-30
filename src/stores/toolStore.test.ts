import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useToolStore } from './toolStore'

describe('toolStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('symmetryHorizontal defaults to false', () => {
      const store = useToolStore()
      expect(store.symmetryHorizontal).toBe(false)
    })

    it('symmetryVertical defaults to false', () => {
      const store = useToolStore()
      expect(store.symmetryVertical).toBe(false)
    })

    it('hoverPosition defaults to null', () => {
      const store = useToolStore()
      expect(store.hoverPosition).toBeNull()
    })
  })

  describe('toggleSymmetryHorizontal', () => {
    it('toggles symmetryHorizontal from false to true', () => {
      const store = useToolStore()
      store.toggleSymmetryHorizontal()
      expect(store.symmetryHorizontal).toBe(true)
    })

    it('toggles symmetryHorizontal from true to false', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.toggleSymmetryHorizontal()
      expect(store.symmetryHorizontal).toBe(false)
    })
  })

  describe('toggleSymmetryVertical', () => {
    it('toggles symmetryVertical from false to true', () => {
      const store = useToolStore()
      store.toggleSymmetryVertical()
      expect(store.symmetryVertical).toBe(true)
    })

    it('toggles symmetryVertical from true to false', () => {
      const store = useToolStore()
      store.symmetryVertical = true
      store.toggleSymmetryVertical()
      expect(store.symmetryVertical).toBe(false)
    })
  })

  describe('setHoverPosition', () => {
    it('sets hoverPosition to provided point', () => {
      const store = useToolStore()
      store.setHoverPosition({ x: 5, y: 10 })
      expect(store.hoverPosition).toEqual({ x: 5, y: 10 })
    })

    it('sets hoverPosition to null', () => {
      const store = useToolStore()
      store.setHoverPosition({ x: 5, y: 10 })
      store.setHoverPosition(null)
      expect(store.hoverPosition).toBeNull()
    })
  })

  describe('getSymmetryPoints - no symmetry', () => {
    it('returns only original point when no symmetry enabled', () => {
      const store = useToolStore()
      const points = store.getSymmetryPoints(3, 4, 8, 8)
      expect(points).toHaveLength(1)
      expect(points[0]).toEqual({ x: 3, y: 4 })
    })
  })

  describe('getSymmetryPoints - horizontal symmetry only', () => {
    it('returns original + mirrored point for horizontal symmetry', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      const points = store.getSymmetryPoints(2, 1, 8, 8)
      expect(points).toHaveLength(2)
      expect(points).toContainEqual({ x: 2, y: 1 })
      // Center is at floor(8/2) = 4, mirror = 2*4 - 1 - 1 = 6
      expect(points).toContainEqual({ x: 2, y: 6 })
    })

    it('mirrors correctly on both sides of center', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      // On 8x8 canvas, center y=4
      // Point at y=2 mirrors to y=5
      const points = store.getSymmetryPoints(3, 2, 8, 8)
      expect(points).toHaveLength(2)
      expect(points).toContainEqual({ x: 3, y: 2 })
      expect(points).toContainEqual({ x: 3, y: 5 }) // 2*4 - 2 - 1 = 5
    })
  })

  describe('getSymmetryPoints - vertical symmetry only', () => {
    it('returns original + mirrored point for vertical symmetry', () => {
      const store = useToolStore()
      store.symmetryVertical = true
      const points = store.getSymmetryPoints(1, 3, 8, 8)
      expect(points).toHaveLength(2)
      expect(points).toContainEqual({ x: 1, y: 3 })
      // Center is at floor(8/2) = 4, mirror = 2*4 - 1 - 1 = 6
      expect(points).toContainEqual({ x: 6, y: 3 })
    })

    it('mirrors correctly on both sides of center', () => {
      const store = useToolStore()
      store.symmetryVertical = true
      // On 8x8 canvas, center x=4
      // Point at x=2 mirrors to x=5
      const points = store.getSymmetryPoints(2, 3, 8, 8)
      expect(points).toHaveLength(2)
      expect(points).toContainEqual({ x: 2, y: 3 })
      expect(points).toContainEqual({ x: 5, y: 3 }) // 2*4 - 2 - 1 = 5
    })
  })

  describe('getSymmetryPoints - both symmetries enabled', () => {
    it('returns 4 points when both symmetries enabled', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      // 8x8 canvas, center at (4, 4)
      // Point (2, 1):
      // - Vertical mirror: 2*4 - 2 - 1 = 5, so (5, 1)
      // - Horizontal mirror: 2*4 - 1 - 1 = 6, so (2, 6)
      // - Diagonal mirror: (5, 6)
      const points = store.getSymmetryPoints(2, 1, 8, 8)
      expect(points).toHaveLength(4)
      expect(points).toContainEqual({ x: 2, y: 1 }) // original
      expect(points).toContainEqual({ x: 5, y: 1 }) // vertical mirror
      expect(points).toContainEqual({ x: 2, y: 6 }) // horizontal mirror
      expect(points).toContainEqual({ x: 5, y: 6 }) // diagonal mirror
    })

    it('returns 4 points with different example', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      // On 9x9 canvas, center at (4, 4)
      // Point (2, 3):
      // - Vertical: 2*4 - 2 - 1 = 5, so (5, 3) ✓
      // - Horizontal: 2*4 - 3 - 1 = 4, so (2, 4) ✓
      // - Diagonal: (5, 4) ✓
      const points = store.getSymmetryPoints(2, 3, 9, 9)
      expect(points).toHaveLength(4)
      expect(points).toContainEqual({ x: 2, y: 3 })
      expect(points).toContainEqual({ x: 5, y: 3 })
      expect(points).toContainEqual({ x: 2, y: 4 })
      expect(points).toContainEqual({ x: 5, y: 4 })
    })

    it('returns 4 points for center-adjacent point', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      // On 8x8 canvas, point (3, 3):
      // - Vertical: 2*4 - 3 - 1 = 4, so (4, 3) ✓
      // - Horizontal: 2*4 - 3 - 1 = 4, so (3, 4) ✓
      // - Diagonal: (4, 4) ✓
      const points = store.getSymmetryPoints(3, 3, 8, 8)
      expect(points).toHaveLength(4)
      expect(points).toContainEqual({ x: 3, y: 3 })
      expect(points).toContainEqual({ x: 4, y: 3 })
      expect(points).toContainEqual({ x: 3, y: 4 })
      expect(points).toContainEqual({ x: 4, y: 4 })
    })

    it('handles corner case with all 4 points valid', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      // (0, 0) on 8x8:
      // - Vertical: 2*4 - 0 - 1 = 7, so (7, 0) ✓
      // - Horizontal: 2*4 - 0 - 1 = 7, so (0, 7) ✓
      // - Diagonal: (7, 7) ✓
      const points = store.getSymmetryPoints(0, 0, 8, 8)
      expect(points).toHaveLength(4)
      expect(points).toContainEqual({ x: 0, y: 0 })
      expect(points).toContainEqual({ x: 7, y: 0 })
      expect(points).toContainEqual({ x: 0, y: 7 })
      expect(points).toContainEqual({ x: 7, y: 7 })
    })
  })

  describe('getSymmetryPoints - edge cases', () => {
    it('handles 1-pixel wide canvas (no vertical symmetry possible)', () => {
      const store = useToolStore()
      store.symmetryVertical = true
      // Center is at floor(1/2) = 0
      // mirror = 2*0 - 0 - 1 = -1 (out of bounds)
      const points = store.getSymmetryPoints(0, 3, 1, 8)
      expect(points).toHaveLength(1)
      expect(points[0]).toEqual({ x: 0, y: 3 })
    })

    it('handles 1-pixel tall canvas (no horizontal symmetry possible)', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      // Center is at floor(1/2) = 0
      // mirror = 2*0 - 0 - 1 = -1 (out of bounds)
      const points = store.getSymmetryPoints(3, 0, 8, 1)
      expect(points).toHaveLength(1)
      expect(points[0]).toEqual({ x: 3, y: 0 })
    })

    it('handles 1x1 canvas', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      const points = store.getSymmetryPoints(0, 0, 1, 1)
      expect(points).toHaveLength(1)
      expect(points[0]).toEqual({ x: 0, y: 0 })
    })

    it('handles 2x2 canvas with both symmetries', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      // 2x2 canvas, center at floor(2/2) = 1
      // Point (0, 0):
      // - Vertical: 2*1 - 0 - 1 = 1, so (1, 0) ✓
      // - Horizontal: 2*1 - 0 - 1 = 1, so (0, 1) ✓
      // - Diagonal: (1, 1) ✓
      const points = store.getSymmetryPoints(0, 0, 2, 2)
      expect(points).toHaveLength(4)
      expect(points).toContainEqual({ x: 0, y: 0 })
      expect(points).toContainEqual({ x: 1, y: 0 })
      expect(points).toContainEqual({ x: 0, y: 1 })
      expect(points).toContainEqual({ x: 1, y: 1 })
    })

    it('handles odd dimensions correctly', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      // 9x9 canvas, center at floor(9/2) = 4
      // Point at y=2 mirrors to y=5
      const points = store.getSymmetryPoints(3, 2, 9, 9)
      expect(points).toHaveLength(2)
      expect(points).toContainEqual({ x: 3, y: 2 })
      expect(points).toContainEqual({ x: 3, y: 5 }) // 2*4 - 2 - 1 = 5
    })

    it('handles even dimensions correctly', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      // 8x8 canvas, center at floor(8/2) = 4
      // Point at y=1 mirrors to y=6
      const points = store.getSymmetryPoints(3, 1, 8, 8)
      expect(points).toHaveLength(2)
      expect(points).toContainEqual({ x: 3, y: 1 })
      expect(points).toContainEqual({ x: 3, y: 6 }) // 2*4 - 1 - 1 = 6
    })

    it('handles negative coordinates (out of bounds)', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      // Mirrors would also be negative (out of bounds)
      const points = store.getSymmetryPoints(-1, -1, 8, 8)
      expect(points).toHaveLength(1)
      expect(points[0]).toEqual({ x: -1, y: -1 })
    })

    it('handles coordinates beyond canvas bounds', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      // Mirrors would also be out of bounds
      const points = store.getSymmetryPoints(10, 10, 8, 8)
      expect(points).toHaveLength(1)
      expect(points[0]).toEqual({ x: 10, y: 10 })
    })

    it('handles all canvas corners with vertical symmetry', () => {
      const store = useToolStore()
      store.symmetryVertical = true
      // 8x8 canvas, center at 4
      // (0,0) → vertical mirror at 7, so (7,0)
      const topLeft = store.getSymmetryPoints(0, 0, 8, 8)
      expect(topLeft).toHaveLength(2)
      expect(topLeft).toContainEqual({ x: 0, y: 0 })
      expect(topLeft).toContainEqual({ x: 7, y: 0 })

      // (7,0) → vertical mirror at 0, so (0,0)
      const topRight = store.getSymmetryPoints(7, 0, 8, 8)
      expect(topRight).toHaveLength(2)
      expect(topRight).toContainEqual({ x: 7, y: 0 })
      expect(topRight).toContainEqual({ x: 0, y: 0 })

      // (0,7) → vertical mirror at 7, so (7,7)
      const bottomLeft = store.getSymmetryPoints(0, 7, 8, 8)
      expect(bottomLeft).toHaveLength(2)
      expect(bottomLeft).toContainEqual({ x: 0, y: 7 })
      expect(bottomLeft).toContainEqual({ x: 7, y: 7 })

      // (7,7) → vertical mirror at 0, so (0,7)
      const bottomRight = store.getSymmetryPoints(7, 7, 8, 8)
      expect(bottomRight).toHaveLength(2)
      expect(bottomRight).toContainEqual({ x: 7, y: 7 })
      expect(bottomRight).toContainEqual({ x: 0, y: 7 })
    })

    it('handles all canvas corners with horizontal symmetry', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      // 8x8 canvas, center at 4
      // (0,0) → horizontal mirror at 7, so (0,7)
      const topLeft = store.getSymmetryPoints(0, 0, 8, 8)
      expect(topLeft).toHaveLength(2)
      expect(topLeft).toContainEqual({ x: 0, y: 0 })
      expect(topLeft).toContainEqual({ x: 0, y: 7 })

      // (7,0) → horizontal mirror at 7, so (7,7)
      const topRight = store.getSymmetryPoints(7, 0, 8, 8)
      expect(topRight).toHaveLength(2)
      expect(topRight).toContainEqual({ x: 7, y: 0 })
      expect(topRight).toContainEqual({ x: 7, y: 7 })

      // (0,7) → horizontal mirror at 0, so (0,0)
      const bottomLeft = store.getSymmetryPoints(0, 7, 8, 8)
      expect(bottomLeft).toHaveLength(2)
      expect(bottomLeft).toContainEqual({ x: 0, y: 7 })
      expect(bottomLeft).toContainEqual({ x: 0, y: 0 })

      // (7,7) → horizontal mirror at 0, so (7,0)
      const bottomRight = store.getSymmetryPoints(7, 7, 8, 8)
      expect(bottomRight).toHaveLength(2)
      expect(bottomRight).toContainEqual({ x: 7, y: 7 })
      expect(bottomRight).toContainEqual({ x: 7, y: 0 })
    })

    it('handles points on the center boundary', () => {
      const store = useToolStore()
      store.symmetryVertical = true
      // 8x8 canvas, center at 4
      // x=3 and x=4 are on opposite sides of center
      // x=3 mirrors to 4, x=4 mirrors to 3
      const leftOfCenter = store.getSymmetryPoints(3, 5, 8, 8)
      expect(leftOfCenter).toHaveLength(2)
      expect(leftOfCenter).toContainEqual({ x: 3, y: 5 })
      expect(leftOfCenter).toContainEqual({ x: 4, y: 5 })

      const rightOfCenter = store.getSymmetryPoints(4, 5, 8, 8)
      expect(rightOfCenter).toHaveLength(2)
      expect(rightOfCenter).toContainEqual({ x: 4, y: 5 })
      expect(rightOfCenter).toContainEqual({ x: 3, y: 5 })
    })
  })

  describe('$reset', () => {
    it('resets symmetry flags to false', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      store.$reset()
      expect(store.symmetryHorizontal).toBe(false)
      expect(store.symmetryVertical).toBe(false)
    })

    it('clears hoverPosition', () => {
      const store = useToolStore()
      store.setHoverPosition({ x: 5, y: 10 })
      store.$reset()
      expect(store.hoverPosition).toBeNull()
    })

    it('resets other tool state as well', () => {
      const store = useToolStore()
      store.setTool('eraser')
      store.setShapeType('rect')
      store.shapeFilled = true
      store.shapeConstrain = true
      store.$reset()
      expect(store.activeTool).toBe('pencil')
      expect(store.shapeType).toBe('line')
      expect(store.shapeFilled).toBe(false)
      expect(store.shapeConstrain).toBe(false)
    })
  })
})
