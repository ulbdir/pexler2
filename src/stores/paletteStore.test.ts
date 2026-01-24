import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePaletteStore } from './paletteStore'

describe('paletteStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('has 36 default colors', () => {
      const store = usePaletteStore()
      expect(store.colors.length).toBe(36)
    })

    it('selectedColor defaults to black', () => {
      const store = usePaletteStore()
      expect(store.selectedColor).toEqual({ r: 0, g: 0, b: 0, a: 255 })
    })
  })

  describe('addColor', () => {
    it('adds a new color to the palette', () => {
      const store = usePaletteStore()
      store.clearPalette()
      store.addColor({ r: 1, g: 2, b: 3, a: 255 })
      expect(store.colors.length).toBe(1)
      expect(store.colors[0]).toEqual({ r: 1, g: 2, b: 3, a: 255 })
    })

    it('does not add a duplicate color', () => {
      const store = usePaletteStore()
      store.clearPalette()
      store.addColor({ r: 100, g: 100, b: 100, a: 255 })
      store.addColor({ r: 100, g: 100, b: 100, a: 255 })
      expect(store.colors.length).toBe(1)
    })

    it('treats different alpha as different colors', () => {
      const store = usePaletteStore()
      store.clearPalette()
      store.addColor({ r: 100, g: 100, b: 100, a: 255 })
      store.addColor({ r: 100, g: 100, b: 100, a: 128 })
      expect(store.colors.length).toBe(2)
    })

    it('stores a copy, not a reference', () => {
      const store = usePaletteStore()
      store.clearPalette()
      const color = { r: 50, g: 60, b: 70, a: 255 }
      store.addColor(color)
      color.r = 200
      expect(store.colors[0]!.r).toBe(50)
    })
  })

  describe('removeColor', () => {
    it('removes color at the given index', () => {
      const store = usePaletteStore()
      store.clearPalette()
      store.addColor({ r: 1, g: 0, b: 0, a: 255 })
      store.addColor({ r: 2, g: 0, b: 0, a: 255 })
      store.addColor({ r: 3, g: 0, b: 0, a: 255 })

      store.removeColor(1)
      expect(store.colors.length).toBe(2)
      expect(store.colors[0]!.r).toBe(1)
      expect(store.colors[1]!.r).toBe(3)
    })
  })

  describe('clearPalette', () => {
    it('empties the color array', () => {
      const store = usePaletteStore()
      expect(store.colors.length).toBe(36)
      store.clearPalette()
      expect(store.colors.length).toBe(0)
    })
  })

  describe('resetPalette', () => {
    it('restores the 36 default colors', () => {
      const store = usePaletteStore()
      store.clearPalette()
      store.addColor({ r: 1, g: 2, b: 3, a: 255 })
      expect(store.colors.length).toBe(1)

      store.resetPalette()
      expect(store.colors.length).toBe(36)
    })
  })

  describe('extractFromImage', () => {
    it('extracts unique non-transparent colors', () => {
      const store = usePaletteStore()
      store.clearPalette()

      // 2x2 image: red, green, red, transparent
      const pixels = new Uint8ClampedArray(2 * 2 * 4)
      // Pixel 0: red
      pixels[0] = 255; pixels[1] = 0; pixels[2] = 0; pixels[3] = 255
      // Pixel 1: green
      pixels[4] = 0; pixels[5] = 255; pixels[6] = 0; pixels[7] = 255
      // Pixel 2: red (duplicate)
      pixels[8] = 255; pixels[9] = 0; pixels[10] = 0; pixels[11] = 255
      // Pixel 3: transparent (should be skipped)
      pixels[12] = 0; pixels[13] = 0; pixels[14] = 0; pixels[15] = 0

      store.extractFromImage(pixels, 2, 2)
      expect(store.colors.length).toBe(2)
    })

    it('skips all-transparent images', () => {
      const store = usePaletteStore()
      store.clearPalette()

      const pixels = new Uint8ClampedArray(4 * 4 * 4) // all zeros
      store.extractFromImage(pixels, 4, 4)
      expect(store.colors.length).toBe(0)
    })

    it('does not add colors already in palette', () => {
      const store = usePaletteStore()
      store.clearPalette()
      store.addColor({ r: 255, g: 0, b: 0, a: 255 })

      const pixels = new Uint8ClampedArray(1 * 1 * 4)
      pixels[0] = 255; pixels[1] = 0; pixels[2] = 0; pixels[3] = 255

      store.extractFromImage(pixels, 1, 1)
      expect(store.colors.length).toBe(1)
    })
  })
})
