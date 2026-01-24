import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCanvasStore } from './canvasStore'

describe('canvasStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('createNew', () => {
    it('sets dimensions and allocates pixel array', () => {
      const store = useCanvasStore()
      store.createNew(16, 8)

      expect(store.width).toBe(16)
      expect(store.height).toBe(8)
      expect(store.pixels.length).toBe(16 * 8 * 4)
    })

    it('initializes all pixels to transparent', () => {
      const store = useCanvasStore()
      store.createNew(4, 4)

      for (let i = 0; i < store.pixels.length; i++) {
        expect(store.pixels[i]).toBe(0)
      }
    })

    it('increments version', () => {
      const store = useCanvasStore()
      const v = store.version
      store.createNew(4, 4)
      expect(store.version).toBe(v + 1)
    })
  })

  describe('getPixel', () => {
    it('returns RGBA at the given coordinates', () => {
      const store = useCanvasStore()
      store.createNew(4, 4)
      // Manually set pixel at (1, 2)
      const i = (2 * 4 + 1) * 4
      store.pixels[i] = 100
      store.pixels[i + 1] = 150
      store.pixels[i + 2] = 200
      store.pixels[i + 3] = 255

      expect(store.getPixel(1, 2)).toEqual({ r: 100, g: 150, b: 200, a: 255 })
    })

    it('returns transparent for out-of-bounds (negative x)', () => {
      const store = useCanvasStore()
      store.createNew(4, 4)
      expect(store.getPixel(-1, 0)).toEqual({ r: 0, g: 0, b: 0, a: 0 })
    })

    it('returns transparent for out-of-bounds (x >= width)', () => {
      const store = useCanvasStore()
      store.createNew(4, 4)
      expect(store.getPixel(4, 0)).toEqual({ r: 0, g: 0, b: 0, a: 0 })
    })

    it('returns transparent for out-of-bounds (negative y)', () => {
      const store = useCanvasStore()
      store.createNew(4, 4)
      expect(store.getPixel(0, -1)).toEqual({ r: 0, g: 0, b: 0, a: 0 })
    })

    it('returns transparent for out-of-bounds (y >= height)', () => {
      const store = useCanvasStore()
      store.createNew(4, 4)
      expect(store.getPixel(0, 4)).toEqual({ r: 0, g: 0, b: 0, a: 0 })
    })

    it('reads corners correctly', () => {
      const store = useCanvasStore()
      store.createNew(4, 4)
      const red = { r: 255, g: 0, b: 0, a: 255 }

      store.setPixel(0, 0, red)
      store.setPixel(3, 0, red)
      store.setPixel(0, 3, red)
      store.setPixel(3, 3, red)

      expect(store.getPixel(0, 0)).toEqual(red)
      expect(store.getPixel(3, 0)).toEqual(red)
      expect(store.getPixel(0, 3)).toEqual(red)
      expect(store.getPixel(3, 3)).toEqual(red)
    })
  })

  describe('setPixel', () => {
    it('writes RGBA to correct position', () => {
      const store = useCanvasStore()
      store.createNew(4, 4)
      store.setPixel(2, 1, { r: 10, g: 20, b: 30, a: 40 })

      const i = (1 * 4 + 2) * 4
      expect(store.pixels[i]).toBe(10)
      expect(store.pixels[i + 1]).toBe(20)
      expect(store.pixels[i + 2]).toBe(30)
      expect(store.pixels[i + 3]).toBe(40)
    })

    it('is a no-op for out-of-bounds coordinates', () => {
      const store = useCanvasStore()
      store.createNew(4, 4)
      const before = new Uint8ClampedArray(store.pixels)

      store.setPixel(-1, 0, { r: 255, g: 0, b: 0, a: 255 })
      store.setPixel(0, -1, { r: 255, g: 0, b: 0, a: 255 })
      store.setPixel(4, 0, { r: 255, g: 0, b: 0, a: 255 })
      store.setPixel(0, 4, { r: 255, g: 0, b: 0, a: 255 })

      expect(store.pixels).toEqual(before)
    })
  })

  describe('getSnapshot / restoreSnapshot', () => {
    it('getSnapshot returns an independent copy', () => {
      const store = useCanvasStore()
      store.createNew(2, 2)
      store.setPixel(0, 0, { r: 255, g: 0, b: 0, a: 255 })

      const snapshot = store.getSnapshot()
      store.setPixel(0, 0, { r: 0, g: 255, b: 0, a: 255 })

      // Snapshot should still have the red pixel
      expect(snapshot[0]).toBe(255)
      expect(snapshot[1]).toBe(0)
    })

    it('restoreSnapshot overwrites pixels and bumps version', () => {
      const store = useCanvasStore()
      store.createNew(2, 2)
      store.setPixel(0, 0, { r: 255, g: 0, b: 0, a: 255 })
      const snapshot = store.getSnapshot()

      store.setPixel(0, 0, { r: 0, g: 0, b: 0, a: 0 })
      const vBefore = store.version
      store.restoreSnapshot(snapshot)

      expect(store.getPixel(0, 0)).toEqual({ r: 255, g: 0, b: 0, a: 255 })
      expect(store.version).toBe(vBefore + 1)
    })
  })

  describe('setImageData', () => {
    it('replaces dimensions and pixel data', () => {
      const store = useCanvasStore()
      store.createNew(2, 2)

      const data = new Uint8ClampedArray(3 * 3 * 4)
      data[0] = 42
      store.setImageData(data, 3, 3)

      expect(store.width).toBe(3)
      expect(store.height).toBe(3)
      expect(store.pixels[0]).toBe(42)
      expect(store.pixels.length).toBe(3 * 3 * 4)
    })
  })

  describe('bumpVersion', () => {
    it('increments version counter', () => {
      const store = useCanvasStore()
      const v = store.version
      store.bumpVersion()
      expect(store.version).toBe(v + 1)
    })
  })
})
