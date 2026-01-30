import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RGBA, BlendMode } from '@/types'

export const useCanvasStore = defineStore('canvas', () => {
  const width = ref(32)
  const height = ref(32)
  const pixels = ref<Uint8ClampedArray>(new Uint8ClampedArray(32 * 32 * 4))
  const version = ref(0)

  function createNew(w: number, h: number) {
    width.value = w
    height.value = h
    pixels.value = new Uint8ClampedArray(w * h * 4)
    version.value++
  }

  function getPixel(x: number, y: number): RGBA {
    if (x < 0 || x >= width.value || y < 0 || y >= height.value) {
      return { r: 0, g: 0, b: 0, a: 0 }
    }
    const i = (y * width.value + x) * 4
    return {
      r: pixels.value[i]!,
      g: pixels.value[i + 1]!,
      b: pixels.value[i + 2]!,
      a: pixels.value[i + 3]!,
    }
  }

  function setPixel(x: number, y: number, color: RGBA, blendMode: BlendMode = 'overwrite') {
    if (x < 0 || x >= width.value || y < 0 || y >= height.value) return
    const i = (y * width.value + x) * 4

    if (blendMode === 'blend') {
      // Alpha blending: blend source color over destination
      const dstR = pixels.value[i]!
      const dstG = pixels.value[i + 1]!
      const dstB = pixels.value[i + 2]!
      const dstA = pixels.value[i + 3]!

      const srcA = color.a
      const invSrcA = 255 - srcA

      // Blend each channel: result = (src * src_a + dst * (255 - src_a)) / 255
      pixels.value[i] = Math.round((color.r * srcA + dstR * invSrcA) / 255)
      pixels.value[i + 1] = Math.round((color.g * srcA + dstG * invSrcA) / 255)
      pixels.value[i + 2] = Math.round((color.b * srcA + dstB * invSrcA) / 255)
      // Alpha: result_a = src_a + dst_a - (src_a * dst_a / 255)
      pixels.value[i + 3] = Math.round(srcA + dstA - (srcA * dstA / 255))
    } else {
      // Overwrite mode (default behavior)
      pixels.value[i] = color.r
      pixels.value[i + 1] = color.g
      pixels.value[i + 2] = color.b
      pixels.value[i + 3] = color.a
    }
  }

  function bumpVersion() {
    version.value++
  }

  function getSnapshot(): Uint8ClampedArray {
    return new Uint8ClampedArray(pixels.value)
  }

  function restoreSnapshot(snapshot: Uint8ClampedArray) {
    pixels.value = new Uint8ClampedArray(snapshot)
    version.value++
  }

  function setImageData(data: Uint8ClampedArray, w: number, h: number) {
    width.value = w
    height.value = h
    pixels.value = new Uint8ClampedArray(data)
    version.value++
  }

  return {
    width,
    height,
    pixels,
    version,
    createNew,
    getPixel,
    setPixel,
    bumpVersion,
    getSnapshot,
    restoreSnapshot,
    setImageData,
  }
})
