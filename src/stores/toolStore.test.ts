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

    it('blendMode defaults to overwrite', () => {
      const store = useToolStore()
      expect(store.blendMode).toBe('overwrite')
    })

    it('brushSize defaults to 1', () => {
      const store = useToolStore()
      expect(store.brushSize).toBe(1)
    })

    it('brushShape defaults to square', () => {
      const store = useToolStore()
      expect(store.brushShape).toBe('square')
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

  describe('toggleBlendMode', () => {
    it('toggles blendMode from overwrite to blend', () => {
      const store = useToolStore()
      store.toggleBlendMode()
      expect(store.blendMode).toBe('blend')
    })

    it('toggles blendMode from blend to overwrite', () => {
      const store = useToolStore()
      store.blendMode = 'blend'
      store.toggleBlendMode()
      expect(store.blendMode).toBe('overwrite')
    })
  })

  describe('setBlendMode', () => {
    it('sets blendMode to blend', () => {
      const store = useToolStore()
      store.setBlendMode('blend')
      expect(store.blendMode).toBe('blend')
    })

    it('sets blendMode to overwrite', () => {
      const store = useToolStore()
      store.blendMode = 'blend'
      store.setBlendMode('overwrite')
      expect(store.blendMode).toBe('overwrite')
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
      // 8x8 canvas: y=1 mirrors to (8-1)-1 = 6
      const points = store.getSymmetryPoints(2, 1, 8, 8)
      expect(points).toHaveLength(2)
      expect(points).toContainEqual({ x: 2, y: 1 })
      expect(points).toContainEqual({ x: 2, y: 6 })
    })

    it('mirrors correctly on both sides of center (even)', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      // 8x8 canvas: y=2 mirrors to (8-1)-2 = 5
      const points = store.getSymmetryPoints(3, 2, 8, 8)
      expect(points).toHaveLength(2)
      expect(points).toContainEqual({ x: 3, y: 2 })
      expect(points).toContainEqual({ x: 3, y: 5 })
    })

    it('mirrors correctly on odd dimensions', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      // 9x9 canvas: y=0 mirrors to (9-1)-0 = 8
      const points = store.getSymmetryPoints(3, 0, 9, 9)
      expect(points).toHaveLength(2)
      expect(points).toContainEqual({ x: 3, y: 0 })
      expect(points).toContainEqual({ x: 3, y: 8 })

      // y=8 mirrors to (9-1)-8 = 0
      const points2 = store.getSymmetryPoints(3, 8, 9, 9)
      expect(points2).toHaveLength(2)
      expect(points2).toContainEqual({ x: 3, y: 8 })
      expect(points2).toContainEqual({ x: 3, y: 0 })
    })

    it('does not duplicate point on even canvas center line', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      // 8x8 canvas has no single center pixel, y=3 mirrors to 4
      const points = store.getSymmetryPoints(3, 3, 8, 8)
      expect(points).toHaveLength(2)
      expect(points).toContainEqual({ x: 3, y: 3 })
      expect(points).toContainEqual({ x: 3, y: 4 })
    })

    it('does not duplicate point on odd canvas center line', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      // 9x9 canvas, y=4 is the center
      // (9-1)-4 = 4, so it mirrors to itself
      const points = store.getSymmetryPoints(3, 4, 9, 9)
      expect(points).toHaveLength(1)
      expect(points[0]).toEqual({ x: 3, y: 4 })
    })
  })

  describe('getSymmetryPoints - vertical symmetry only', () => {
    it('returns original + mirrored point for vertical symmetry', () => {
      const store = useToolStore()
      store.symmetryVertical = true
      // 8x8 canvas: x=1 mirrors to (8-1)-1 = 6
      const points = store.getSymmetryPoints(1, 3, 8, 8)
      expect(points).toHaveLength(2)
      expect(points).toContainEqual({ x: 1, y: 3 })
      expect(points).toContainEqual({ x: 6, y: 3 })
    })

    it('mirrors correctly on odd dimensions', () => {
      const store = useToolStore()
      store.symmetryVertical = true
      // 9x9 canvas: x=0 mirrors to 8
      const points = store.getSymmetryPoints(0, 5, 9, 9)
      expect(points).toHaveLength(2)
      expect(points).toContainEqual({ x: 0, y: 5 })
      expect(points).toContainEqual({ x: 8, y: 5 })
    })

    it('does not duplicate point on odd canvas center line', () => {
      const store = useToolStore()
      store.symmetryVertical = true
      // 9x9 canvas, x=4 is the center
      const points = store.getSymmetryPoints(4, 3, 9, 9)
      expect(points).toHaveLength(1)
      expect(points[0]).toEqual({ x: 4, y: 3 })
    })
  })

  describe('getSymmetryPoints - both symmetries enabled', () => {
    it('returns 4 points when both symmetries enabled (general case)', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      // 8x8 canvas, point (2, 1):
      // x=2 → mirror at 5, y=1 → mirror at 6
      const points = store.getSymmetryPoints(2, 1, 8, 8)
      expect(points).toHaveLength(4)
      expect(points).toContainEqual({ x: 2, y: 1 }) // original
      expect(points).toContainEqual({ x: 5, y: 1 }) // vertical
      expect(points).toContainEqual({ x: 2, y: 6 }) // horizontal
      expect(points).toContainEqual({ x: 5, y: 6 }) // diagonal
    })

    it('returns 2 points when on horizontal center line (odd canvas)', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      // 9x9 canvas, y=4 is center (mirrors to itself)
      // x=2 → mirror at 6
      const points = store.getSymmetryPoints(2, 4, 9, 9)
      expect(points).toHaveLength(2)
      expect(points).toContainEqual({ x: 2, y: 4 })
      expect(points).toContainEqual({ x: 6, y: 4 })
    })

    it('returns 2 points when on vertical center line (odd canvas)', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      // 9x9 canvas, x=4 is center (mirrors to itself)
      // y=2 → mirror at 6
      const points = store.getSymmetryPoints(4, 2, 9, 9)
      expect(points).toHaveLength(2)
      expect(points).toContainEqual({ x: 4, y: 2 })
      expect(points).toContainEqual({ x: 4, y: 6 })
    })

    it('returns 1 point when at exact center (odd canvas)', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      // 9x9 canvas, (4, 4) is the exact center
      const points = store.getSymmetryPoints(4, 4, 9, 9)
      expect(points).toHaveLength(1)
      expect(points[0]).toEqual({ x: 4, y: 4 })
    })

    it('returns 2 points when on horizontal center (even canvas)', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      // 8x8 canvas, y=3 mirrors to 4 (different)
      // x=2 → mirror at 5
      const points = store.getSymmetryPoints(2, 3, 8, 8)
      expect(points).toHaveLength(4)
      expect(points).toContainEqual({ x: 2, y: 3 })
      expect(points).toContainEqual({ x: 5, y: 3 })
      expect(points).toContainEqual({ x: 2, y: 4 })
      expect(points).toContainEqual({ x: 5, y: 4 })
    })

    it('returns 2 points when on vertical center (even canvas)', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      // 8x8 canvas, x=3 mirrors to 4 (different)
      // y=2 → mirror at 5
      const points = store.getSymmetryPoints(3, 2, 8, 8)
      expect(points).toHaveLength(4)
      expect(points).toContainEqual({ x: 3, y: 2 })
      expect(points).toContainEqual({ x: 4, y: 2 })
      expect(points).toContainEqual({ x: 3, y: 5 })
      expect(points).toContainEqual({ x: 4, y: 5 })
    })

    it('handles corner case with all 4 points valid', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      // (0, 0) on 8x8:
      // x: 0 → 7, y: 0 → 7
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
      // 1px wide: x=0 mirrors to (1-1)-0 = 0 (same point)
      const points = store.getSymmetryPoints(0, 3, 1, 8)
      expect(points).toHaveLength(1)
      expect(points[0]).toEqual({ x: 0, y: 3 })
    })

    it('handles 1-pixel tall canvas (no horizontal symmetry possible)', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      // 1px tall: y=0 mirrors to (1-1)-0 = 0 (same point)
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
      // 2x2 canvas:
      // (0, 0) → x: 0→1, y: 0→1
      const points = store.getSymmetryPoints(0, 0, 2, 2)
      expect(points).toHaveLength(4)
      expect(points).toContainEqual({ x: 0, y: 0 })
      expect(points).toContainEqual({ x: 1, y: 0 })
      expect(points).toContainEqual({ x: 0, y: 1 })
      expect(points).toContainEqual({ x: 1, y: 1 })
    })

    it('handles negative coordinates (out of bounds)', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      store.symmetryVertical = true
      // Mirrors would also be out of bounds
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
      // 8x8 canvas
      const topLeft = store.getSymmetryPoints(0, 0, 8, 8)
      expect(topLeft).toHaveLength(2)
      expect(topLeft).toContainEqual({ x: 0, y: 0 })
      expect(topLeft).toContainEqual({ x: 7, y: 0 })

      const topRight = store.getSymmetryPoints(7, 0, 8, 8)
      expect(topRight).toHaveLength(2)
      expect(topRight).toContainEqual({ x: 7, y: 0 })
      expect(topRight).toContainEqual({ x: 0, y: 0 })

      const bottomLeft = store.getSymmetryPoints(0, 7, 8, 8)
      expect(bottomLeft).toHaveLength(2)
      expect(bottomLeft).toContainEqual({ x: 0, y: 7 })
      expect(bottomLeft).toContainEqual({ x: 7, y: 7 })

      const bottomRight = store.getSymmetryPoints(7, 7, 8, 8)
      expect(bottomRight).toHaveLength(2)
      expect(bottomRight).toContainEqual({ x: 7, y: 7 })
      expect(bottomRight).toContainEqual({ x: 0, y: 7 })
    })

    it('handles all canvas corners with horizontal symmetry', () => {
      const store = useToolStore()
      store.symmetryHorizontal = true
      // 8x8 canvas
      const topLeft = store.getSymmetryPoints(0, 0, 8, 8)
      expect(topLeft).toHaveLength(2)
      expect(topLeft).toContainEqual({ x: 0, y: 0 })
      expect(topLeft).toContainEqual({ x: 0, y: 7 })

      const topRight = store.getSymmetryPoints(7, 0, 8, 8)
      expect(topRight).toHaveLength(2)
      expect(topRight).toContainEqual({ x: 7, y: 0 })
      expect(topRight).toContainEqual({ x: 7, y: 7 })

      const bottomLeft = store.getSymmetryPoints(0, 7, 8, 8)
      expect(bottomLeft).toHaveLength(2)
      expect(bottomLeft).toContainEqual({ x: 0, y: 7 })
      expect(bottomLeft).toContainEqual({ x: 0, y: 0 })

      const bottomRight = store.getSymmetryPoints(7, 7, 8, 8)
      expect(bottomRight).toHaveLength(2)
      expect(bottomRight).toContainEqual({ x: 7, y: 7 })
      expect(bottomRight).toContainEqual({ x: 7, y: 0 })
    })
  })

  describe('setBrushSize', () => {
    it('sets brush size to valid value', () => {
      const store = useToolStore()
      store.setBrushSize(5)
      expect(store.brushSize).toBe(5)
    })

    it('clamps brush size to minimum of 1', () => {
      const store = useToolStore()
      store.setBrushSize(0)
      expect(store.brushSize).toBe(1)
      store.setBrushSize(-5)
      expect(store.brushSize).toBe(1)
    })

    it('clamps brush size to maximum of 16', () => {
      const store = useToolStore()
      store.setBrushSize(20)
      expect(store.brushSize).toBe(16)
      store.setBrushSize(100)
      expect(store.brushSize).toBe(16)
    })

    it('rounds decimal values', () => {
      const store = useToolStore()
      store.setBrushSize(3.7)
      expect(store.brushSize).toBe(4)
      store.setBrushSize(3.2)
      expect(store.brushSize).toBe(3)
    })
  })

  describe('setBrushShape', () => {
    it('sets brush shape to circle', () => {
      const store = useToolStore()
      store.setBrushShape('circle')
      expect(store.brushShape).toBe('circle')
    })

    it('sets brush shape to square', () => {
      const store = useToolStore()
      store.setBrushShape('circle')
      store.setBrushShape('square')
      expect(store.brushShape).toBe('square')
    })
  })

  describe('increaseBrushSize', () => {
    it('increases brush size by 1', () => {
      const store = useToolStore()
      store.setBrushSize(5)
      store.increaseBrushSize()
      expect(store.brushSize).toBe(6)
    })

    it('does not exceed maximum of 16', () => {
      const store = useToolStore()
      store.setBrushSize(16)
      store.increaseBrushSize()
      expect(store.brushSize).toBe(16)
    })
  })

  describe('decreaseBrushSize', () => {
    it('decreases brush size by 1', () => {
      const store = useToolStore()
      store.setBrushSize(5)
      store.decreaseBrushSize()
      expect(store.brushSize).toBe(4)
    })

    it('does not go below minimum of 1', () => {
      const store = useToolStore()
      store.setBrushSize(1)
      store.decreaseBrushSize()
      expect(store.brushSize).toBe(1)
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
      store.setBlendMode('blend')
      store.$reset()
      expect(store.activeTool).toBe('pencil')
      expect(store.shapeType).toBe('line')
      expect(store.shapeFilled).toBe(false)
      expect(store.shapeConstrain).toBe(false)
      expect(store.blendMode).toBe('overwrite')
    })

    it('resets brush settings to defaults', () => {
      const store = useToolStore()
      store.setBrushSize(8)
      store.setBrushShape('circle')
      store.$reset()
      expect(store.brushSize).toBe(1)
      expect(store.brushShape).toBe('square')
    })
  })
})
