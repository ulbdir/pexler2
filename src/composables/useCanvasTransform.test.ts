import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCanvasStore } from '@/stores/canvasStore'
import { useHistoryStore } from '@/stores/historyStore'
import { useCanvasTransform } from './useCanvasTransform'

describe('useCanvasTransform', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function setPixelRGBA(
    pixels: Uint8ClampedArray,
    width: number,
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    a: number
  ) {
    const i = (y * width + x) * 4
    pixels[i] = r
    pixels[i + 1] = g
    pixels[i + 2] = b
    pixels[i + 3] = a
  }

  function getPixelRGBA(
    pixels: Uint8ClampedArray,
    width: number,
    x: number,
    y: number
  ): [number, number, number, number] {
    const i = (y * width + x) * 4
    return [pixels[i]!, pixels[i + 1]!, pixels[i + 2]!, pixels[i + 3]!]
  }

  describe('flipHorizontal', () => {
    it('swaps pixels left to right', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(3, 2)

      // Set up a pattern:
      // Row 0: [R, G, B]
      // Row 1: [C, M, Y]
      setPixelRGBA(canvasStore.pixels, 3, 0, 0, 255, 0, 0, 255) // Red
      setPixelRGBA(canvasStore.pixels, 3, 1, 0, 0, 255, 0, 255) // Green
      setPixelRGBA(canvasStore.pixels, 3, 2, 0, 0, 0, 255, 255) // Blue
      setPixelRGBA(canvasStore.pixels, 3, 0, 1, 0, 255, 255, 255) // Cyan
      setPixelRGBA(canvasStore.pixels, 3, 1, 1, 255, 0, 255, 255) // Magenta
      setPixelRGBA(canvasStore.pixels, 3, 2, 1, 255, 255, 0, 255) // Yellow

      const { flipHorizontal } = useCanvasTransform()
      flipHorizontal()

      // Expected after flip:
      // Row 0: [B, G, R]
      // Row 1: [Y, M, C]
      expect(getPixelRGBA(canvasStore.pixels, 3, 0, 0)).toEqual([0, 0, 255, 255]) // Blue
      expect(getPixelRGBA(canvasStore.pixels, 3, 1, 0)).toEqual([0, 255, 0, 255]) // Green (middle stays)
      expect(getPixelRGBA(canvasStore.pixels, 3, 2, 0)).toEqual([255, 0, 0, 255]) // Red
      expect(getPixelRGBA(canvasStore.pixels, 3, 0, 1)).toEqual([255, 255, 0, 255]) // Yellow
      expect(getPixelRGBA(canvasStore.pixels, 3, 1, 1)).toEqual([255, 0, 255, 255]) // Magenta (middle stays)
      expect(getPixelRGBA(canvasStore.pixels, 3, 2, 1)).toEqual([0, 255, 255, 255]) // Cyan
    })

    it('pushes history state', () => {
      const canvasStore = useCanvasStore()
      const historyStore = useHistoryStore()
      canvasStore.createNew(2, 2)

      const { flipHorizontal } = useCanvasTransform()
      flipHorizontal()

      expect(historyStore.undoStack.length).toBe(1)
    })

    it('handles single column canvas', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(1, 3)
      setPixelRGBA(canvasStore.pixels, 1, 0, 0, 255, 0, 0, 255)
      setPixelRGBA(canvasStore.pixels, 1, 0, 1, 0, 255, 0, 255)
      setPixelRGBA(canvasStore.pixels, 1, 0, 2, 0, 0, 255, 255)

      const { flipHorizontal } = useCanvasTransform()
      flipHorizontal()

      // Single column should remain unchanged
      expect(getPixelRGBA(canvasStore.pixels, 1, 0, 0)).toEqual([255, 0, 0, 255])
      expect(getPixelRGBA(canvasStore.pixels, 1, 0, 1)).toEqual([0, 255, 0, 255])
      expect(getPixelRGBA(canvasStore.pixels, 1, 0, 2)).toEqual([0, 0, 255, 255])
    })
  })

  describe('flipVertical', () => {
    it('swaps pixels top to bottom', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(2, 3)

      // Set up a pattern:
      // Row 0: [R, G]
      // Row 1: [B, C]
      // Row 2: [M, Y]
      setPixelRGBA(canvasStore.pixels, 2, 0, 0, 255, 0, 0, 255) // Red
      setPixelRGBA(canvasStore.pixels, 2, 1, 0, 0, 255, 0, 255) // Green
      setPixelRGBA(canvasStore.pixels, 2, 0, 1, 0, 0, 255, 255) // Blue
      setPixelRGBA(canvasStore.pixels, 2, 1, 1, 0, 255, 255, 255) // Cyan
      setPixelRGBA(canvasStore.pixels, 2, 0, 2, 255, 0, 255, 255) // Magenta
      setPixelRGBA(canvasStore.pixels, 2, 1, 2, 255, 255, 0, 255) // Yellow

      const { flipVertical } = useCanvasTransform()
      flipVertical()

      // Expected after flip:
      // Row 0: [M, Y]
      // Row 1: [B, C] (middle stays)
      // Row 2: [R, G]
      expect(getPixelRGBA(canvasStore.pixels, 2, 0, 0)).toEqual([255, 0, 255, 255]) // Magenta
      expect(getPixelRGBA(canvasStore.pixels, 2, 1, 0)).toEqual([255, 255, 0, 255]) // Yellow
      expect(getPixelRGBA(canvasStore.pixels, 2, 0, 1)).toEqual([0, 0, 255, 255]) // Blue (middle stays)
      expect(getPixelRGBA(canvasStore.pixels, 2, 1, 1)).toEqual([0, 255, 255, 255]) // Cyan (middle stays)
      expect(getPixelRGBA(canvasStore.pixels, 2, 0, 2)).toEqual([255, 0, 0, 255]) // Red
      expect(getPixelRGBA(canvasStore.pixels, 2, 1, 2)).toEqual([0, 255, 0, 255]) // Green
    })

    it('pushes history state', () => {
      const canvasStore = useCanvasStore()
      const historyStore = useHistoryStore()
      canvasStore.createNew(2, 2)

      const { flipVertical } = useCanvasTransform()
      flipVertical()

      expect(historyStore.undoStack.length).toBe(1)
    })

    it('handles single row canvas', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(3, 1)
      setPixelRGBA(canvasStore.pixels, 3, 0, 0, 255, 0, 0, 255)
      setPixelRGBA(canvasStore.pixels, 3, 1, 0, 0, 255, 0, 255)
      setPixelRGBA(canvasStore.pixels, 3, 2, 0, 0, 0, 255, 255)

      const { flipVertical } = useCanvasTransform()
      flipVertical()

      // Single row should remain unchanged
      expect(getPixelRGBA(canvasStore.pixels, 3, 0, 0)).toEqual([255, 0, 0, 255])
      expect(getPixelRGBA(canvasStore.pixels, 3, 1, 0)).toEqual([0, 255, 0, 255])
      expect(getPixelRGBA(canvasStore.pixels, 3, 2, 0)).toEqual([0, 0, 255, 255])
    })
  })

  describe('rotate90', () => {
    it('rotates canvas 90 degrees clockwise', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(3, 2)

      // Set up a pattern (3 wide x 2 tall):
      // [R, G, B]
      // [C, M, Y]
      setPixelRGBA(canvasStore.pixels, 3, 0, 0, 255, 0, 0, 255) // Red
      setPixelRGBA(canvasStore.pixels, 3, 1, 0, 0, 255, 0, 255) // Green
      setPixelRGBA(canvasStore.pixels, 3, 2, 0, 0, 0, 255, 255) // Blue
      setPixelRGBA(canvasStore.pixels, 3, 0, 1, 0, 255, 255, 255) // Cyan
      setPixelRGBA(canvasStore.pixels, 3, 1, 1, 255, 0, 255, 255) // Magenta
      setPixelRGBA(canvasStore.pixels, 3, 2, 1, 255, 255, 0, 255) // Yellow

      const { rotate90 } = useCanvasTransform()
      rotate90()

      // Expected after 90° CW rotation (2 wide x 3 tall):
      // [C, R]
      // [M, G]
      // [Y, B]
      expect(canvasStore.width).toBe(2)
      expect(canvasStore.height).toBe(3)
      expect(getPixelRGBA(canvasStore.pixels, 2, 0, 0)).toEqual([0, 255, 255, 255]) // Cyan
      expect(getPixelRGBA(canvasStore.pixels, 2, 1, 0)).toEqual([255, 0, 0, 255]) // Red
      expect(getPixelRGBA(canvasStore.pixels, 2, 0, 1)).toEqual([255, 0, 255, 255]) // Magenta
      expect(getPixelRGBA(canvasStore.pixels, 2, 1, 1)).toEqual([0, 255, 0, 255]) // Green
      expect(getPixelRGBA(canvasStore.pixels, 2, 0, 2)).toEqual([255, 255, 0, 255]) // Yellow
      expect(getPixelRGBA(canvasStore.pixels, 2, 1, 2)).toEqual([0, 0, 255, 255]) // Blue
    })

    it('pushes history state', () => {
      const canvasStore = useCanvasStore()
      const historyStore = useHistoryStore()
      canvasStore.createNew(2, 2)

      const { rotate90 } = useCanvasTransform()
      rotate90()

      expect(historyStore.undoStack.length).toBe(1)
    })

    it('swaps dimensions', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(4, 2)

      const { rotate90 } = useCanvasTransform()
      rotate90()

      expect(canvasStore.width).toBe(2)
      expect(canvasStore.height).toBe(4)
    })
  })

  describe('rotate180', () => {
    it('rotates canvas 180 degrees', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(3, 2)

      // Set up a pattern:
      // [R, G, B]
      // [C, M, Y]
      setPixelRGBA(canvasStore.pixels, 3, 0, 0, 255, 0, 0, 255) // Red
      setPixelRGBA(canvasStore.pixels, 3, 1, 0, 0, 255, 0, 255) // Green
      setPixelRGBA(canvasStore.pixels, 3, 2, 0, 0, 0, 255, 255) // Blue
      setPixelRGBA(canvasStore.pixels, 3, 0, 1, 0, 255, 255, 255) // Cyan
      setPixelRGBA(canvasStore.pixels, 3, 1, 1, 255, 0, 255, 255) // Magenta
      setPixelRGBA(canvasStore.pixels, 3, 2, 1, 255, 255, 0, 255) // Yellow

      const { rotate180 } = useCanvasTransform()
      rotate180()

      // Expected after 180° rotation:
      // [Y, M, C]
      // [B, G, R]
      expect(canvasStore.width).toBe(3)
      expect(canvasStore.height).toBe(2)
      expect(getPixelRGBA(canvasStore.pixels, 3, 0, 0)).toEqual([255, 255, 0, 255]) // Yellow
      expect(getPixelRGBA(canvasStore.pixels, 3, 1, 0)).toEqual([255, 0, 255, 255]) // Magenta
      expect(getPixelRGBA(canvasStore.pixels, 3, 2, 0)).toEqual([0, 255, 255, 255]) // Cyan
      expect(getPixelRGBA(canvasStore.pixels, 3, 0, 1)).toEqual([0, 0, 255, 255]) // Blue
      expect(getPixelRGBA(canvasStore.pixels, 3, 1, 1)).toEqual([0, 255, 0, 255]) // Green
      expect(getPixelRGBA(canvasStore.pixels, 3, 2, 1)).toEqual([255, 0, 0, 255]) // Red
    })

    it('pushes history state', () => {
      const canvasStore = useCanvasStore()
      const historyStore = useHistoryStore()
      canvasStore.createNew(2, 2)

      const { rotate180 } = useCanvasTransform()
      rotate180()

      expect(historyStore.undoStack.length).toBe(1)
    })

    it('preserves dimensions', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(4, 2)

      const { rotate180 } = useCanvasTransform()
      rotate180()

      expect(canvasStore.width).toBe(4)
      expect(canvasStore.height).toBe(2)
    })
  })

  describe('rotate270', () => {
    it('rotates canvas 270 degrees clockwise (90 counter-clockwise)', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(3, 2)

      // Set up a pattern (3 wide x 2 tall):
      // [R, G, B]
      // [C, M, Y]
      setPixelRGBA(canvasStore.pixels, 3, 0, 0, 255, 0, 0, 255) // Red
      setPixelRGBA(canvasStore.pixels, 3, 1, 0, 0, 255, 0, 255) // Green
      setPixelRGBA(canvasStore.pixels, 3, 2, 0, 0, 0, 255, 255) // Blue
      setPixelRGBA(canvasStore.pixels, 3, 0, 1, 0, 255, 255, 255) // Cyan
      setPixelRGBA(canvasStore.pixels, 3, 1, 1, 255, 0, 255, 255) // Magenta
      setPixelRGBA(canvasStore.pixels, 3, 2, 1, 255, 255, 0, 255) // Yellow

      const { rotate270 } = useCanvasTransform()
      rotate270()

      // Expected after 270° CW rotation (2 wide x 3 tall):
      // [B, Y]
      // [G, M]
      // [R, C]
      expect(canvasStore.width).toBe(2)
      expect(canvasStore.height).toBe(3)
      expect(getPixelRGBA(canvasStore.pixels, 2, 0, 0)).toEqual([0, 0, 255, 255]) // Blue
      expect(getPixelRGBA(canvasStore.pixels, 2, 1, 0)).toEqual([255, 255, 0, 255]) // Yellow
      expect(getPixelRGBA(canvasStore.pixels, 2, 0, 1)).toEqual([0, 255, 0, 255]) // Green
      expect(getPixelRGBA(canvasStore.pixels, 2, 1, 1)).toEqual([255, 0, 255, 255]) // Magenta
      expect(getPixelRGBA(canvasStore.pixels, 2, 0, 2)).toEqual([255, 0, 0, 255]) // Red
      expect(getPixelRGBA(canvasStore.pixels, 2, 1, 2)).toEqual([0, 255, 255, 255]) // Cyan
    })

    it('pushes history state', () => {
      const canvasStore = useCanvasStore()
      const historyStore = useHistoryStore()
      canvasStore.createNew(2, 2)

      const { rotate270 } = useCanvasTransform()
      rotate270()

      expect(historyStore.undoStack.length).toBe(1)
    })

    it('swaps dimensions', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(4, 2)

      const { rotate270 } = useCanvasTransform()
      rotate270()

      expect(canvasStore.width).toBe(2)
      expect(canvasStore.height).toBe(4)
    })
  })

  describe('rotation consistency', () => {
    it('four 90° rotations returns to original', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(3, 2)

      setPixelRGBA(canvasStore.pixels, 3, 0, 0, 255, 0, 0, 255)
      setPixelRGBA(canvasStore.pixels, 3, 2, 1, 0, 255, 0, 255)

      const original = new Uint8ClampedArray(canvasStore.pixels)

      const { rotate90 } = useCanvasTransform()
      rotate90()
      rotate90()
      rotate90()
      rotate90()

      expect(canvasStore.width).toBe(3)
      expect(canvasStore.height).toBe(2)
      expect(canvasStore.pixels).toEqual(original)
    })

    it('two 180° rotations returns to original', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(3, 2)

      setPixelRGBA(canvasStore.pixels, 3, 0, 0, 255, 0, 0, 255)
      setPixelRGBA(canvasStore.pixels, 3, 2, 1, 0, 255, 0, 255)

      const original = new Uint8ClampedArray(canvasStore.pixels)

      const { rotate180 } = useCanvasTransform()
      rotate180()
      rotate180()

      expect(canvasStore.pixels).toEqual(original)
    })

    it('rotate90 + rotate270 returns to original', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(3, 2)

      setPixelRGBA(canvasStore.pixels, 3, 0, 0, 255, 0, 0, 255)
      setPixelRGBA(canvasStore.pixels, 3, 2, 1, 0, 255, 0, 255)

      const original = new Uint8ClampedArray(canvasStore.pixels)

      const { rotate90, rotate270 } = useCanvasTransform()
      rotate90()
      rotate270()

      expect(canvasStore.width).toBe(3)
      expect(canvasStore.height).toBe(2)
      expect(canvasStore.pixels).toEqual(original)
    })
  })

  describe('flip consistency', () => {
    it('double horizontal flip returns to original', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(3, 2)

      setPixelRGBA(canvasStore.pixels, 3, 0, 0, 255, 0, 0, 255)
      setPixelRGBA(canvasStore.pixels, 3, 2, 1, 0, 255, 0, 255)

      const original = new Uint8ClampedArray(canvasStore.pixels)

      const { flipHorizontal } = useCanvasTransform()
      flipHorizontal()
      flipHorizontal()

      expect(canvasStore.pixels).toEqual(original)
    })

    it('double vertical flip returns to original', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(3, 2)

      setPixelRGBA(canvasStore.pixels, 3, 0, 0, 255, 0, 0, 255)
      setPixelRGBA(canvasStore.pixels, 3, 2, 1, 0, 255, 0, 255)

      const original = new Uint8ClampedArray(canvasStore.pixels)

      const { flipVertical } = useCanvasTransform()
      flipVertical()
      flipVertical()

      expect(canvasStore.pixels).toEqual(original)
    })

    it('horizontal + vertical flip equals 180° rotation', () => {
      const canvasStore = useCanvasStore()
      canvasStore.createNew(3, 2)

      setPixelRGBA(canvasStore.pixels, 3, 0, 0, 255, 0, 0, 255)
      setPixelRGBA(canvasStore.pixels, 3, 1, 0, 0, 255, 0, 255)
      setPixelRGBA(canvasStore.pixels, 3, 2, 1, 0, 0, 255, 255)

      const { flipHorizontal, flipVertical } = useCanvasTransform()
      flipHorizontal()
      flipVertical()

      const flippedPixels = new Uint8ClampedArray(canvasStore.pixels)

      // Reset and do 180° rotation
      canvasStore.createNew(3, 2)
      setPixelRGBA(canvasStore.pixels, 3, 0, 0, 255, 0, 0, 255)
      setPixelRGBA(canvasStore.pixels, 3, 1, 0, 0, 255, 0, 255)
      setPixelRGBA(canvasStore.pixels, 3, 2, 1, 0, 0, 255, 255)

      const { rotate180 } = useCanvasTransform()
      rotate180()

      expect(canvasStore.pixels).toEqual(flippedPixels)
    })
  })
})
