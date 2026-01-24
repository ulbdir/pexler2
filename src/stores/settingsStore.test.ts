import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSettingsStore } from './settingsStore'

describe('settingsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('resetView', () => {
    it('calculates zoom to fit canvas in container with 0.8 scale', () => {
      const store = useSettingsStore()
      // 32x32 canvas in 640x480 container
      // fitZoom = min(640/32, 480/32) * 0.8 = 15 * 0.8 = 12
      store.resetView(32, 32, 640, 480)
      expect(store.zoom).toBe(12)
    })

    it('centers the canvas in the container', () => {
      const store = useSettingsStore()
      store.resetView(32, 32, 640, 480)
      // panX = (640 - 32*12) / 2 = (640 - 384) / 2 = 128
      expect(store.panX).toBe(128)
      // panY = (480 - 32*12) / 2 = (480 - 384) / 2 = 48
      expect(store.panY).toBe(48)
    })

    it('clamps zoom to minimum of 1', () => {
      const store = useSettingsStore()
      // Large canvas in small container: fitZoom < 1
      store.resetView(1000, 1000, 100, 100)
      expect(store.zoom).toBe(1)
    })

    it('clamps zoom to maximum of 64', () => {
      const store = useSettingsStore()
      // Tiny canvas in large container: fitZoom > 64
      store.resetView(1, 1, 5000, 5000)
      expect(store.zoom).toBe(64)
    })

    it('handles landscape canvas (wider than tall)', () => {
      const store = useSettingsStore()
      // 64x16 canvas in 640x480 container
      // fitZoom = min(640/64, 480/16) * 0.8 = min(10, 30) * 0.8 = 8
      store.resetView(64, 16, 640, 480)
      expect(store.zoom).toBe(8)
    })

    it('handles portrait canvas (taller than wide)', () => {
      const store = useSettingsStore()
      // 16x64 canvas in 640x480 container
      // fitZoom = min(640/16, 480/64) * 0.8 = min(40, 7.5) * 0.8 = 6
      store.resetView(16, 64, 640, 480)
      expect(store.zoom).toBe(6)
    })

    it('rounds zoom to nearest integer', () => {
      const store = useSettingsStore()
      // 32x32 in 500x500: fitZoom = (500/32)*0.8 = 12.5 → rounds to 13
      store.resetView(32, 32, 500, 500)
      expect(store.zoom).toBe(Math.round((500 / 32) * 0.8))
    })
  })
})
